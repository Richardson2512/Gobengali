"use client";

import { useEditorStore } from "@/store/editorStore";
import { Button } from "./ui/Button";
import { Check, X, CheckCheck, AlertCircle, CheckCircle2, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function AIAssistantPanel() {
  const { errors, applySuggestion, ignoreError, applyAllSuggestions, setActiveErrorId, activeErrorId } = useEditorStore();

  const spellingErrors = errors.filter(e => e.type === 'spelling');
  const grammarErrors = errors.filter(e => e.type === 'grammar');
  
  // Scroll detection for "more below" indicator
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Check if there's more content to scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasScroll = container.scrollHeight > container.clientHeight;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setShowScrollIndicator(hasScroll && !isAtBottom);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    
    // Also check when errors change
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [errors]);

  // Reject all errors
  const rejectAllSuggestions = () => {
    errors.forEach(error => ignoreError(error.id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative flex flex-col" style={{ height: '800px' }}>
      {/* Header - Fixed at top, always visible */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0 bg-white z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          {errors.length > 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              {errors.length} suggestion{errors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {errors.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={applyAllSuggestions}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCheck size={16} />
              Accept All
            </button>
            <button
              onClick={rejectAllSuggestions}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Reject All
            </button>
          </div>
        )}
      </div>

      {/* Corrections List - Scrollable independently */}
      <div 
        ref={scrollContainerRef}
        className="p-4 space-y-3 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" 
        style={{ maxHeight: '650px' }}
      >
        {errors.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-gray-600 font-medium">No issues found</p>
            <p className="text-gray-400 text-sm mt-1">Your writing looks perfect!</p>
          </div>
        ) : (
          <>
            {/* All Corrections */}
            {errors.map((error) => (
              <CorrectionCard
                key={error.id}
                error={error}
                isActive={activeErrorId === error.id}
                onAccept={(suggestion) => applySuggestion(error.id, suggestion)}
                onReject={() => ignoreError(error.id)}
                onHover={() => setActiveErrorId(error.id)}
              />
          ))}
        </>
      )}
    </div>

    {/* Scroll Indicator - Shows when there are more suggestions below */}
    {showScrollIndicator && (
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none flex items-end justify-center pb-2">
        <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg animate-bounce">
          <ChevronDown size={14} />
          Scroll for more suggestions
        </div>
      </div>
    )}
  </div>
);
}

interface CorrectionCardProps {
  error: any;
  isActive: boolean;
  onAccept: (suggestion: string) => void;
  onReject: () => void;
  onHover: () => void;
}

function CorrectionCard({ error, isActive, onAccept, onReject, onHover }: CorrectionCardProps) {
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'spelling':
        return { icon: <AlertCircle size={14} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'grammar':
        return { icon: <BookOpen size={14} />, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      default:
        return { icon: <CheckCircle2 size={14} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    }
  };

  const typeInfo = getTypeInfo(error.type);
  const topSuggestion = error.suggestions?.[0];

  return (
    <div
      className={cn(
        "border-2 rounded-xl p-4 transition-all shadow-sm hover:shadow-md",
        isActive ? "border-green-500 bg-green-50/30" : "border-gray-200 hover:border-gray-300 bg-white"
      )}
      onMouseEnter={onHover}
    >
      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("rounded-full p-1", typeInfo.bg)}>
          <span className={typeInfo.color}>{typeInfo.icon}</span>
        </div>
        <span className={cn("text-xs font-semibold uppercase tracking-wide", typeInfo.color)}>
          {error.type}
        </span>
      </div>

      {/* Word Correction */}
      <div className="mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Original:</span>
            <span className="text-lg font-medium text-red-600 line-through bengali-text px-2 py-1 bg-red-50 rounded">
              {error.originalText}
            </span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Suggested:</span>
            <span className="text-lg font-semibold text-green-600 bengali-text px-2 py-1 bg-green-50 rounded border-2 border-green-300">
              {topSuggestion}
            </span>
          </div>
        </div>
      </div>

      {/* Bengali Reason */}
      {error.reason && (
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-3 rounded-r">
          <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
            <BookOpen size={12} />
            কারণ:
          </p>
          <p className="text-sm text-blue-800 bengali-text leading-relaxed">{error.reason}</p>
        </div>
      )}

      {/* Accept/Reject Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(topSuggestion)}
          className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Check size={16} />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          Reject
        </button>
      </div>

      {/* Additional Suggestions (if any) */}
      {error.suggestions && error.suggestions.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">More suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {error.suggestions.slice(1, 3).map((suggestion: string, idx: number) => (
              <button
                key={idx}
                onClick={() => onAccept(suggestion)}
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-lg transition-colors bengali-text font-medium"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

