import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import { Modify } from 'ol/interaction';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import 'ol/ol.css';

import { Button } from '@/components/ui/button';
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Layers,
  Plus,
  Trash2,
  Navigation,
  ZoomIn,
  ZoomOut,
  LocateFixed,
} from 'lucide-react';
import type { Waypoint, Coordinate } from '@/types';

// Map layer types
type MapLayerType = 'streets' | 'satellite' | 'terrain';

interface MapEditorProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  cityCenter?: Coordinate;
  routeGeometry?: Coordinate[];
}

// City centers for initial map view
const cityCenters: Record<string, Coordinate> = {
  krakow: [19.9449, 50.0647],
  warszawa: [21.0122, 52.2297],
  wroclaw: [17.0385, 51.1079],
  trojmiasto: [18.6466, 54.352],
};

// Create waypoint style with number
const createWaypointStyle = (
  index: number,
  totalCount: number,
  isSelected: boolean = false
) => {
  const isFirst = index === 0;
  const isLast = index === totalCount - 1 && totalCount > 1;

  let fillColor = '#f97316'; // Orange for intermediate
  if (isFirst) fillColor = '#22c55e'; // Green for start
  if (isLast) fillColor = '#ef4444'; // Red for end

  return new Style({
    image: new CircleStyle({
      radius: isSelected ? 14 : 12,
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({
        color: isSelected ? '#1e40af' : '#ffffff',
        width: isSelected ? 3 : 2,
      }),
    }),
    text: new Text({
      text: String(index + 1),
      fill: new Fill({ color: '#ffffff' }),
      font: 'bold 12px sans-serif',
      offsetY: 1,
    }),
  });
};

// Route line style
const routeStyle = new Style({
  stroke: new Stroke({
    color: '#3b82f6',
    width: 4,
    lineDash: [10, 10],
  }),
});

// Waypoint connection line style (draft route)
const connectionStyle = new Style({
  stroke: new Stroke({
    color: '#94a3b8',
    width: 2,
    lineDash: [5, 5],
  }),
});

export function MapEditor({
  waypoints,
  onWaypointsChange,
  cityCenter,
  routeGeometry,
}: MapEditorProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const waypointsSourceRef = useRef<VectorSource>(new VectorSource());
  const routeSourceRef = useRef<VectorSource>(new VectorSource());
  const connectionSourceRef = useRef<VectorSource>(new VectorSource());

  const [mapLayer, setMapLayer] = useState<MapLayerType>('streets');
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    null
  );

  // Refs to hold current values for event handlers (closure fix)
  const isAddingModeRef = useRef(isAddingMode);
  const waypointsRef = useRef(waypoints);
  const onWaypointsChangeRef = useRef(onWaypointsChange);
  const tRef = useRef(t);

  // Keep refs in sync with state/props
  useEffect(() => {
    isAddingModeRef.current = isAddingMode;
  }, [isAddingMode]);

  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);

  useEffect(() => {
    onWaypointsChangeRef.current = onWaypointsChange;
  }, [onWaypointsChange]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center = cityCenter || cityCenters.krakow;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          properties: { name: 'streets' },
        }),
        new VectorLayer({
          source: connectionSourceRef.current,
          style: connectionStyle,
          properties: { name: 'connections' },
        }),
        new VectorLayer({
          source: routeSourceRef.current,
          style: routeStyle,
          properties: { name: 'route' },
        }),
        new VectorLayer({
          source: waypointsSourceRef.current,
          properties: { name: 'waypoints' },
        }),
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: 14,
      }),
    });

    // Add modify interaction for dragging waypoints
    const modify = new Modify({
      source: waypointsSourceRef.current,
      hitDetection: true,
    });

    modify.on('modifyend', (event) => {
      const features = event.features.getArray();
      if (features.length > 0) {
        const currentWaypoints = waypointsRef.current;
        const updatedWaypoints = currentWaypoints.map((wp) => {
          const feature = waypointsSourceRef.current.getFeatureById(wp.id);
          if (feature) {
            const geometry = feature.getGeometry() as Point;
            const coords = toLonLat(geometry.getCoordinates());
            return {
              ...wp,
              coordinates: [coords[0], coords[1]] as Coordinate,
            };
          }
          return wp;
        });
        onWaypointsChangeRef.current(updatedWaypoints);
      }
    });

    map.addInteraction(modify);

    // Add select interaction
    const select = new Select({
      condition: click,
      layers: (layer) => layer.get('name') === 'waypoints',
    });

    select.on('select', (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        const wpId = feature.getId() as string;
        setSelectedWaypointId(wpId);
      } else {
        setSelectedWaypointId(null);
      }
    });

    map.addInteraction(select);

    // Click handler for adding waypoints
    map.on('click', (event) => {
      if (!isAddingModeRef.current) return;

      const coords = toLonLat(event.coordinate);
      const currentWaypoints = waypointsRef.current;
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}`,
        name: tRef.current('mapEditor.newWaypoint', {
          number: currentWaypoints.length + 1,
        }),
        coordinates: [coords[0], coords[1]] as Coordinate,
        order: currentWaypoints.length + 1,
      };

      onWaypointsChangeRef.current([...currentWaypoints, newWaypoint]);
      setIsAddingMode(false);
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update connection lines between waypoints
  const updateConnectionLines = useCallback(() => {
    const source = connectionSourceRef.current;
    source.clear();

    if (waypoints.length < 2) return;

    const coordinates = waypoints.map((wp) => fromLonLat(wp.coordinates));
    const lineFeature = new Feature({
      geometry: new LineString(coordinates),
    });
    source.addFeature(lineFeature);
  }, [waypoints]);

  // Update waypoints on map
  useEffect(() => {
    const source = waypointsSourceRef.current;
    source.clear();

    waypoints.forEach((wp, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(wp.coordinates)),
      });
      feature.setId(wp.id);

      feature.setStyle(
        createWaypointStyle(
          index,
          waypoints.length,
          wp.id === selectedWaypointId
        )
      );

      source.addFeature(feature);
    });

    // Update connection lines
    updateConnectionLines();
  }, [waypoints, selectedWaypointId, updateConnectionLines]);

  // Update route geometry if available
  useEffect(() => {
    const source = routeSourceRef.current;
    source.clear();

    if (routeGeometry && routeGeometry.length > 1) {
      const coordinates = routeGeometry.map((coord) => fromLonLat(coord));
      const routeFeature = new Feature({
        geometry: new LineString(coordinates),
      });
      source.addFeature(routeFeature);
    }
  }, [routeGeometry]);

  // Change map layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const layers = map.getLayers().getArray();
    const baseLayer = layers.find((l) =>
      ['streets', 'satellite', 'terrain'].includes(l.get('name'))
    );

    if (baseLayer) {
      map.removeLayer(baseLayer);
    }

    let newSource;
    switch (mapLayer) {
      case 'satellite':
        newSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19,
        });
        break;
      case 'terrain':
        newSource = new XYZ({
          url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
          maxZoom: 17,
        });
        break;
      default:
        newSource = new OSM();
    }

    const newLayer = new TileLayer({
      source: newSource,
      properties: { name: mapLayer },
    });

    map.getLayers().insertAt(0, newLayer);
  }, [mapLayer]);

  // Center map on city
  useEffect(() => {
    if (!mapInstanceRef.current || !cityCenter) return;

    mapInstanceRef.current.getView().animate({
      center: fromLonLat(cityCenter),
      duration: 500,
    });
  }, [cityCenter]);

  // Zoom controls
  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: view.getZoom()! + 1, duration: 250 });
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: view.getZoom()! - 1, duration: 250 });
  };

  // Fit map to waypoints
  const handleFitToWaypoints = () => {
    if (!mapInstanceRef.current || waypoints.length === 0) return;

    const extent = waypointsSourceRef.current.getExtent();
    mapInstanceRef.current.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 16,
      duration: 500,
    });
  };

  // Delete selected waypoint
  const handleDeleteSelected = () => {
    if (!selectedWaypointId) return;

    const updatedWaypoints = waypoints
      .filter((wp) => wp.id !== selectedWaypointId)
      .map((wp, index) => ({ ...wp, order: index + 1 }));

    onWaypointsChange(updatedWaypoints);
    setSelectedWaypointId(null);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {t('mapEditor.title')}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Layer selector */}
            <UISelect
              value={mapLayer}
              onValueChange={(v) => setMapLayer(v as MapLayerType)}>
              <SelectTrigger className="w-[120px] h-8">
                <Layers className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="streets">
                  {t('mapEditor.layers.streets')}
                </SelectItem>
                <SelectItem value="satellite">
                  {t('mapEditor.layers.satellite')}
                </SelectItem>
                <SelectItem value="terrain">
                  {t('mapEditor.layers.terrain')}
                </SelectItem>
              </SelectContent>
            </UISelect>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {/* Map container */}
        <div className="relative flex-1 min-h-[300px]">
          <div
            ref={mapRef}
            className="absolute inset-0"
            style={{ cursor: isAddingMode ? 'crosshair' : 'grab' }}
          />

          {/* Map controls overlay - waypoint operations (bottom left) */}
          <div className="absolute bottom-12 left-2 flex flex-col gap-1">
            <Button
              type="button"
              variant={isAddingMode ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setIsAddingMode(!isAddingMode)}
              title={t('mapEditor.addWaypoint')}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={!selectedWaypointId}
              title={t('mapEditor.deleteWaypoint')}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom controls (top right) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFitToWaypoints}
              disabled={waypoints.length === 0}
              title={t('mapEditor.fitToWaypoints')}>
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>

          {/* Adding mode indicator */}
          {isAddingMode && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              {t('mapEditor.clickToAdd')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
