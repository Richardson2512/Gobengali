"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { useEditorStore } from '@/store/editorStore';
import { useEffect, useState, useCallback, useRef } from 'react';
import { analyzeText, detectLanguage as detectLang } from '@/lib/api';
import { countWords, countCharacters, generateId } from '@/lib/utils';
import { X } from 'lucide-react';
import { SuggestionDropdown } from './SuggestionDropdown';
import { TransliterationDropdown } from './TransliterationDropdown';
import { SimpleEditorToolbar } from './SimpleEditorToolbar';

// Stable debounce that doesn't re-create on renders
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Always keep the latest callback
  callbackRef.current = callback;

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}

export default function Editor() {
  const {
    content,
    translatedContent,
    setContent,
    setTranslatedContent,
    setSourceLanguage,
    setErrors,
    updateStats,
    isTranslating,
    isAnalyzing,
    setIsTranslating,
    setIsAnalyzing,
    errors,
    activeErrorId,
    setActiveErrorId,
    isFrozen,
    setIsFrozen,
    shouldSyncToEditor,
    setShouldSyncToEditor,
    checkDailyLimits,
    wordCount: currentWordCount,
    notify,
  } = useEditorStore();

  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  // Transliteration state
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [translitDropdownPos, setTranslitDropdownPos] = useState({ top: 0, left: 0 });

  // Flag to prevent auto-check immediately after applying suggestions
  const [skipNextAutoCheck, setSkipNextAutoCheck] = useState(false);

  // Track the last content that triggered an auto-check to prevent duplicate checks
  const lastCheckedContentRef = useRef('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
          setTimeout(() => checkForEnglishWord(editor), 10);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const newWordCount = countWords(text);

      const { wordLimitReached } = checkDailyLimits();

      if (wordLimitReached && newWordCount > currentWordCount) {
        notify({
          type: 'warning',
          title: 'Daily Limit Reached',
          message: 'You have written 500 words today. Upgrade to Pro for unlimited access or come back tomorrow!',
          duration: 6000,
        });
        return;
      }

      setContent(text);

      if (text.length > 0) {
        updateStats(newWordCount, countCharacters(text));
      } else {
        updateStats(0, 0);
      }

      checkForEnglishWord(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      checkForEnglishWord(editor);
    },
    onCreate: () => {
      setContent('');
      setErrors([]);
      updateStats(0, 0);
    },
  });

  // Debounced language detection
  const detectLanguageAuto = useDebouncedCallback(async (text: string) => {
    if (!text || text.length < 10) return;
    try {
      const result = await detectLang({ text });
      setSourceLanguage(result.language);
    } catch {
      // Language detection is best-effort; silently ignore failures
    }
  }, 1000);

  // Debounced auto-check for Bengali text
  const autoCheckBengali = useDebouncedCallback(async (text: string) => {
    if (!text || text.trim().length < 5) {
      if (errors.length > 0) setErrors([]);
      return;
    }

    const hasBengali = /[\u0980-\u09FF]/.test(text);
    if (!hasBengali) {
      if (errors.length > 0) setErrors([]);
      return;
    }

    // Don't re-check the same content
    if (text === lastCheckedContentRef.current) return;
    lastCheckedContentRef.current = text;

    try {
      setIsAnalyzing(true);

      const result = await analyzeText({
        text,
        lang: 'bn',
        checkGrammar: true,
        checkSpelling: true,
      });

      if (result.errors && result.errors.length > 0) {
        const formattedErrors = result.errors.map((err) => ({
          id: generateId(),
          type: err.type,
          offset: err.offset,
          length: err.length,
          originalText: err.original_text,
          suggestions: err.suggestions,
          message: err.message,
          reason: err.reason,
          confidence: err.confidence,
        }));

        setErrors(formattedErrors);

        if (editor && formattedErrors.length > 0) {
          applyErrorHighlights(text, formattedErrors);
        }
      } else {
        setErrors([]);
      }
    } catch {
      setErrors([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, 1500);

  // ONLY sync editor when suggestions are applied (not during user typing)
  useEffect(() => {
    if (!editor || !shouldSyncToEditor) return;

    setSkipNextAutoCheck(true);

    editor.commands.setContent(content, false);
    editor.commands.focus('end');

    setShouldSyncToEditor(false);

    setTimeout(() => {
      setSkipNextAutoCheck(false);
    }, 3000);
  }, [shouldSyncToEditor, editor, content, setShouldSyncToEditor]);

  // Trigger auto-check when content changes
  useEffect(() => {
    if (skipNextAutoCheck) return;

    if (content && content.trim().length > 0) {
      detectLanguageAuto(content);
      autoCheckBengali(content);
    } else if (errors.length > 0) {
      setErrors([]);
    }
    // Only depend on content and the skip flag — not errors.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, skipNextAutoCheck]);

  // Check for current word and show transliteration dropdown
  const checkForEnglishWord = useCallback((editorInstance: any) => {
    if (!editorInstance) return;

    const { state, view } = editorInstance;
    const { from } = state.selection;

    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');

    const wordsBefore = textBefore.split(/\s+/);
    const lastWord = wordsBefore[wordsBefore.length - 1];

    const isEnglishWord = lastWord && /^[a-zA-Z]{2,}$/.test(lastWord);
    const isMixedWord = lastWord && /[a-zA-Z]/.test(lastWord) && lastWord.length >= 2;
    const isBengaliWord = lastWord && /[\u0980-\u09FF]+/.test(lastWord) && lastWord.length >= 1;

    if (isEnglishWord || isMixedWord || isBengaliWord) {
      const wordStart = from - lastWord.length;

      try {
        const startCoords = view.coordsAtPos(wordStart);
        const endCoords = view.coordsAtPos(from);

        setTranslitDropdownPos({
          top: endCoords.bottom + 5,
          left: startCoords.left,
        });

        setCurrentWord(lastWord);
        setShowTransliteration(true);
      } catch {
        setShowTransliteration(false);
      }
    } else {
      setShowTransliteration(false);
    }
  }, []);

  // Handle selecting a Bengali suggestion
  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      if (!editor) return;

      const { state } = editor;
      const { from } = state.selection;

      const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');
      const words = textBefore.split(/\s+/);
      const lastWord = words[words.length - 1];
      const wordStart = from - lastWord.length;

      editor
        .chain()
        .focus()
        .deleteRange({ from: wordStart, to: from })
        .insertContent(suggestion + ' ')
        .run();

      setShowTransliteration(false);
      setCurrentWord('');
    },
    [editor],
  );

  const handleTranslate = async () => {
    if (!content || content.trim().length === 0) {
      notify({
        type: 'info',
        message: 'Please enter some text to translate.',
      });
      return;
    }

    setIsTranslating(true);
    setIsAnalyzing(true);

    try {
      const result = await analyzeText({
        text: content,
        checkGrammar: true,
        checkSpelling: true,
      });

      setTranslatedContent(result.translated_text);

      const formattedErrors = result.errors.map((err) => ({
        id: generateId(),
        type: err.type,
        offset: err.offset,
        length: err.length,
        originalText: err.original_text,
        suggestions: err.suggestions,
        message: err.message,
        reason: err.reason,
        confidence: err.confidence,
      }));

      setErrors(formattedErrors);

      if (editor) {
        editor.commands.setContent(result.translated_text);
        applyErrorHighlights(result.translated_text, formattedErrors);
      }
    } catch (error: any) {
      notify({
        type: 'error',
        title: 'Translation Failed',
        message: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsTranslating(false);
      setIsAnalyzing(false);
    }
  };

  const applyErrorHighlights = (text: string, errorList: any[]) => {
    if (!editor) return;

    let htmlContent = text;

    const sortedErrors = [...errorList].sort((a, b) => b.offset - a.offset);

    sortedErrors.forEach((error) => {
      const before = htmlContent.substring(0, error.offset);
      const errorText = htmlContent.substring(error.offset, error.offset + error.length);
      const after = htmlContent.substring(error.offset + error.length);

      const className = error.type === 'spelling' ? 'spelling-error' : 'grammar-error';
      htmlContent = `${before}<span class="${className}" data-error-id="${error.id}">${errorText}</span>${after}`;
    });

    editor.commands.setContent(htmlContent);
  };

  const handleAnalyzeOnly = async () => {
    if (!translatedContent || translatedContent.trim().length === 0) {
      notify({
        type: 'info',
        message: 'Please translate text first or enter Bangla text.',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeText({
        text: translatedContent,
        lang: 'bn',
        checkGrammar: true,
        checkSpelling: true,
      });

      const formattedErrors = result.errors.map((err) => ({
        id: generateId(),
        type: err.type,
        offset: err.offset,
        length: err.length,
        originalText: err.original_text,
        suggestions: err.suggestions,
        message: err.message,
        reason: err.reason,
        confidence: err.confidence,
      }));

      setErrors(formattedErrors);

      if (editor) {
        applyErrorHighlights(translatedContent, formattedErrors);
      }
    } catch (error: any) {
      notify({
        type: 'error',
        title: 'Analysis Failed',
        message: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Scroll freeze via CSS class (Fix #17)
  useEffect(() => {
    if (isFrozen) {
      const workspace = document.getElementById('editor-workspace');
      if (workspace) {
        const headerOffset = 80;
        const elementPosition = workspace.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        setTimeout(() => {
          document.body.dataset.scrollY = String(window.scrollY);
          document.body.style.top = `-${window.scrollY}px`;
          document.body.classList.add('scroll-frozen');
        }, 500);
      } else {
        document.body.dataset.scrollY = String(window.scrollY);
        document.body.style.top = `-${window.scrollY}px`;
        document.body.classList.add('scroll-frozen');
      }
    } else {
      const scrollY = document.body.dataset.scrollY || '0';
      document.body.classList.remove('scroll-frozen');
      document.body.style.top = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, parseInt(scrollY, 10));
    }

    return () => {
      document.body.classList.remove('scroll-frozen');
      document.body.style.top = '';
      delete document.body.dataset.scrollY;
    };
  }, [isFrozen]);

  // Handle click for error highlights and freeze on focus
  useEffect(() => {
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const errorSpan = target.closest('[data-error-id]') as HTMLElement;

      if (errorSpan) {
        const errorId = errorSpan.getAttribute('data-error-id');
        const rect = errorSpan.getBoundingClientRect();

        setSelectedError(errorId);
        setActiveErrorId(errorId);
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
        });
      } else {
        setDropdownPosition(null);
        setSelectedError(null);
        setActiveErrorId(null);
      }
    };

    const handleFocus = () => {
      if (!isFrozen) {
        setIsFrozen(true);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);
    editorElement.addEventListener('focus', handleFocus);

    return () => {
      editorElement.removeEventListener('click', handleClick);
      editorElement.removeEventListener('focus', handleFocus);
    };
  }, [editor, setActiveErrorId, isFrozen, setIsFrozen]);

  return (
    <div className="relative">
      {/* Freeze Banner */}
      {isFrozen && (
        <div className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Scroll Locked - Page won't move while you type</span>
          </div>
          <button
            onClick={() => setIsFrozen(false)}
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            aria-label="Unlock scroll"
          >
            <X size={18} />
            <span className="text-sm font-medium">Unlock Scroll</span>
          </button>
        </div>
      )}

      {/* Rich Text Toolbar */}
      <SimpleEditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />

        {!content && !translatedContent && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            <p className="text-lg">Start typing in English...</p>
            <p className="text-sm mt-2">Type English words and get Bangla suggestions instantly</p>
          </div>
        )}
      </div>

      {/* Transliteration Dropdown */}
      {showTransliteration && currentWord && (
        <TransliterationDropdown
          position={translitDropdownPos}
          word={currentWord}
          onSelect={handleSelectSuggestion}
          onClose={() => setShowTransliteration(false)}
        />
      )}

      {/* Error Suggestion Dropdown */}
      {dropdownPosition && selectedError && (
        <SuggestionDropdown
          errorId={selectedError}
          position={dropdownPosition}
          onClose={() => {
            setDropdownPosition(null);
            setSelectedError(null);
            setActiveErrorId(null);
          }}
        />
      )}
    </div>
  );
}
