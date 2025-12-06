import { SavedRoute, Coordinate } from '../types';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Format eksportu trasy
 */
export type ExportFormat = 'geojson' | 'gpx';

/**
 * GeoJSON Feature dla trasy
 */
interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString' | 'Point';
    coordinates: number[] | number[][];
  };
  properties: Record<string, unknown>;
}

/**
 * Konwertuje trasę do GeoJSON
 */
const toGeoJSON = (route: SavedRoute): GeoJSONFeatureCollection => {
  const features: GeoJSONFeature[] = [];

  // Dodaj linię trasy
  if (route.route.coordinates.length > 0) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.route.coordinates,
      },
      properties: {
        name: route.name,
        description: route.description || '',
        profile: route.profile,
        distance: route.route.distance,
        duration: route.route.duration,
      },
    });
  }

  // Dodaj waypoints jako punkty
  route.waypoints.forEach((waypoint, index) => {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: waypoint.coordinate,
      },
      properties: {
        name: waypoint.name || `Waypoint ${index + 1}`,
        order: index + 1,
        type: 'waypoint',
      },
    });
  });

  return {
    type: 'FeatureCollection',
    features,
  };
};

/**
 * Konwertuje trasę do GPX
 */
const toGPX = (route: SavedRoute): string => {
  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const now = new Date().toISOString();

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="WTG Route Machine"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(route.name)}</name>
    <desc>${escapeXml(route.description || '')}</desc>
    <time>${now}</time>
  </metadata>
`;

  // Waypoints
  route.waypoints.forEach((waypoint, index) => {
    const [lon, lat] = waypoint.coordinate;
    const name = waypoint.name || `Waypoint ${index + 1}`;
    gpx += `  <wpt lat="${lat}" lon="${lon}">
    <name>${escapeXml(name)}</name>
  </wpt>
`;
  });

  // Track (trasa)
  gpx += `  <trk>
    <name>${escapeXml(route.name)}</name>
    <desc>Profile: ${route.profile}, Distance: ${
    route.route.distance
  }m, Duration: ${route.route.duration}s</desc>
    <trkseg>
`;

  route.route.coordinates.forEach((coord: Coordinate) => {
    const [lon, lat] = coord;
    gpx += `      <trkpt lat="${lat}" lon="${lon}"></trkpt>
`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
};

/**
 * Generuje nazwę pliku
 */
const generateFilename = (route: SavedRoute, format: ExportFormat): string => {
  const safeName = route.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${safeName}-${timestamp}.${format}`;
};

/**
 * Eksportuje trasę do pliku i udostępnia
 */
export const exportRoute = async (
  route: SavedRoute,
  format: ExportFormat
): Promise<void> => {
  // Generuj zawartość
  let content: string;

  if (format === 'geojson') {
    content = JSON.stringify(toGeoJSON(route), null, 2);
  } else {
    content = toGPX(route);
  }

  const filename = generateFilename(route, format);

  try {
    // Zapisz plik tymczasowo
    const result = await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });

    // Udostępnij plik
    await Share.share({
      title: route.name,
      text: `Route: ${route.name}`,
      url: result.uri,
      dialogTitle: `Export ${format.toUpperCase()}`,
    });
  } catch (error) {
    console.error(`Failed to export route as ${format}:`, error);
    throw error;
  }
};

/**
 * Eksportuje trasę jako GeoJSON
 */
export const exportAsGeoJSON = (route: SavedRoute): Promise<void> => {
  return exportRoute(route, 'geojson');
};

/**
 * Eksportuje trasę jako GPX
 */
export const exportAsGPX = (route: SavedRoute): Promise<void> => {
  return exportRoute(route, 'gpx');
};

/**
 * Zwraca zawartość GeoJSON jako string (do kopiowania)
 */
export const getGeoJSONString = (route: SavedRoute): string => {
  return JSON.stringify(toGeoJSON(route), null, 2);
};

/**
 * Zwraca zawartość GPX jako string (do kopiowania)
 */
export const getGPXString = (route: SavedRoute): string => {
  return toGPX(route);
};
