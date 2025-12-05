/**
 * WTG Routes - Navigation Store (Zustand)
 *
 * Manages active navigation state
 */

import { create } from 'zustand';
import type {
  Coordinate,
  NavigationState,
  RouteStep,
  Waypoint,
} from '../types';

interface NavigationStore {
  // State
  isNavigating: boolean;
  currentPosition: Coordinate | null;
  destination: Coordinate | null;
  waypoints: Waypoint[];
  currentStepIndex: number;
  steps: RouteStep[];
  remainingDistance: number;
  remainingDuration: number;
  routeGeometry: Coordinate[];

  // Actions
  startNavigation: (
    waypoints: Waypoint[],
    steps: RouteStep[],
    geometry: Coordinate[]
  ) => void;
  stopNavigation: () => void;
  updatePosition: (position: Coordinate) => void;
  nextStep: () => void;
  setSteps: (steps: RouteStep[]) => void;
  updateRemainingDistance: (distance: number, duration: number) => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  isNavigating: false,
  currentPosition: null,
  destination: null,
  waypoints: [],
  currentStepIndex: 0,
  steps: [],
  remainingDistance: 0,
  remainingDuration: 0,
  routeGeometry: [],

  startNavigation: (waypoints, steps, geometry) => {
    const lastWaypoint = waypoints[waypoints.length - 1];
    set({
      isNavigating: true,
      waypoints,
      steps,
      routeGeometry: geometry,
      currentStepIndex: 0,
      destination: lastWaypoint ? lastWaypoint.coordinate : null,
      remainingDistance: steps.reduce((sum, s) => sum + s.distance, 0),
      remainingDuration: steps.reduce((sum, s) => sum + s.duration, 0),
    });
  },

  stopNavigation: () =>
    set({
      isNavigating: false,
      currentPosition: null,
      destination: null,
      waypoints: [],
      currentStepIndex: 0,
      steps: [],
      remainingDistance: 0,
      remainingDuration: 0,
      routeGeometry: [],
    }),

  updatePosition: (position) => set({ currentPosition: position }),

  nextStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  setSteps: (steps) => set({ steps }),

  updateRemainingDistance: (distance, duration) =>
    set({
      remainingDistance: distance,
      remainingDuration: duration,
    }),
}));
