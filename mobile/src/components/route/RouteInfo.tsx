/**
 * RouteInfo - Display route distance and duration
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { Route } from '../../types';

interface RouteInfoProps {
  route: Route;
  formatDistance: (meters: number) => string;
  formatDuration: (seconds: number) => string;
  onStartNavigation?: () => void;
  onSaveRoute?: () => void;
  onClear?: () => void;
}

export function RouteInfo({
  route,
  formatDistance,
  formatDuration,
  onStartNavigation,
  onSaveRoute,
  onClear,
}: RouteInfoProps) {
  return (
    <Surface style={styles.container} elevation={2}>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {formatDistance(route.distance)}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Dystans
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {formatDuration(route.duration)}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Czas
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {route.waypoints.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Punkty
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onStartNavigation && (
          <Button
            mode="contained"
            icon="navigation"
            onPress={onStartNavigation}
            style={styles.actionButton}
            buttonColor={colors.primary}>
            Nawiguj
          </Button>
        )}
        {onSaveRoute && (
          <Button
            mode="outlined"
            icon="content-save"
            onPress={onSaveRoute}
            style={styles.actionButton}
            textColor={colors.primary}>
            Zapisz
          </Button>
        )}
        {onClear && (
          <Button
            mode="text"
            icon="close"
            onPress={onClear}
            textColor={colors.gray600}>
            Wyczyść
          </Button>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.gray900,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.gray600,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray200,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
  },
});
