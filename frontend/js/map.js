/**
 * WTG Route Machine - Map Initialization
 * US 1.1: Wyświetlanie Mapy
 */

// Kraków coordinates (Rynek Główny)
const KRAKOW_CENTER = [19.9385, 50.0647]; // [lon, lat]
const DEFAULT_ZOOM = 14;

/**
 * Initialize the map with OpenStreetMap tiles
 */
function initMap() {
  // Create map view centered on Kraków
  const view = new ol.View({
    center: ol.proj.fromLonLat(KRAKOW_CENTER),
    zoom: DEFAULT_ZOOM,
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
    controls: ol.control.defaults.defaults({
      zoom: true,
      rotate: false,
      attribution: true,
    }).extend([
      new ol.control.FullScreen(),
      new ol.control.ScaleLine({
        units: 'metric',
      }),
    ]),
  });

  // Store map instance globally for access from other modules
  window.wtgMap = map;

  console.log('Map initialized successfully');
  console.log('Center: Kraków', KRAKOW_CENTER);
  console.log('Zoom level:', DEFAULT_ZOOM);

  return map;
}

// Initialize map when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
