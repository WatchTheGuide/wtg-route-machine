import React, { useEffect, useRef, useCallback } from 'react';
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

  // Create marker style
  const createMarkerStyle = useCallback(
    (waypointNumber: number, isGPS = false) => {
      const color = isGPS ? '#22c55e' : '#ff6600';
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
    },
    []
  );

  // Create route style
  const routeStyle = new Style({
    stroke: new Stroke({
      color: '#ff6600',
      width: 5,
      lineCap: 'round',
      lineJoin: 'round',
    }),
  });

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

    // Create map
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
        center: fromLonLat([center.lon, center.lat]),
        zoom,
      }),
    });

    // Handle click events
    map.on('click', (event) => {
      const coordinate = toLonLat(event.coordinate);
      onMapClick({ lon: coordinate[0], lat: coordinate[1] });
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    view.animate({
      center: fromLonLat([center.lon, center.lat]),
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

    waypoints.forEach((waypoint) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([waypoint.coordinate.lon, waypoint.coordinate.lat])
        ),
        waypointId: waypoint.id,
        waypointNumber: waypoint.order,
      });
      feature.setStyle(createMarkerStyle(waypoint.order, waypoint.isGPS));
      source.addFeature(feature);
    });
  }, [waypoints, createMarkerStyle]);

  // Update route display
  useEffect(() => {
    if (!routeLayerRef.current) return;

    const source = routeLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    if (route?.geometry) {
      // Decode polyline
      const coordinates = decodePolyline(route.geometry);
      const lineString = new LineString(
        coordinates.map((coord) => fromLonLat(coord))
      );

      const feature = new Feature({
        geometry: lineString,
        type: 'route',
      });
      feature.setStyle(routeStyle);
      source.addFeature(feature);
    }
  }, [route]);

  return <div ref={mapRef} className="map-container" />;
};

/**
 * Decode polyline from OSRM (polyline6 format)
 */
function decodePolyline(encoded: string, precision = 6): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lon = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlon = result & 1 ? ~(result >> 1) : result >> 1;
    lon += dlon;

    coordinates.push([
      lon / Math.pow(10, precision),
      lat / Math.pow(10, precision),
    ]);
  }

  return coordinates;
}

export default MapView;
