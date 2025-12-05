/**
 * Routes Screen - Saved routes list
 */

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

// Placeholder data
const SAMPLE_ROUTES = [
  {
    id: '1',
    name: 'Spacer po Starym Mieście',
    distance: 3200,
    duration: 2400,
    waypoints: 5,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Kazimierz kulturalny',
    distance: 4100,
    duration: 3000,
    waypoints: 7,
    isFavorite: false,
  },
];

export default function RoutesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours}h ${remainMins}min`;
  };

  const renderRoute = ({ item }: { item: (typeof SAMPLE_ROUTES)[0] }) => (
    <Card
      style={styles.card}
      onPress={() => console.log('Open route', item.id)}>
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
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
      <Card.Content>
        <Text variant="bodySmall" style={{ color: colors.gray600 }}>
          {item.waypoints} punktów na trasie
        </Text>
      </Card.Content>
    </Card>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Brak zapisanych tras
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        Zaplanuj swoją pierwszą trasę pieszą!
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
        data={SAMPLE_ROUTES}
        renderItem={renderRoute}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
      />

      <FAB
        icon="plus"
        label="Nowa trasa"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={colors.white}
        onPress={() => console.log('Create new route')}
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
