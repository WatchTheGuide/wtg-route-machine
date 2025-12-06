/**
 * Coordinate type [longitude, latitude] for OpenLayers/OSRM compatibility
 */
export type Coordinate = [number, number];

/**
 * City definition
 */
export interface City {
  id: string;
  name: string;
  center: Coordinate;
  port: number;
}

/**
 * Available cities
 */
export const CITIES: Record<string, City> = {
  krakow: {
    id: 'krakow',
    name: 'Kraków',
    center: [19.9449, 50.0647],
    port: 5001,
  },
  warszawa: {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    port: 5002,
  },
  wroclaw: {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    port: 5003,
  },
  trojmiasto: {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    port: 5004,
  },
};

/**
 * POI Category
 */
export type POICategory =
  | 'landmark'
  | 'museum'
  | 'park'
  | 'restaurant'
  | 'cafe'
  | 'hotel';

/**
 * Point of Interest
 */
export interface POI {
  id: string;
  name: string;
  description?: string;
  category: POICategory;
  coordinate: Coordinate;
  address?: string;
  imageUrl?: string;
}

/**
 * Waypoint for route planning
 */
export interface Waypoint {
  id: string;
  coordinate: Coordinate;
  name?: string;
  poi?: POI;
}

/**
 * Routing profile
 */
export type RoutingProfile = 'foot' | 'bicycle' | 'car';

/**
 * Route step (turn-by-turn instruction)
 */
export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinate: Coordinate;
}

/**
 * Calculated route
 */
export interface Route {
  coordinates: Coordinate[];
  distance: number;
  duration: number;
  steps: RouteStep[];
}

/**
 * Saved route
 */
export interface SavedRoute {
  id: string;
  name: string;
  description?: string;
  cityId: string;
  profile: RoutingProfile;
  waypoints: Waypoint[];
  route: Route;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tour difficulty level
 */
export type TourDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Tour category
 */
export type TourCategory =
  | 'history'
  | 'art'
  | 'food'
  | 'nature'
  | 'architecture';

/**
 * Curated tour
 */
export interface Tour {
  id: string;
  name: string;
  description: string;
  cityId: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl?: string;
  pois: POI[];
}
