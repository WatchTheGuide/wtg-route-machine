/**
 * WTG Route Machine - Type Definitions
 */

// Coordinate type [longitude, latitude] for OSRM compatibility
export type Coordinate = [number, number];

// City definition
export interface City {
  id: string;
  name: string;
  center: Coordinate;
  port: number;
}

// POI (Point of Interest)
export interface POI {
  id: string;
  name: string;
  description?: string;
  category: POICategory;
  coordinate: Coordinate;
  address?: string;
  imageUrl?: string;
  rating?: number;
  openingHours?: string;
}

export type POICategory =
  | 'landmark'
  | 'museum'
  | 'park'
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'other';

// Waypoint for route planning
export interface Waypoint {
  id: string;
  coordinate: Coordinate;
  name?: string;
  poi?: POI;
  order: number;
}

// Route
export interface Route {
  id: string;
  name: string;
  description?: string;
  waypoints: Waypoint[];
  distance: number; // meters
  duration: number; // seconds
  geometry: Coordinate[]; // polyline coordinates
  profile: RoutingProfile;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export type RoutingProfile = 'foot' | 'bicycle' | 'car';

// Tour (curated walking tour)
export interface Tour {
  id: string;
  name: string;
  description: string;
  city: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  duration: number; // minutes
  distance: number; // meters
  pois: POI[];
  imageUrl?: string;
}

export type TourCategory =
  | 'history'
  | 'art'
  | 'food'
  | 'nature'
  | 'architecture'
  | 'nightlife';

export type TourDifficulty = 'easy' | 'medium' | 'hard';

// Navigation step
export interface NavigationStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver: string;
  coordinate: Coordinate;
}

// Settings
export interface AppSettings {
  defaultCity: string;
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  defaultProfile: RoutingProfile;
  navigationVoice: boolean;
}
