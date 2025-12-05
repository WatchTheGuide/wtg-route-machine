/**
 * OSRM Service - Routing API client
 * Connects to WTG Route Machine backend for route calculations
 */

import { Coordinate, Route, RoutingProfile, Waypoint } from '../types';

// Backend OSRM ports per city
const CITY_PORTS: Record<string, number> = {
  krakow: 5001,
  warszawa: 5002,
  wroclaw: 5003,
  trojmiasto: 5004,
};

// Base URL for local development
const BASE_URL = 'http://localhost';

export interface OSRMRouteResponse {
  code: string;
  routes: OSRMRoute[];
  waypoints: OSRMWaypoint[];
}

interface OSRMRoute {
  geometry: string; // Encoded polyline
  legs: OSRMLeg[];
  distance: number; // meters
  duration: number; // seconds
  weight: number;
  weight_name: string;
}

interface OSRMLeg {
  distance: number;
  duration: number;
  steps: OSRMStep[];
  summary: string;
}

interface OSRMStep {
  distance: number;
  duration: number;
  geometry: string;
  name: string;
  mode: string;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
    bearing_before: number;
    bearing_after: number;
    instruction?: string;
  };
}

interface OSRMWaypoint {
  name: string;
  location: [number, number];
  distance: number;
  hint: string;
}

// Decode polyline from OSRM (Google Polyline Algorithm)
function decodePolyline(encoded: string): Coordinate[] {
  const coordinates: Coordinate[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    // OSRM returns [lng, lat], we store as [lng, lat] (Coordinate type)
    coordinates.push([lng / 1e5, lat / 1e5]);
  }

  return coordinates;
}

// Convert profile to OSRM profile name
function getOSRMProfile(profile: RoutingProfile): string {
  switch (profile) {
    case 'walking':
      return 'foot';
    case 'cycling':
      return 'bicycle';
    case 'driving':
      return 'car';
    default:
      return 'foot';
  }
}

class OSRMService {
  /**
   * Calculate route between waypoints
   */
  async calculateRoute(
    waypoints: Waypoint[],
    cityId: string,
    profile: RoutingProfile = 'walking'
  ): Promise<Route | null> {
    if (waypoints.length < 2) {
      console.warn('Need at least 2 waypoints to calculate route');
      return null;
    }

    const port = CITY_PORTS[cityId] || 5001;
    const osrmProfile = getOSRMProfile(profile);

    // Build coordinates string: lng,lat;lng,lat;...
    const coords = waypoints
      .map((wp) => `${wp.coordinate[0]},${wp.coordinate[1]}`)
      .join(';');

    const url = `${BASE_URL}:${port}/route/v1/${osrmProfile}/${coords}?overview=full&geometries=polyline&steps=true`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OSRM request failed: ${response.status}`);
      }

      const data: OSRMRouteResponse = await response.json();

      if (data.code !== 'Ok' || !data.routes.length) {
        console.error('OSRM error:', data.code);
        return null;
      }

      const osrmRoute = data.routes[0];

      // Decode geometry
      const coordinates = decodePolyline(osrmRoute.geometry);

      // Extract turn-by-turn instructions
      const instructions = osrmRoute.legs.flatMap((leg) =>
        leg.steps.map((step) => ({
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          instruction:
            step.maneuver.instruction || this.generateInstruction(step),
          distance: step.distance,
          duration: step.duration,
          name: step.name,
          location: step.maneuver.location as Coordinate,
        }))
      );

      const route: Route = {
        id: `route-${Date.now()}`,
        name: 'Nowa trasa',
        waypoints,
        coordinates,
        distance: osrmRoute.distance,
        duration: osrmRoute.duration,
        profile,
        instructions,
        createdAt: new Date().toISOString(),
      };

      return route;
    } catch (error) {
      console.error('Error calculating route:', error);

      // For development: return mock route if server unavailable
      if (__DEV__) {
        return this.getMockRoute(waypoints, profile);
      }

      return null;
    }
  }

  /**
   * Generate human-readable instruction from step
   */
  private generateInstruction(step: OSRMStep): string {
    const { type, modifier } = step.maneuver;
    const streetName = step.name || 'ulicę';

    const modifierMap: Record<string, string> = {
      left: 'w lewo',
      right: 'w prawo',
      'slight left': 'lekko w lewo',
      'slight right': 'lekko w prawo',
      'sharp left': 'ostro w lewo',
      'sharp right': 'ostro w prawo',
      straight: 'prosto',
      uturn: 'zawróć',
    };

    const typeMap: Record<string, string> = {
      depart: `Rozpocznij na ${streetName}`,
      arrive: 'Dotarłeś do celu',
      turn: `Skręć ${modifierMap[modifier || 'straight']} w ${streetName}`,
      'new name': `Kontynuuj ${streetName}`,
      merge: `Wjedź na ${streetName}`,
      'on ramp': `Wjedź na ${streetName}`,
      'off ramp': `Zjedź z ${streetName}`,
      fork: `Trzymaj się ${modifierMap[modifier || 'straight']}`,
      'end of road': `Na końcu drogi skręć ${
        modifierMap[modifier || 'straight']
      }`,
      continue: `Kontynuuj ${modifierMap[modifier || 'straight']}`,
      roundabout: `Na rondzie weź ${modifier || 'zjazd'}`,
      rotary: `Na rondzie weź ${modifier || 'zjazd'}`,
      'roundabout turn': `Na rondzie skręć ${
        modifierMap[modifier || 'straight']
      }`,
      notification: step.name,
    };

    return typeMap[type] || `${type} ${modifier || ''}`;
  }

  /**
   * Mock route for development when OSRM is unavailable
   */
  private getMockRoute(waypoints: Waypoint[], profile: RoutingProfile): Route {
    // Create simple straight-line route between waypoints
    const coordinates: Coordinate[] = [];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i].coordinate;
      const end = waypoints[i + 1].coordinate;

      // Add intermediate points
      const steps = 10;
      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        coordinates.push([
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t,
        ]);
      }
    }

    // Estimate distance (Haversine)
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += this.haversineDistance(
        coordinates[i],
        coordinates[i + 1]
      );
    }

    // Estimate duration based on profile
    const speeds: Record<RoutingProfile, number> = {
      walking: 5, // km/h
      cycling: 15,
      driving: 40,
    };
    const speed = speeds[profile];
    const duration = (totalDistance / 1000 / speed) * 3600; // seconds

    return {
      id: `mock-route-${Date.now()}`,
      name: 'Trasa (offline)',
      waypoints,
      coordinates,
      distance: totalDistance,
      duration,
      profile,
      instructions: [
        {
          type: 'depart',
          instruction: 'Rozpocznij trasę',
          distance: totalDistance,
          duration,
          name: '',
          location: waypoints[0].coordinate,
        },
        {
          type: 'arrive',
          instruction: 'Dotarłeś do celu',
          distance: 0,
          duration: 0,
          name: '',
          location: waypoints[waypoints.length - 1].coordinate,
        },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate distance between two coordinates (meters)
   */
  private haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
    const R = 6371000; // Earth radius in meters
    const lat1 = (coord1[1] * Math.PI) / 180;
    const lat2 = (coord2[1] * Math.PI) / 180;
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export const osrmService = new OSRMService();
