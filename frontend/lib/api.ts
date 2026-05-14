import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("gobengali_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 503 && !error.config._retried) {
      error.config._retried = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

export interface AnalyzeRequest {
  text: string;
  lang?: string;
  checkGrammar?: boolean;
  checkSpelling?: boolean;
}

export interface AnalyzeResponse {
  translated_text: string;
  detected_language: string;
  errors: Array<{
    type: 'spelling' | 'grammar' | 'translation';
    offset: number;
    length: number;
    original_text: string;
    suggestions: string[];
    message: string;
    reason?: string;
    confidence?: number;
  }>;
  word_count: number;
  char_count: number;
}

export interface TranslateRequest {
  text: string;
  source_lang?: string;
  target_lang?: string;
}

export interface TranslateResponse {
  translated_text: string;
  detected_language: string;
  confidence: number;
}

export interface DetectLanguageRequest {
  text: string;
}

export interface DetectLanguageResponse {
  language: string;
  confidence: number;
}

export interface ToneChangeRequest {
  text: string;
  tone: 'formal' | 'journalistic' | 'literary';
}

export interface ToneChangeResponse {
  modified_text: string;
  changes_made: number;
}

export interface TransliterateRequest {
  text: string;
  max_suggestions?: number;
  reverse?: boolean;
}

export interface TransliterationSuggestion {
  text: string;
  score: number;
}

export interface TransliterateResponse {
  suggestions: TransliterationSuggestion[];
}

// API Functions
export const analyzeText = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const response = await apiClient.post<AnalyzeResponse>('/analyze', request);
  return response.data;
};

export const translateText = async (request: TranslateRequest): Promise<TranslateResponse> => {
  const response = await apiClient.post<TranslateResponse>('/translate', request);
  return response.data;
};

export const detectLanguage = async (request: DetectLanguageRequest): Promise<DetectLanguageResponse> => {
  const response = await apiClient.post<DetectLanguageResponse>('/detect-language', request);
  return response.data;
};

export const changeTone = async (request: ToneChangeRequest): Promise<ToneChangeResponse> => {
  const response = await apiClient.post<ToneChangeResponse>('/change-tone', request);
  return response.data;
};

export const checkSpelling = async (text: string) => {
  const response = await apiClient.post('/check-spelling', { text });
  return response.data;
};

export const checkGrammar = async (text: string) => {
  const response = await apiClient.post('/check-grammar', { text });
  return response.data;
};

export const transliterate = async (request: TransliterateRequest): Promise<TransliterateResponse> => {
  const response = await apiClient.post<TransliterateResponse>('/transliterate', request);
  return response.data;
};

export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
