/**
 * WTG Routes - Explore Screen
 * Main map view with POI markers and search
 */

import { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Searchbar, FAB, Chip, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  Region,
  UrlTile,
} from 'react-native-maps';
import { usePOIs, useCities, usePOICategories } from '../../src/hooks/usePOI';
import { POIBottomSheet } from '../../src/components/poi/POIBottomSheet';
import type { POI, POICategory } from '../../src/types';
import { colors } from '../../src/theme/colors';
import { config } from '../../src/config';

const { width, height } = Dimensions.get('window');

// Category definitions for filtering
const CATEGORIES: { id: POICategory; label: string; icon: string }[] = [
  { id: 'landmark', label: 'Zabytki', icon: 'castle' },
  { id: 'museum', label: 'Muzea', icon: 'bank' },
  { id: 'church', label: 'Kościoły', icon: 'church' },
  { id: 'park', label: 'Parki', icon: 'tree' },
  { id: 'restaurant', label: 'Restauracje', icon: 'food' },
  { id: 'cafe', label: 'Kawiarnie', icon: 'coffee' },
];

// Category colors for markers
const CATEGORY_COLORS: Record<string, string> = {
  landmark: colors.primary,
  museum: colors.info,
  church: colors.warning,
  park: colors.success,
  restaurant: colors.error,
  cafe: '#8B4513',
  default: colors.gray500,
};

export default function ExploreScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    POICategory | undefined
  >(undefined);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedCityId, setSelectedCityId] = useState('krakow');

  // Queries
  const { data: cities } = useCities();
  const { data: pois, isLoading } = usePOIs(selectedCityId, selectedCategory);

  // Get city config
  const cityConfig = config.cities.find((c) => c.id === selectedCityId);

  // Initial region
  const initialRegion: Region = {
    latitude: cityConfig?.center[1] || 50.0647,
    longitude: cityConfig?.center[0] || 19.9449,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Filter POIs by search query
  const filteredPOIs =
    pois?.filter((poi) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        poi.name.toLowerCase().includes(query) ||
        poi.description?.toLowerCase().includes(query) ||
        poi.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }) || [];

  // Handlers
  const handlePOIPress = useCallback((poi: POI) => {
    setSelectedPOI(poi);
    // Center map on POI
    mapRef.current?.animateToRegion(
      {
        latitude: poi.coordinate[1],
        longitude: poi.coordinate[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  }, []);

  const handleCategoryPress = useCallback((category: POICategory) => {
    setSelectedCategory((prev) => (prev === category ? undefined : category));
  }, []);

  const handleAddToRoute = useCallback(
    (poi: POI) => {
      router.push({
        pathname: '/route-planner',
        params: { poiId: poi.id, cityId: selectedCityId },
      });
    },
    [selectedCityId]
  );

  const handleNavigate = useCallback(
    (poi: POI) => {
      router.push({
        pathname: '/navigation/active',
        params: {
          destination: JSON.stringify(poi.coordinate),
          cityId: selectedCityId,
        },
      });
    },
    [selectedCityId]
  );

  const getMarkerColor = (category: string): string => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Szukaj miejsc..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            icon={cat.icon}
            selected={selectedCategory === cat.id}
            onPress={() => handleCategoryPress(cat.id)}
            style={[
              styles.chip,
              selectedCategory === cat.id && {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}>
            {cat.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          mapType="none">
          {/* OSM Tiles */}
          <UrlTile
            urlTemplate={config.map.tileUrl}
            maximumZ={config.map.maxZoom}
            flipY={false}
          />

          {/* POI Markers */}
          {filteredPOIs.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{
                latitude: poi.coordinate[1],
                longitude: poi.coordinate[0],
              }}
              title={poi.name}
              description={poi.description}
              pinColor={getMarkerColor(poi.category)}
              onPress={() => handlePOIPress(poi)}
            />
          ))}
        </MapView>

        {/* City name badge */}
        <View style={styles.cityBadge}>
          <Text variant="labelMedium" style={styles.cityName}>
            {cityConfig?.name || 'Kraków'}
          </Text>
        </View>

        {/* FAB for new route */}
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/route-planner')}
          label="Nowa trasa"
        />
      </View>

      {/* POI Bottom Sheet */}
      {selectedPOI && (
        <POIBottomSheet
          poi={selectedPOI}
          onClose={() => setSelectedPOI(null)}
          onAddToRoute={handleAddToRoute}
          onNavigate={handleNavigate}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  searchbar: {
    backgroundColor: colors.gray100,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: colors.white,
  },
  chip: {
    marginRight: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  cityBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    color: colors.gray700,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
