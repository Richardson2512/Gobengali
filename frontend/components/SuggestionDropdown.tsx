"use client";

import { useEditorStore } from "@/store/editorStore";
import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

interface SuggestionDropdownProps {
  errorId: string;
  position: { top: number; left: number };
  onClose: () => void;
}

export function SuggestionDropdown({ errorId, position, onClose }: SuggestionDropdownProps) {
  const { errors, applySuggestion, ignoreError } = useEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const error = errors.find(e => e.id === errorId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!error) return null;

  const handleApply = (suggestion: string) => {
    applySuggestion(errorId, suggestion);
    onClose();
  };

  const handleIgnore = () => {
    ignoreError(errorId);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="suggestion-dropdown"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">
            {error.type === 'spelling' ? 'Spelling' : 'Grammar'}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-600">{error.message}</p>
      </div>

      {/* Suggestions */}
      {error.suggestions && error.suggestions.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
          {error.suggestions.slice(0, 5).map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleApply(suggestion)}
              className="suggestion-item w-full flex items-center justify-between group"
            >
              <span className="text-sm bengali-text">{suggestion}</span>
              <Check size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">No suggestions available</p>
      )}

      {/* Reason */}
      {error.reason && (
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="text-xs text-gray-500 italic">{error.reason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-200 mt-2 pt-2">
        <button
          onClick={handleIgnore}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Ignore this issue
        </button>
      </div>
    </div>
  );
}

