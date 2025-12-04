/**
 * Route and waypoint type definitions
 */

export interface Coordinate {
  lon: number;
  lat: number;
}

export interface Waypoint {
  id: string;
  coordinate: Coordinate;
  address?: string;
  fullAddress?: string;
  isGPS?: boolean;
  order: number;
}

export interface RouteStep {
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
    bearing_after: number;
    bearing_before: number;
    instruction?: string;
  };
  name: string;
  distance: number;
  duration: number;
  mode?: string;
}

export interface RouteLeg {
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface Route {
  distance: number;
  duration: number;
  geometry: string;
  legs: RouteLeg[];
}

export interface RouteData {
  code: string;
  routes: Route[];
  waypoints?: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }>;
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
    center: { lon: 19.9385, lat: 50.0647 },
    zoom: 13,
  },
  {
    id: 'warszawa',
    name: 'Warszawa',
    center: { lon: 21.0122, lat: 52.2297 },
    zoom: 12,
  },
  {
    id: 'wroclaw',
    name: 'Wrocław',
    center: { lon: 17.0385, lat: 51.1079 },
    zoom: 13,
  },
  {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: { lon: 18.6466, lat: 54.352 },
    zoom: 11,
  },
];
