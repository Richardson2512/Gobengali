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
      if (word.length < 1) {
        console.log('Word too short, not fetching');
        return;
      }
      
      console.log('📝 Fetching transliteration for:', word);
      setLoading(true);
      
      try {
        // Always use API for transliteration - no hardcoded data!
        const result = await transliterate({ 
          text: word, 
          max_suggestions: 4,
          // Include reverse transliteration flag for Bengali words
          reverse: /[\u0980-\u09FF]/.test(word)
        });
        
        console.log('✅ Got suggestions:', result.suggestions);
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('❌ Transliteration API failed:', error);
        // If API fails, don't show suggestions
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [word]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === ' ') {
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

  console.log('🎨 TransliterationDropdown render:', { 
    word, 
    loading, 
    suggestionsCount: suggestions.length,
    position 
  });

  if (loading) {
    return (
      <div 
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl px-4 py-3"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <p className="text-sm text-gray-500">Loading suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    console.log('⚠️ No suggestions to show');
    return null;
  }

  console.log('✅ Rendering dropdown with', suggestions.length, 'suggestions');

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
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Space</kbd> to select
        </p>
      </div>
    </div>
  );
}

