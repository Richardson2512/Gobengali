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

export interface Notification {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
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

  // Notifications
  notification: Notification | null;

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
  applySuggestion: (errorId: string, suggestion: string) => boolean;
  ignoreError: (errorId: string) => void;
  applyAllSuggestions: () => boolean;
  setShouldSyncToEditor: (should: boolean) => void;
  checkDailyLimits: () => { wordLimitReached: boolean; acceptsLimitReached: boolean };
  resetDailyLimits: () => void;
  notify: (notification: Notification) => void;
  clearNotification: () => void;
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

    if (data.lastResetDate !== today) {
      return {
        dailyWordUsage: 0,
        dailyAcceptsUsage: 0,
        lastResetDate: today,
      };
    }

    return data;
  } catch {
    return {};
  }
};

// Persist usage to localStorage
const persistUsage = (data: {
  dailyWordUsage: number;
  dailyAcceptsUsage: number;
  lastResetDate: string;
}) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gobengali-usage', JSON.stringify(data));
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
  notification: null,
  wordCount: 0,
  characterCount: 0,
  dailyWordUsage: loadInitialState().dailyWordUsage || 0,
  dailyAcceptsUsage: loadInitialState().dailyAcceptsUsage || 0,
  lastResetDate: loadInitialState().lastResetDate || getTodayDate(),
  userTier: 'free',
  dailyWordLimit: 500,
  dailyAcceptsLimit: 15,
  shouldSyncToEditor: false,

  // Actions
  setContent: (content) => set({ content }),

  setTranslatedContent: (content) => set({ translatedContent: content }),

  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),

  setErrors: (errors) => set({ errors }),

  addError: (error) =>
    set((state) => ({
      errors: [...state.errors, error],
    })),

  removeError: (errorId) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== errorId),
    })),

  setActiveErrorId: (id) => set({ activeErrorId: id }),

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  setIsTranslating: (state) => set({ isTranslating: state }),

  setIsAnalyzing: (state) => set({ isAnalyzing: state }),

  setIsFrozen: (state) => set({ isFrozen: state }),

  notify: (notification) => set({ notification }),

  clearNotification: () => set({ notification: null }),

  updateStats: (words, chars) => {
    const state = get();
    const wordDiff = words - state.wordCount;

    if (wordDiff > 0 && state.userTier === 'free') {
      const newDailyUsage = state.dailyWordUsage + wordDiff;
      set({
        wordCount: words,
        characterCount: chars,
        dailyWordUsage: newDailyUsage,
      });

      persistUsage({
        dailyWordUsage: newDailyUsage,
        dailyAcceptsUsage: state.dailyAcceptsUsage,
        lastResetDate: state.lastResetDate,
      });
    } else {
      set({ wordCount: words, characterCount: chars });
    }
  },

  setShouldSyncToEditor: (should) => set({ shouldSyncToEditor: should }),

  checkDailyLimits: () => {
    const state = get();

    const today = getTodayDate();
    if (state.lastResetDate !== today) {
      get().resetDailyLimits();
      return { wordLimitReached: false, acceptsLimitReached: false };
    }

    return {
      wordLimitReached:
        state.userTier === 'free' && state.dailyWordUsage >= state.dailyWordLimit,
      acceptsLimitReached:
        state.userTier === 'free' &&
        state.dailyAcceptsUsage >= state.dailyAcceptsLimit,
    };
  },

  resetDailyLimits: () => {
    const today = getTodayDate();
    set({
      dailyWordUsage: 0,
      dailyAcceptsUsage: 0,
      lastResetDate: today,
    });
    persistUsage({
      dailyWordUsage: 0,
      dailyAcceptsUsage: 0,
      lastResetDate: today,
    });
  },

  applySuggestion: (errorId, suggestion) => {
    const state = get();

    if (
      state.userTier === 'free' &&
      state.dailyAcceptsUsage >= state.dailyAcceptsLimit
    ) {
      state.notify({
        type: 'warning',
        title: 'Daily Limit Reached',
        message: `You have used all ${state.dailyAcceptsLimit} AI suggestion accepts for today. Upgrade to Pro for unlimited access!`,
        duration: 6000,
      });
      return false;
    }

    const error = state.errors.find((e) => e.id === errorId);
    if (!error) return false;

    const currentText = state.content;
    const before = currentText.substring(0, error.offset);
    const after = currentText.substring(error.offset + error.length);
    const newContent = before + suggestion + after;

    const newAcceptsUsage = state.dailyAcceptsUsage + 1;

    set({
      content: newContent,
      translatedContent: newContent,
      errors: state.errors.filter((e) => e.id !== errorId),
      shouldSyncToEditor: true,
      dailyAcceptsUsage: newAcceptsUsage,
    });

    persistUsage({
      dailyWordUsage: state.dailyWordUsage,
      dailyAcceptsUsage: newAcceptsUsage,
      lastResetDate: state.lastResetDate,
    });

    return true;
  },

  ignoreError: (errorId) => {
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== errorId),
    }));
  },

  applyAllSuggestions: () => {
    const state = get();

    const acceptsNeeded = state.errors.length;

    if (
      state.userTier === 'free' &&
      state.dailyAcceptsUsage >= state.dailyAcceptsLimit
    ) {
      state.notify({
        type: 'warning',
        title: 'Daily Limit Reached',
        message: `You have used all ${state.dailyAcceptsLimit} AI suggestion accepts for today. Upgrade to Pro for unlimited access!`,
        duration: 6000,
      });
      return false;
    }

    let newContent = state.content;

    const sortedErrors = [...state.errors].sort((a, b) => b.offset - a.offset);

    sortedErrors.forEach((error) => {
      if (error.suggestions.length > 0) {
        const before = newContent.substring(0, error.offset);
        const after = newContent.substring(error.offset + error.length);
        newContent = before + error.suggestions[0] + after;
      }
    });

    const newAcceptsUsage = Math.min(
      state.dailyAcceptsUsage + acceptsNeeded,
      state.dailyAcceptsLimit
    );

    set({
      content: newContent,
      translatedContent: newContent,
      errors: [],
      shouldSyncToEditor: true,
      dailyAcceptsUsage: newAcceptsUsage,
    });

    persistUsage({
      dailyWordUsage: state.dailyWordUsage,
      dailyAcceptsUsage: newAcceptsUsage,
      lastResetDate: state.lastResetDate,
    });

    return true;
  },
}));
