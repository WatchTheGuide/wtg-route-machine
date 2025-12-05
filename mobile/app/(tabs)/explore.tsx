/**
 * Explore Screen - Map with POI markers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, useTheme, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCityStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';

export default function ExploreScreen() {
  const theme = useTheme();
  const { selectedCity } = useCityStore();

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
            textStyle={{ color: colors.primary }}>
            {selectedCity.name}
          </Chip>
        </View>
      </View>

      {/* Map Placeholder */}
      <View
        style={[
          styles.mapContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurfaceVariant }}>
          🗺️ Mapa pojawi się tutaj
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Centrum: {selectedCity.center[1].toFixed(4)},{' '}
          {selectedCity.center[0].toFixed(4)}
        </Text>
      </View>

      {/* FAB for adding waypoint */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={colors.white}
        onPress={() => console.log('Add waypoint')}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
