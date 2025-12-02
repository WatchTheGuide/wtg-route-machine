/**
 * WTG Route Machine - Geocoding Module
 * Handles reverse geocoding (coordinates to address) using Nominatim API
 */

/**
 * Reverse geocode coordinates to get address
 * Uses OpenStreetMap Nominatim API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Address information or null
 */
async function reverseGeocode(lat, lon) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'WTG-Route-Machine/1.0',
      },
    });

    if (!response.ok) {
      console.warn('Nominatim API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data || data.error) {
      console.warn('Reverse geocoding failed:', data?.error || 'Unknown error');
      return null;
    }

    // Extract address components
    const address = data.address || {};

    // Build readable address string with priority on detailed location
    let displayAddress = '';
    let hasStreetInfo = false;

    // Priority 1: Road/street with house number (most specific)
    if (address.road && address.house_number) {
      displayAddress = `${address.road} ${address.house_number}`;
      hasStreetInfo = true;
    }
    // Priority 2: Road/street without house number
    else if (address.road) {
      displayAddress = address.road;
      hasStreetInfo = true;
    }
    // Priority 3: Pedestrian paths/walkways
    else if (address.pedestrian) {
      displayAddress = address.pedestrian;
      hasStreetInfo = true;
    }
    // Priority 4: Footways
    else if (address.footway) {
      displayAddress = address.footway;
      hasStreetInfo = true;
    }
    // Priority 5: Named places (POI)
    else if (address.amenity || address.tourism || address.shop) {
      displayAddress = address.amenity || address.tourism || address.shop;
    }
    // Priority 6: Suburb/neighbourhood
    else if (address.suburb || address.neighbourhood) {
      displayAddress = address.suburb || address.neighbourhood;
    }
    // Priority 7: City/town
    else if (address.city || address.town || address.village) {
      displayAddress = address.city || address.town || address.village;
    }
    // Fallback
    else {
      displayAddress =
        data.display_name?.split(',')[0] || 'Nieznana lokalizacja';
    }

    // Add suburb/district context if we have street info but it's useful
    let contextInfo = '';
    if (hasStreetInfo && (address.suburb || address.neighbourhood)) {
      contextInfo = address.suburb || address.neighbourhood;
    }

    return {
      displayAddress: displayAddress,
      contextInfo: contextInfo,
      fullAddress: data.display_name,
      raw: data,
      address: address,
      coordinates: {
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
      },
    };
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return null;
  }
}

/**
 * Format coordinates as fallback when geocoding fails
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Formatted coordinates
 */
function formatCoordinates(lat, lon) {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

/**
 * Get display text for a location (address or coordinates)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} Display text
 */
async function getLocationDisplay(lat, lon) {
  const geocodeResult = await reverseGeocode(lat, lon);

  if (geocodeResult && geocodeResult.displayAddress) {
    return geocodeResult.displayAddress;
  }

  // Fallback to coordinates
  return formatCoordinates(lat, lon);
}

/**
 * Forward geocode - search for places by query
 * Uses OpenStreetMap Nominatim API
 * @param {string} query - Search query
 * @param {Object} options - Search options (boundingBox, limit)
 * @returns {Promise<Array>} Array of search results
 */
async function forwardGeocode(query, options = {}) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    format: 'json',
    q: query,
    addressdetails: '1',
    limit: options.limit || '5',
  });

  // Add bounding box if provided (for city-specific search)
  if (options.boundingBox) {
    params.append('bounded', '1');
    params.append('viewbox', options.boundingBox);
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'WTG-Route-Machine/1.0',
      },
    });

    if (!response.ok) {
      console.warn('Nominatim search API error:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    // Format results
    return data.map((result) => ({
      displayName: result.display_name,
      address: result.address,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      type: result.type,
      importance: result.importance,
      bbox: result.boundingbox,
    }));
  } catch (error) {
    console.error('Error during forward geocoding:', error);
    return [];
  }
}

// Export functions to global scope
window.wtgGeocoding = {
  reverseGeocode,
  formatCoordinates,
  getLocationDisplay,
  forwardGeocode,
};
