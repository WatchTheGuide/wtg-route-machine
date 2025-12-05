/**
 * WTG Routes - Type definitions
 */

// Coordinate type [longitude, latitude]
export type Coordinate = [number, number];

// POI Category
export type POICategory =
  | 'landmark'
  | 'museum'
  | 'park'
  | 'restaurant'
  | 'viewpoint'
  | 'church'
  | 'cafe'
  | 'hotel'
  | 'monument'
  | 'theater';

// Point of Interest
export interface POI {
  id: string;
  name: string;
  description: string;
  coordinate: Coordinate; // Changed from coordinates
  category: POICategory;
  imageUrl?: string;
  thumbnailUrl?: string;
  estimatedTime?: number;
  openingHours?: string;
  closedDays?: string;
  website?: string;
  address?: string;
  ticketPrice?: string;
  tags?: string[];
  phone?: string;
  accessibility?: {
    wheelchairAccessible?: boolean;
    audioGuide?: boolean;
  };
}

// City
export interface City {
  id: string;
  name: string;
  poiCount?: number;
  center: Coordinate;
  bounds?: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  };
}

// Category info
export interface CategoryInfo {
  id: POICategory;
  name: string;
  icon: string;
  color: string;
}

// Routing profile
export type RoutingProfile = 'foot' | 'bicycle' | 'car';

// Waypoint
export interface Waypoint {
  id?: string;
  coordinate: Coordinate;
  name?: string;
  type?: 'poi' | 'custom';
  poiId?: string;
  order?: number;
}

// Route step (maneuver)
export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: string; // Simplified to just type
  modifier?: string;
  name: string;
  geometry?: Coordinate[];
}

// Full route
export interface Route {
  geometry: Coordinate[];
  distance: number;
  duration: number;
  steps: RouteStep[];
  profile: RoutingProfile;
}

// Saved route (from Supabase)
export interface SavedRoute {
  id: string;
  userId?: string;
  name: string;
  cityId: string;
  profile: RoutingProfile;
  waypoints: Waypoint[];
  distance: number;
  duration: number;
  geometry?: Coordinate[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

// Tour (predefined route)
export interface Tour {
  id: string;
  name: string;
  description: string;
  cityId: string;
  waypoints?: Waypoint[];
  estimatedDuration: number; // in minutes
  distance: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

// User
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  subscription?: 'free' | 'premium';
  createdAt: string;
}

// Navigation state
export interface NavigationState {
  route: Route;
  currentStepIndex: number;
  currentPosition: Coordinate;
  distanceToNextStep: number;
  distanceToDestination: number;
  estimatedTimeRemaining: number;
  isOffRoute: boolean;
  isNavigating: boolean;
  isPaused: boolean;
}

// User subscription
export type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_yearly';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: string;
}
