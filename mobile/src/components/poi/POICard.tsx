/**
 * WTG Routes - POI Card Component
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme } from 'react-native-paper';
import { colors } from '../../theme/colors';
import type { POI } from '../../types';

interface POICardProps {
  poi: POI;
  onPress?: (poi: POI) => void;
  onAddToRoute?: (poi: POI) => void;
  onNavigate?: (poi: POI) => void;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  landmark: 'Zabytek',
  museum: 'Muzeum',
  church: 'Kościół',
  park: 'Park',
  restaurant: 'Restauracja',
  cafe: 'Kawiarnia',
  hotel: 'Hotel',
  monument: 'Pomnik',
  theater: 'Teatr',
  viewpoint: 'Punkt widokowy',
};

const CATEGORY_ICONS: Record<string, string> = {
  landmark: 'castle',
  museum: 'bank',
  church: 'church',
  park: 'tree',
  restaurant: 'food',
  cafe: 'coffee',
  hotel: 'bed',
  monument: 'pillar',
  theater: 'drama-masks',
  viewpoint: 'eye',
};

export function POICard({
  poi,
  onPress,
  onAddToRoute,
  onNavigate,
  compact = false,
}: POICardProps) {
  const theme = useTheme();

  const categoryLabel = CATEGORY_LABELS[poi.category] || poi.category;
  const categoryIcon = CATEGORY_ICONS[poi.category] || 'map-marker';

  if (compact) {
    return (
      <Card style={styles.compactCard} onPress={() => onPress?.(poi)}>
        <Card.Title
          title={poi.name}
          subtitle={categoryLabel}
          left={(props) => (
            <IconButton
              {...props}
              icon={categoryIcon}
              iconColor={theme.colors.primary}
              size={20}
            />
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="plus"
              onPress={() => onAddToRoute?.(poi)}
            />
          )}
          titleStyle={styles.compactTitle}
          subtitleStyle={styles.compactSubtitle}
        />
      </Card>
    );
  }

  return (
    <Card style={styles.card} onPress={() => onPress?.(poi)}>
      {poi.imageUrl && (
        <Card.Cover source={{ uri: poi.imageUrl }} style={styles.cover} />
      )}
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.name}>
            {poi.name}
          </Text>
          <Chip
            icon={categoryIcon}
            compact
            style={styles.categoryChip}
            textStyle={styles.categoryText}>
            {categoryLabel}
          </Chip>
        </View>

        {poi.description && (
          <Text
            variant="bodySmall"
            numberOfLines={2}
            style={styles.description}>
            {poi.description}
          </Text>
        )}

        {poi.address && (
          <View style={styles.addressRow}>
            <IconButton
              icon="map-marker"
              size={16}
              iconColor={colors.gray400}
            />
            <Text variant="labelSmall" style={styles.address}>
              {poi.address}
            </Text>
          </View>
        )}

        {poi.openingHours && (
          <View style={styles.hoursRow}>
            <IconButton
              icon="clock-outline"
              size={16}
              iconColor={colors.gray400}
            />
            <Text variant="labelSmall" style={styles.hours}>
              {poi.openingHours}
            </Text>
          </View>
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <IconButton
          icon="directions"
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor={colors.white}
          onPress={() => onNavigate?.(poi)}
        />
        <IconButton
          icon="plus"
          mode="contained-tonal"
          onPress={() => onAddToRoute?.(poi)}
        />
        <IconButton
          icon="share-variant"
          mode="contained-tonal"
          onPress={() => {}}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
  compactCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.white,
  },
  cover: {
    height: 150,
  },
  content: {
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontWeight: '600',
    color: colors.gray900,
    marginRight: 8,
  },
  categoryChip: {
    backgroundColor: colors.gray100,
  },
  categoryText: {
    fontSize: 10,
  },
  description: {
    color: colors.gray600,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  address: {
    color: colors.gray500,
    flex: 1,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  hours: {
    color: colors.gray500,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactSubtitle: {
    fontSize: 12,
  },
});

export default POICard;
