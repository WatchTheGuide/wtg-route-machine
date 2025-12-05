/**
 * WTG Routes - Tours Hook
 */

import { useQuery } from '@tanstack/react-query';
import type { Tour } from '../types';

// Mock tours data - will be replaced with API
const mockTours: Record<string, Tour[]> = {
  krakow: [
    {
      id: 'krakow-royal-route',
      name: 'Trasa Królewska',
      description: 'Spacer śladami polskich królów przez Stare Miasto',
      cityId: 'krakow',
      waypoints: [],
      estimatedDuration: 90,
      distance: 3500,
      difficulty: 'easy',
      category: 'historical',
      imageUrl:
        'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400',
      rating: 4.8,
      reviewCount: 234,
    },
    {
      id: 'krakow-jewish-heritage',
      name: 'Dziedzictwo żydowskie',
      description: 'Odkryj historię Kazimierza i dzielnicy żydowskiej',
      cityId: 'krakow',
      waypoints: [],
      estimatedDuration: 120,
      distance: 4200,
      difficulty: 'easy',
      category: 'cultural',
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.7,
      reviewCount: 156,
    },
    {
      id: 'krakow-legends',
      name: 'Krakowskie legendy',
      description: 'Smok wawelski, Lajkonik i inne tajemnice miasta',
      cityId: 'krakow',
      waypoints: [],
      estimatedDuration: 60,
      distance: 2500,
      difficulty: 'easy',
      category: 'family',
      imageUrl:
        'https://images.unsplash.com/photo-1564509143564-1b2c9a2e8db4?w=400',
      rating: 4.9,
      reviewCount: 312,
    },
    {
      id: 'krakow-architecture',
      name: 'Perły architektury',
      description: 'Najpiękniejsze budynki od gotyku po secesję',
      cityId: 'krakow',
      waypoints: [],
      estimatedDuration: 150,
      distance: 5800,
      difficulty: 'medium',
      category: 'architecture',
      imageUrl:
        'https://images.unsplash.com/photo-1567878884789-eb4a4da76d20?w=400',
      rating: 4.6,
      reviewCount: 89,
    },
  ],
  warszawa: [
    {
      id: 'warszawa-old-town',
      name: 'Stare Miasto',
      description: 'Odbudowane z ruin - symbol powstania Warszawy',
      cityId: 'warszawa',
      waypoints: [],
      estimatedDuration: 90,
      distance: 3200,
      difficulty: 'easy',
      category: 'historical',
      imageUrl:
        'https://images.unsplash.com/photo-1607427293702-036933bbf746?w=400',
      rating: 4.7,
      reviewCount: 445,
    },
    {
      id: 'warszawa-royal-route',
      name: 'Trakt Królewski',
      description: 'Od Zamku Królewskiego do Wilanowa',
      cityId: 'warszawa',
      waypoints: [],
      estimatedDuration: 180,
      distance: 10000,
      difficulty: 'hard',
      category: 'historical',
      imageUrl:
        'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400',
      rating: 4.5,
      reviewCount: 178,
    },
  ],
  wroclaw: [
    {
      id: 'wroclaw-dwarfs',
      name: 'Szlak Krasnali',
      description: 'Znajdź wszystkie krasnale w centrum miasta',
      cityId: 'wroclaw',
      waypoints: [],
      estimatedDuration: 120,
      distance: 4500,
      difficulty: 'easy',
      category: 'family',
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.9,
      reviewCount: 567,
    },
    {
      id: 'wroclaw-islands',
      name: 'Wyspa Słodowa i okolice',
      description: 'Spacer po wyspach i mostach Wrocławia',
      cityId: 'wroclaw',
      waypoints: [],
      estimatedDuration: 75,
      distance: 3000,
      difficulty: 'easy',
      category: 'nature',
      imageUrl:
        'https://images.unsplash.com/photo-1564509143564-1b2c9a2e8db4?w=400',
      rating: 4.6,
      reviewCount: 234,
    },
  ],
  trojmiasto: [
    {
      id: 'gdansk-old-town',
      name: 'Stare Miasto Gdańsk',
      description: 'Złoty wiek Gdańska - Długi Targ i okolice',
      cityId: 'trojmiasto',
      waypoints: [],
      estimatedDuration: 90,
      distance: 3500,
      difficulty: 'easy',
      category: 'historical',
      imageUrl:
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
      rating: 4.8,
      reviewCount: 389,
    },
    {
      id: 'sopot-pier',
      name: 'Molo w Sopocie',
      description: 'Najdłuższe drewniane molo w Europie',
      cityId: 'trojmiasto',
      waypoints: [],
      estimatedDuration: 45,
      distance: 1500,
      difficulty: 'easy',
      category: 'nature',
      imageUrl:
        'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400',
      rating: 4.7,
      reviewCount: 678,
    },
  ],
};

export function useTours(cityId: string) {
  return useQuery({
    queryKey: ['tours', cityId],
    queryFn: async (): Promise<Tour[]> => {
      // TODO: Replace with API call to tours service
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTours[cityId] || [];
    },
    enabled: !!cityId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTour(tourId: string) {
  return useQuery({
    queryKey: ['tour', tourId],
    queryFn: async (): Promise<Tour | null> => {
      // TODO: Replace with API call
      for (const cityTours of Object.values(mockTours)) {
        const tour = cityTours.find((t) => t.id === tourId);
        if (tour) return tour;
      }
      return null;
    },
    enabled: !!tourId,
  });
}

export function useFeaturedTours() {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: async (): Promise<Tour[]> => {
      // Return top-rated tours from all cities
      const allTours = Object.values(mockTours).flat();
      return allTours
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    },
    staleTime: 5 * 60 * 1000,
  });
}
