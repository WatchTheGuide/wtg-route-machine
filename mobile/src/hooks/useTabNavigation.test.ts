import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTabNavigation } from './useTabNavigation';

// Mock react-router-dom
const mockPush = vi.fn();
vi.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe('useTabNavigation', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('powinien nawigować do Explore', () => {
    const { result } = renderHook(() => useTabNavigation());

    result.current.goToExplore();

    expect(mockPush).toHaveBeenCalledWith('/explore');
  });

  it('powinien nawigować do Routes', () => {
    const { result } = renderHook(() => useTabNavigation());

    result.current.goToRoutes();

    expect(mockPush).toHaveBeenCalledWith('/routes');
  });

  it('powinien nawigować do Tours', () => {
    const { result } = renderHook(() => useTabNavigation());

    result.current.goToTours();

    expect(mockPush).toHaveBeenCalledWith('/tours');
  });

  it('powinien nawigować do Settings', () => {
    const { result } = renderHook(() => useTabNavigation());

    result.current.goToSettings();

    expect(mockPush).toHaveBeenCalledWith('/settings');
  });
});
