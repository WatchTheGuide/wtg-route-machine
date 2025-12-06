import { POI, POICategory } from '../types';
import { useCityStore } from '../stores/cityStore';

// API base URL - w produkcji będzie to adres serwera
const API_BASE_URL =
  import.meta.env.VITE_POI_API_URL || 'http://localhost:3000';

// Klucz API (opcjonalnie, gdy przez nginx)
const API_KEY = import.meta.env.VITE_POI_API_KEY || '';

interface POIApiResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  coordinate: [number, number];
  address?: string;
  imageUrl?: string;
}

interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CityResponse {
  id: string;
  name: string;
  center: [number, number];
}

/**
 * Mapuje odpowiedź API na typ POI
 */
const mapToPOI = (data: POIApiResponse): POI => ({
  id: data.id,
  name: data.name,
  description: data.description,
  category: data.category as POICategory,
  coordinate: data.coordinate,
  address: data.address,
  imageUrl: data.imageUrl,
});

/**
 * Tworzy nagłówki dla requestów API
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  return headers;
};

/**
 * Pobiera POI dla danego miasta
 * @param cityId - ID miasta (krakow, warszawa, wroclaw, trojmiasto)
 * @param category - opcjonalnie filtruj po kategorii
 */
export const fetchPOIs = async (
  cityId: string,
  category?: POICategory
): Promise<POI[]> => {
  const url = new URL(`${API_BASE_URL}/${cityId}`);
  if (category) {
    url.searchParams.set('category', category);
  }

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Błąd pobierania POI: ${response.status}`);
  }

  const data: POIApiResponse[] = await response.json();
  return data.map(mapToPOI);
};

/**
 * Pobiera pojedynczy POI
 * @param cityId - ID miasta
 * @param poiId - ID punktu POI
 */
export const fetchPOI = async (cityId: string, poiId: string): Promise<POI> => {
  const response = await fetch(`${API_BASE_URL}/${cityId}/${poiId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Błąd pobierania POI: ${response.status}`);
  }

  const data: POIApiResponse = await response.json();
  return mapToPOI(data);
};

/**
 * Pobiera listę kategorii
 */
export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Błąd pobierania kategorii: ${response.status}`);
  }

  return response.json();
};

/**
 * Pobiera listę dostępnych miast
 */
export const fetchCities = async (): Promise<CityResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/cities`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Błąd pobierania miast: ${response.status}`);
  }

  return response.json();
};

/**
 * Wyszukuje POI w mieście
 * @param cityId - ID miasta
 * @param query - fraza wyszukiwania
 */
export const searchPOIs = async (
  cityId: string,
  query: string
): Promise<POI[]> => {
  const response = await fetch(
    `${API_BASE_URL}/${cityId}/search?q=${encodeURIComponent(query)}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Błąd wyszukiwania POI: ${response.status}`);
  }

  const data: POIApiResponse[] = await response.json();
  return data.map(mapToPOI);
};

/**
 * Singleton service dla łatwiejszego importu
 */
export const poiService = {
  fetchPOIs,
  fetchPOI,
  fetchCategories,
  fetchCities,
  searchPOIs,

  /**
   * Pobiera POI dla aktualnie wybranego miasta
   */
  fetchCurrentCityPOIs: async (category?: POICategory): Promise<POI[]> => {
    const { currentCity } = useCityStore.getState();
    return fetchPOIs(currentCity.id, category);
  },
};

export default poiService;
