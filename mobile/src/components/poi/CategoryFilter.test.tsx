import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

// Mock Ionic components
vi.mock('@ionic/react', () => ({
  IonChip: ({
    children,
    onClick,
    color,
    outline,
    ...props
  }: React.PropsWithChildren<{
    onClick?: () => void;
    color?: string;
    outline?: boolean;
  }>) => (
    <button
      onClick={onClick}
      data-color={color}
      data-outline={outline}
      {...props}>
      {children}
    </button>
  ),
  IonLabel: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
}));

describe('CategoryFilter', () => {
  it('should render all category chips', () => {
    const { getByTestId } = render(
      <CategoryFilter selectedCategory={null} onCategoryChange={() => {}} />
    );

    expect(getByTestId('category-filter')).toBeDefined();
    expect(getByTestId('category-chip-all')).toBeDefined();
    expect(getByTestId('category-chip-landmark')).toBeDefined();
    expect(getByTestId('category-chip-museum')).toBeDefined();
  });

  it('should call onCategoryChange when chip is clicked', () => {
    const onCategoryChange = vi.fn();
    const { getByTestId } = render(
      <CategoryFilter
        selectedCategory={null}
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.click(getByTestId('category-chip-museum'));

    expect(onCategoryChange).toHaveBeenCalledWith('museum');
  });

  it('should call onCategoryChange with null when "all" is clicked', () => {
    const onCategoryChange = vi.fn();
    const { getByTestId } = render(
      <CategoryFilter
        selectedCategory="landmark"
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.click(getByTestId('category-chip-all'));

    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });

  it('should highlight selected category', () => {
    const { getByTestId } = render(
      <CategoryFilter selectedCategory="park" onCategoryChange={() => {}} />
    );

    const parkChip = getByTestId('category-chip-park');
    expect(parkChip.getAttribute('data-color')).toBe('primary');
    expect(parkChip.getAttribute('data-outline')).toBe('false');

    const allChip = getByTestId('category-chip-all');
    expect(allChip.getAttribute('data-outline')).toBe('true');
  });
});
