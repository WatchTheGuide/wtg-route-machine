import React from 'react';
import { IonChip, IonLabel } from '@ionic/react';
import { POICategory } from '../../types';
import './CategoryFilter.css';

export interface CategoryFilterProps {
  /** Aktualnie wybrana kategoria (null = wszystkie) */
  selectedCategory: POICategory | null;
  /** Callback zmiany kategorii */
  onCategoryChange: (category: POICategory | null) => void;
}

interface CategoryItem {
  id: POICategory | null;
  name: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: null, name: 'Wszystkie', icon: '📍' },
  { id: 'landmark', name: 'Zabytki', icon: '🏛️' },
  { id: 'museum', name: 'Muzea', icon: '🎨' },
  { id: 'park', name: 'Parki', icon: '🌳' },
  { id: 'restaurant', name: 'Restauracje', icon: '🍽️' },
  { id: 'cafe', name: 'Kawiarnie', icon: '☕' },
  { id: 'hotel', name: 'Hotele', icon: '🏨' },
];

/**
 * Filtr kategorii POI jako lista chipów
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="category-filter" data-testid="category-filter">
      {CATEGORIES.map((cat) => (
        <IonChip
          key={cat.id ?? 'all'}
          color={selectedCategory === cat.id ? 'primary' : 'medium'}
          outline={selectedCategory !== cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className="category-chip"
          data-testid={`category-chip-${cat.id ?? 'all'}`}>
          <span className="category-icon">{cat.icon}</span>
          <IonLabel>{cat.name}</IonLabel>
        </IonChip>
      ))}
    </div>
  );
};

export default CategoryFilter;
