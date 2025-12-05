/**
 * WTG Routes - Predefined Tours Screen
 */

import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Text,
  Card,
  Chip,
  useTheme,
  Searchbar,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTours } from '../../src/hooks/useTours';
import { colors } from '../../src/theme/colors';
import type { Tour } from '../../src/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Łatwa',
  medium: 'Średnia',
  hard: 'Trudna',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
};

export default function ToursScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('krakow');
  const { data: tours, isLoading } = useTours(selectedCity);

  const filteredTours =
    tours?.filter(
      (tour) =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
    }
    return `${mins} min`;
  };

  const handleTourPress = (tour: Tour) => {
    router.push({
      pathname: '/navigation/tour/[tourId]',
      params: { tourId: tour.id },
    });
  };

  const renderTourCard = (tour: Tour) => (
    <Card
      key={tour.id}
      style={styles.card}
      onPress={() => handleTourPress(tour)}>
      <Card.Cover
        source={{ uri: tour.imageUrl || 'https://via.placeholder.com/300x200' }}
        style={styles.cardCover}
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" numberOfLines={2} style={styles.tourName}>
          {tour.name}
        </Text>
        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={styles.tourDescription}>
          {tour.description}
        </Text>
        <View style={styles.tourMeta}>
          <Chip
            compact
            style={[
              styles.difficultyChip,
              { backgroundColor: DIFFICULTY_COLORS[tour.difficulty] + '20' },
            ]}
            textStyle={{
              color: DIFFICULTY_COLORS[tour.difficulty],
              fontSize: 10,
            }}>
            {DIFFICULTY_LABELS[tour.difficulty]}
          </Chip>
          <Text variant="labelSmall" style={styles.duration}>
            {formatDuration(tour.estimatedDuration)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const CitySelector = () => (
    <SegmentedButtons
      value={selectedCity}
      onValueChange={setSelectedCity}
      buttons={[
        { value: 'krakow', label: 'Kraków' },
        { value: 'warszawa', label: 'Warszawa' },
        { value: 'wroclaw', label: 'Wrocław' },
        { value: 'trojmiasto', label: 'Trójmiasto' },
      ]}
      style={styles.segmentedButtons}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Brak wycieczek
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        Wycieczki dla tego miasta pojawią się wkrótce!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Wycieczki
        </Text>
        <Searchbar
          placeholder="Szukaj wycieczek..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <CitySelector />

        {filteredTours.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <View style={styles.grid}>{filteredTours.map(renderTourCard)}</View>
        )}
      </ScrollView>
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
    marginBottom: 12,
  },
  searchbar: {
    backgroundColor: colors.gray100,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  cardCover: {
    height: 120,
  },
  cardContent: {
    paddingVertical: 12,
  },
  tourName: {
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: 4,
  },
  tourDescription: {
    color: colors.gray500,
    marginBottom: 8,
  },
  tourMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyChip: {
    height: 24,
  },
  duration: {
    color: colors.gray500,
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
  },
});
