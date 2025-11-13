import { create } from 'zustand';

export interface CorrectionError {
  id: string;
  type: 'spelling' | 'grammar' | 'translation';
  offset: number;
  length: number;
  originalText: string;
  suggestions: string[];
  message: string;
  reason?: string;
  confidence?: number;
}

interface EditorState {
  // Editor content
  content: string;
  translatedContent: string;
  sourceLanguage: string;
  
  // Corrections
  errors: CorrectionError[];
  activeErrorId: string | null;
  
  // UI State
  isPanelOpen: boolean;
  isTranslating: boolean;
  isAnalyzing: boolean;
  isFrozen: boolean;
  
  // Statistics
  wordCount: number;
  characterCount: number;
  dailyWordUsage: number;
  
  // User tier
  userTier: 'free' | 'pro';
  
  // Actions
  setContent: (content: string) => void;
  setTranslatedContent: (content: string) => void;
  setSourceLanguage: (lang: string) => void;
  setErrors: (errors: CorrectionError[]) => void;
  addError: (error: CorrectionError) => void;
  removeError: (errorId: string) => void;
  setActiveErrorId: (id: string | null) => void;
  togglePanel: () => void;
  setIsTranslating: (state: boolean) => void;
  setIsAnalyzing: (state: boolean) => void;
  setIsFrozen: (state: boolean) => void;
  updateStats: (words: number, chars: number) => void;
  applySuggestion: (errorId: string, suggestion: string) => void;
  ignoreError: (errorId: string) => void;
  applyAllSuggestions: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  content: '',
  translatedContent: '',
  sourceLanguage: 'en',
  errors: [],
  activeErrorId: null,
  isPanelOpen: true,
  isTranslating: false,
  isAnalyzing: false,
  isFrozen: false,
  wordCount: 0,
  characterCount: 0,
  dailyWordUsage: 0,
  userTier: 'free',

  // Actions
  setContent: (content) => set({ content }),
  
  setTranslatedContent: (content) => set({ translatedContent: content }),
  
  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),
  
  setErrors: (errors) => set({ errors }),
  
  addError: (error) => set((state) => ({ 
    errors: [...state.errors, error] 
  })),
  
  removeError: (errorId) => set((state) => ({
    errors: state.errors.filter(e => e.id !== errorId)
  })),
  
  setActiveErrorId: (id) => set({ activeErrorId: id }),
  
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  
  setIsTranslating: (state) => set({ isTranslating: state }),
  
  setIsAnalyzing: (state) => set({ isAnalyzing: state }),
  
  setIsFrozen: (state) => set({ isFrozen: state }),
  
  updateStats: (words, chars) => set({ 
    wordCount: words, 
    characterCount: chars 
  }),
  
  applySuggestion: (errorId, suggestion) => {
    const state = get();
    const error = state.errors.find(e => e.id === errorId);
    
    if (error) {
      // Get current editor content (prefer content over translatedContent)
      const currentText = state.content || state.translatedContent;
      const before = currentText.substring(0, error.offset);
      const after = currentText.substring(error.offset + error.length);
      const newContent = before + suggestion + after;
      
      // Update both content and translatedContent to keep in sync
      set({
        content: newContent,
        translatedContent: newContent,
        errors: state.errors.filter(e => e.id !== errorId)
      });
    }
  },
  
  ignoreError: (errorId) => {
    set((state) => ({
      errors: state.errors.filter(e => e.id !== errorId)
    }));
  },
  
  applyAllSuggestions: () => {
    const state = get();
    // Get current editor content (prefer content over translatedContent)
    let newContent = state.content || state.translatedContent;
    
    // Sort errors by offset in descending order to avoid offset shifts
    const sortedErrors = [...state.errors].sort((a, b) => b.offset - a.offset);
    
    sortedErrors.forEach(error => {
      if (error.suggestions.length > 0) {
        const before = newContent.substring(0, error.offset);
        const after = newContent.substring(error.offset + error.length);
        newContent = before + error.suggestions[0] + after;
      }
    });
    
    // Update both content and translatedContent to keep in sync
    set({
      content: newContent,
      translatedContent: newContent,
      errors: []
    });
  },
}));

