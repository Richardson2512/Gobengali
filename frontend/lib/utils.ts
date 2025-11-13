import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function detectLanguage(text: string): string {
  // Simple language detection based on Unicode ranges
  const bengaliRange = /[\u0980-\u09FF]/;
  const hindiRange = /[\u0900-\u097F]/;
  const arabicRange = /[\u0600-\u06FF]/;
  
  if (bengaliRange.test(text)) return 'bn';
  if (hindiRange.test(text)) return 'hi';
  if (arabicRange.test(text)) return 'ar';
  
  return 'en'; // Default to English
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function highlightText(
  text: string,
  offset: number,
  length: number,
  className: string
): string {
  const before = text.substring(0, offset);
  const highlighted = text.substring(offset, offset + length);
  const after = text.substring(offset + length);
  
  return `${before}<span class="${className}">${highlighted}</span>${after}`;
}

export function isBengaliText(text: string): boolean {
  const bengaliRange = /[\u0980-\u09FF]/;
  return bengaliRange.test(text);
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
}

