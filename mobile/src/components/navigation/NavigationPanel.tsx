/**
 * WTG Routes - Navigation Panel Component
 *
 * Shows current navigation step and route info
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface, useTheme } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { navigationService } from '../../services/navigation.service';
import type { RouteStep } from '../../types';

interface NavigationPanelProps {
  currentStep: RouteStep;
  nextStep?: RouteStep;
  distanceToNextStep: number;
  remainingDistance: number;
  remainingDuration: number;
  onClose: () => void;
  onExpandSteps: () => void;
}

export function NavigationPanel({
  currentStep,
  nextStep,
  distanceToNextStep,
  remainingDistance,
  remainingDuration,
  onClose,
  onExpandSteps,
}: NavigationPanelProps) {
  const theme = useTheme();

  const maneuverIcon = navigationService.getManeuverIcon(
    currentStep.maneuver,
    currentStep.modifier
  );

  return (
    <Surface style={styles.container} elevation={4}>
      {/* Current Step */}
      <TouchableOpacity style={styles.mainSection} onPress={onExpandSteps}>
        <View style={styles.maneuverContainer}>
          <View
            style={[
              styles.maneuverIcon,
              { backgroundColor: theme.colors.primary },
            ]}>
            <IconButton
              icon={maneuverIcon}
              iconColor={colors.white}
              size={32}
            />
          </View>
          <Text variant="headlineMedium" style={styles.distance}>
            {navigationService.formatDistance(distanceToNextStep)}
          </Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text
            variant="titleMedium"
            style={styles.instruction}
            numberOfLines={2}>
            {currentStep.instruction}
          </Text>
          {currentStep.name && (
            <Text variant="bodyMedium" style={styles.streetName}>
              {currentStep.name}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Next Step Preview */}
      {nextStep && (
        <View style={styles.nextStep}>
          <Text variant="labelSmall" style={styles.nextLabel}>
            NASTĘPNIE
          </Text>
          <View style={styles.nextContent}>
            <IconButton
              icon={navigationService.getManeuverIcon(
                nextStep.maneuver,
                nextStep.modifier
              )}
              iconColor={colors.gray500}
              size={20}
            />
            <Text
              variant="bodySmall"
              style={styles.nextInstruction}
              numberOfLines={1}>
              {nextStep.instruction}
            </Text>
          </View>
        </View>
      )}

      {/* Route Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <IconButton
            icon="map-marker-distance"
            size={18}
            iconColor={colors.gray500}
          />
          <Text variant="labelMedium" style={styles.summaryText}>
            {navigationService.formatDistance(remainingDistance)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <IconButton
            icon="clock-outline"
            size={18}
            iconColor={colors.gray500}
          />
          <Text variant="labelMedium" style={styles.summaryText}>
            {navigationService.formatDuration(remainingDuration)}
          </Text>
        </View>
        <View style={styles.closeButton}>
          <IconButton
            icon="close"
            iconColor={colors.error}
            size={24}
            onPress={onClose}
          />
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  mainSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  maneuverContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  maneuverIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distance: {
    fontWeight: 'bold',
    color: colors.gray900,
    marginTop: 4,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instruction: {
    fontWeight: '600',
    color: colors.gray900,
  },
  streetName: {
    color: colors.gray600,
    marginTop: 2,
  },
  nextStep: {
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  nextLabel: {
    color: colors.gray500,
    marginBottom: 4,
  },
  nextContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  nextInstruction: {
    flex: 1,
    color: colors.gray600,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  summaryText: {
    color: colors.gray700,
  },
  summaryDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.gray300,
    marginHorizontal: 12,
  },
  closeButton: {
    marginLeft: 'auto',
  },
});

export default NavigationPanel;
