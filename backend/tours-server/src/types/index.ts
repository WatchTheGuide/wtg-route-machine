/**
 * TypeScript types for Tours API
 * Aligned with mobile app types
 */

export type Coordinate = [number, number]; // [longitude, latitude]

export interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinate: Coordinate;
  address: string;
  imageUrl?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
}

export type TourCategory =
  | 'history'
  | 'architecture'
  | 'nature'
  | 'food'
  | 'art'
  | 'nightlife';

export type TourDifficulty = 'easy' | 'medium' | 'hard';

export interface LocalizedString {
  pl: string;
  en: string;
  de: string;
  fr: string;
  uk: string;
}

export interface Tour {
  id: string;
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number; // meters
  duration: number; // seconds
  imageUrl: string;
  pois: POI[];
}

export interface TourSummary {
  id: string;
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl: string;
  poisCount: number;
}

export interface City {
  id: string;
  name: string;
  toursCount: number;
}

// API Response types
export interface CitiesResponse {
  cities: City[];
}

export interface ToursResponse {
  tours: TourSummary[];
}

export interface TourResponse {
  tour: Tour;
}

export interface SearchResponse {
  tours: TourSummary[];
  query: string;
  count: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

// Tour status for admin operations
export type TourStatus = 'draft' | 'published' | 'archived';

// Extended Tour with admin fields
export interface AdminTour extends Tour {
  status: TourStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Tour input for create/update operations
export interface TourInput {
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl: string;
  pois: POI[];
  status?: TourStatus;
  featured?: boolean;
}

// Admin tour summary with extra fields
export interface AdminTourSummary extends TourSummary {
  status: TourStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Re-export auth types
export * from './auth.types.js';
