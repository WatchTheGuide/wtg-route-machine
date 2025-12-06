import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWaypoints } from './useWaypoints';

describe('useWaypoints', () => {
  it('should start with empty waypoints', () => {
    const { result } = renderHook(() => useWaypoints());
    expect(result.current.waypoints).toEqual([]);
    expect(result.current.canCalculateRoute).toBe(false);
  });

  it('should add waypoint', () => {
    const { result } = renderHook(() => useWaypoints());

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Test Point');
    });

    expect(result.current.waypoints).toHaveLength(1);
    expect(result.current.waypoints[0].name).toBe('Test Point');
    expect(result.current.waypoints[0].coordinate).toEqual([19.9449, 50.0647]);
  });

  it('should remove waypoint', () => {
    const { result } = renderHook(() => useWaypoints());

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Point 1');
    });

    const waypointId = result.current.waypoints[0].id;

    act(() => {
      result.current.removeWaypoint(waypointId);
    });

    expect(result.current.waypoints).toHaveLength(0);
  });

  it('should reorder waypoints', () => {
    const { result } = renderHook(() => useWaypoints());

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Point 1');
      result.current.addWaypoint([21.0122, 52.2297], 'Point 2');
      result.current.addWaypoint([17.0385, 51.1079], 'Point 3');
    });

    act(() => {
      result.current.reorderWaypoints(0, 2);
    });

    expect(result.current.waypoints[0].name).toBe('Point 2');
    expect(result.current.waypoints[2].name).toBe('Point 1');
  });

  it('should clear all waypoints', () => {
    const { result } = renderHook(() => useWaypoints());

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Point 1');
      result.current.addWaypoint([21.0122, 52.2297], 'Point 2');
    });

    act(() => {
      result.current.clearWaypoints();
    });

    expect(result.current.waypoints).toHaveLength(0);
  });

  it('should indicate when route can be calculated', () => {
    const { result } = renderHook(() => useWaypoints());

    expect(result.current.canCalculateRoute).toBe(false);

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Point 1');
    });

    expect(result.current.canCalculateRoute).toBe(false);

    act(() => {
      result.current.addWaypoint([21.0122, 52.2297], 'Point 2');
    });

    expect(result.current.canCalculateRoute).toBe(true);
  });

  it('should update waypoint', () => {
    const { result } = renderHook(() => useWaypoints());

    act(() => {
      result.current.addWaypoint([19.9449, 50.0647], 'Original');
    });

    const waypointId = result.current.waypoints[0].id;

    act(() => {
      result.current.updateWaypoint(waypointId, { name: 'Updated' });
    });

    expect(result.current.waypoints[0].name).toBe('Updated');
  });
});
