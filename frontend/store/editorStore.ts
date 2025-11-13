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
  dailyAcceptsUsage: number;
  lastResetDate: string;
  
  // User tier
  userTier: 'free' | 'pro';
  
  // Usage limits (free tier)
  dailyWordLimit: number;
  dailyAcceptsLimit: number;
  
  // Flag to indicate programmatic content change (not user typing)
  shouldSyncToEditor: boolean;
  
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
  setShouldSyncToEditor: (should: boolean) => void;
  checkDailyLimits: () => { wordLimitReached: boolean; acceptsLimitReached: boolean };
  resetDailyLimits: () => void;
}

// Helper to get today's date as string
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Load initial state from localStorage
const loadInitialState = () => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('gobengali-usage');
  if (!stored) return {};
  
  try {
    const data = JSON.parse(stored);
    const today = getTodayDate();
    
    // Reset if it's a new day
    if (data.lastResetDate !== today) {
      return {
        dailyWordUsage: 0,
        dailyAcceptsUsage: 0,
        lastResetDate: today
      };
    }
    
    return data;
  } catch {
    return {};
  }
};

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
  dailyWordUsage: loadInitialState().dailyWordUsage || 0,
  dailyAcceptsUsage: loadInitialState().dailyAcceptsUsage || 0,
  lastResetDate: loadInitialState().lastResetDate || getTodayDate(),
  userTier: 'free',
  dailyWordLimit: 500,     // Free tier: 500 words/day
  dailyAcceptsLimit: 15,   // Free tier: 15 accepts/day
  shouldSyncToEditor: false,

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
  
  updateStats: (words, chars) => {
    const state = get();
    const wordDiff = words - state.wordCount;
    
    // Update daily word usage (track new words added)
    if (wordDiff > 0 && state.userTier === 'free') {
      const newDailyUsage = state.dailyWordUsage + wordDiff;
      set({ 
        wordCount: words, 
        characterCount: chars,
        dailyWordUsage: newDailyUsage
      });
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('gobengali-usage', JSON.stringify({
          dailyWordUsage: newDailyUsage,
          dailyAcceptsUsage: state.dailyAcceptsUsage,
          lastResetDate: state.lastResetDate
        }));
      }
    } else {
      set({ wordCount: words, characterCount: chars });
    }
  },
  
  setShouldSyncToEditor: (should) => set({ shouldSyncToEditor: should }),
  
  checkDailyLimits: () => {
    const state = get();
    
    // Check if we need to reset (new day)
    const today = getTodayDate();
    if (state.lastResetDate !== today) {
      get().resetDailyLimits();
      return { wordLimitReached: false, acceptsLimitReached: false };
    }
    
    return {
      wordLimitReached: state.userTier === 'free' && state.dailyWordUsage >= state.dailyWordLimit,
      acceptsLimitReached: state.userTier === 'free' && state.dailyAcceptsUsage >= state.dailyAcceptsLimit
    };
  },
  
  resetDailyLimits: () => {
    const today = getTodayDate();
    set({
      dailyWordUsage: 0,
      dailyAcceptsUsage: 0,
      lastResetDate: today
    });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gobengali-usage', JSON.stringify({
        dailyWordUsage: 0,
        dailyAcceptsUsage: 0,
        lastResetDate: today
      }));
    }
  },
  
  applySuggestion: (errorId, suggestion) => {
    const state = get();
    
    // Check accept limit
    if (state.userTier === 'free' && state.dailyAcceptsUsage >= state.dailyAcceptsLimit) {
      alert('Daily limit reached! You have used all 15 AI suggestion accepts for today. Upgrade to Pro for unlimited access!');
      return;
    }
    
    const error = state.errors.find(e => e.id === errorId);
    
    if (!error) {
      console.error('Error not found:', errorId);
      return;
    }
    
    // Work directly with current content
    const currentText = state.content;
    
    console.log('Applying suggestion:', {
      errorId,
      offset: error.offset,
      length: error.length,
      original: error.originalText,
      suggestion,
      currentText: currentText.substring(error.offset, error.offset + error.length)
    });
    
    const before = currentText.substring(0, error.offset);
    const after = currentText.substring(error.offset + error.length);
    const newContent = before + suggestion + after;
    
    console.log('New content:', newContent);
    
    // Increment accepts usage
    const newAcceptsUsage = state.dailyAcceptsUsage + 1;
    
    // Update content and flag editor to sync (programmatic change, not user typing)
    set({
      content: newContent,
      translatedContent: newContent,
      errors: state.errors.filter(e => e.id !== errorId),
      shouldSyncToEditor: true,  // Signal editor to update
      dailyAcceptsUsage: newAcceptsUsage
    });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gobengali-usage', JSON.stringify({
        dailyWordUsage: state.dailyWordUsage,
        dailyAcceptsUsage: newAcceptsUsage,
        lastResetDate: state.lastResetDate
      }));
    }
  },
  
  ignoreError: (errorId) => {
    set((state) => ({
      errors: state.errors.filter(e => e.id !== errorId)
    }));
  },
  
  applyAllSuggestions: () => {
    const state = get();
    
    // Check accept limit
    const acceptsNeeded = state.errors.length;
    const remainingAccepts = state.dailyAcceptsLimit - state.dailyAcceptsUsage;
    
    if (state.userTier === 'free' && state.dailyAcceptsUsage >= state.dailyAcceptsLimit) {
      alert(`Daily limit reached! You have used all ${state.dailyAcceptsLimit} AI suggestion accepts for today. Upgrade to Pro for unlimited access!`);
      return;
    }
    
    if (state.userTier === 'free' && acceptsNeeded > remainingAccepts) {
      const proceed = confirm(`You have ${remainingAccepts} accepts remaining today. This will use all of them. Continue?`);
      if (!proceed) return;
    }
    
    let newContent = state.content;
    
    console.log('Apply All: Starting with', state.errors.length, 'errors');
    console.log('Current content:', newContent);
    
    // Sort errors by offset in descending order to avoid offset shifts
    const sortedErrors = [...state.errors].sort((a, b) => b.offset - a.offset);
    
    sortedErrors.forEach(error => {
      if (error.suggestions.length > 0) {
        console.log('Replacing:', error.originalText, '→', error.suggestions[0], 'at offset', error.offset);
        const before = newContent.substring(0, error.offset);
        const after = newContent.substring(error.offset + error.length);
        newContent = before + error.suggestions[0] + after;
      }
    });
    
    console.log('Apply All: New content:', newContent);
    
    // Increment accepts usage by number of errors fixed
    const newAcceptsUsage = Math.min(
      state.dailyAcceptsUsage + acceptsNeeded,
      state.dailyAcceptsLimit
    );
    
    // Update content and flag editor to sync
    set({
      content: newContent,
      translatedContent: newContent,
      errors: [],
      shouldSyncToEditor: true,  // Signal editor to update
      dailyAcceptsUsage: newAcceptsUsage
    });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gobengali-usage', JSON.stringify({
        dailyWordUsage: state.dailyWordUsage,
        dailyAcceptsUsage: newAcceptsUsage,
        lastResetDate: state.lastResetDate
      }));
    }
  },
}));

