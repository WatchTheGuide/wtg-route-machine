import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { Coordinate } from '../../types';
import 'ol/ol.css';
import './MapView.css';

export interface MapViewProps {
  /** Centrum mapy [lon, lat] */
  center?: Coordinate;
  /** Poziom zoomu (domyślnie 14) */
  zoom?: number;
  /** Punkty POI do wyświetlenia */
  pois?: Array<{
    id: string;
    position: Coordinate;
    name: string;
    category?: string;
  }>;
  /** Trasa do wyświetlenia jako tablica współrzędnych */
  route?: Coordinate[];
  /** Pozycja użytkownika [lon, lat] */
  userPosition?: Coordinate;
  /** Callback przy kliknięciu na mapę */
  onMapClick?: (coordinate: Coordinate) => void;
  /** Callback przy kliknięciu na POI */
  onPoiClick?: (poiId: string) => void;
  /** Klasa CSS */
  className?: string;
}

/**
 * Komponent mapy OpenLayers
 * Wyświetla interaktywną mapę z warstwami: OSM tiles, POI, trasa, pozycja użytkownika
 */
const MapView: React.FC<MapViewProps> = ({
  center = [19.9449, 50.0647], // Kraków
  zoom = 14,
  pois = [],
  route,
  userPosition,
  onMapClick,
  onPoiClick,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const poiLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const routeLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const userLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Inicjalizacja mapy
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Warstwa bazowa OSM
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Warstwa POI
    const poiSource = new VectorSource();
    const poiLayer = new VectorLayer({
      source: poiSource,
      style: createPoiStyle,
    });
    poiLayerRef.current = poiLayer;

    // Warstwa trasy
    const routeSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeSource,
      style: new Style({
        stroke: new Stroke({
          color: '#ff6600',
          width: 4,
        }),
      }),
    });
    routeLayerRef.current = routeLayer;

    // Warstwa pozycji użytkownika
    const userSource = new VectorSource();
    const userLayer = new VectorLayer({
      source: userSource,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#4285F4' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
        }),
      }),
    });
    userLayerRef.current = userLayer;

    // Tworzenie mapy
    const map = new Map({
      target: mapContainer.current,
      layers: [osmLayer, routeLayer, poiLayer, userLayer],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
      controls: [], // Ukryj domyślne kontrolki
    });

    mapRef.current = map;

    // Obsługa kliknięć
    map.on('click', (event) => {
      const coordinate = toLonLat(event.coordinate) as Coordinate;

      // Sprawdź czy kliknięto w POI
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature && feature.get('poiId')) {
        onPoiClick?.(feature.get('poiId'));
        return;
      }

      onMapClick?.(coordinate);
    });

    // Kursor pointer nad POI
    map.on('pointermove', (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aktualizacja centrum i zoomu
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getView().animate({
      center: fromLonLat(center),
      zoom: zoom,
      duration: 500,
    });
  }, [center, zoom]);

  // Aktualizacja POI
  useEffect(() => {
    if (!poiLayerRef.current) return;
    const source = poiLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    pois.forEach((poi) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(poi.position)),
        poiId: poi.id,
        name: poi.name,
        category: poi.category,
      });
      source.addFeature(feature);
    });
  }, [pois]);

  // Aktualizacja trasy
  useEffect(() => {
    if (!routeLayerRef.current) return;
    const source = routeLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    if (route && route.length >= 2) {
      const coordinates = route.map((coord) => fromLonLat(coord));
      const feature = new Feature({
        geometry: new LineString(coordinates),
      });
      source.addFeature(feature);
    }
  }, [route]);

  // Aktualizacja pozycji użytkownika
  useEffect(() => {
    if (!userLayerRef.current) return;
    const source = userLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    if (userPosition) {
      const feature = new Feature({
        geometry: new Point(fromLonLat(userPosition)),
      });
      source.addFeature(feature);
    }
  }, [userPosition]);

  return (
    <div
      ref={mapContainer}
      className={`map-view ${className}`}
      data-testid="map-view"
    />
  );
};

/**
 * Styl dla markerów POI
 */
function createPoiStyle(feature: FeatureLike): Style {
  const category = (feature as Feature).get('category') || 'default';

  // Kolory dla różnych kategorii
  const categoryColors: Record<string, string> = {
    landmark: '#e74c3c',
    museum: '#9b59b6',
    park: '#27ae60',
    restaurant: '#f39c12',
    cafe: '#8b4513',
    hotel: '#3498db',
    default: '#ff6600',
  };

  const color = categoryColors[category] || categoryColors.default;

  return new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
    }),
  });
}

export default MapView;
