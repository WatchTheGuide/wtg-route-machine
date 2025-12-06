/**
 * Explore Screen - Map with POI markers and route planning
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  FAB,
  useTheme,
  Chip,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCityStore, useRouteStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { LeafletMap, MapMarker, MapRoute } from '../../src/components/map';
import { CitySelector } from '../../src/components/city';
import { POICard } from '../../src/components/poi';
import {
  WaypointList,
  ProfileSelector,
  RouteInfo,
  SaveRouteModal,
} from '../../src/components/route';
import { usePOIs, useWaypoints, useRouting } from '../../src/hooks';
import { POI, POICategory, Coordinate } from '../../src/types';

const CATEGORY_COLORS: Record<POICategory, string> = {
  landmark: colors.poiLandmark,
  museum: colors.poiMuseum,
  park: colors.poiPark,
  restaurant: colors.poiRestaurant,
  cafe: colors.poiCafe,
  hotel: colors.poiHotel,
  other: colors.gray500,
};

export default function ExploreScreen() {
  const theme = useTheme();
  const { selectedCity } = useCityStore();
  const { saveRoute } = useRouteStore();
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [poiCardVisible, setPOICardVisible] = useState(false);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  // Fetch POIs for selected city
  const { data: pois, isLoading } = usePOIs(selectedCity.id);

  // Waypoints and routing
  const {
    waypoints,
    addWaypoint,
    addFromPOI,
    removeWaypoint,
    reorderWaypoints,
    clearWaypoints,
    canCalculateRoute,
  } = useWaypoints();

  const {
    route,
    profile,
    isCalculating,
    calculateRoute,
    clearRoute,
    changeProfile,
    formatDistance,
    formatDuration,
  } = useRouting();

  // Recalculate route when waypoints or profile change
  useEffect(() => {
    if (canCalculateRoute) {
      calculateRoute(waypoints);
    } else {
      clearRoute();
    }
  }, [waypoints, profile, canCalculateRoute]);

  // Convert POIs to map markers
  const poiMarkers: MapMarker[] = (pois || []).map((poi) => ({
    id: poi.id,
    latitude: poi.coordinate[1],
    longitude: poi.coordinate[0],
    title: poi.name,
    color: CATEGORY_COLORS[poi.category] || colors.primary,
  }));

  // Add waypoint markers
  const waypointMarkers: MapMarker[] = waypoints.map((wp, index) => ({
    id: `waypoint-${wp.id}`,
    latitude: wp.coordinate[1],
    longitude: wp.coordinate[0],
    title: wp.name || `Punkt ${index + 1}`,
    color:
      index === 0
        ? colors.success
        : index === waypoints.length - 1
        ? colors.primary
        : colors.gray600,
  }));

  const allMarkers = [...poiMarkers, ...waypointMarkers];

  // Map route from calculated route
  const mapRoute: MapRoute | undefined = route
    ? {
        coordinates: route.coordinates.map(
          (c) => [c[1], c[0]] as [number, number]
        ),
        color: colors.primary,
        width: 4,
      }
    : undefined;

  const handleMapPress = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    // Add waypoint from map press
    const coord: Coordinate = [coordinate.longitude, coordinate.latitude];
    addWaypoint(coord);
    setShowRoutePanel(true);
  };

  const handleMarkerPress = (markerId: string) => {
    // Check if it's a waypoint marker
    if (markerId.startsWith('waypoint-')) {
      return;
    }

    const poi = pois?.find((p) => p.id === markerId);
    if (poi) {
      setSelectedPOI(poi);
      setPOICardVisible(true);
    }
  };

  const handleAddToRoute = (poi: POI) => {
    addFromPOI(poi);
    setPOICardVisible(false);
    setShowRoutePanel(true);
  };

  const handleClearRoute = () => {
    clearWaypoints();
    clearRoute();
    setShowRoutePanel(false);
  };

  const handleSaveRoute = (name: string, description?: string) => {
    if (route) {
      saveRoute({
        ...route,
        name,
        description,
      });
      setSaveModalVisible(false);
      // Optionally clear the current route after saving
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Odkrywaj
          </Text>
          <Chip
            icon="map-marker"
            style={styles.cityChip}
            textStyle={{ color: colors.primary }}
            onPress={() => setCityModalVisible(true)}>
            {selectedCity.name}
          </Chip>
        </View>
        <View style={styles.headerRight}>
          {isLoading && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
          {isCalculating && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
          {waypoints.length > 0 && (
            <IconButton
              icon={showRoutePanel ? 'chevron-down' : 'chevron-up'}
              onPress={() => setShowRoutePanel(!showRoutePanel)}
            />
          )}
        </View>
      </View>

      {/* Map */}
      <View
        style={[
          styles.mapContainer,
          showRoutePanel && styles.mapContainerSmall,
        ]}>
        <LeafletMap
          key={`${selectedCity.id}-${waypoints.length}`}
          center={{
            latitude: selectedCity.center[1],
            longitude: selectedCity.center[0],
          }}
          zoom={14}
          markers={allMarkers}
          route={mapRoute}
          onMapPress={handleMapPress}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Route Planning Panel */}
      {showRoutePanel && (
        <View style={styles.routePanel}>
          <ProfileSelector
            value={profile}
            onChange={changeProfile}
            disabled={isCalculating}
          />

          <ScrollView style={styles.waypointScroll}>
            <WaypointList
              waypoints={waypoints}
              onRemove={removeWaypoint}
              onReorder={reorderWaypoints}
            />
          </ScrollView>

          {route && (
            <RouteInfo
              route={route}
              formatDistance={formatDistance}
              formatDuration={formatDuration}
              onStartNavigation={() => console.log('Start navigation')}
              onSaveRoute={() => setSaveModalVisible(true)}
              onClear={handleClearRoute}
            />
          )}
        </View>
      )}

      {/* FAB for toggling route panel */}
      <FAB
        icon={showRoutePanel ? 'map' : 'directions'}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={colors.white}
        onPress={() => setShowRoutePanel(!showRoutePanel)}
        label={waypoints.length > 0 ? `${waypoints.length} pkt` : undefined}
      />

      {/* City Selector Modal */}
      <CitySelector
        visible={cityModalVisible}
        onDismiss={() => setCityModalVisible(false)}
      />

      {/* POI Card Modal */}
      <POICard
        poi={selectedPOI}
        visible={poiCardVisible}
        onDismiss={() => setPOICardVisible(false)}
        onAddToRoute={handleAddToRoute}
      />

      {/* Save Route Modal */}
      <SaveRouteModal
        visible={saveModalVisible}
        route={route}
        onDismiss={() => setSaveModalVisible(false)}
        onSave={handleSaveRoute}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  cityChip: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainerSmall: {
    flex: 0.5,
  },
  routePanel: {
    flex: 0.5,
    backgroundColor: colors.gray50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  waypointScroll: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
