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

export interface City {
  id: string;
  name: string;
  center: Coordinate;
  zoom: number;
}

export const CITIES: City[] = [
  {
    id: 'krakow',
    name: 'Kraków',
    center: [19.9385, 50.0647],
    zoom: 13,
  },
  {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    zoom: 12,
  },
  {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    zoom: 13,
  },
  {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    zoom: 11,
  },
];
