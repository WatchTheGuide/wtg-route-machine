/**
 * WTG Routes - POI Bottom Sheet Component
 */

import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import {
  Text,
  Button,
  IconButton,
  Divider,
  useTheme,
} from 'react-native-paper';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '../../theme/colors';
import type { POI } from '../../types';

interface POIBottomSheetProps {
  poi: POI | null;
  onClose: () => void;
  onAddToRoute: (poi: POI) => void;
  onNavigate: (poi: POI) => void;
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

export function POIBottomSheet({
  poi,
  onClose,
  onAddToRoute,
  onNavigate,
}: POIBottomSheetProps) {
  const theme = useTheme();
  const snapPoints = useMemo(() => ['35%', '70%'], []);

  const handleOpenWebsite = useCallback(() => {
    if (poi?.website) {
      Linking.openURL(poi.website);
    }
  }, [poi]);

  const handleOpenPhone = useCallback(() => {
    if (poi?.phone) {
      Linking.openURL(`tel:${poi.phone}`);
    }
  }, [poi]);

  if (!poi) {
    return null;
  }

  const categoryLabel = CATEGORY_LABELS[poi.category] || poi.category;
  const categoryIcon = CATEGORY_ICONS[poi.category] || 'map-marker';

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.name}>
              {poi.name}
            </Text>
            <View style={styles.categoryRow}>
              <IconButton
                icon={categoryIcon}
                size={16}
                iconColor={theme.colors.primary}
                style={styles.categoryIcon}
              />
              <Text variant="labelMedium" style={styles.category}>
                {categoryLabel}
              </Text>
            </View>
          </View>
          <IconButton icon="close" size={24} onPress={onClose} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="directions"
            onPress={() => onNavigate(poi)}
            style={styles.actionButton}>
            Nawiguj
          </Button>
          <Button
            mode="contained-tonal"
            icon="plus"
            onPress={() => onAddToRoute(poi)}
            style={styles.actionButton}>
            Dodaj do trasy
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Description */}
        {poi.description && (
          <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Opis
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {poi.description}
            </Text>
          </View>
        )}

        {/* Details */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Informacje
          </Text>

          {poi.address && (
            <View style={styles.infoRow}>
              <IconButton
                icon="map-marker"
                size={20}
                iconColor={colors.gray500}
              />
              <Text variant="bodyMedium" style={styles.infoText}>
                {poi.address}
              </Text>
            </View>
          )}

          {poi.openingHours && (
            <View style={styles.infoRow}>
              <IconButton
                icon="clock-outline"
                size={20}
                iconColor={colors.gray500}
              />
              <Text variant="bodyMedium" style={styles.infoText}>
                {poi.openingHours}
              </Text>
            </View>
          )}

          {poi.phone && (
            <View style={styles.infoRow}>
              <IconButton icon="phone" size={20} iconColor={colors.gray500} />
              <Text
                variant="bodyMedium"
                style={[styles.infoText, styles.link]}
                onPress={handleOpenPhone}>
                {poi.phone}
              </Text>
            </View>
          )}

          {poi.website && (
            <View style={styles.infoRow}>
              <IconButton icon="web" size={20} iconColor={colors.gray500} />
              <Text
                variant="bodyMedium"
                style={[styles.infoText, styles.link]}
                onPress={handleOpenWebsite}
                numberOfLines={1}>
                {poi.website}
              </Text>
            </View>
          )}
        </View>

        {/* Accessibility */}
        {poi.accessibility && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Dostępność
              </Text>
              <View style={styles.accessibilityRow}>
                {poi.accessibility.wheelchairAccessible && (
                  <View style={styles.accessibilityItem}>
                    <IconButton
                      icon="wheelchair-accessibility"
                      size={20}
                      iconColor={colors.success}
                    />
                    <Text variant="labelSmall">Dla wózków</Text>
                  </View>
                )}
                {poi.accessibility.audioGuide && (
                  <View style={styles.accessibilityItem}>
                    <IconButton
                      icon="headphones"
                      size={20}
                      iconColor={colors.success}
                    />
                    <Text variant="labelSmall">Audioprzewodnik</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: colors.gray300,
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: -8,
  },
  categoryIcon: {
    margin: 0,
  },
  category: {
    color: colors.gray600,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  description: {
    color: colors.gray600,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
    marginVertical: 2,
  },
  infoText: {
    color: colors.gray700,
    flex: 1,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  accessibilityRow: {
    flexDirection: 'row',
    gap: 16,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
});

export default POIBottomSheet;
