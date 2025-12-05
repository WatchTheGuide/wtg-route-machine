/**
 * Tours Screen - Curated walking tours
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Chip,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { TourDifficulty } from '../../src/types';

// Placeholder data
const SAMPLE_TOURS = [
  {
    id: '1',
    name: 'Kraków - Droga Królewska',
    description: 'Historyczna trasa od Barbakanu do Wawelu',
    city: 'krakow',
    difficulty: 'easy' as TourDifficulty,
    duration: 90,
    distance: 2500,
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Kazimierz - Dziedzictwo Żydowskie',
    description: 'Poznaj historię żydowskiej dzielnicy Krakowa',
    city: 'krakow',
    difficulty: 'medium' as TourDifficulty,
    duration: 120,
    distance: 3500,
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Nowa Huta - Socrealizm',
    description: 'Architektura socrealistyczna w Nowej Hucie',
    city: 'krakow',
    difficulty: 'medium' as TourDifficulty,
    duration: 150,
    distance: 4200,
    imageUrl: null,
  },
];

const DIFFICULTY_COLORS: Record<TourDifficulty, string> = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
};

const DIFFICULTY_LABELS: Record<TourDifficulty, string> = {
  easy: 'Łatwa',
  medium: 'Średnia',
  hard: 'Trudna',
};

export default function ToursScreen() {
  const theme = useTheme();
  const [selectedCity, setSelectedCity] = useState('krakow');

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const filteredTours = SAMPLE_TOURS.filter(
    (tour) => tour.city === selectedCity
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Wycieczki
        </Text>
      </View>

      {/* City Filter */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={selectedCity}
          onValueChange={setSelectedCity}
          buttons={[
            { value: 'krakow', label: 'Kraków' },
            { value: 'warszawa', label: 'Warszawa' },
            { value: 'wroclaw', label: 'Wrocław' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredTours.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={{ color: colors.gray500 }}>
              Brak wycieczek dla tego miasta
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: colors.gray400, marginTop: 4 }}>
              Wkrótce dodamy nowe trasy!
            </Text>
          </View>
        ) : (
          filteredTours.map((tour) => (
            <Card
              key={tour.id}
              style={styles.card}
              onPress={() => console.log('Open tour', tour.id)}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.tourName}>
                  {tour.name}
                </Text>
                <Text variant="bodySmall" style={styles.tourDescription}>
                  {tour.description}
                </Text>
                <View style={styles.tourMeta}>
                  <Chip
                    compact
                    style={[
                      styles.difficultyChip,
                      {
                        backgroundColor:
                          DIFFICULTY_COLORS[tour.difficulty] + '20',
                      },
                    ]}
                    textStyle={{
                      color: DIFFICULTY_COLORS[tour.difficulty],
                      fontSize: 12,
                    }}>
                    {DIFFICULTY_LABELS[tour.difficulty]}
                  </Chip>
                  <Text variant="labelSmall" style={styles.duration}>
                    ⏱️ {formatDuration(tour.duration)} • 📍{' '}
                    {formatDistance(tour.distance)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    // Styling handled by Paper
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  tourName: {
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: 4,
  },
  tourDescription: {
    color: colors.gray600,
    marginBottom: 12,
  },
  tourMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyChip: {
    height: 28,
  },
  duration: {
    color: colors.gray500,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
});
