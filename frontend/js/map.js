/**
 * WTG Route Machine - Map Initialization
 * US 1.1: Wyświetlanie Mapy
 * US 1.2: Zmiana Miasta
 */

// City configurations with coordinates and OSRM ports
const CITIES = {
  krakow: {
    name: 'Kraków',
    center: [19.9385, 50.0647],
    zoom: 14,
    port: 5001,
  },
  warszawa: {
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    zoom: 13,
    port: 5002,
  },
  wroclaw: {
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    zoom: 13,
    port: 5003,
  },
  trojmiasto: {
    name: 'Trójmiasto',
    center: [18.6466, 54.352], // Gdańsk center
    zoom: 12,
    port: 5004,
  },
};

// Current city and OSRM port
let currentCity = 'krakow';
let currentOsrmPort = CITIES[currentCity].port;

/**
 * Initialize the map with OpenStreetMap tiles
 */
function initMap() {
  const cityConfig = CITIES[currentCity];

  // Create map view centered on current city
  const view = new ol.View({
    center: ol.proj.fromLonLat(cityConfig.center),
    zoom: cityConfig.zoom,
    minZoom: 10,
    maxZoom: 18,
  });

  // Create OSM tile layer
  const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });

  // Create map instance
  const map = new ol.Map({
    target: 'map',
    layers: [osmLayer],
    view: view,
    controls: ol.control.defaults
      .defaults({
        zoom: true,
        rotate: false,
        attribution: true,
      })
      .extend([
        new ol.control.FullScreen(),
        new ol.control.ScaleLine({
          units: 'metric',
        }),
      ]),
  });

  // Store map instance globally for access from other modules
  window.wtgMap = map;
  window.wtgCities = CITIES;
  window.wtgCurrentCity = currentCity;
  window.wtgCurrentOsrmPort = currentOsrmPort;

  console.log('Map initialized successfully');
  console.log('City:', cityConfig.name);
  console.log('Center:', cityConfig.center);
  console.log('OSRM Port:', currentOsrmPort);

  // Set up city selector event listener
  setupCitySelector();

  return map;
}

/**
 * Set up city selector dropdown event listener
 * US 1.2: Zmiana Miasta
 */
function setupCitySelector() {
  const citySelect = document.getElementById('city-select');
  if (!citySelect) {
    console.error('City selector not found');
    return;
  }

  citySelect.addEventListener('change', function (event) {
    const newCity = event.target.value;
    switchCity(newCity);
  });
}

/**
 * Switch to a different city
 * US 1.2: Zmiana Miasta
 * @param {string} cityKey - Key of the city to switch to (e.g., 'krakow', 'warszawa')
 */
function switchCity(cityKey) {
  if (!CITIES[cityKey]) {
    console.error('Unknown city:', cityKey);
    return;
  }

  const cityConfig = CITIES[cityKey];
  const map = window.wtgMap;

  if (!map) {
    console.error('Map not initialized');
    return;
  }

  console.log('Switching to city:', cityConfig.name);

  // Update current city and OSRM port
  currentCity = cityKey;
  currentOsrmPort = cityConfig.port;
  window.wtgCurrentCity = currentCity;
  window.wtgCurrentOsrmPort = currentOsrmPort;

  // Center map on new city with animation
  const view = map.getView();
  view.animate({
    center: ol.proj.fromLonLat(cityConfig.center),
    zoom: cityConfig.zoom,
    duration: 1000,
  });

  // Clear existing route and markers (will be implemented in later US)
  // TODO: Clear route when routing is implemented
  // TODO: Clear markers when markers are implemented

  console.log('Switched to:', cityConfig.name);
  console.log('New OSRM port:', currentOsrmPort);
}

// Initialize map when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
