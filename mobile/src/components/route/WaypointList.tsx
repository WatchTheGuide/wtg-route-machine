/**
 * WaypointList - Draggable list of route waypoints
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { Waypoint } from '../../types';

interface WaypointListProps {
  waypoints: Waypoint[];
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onWaypointPress?: (waypoint: Waypoint) => void;
}

export function WaypointList({
  waypoints,
  onRemove,
  onReorder,
  onWaypointPress,
}: WaypointListProps) {
  if (waypoints.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Dodaj punkty do trasy klikając na mapie lub wybierając POI
        </Text>
      </View>
    );
  }

  const moveUp = (index: number) => {
    if (index > 0 && onReorder) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < waypoints.length - 1 && onReorder) {
      onReorder(index, index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {waypoints.map((waypoint, index) => (
        <Surface key={waypoint.id} style={styles.waypointItem} elevation={1}>
          <View style={styles.orderIndicator}>
            <View
              style={[
                styles.orderCircle,
                index === 0 && styles.startCircle,
                index === waypoints.length - 1 && styles.endCircle,
              ]}>
              <Text style={styles.orderText}>{index + 1}</Text>
            </View>
            {index < waypoints.length - 1 && <View style={styles.connector} />}
          </View>

          <Pressable
            style={styles.waypointContent}
            onPress={() => onWaypointPress?.(waypoint)}>
            <Text
              variant="bodyMedium"
              style={styles.waypointName}
              numberOfLines={1}>
              {waypoint.name}
            </Text>
            {waypoint.poi && (
              <Text variant="bodySmall" style={styles.waypointCategory}>
                {waypoint.poi.category}
              </Text>
            )}
          </Pressable>

          <View style={styles.actions}>
            {onReorder && (
              <>
                <IconButton
                  icon="chevron-up"
                  size={20}
                  onPress={() => moveUp(index)}
                  disabled={index === 0}
                  iconColor={index === 0 ? colors.gray400 : colors.gray600}
                />
                <IconButton
                  icon="chevron-down"
                  size={20}
                  onPress={() => moveDown(index)}
                  disabled={index === waypoints.length - 1}
                  iconColor={
                    index === waypoints.length - 1
                      ? colors.gray400
                      : colors.gray600
                  }
                />
              </>
            )}
            <IconButton
              icon="close"
              size={20}
              onPress={() => onRemove(waypoint.id)}
              iconColor={colors.error}
            />
          </View>
        </Surface>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray600,
    textAlign: 'center',
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 8,
  },
  orderIndicator: {
    alignItems: 'center',
    paddingLeft: 12,
    paddingVertical: 12,
  },
  orderCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startCircle: {
    backgroundColor: colors.success,
  },
  endCircle: {
    backgroundColor: colors.primary,
  },
  orderText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  connector: {
    width: 2,
    height: 20,
    backgroundColor: colors.gray300,
    marginTop: 4,
  },
  waypointContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  waypointName: {
    color: colors.gray900,
    fontWeight: '500',
  },
  waypointCategory: {
    color: colors.gray600,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
