/**
 * Routes Screen - Saved routes list
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, FAB, useTheme, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useRouteStore } from '../../src/stores';
import { RouteCard } from '../../src/components/route';
import { Route } from '../../src/types';

type FilterType = 'all' | 'favorites';

export default function RoutesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const { savedRoutes, deleteRoute, toggleFavorite, getFavoriteRoutes } =
    useRouteStore();

  const displayedRoutes =
    filter === 'favorites' ? getFavoriteRoutes() : savedRoutes;

  const handleRoutePress = (route: Route) => {
    // TODO: Navigate to route details or load on map
    console.log('Open route:', route.name);
    Alert.alert(
      route.name,
      `Dystans: ${(route.distance / 1000).toFixed(1)} km\nCzas: ${Math.round(
        route.duration / 60
      )} min\nPunkty: ${route.waypoints.length}`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Otwórz na mapie',
          onPress: () => {
            // Navigate to explore with this route
            router.push('/(tabs)/explore');
          },
        },
      ]
    );
  };

  const handleDeleteRoute = (id: string) => {
    Alert.alert('Usuń trasę', 'Czy na pewno chcesz usunąć tę trasę?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => deleteRoute(id),
      },
    ]);
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {filter === 'favorites'
          ? 'Brak ulubionych tras'
          : 'Brak zapisanych tras'}
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        {filter === 'favorites'
          ? 'Dodaj trasy do ulubionych, klikając ❤️'
          : 'Zaplanuj trasę na mapie i zapisz ją tutaj!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Moje trasy
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {savedRoutes.length}{' '}
          {savedRoutes.length === 1
            ? 'trasa'
            : savedRoutes.length < 5
            ? 'trasy'
            : 'tras'}
        </Text>
      </View>

      {savedRoutes.length > 0 && (
        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}
            buttons={[
              {
                value: 'all',
                label: 'Wszystkie',
                icon: 'format-list-bulleted',
              },
              { value: 'favorites', label: 'Ulubione', icon: 'heart' },
            ]}
            style={styles.filterButtons}
          />
        </View>
      )}

      <FlatList
        data={displayedRoutes}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            onPress={handleRoutePress}
            onDelete={handleDeleteRoute}
            onToggleFavorite={toggleFavorite}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
      />

      <FAB
        icon="plus"
        label="Nowa trasa"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={colors.white}
        onPress={() => router.push('/(tabs)/explore')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  subtitle: {
    color: colors.gray600,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  filterButtons: {
    backgroundColor: colors.gray50,
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: colors.gray600,
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.gray500,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
