/**
 * Geocoding Service (US 8.6.1)
 *
 * Provides forward and reverse geocoding using Nominatim OpenStreetMap API.
 * Features:
 * - Forward geocoding: address → coordinates
 * - Reverse geocoding: coordinates → address
 * - Rate limiting (1 request per second for Nominatim)
 * - Result caching
 * - Polish address formatting
 */

// ============================================
// Types
// ============================================

export interface GeocodingResult {
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  importance: number;
  boundingBox: [number, number, number, number]; // [minLat, maxLat, minLon, maxLon]
  address?: {
    road?: string;
    houseNumber?: string;
    city?: string;
    country?: string;
    tourism?: string;
  };
}

export interface ReverseGeocodingResult {
  displayName: string;
  street?: string;
  houseNumber?: string;
  city?: string;
  country?: string;
  poiName?: string;
  formattedAddress: string;
}

export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export interface SearchOptions {
  boundingBox?: BoundingBox;
  limit?: number;
}

export interface FormatAddressOptions {
  street?: string;
  houseNumber?: string;
  poiName?: string;
  displayName?: string;
}

// ============================================
// Nominatim API Response Types
// ============================================

interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  boundingbox: [string, string, string, string];
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    country?: string;
    tourism?: string;
  };
}

interface NominatimReverseResult {
  display_name: string;
  error?: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    country?: string;
    tourism?: string;
    historic?: string;
    amenity?: string;
  };
}

// ============================================
// Service Implementation
// ============================================

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'WTG-Route-Machine/1.0 (admin-panel)';
const RATE_LIMIT_MS = 1000; // 1 request per second

class GeocodingService {
  private cache: Map<string, unknown> = new Map();
  private lastRequestTime = 0;
  private requestQueue: Array<() => void> = [];
  private isProcessingQueue = false;

  /**
   * Reset internal state (for testing)
   */
  resetState(): void {
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Search for addresses matching a query
   */
  async searchAddress(
    query: string,
    options: SearchOptions = {}
  ): Promise<GeocodingResult[]> {
    const { boundingBox, limit = 10 } = options;

    // Build cache key
    const cacheKey = this.buildCacheKey('search', query, options);

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as GeocodingResult[];
    }

    // Build URL
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: limit.toString(),
    });

    if (boundingBox) {
      params.set(
        'viewbox',
        `${boundingBox.minLon},${boundingBox.minLat},${boundingBox.maxLon},${boundingBox.maxLat}`
      );
      params.set('bounded', '1');
    }

    const url = `${NOMINATIM_BASE_URL}/search?${params.toString()}`;

    // Make rate-limited request
    const response = await this.makeRateLimitedRequest(url);

    if (!response.ok) {
      throw new Error(
        `Geocoding API error: ${response.status} ${response.statusText}`
      );
    }

    const data: NominatimSearchResult[] = await response.json();

    // Transform results
    const results: GeocodingResult[] = data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type,
      importance: item.importance,
      boundingBox: item.boundingbox.map((v) => parseFloat(v)) as [
        number,
        number,
        number,
        number
      ],
      address: item.address
        ? {
            road: item.address.road,
            houseNumber: item.address.house_number,
            city: item.address.city,
            country: item.address.country,
            tourism: item.address.tourism,
          }
        : undefined,
    }));

    // Cache results
    this.cache.set(cacheKey, results);

    return results;
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  async getAddressFromCoordinates(
    lat: number,
    lon: number
  ): Promise<ReverseGeocodingResult | null> {
    // Build cache key
    const cacheKey = this.buildCacheKey('reverse', `${lat},${lon}`);

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ReverseGeocodingResult | null;
    }

    // Build URL
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const url = `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`;

    // Make rate-limited request
    const response = await this.makeRateLimitedRequest(url);

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding API error: ${response.status} ${response.statusText}`
      );
    }

    const data: NominatimReverseResult = await response.json();

    // Handle error response
    if (data.error || !data.address) {
      this.cache.set(cacheKey, null);
      return null;
    }

    // Extract POI name from various fields
    const poiName =
      data.address.tourism || data.address.historic || data.address.amenity;

    const result: ReverseGeocodingResult = {
      displayName: data.display_name,
      street: data.address.road,
      houseNumber: data.address.house_number,
      city: data.address.city,
      country: data.address.country,
      poiName,
      formattedAddress: this.formatPolishAddress({
        street: data.address.road,
        houseNumber: data.address.house_number,
        poiName,
        displayName: data.display_name,
      }),
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Format address in Polish style
   * - POI name takes precedence
   * - Streets formatted as "ul. {street} {number}"
   * - Falls back to display name
   */
  formatPolishAddress(options: FormatAddressOptions): string {
    const { street, houseNumber, poiName, displayName } = options;

    // POI name takes precedence
    if (poiName) {
      return poiName;
    }

    // Format street address
    if (street) {
      if (houseNumber) {
        return `ul. ${street} ${houseNumber}`;
      }
      return `ul. ${street}`;
    }

    // Fallback to display name
    return displayName || '';
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Build a cache key from parameters
   */
  private buildCacheKey(
    type: string,
    query: string,
    options?: SearchOptions
  ): string {
    const parts = [type, query];

    if (options?.boundingBox) {
      const { minLon, minLat, maxLon, maxLat } = options.boundingBox;
      parts.push(`bbox:${minLon},${minLat},${maxLon},${maxLat}`);
    }

    if (options?.limit) {
      parts.push(`limit:${options.limit}`);
    }

    return parts.join('|');
  }

  /**
   * Make a rate-limited request to respect Nominatim's usage policy
   */
  private async makeRateLimitedRequest(url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < RATE_LIMIT_MS) {
          // Need to wait
          const waitTime = RATE_LIMIT_MS - timeSinceLastRequest;
          await this.delay(waitTime);
        }

        this.lastRequestTime = Date.now();

        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': USER_AGENT,
              Accept: 'application/json',
            },
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }

        // Process next item in queue
        this.processQueue();
      };

      // Add to queue
      this.requestQueue.push(executeRequest);

      // Start processing if not already
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the request queue
   */
  private processQueue(): void {
    if (this.requestQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const nextRequest = this.requestQueue.shift();
    if (nextRequest) {
      nextRequest();
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
