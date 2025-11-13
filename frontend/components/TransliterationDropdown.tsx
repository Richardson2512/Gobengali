"use client";

import { useEffect, useState } from 'react';
import { transliterate, TransliterationSuggestion } from '@/lib/api';

interface Props {
  position: { top: number; left: number };
  word: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

export function TransliterationDropdown({ position, word, onSelect, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<TransliterationSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (word.length < 1) return;
      
      setLoading(true);
      try {
        // Check if word is Bengali or English
        const isBengali = /[\u0980-\u09FF]/.test(word);
        
        if (isBengali) {
          // For Bengali words being edited, show variations and common alternatives
          const bengaliSuggestions = getBengaliWordSuggestions(word);
          setSuggestions(bengaliSuggestions);
        } else {
          // For English words, get transliteration from API
          const result = await transliterate({ text: word, max_suggestions: 4 });
          setSuggestions(result.suggestions);
        }
      } catch (error) {
        console.error('Transliteration failed:', error);
        // Fallback suggestions
        setSuggestions([
          { text: word, score: 1.0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [word]);

  // Generate Bengali word suggestions based on the current word
  const getBengaliWordSuggestions = (bengaliWord: string): TransliterationSuggestion[] => {
    // Map Bengali phonetic patterns to possible English equivalents
    // Then transliterate those to get multiple Bengali options
    const bengaliToEnglishPatterns: { [key: string]: string[] } = {
      // Single characters and common starts
      'হ': ['ha', 'ho', 'he', 'hi'],
      'আ': ['a', 'aa', 'am', 'ar'],
      'ই': ['i', 'ee', 'in', 'is'],
      'ও': ['o', 'oh', 'ou', 'ow'],
      'ক': ['ka', 'ke', 'ko', 'ki'],
      'খ': ['kha', 'khe', 'kho'],
      'গ': ['ga', 'ge', 'go'],
      'চ': ['cha', 'che', 'cho'],
      'জ': ['ja', 'je', 'jo'],
      'ট': ['ta', 'te', 'to'],
      'ড': ['da', 'de', 'do'],
      'ত': ['ta', 'te', 'to', 'tha'],
      'দ': ['da', 'de', 'do', 'dha'],
      'ন': ['na', 'ne', 'no'],
      'প': ['pa', 'pe', 'po'],
      'ব': ['ba', 'be', 'bo', 'va'],
      'ম': ['ma', 'me', 'mo', 'mi'],
      'য': ['ya', 'ye', 'jo'],
      'র': ['ra', 're', 'ro', 'ri'],
      'ল': ['la', 'le', 'lo', 'li'],
      'শ': ['sha', 'she', 'sho'],
      'স': ['sa', 'se', 'so', 'si'],
      
      // Common word patterns
      'হও': ['how', 'ho', 'hao'],
      'হওও': ['how', 'howo'],
      'আর': ['are', 'ar', 'arr'],
      'আরএ': ['are', 'ara'],
      'ই': ['i', 'ee', 'you'],
      'ইউ': ['you', 'iu', 'yu'],
      'ওইল': ['will', 'oil', 'while', 'well'],
      'হ্যালো': ['hello', 'hallo'],
      'হাই': ['hi', 'high', 'hai'],
      'আমি': ['ami', 'me', 'i'],
      'তুমি': ['tumi', 'you'],
      'কেমন': ['kemon', 'how'],
      'ভালো': ['bhalo', 'good', 'valo'],
    };
    
    const suggestions: TransliterationSuggestion[] = [];
    
    // Get possible English words for this Bengali word
    let englishOptions: string[] = [];
    
    // Check for exact match
    if (bengaliToEnglishPatterns[bengaliWord]) {
      englishOptions = bengaliToEnglishPatterns[bengaliWord];
    } else {
      // For partial matches, find words that start with this
      Object.keys(bengaliToEnglishPatterns).forEach(key => {
        if (key.startsWith(bengaliWord) || bengaliWord.startsWith(key)) {
          englishOptions.push(...bengaliToEnglishPatterns[key]);
        }
      });
    }
    
    // Remove duplicates
    englishOptions = [...new Set(englishOptions)];
    
    // If we found English equivalents, show their transliterations
    if (englishOptions.length > 0) {
      // Show suggestions based on English equivalents
      const bengaliSuggestions = new Set<string>();
      
      englishOptions.slice(0, 4).forEach(eng => {
        // Generate common Bengali variations for this English word
        const variations = generateBengaliVariations(eng);
        variations.forEach(v => bengaliSuggestions.add(v));
      });
      
      // Convert to array and create suggestions
      Array.from(bengaliSuggestions).slice(0, 4).forEach((text, idx) => {
        suggestions.push({ text, score: 1.0 - (idx * 0.05) });
      });
    } else {
      // Fallback: show the current word
      suggestions.push({ text: bengaliWord, score: 1.0 });
    }
    
    return suggestions;
  };
  
  // Generate Bengali variations for an English word
  const generateBengaliVariations = (englishWord: string): string[] => {
    // This is a simplified version - you can expand this
    const variations: { [key: string]: string[] } = {
      'will': ['উইল', 'ওইল', 'উইল্', 'ওয়িল'],
      'how': ['হাও', 'হও', 'হাউ', 'হাওয়া'],
      'are': ['আর', 'আরে', 'আর্', 'এর'],
      'you': ['ইউ', 'ইউ', 'আপনি', 'তুমি'],
      'hello': ['হ্যালো', 'হেলো', 'হ্যাল্লো', 'হ্যাঁলো'],
      'hi': ['হাই', 'হাই', 'হি', 'হে'],
      'good': ['গুড', 'ভালো', 'ভাল', 'গুদ'],
      'well': ['ওয়েল', 'ভালো', 'উয়েল'],
      'oil': ['অয়েল', 'ওইল', 'তেল'],
      'while': ['ওয়াইল', 'হোয়াইল', 'যখন'],
      'i': ['আই', 'আমি', 'আই'],
      'me': ['মি', 'আমি', 'আমাকে'],
      'ami': ['আমি', 'অমি', 'আম'],
      'tumi': ['তুমি', 'তুম', 'তুমী'],
    };
    
    return variations[englishWord.toLowerCase()] || [englishWord];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex].text);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSelect, onClose]);

  if (loading) {
    return (
      <div 
        className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl px-4 py-3"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-gray-500">Loading suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div 
      className="fixed z-50 bg-white border-2 border-green-500 rounded-lg shadow-2xl min-w-[220px] overflow-hidden"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px` 
      }}
    >
      <div className="bg-green-50 px-3 py-1 border-b border-green-200">
        <p className="text-xs font-semibold text-green-800">Bengali Suggestions</p>
      </div>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`px-4 py-3 cursor-pointer transition-colors bengali-text text-lg border-b border-gray-100 last:border-b-0 ${
            index === selectedIndex 
              ? 'bg-green-100 text-green-900 font-semibold' 
              : 'hover:bg-gray-50 text-gray-900'
          }`}
          onClick={() => onSelect(suggestion.text)}
        >
          <span className="text-gray-400 text-sm mr-3 font-mono">{index + 1}.</span>
          <span>{suggestion.text}</span>
        </div>
      ))}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Space</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd> to select
        </p>
      </div>
    </div>
  );
}

