"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { useEditorStore } from '@/store/editorStore';
import { useEffect, useState, useCallback } from 'react';
import { analyzeText, detectLanguage as detectLang } from '@/lib/api';
import { countWords, countCharacters, generateId, debounce } from '@/lib/utils';
import { X } from 'lucide-react';
import { SuggestionDropdown } from './SuggestionDropdown';
import { TransliterationDropdown } from './TransliterationDropdown';
import { SimpleEditorToolbar } from './SimpleEditorToolbar';

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
  } = useEditorStore();

  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  
  // Transliteration state
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [translitDropdownPos, setTranslitDropdownPos] = useState({ top: 0, left: 0 });
  
  // Flag to prevent auto-check immediately after applying suggestions
  const [skipNextAutoCheck, setSkipNextAutoCheck] = useState(false);

  const editor = useEditor({
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
      handleKeyDown: (view, event) => {
        // Check for transliteration on any text editing action
        if (event.key === 'Backspace' || event.key === 'Delete') {
          // Delay check to allow deletion to process first
          setTimeout(() => checkForEnglishWord(editor), 10);
        }
        return false; // Let the editor handle the key normally
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      setContent(text);
      
      // Update stats
      if (text.length > 0) {
        updateStats(countWords(text), countCharacters(text));
      } else {
        updateStats(0, 0);
      }
      
      // Check for word typing (for transliteration) - works for both typing and editing
      checkForEnglishWord(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      // Also check when cursor moves (clicking into a word)
      checkForEnglishWord(editor);
    },
    onCreate: ({ editor }) => {
      // Ensure editor starts completely empty
      setContent('');
      setErrors([]);
      updateStats(0, 0);
    },
  });

  // Detect language automatically
  const detectLanguageAuto = useCallback(
    debounce(async (text: string) => {
      if (!text || text.length < 10) return;

      try {
        const result = await detectLang({ text });
        setSourceLanguage(result.language);
      } catch (error) {
        console.error('Language detection failed:', error);
      }
    }, 1000),
    []
  );

  // Auto-check grammar and spelling for Bengali text
  const autoCheckBengali = useCallback(
    debounce(async (text: string) => {
      // Clear errors if no text or text is too short
      if (!text || text.trim().length < 5) {
        if (errors.length > 0) {
          setErrors([]);
        }
        return;
      }

      // Check if text contains Bengali characters
      const hasBengali = /[\u0980-\u09FF]/.test(text);
      
      if (!hasBengali) {
        // Clear errors if no Bengali text
        if (errors.length > 0) {
          setErrors([]);
        }
        return;
      }

      try {
        setIsAnalyzing(true);
        
        console.log('🔍 Checking Bengali text:', text);
        
        // Call analyze endpoint for Bengali text
        const result = await analyzeText({
          text: text,
          lang: 'bn',
          checkGrammar: true,
          checkSpelling: true,
        });

        console.log('✅ Analysis result:', result.errors.length, 'errors found');

        // Only set errors if there are actual errors detected
        if (result.errors && result.errors.length > 0) {
          // Convert errors to store format
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

          console.log('📝 Setting errors in store:', formattedErrors);
          setErrors(formattedErrors);

          // Apply error highlights
          if (editor && formattedErrors.length > 0) {
            applyErrorHighlights(text, formattedErrors);
          }
        } else {
          // Clear errors if API returns no errors
          console.log('✨ No errors found, clearing');
          setErrors([]);
        }
      } catch (error: any) {
        console.error('❌ Auto-check failed:', error);
        // Clear errors on error to avoid showing stale data
        setErrors([]);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500),  // Check after 1.5 seconds of no typing (faster response)
    [editor, errors.length]
  );

  // ONLY sync editor when suggestions are applied (not during user typing)
  useEffect(() => {
    if (!editor || !shouldSyncToEditor) return;
    
    console.log('🔄 Syncing editor with applied suggestion');
    console.log('New content:', content);
    
    // Set flag to skip auto-check
    setSkipNextAutoCheck(true);
    
    // Update editor with the corrected content
    editor.commands.setContent(content, false);
    editor.commands.focus('end');
    
    // Reset the sync flag immediately
    setShouldSyncToEditor(false);
    
    // Reset skip flag after delay
    setTimeout(() => {
      setSkipNextAutoCheck(false);
    }, 3000);
  }, [shouldSyncToEditor, editor, content, setShouldSyncToEditor]);

  useEffect(() => {
    // Skip auto-check if suggestions were just applied
    if (skipNextAutoCheck) {
      return;
    }
    
    if (content && content.trim().length > 0) {
      detectLanguageAuto(content);
      autoCheckBengali(content);  // Auto-check Bengali text
    } else {
      // Clear errors when editor is empty
      if (errors.length > 0) {
        setErrors([]);
      }
    }
  }, [content, errors.length, skipNextAutoCheck]);

  // Check for current word and show transliteration dropdown
  const checkForEnglishWord = useCallback((editor: any) => {
    if (!editor) return;
    
    const { state, view } = editor;
    const { from } = state.selection;
    
    // Get text before cursor (more context for better word detection)
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');
    const textAfter = state.doc.textBetween(from, Math.min(state.doc.content.size, from + 10), ' ');
    
    // Split and get the current word being typed/edited
    const wordsBefore = textBefore.split(/\s+/);
    const lastWord = wordsBefore[wordsBefore.length - 1];
    
    console.log('🔍 Checking word:', lastWord, 'Length:', lastWord?.length);
    
    // Check if it's an English word (letters only, 2+ chars)
    const isEnglishWord = lastWord && /^[a-zA-Z]{2,}$/.test(lastWord);
    const isMixedWord = lastWord && /[a-zA-Z]/.test(lastWord) && lastWord.length >= 2;
    const isBengaliWord = lastWord && /[\u0980-\u09FF]+/.test(lastWord) && lastWord.length >= 1;
    
    console.log('Word types:', { isEnglishWord, isMixedWord, isBengaliWord });
    
    // Show dropdown for:
    // 1. Pure English words (typing)
    // 2. Mixed words (editing)
    // 3. Bengali words (when backspacing to allow re-selection)
    if (isEnglishWord || isMixedWord || isBengaliWord) {
      console.log('✅ Should show dropdown for:', lastWord);
      // Get word start position
      const wordStart = from - lastWord.length;
      
      try {
        // Get DOM coordinates (viewport-relative)
        const startCoords = view.coordsAtPos(wordStart);
        const endCoords = view.coordsAtPos(from);
        
        // Position dropdown below cursor
        setTranslitDropdownPos({ 
          top: endCoords.bottom + 5,
          left: startCoords.left
        });
        
        console.log('📍 Dropdown position:', { top: endCoords.bottom + 5, left: startCoords.left });
        
        // For Bengali words, extract the English equivalent attempt or show suggestions
        const wordToTransliterate = isEnglishWord ? lastWord : lastWord;
        setCurrentWord(wordToTransliterate);
        setShowTransliteration(true);
        
        console.log('✅ Dropdown should be visible now for word:', wordToTransliterate);
      } catch (error) {
        console.error('Error positioning dropdown:', error);
        setShowTransliteration(false);
      }
    } else {
      setShowTransliteration(false);
    }
  }, []);

  // Handle selecting a Bengali suggestion
  const handleSelectSuggestion = useCallback((suggestion: string) => {
    if (!editor) return;

    const { state } = editor;
    const { from } = state.selection;
    
    // Find the start of the current English word
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');
    const words = textBefore.split(/\s+/);
    const lastWord = words[words.length - 1];
    const wordStart = from - lastWord.length;
    
    // Replace English word with Bengali suggestion
    editor.chain()
      .focus()
      .deleteRange({ from: wordStart, to: from })
      .insertContent(suggestion + ' ')
      .run();
    
    setShowTransliteration(false);
    setCurrentWord('');
  }, [editor]);

  const handleTranslate = async () => {
    if (!content || content.trim().length === 0) {
      alert('Please enter some text to translate');
      return;
    }

    setIsTranslating(true);
    setIsAnalyzing(true);

    try {
      // Call analyze endpoint which does translation + corrections
      const result = await analyzeText({
        text: content,
        checkGrammar: true,
        checkSpelling: true,
      });

      // Update translated content
      setTranslatedContent(result.translated_text);

      // Convert errors to store format
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

      // Update editor content with translated text
      if (editor) {
        editor.commands.setContent(result.translated_text);
        // Apply error highlights
        applyErrorHighlights(result.translated_text, formattedErrors);
      }
    } catch (error: any) {
      console.error('Translation failed:', error);
      alert(`Translation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTranslating(false);
      setIsAnalyzing(false);
    }
  };

  const applyErrorHighlights = (text: string, errors: any[]) => {
    if (!editor) return;

    let htmlContent = text;
    
    // Sort errors by offset in descending order to avoid position shifts
    const sortedErrors = [...errors].sort((a, b) => b.offset - a.offset);

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
      alert('Please translate text first or enter Bengali text');
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
      console.error('Analysis failed:', error);
      alert(`Analysis failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-scroll to editor and freeze page scroll when editor is active
  useEffect(() => {
    if (isFrozen) {
      // First, scroll to editor workspace smoothly
      const workspace = document.getElementById('editor-workspace');
      if (workspace) {
        const headerOffset = 80; // Account for any fixed headers
        const elementPosition = workspace.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Wait for scroll to complete before freezing
        setTimeout(() => {
          const scrollY = window.scrollY;
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.width = '100%';
          document.body.style.overflow = 'hidden';
        }, 500); // 500ms for smooth scroll animation
      } else {
        // If workspace not found, freeze immediately
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
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
            <p className="text-sm mt-2">Type English words and get Bengali suggestions instantly</p>
          </div>
        )}
      </div>

      {/* Transliteration Dropdown */}
      {showTransliteration && currentWord && (
        <>
          {console.log('🎯 Rendering TransliterationDropdown:', { currentWord, position: translitDropdownPos, showTransliteration })}
          <TransliterationDropdown
            position={translitDropdownPos}
            word={currentWord}
            onSelect={handleSelectSuggestion}
            onClose={() => setShowTransliteration(false)}
          />
        </>
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

