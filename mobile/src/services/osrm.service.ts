/**
 * WTG Routes - OSRM Service
 *
 * Communicates with OSRM routing backend
 */

import { config } from '../config';
import type {
  Coordinate,
  Route,
  RouteStep,
  RoutingProfile,
  Waypoint,
} from '../types';

interface OSRMRouteResponse {
  code: string;
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
      type: string;
    };
    legs: Array<{
      summary: string;
      weight: number;
      duration: number;
      distance: number;
      steps: Array<{
        geometry: {
          coordinates: [number, number][];
          type: string;
        };
        maneuver: {
          bearing_after: number;
          bearing_before: number;
          location: [number, number];
          modifier?: string;
          type: string;
          exit?: number;
        };
        mode: string;
        driving_side: string;
        name: string;
        intersections: any[];
        weight: number;
        duration: number;
        distance: number;
        ref?: string;
      }>;
    }>;
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
  }>;
  waypoints: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }>;
}

class OSRMService {
  /**
   * Get OSRM endpoint for city and profile
   */
  private getEndpoint(cityId: string, profile: RoutingProfile): string {
    const cityConfig = config.cities.find((c) => c.id === cityId);
    if (!cityConfig) {
      throw new Error(`Unknown city: ${cityId}`);
    }

    const port = cityConfig.osrmPorts[profile];
    return `${config.baseUrl}:${port}`;
  }

  /**
   * Calculate route between waypoints
   */
  async calculateRoute(
    cityId: string,
    waypoints: Waypoint[],
    profile: RoutingProfile = 'foot'
  ): Promise<Route> {
    if (waypoints.length < 2) {
      throw new Error('At least 2 waypoints required');
    }

    const endpoint = this.getEndpoint(cityId, profile);

    // Build coordinates string: lon,lat;lon,lat;...
    const coordinates = waypoints
      .map((wp) => `${wp.coordinate[0]},${wp.coordinate[1]}`)
      .join(';');

    const url =
      `${endpoint}/route/v1/${profile}/${coordinates}?` +
      'overview=full&geometries=geojson&steps=true&annotations=true';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM request failed: ${response.statusText}`);
    }

    const data: OSRMRouteResponse = await response.json();

    if (data.code !== 'Ok' || !data.routes.length) {
      throw new Error('No route found');
    }

    const route = data.routes[0];

    // Extract steps from all legs
    const steps: RouteStep[] = route.legs.flatMap((leg) =>
      leg.steps.map((step) => ({
        instruction: this.formatInstruction(step.maneuver, step.name),
        distance: step.distance,
        duration: step.duration,
        maneuver: step.maneuver.type,
        modifier: step.maneuver.modifier,
        name: step.name,
        geometry: step.geometry.coordinates as Coordinate[],
      }))
    );

    return {
      geometry: route.geometry.coordinates as Coordinate[],
      distance: route.distance,
      duration: route.duration,
      steps,
      profile,
    };
  }

  /**
   * Get nearest road point to a coordinate
   */
  async getNearestPoint(
    cityId: string,
    coordinate: Coordinate,
    profile: RoutingProfile = 'foot'
  ): Promise<{ coordinate: Coordinate; name: string; distance: number }> {
    const endpoint = this.getEndpoint(cityId, profile);

    const url = `${endpoint}/nearest/v1/${profile}/${coordinate[0]},${coordinate[1]}?number=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM nearest request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.waypoints.length) {
      throw new Error('No nearest point found');
    }

    const waypoint = data.waypoints[0];

    return {
      coordinate: waypoint.location as Coordinate,
      name: waypoint.name || '',
      distance: waypoint.distance,
    };
  }

  /**
   * Calculate distance matrix between points (for optimization)
   */
  async getDistanceMatrix(
    cityId: string,
    coordinates: Coordinate[],
    profile: RoutingProfile = 'foot'
  ): Promise<{ distances: number[][]; durations: number[][] }> {
    const endpoint = this.getEndpoint(cityId, profile);

    const coords = coordinates.map((c) => `${c[0]},${c[1]}`).join(';');

    const url = `${endpoint}/table/v1/${profile}/${coords}?annotations=distance,duration`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM table request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error('Distance matrix calculation failed');
    }

    return {
      distances: data.distances,
      durations: data.durations,
    };
  }

  /**
   * Format maneuver instruction for navigation
   */
  private formatInstruction(
    maneuver: { type: string; modifier?: string; exit?: number },
    streetName: string
  ): string {
    const { type, modifier, exit } = maneuver;
    const street = streetName ? ` na ${streetName}` : '';

    const instructions: Record<string, string> = {
      depart: `Rozpocznij trasę${street}`,
      arrive: `Dotarłeś do celu${street}`,
      'turn-left': `Skręć w lewo${street}`,
      'turn-right': `Skręć w prawo${street}`,
      'turn-slight left': `Skręć lekko w lewo${street}`,
      'turn-slight right': `Skręć lekko w prawo${street}`,
      'turn-sharp left': `Skręć ostro w lewo${street}`,
      'turn-sharp right': `Skręć ostro w prawo${street}`,
      'turn-uturn': `Zawróć${street}`,
      'continue-straight': `Idź prosto${street}`,
      continue: `Kontynuuj${street}`,
      roundabout: exit
        ? `Na rondzie wybierz ${exit}. zjazd${street}`
        : `Przejedź przez rondo${street}`,
      rotary: exit
        ? `Na rondzie wybierz ${exit}. zjazd${street}`
        : `Przejedź przez rondo${street}`,
      'fork-left': `Trzymaj się lewej strony${street}`,
      'fork-right': `Trzymaj się prawej strony${street}`,
      'end of road-left': `Na końcu drogi skręć w lewo${street}`,
      'end of road-right': `Na końcu drogi skręć w prawo${street}`,
      'merge-left': `Włącz się w lewo${street}`,
      'merge-right': `Włącz się w prawo${street}`,
      'new name': `Kontynuuj${street}`,
      notification: `Zwróć uwagę${street}`,
    };

    const key = modifier ? `${type}-${modifier}` : type;
    return instructions[key] || instructions[type] || `Idź${street}`;
  }
}

export const osrmService = new OSRMService();
