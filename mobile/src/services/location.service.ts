/**
 * WTG Routes - Location Service
 *
 * Manages device location and background tracking
 */

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import type { Coordinate } from '../types';

const LOCATION_TASK_NAME = 'wtg-background-location';

// Define background task
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: TaskManager.TaskManagerTaskBody<{
    locations: Location.LocationObject[];
  }>) => {
    if (error) {
      console.error('Background location error:', error);
      return;
    }

    if (data) {
      const { locations } = data;
      // Handle location updates
      // This will be connected to navigation store
      console.log('Background locations:', locations);
    }
  }
);
class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      return false;
    }

    // Request background permission for navigation
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    return backgroundStatus === 'granted';
  }

  /**
   * Check if permissions are granted
   */
  async hasPermissions(): Promise<{
    foreground: boolean;
    background: boolean;
  }> {
    const { status: foregroundStatus } =
      await Location.getForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.getBackgroundPermissionsAsync();

    return {
      foreground: foregroundStatus === 'granted',
      background: backgroundStatus === 'granted',
    };
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Coordinate> {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return [location.coords.longitude, location.coords.latitude];
  }

  /**
   * Get last known location (faster, may be stale)
   */
  async getLastKnownLocation(): Promise<Coordinate | null> {
    const location = await Location.getLastKnownPositionAsync();

    if (!location) return null;

    return [location.coords.longitude, location.coords.latitude];
  }

  /**
   * Start watching location (foreground)
   */
  async startWatching(
    onLocation: (coordinate: Coordinate, heading: number | null) => void,
    highAccuracy: boolean = true
  ): Promise<void> {
    if (this.locationSubscription) {
      await this.stopWatching();
    }

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: highAccuracy
          ? Location.Accuracy.BestForNavigation
          : Location.Accuracy.Balanced,
        timeInterval: 1000, // 1 second
        distanceInterval: 5, // 5 meters
      },
      (location) => {
        const coordinate: Coordinate = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        onLocation(coordinate, location.coords.heading);
      }
    );
  }

  /**
   * Stop watching location
   */
  async stopWatching(): Promise<void> {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  /**
   * Start background location tracking (for navigation)
   */
  async startBackgroundTracking(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );

    if (isRegistered) {
      await this.stopBackgroundTracking();
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 2000,
      distanceInterval: 10,
      foregroundService: {
        notificationTitle: 'WTG Routes - Nawigacja',
        notificationBody: 'Trwa nawigacja do celu',
        notificationColor: '#ff6600',
      },
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });
  }

  /**
   * Stop background location tracking
   */
  async stopBackgroundTracking(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );

    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  }

  /**
   * Calculate distance between two coordinates (in meters)
   */
  calculateDistance(from: Coordinate, to: Coordinate): number {
    const R = 6371000; // Earth's radius in meters
    const lat1 = (from[1] * Math.PI) / 180;
    const lat2 = (to[1] * Math.PI) / 180;
    const deltaLat = ((to[1] - from[1]) * Math.PI) / 180;
    const deltaLon = ((to[0] - from[0]) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Calculate bearing between two coordinates (in degrees)
   */
  calculateBearing(from: Coordinate, to: Coordinate): number {
    const lat1 = (from[1] * Math.PI) / 180;
    const lat2 = (to[1] * Math.PI) / 180;
    const lon1 = (from[0] * Math.PI) / 180;
    const lon2 = (to[0] * Math.PI) / 180;

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return (bearing + 360) % 360;
  }
}

export const locationService = new LocationService();
