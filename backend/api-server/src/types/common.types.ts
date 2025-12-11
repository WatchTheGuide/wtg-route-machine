/**
 * Shared API types
 */

/**
 * Localized string for multi-language support
 * Polish (pl) is required, other languages are optional
 */
export interface LocalizedString {
  pl: string;
  en?: string;
  de?: string;
  fr?: string;
  uk?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  code?: string;
}
