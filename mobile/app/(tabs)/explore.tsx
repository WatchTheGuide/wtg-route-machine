/**
 * Explore Screen - Map with POI markers
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  FAB,
  useTheme,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCityStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { LeafletMap, MapMarker } from '../../src/components/map';
import { CitySelector } from '../../src/components/city';
import { POICard } from '../../src/components/poi';
import { usePOIs } from '../../src/hooks';
import { POI, POICategory } from '../../src/types';

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
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [poiCardVisible, setPOICardVisible] = useState(false);

  // Fetch POIs for selected city
  const { data: pois, isLoading } = usePOIs(selectedCity.id);

  // Convert POIs to map markers
  const markers: MapMarker[] = (pois || []).map((poi) => ({
    id: poi.id,
    latitude: poi.coordinate[1],
    longitude: poi.coordinate[0],
    title: poi.name,
    color: CATEGORY_COLORS[poi.category] || colors.primary,
  }));

  const handleMapPress = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    console.log('Map pressed:', coordinate);
  };

  const handleMarkerPress = (markerId: string) => {
    const poi = pois?.find((p) => p.id === markerId);
    if (poi) {
      setSelectedPOI(poi);
      setPOICardVisible(true);
    }
  };

  const handleAddToRoute = (poi: POI) => {
    console.log('Add to route:', poi.name);
    // TODO: Implement in Story 7.5
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
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <LeafletMap
          key={selectedCity.id}
          center={{
            latitude: selectedCity.center[1],
            longitude: selectedCity.center[0],
          }}
          zoom={14}
          markers={markers}
          onMapPress={handleMapPress}
          onMarkerPress={handleMarkerPress}
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

      {/* POI Card Modal */}
      <POICard
        poi={selectedPOI}
        visible={poiCardVisible}
        onDismiss={() => setPOICardVisible(false)}
        onAddToRoute={handleAddToRoute}
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
