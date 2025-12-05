/**
 * LeafletMap - Cross-platform map component using Leaflet
 * Uses WebView for native and iframe for web
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../theme/colors';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
}

export interface MapRoute {
  coordinates: [number, number][]; // [lat, lng]
  color?: string;
  width?: number;
}

export interface LeafletMapProps {
  center: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: MapRoute;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (markerId: string) => void;
  style?: object;
}

export interface LeafletMapRef {
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
}

// Generate Leaflet HTML
const generateMapHTML = (
  center: { latitude: number; longitude: number },
  zoom: number,
  markers: MapMarker[],
  route?: MapRoute
) => {
  const markersJS = markers
    .map(
      (m) => `
      L.marker([${m.latitude}, ${m.longitude}], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: ${
            m.color || colors.primary
          }; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      })
      .addTo(map)
      .bindPopup('${m.title || ''}')
      .on('click', function(e) {
        e.originalEvent.stopPropagation();
        var msg = JSON.stringify({ type: 'markerPress', id: '${m.id}' });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(msg);
        } else {
          window.parent.postMessage(msg, '*');
        }
      });
    `
    )
    .join('\n');

  const routeJS = route
    ? `
      L.polyline([${route.coordinates
        .map((c) => `[${c[0]}, ${c[1]}]`)
        .join(',')}], {
        color: '${route.color || colors.primary}',
        weight: ${route.width || 4},
        opacity: 0.8
      }).addTo(map);
    `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
    .custom-marker { background: transparent; border: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([${center.latitude}, ${center.longitude}], ${zoom});
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
    
    ${markersJS}
    ${routeJS}
    
    map.on('click', function(e) {
      var msg = JSON.stringify({
        type: 'mapPress',
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      } else {
        window.parent.postMessage(msg, '*');
      }
    });
    
    window.setCenter = function(lat, lng) {
      map.setView([lat, lng]);
    };
    
    window.setZoom = function(zoom) {
      map.setZoom(zoom);
    };
  </script>
</body>
</html>
  `;
};

// Web version using iframe
const WebLeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      center,
      zoom = 14,
      markers = [],
      route,
      onMapPress,
      onMarkerPress,
      style,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = React.useState(true);

    const html = generateMapHTML(center, zoom, markers, route);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    useImperativeHandle(ref, () => ({
      setCenter: (lat: number, lng: number) => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'setCenter', lat, lng },
          '*'
        );
      },
      setZoom: (z: number) => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'setZoom', zoom: z },
          '*'
        );
      },
    }));

    React.useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data =
            typeof event.data === 'string'
              ? JSON.parse(event.data)
              : event.data;
          if (data.type === 'mapPress' && onMapPress) {
            onMapPress({ latitude: data.latitude, longitude: data.longitude });
          }
          if (data.type === 'markerPress' && onMarkerPress) {
            onMarkerPress(data.id);
          }
        } catch {}
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [onMapPress, onMarkerPress]);

    return (
      <View style={[styles.container, style]}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <iframe
          ref={iframeRef as any}
          src={url}
          style={{ width: '100%', height: '100%', border: 'none' }}
          onLoad={() => setLoading(false)}
        />
      </View>
    );
  }
);

// Native version using WebView
const NativeLeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      center,
      zoom = 14,
      markers = [],
      route,
      onMapPress,
      onMarkerPress,
      style,
    },
    ref
  ) => {
    const webViewRef = useRef<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [WebView, setWebView] = React.useState<any>(null);

    // Dynamic import for WebView
    React.useEffect(() => {
      import('react-native-webview').then((mod) => {
        setWebView(() => mod.WebView);
      });
    }, []);

    const html = generateMapHTML(center, zoom, markers, route);

    useImperativeHandle(ref, () => ({
      setCenter: (lat: number, lng: number) => {
        webViewRef.current?.injectJavaScript(
          `window.setCenter(${lat}, ${lng}); true;`
        );
      },
      setZoom: (z: number) => {
        webViewRef.current?.injectJavaScript(`window.setZoom(${z}); true;`);
      },
    }));

    const handleMessage = useCallback(
      (event: any) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'mapPress' && onMapPress) {
            onMapPress({ latitude: data.latitude, longitude: data.longitude });
          }
          if (data.type === 'markerPress' && onMarkerPress) {
            onMarkerPress(data.id);
          }
        } catch {}
      },
      [onMapPress, onMarkerPress]
    );

    if (!WebView) {
      return (
        <View style={[styles.container, styles.loader, style]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          scrollEnabled={false}
        />
      </View>
    );
  }
);

// Export the correct component based on platform
export const LeafletMap =
  Platform.OS === 'web' ? WebLeafletMap : NativeLeafletMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    zIndex: 1,
  },
});
