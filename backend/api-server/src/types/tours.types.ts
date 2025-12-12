/**
 * TypeScript types for Tours API
 * Aligned with mobile app types
 */

import type { LocalizedString } from './common.types.js';

export type Coordinate = [number, number]; // [longitude, latitude]

export interface TourPOI {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: string;
  coordinate: Coordinate;
  address?: string;
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

// Re-export LocalizedString for backwards compatibility
export type { LocalizedString } from './common.types.js';

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
  pois: TourPOI[];
  mediaIds: string[]; // Array of media IDs
  primaryMediaId?: string; // Primary media ID for hero image
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
  mediaIds: string[]; // Array of media IDs
  primaryMediaId?: string; // Primary media ID for hero image
}

export interface TourCity {
  id: string;
  name: string;
  toursCount: number;
}

// API Response types
export interface ToursCitiesResponse {
  cities: TourCity[];
}

export interface ToursResponse {
  tours: TourSummary[];
}

export interface TourResponse {
  tour: Tour;
}

export interface SearchToursResponse {
  tours: TourSummary[];
  query: string;
  count: number;
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
  pois: TourPOI[];
  status?: TourStatus;
  featured?: boolean;
  mediaIds?: string[]; // Array of media IDs
  primaryMediaId?: string; // Primary media ID for hero image
}

// Admin tour summary with extra fields
export interface AdminTourSummary extends TourSummary {
  status: TourStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}
