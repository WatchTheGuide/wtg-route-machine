// Coordinate format: [longitude, latitude]
export type Coordinate = [number, number];

// Localized string support for multi-language content
export interface LocalizedString {
  pl: string;
  en: string;
  de?: string;
  fr?: string;
  uk?: string;
}

// City definition
export interface City {
  id: string;
  name: LocalizedString;
  center: Coordinate;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  country: string;
}

// POI (Point of Interest)
export interface POI {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  coordinates: Coordinate;
  category: POICategory;
  type: string; // museum, restaurant, monument, etc.
  tags: string[];
  images?: string[];
  externalLinks?: {
    wikipedia?: string;
    openstreetmap?: string;
    website?: string;
  };
  cityId: string;
  createdAt: string;
  updatedAt: string;
}

export type POICategory =
  | 'heritage'
  | 'nature'
  | 'culture'
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'accommodation';

// Waypoint in a tour
export interface Waypoint {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinate;
  stopDuration?: number; // minutes
  order: number;
}

// Tour difficulty levels (aligned with backend API)
export type TourDifficulty = 'easy' | 'medium' | 'hard';

// Tour status
export type TourStatus = 'draft' | 'published' | 'archived';

// Tour category (aligned with backend API)
export type TourCategory =
  | 'history'
  | 'architecture'
  | 'nature'
  | 'food'
  | 'art'
  | 'nightlife';

// Curated Tour
export interface Tour {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  cityId: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  estimatedDuration: number; // minutes
  distance: number; // meters
  waypoints: Waypoint[];
  pois: string[]; // POI IDs
  images: string[];
  tags: string[];
  status: TourStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

// Route calculation profile
export type RouteProfile = 'foot' | 'bicycle' | 'car';

// OSRM Route Response
export interface Route {
  distance: number; // meters
  duration: number; // seconds
  geometry: Coordinate[];
  legs: RouteLeg[];
}

export interface RouteLeg {
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  geometry: Coordinate[];
  name: string;
  maneuver: {
    type: string;
    modifier?: string;
    location: Coordinate;
  };
}

// User/Admin types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
