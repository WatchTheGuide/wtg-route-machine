/**
 * WTG Routes - Explore Screen
 * Main map view with POI markers and search
 */

import { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Searchbar,
  FAB,
  Chip,
  useTheme,
  Text,
  Portal,
  Modal,
  Button,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LeafletMap, {
  MapMarker,
  LeafletMapRef,
} from '../../src/components/map/LeafletMap';
import { usePOIs, useCities } from '../../src/hooks/usePOI';
import type { POI, POICategory } from '../../src/types';
import { colors } from '../../src/theme/colors';
import { config } from '../../src/config';

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
  const mapRef = useRef<LeafletMapRef>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    POICategory | undefined
  >(undefined);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedCityId, setSelectedCityId] = useState('krakow');
  const [showPOIModal, setShowPOIModal] = useState(false);

  // Queries
  const { data: cities } = useCities();
  const { data: pois, isLoading } = usePOIs(selectedCityId, selectedCategory);

  // Get city config
  const cityConfig = config.cities.find((c) => c.id === selectedCityId);

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

  // Convert POIs to map markers
  const mapMarkers: MapMarker[] = filteredPOIs.map((poi) => ({
    id: poi.id,
    latitude: poi.coordinate[1],
    longitude: poi.coordinate[0],
    title: poi.name,
    description: poi.description,
    color: CATEGORY_COLORS[poi.category] || CATEGORY_COLORS.default,
  }));

  // Handlers
  const handleMarkerPress = useCallback(
    (marker: MapMarker) => {
      const poi = filteredPOIs.find((p) => p.id === marker.id);
      if (poi) {
        setSelectedPOI(poi);
        setShowPOIModal(true);
        mapRef.current?.animateToRegion(
          poi.coordinate[1],
          poi.coordinate[0],
          16
        );
      }
    },
    [filteredPOIs]
  );

  const handleCategoryPress = useCallback((category: POICategory) => {
    setSelectedCategory((prev) => (prev === category ? undefined : category));
  }, []);

  const handleAddToRoute = useCallback(() => {
    if (selectedPOI) {
      setShowPOIModal(false);
      router.push({
        pathname: '/route-planner',
        params: { poiId: selectedPOI.id, cityId: selectedCityId },
      });
    }
  }, [selectedPOI, selectedCityId]);

  const handleNavigate = useCallback(() => {
    if (selectedPOI) {
      setShowPOIModal(false);
      router.push({
        pathname: '/navigation/active',
        params: {
          destination: JSON.stringify(selectedPOI.coordinate),
          cityId: selectedCityId,
        },
      });
    }
  }, [selectedPOI, selectedCityId]);

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
        <LeafletMap
          ref={mapRef}
          center={{
            latitude: cityConfig?.center[1] || 50.0647,
            longitude: cityConfig?.center[0] || 19.9449,
          }}
          zoom={14}
          markers={mapMarkers}
          onMarkerPress={handleMarkerPress}
          showUserLocation
        />

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

      {/* POI Modal */}
      <Portal>
        <Modal
          visible={showPOIModal}
          onDismiss={() => setShowPOIModal(false)}
          contentContainerStyle={styles.modalContent}>
          {selectedPOI && (
            <Card style={styles.poiCard}>
              <Card.Title
                title={selectedPOI.name}
                subtitle={
                  CATEGORIES.find((c) => c.id === selectedPOI.category)?.label
                }
                titleStyle={styles.poiTitle}
              />
              <Card.Content>
                {selectedPOI.description && (
                  <Text variant="bodyMedium" style={styles.poiDescription}>
                    {selectedPOI.description}
                  </Text>
                )}
                {selectedPOI.tags && selectedPOI.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {selectedPOI.tags.map((tag) => (
                      <Chip key={tag} compact style={styles.tag}>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                )}
              </Card.Content>
              <Card.Actions style={styles.poiActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowPOIModal(false)}
                  style={styles.actionButton}>
                  Zamknij
                </Button>
                <Button
                  mode="contained-tonal"
                  icon="map-marker-plus"
                  onPress={handleAddToRoute}
                  style={styles.actionButton}>
                  Dodaj do trasy
                </Button>
                <Button
                  mode="contained"
                  icon="navigation"
                  onPress={handleNavigate}
                  style={styles.actionButton}>
                  Nawiguj
                </Button>
              </Card.Actions>
            </Card>
          )}
        </Modal>
      </Portal>
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
  modalContent: {
    padding: 20,
  },
  poiCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  poiTitle: {
    fontWeight: '700',
  },
  poiDescription: {
    color: colors.gray600,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.gray100,
  },
  poiActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
});
