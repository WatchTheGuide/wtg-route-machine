/**
 * RouteCard - Card displaying saved route info
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { Route, RoutingProfile } from '../../types';

interface RouteCardProps {
  route: Route;
  onPress: (route: Route) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const PROFILE_ICONS: Record<RoutingProfile, string> = {
  walking: 'walk',
  cycling: 'bike',
  driving: 'car',
};

const PROFILE_LABELS: Record<RoutingProfile, string> = {
  walking: 'Pieszo',
  cycling: 'Rower',
  driving: 'Auto',
};

export function RouteCard({
  route,
  onPress,
  onDelete,
  onToggleFavorite,
}: RouteCardProps) {
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Surface style={styles.card} elevation={1}>
      <Pressable style={styles.content} onPress={() => onPress(route)}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
              {route.name}
            </Text>
            <IconButton
              icon={route.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              iconColor={route.isFavorite ? colors.error : colors.gray400}
              onPress={() => onToggleFavorite(route.id)}
              style={styles.favoriteButton}
            />
          </View>
          {route.description && (
            <Text
              variant="bodySmall"
              style={styles.description}
              numberOfLines={2}>
              {route.description}
            </Text>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <IconButton
              icon={PROFILE_ICONS[route.profile]}
              size={18}
              iconColor={colors.primary}
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statText}>
              {PROFILE_LABELS[route.profile]}
            </Text>
          </View>

          <View style={styles.statItem}>
            <IconButton
              icon="map-marker-distance"
              size={18}
              iconColor={colors.gray600}
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statText}>
              {formatDistance(route.distance)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <IconButton
              icon="clock-outline"
              size={18}
              iconColor={colors.gray600}
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statText}>
              {formatDuration(route.duration)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <IconButton
              icon="map-marker-multiple"
              size={18}
              iconColor={colors.gray600}
              style={styles.statIcon}
            />
            <Text variant="bodySmall" style={styles.statText}>
              {route.waypoints.length} pkt
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(route.createdAt)}
          </Text>
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={colors.gray400}
            onPress={() => onDelete(route.id)}
          />
        </View>
      </Pressable>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontWeight: '600',
    color: colors.gray900,
  },
  favoriteButton: {
    margin: -8,
  },
  description: {
    color: colors.gray600,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 8,
    paddingRight: 8,
  },
  statIcon: {
    margin: 0,
  },
  statText: {
    color: colors.gray700,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 8,
    marginTop: 4,
  },
  date: {
    color: colors.gray500,
  },
});
