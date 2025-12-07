/**
 * Coordinate type [longitude, latitude] for OpenLayers/OSRM compatibility
 */
export type Coordinate = [number, number];

/**
 * Routing profile type
 */
export type RoutingProfile = 'foot' | 'bicycle' | 'car';

/**
 * Ports for different routing profiles
 */
export interface CityPorts {
  foot: number;
  bicycle: number;
  car: number;
}

/**
 * City definition
 */
export interface City {
  id: string;
  name: string;
  center: Coordinate;
  ports: CityPorts;
}

/**
 * Available cities with ports per profile
 * Based on docker-compose.multi-city.yml configuration
 */
export const CITIES: Record<string, City> = {
  krakow: {
    id: 'krakow',
    name: 'Kraków',
    center: [19.9449, 50.0647],
    ports: { foot: 5001, bicycle: 5002, car: 5003 },
  },
  warszawa: {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    ports: { foot: 5011, bicycle: 5012, car: 5013 },
  },
  wroclaw: {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    ports: { foot: 5021, bicycle: 5022, car: 5023 },
  },
  trojmiasto: {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    ports: { foot: 5031, bicycle: 5032, car: 5033 },
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
 * Localized string (multi-language support)
 */
export interface LocalizedString {
  pl: string;
  en: string;
  de: string;
  fr: string;
  uk: string;
}

/**
 * Curated tour (full details with POIs)
 */
export interface Tour {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  cityId: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl?: string;
  pois: POI[];
}

/**
 * Tour summary (list view without full POI data)
 */
export interface TourSummary {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  cityId: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl?: string;
  poisCount: number;
}
