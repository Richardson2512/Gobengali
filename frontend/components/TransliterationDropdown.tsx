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
    const suggestions: TransliterationSuggestion[] = [];
    
    // Always include the current word first
    suggestions.push({ text: bengaliWord, score: 1.0 });
    
    // Common Bengali word patterns and variations
    const commonWords: { [key: string]: string[] } = {
      'হ': ['হ্যা', 'হও', 'হাও', 'হাই', 'হয়'],
      'হও': ['হও', 'হাও', 'হওয়া', 'হওয়ার'],
      'হওও': ['হওও', 'হাওয়া', 'হাও'],
      'আ': ['আমি', 'আর', 'আছে', 'আপনি'],
      'আর': ['আর', 'আরে', 'আরও', 'আরএ'],
      'ই': ['ই', 'ইস', 'ইউ', 'ইওউ'],
      'হ্যা': ['হ্যাঁ', 'হ্যালো', 'হ্যাপি'],
      'হাই': ['হাই', 'হাইতি', 'হাওয়া'],
      'হে': ['হে', 'হেই', 'হেলো', 'হেই'],
      'কে': ['কেমন', 'কে', 'কেউ', 'কেন'],
      'কি': ['কি', 'কিভাবে', 'কিন্তু', 'কিছু'],
      'তু': ['তুমি', 'তুই', 'তুম্মা'],
      'আমি': ['আমি', 'আমরা', 'আমার'],
      'তুমি': ['তুমি', 'তোমরা', 'তোমার'],
    };
    
    // Check if we have predefined suggestions for this word
    if (commonWords[bengaliWord]) {
      commonWords[bengaliWord].slice(0, 3).forEach((suggestion, idx) => {
        if (suggestion !== bengaliWord) {
          suggestions.push({ text: suggestion, score: 0.9 - (idx * 0.1) });
        }
      });
    }
    
    // If word is short, try to match partial patterns
    if (bengaliWord.length <= 2) {
      Object.keys(commonWords).forEach(key => {
        if (key.startsWith(bengaliWord) && key !== bengaliWord && suggestions.length < 4) {
          suggestions.push({ text: key, score: 0.7 });
        }
      });
    }
    
    return suggestions.slice(0, 4);
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

