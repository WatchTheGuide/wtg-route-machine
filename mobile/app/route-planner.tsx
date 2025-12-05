/**
 * WTG Routes - Route Planner Screen
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import {
  Text,
  IconButton,
  Button,
  FAB,
  List,
  SegmentedButtons,
  Surface,
  useTheme,
  Divider,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import LeafletMap, {
  LeafletMapRef,
  MapMarker,
  MapRoute,
} from '../src/components/map/LeafletMap';
import { colors } from '../src/theme/colors';
import { osrmService } from '../src/services/osrm.service';
import { useSaveRoute } from '../src/hooks/useRoutes';
import type { Waypoint, Route, RoutingProfile, Coordinate } from '../src/types';
import { config } from '../src/config';

export default function RoutePlannerScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ cityId?: string; poiId?: string }>();
  const { mutate: saveRoute, isPending: isSaving } = useSaveRoute();

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [profile, setProfile] = useState<RoutingProfile>('foot');
  const [isCalculating, setIsCalculating] = useState(false);
  const [cityId, setCityId] = useState(params.cityId || 'krakow');
  const [showWaypointList, setShowWaypointList] = useState(true);

  const cityConfig = config.cities.find((c) => c.id === cityId);

  // Calculate route when waypoints or profile changes
  useEffect(() => {
    if (waypoints.length >= 2) {
      calculateRoute();
    } else {
      setRoute(null);
    }
  }, [waypoints, profile]);

  const calculateRoute = useCallback(async () => {
    if (waypoints.length < 2) return;

    setIsCalculating(true);
    try {
      const calculatedRoute = await osrmService.calculateRoute(
        cityId,
        waypoints,
        profile
      );
      setRoute(calculatedRoute);
    } catch (error) {
      console.error('Route calculation error:', error);
      Alert.alert('Błąd', 'Nie udało się obliczyć trasy');
    } finally {
      setIsCalculating(false);
    }
  }, [waypoints, profile, cityId]);

  const handleMapPress = useCallback(
    (coordinate: { latitude: number; longitude: number }) => {
      const newWaypoint: Waypoint = {
        id: Date.now().toString(),
        coordinate: [coordinate.longitude, coordinate.latitude],
        name: `Punkt ${waypoints.length + 1}`,
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
    },
    [waypoints.length]
  );

  const handleRemoveWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  const handleMoveWaypoint = useCallback(
    (id: string, direction: 'up' | 'down') => {
      setWaypoints((prev) => {
        const index = prev.findIndex((wp) => wp.id === id);
        if (index === -1) return prev;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const newWaypoints = [...prev];
        [newWaypoints[index], newWaypoints[newIndex]] = [
          newWaypoints[newIndex],
          newWaypoints[index],
        ];
        return newWaypoints;
      });
    },
    []
  );

  const handleSaveRoute = useCallback(() => {
    if (!route || waypoints.length < 2) return;

    Alert.prompt(
      'Zapisz trasę',
      'Podaj nazwę trasy:',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zapisz',
          onPress: (name?: string) => {
            if (name) {
              saveRoute({
                name,
                cityId,
                waypoints,
                profile,
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                isFavorite: false,
              });
              router.back();
            }
          },
        },
      ],
      'plain-text',
      `Trasa ${new Date().toLocaleDateString('pl-PL')}`
    );
  }, [route, waypoints, cityId, profile, saveRoute]);

  const handleClearWaypoints = useCallback(() => {
    Alert.alert(
      'Wyczyść trasę',
      'Czy na pewno chcesz usunąć wszystkie punkty?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyczyść',
          style: 'destructive',
          onPress: () => setWaypoints([]),
        },
      ]
    );
  }, []);

  // Convert waypoints to map markers
  const mapMarkers: MapMarker[] = waypoints.map((wp, index) => ({
    id: wp.id || `waypoint-${index}`,
    latitude: wp.coordinate[1],
    longitude: wp.coordinate[0],
    title: wp.name || `Punkt ${index + 1}`,
    color:
      index === 0
        ? colors.success
        : index === waypoints.length - 1
        ? colors.error
        : colors.primary,
  }));

  // Convert route to map route
  const mapRoute: MapRoute | undefined = route?.geometry
    ? {
        coordinates: route.geometry.map((coord) => [coord[1], coord[0]]),
        color: colors.primary,
        width: 4,
      }
    : undefined;

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} min`;
  };

  const renderWaypointItem = ({
    item,
    index,
  }: {
    item: Waypoint;
    index: number;
  }) => (
    <List.Item
      title={item.name || `Punkt ${index + 1}`}
      description={`${item.coordinate[1].toFixed(
        5
      )}, ${item.coordinate[0].toFixed(5)}`}
      left={() => (
        <View
          style={[
            styles.waypointNumber,
            {
              backgroundColor:
                index === 0
                  ? colors.success
                  : index === waypoints.length - 1
                  ? colors.error
                  : colors.primary,
            },
          ]}>
          <Text style={styles.waypointNumberText}>{index + 1}</Text>
        </View>
      )}
      right={() => (
        <View style={styles.waypointActions}>
          <IconButton
            icon="arrow-up"
            size={20}
            onPress={() => handleMoveWaypoint(item.id || '', 'up')}
            disabled={index === 0}
          />
          <IconButton
            icon="arrow-down"
            size={20}
            onPress={() => handleMoveWaypoint(item.id || '', 'down')}
            disabled={index === waypoints.length - 1}
          />
          <IconButton
            icon="close"
            size={20}
            onPress={() => handleRemoveWaypoint(item.id || '')}
          />
        </View>
      )}
      style={styles.waypointItem}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Profile Selector */}
      <Surface style={styles.profileContainer} elevation={1}>
        <SegmentedButtons
          value={profile}
          onValueChange={(value) => setProfile(value as RoutingProfile)}
          buttons={[
            { value: 'foot', label: 'Pieszo', icon: 'walk' },
            { value: 'bicycle', label: 'Rower', icon: 'bike' },
            { value: 'car', label: 'Auto', icon: 'car' },
          ]}
          style={styles.segmentedButtons}
        />
      </Surface>

      {/* Map */}
      <View style={styles.mapContainer}>
        <LeafletMap
          center={{
            latitude: cityConfig?.center[1] || 50.0647,
            longitude: cityConfig?.center[0] || 19.9449,
          }}
          zoom={14}
          markers={mapMarkers}
          route={mapRoute}
          onMapPress={handleMapPress}
          showUserLocation
        />

        {/* Route Info Card */}
        {route && (
          <Card style={styles.routeInfoCard}>
            <Card.Content style={styles.routeInfoContent}>
              <View style={styles.routeInfoItem}>
                <Text variant="labelSmall">Dystans</Text>
                <Text variant="titleMedium" style={{ color: colors.primary }}>
                  {formatDistance(route.distance)}
                </Text>
              </View>
              <View style={styles.routeInfoDivider} />
              <View style={styles.routeInfoItem}>
                <Text variant="labelSmall">Czas</Text>
                <Text variant="titleMedium" style={{ color: colors.primary }}>
                  {formatDuration(route.duration)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Toggle Waypoint List Button */}
        <FAB
          icon={showWaypointList ? 'chevron-down' : 'chevron-up'}
          size="small"
          style={styles.toggleListFab}
          onPress={() => setShowWaypointList(!showWaypointList)}
        />
      </View>

      {/* Waypoint List */}
      {showWaypointList && (
        <Surface style={styles.waypointListContainer} elevation={2}>
          <View style={styles.waypointListHeader}>
            <Text variant="titleMedium">Punkty trasy ({waypoints.length})</Text>
            {waypoints.length > 0 && (
              <IconButton
                icon="delete-sweep"
                size={20}
                onPress={handleClearWaypoints}
              />
            )}
          </View>

          {waypoints.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Kliknij na mapę, aby dodać punkty trasy
              </Text>
            </View>
          ) : (
            <FlatList
              data={waypoints}
              renderItem={renderWaypointItem}
              keyExtractor={(item, index) => item.id || `item-${index}`}
              ItemSeparatorComponent={Divider}
              style={styles.waypointList}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.actionButton}>
              Anuluj
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveRoute}
              disabled={waypoints.length < 2 || isSaving}
              loading={isSaving}
              style={styles.actionButton}>
              Zapisz trasę
            </Button>
          </View>
        </Surface>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  profileContainer: {
    padding: 12,
    backgroundColor: colors.white,
  },
  segmentedButtons: {
    // Default styling
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  routeInfoCard: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
  },
  routeInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  routeInfoItem: {
    alignItems: 'center',
  },
  routeInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray200,
  },
  toggleListFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.white,
  },
  waypointListContainer: {
    maxHeight: 300,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  waypointListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  waypointList: {
    maxHeight: 180,
  },
  waypointItem: {
    paddingVertical: 4,
  },
  waypointNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  waypointNumberText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  waypointActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray500,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
