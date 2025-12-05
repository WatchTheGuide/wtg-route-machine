/**
 * WTG Routes - Navigation Service
 *
 * Handles turn-by-turn navigation logic
 */

import * as Speech from 'expo-speech';
import { locationService } from './location.service';
import type { Coordinate, RouteStep } from '../types';

// Distance thresholds in meters
const STEP_COMPLETE_THRESHOLD = 15; // Consider step complete when within 15m
const ANNOUNCE_DISTANCE = 50; // Announce turn 50m before
const ANNOUNCE_SOON_DISTANCE = 20; // Announce "now" 20m before

interface NavigationUpdate {
  currentStepIndex: number;
  distanceToNextStep: number;
  remainingDistance: number;
  remainingDuration: number;
  shouldAnnounce: boolean;
  announcement?: string;
  isOffRoute: boolean;
}

class NavigationService {
  private isNavigating: boolean = false;
  private voiceEnabled: boolean = true;
  private lastAnnouncedStep: number = -1;
  private lastAnnouncedType: 'far' | 'near' | 'now' | null = null;

  /**
   * Enable/disable voice navigation
   */
  setVoiceEnabled(enabled: boolean): void {
    this.voiceEnabled = enabled;
    if (!enabled) {
      Speech.stop();
    }
  }

  /**
   * Speak navigation instruction
   */
  async speak(text: string): Promise<void> {
    if (!this.voiceEnabled) return;

    await Speech.stop();
    await Speech.speak(text, {
      language: 'pl-PL',
      rate: 1.0,
      pitch: 1.0,
    });
  }

  /**
   * Calculate navigation update based on current position
   */
  calculateUpdate(
    currentPosition: Coordinate,
    steps: RouteStep[],
    currentStepIndex: number
  ): NavigationUpdate {
    if (currentStepIndex >= steps.length) {
      return {
        currentStepIndex,
        distanceToNextStep: 0,
        remainingDistance: 0,
        remainingDuration: 0,
        shouldAnnounce: false,
        isOffRoute: false,
      };
    }

    const currentStep = steps[currentStepIndex];
    const stepLocation = currentStep.geometry?.[0];

    if (!stepLocation) {
      return {
        currentStepIndex,
        distanceToNextStep: 0,
        remainingDistance: 0,
        remainingDuration: 0,
        shouldAnnounce: false,
        isOffRoute: false,
      };
    }

    // Calculate distance to current step maneuver point
    const distanceToNextStep = locationService.calculateDistance(
      currentPosition,
      stepLocation
    );

    // Check if we've completed the current step
    let newStepIndex = currentStepIndex;
    if (
      distanceToNextStep < STEP_COMPLETE_THRESHOLD &&
      currentStepIndex < steps.length - 1
    ) {
      newStepIndex = currentStepIndex + 1;
    }

    // Calculate remaining distance and duration
    let remainingDistance = distanceToNextStep;
    let remainingDuration = 0;

    for (let i = newStepIndex; i < steps.length; i++) {
      if (i > newStepIndex) {
        remainingDistance += steps[i].distance;
      }
      remainingDuration += steps[i].duration;
    }

    // Determine if we should announce
    let shouldAnnounce = false;
    let announcement: string | undefined;
    let announceType: 'far' | 'near' | 'now' | null = null;

    const nextStep = steps[newStepIndex];
    const nextStepGeometry = nextStep.geometry?.[0];

    if (!nextStepGeometry) {
      return {
        currentStepIndex: newStepIndex,
        distanceToNextStep,
        remainingDistance,
        remainingDuration,
        shouldAnnounce: false,
        isOffRoute: false,
      };
    }

    const nextStepDistance = locationService.calculateDistance(
      currentPosition,
      nextStepGeometry
    );

    if (
      newStepIndex !== this.lastAnnouncedStep ||
      this.lastAnnouncedType !== 'now'
    ) {
      if (nextStepDistance <= ANNOUNCE_SOON_DISTANCE) {
        // Announce "now"
        announcement = `Teraz, ${nextStep.instruction}`;
        announceType = 'now';
        shouldAnnounce = true;
      } else if (
        nextStepDistance <= ANNOUNCE_DISTANCE &&
        this.lastAnnouncedType !== 'near' &&
        this.lastAnnouncedType !== 'now'
      ) {
        // Announce distance
        announcement = `Za ${Math.round(nextStepDistance)} metrów, ${
          nextStep.instruction
        }`;
        announceType = 'near';
        shouldAnnounce = true;
      } else if (
        newStepIndex !== this.lastAnnouncedStep &&
        this.lastAnnouncedType === null
      ) {
        // First announcement for new step
        const distanceText =
          nextStepDistance > 100
            ? `${Math.round(nextStepDistance / 100) * 100} metrów`
            : `${Math.round(nextStepDistance)} metrów`;
        announcement = `Za ${distanceText}, ${nextStep.instruction}`;
        announceType = 'far';
        shouldAnnounce = true;
      }
    }

    if (shouldAnnounce && announceType) {
      this.lastAnnouncedStep = newStepIndex;
      this.lastAnnouncedType = announceType;
    }

    // Check if user is off route (more than 50m from route)
    const isOffRoute = this.checkOffRoute(currentPosition, steps, newStepIndex);

    return {
      currentStepIndex: newStepIndex,
      distanceToNextStep: nextStepDistance,
      remainingDistance,
      remainingDuration,
      shouldAnnounce,
      announcement,
      isOffRoute,
    };
  }

  /**
   * Check if user is off the route
   */
  private checkOffRoute(
    position: Coordinate,
    steps: RouteStep[],
    currentStepIndex: number
  ): boolean {
    const OFF_ROUTE_THRESHOLD = 50; // meters

    // Check distance to current and next few steps' geometry
    for (
      let i = currentStepIndex;
      i < Math.min(currentStepIndex + 3, steps.length);
      i++
    ) {
      const step = steps[i];
      if (!step.geometry) continue;

      for (const point of step.geometry) {
        const distance = locationService.calculateDistance(position, point);
        if (distance < OFF_ROUTE_THRESHOLD) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Format distance for display
   */
  formatDistance(meters: number, useMetric: boolean = true): string {
    if (useMetric) {
      if (meters < 1000) {
        return `${Math.round(meters)} m`;
      }
      return `${(meters / 1000).toFixed(1)} km`;
    } else {
      const feet = meters * 3.28084;
      if (feet < 1000) {
        return `${Math.round(feet)} ft`;
      }
      const miles = meters / 1609.34;
      return `${miles.toFixed(1)} mi`;
    }
  }

  /**
   * Format duration for display
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  }

  /**
   * Get maneuver icon name for step type
   */
  getManeuverIcon(maneuver: string, modifier?: string): string {
    const icons: Record<string, string> = {
      depart: 'arrow-up',
      arrive: 'flag-checkered',
      'turn-left': 'arrow-left',
      'turn-right': 'arrow-right',
      'turn-slight left': 'arrow-top-left',
      'turn-slight right': 'arrow-top-right',
      'turn-sharp left': 'arrow-left-bold',
      'turn-sharp right': 'arrow-right-bold',
      'turn-uturn': 'arrow-u-left-top',
      continue: 'arrow-up',
      roundabout: 'rotate-right',
      rotary: 'rotate-right',
      'fork-left': 'arrow-split-horizontal',
      'fork-right': 'arrow-split-horizontal',
      merge: 'arrow-collapse-right',
      'end of road': 'arrow-up',
    };

    const key = modifier ? `${maneuver}-${modifier}` : maneuver;
    return icons[key] || icons[maneuver] || 'arrow-up';
  }

  /**
   * Reset navigation state
   */
  reset(): void {
    this.lastAnnouncedStep = -1;
    this.lastAnnouncedType = null;
    this.isNavigating = false;
    Speech.stop();
  }
}

export const navigationService = new NavigationService();
