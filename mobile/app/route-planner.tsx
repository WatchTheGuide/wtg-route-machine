/**
 * WTG Routes - Route Planner Screen
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  IconButton,
  Button,
  FAB,
  List,
  SegmentedButtons,
  Surface,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import { MapComponent } from '../src/components/map';
import { colors } from '../src/theme/colors';
import { osrmService } from '../src/services/osrm.service';
import { useSaveRoute } from '../src/hooks/useRoutes';
import type { Waypoint, Route, RoutingProfile, Coordinate } from '../src/types';

export default function RoutePlannerScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ cityId?: string; poiId?: string }>();
  const { mutate: saveRoute, isPending: isSaving } = useSaveRoute();

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [profile, setProfile] = useState<RoutingProfile>('foot');
  const [isCalculating, setIsCalculating] = useState(false);
  const [cityId, setCityId] = useState(params.cityId || 'krakow');

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
    (coordinate: Coordinate) => {
      const newWaypoint: Waypoint = {
        id: Date.now().toString(),
        coordinate,
        name: `Punkt ${waypoints.length + 1}`,
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
    },
    [waypoints.length]
  );

  const handleRemoveWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  const handleReorderWaypoints = useCallback((data: Waypoint[]) => {
    setWaypoints(data);
  }, []);

  const handleSaveRoute = useCallback(() => {
    if (!route || waypoints.length < 2) return;

    Alert.prompt(
      'Zapisz trasę',
      'Podaj nazwę trasy:',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zapisz',
          onPress: (name: string | undefined) => {
            if (name) {
              saveRoute({
                name,
                waypoints,
                distance: route.distance,
                duration: route.duration,
                profile,
                cityId,
                isFavorite: false,
              });
              router.back();
            }
          },
        },
      ],
      'plain-text',
      `Trasa ${new Date().toLocaleDateString('pl')}`
    );
  }, [route, waypoints, profile, cityId, saveRoute]);

  const handleStartNavigation = useCallback(() => {
    if (!route || waypoints.length < 2) return;

    router.push({
      pathname: '/navigation/active',
      params: {
        waypoints: JSON.stringify(waypoints),
        profile,
        cityId,
      },
    });
  }, [route, waypoints, profile, cityId]);

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const renderWaypoint = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Waypoint>) => (
    <ScaleDecorator>
      <List.Item
        title={item.name || `Punkt`}
        description={`${item.coordinate[1].toFixed(
          5
        )}, ${item.coordinate[0].toFixed(5)}`}
        left={(props) => (
          <IconButton {...props} icon="drag" onLongPress={drag} />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="close"
            onPress={() => handleRemoveWaypoint(item.id!)}
          />
        )}
        style={[styles.waypointItem, isActive && styles.waypointItemActive]}
      />
    </ScaleDecorator>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.title}>
          Planuj trasę
        </Text>
        <IconButton
          icon="content-save"
          onPress={handleSaveRoute}
          disabled={!route || isSaving}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapComponent
          waypoints={waypoints}
          routeGeometry={route?.geometry || []}
          onPress={handleMapPress}
          loading={isCalculating}
        />

        {/* Profile Selector */}
        <Surface style={styles.profileSelector} elevation={2}>
          <SegmentedButtons
            value={profile}
            onValueChange={(value) => setProfile(value as RoutingProfile)}
            buttons={[
              { value: 'foot', icon: 'walk' },
              { value: 'bicycle', icon: 'bicycle' },
              { value: 'car', icon: 'car' },
            ]}
            density="small"
          />
        </Surface>
      </View>

      {/* Waypoints List */}
      <View style={styles.waypointsContainer}>
        <Text variant="titleMedium" style={styles.waypointsTitle}>
          Punkty trasy ({waypoints.length})
        </Text>

        {waypoints.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Dotknij mapę, aby dodać punkty trasy
            </Text>
          </View>
        ) : (
          <GestureHandlerRootView style={styles.listContainer}>
            <DraggableFlatList
              data={waypoints}
              onDragEnd={({ data }) => handleReorderWaypoints(data)}
              keyExtractor={(item) => item.id!}
              renderItem={renderWaypoint}
              containerStyle={styles.list}
            />
          </GestureHandlerRootView>
        )}
      </View>

      {/* Route Info & Actions */}
      {route && (
        <Surface style={styles.routeInfo} elevation={4}>
          <View style={styles.routeStats}>
            <View style={styles.stat}>
              <IconButton icon="map-marker-distance" size={20} />
              <Text variant="titleMedium">
                {formatDistance(route.distance)}
              </Text>
            </View>
            <View style={styles.stat}>
              <IconButton icon="clock-outline" size={20} />
              <Text variant="titleMedium">
                {formatDuration(route.duration)}
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            icon="navigation"
            onPress={handleStartNavigation}
            style={styles.startButton}>
            Rozpocznij nawigację
          </Button>
        </Surface>
      )}

      {/* Clear FAB */}
      {waypoints.length > 0 && (
        <FAB
          icon="delete"
          style={styles.clearFab}
          onPress={() => {
            Alert.alert(
              'Wyczyść trasę',
              'Czy na pewno chcesz usunąć wszystkie punkty?',
              [
                { text: 'Anuluj', style: 'cancel' },
                {
                  text: 'Usuń',
                  style: 'destructive',
                  onPress: () => setWaypoints([]),
                },
              ]
            );
          }}
          size="small"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  profileSelector: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  waypointsContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 8,
  },
  waypointsTitle: {
    padding: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  waypointItem: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  waypointItemActive: {
    backgroundColor: colors.gray100,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: colors.gray500,
    textAlign: 'center',
  },
  routeInfo: {
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    marginTop: 8,
  },
  clearFab: {
    position: 'absolute',
    right: 16,
    bottom: 180,
    backgroundColor: colors.error,
  },
});
