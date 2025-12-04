import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import { Coordinate, Waypoint, Route } from '../../types/route.types';
import './MapView.css';

interface MapViewProps {
  center: Coordinate;
  zoom: number;
  waypoints: Waypoint[];
  route: Route | null;
  onMapClick: (coordinate: Coordinate) => void;
  onWaypointDrag?: (waypointId: string, newCoordinate: Coordinate) => void;
}

const MapView: React.FC<MapViewProps> = ({
  center,
  zoom,
  waypoints,
  route,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const routeLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const onMapClickRef = useRef(onMapClick);

  // Keep onMapClick ref updated
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Create marker style
  const createMarkerStyle = useCallback((waypointNumber: number) => {
    const color = '#ff6600';
    return new Style({
      image: new CircleStyle({
        radius: 16,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
      }),
      text: new Text({
        text: waypointNumber.toString(),
        fill: new Fill({ color: '#ffffff' }),
        font: 'bold 12px sans-serif',
        offsetY: 1,
      }),
    });
  }, []);

  // Create route style - memoized to avoid recreating
  const routeStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: '#ff6600',
          width: 5,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      }),
    []
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create marker layer
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
      zIndex: 20,
    });
    markerLayerRef.current = markerLayer;

    // Create route layer
    const routeSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeSource,
      zIndex: 10,
    });
    routeLayerRef.current = routeLayer;

    // Initial center and zoom (from props at mount time)
    const initialCenter = center;
    const initialZoom = zoom;

    // Create map - center is now [lon, lat] tuple
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        routeLayer,
        markerLayer,
      ],
      view: new View({
        center: fromLonLat([initialCenter[0], initialCenter[1]]),
        zoom: initialZoom,
      }),
    });

    // Handle click events using ref to avoid stale closure
    // Return coordinate as [lon, lat] tuple
    map.on('click', (event) => {
      const coordinate = toLonLat(event.coordinate);
      onMapClickRef.current([coordinate[0], coordinate[1]]);
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    // center is now [lon, lat] tuple
    view.animate({
      center: fromLonLat([center[0], center[1]]),
      zoom,
      duration: 500,
    });
  }, [center, zoom]);

  // Update waypoint markers
  useEffect(() => {
    if (!markerLayerRef.current) return;

    const source = markerLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    waypoints.forEach((waypoint, index) => {
      const feature = new Feature({
        geometry: new Point(
          // coordinate is now [lon, lat] tuple
          fromLonLat([waypoint.coordinate[0], waypoint.coordinate[1]])
        ),
        waypointId: waypoint.id,
        waypointNumber: index + 1,
      });
      feature.setStyle(createMarkerStyle(index + 1));
      source.addFeature(feature);
    });
  }, [waypoints, createMarkerStyle]);

  // Update route display
  useEffect(() => {
    if (!routeLayerRef.current) return;

    const source = routeLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    // Route now has coordinates array instead of geometry
    if (route?.coordinates && route.coordinates.length > 0) {
      const lineString = new LineString(
        route.coordinates.map((coord) => fromLonLat(coord))
      );

      const feature = new Feature({
        geometry: lineString,
        type: 'route',
      });
      feature.setStyle(routeStyle);
      source.addFeature(feature);
    }
  }, [route, routeStyle]);

  return <div ref={mapRef} className="map-container" />;
};

export default MapView;
