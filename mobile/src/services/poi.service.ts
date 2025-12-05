/**
 * POI Service - API client for Points of Interest
 */

import { POI, POICategory } from '../types';
import { CITIES } from '../stores/cityStore';

const POI_SERVER_URL = 'http://localhost:3001';

// Sample POI data for demo (when backend is not available)
const SAMPLE_POIS: Record<string, POI[]> = {
  krakow: [
    {
      id: '1',
      name: 'Wawel',
      description: 'Zamek Królewski na Wawelu',
      category: 'landmark',
      coordinate: [19.9354, 50.054],
      address: 'Wawel 5, 31-001 Kraków',
    },
    {
      id: '2',
      name: 'Sukiennice',
      description: 'Historyczna hala targowa na Rynku Głównym',
      category: 'landmark',
      coordinate: [19.9373, 50.0619],
      address: 'Rynek Główny 1/3, 31-042 Kraków',
    },
    {
      id: '3',
      name: 'Kościół Mariacki',
      description: 'Gotycka bazylika z ołtarzem Wita Stwosza',
      category: 'landmark',
      coordinate: [19.939, 50.0617],
      address: 'Plac Mariacki 5, 31-042 Kraków',
    },
    {
      id: '4',
      name: 'Muzeum Narodowe',
      description: 'Główne muzeum sztuki w Krakowie',
      category: 'museum',
      coordinate: [19.9234, 50.0601],
      address: 'Al. 3 Maja 1, 30-062 Kraków',
    },
    {
      id: '5',
      name: 'Planty',
      description: 'Park otaczający Stare Miasto',
      category: 'park',
      coordinate: [19.938, 50.065],
      address: 'Planty, Kraków',
    },
    {
      id: '6',
      name: 'Kazimierz',
      description: 'Historyczna dzielnica żydowska',
      category: 'landmark',
      coordinate: [19.946, 50.051],
      address: 'Kazimierz, Kraków',
    },
  ],
  warszawa: [
    {
      id: '7',
      name: 'Pałac Kultury i Nauki',
      description: 'Najwyższy budynek w Polsce',
      category: 'landmark',
      coordinate: [21.0067, 52.2319],
      address: 'Plac Defilad 1, 00-901 Warszawa',
    },
    {
      id: '8',
      name: 'Stare Miasto',
      description: 'Odbudowane po wojnie historyczne centrum',
      category: 'landmark',
      coordinate: [21.0122, 52.2497],
      address: 'Rynek Starego Miasta, Warszawa',
    },
    {
      id: '9',
      name: 'Łazienki Królewskie',
      description: 'Największy park w Warszawie',
      category: 'park',
      coordinate: [21.0352, 52.2151],
      address: 'Agrykola 1, 00-460 Warszawa',
    },
  ],
  wroclaw: [
    {
      id: '10',
      name: 'Rynek',
      description: 'Jeden z największych rynków w Europie',
      category: 'landmark',
      coordinate: [17.0326, 51.11],
      address: 'Rynek, 50-106 Wrocław',
    },
    {
      id: '11',
      name: 'Ostrów Tumski',
      description: 'Najstarsza część Wrocławia',
      category: 'landmark',
      coordinate: [17.0467, 51.1142],
      address: 'Ostrów Tumski, Wrocław',
    },
  ],
  trojmiasto: [
    {
      id: '12',
      name: 'Długi Targ',
      description: 'Główna ulica Gdańska',
      category: 'landmark',
      coordinate: [18.6533, 54.3484],
      address: 'Długi Targ, 80-831 Gdańsk',
    },
    {
      id: '13',
      name: 'Molo w Sopocie',
      description: 'Najdłuższe drewniane molo w Europie',
      category: 'landmark',
      coordinate: [18.5742, 54.4462],
      address: 'Plac Zdrojowy, 81-720 Sopot',
    },
  ],
};

class POIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = POI_SERVER_URL;
  }

  async getPOIs(cityId: string): Promise<POI[]> {
    try {
      // Try to fetch from backend
      const response = await fetch(`${this.baseUrl}/api/pois?city=${cityId}`);
      if (response.ok) {
        const data = await response.json();
        return data.pois || data;
      }
    } catch (error) {
      console.log('POI backend not available, using sample data');
    }

    // Fallback to sample data
    return SAMPLE_POIS[cityId] || [];
  }

  async getPOIById(id: string): Promise<POI | null> {
    // Search in all cities
    for (const cityPois of Object.values(SAMPLE_POIS)) {
      const poi = cityPois.find((p) => p.id === id);
      if (poi) return poi;
    }
    return null;
  }

  async searchPOIs(cityId: string, query: string): Promise<POI[]> {
    const pois = await this.getPOIs(cityId);
    const lowerQuery = query.toLowerCase();
    return pois.filter(
      (poi) =>
        poi.name.toLowerCase().includes(lowerQuery) ||
        poi.description?.toLowerCase().includes(lowerQuery)
    );
  }

  async getPOIsByCategory(
    cityId: string,
    category: POICategory
  ): Promise<POI[]> {
    const pois = await this.getPOIs(cityId);
    return pois.filter((poi) => poi.category === category);
  }
}

export const poiService = new POIService();
