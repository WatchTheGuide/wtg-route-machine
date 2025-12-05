/**
 * WTG Routes - POI Service
 *
 * Communicates with POI backend server
 */

import { config } from '../config';
import type { POI, POICategory, City } from '../types';

interface POIResponse {
  city: string;
  count: number;
  pois: POI[];
}

interface SearchResponse {
  city: string;
  query: string;
  count: number;
  pois: POI[];
}

interface NearbyResponse {
  city: string;
  center: {
    lat: number;
    lon: number;
  };
  radius: number;
  count: number;
  pois: Array<POI & { distance: number }>;
}

class POIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.endpoints.poi;
  }

  async getPOIs(cityId: string, category?: string): Promise<POI[]> {
    const url = category
      ? `${this.baseUrl}/${cityId}?category=${category}`
      : `${this.baseUrl}/${cityId}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add API key header when implemented
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch POIs: ${response.statusText}`);
    }

    const data: POIResponse = await response.json();
    return data.pois;
  }

  async searchPOIs(
    cityId: string,
    query: string,
    limit?: number
  ): Promise<POI[]> {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${this.baseUrl}/${cityId}/search?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search POIs: ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    return data.pois;
  }

  async getNearbyPOIs(
    cityId: string,
    lat: number,
    lon: number,
    radius: number = 500
  ): Promise<Array<POI & { distance: number }>> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      radius: radius.toString(),
    });

    const response = await fetch(`${this.baseUrl}/${cityId}/near?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nearby POIs: ${response.statusText}`);
    }

    const data: NearbyResponse = await response.json();
    return data.pois;
  }

  async getCategories(): Promise<POICategory[]> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories;
  }

  async getCities(): Promise<City[]> {
    const response = await fetch(`${this.baseUrl}/cities`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cities.map((city: any) => ({
      id: city.id,
      name: city.name,
      center: [city.center.lon, city.center.lat] as [number, number],
      bounds: city.bounds,
    }));
  }
}

export const poiService = new POIService();
