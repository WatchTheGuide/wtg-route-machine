/**
 * WTG Routes - Saved Routes Screen
 */

import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Card,
  FAB,
  useTheme,
  IconButton,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSavedRoutes } from '../../src/hooks/useRoutes';
import { colors } from '../../src/theme/colors';
import type { SavedRoute } from '../../src/types';

export default function RoutesScreen() {
  const theme = useTheme();
  const { data: routes, isLoading } = useSavedRoutes();

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

  const handleRoutePress = (route: SavedRoute) => {
    router.push({
      pathname: '/navigation/[routeId]',
      params: { routeId: route.id },
    });
  };

  const renderRoute = ({ item }: { item: SavedRoute }) => (
    <Card style={styles.card} onPress={() => handleRoutePress(item)}>
      <Card.Title
        title={item.name}
        subtitle={`${formatDistance(item.distance)} • ${formatDuration(
          item.duration
        )}`}
        left={(props) => (
          <IconButton
            {...props}
            icon={item.isFavorite ? 'heart' : 'heart-outline'}
            iconColor={item.isFavorite ? colors.error : colors.gray400}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="chevron-right"
            onPress={() => handleRoutePress(item)}
          />
        )}
      />
      <Card.Content>
        <View style={styles.chipsContainer}>
          <Chip icon="walk" compact style={styles.chip}>
            {item.profile === 'foot'
              ? 'Pieszo'
              : item.profile === 'bicycle'
              ? 'Rower'
              : 'Auto'}
          </Chip>
          <Chip icon="map-marker" compact style={styles.chip}>
            {item.waypoints.length} punktów
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Brak zapisanych tras
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        Utwórz swoją pierwszą trasę i rozpocznij zwiedzanie!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Moje trasy
        </Text>
      </View>

      <FlatList
        data={routes}
        renderItem={renderRoute}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={isLoading ? null : EmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        label="Nowa trasa"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/route-planner')}
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
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: colors.gray100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    color: colors.gray600,
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.gray400,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
