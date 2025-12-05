/**
 * Explore Screen - Map with POI markers
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, useTheme, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCityStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { LeafletMap } from '../../src/components/map';
import { CitySelector } from '../../src/components/city';

export default function ExploreScreen() {
  const theme = useTheme();
  const { selectedCity } = useCityStore();
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const handleMapPress = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    console.log('Map pressed:', coordinate);
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
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <LeafletMap
          key={selectedCity.id}
          center={{
            latitude: selectedCity.center[1], // lat
            longitude: selectedCity.center[0], // lon
          }}
          zoom={14}
          onMapPress={handleMapPress}
        />
      </View>

      {/* FAB for adding waypoint */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={colors.white}
        onPress={() => console.log('Add waypoint')}
      />

      {/* City Selector Modal */}
      <CitySelector
        visible={cityModalVisible}
        onDismiss={() => setCityModalVisible(false)}
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
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
