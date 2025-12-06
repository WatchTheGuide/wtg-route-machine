import { Coordinate, Route, RoutingProfile, RouteStep } from '../types';

/**
 * Konfiguracja OSRM
 */
interface OSRMConfig {
  baseUrl: string;
}

/**
 * Odpowiedź OSRM Route API
 */
interface OSRMRouteResponse {
  code: string;
  routes: Array<{
    geometry: {
      coordinates: Coordinate[];
    };
    distance: number;
    duration: number;
    legs: Array<{
      steps: Array<{
        maneuver: {
          instruction?: string;
          type: string;
          modifier?: string;
          location: [number, number];
        };
        distance: number;
        duration: number;
        name: string;
      }>;
    }>;
  }>;
  waypoints: Array<{
    location: [number, number];
    name: string;
  }>;
}

/**
 * Tłumaczenie instrukcji na polski
 */
const translateInstruction = (
  type: string,
  modifier?: string,
  streetName?: string
): string => {
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
    turn: 'Skręć',
    'new name': 'Kontynuuj',
    depart: 'Rozpocznij',
    arrive: 'Dotarłeś do celu',
    merge: 'Włącz się',
    'on ramp': 'Wjedź na',
    'off ramp': 'Zjedź z',
    fork: 'Na rozwidleniu',
    'end of road': 'Na końcu drogi',
    continue: 'Kontynuuj',
    roundabout: 'Na rondzie',
    rotary: 'Na rondzie',
    'roundabout turn': 'Na rondzie skręć',
    notification: '',
    'exit roundabout': 'Zjedź z ronda',
    'exit rotary': 'Zjedź z ronda',
  };

  const translatedModifier = modifier ? modifierMap[modifier] || modifier : '';
  const translatedType = typeMap[type] || type;

  if (type === 'arrive') {
    return 'Dotarłeś do celu';
  }

  if (type === 'depart') {
    return streetName ? `Rozpocznij trasę ${streetName}` : 'Rozpocznij trasę';
  }

  if (translatedModifier) {
    return streetName
      ? `${translatedType} ${translatedModifier} na ${streetName}`
      : `${translatedType} ${translatedModifier}`;
  }

  return streetName ? `${translatedType} na ${streetName}` : translatedType;
};

/**
 * Serwis OSRM do obliczania tras
 */
class OSRMService {
  private config: OSRMConfig;

  constructor() {
    // Domyślny URL - zostanie zaktualizowany przed użyciem
    this.config = {
      baseUrl: 'http://localhost:5001',
    };
  }

  /**
   * Ustawia bazowy URL serwera OSRM
   */
  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  /**
   * Buduje URL dla OSRM Route API
   */
  private buildRouteUrl(
    waypoints: Coordinate[],
    profile: RoutingProfile
  ): string {
    const coordinates = waypoints.map((wp) => `${wp[0]},${wp[1]}`).join(';');

    return `${this.config.baseUrl}/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true`;
  }

  /**
   * Oblicza trasę między waypoints
   */
  async calculateRoute(
    waypoints: Coordinate[],
    profile: RoutingProfile = 'foot'
  ): Promise<Route> {
    if (waypoints.length < 2) {
      throw new Error('Potrzeba minimum 2 punktów do obliczenia trasy');
    }

    const url = this.buildRouteUrl(waypoints, profile);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OSRM error: ${response.status}`);
      }

      const data: OSRMRouteResponse = await response.json();

      if (data.code !== 'Ok') {
        throw new Error(`OSRM error: ${data.code}`);
      }

      const route = data.routes[0];

      // Przekształć kroki na nasz format
      const steps: RouteStep[] = [];
      for (const leg of route.legs) {
        for (const step of leg.steps) {
          steps.push({
            instruction: translateInstruction(
              step.maneuver.type,
              step.maneuver.modifier,
              step.name || undefined
            ),
            distance: step.distance,
            duration: step.duration,
            coordinate: step.maneuver.location,
          });
        }
      }

      return {
        coordinates: route.geometry.coordinates,
        distance: route.distance,
        duration: route.duration,
        steps,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Błąd obliczania trasy: ${error.message}`);
      }
      throw new Error('Nieznany błąd obliczania trasy');
    }
  }

  /**
   * Znajduje najbliższy punkt na sieci dróg
   */
  async findNearest(
    coordinate: Coordinate,
    profile: RoutingProfile = 'foot'
  ): Promise<Coordinate | null> {
    const url = `${this.config.baseUrl}/nearest/v1/${profile}/${coordinate[0]},${coordinate[1]}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.code !== 'Ok' || !data.waypoints?.length) {
        return null;
      }

      return data.waypoints[0].location as Coordinate;
    } catch {
      return null;
    }
  }
}

// Eksportuj singleton
export const osrmService = new OSRMService();
