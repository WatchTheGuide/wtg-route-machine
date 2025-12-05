/**
 * LeafletMap - WebView-based map component using Leaflet
 * Compatible with Expo Go (no native modules required)
 */

import React, {
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { colors } from '../../theme/colors';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface MapRoute {
  coordinates: [number, number][]; // [lat, lng]
  color?: string;
  width?: number;
}

export interface LeafletMapProps {
  center?: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: MapRoute;
  showUserLocation?: boolean;
  onMarkerPress?: (marker: MapMarker) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  onMapReady?: () => void;
  style?: object;
}

export interface LeafletMapRef {
  animateToRegion: (latitude: number, longitude: number, zoom?: number) => void;
  fitBounds: (bounds: [[number, number], [number, number]]) => void;
}

const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      center = { latitude: 50.0647, longitude: 19.9449 },
      zoom = 14,
      markers = [],
      route,
      showUserLocation = true,
      onMarkerPress,
      onMapPress,
      onMapReady,
      style,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      animateToRegion: (latitude: number, longitude: number, z?: number) => {
        const command = `map.flyTo([${latitude}, ${longitude}], ${z || zoom});`;
        webViewRef.current?.injectJavaScript(command);
      },
      fitBounds: (bounds: [[number, number], [number, number]]) => {
        const command = `map.fitBounds([[${bounds[0][0]}, ${bounds[0][1]}], [${bounds[1][0]}, ${bounds[1][1]}]]);`;
        webViewRef.current?.injectJavaScript(command);
      },
    }));

    // Update markers when they change
    useEffect(() => {
      if (!isLoading && webViewRef.current) {
        const markersJson = JSON.stringify(markers);
        webViewRef.current.injectJavaScript(
          `updateMarkers(${markersJson}); true;`
        );
      }
    }, [markers, isLoading]);

    // Update route when it changes
    useEffect(() => {
      if (!isLoading && webViewRef.current && route) {
        const routeJson = JSON.stringify(route);
        webViewRef.current.injectJavaScript(`updateRoute(${routeJson}); true;`);
      }
    }, [route, isLoading]);

    // Handle messages from WebView
    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          switch (data.type) {
            case 'markerPress':
              if (onMarkerPress) {
                const marker = markers.find((m) => m.id === data.markerId);
                if (marker) onMarkerPress(marker);
              }
              break;
            case 'mapPress':
              if (onMapPress) {
                onMapPress({ latitude: data.lat, longitude: data.lng });
              }
              break;
            case 'mapReady':
              setIsLoading(false);
              if (onMapReady) onMapReady();
              break;
          }
        } catch (e) {
          console.error('Error parsing WebView message:', e);
        }
      },
      [markers, onMarkerPress, onMapPress, onMapReady]
    );

    // Generate HTML for Leaflet map
    const generateHTML = () => {
      const markersJson = JSON.stringify(markers);
      const routeJson = route ? JSON.stringify(route) : 'null';

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; }
    .custom-marker {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .user-location {
      width: 16px;
      height: 16px;
      background: #4285F4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(66,133,244,0.6);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Initialize map
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true
    }).setView([${center.latitude}, ${center.longitude}], ${zoom});

    // Add OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Marker storage
    let markers = [];
    let markerLayer = L.layerGroup().addTo(map);
    let routeLayer = null;
    let userLocationMarker = null;

    // Update markers function
    function updateMarkers(newMarkers) {
      markerLayer.clearLayers();
      markers = newMarkers;
      
      newMarkers.forEach(m => {
        const color = m.color || '${colors.primary}';
        const icon = L.divIcon({
          className: 'custom-marker',
          html: '<div style="background:' + color + ';width:24px;height:24px;border-radius:50%;border:2px solid white;"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        const marker = L.marker([m.latitude, m.longitude], { icon })
          .addTo(markerLayer);
        
        if (m.title) {
          marker.bindPopup('<b>' + m.title + '</b>' + (m.description ? '<br>' + m.description : ''));
        }
        
        marker.on('click', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPress',
            markerId: m.id
          }));
        });
      });
    }

    // Update route function
    function updateRoute(routeData) {
      if (routeLayer) {
        map.removeLayer(routeLayer);
      }
      
      if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
        routeLayer = L.polyline(routeData.coordinates, {
          color: routeData.color || '${colors.primary}',
          weight: routeData.width || 4,
          opacity: 0.8
        }).addTo(map);
      }
    }

    // Update user location
    function updateUserLocation(lat, lng) {
      if (userLocationMarker) {
        userLocationMarker.setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          className: 'user-location',
          html: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        userLocationMarker = L.marker([lat, lng], { icon }).addTo(map);
      }
    }

    // Map click handler
    map.on('click', (e) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapPress',
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }));
    });

    // Initial markers
    updateMarkers(${markersJson});
    
    // Initial route
    if (${routeJson}) {
      updateRoute(${routeJson});
    }

    // User location tracking
    ${
      showUserLocation
        ? `
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => updateUserLocation(pos.coords.latitude, pos.coords.longitude),
        (err) => console.log('Geolocation error:', err),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }
    `
        : ''
    }

    // Notify React Native that map is ready
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
  </script>
</body>
</html>
      `;
    };

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ html: generateHTML() }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled={showUserLocation}
          originWhitelist={['*']}
          scrollEnabled={false}
          bounces={false}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeafletMap;
