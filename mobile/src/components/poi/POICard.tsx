import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  IconButton,
  Portal,
} from 'react-native-paper';
import { colors } from '../../theme/colors';
import type { POI } from '../../types';

interface POICardProps {
  poi: POI | null;
  visible: boolean;
  onDismiss: () => void;
  onAddToRoute?: (poi: POI) => void;
  onNavigate?: (poi: POI) => void;
}

const { height: screenHeight } = Dimensions.get('window');

export function POICard({
  poi,
  visible,
  onDismiss,
  onAddToRoute,
  onNavigate,
}: POICardProps) {
  if (!visible || !poi) {
    return null;
  }

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      museum: 'bank',
      monument: 'monument',
      church: 'church',
      park: 'tree',
      restaurant: 'silverware-fork-knife',
      cafe: 'coffee',
      hotel: 'bed',
      shopping: 'shopping',
      transport: 'bus',
      entertainment: 'movie',
    };
    return icons[category] || 'map-marker';
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      museum: 'Muzeum',
      monument: 'Pomnik',
      church: 'Kościół',
      park: 'Park',
      restaurant: 'Restauracja',
      cafe: 'Kawiarnia',
      hotel: 'Hotel',
      shopping: 'Zakupy',
      transport: 'Transport',
      entertainment: 'Rozrywka',
    };
    return labels[category] || category;
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />

        <Surface style={styles.card} elevation={5}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text variant="titleLarge" style={styles.title}>
                {poi.name}
              </Text>
              <Chip
                icon={getCategoryIcon(poi.category)}
                style={styles.categoryChip}
                textStyle={styles.categoryChipText}>
                {getCategoryLabel(poi.category)}
              </Chip>
            </View>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            {poi.description && (
              <Text variant="bodyMedium" style={styles.description}>
                {poi.description}
              </Text>
            )}

            {poi.address && (
              <View style={styles.infoRow}>
                <IconButton
                  icon="map-marker"
                  size={20}
                  iconColor={colors.gray600}
                />
                <Text variant="bodySmall" style={styles.infoText}>
                  {poi.address}
                </Text>
              </View>
            )}

            {poi.openingHours && (
              <View style={styles.infoRow}>
                <IconButton
                  icon="clock-outline"
                  size={20}
                  iconColor={colors.gray600}
                />
                <Text variant="bodySmall" style={styles.infoText}>
                  {poi.openingHours}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => onAddToRoute?.(poi)}
              style={styles.actionButton}
              buttonColor={colors.primary}>
              Dodaj do trasy
            </Button>
            <Button
              mode="outlined"
              icon="directions"
              onPress={() => onNavigate?.(poi)}
              style={styles.actionButton}
              textColor={colors.primary}>
              Nawiguj
            </Button>
          </View>
        </Surface>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.6,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.primary,
  },
  closeButton: {
    margin: -8,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: screenHeight * 0.3,
  },
  description: {
    color: colors.gray900,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: -12,
  },
  infoText: {
    color: colors.gray600,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
