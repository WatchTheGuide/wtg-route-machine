/**
 * Tests for Export Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportService,
  formatDistance,
  formatDuration,
} from './export.service';
import { Route, Waypoint } from '../types/route.types';

describe('exportService', () => {
  const mockRoute: Route = {
    coordinates: [
      [19.9385, 50.0647],
      [19.94, 50.065],
      [19.945, 50.07],
    ],
    distance: 1500,
    duration: 900,
    instructions: [],
  };

  const mockWaypoints: Waypoint[] = [
    { id: '1', coordinate: [19.9385, 50.0647], address: 'Rynek Główny' },
    { id: '2', coordinate: [19.94, 50.065], address: 'Sukiennice' },
    { id: '3', coordinate: [19.945, 50.07], address: 'Wawel' },
  ];

  describe('formatDistance', () => {
    it('should format meters correctly', () => {
      expect(formatDistance(500)).toBe('500 m');
      expect(formatDistance(0)).toBe('0 m');
      expect(formatDistance(999)).toBe('999 m');
    });

    it('should format kilometers correctly', () => {
      expect(formatDistance(1000)).toBe('1.00 km');
      expect(formatDistance(1500)).toBe('1.50 km');
      expect(formatDistance(10000)).toBe('10.00 km');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(60)).toBe('1 min');
      expect(formatDuration(300)).toBe('5 min');
      expect(formatDuration(3540)).toBe('59 min');
    });

    it('should format hours and minutes correctly', () => {
      expect(formatDuration(3600)).toBe('1 godz 0 min');
      expect(formatDuration(5400)).toBe('1 godz 30 min');
      expect(formatDuration(7200)).toBe('2 godz 0 min');
    });
  });

  describe('exportToGeoJSON', () => {
    it('should create valid GeoJSON FeatureCollection', () => {
      const geojson = exportService.exportToGeoJSON(mockRoute, mockWaypoints);

      expect(geojson.type).toBe('FeatureCollection');
      expect(geojson.features).toBeDefined();
      expect(Array.isArray(geojson.features)).toBe(true);
    });

    it('should include route line as first feature', () => {
      const geojson = exportService.exportToGeoJSON(mockRoute, mockWaypoints);
      const routeFeature = geojson.features[0];

      expect(routeFeature.type).toBe('Feature');
      expect(routeFeature.geometry.type).toBe('LineString');
      expect(routeFeature.geometry.coordinates).toEqual(mockRoute.coordinates);
    });

    it('should include route properties', () => {
      const geojson = exportService.exportToGeoJSON(mockRoute, mockWaypoints, {
        cityName: 'Kraków',
        profile: 'foot',
        profileName: 'Pieszo',
      });

      const props = geojson.features[0].properties;

      expect(props.name).toBe('GuideTrackee Route');
      expect(props.city).toBe('Kraków');
      expect(props.profile).toBe('foot');
      expect(props.profileName).toBe('Pieszo');
      expect(props.distance).toBe(1500);
      expect(props.duration).toBe(900);
    });

    it('should include waypoint markers', () => {
      const geojson = exportService.exportToGeoJSON(mockRoute, mockWaypoints);

      // Should have 1 route + 3 waypoints = 4 features
      expect(geojson.features).toHaveLength(4);

      // Check first waypoint (start)
      const startPoint = geojson.features[1];
      expect(startPoint.geometry.type).toBe('Point');
      expect(startPoint.properties.markerType).toBe('start');
      expect(startPoint.properties.order).toBe(1);

      // Check last waypoint (end)
      const endPoint = geojson.features[3];
      expect(endPoint.properties.markerType).toBe('end');
      expect(endPoint.properties.order).toBe(3);
    });

    it('should include waypoint addresses', () => {
      const geojson = exportService.exportToGeoJSON(mockRoute, mockWaypoints);

      expect(geojson.features[1].properties.address).toBe('Rynek Główny');
      expect(geojson.features[2].properties.address).toBe('Sukiennice');
      expect(geojson.features[3].properties.address).toBe('Wawel');
    });
  });

  describe('downloadGeoJSON', () => {
    let mockCreateElement: ReturnType<typeof vi.spyOn>;
    let mockAppendChild: ReturnType<typeof vi.spyOn>;
    let mockRemoveChild: ReturnType<typeof vi.spyOn>;
    let mockLink: {
      href: string;
      download: string;
      click: ReturnType<typeof vi.fn>;
    };
    let originalCreateObjectURL: typeof URL.createObjectURL;
    let originalRevokeObjectURL: typeof URL.revokeObjectURL;

    beforeEach(() => {
      mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      mockCreateElement = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as unknown as HTMLElement);
      mockAppendChild = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as unknown as HTMLElement);
      mockRemoveChild = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockLink as unknown as HTMLElement);

      // Mock URL methods by replacing them directly
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('should create download link and trigger click', () => {
      exportService.downloadGeoJSON(mockRoute, mockWaypoints);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toContain('guidetrackee-route-');
      expect(mockLink.download).toContain('.geojson');
    });

    it('should cleanup after download', () => {
      exportService.downloadGeoJSON(mockRoute, mockWaypoints);

      expect(mockRemoveChild).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });
  });

  describe('generatePDFDefinition', () => {
    it('should create valid PDF document definition', () => {
      const instructions = [
        {
          text: 'Rozpocznij na Floriańskiej',
          distance: 100,
          maneuverType: 'depart',
          icon: 'play',
        },
        {
          text: 'Skręć w prawo',
          distance: 200,
          maneuverType: 'turn',
          maneuverModifier: 'right',
          icon: 'arrow-right',
        },
        {
          text: 'Dotarłeś do celu',
          distance: 0,
          maneuverType: 'arrive',
          icon: 'flag',
        },
      ];

      const docDef = exportService.generatePDFDefinition(
        mockRoute,
        mockWaypoints,
        instructions,
        { cityName: 'Kraków', profileName: 'Pieszo' }
      );

      expect(docDef).toBeDefined();
      expect((docDef as { pageSize: string }).pageSize).toBe('A4');
      expect((docDef as { content: unknown[] }).content).toBeDefined();
    });
  });

  describe('shareRoute', () => {
    it('should return false if Web Share API not available', async () => {
      // navigator.share is undefined by default in jsdom
      const result = await exportService.shareRoute(mockRoute, mockWaypoints);
      expect(result).toBe(false);
    });
  });
});
