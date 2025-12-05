/**
 * Route and waypoint type definitions
 */

/**
 * Coordinate as [longitude, latitude] tuple for OSRM compatibility
 */
export type Coordinate = [number, number];

/**
 * Waypoint with optional address from reverse geocoding
 */
export interface Waypoint {
  id: string;
  coordinate: Coordinate;
  address?: string;
}

/**
 * Navigation instruction for turn-by-turn guidance
 */
export interface NavigationInstruction {
  text: string;
  distance: number;
  maneuverType: string;
  maneuverModifier?: string;
  icon: string;
}

/**
 * Calculated route with decoded geometry
 */
export interface Route {
  coordinates: Coordinate[];
  distance: number; // meters
  duration: number; // seconds
  instructions?: NavigationInstruction[];
}

export type RoutingProfile = 'foot' | 'bicycle' | 'car';

/**
 * Bounding box as [minLng, minLat, maxLng, maxLat]
 */
export type BoundingBox = [number, number, number, number];

export interface City {
  id: string;
  name: string;
  center: Coordinate;
  zoom: number;
  bbox: BoundingBox;
  region: string; // OSM region for data download
}

/**
 * Check if a coordinate is within a bounding box
 */
export function isInBoundingBox(
  coordinate: Coordinate,
  bbox: BoundingBox
): boolean {
  const [lng, lat] = coordinate;
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/**
 * Get city by ID
 */
export function getCityById(cityId: string): City | undefined {
  return CITIES.find((city) => city.id === cityId);
}

/**
 * Default city (Kraków)
 */
export const DEFAULT_CITY_ID = 'krakow';

export const CITIES: City[] = [
  {
    id: 'krakow',
    name: 'Kraków',
    center: [19.9449, 50.0647],
    zoom: 13,
    bbox: [19.8, 49.97, 20.15, 50.13],
    region: 'malopolskie',
  },
  {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    zoom: 12,
    bbox: [20.85, 52.1, 21.25, 52.37],
    region: 'mazowieckie',
  },
  {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    zoom: 13,
    bbox: [16.85, 51.0, 17.2, 51.22],
    region: 'dolnoslaskie',
  },
  {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    zoom: 11,
    bbox: [18.35, 54.28, 18.85, 54.55],
    region: 'pomorskie',
  },
];

/**
 * Default city object
 */
export const DEFAULT_CITY: City = CITIES[0];
