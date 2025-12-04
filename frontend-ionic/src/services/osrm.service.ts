/**
 * OSRM API Service
 * Handles communication with OSRM routing server
 */

import { Coordinate, Route, RoutingProfile } from '../types/route.types';
import { CONFIG } from '../config/app.config';

export interface OsrmResponse {
  code: string;
  message?: string;
  routes: OsrmRoute[];
  waypoints: OsrmWaypoint[];
}

export interface OsrmRoute {
  geometry: string;
  legs: OsrmLeg[];
  distance: number;
  duration: number;
  weight: number;
  weight_name: string;
}

export interface OsrmLeg {
  distance: number;
  duration: number;
  steps: OsrmStep[];
  summary: string;
}

export interface OsrmStep {
  distance: number;
  duration: number;
  geometry: string;
  name: string;
  mode: string;
  maneuver: OsrmManeuver;
  intersections: OsrmIntersection[];
}

export interface OsrmManeuver {
  type: string;
  modifier?: string;
  location: [number, number];
  bearing_before: number;
  bearing_after: number;
}

export interface OsrmIntersection {
  location: [number, number];
  bearings: number[];
  entry: boolean[];
  out?: number;
  in?: number;
}

export interface OsrmWaypoint {
  name: string;
  location: [number, number];
  hint: string;
  distance: number;
}

export interface NavigationInstruction {
  text: string;
  distance: number;
  maneuverType: string;
  maneuverModifier?: string;
  icon: string;
}

/**
 * Error codes from OSRM API
 */
export type OsrmErrorCode =
  | 'Ok'
  | 'InvalidUrl'
  | 'InvalidService'
  | 'InvalidVersion'
  | 'InvalidOptions'
  | 'InvalidQuery'
  | 'InvalidValue'
  | 'NoSegment'
  | 'TooBig'
  | 'NoRoute'
  | 'NoTable'
  | 'NotImplemented';

export class OsrmError extends Error {
  constructor(public code: OsrmErrorCode, message: string) {
    super(message);
    this.name = 'OsrmError';
  }
}

/**
 * Decode polyline encoded geometry from OSRM
 * @param encoded - Encoded polyline string
 * @param precision - Precision (5 for polyline, 6 for polyline6)
 * @returns Array of [lon, lat] coordinates
 */
export function decodePolyline(encoded: string, precision = 5): Coordinate[] {
  const factor = Math.pow(10, precision);
  const coordinates: Coordinate[] = [];
  let index = 0;
  let lat = 0;
  let lon = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLon = result & 1 ? ~(result >> 1) : result >> 1;
    lon += deltaLon;

    coordinates.push([lon / factor, lat / factor]);
  }

  return coordinates;
}

/**
 * Get icon name for maneuver type
 */
export function getManeuverIcon(maneuver: OsrmManeuver): string {
  const type = maneuver.type;
  const modifier = maneuver.modifier;

  if (type === 'depart') return 'play-circle-outline';
  if (type === 'arrive') return 'flag-outline';

  if (type === 'roundabout' || type === 'rotary') {
    return 'sync-outline';
  }

  if (type === 'turn' || type === 'end of road') {
    switch (modifier) {
      case 'left':
      case 'sharp left':
        return 'arrow-back-outline';
      case 'right':
      case 'sharp right':
        return 'arrow-forward-outline';
      case 'slight left':
        return 'arrow-up-outline';
      case 'slight right':
        return 'arrow-up-outline';
      case 'uturn':
        return 'arrow-down-outline';
      default:
        return 'arrow-up-outline';
    }
  }

  if (type === 'continue' || type === 'new name') {
    return 'arrow-up-outline';
  }

  if (type === 'fork') {
    if (modifier === 'left' || modifier === 'slight left') {
      return 'git-branch-outline';
    }
    return 'git-branch-outline';
  }

  if (type === 'merge') {
    return 'git-merge-outline';
  }

  return 'navigate-outline';
}

/**
 * Format instruction text from OSRM step
 */
function formatInstruction(step: OsrmStep): string {
  const maneuver = step.maneuver;
  const type = maneuver.type;
  const modifier = maneuver.modifier;
  const name = step.name || 'droga bez nazwy';

  if (type === 'depart') {
    return `Rozpocznij na ${name}`;
  }

  if (type === 'arrive') {
    return 'Dotarłeś do celu';
  }

  if (type === 'roundabout' || type === 'rotary') {
    return `Na rondzie skręć w ${name}`;
  }

  if (type === 'turn') {
    const direction = getPolishDirection(modifier);
    return `Skręć ${direction} w ${name}`;
  }

  if (type === 'end of road') {
    const direction = getPolishDirection(modifier);
    return `Na końcu drogi skręć ${direction} w ${name}`;
  }

  if (type === 'continue' || type === 'new name') {
    return `Kontynuuj ${name}`;
  }

  if (type === 'fork') {
    const direction = modifier?.includes('left') ? 'w lewo' : 'w prawo';
    return `Na rozwidleniu trzymaj się ${direction} na ${name}`;
  }

  if (type === 'merge') {
    return `Włącz się na ${name}`;
  }

  return `Kontynuuj na ${name}`;
}

/**
 * Get Polish direction text from modifier
 */
function getPolishDirection(modifier?: string): string {
  switch (modifier) {
    case 'left':
      return 'w lewo';
    case 'right':
      return 'w prawo';
    case 'sharp left':
      return 'ostro w lewo';
    case 'sharp right':
      return 'ostro w prawo';
    case 'slight left':
      return 'lekko w lewo';
    case 'slight right':
      return 'lekko w prawo';
    case 'uturn':
      return 'zawróć';
    case 'straight':
      return 'prosto';
    default:
      return '';
  }
}

/**
 * Parse navigation instructions from OSRM response
 */
export function parseNavigationInstructions(
  response: OsrmResponse
): NavigationInstruction[] {
  if (!response.routes?.[0]?.legs) {
    return [];
  }

  const instructions: NavigationInstruction[] = [];
  const route = response.routes[0];

  route.legs.forEach((leg) => {
    if (!leg.steps) return;

    leg.steps.forEach((step, stepIndex) => {
      // Skip the last step of each leg (arrival)
      if (stepIndex === leg.steps.length - 1) return;

      instructions.push({
        text: formatInstruction(step),
        distance: step.distance,
        maneuverType: step.maneuver.type,
        maneuverModifier: step.maneuver.modifier,
        icon: getManeuverIcon(step.maneuver),
      });
    });
  });

  // Add final arrival instruction
  instructions.push({
    text: 'Dotarłeś do celu',
    distance: 0,
    maneuverType: 'arrive',
    icon: 'flag-outline',
  });

  return instructions;
}

/**
 * OSRM Service class for routing operations
 */
class OsrmService {
  /**
   * Calculate route between waypoints
   */
  async calculateRoute(
    waypoints: Coordinate[],
    profile: RoutingProfile = 'foot'
  ): Promise<Route> {
    if (!waypoints || waypoints.length < 2) {
      throw new Error('At least 2 waypoints required for routing');
    }

    const baseUrl = CONFIG.getOsrmUrl(profile);
    const coordinates = waypoints.map((wp) => `${wp[0]},${wp[1]}`).join(';');
    const osrmUrl = `${baseUrl}/route/v1/${profile}/${coordinates}?overview=full&steps=true`;

    console.log('Calculating route:', osrmUrl);

    const headers = CONFIG.getHeaders();
    const response = await fetch(osrmUrl, { headers });

    if (!response.ok) {
      throw new OsrmError(
        'InvalidUrl',
        `Nie można połączyć się z serwerem OSRM (${response.status})`
      );
    }

    const data: OsrmResponse = await response.json();

    if (data.code !== 'Ok') {
      const errorMessage = this.getErrorMessage(data.code as OsrmErrorCode);
      throw new OsrmError(data.code as OsrmErrorCode, errorMessage);
    }

    const osrmRoute = data.routes[0];
    const decodedCoordinates = decodePolyline(osrmRoute.geometry);
    const instructions = parseNavigationInstructions(data);

    console.log('Route calculated successfully');
    console.log('Distance:', (osrmRoute.distance / 1000).toFixed(2), 'km');
    console.log('Duration:', (osrmRoute.duration / 60).toFixed(0), 'min');

    return {
      coordinates: decodedCoordinates,
      distance: osrmRoute.distance,
      duration: osrmRoute.duration,
      instructions,
    };
  }

  /**
   * Get user-friendly error message for OSRM error code
   */
  private getErrorMessage(code: OsrmErrorCode): string {
    switch (code) {
      case 'NoRoute':
        return 'Nie znaleziono trasy między wybranymi punktami. Upewnij się, że punkty znajdują się na drogach.';
      case 'NoSegment':
        return 'Jeden lub więcej punktów jest zbyt daleko od najbliższej drogi.';
      case 'TooBig':
        return 'Trasa jest zbyt długa. Spróbuj podzielić ją na krótsze segmenty.';
      case 'InvalidQuery':
      case 'InvalidValue':
        return 'Nieprawidłowe parametry zapytania.';
      default:
        return `Błąd wyznaczania trasy: ${code}`;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(coordinate: Coordinate): Promise<string> {
    const [lon, lat] = coordinate;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'GuideTrackee Routes/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      if (data.address) {
        const { road, house_number, city, town, village } = data.address;
        const street = road || '';
        const number = house_number ? ` ${house_number}` : '';
        const locality = city || town || village || '';

        if (street && locality) {
          return `${street}${number}, ${locality}`;
        } else if (street) {
          return `${street}${number}`;
        } else if (data.display_name) {
          return data.display_name.split(',').slice(0, 2).join(',');
        }
      }

      return data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  }
}

export const osrmService = new OsrmService();
