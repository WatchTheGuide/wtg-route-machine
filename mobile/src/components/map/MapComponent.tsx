/**
 * WTG Routes - Map View Component
 *
 * Wrapper for react-native-maps with OSM tiles
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, {
  Marker,
  Polyline,
  UrlTile,
  PROVIDER_DEFAULT,
  Region,
  MapMarker,
} from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import { config } from '../../config';
import { colors } from '../../theme/colors';
import type { Coordinate, POI, Waypoint } from '../../types';

interface MapComponentProps {
  /** Initial center coordinate [lon, lat] */
  center?: Coordinate;
  /** Initial zoom level */
  zoom?: number;
  /** POI markers to display */
  pois?: POI[];
  /** Route waypoints */
  waypoints?: Waypoint[];
  /** Route geometry polyline */
  routeGeometry?: Coordinate[];
  /** Current user position */
  userPosition?: Coordinate;
  /** Show user location indicator */
  showUserLocation?: boolean;
  /** Callback when map is pressed */
  onPress?: (coordinate: Coordinate) => void;
  /** Callback when POI marker is pressed */
  onPOIPress?: (poi: POI) => void;
  /** Callback when waypoint marker is pressed */
  onWaypointPress?: (waypoint: Waypoint, index: number) => void;
  /** Callback when region changes */
  onRegionChange?: (region: Region) => void;
  /** Loading state */
  loading?: boolean;
}

// Convert [lon, lat] to { latitude, longitude }
const toLatLng = (coord: Coordinate) => ({
  latitude: coord[1],
  longitude: coord[0],
});

// Category colors for POI markers
const CATEGORY_COLORS: Record<string, string> = {
  landmark: colors.primary,
  museum: colors.info,
  church: colors.warning,
  park: colors.success,
  restaurant: colors.error,
  cafe: '#8B4513',
  hotel: colors.secondary,
  monument: colors.primary,
  theater: '#9C27B0',
  default: colors.gray500,
};

export function MapComponent({
  center = [19.9449, 50.0647], // Default: Kraków
  zoom = 14,
  pois = [],
  waypoints = [],
  routeGeometry = [],
  userPosition,
  showUserLocation = true,
  onPress,
  onPOIPress,
  onWaypointPress,
  onRegionChange,
  loading = false,
}: MapComponentProps) {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  // Calculate delta from zoom level
  const latDelta = 180 / Math.pow(2, zoom);
  const lonDelta = 360 / Math.pow(2, zoom);

  const initialRegion: Region = {
    latitude: center[1],
    longitude: center[0],
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };

  // Animate to center when it changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: center[1],
          longitude: center[0],
          latitudeDelta: latDelta,
          longitudeDelta: lonDelta,
        },
        500
      );
    }
  }, [center]);

  // Fit to route when route changes
  useEffect(() => {
    if (mapRef.current && routeGeometry.length > 0) {
      const coordinates = routeGeometry.map(toLatLng);
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [routeGeometry]);

  const handlePress = useCallback(
    (e: any) => {
      if (onPress) {
        const { longitude, latitude } = e.nativeEvent.coordinate;
        onPress([longitude, latitude]);
      }
    },
    [onPress]
  );

  const getMarkerColor = (category: string): string => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={true}
        rotateEnabled={true}
        pitchEnabled={false}
        onPress={handlePress}
        onRegionChangeComplete={onRegionChange}
        mapType="none" // We use custom tiles
      >
        {/* OSM Tile Layer */}
        <UrlTile
          urlTemplate={config.map.tileUrl}
          maximumZ={config.map.maxZoom}
          flipY={false}
        />

        {/* Route polyline */}
        {routeGeometry.length > 0 && (
          <Polyline
            coordinates={routeGeometry.map(toLatLng)}
            strokeColor={theme.colors.primary}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* POI markers */}
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={toLatLng(poi.coordinate)}
            title={poi.name}
            description={poi.description}
            pinColor={getMarkerColor(poi.category)}
            onPress={() => onPOIPress?.(poi)}
          />
        ))}

        {/* Waypoint markers */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={waypoint.id || `waypoint-${index}`}
            coordinate={toLatLng(waypoint.coordinate)}
            title={waypoint.name || `Punkt ${index + 1}`}
            onPress={() => onWaypointPress?.(waypoint, index)}>
            <View
              style={[
                styles.waypointMarker,
                { backgroundColor: theme.colors.primary },
              ]}>
              <View style={styles.waypointNumber}>
                {/* Number will be shown via icon or text */}
              </View>
            </View>
          </Marker>
        ))}

        {/* User position marker (if not using built-in) */}
        {userPosition && !showUserLocation && (
          <Marker coordinate={toLatLng(userPosition)} title="Twoja lokalizacja">
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waypointMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  waypointNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MapComponent;
