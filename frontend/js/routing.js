/**
 * WTG Route Machine - Routing Module
 * Handles communication with OSRM API and route visualization
 */

/**
 * Calculate and display route using OSRM API
 * @param {Array} waypoints - Array of [lon, lat] coordinate pairs
 * @param {number} port - OSRM server port
 * @returns {Promise} Route data from OSRM
 */
async function calculateRoute(waypoints, port) {
  if (!waypoints || waypoints.length < 2) {
    console.error('At least 2 waypoints required for routing');
    return null;
  }

  // Build OSRM API URL
  const coordinates = waypoints.map((wp) => `${wp[0]},${wp[1]}`).join(';');
  const osrmUrl = `http://localhost:${port}/route/v1/foot/${coordinates}?overview=full&steps=true`;

  console.log('Calculating route:', osrmUrl);

  try {
    const response = await fetch(osrmUrl);
    if (!response.ok) {
      const errorMsg = `Nie można połączyć się z serwerem OSRM (port ${port}). Sprawdź czy serwer działa.`;
      if (window.wtgUI && window.wtgUI.showError) {
        window.wtgUI.showError(errorMsg);
      }
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok') {
      let errorMsg = 'Nie można wyznaczyć trasy.';

      if (data.code === 'NoRoute') {
        errorMsg =
          'Nie znaleziono trasy między wybranymi punktami. Upewnij się, że punkty znajdują się na drogach pieszych.';
      } else if (data.code === 'NoSegment') {
        errorMsg =
          'Jeden lub więcej punktów jest zbyt daleko od najbliższej drogi.';
      } else {
        errorMsg = `Błąd wyznaczania trasy: ${data.code}. ${
          data.message || ''
        }`;
      }

      if (window.wtgUI && window.wtgUI.showError) {
        window.wtgUI.showError(errorMsg);
      }
      throw new Error(`OSRM routing failed: ${data.code}`);
    }

    console.log('Route calculated successfully');
    console.log('Distance:', (data.routes[0].distance / 1000).toFixed(2), 'km');
    console.log('Duration:', (data.routes[0].duration / 60).toFixed(0), 'min');

    // Store route data globally for PDF export
    window.wtgCurrentRouteData = data;

    // Update route info panel
    updateRouteInfo(data.routes[0].distance, data.routes[0].duration);

    return data;
  } catch (error) {
    console.error('Error calculating route:', error);

    // Show error if not already shown
    if (
      window.wtgUI &&
      window.wtgUI.showError &&
      error.message.includes('fetch')
    ) {
      window.wtgUI.showError(
        'Nie można połączyć się z serwerem OSRM. Sprawdź połączenie sieciowe i czy serwer działa.'
      );
    }

    return null;
  }
}

/**
 * Display route on map
 * @param {Object} routeData - Route data from OSRM
 * @param {ol.Map} map - OpenLayers map instance
 */
function displayRoute(routeData, map) {
  if (!routeData || !routeData.routes || !routeData.routes[0]) {
    console.error('Invalid route data');
    return;
  }

  const route = routeData.routes[0];
  const geometry = route.geometry;

  // Decode polyline from OSRM (encoded as polyline6)
  const coordinates = decodePolyline(geometry);

  // Create route line feature
  const routeLine = new ol.geom.LineString(coordinates);
  routeLine.transform('EPSG:4326', 'EPSG:3857');

  const routeFeature = new ol.Feature({
    geometry: routeLine,
    type: 'route',
  });

  // Style for route line
  const routeStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#ff6600', // Primary orange
      width: 5,
      lineCap: 'round',
      lineJoin: 'round',
    }),
  });

  routeFeature.setStyle(routeStyle);

  // Get or create route layer
  let routeLayer = window.wtgRouteLayer;
  if (!routeLayer) {
    const routeSource = new ol.source.Vector();
    routeLayer = new ol.layer.Vector({
      source: routeSource,
      zIndex: 10,
    });
    map.addLayer(routeLayer);
    window.wtgRouteLayer = routeLayer;
  }

  // Clear previous route and add new one
  routeLayer.getSource().clear();
  routeLayer.getSource().addFeature(routeFeature);

  // Show route info panel
  showRouteInfoPanel();

  // Display navigation instructions
  displayNavigationInstructions(routeData);

  console.log('Route displayed on map');
}

/**
 * Clear route from map
 */
function clearRoute() {
  if (window.wtgRouteLayer) {
    window.wtgRouteLayer.getSource().clear();
    console.log('Route cleared');
  }

  // Hide and clear route info panel
  hideRouteInfoPanel();
  clearRouteInfo();

  // Clear navigation instructions
  clearNavigationInstructions();

  console.log('Route cleared from map');
}

/**
 * Decode polyline encoded geometry from OSRM
 * @param {string} encoded - Encoded polyline string
 * @param {number} precision - Precision (default 5 for polyline, 6 for polyline6)
 * @returns {Array} Array of [lon, lat] coordinates
 */
function decodePolyline(encoded, precision = 5) {
  const factor = Math.pow(10, precision);
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lon = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLon = result & 1 ? ~(result >> 1) : result >> 1;
    lon += deltaLon;

    coordinates.push([lon / factor, lat / factor]);
  }

  return coordinates;
}

/**
 * Update route info panel with distance and duration
 * @param {number} distance - Distance in meters
 * @param {number} duration - Duration in seconds
 */
function updateRouteInfo(distance, duration) {
  const distanceKm = (distance / 1000).toFixed(2);
  const durationMin = Math.round(duration / 60);

  const distanceEl = document.getElementById('route-distance');
  const durationEl = document.getElementById('route-duration');

  if (distanceEl) {
    distanceEl.textContent = `${distanceKm} km`;
  }

  if (durationEl) {
    if (durationMin < 60) {
      durationEl.textContent = `${durationMin} min`;
    } else {
      const hours = Math.floor(durationMin / 60);
      const minutes = durationMin % 60;
      durationEl.textContent = `${hours} godz ${minutes} min`;
    }
  }
}

/**
 * Clear route info panel
 */
function clearRouteInfo() {
  const distanceEl = document.getElementById('route-distance');
  const durationEl = document.getElementById('route-duration');

  if (distanceEl) distanceEl.textContent = '-';
  if (durationEl) durationEl.textContent = '-';
}

/**
 * Show route info panel (open sidebar)
 */
function showRouteInfoPanel() {
  const sidebar = document.getElementById('route-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');

  if (sidebar) {
    sidebar.classList.remove('hidden');
    sidebar.classList.remove('translate-x-full');
  }

  if (toggleBtn) {
    toggleBtn.classList.remove('hidden');
  }
}

/**
 * Hide route info panel (close sidebar)
 */
function hideRouteInfoPanel() {
  const sidebar = document.getElementById('route-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');

  if (sidebar) {
    sidebar.classList.add('hidden');
    sidebar.classList.add('translate-x-full');
  }

  if (toggleBtn) {
    toggleBtn.classList.add('hidden');
  }
}

/**
 * Display navigation instructions from OSRM route data
 * @param {Object} routeData - Route data from OSRM with steps
 */
function displayNavigationInstructions(routeData) {
  if (!routeData || !routeData.routes || !routeData.routes[0]) {
    console.error('Invalid route data for navigation instructions');
    return;
  }

  const route = routeData.routes[0];
  const legs = route.legs;

  if (!legs || legs.length === 0) {
    console.error('No legs found in route data');
    return;
  }

  const listContainer = document.getElementById('nav-instructions-list');
  if (!listContainer) {
    console.error('Navigation instructions list container not found');
    return;
  }

  // Clear existing instructions
  listContainer.innerHTML = '';

  let stepNumber = 1;

  // Process each leg (segment between waypoints)
  legs.forEach((leg, legIndex) => {
    if (!leg.steps || leg.steps.length === 0) return;

    leg.steps.forEach((step, stepIndex) => {
      // Skip the last step of each leg (arrival step)
      if (stepIndex === leg.steps.length - 1) return;

      const instruction = formatInstruction(step);
      const distance = formatDistance(step.distance);
      const icon = getManeuverIcon(step.maneuver);

      // Create instruction element
      const stepDiv = document.createElement('div');
      stepDiv.className =
        'flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200';

      stepDiv.innerHTML = `
        <div class="flex-shrink-0 w-10 h-10 bg-[#ff6600] text-white rounded-full flex items-center justify-center shadow-md">
          <i data-lucide="${icon}" class="w-5 h-5"></i>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">${instruction}</p>
          <p class="text-sm text-gray-600 mt-1">${distance}</p>
        </div>
      `;

      listContainer.appendChild(stepDiv);
      stepNumber++;
    });
  });

  // Add final arrival instruction
  const arrivalDiv = document.createElement('div');
  arrivalDiv.className =
    'flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200';
  arrivalDiv.innerHTML = `
    <div class="flex-shrink-0 w-10 h-10 bg-[#454545] text-white rounded-full flex items-center justify-center shadow-md">
      <i data-lucide="flag" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <p class="text-gray-900 font-medium">Dotarłeś do celu</p>
    </div>
  `;
  listContainer.appendChild(arrivalDiv);

  // Re-initialize Lucide icons for new elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('Navigation instructions displayed');
}

/**
 * Get Lucide icon name for maneuver type
 * @param {Object} maneuver - OSRM maneuver object
 * @returns {string} Lucide icon name
 */
function getManeuverIcon(maneuver) {
  const type = maneuver.type;
  const modifier = maneuver.modifier;

  // Map maneuver types and modifiers to Lucide icons
  if (type === 'depart') return 'circle-arrow-out-up-right';
  if (type === 'arrive') return 'circle-check';

  if (type === 'roundabout' || type === 'rotary') {
    return 'corner-right-up';
  }

  if (type === 'turn') {
    if (modifier === 'left') return 'corner-up-left';
    if (modifier === 'right') return 'corner-up-right';
    if (modifier === 'sharp left') return 'move-up-left';
    if (modifier === 'sharp right') return 'move-up-right';
    if (modifier === 'slight left') return 'arrow-big-up-dash';
    if (modifier === 'slight right') return 'arrow-big-up-dash';
    if (modifier === 'uturn') return 'arrow-big-down';
  }

  if (type === 'end of road') {
    if (modifier === 'left') return 'corner-up-left';
    if (modifier === 'right') return 'corner-up-right';
    return 'arrow-big-up';
  }

  if (type === 'fork') {
    if (modifier === 'left') return 'arrow-up-from-line';
    if (modifier === 'right') return 'arrow-up-from-line';
    return 'split';
  }

  if (type === 'merge') {
    return 'arrow-down-to-line';
  }

  if (type === 'on ramp') {
    return 'arrow-up-right-from-circle';
  }

  if (type === 'off ramp') {
    return 'arrow-down-right-from-circle';
  }

  if (type === 'new name' || type === 'continue') {
    if (modifier === 'straight') return 'arrow-big-up';
    if (modifier === 'slight left') return 'arrow-big-up-dash';
    if (modifier === 'slight right') return 'arrow-big-up-dash';
    return 'arrow-big-up';
  }

  // Default icon
  return 'circle-arrow-up';
}

/**
 * Format OSRM step instruction to readable Polish text
 * @param {Object} step - OSRM step object
 * @returns {string} Formatted instruction
 */
function formatInstruction(step) {
  const maneuver = step.maneuver;
  const type = maneuver.type;
  const modifier = maneuver.modifier;
  const streetName = step.name || '';

  // Maneuver type translations
  const maneuverMap = {
    depart: 'Rozpocznij',
    turn: 'Skręć',
    'new name': 'Kontynuuj',
    continue: 'Jedź dalej',
    arrive: 'Dotarłeś do celu',
    roundabout: 'Na rondzie',
    rotary: 'Na rondzie',
    'end of road': 'Na końcu drogi',
    fork: 'Na rozwidleniu',
    merge: 'Włącz się',
    'on ramp': 'Wjazd na',
    'off ramp': 'Zjazd z',
    notification: 'Uwaga',
  };

  // Modifier translations
  const modifierMap = {
    left: 'w lewo',
    right: 'w prawo',
    'sharp left': 'ostro w lewo',
    'sharp right': 'ostro w prawo',
    'slight left': 'lekko w lewo',
    'slight right': 'lekko w prawo',
    straight: 'prosto',
    uturn: 'w tył',
  };

  let instruction = maneuverMap[type] || type;

  if (modifier && modifierMap[modifier]) {
    instruction += ' ' + modifierMap[modifier];
  }

  if (streetName && streetName !== '-') {
    instruction += ` w ${streetName}`;
  }

  return instruction;
}

/**
 * Format distance to readable text
 * @param {number} distance - Distance in meters
 * @returns {string} Formatted distance
 */
function formatDistance(distance) {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(2)} km`;
  }
  return `${Math.round(distance)} m`;
}

/**
 * Clear navigation instructions
 */
function clearNavigationInstructions() {
  const listContainer = document.getElementById('nav-instructions-list');
  if (listContainer) {
    listContainer.innerHTML = '';
  }
}

/**
 * Export current route to GeoJSON format
 * @returns {Object|null} GeoJSON FeatureCollection or null if no route
 */
function exportRouteToGeoJSON() {
  const routeLayer = window.wtgRouteLayer;

  if (!routeLayer) {
    console.error('No route layer found');
    return null;
  }

  const features = routeLayer.getSource().getFeatures();

  if (features.length === 0) {
    console.error('No route to export');
    return null;
  }

  // Get route feature
  const routeFeature = features[0];
  const geometry = routeFeature.getGeometry();

  if (!geometry) {
    console.error('No geometry found in route feature');
    return null;
  }

  // Clone and transform geometry back to EPSG:4326 (WGS84)
  const clonedGeometry = geometry.clone();
  clonedGeometry.transform('EPSG:3857', 'EPSG:4326');

  // Get coordinates
  const coordinates = clonedGeometry.getCoordinates();

  // Build GeoJSON
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'WTG Route',
          description: 'Walking tour route generated by WTG Route Machine',
          timestamp: new Date().toISOString(),
          city: window.wtgCurrentCity || 'unknown',
          profile: window.wtgCurrentProfile || 'foot',
          profileName:
            window.wtgRoutingProfiles && window.wtgCurrentProfile
              ? window.wtgRoutingProfiles[window.wtgCurrentProfile].name
              : 'Pieszo',
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    ],
  };

  return geojson;
}

/**
 * Download route as GeoJSON file
 */
function downloadRouteAsGeoJSON() {
  const geojson = exportRouteToGeoJSON();

  if (!geojson) {
    alert('Brak trasy do eksportu. Wyznacz trasę przed eksportem.');
    return;
  }

  // Convert to JSON string
  const jsonString = JSON.stringify(geojson, null, 2);

  // Create blob
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  link.download = `wtg-route-${timestamp}.geojson`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log('GeoJSON file downloaded');
}

/**
 * Export navigation instructions to PDF using pdfMake (full UTF-8 support)
 */
function exportInstructionsToPDF() {
  // Check if pdfMake is loaded
  if (typeof pdfMake === 'undefined') {
    alert('Biblioteka PDF nie jest załadowana. Odśwież stronę.');
    return;
  }

  // Get current route data
  const routeLayer = window.wtgRouteLayer;
  if (!routeLayer || routeLayer.getSource().getFeatures().length === 0) {
    alert('Brak trasy do eksportu. Wyznacz trasę przed eksportem.');
    return;
  }

  // Get route info
  const distanceEl = document.getElementById('route-distance');
  const durationEl = document.getElementById('route-duration');
  const distance = distanceEl ? distanceEl.textContent : '-';
  const duration = durationEl ? durationEl.textContent : '-';

  // Get instructions from stored route data
  if (
    !window.wtgCurrentRouteData ||
    !window.wtgCurrentRouteData.routes ||
    !window.wtgCurrentRouteData.routes[0]
  ) {
    alert('Brak danych trasy. Wygeneruj trasę ponownie.');
    return;
  }

  const route = window.wtgCurrentRouteData.routes[0];
  const legs = route.legs;

  // Build instructions content
  const instructionsContent = [];
  let stepNumber = 1;

  legs.forEach((leg) => {
    leg.steps.forEach((step) => {
      const instruction = formatInstruction(step);
      const stepDistance = formatDistance(step.distance);

      instructionsContent.push({
        columns: [
          {
            width: 20,
            text: `${stepNumber}.`,
            bold: true,
            color: '#ff6600',
            fontSize: 10,
          },
          {
            width: '*',
            text: instruction,
            fontSize: 10,
            margin: [0, 0, 10, 0],
          },
          {
            width: 40,
            text: stepDistance,
            fontSize: 9,
            color: '#666666',
            alignment: 'right',
          },
        ],
        margin: [0, 3, 0, 3],
      });

      stepNumber++;
    });
  });

  // Add final arrival
  instructionsContent.push({
    columns: [
      {
        width: 20,
        text: `${stepNumber}.`,
        bold: true,
        color: '#454545',
        fontSize: 10,
      },
      {
        width: '*',
        text: 'Dotarłeś do celu',
        fontSize: 10,
        bold: true,
      },
      {
        width: 40,
        text: '',
      },
    ],
    margin: [0, 8, 0, 3],
  });

  // PDF document definition
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    info: {
      title: 'WTG Route Machine - Instrukcje nawigacji',
      author: 'WTG Route Machine',
      subject: 'Instrukcje nawigacji',
    },
    header: function (currentPage, pageCount) {
      return {
        text: `Strona ${currentPage} z ${pageCount}`,
        alignment: 'right',
        fontSize: 8,
        color: '#999999',
        margin: [40, 20, 40, 0],
      };
    },
    footer: function (currentPage, pageCount) {
      return {
        text: `WTG Route Machine | ${new Date().toLocaleDateString('pl-PL')}`,
        alignment: 'center',
        fontSize: 8,
        color: '#999999',
        margin: [0, 0, 0, 20],
      };
    },
    content: [
      {
        text: 'WTG Route Machine',
        fontSize: 24,
        bold: true,
        color: '#ff6600',
        margin: [0, 0, 0, 5],
      },
      {
        text: 'Instrukcje nawigacji',
        fontSize: 16,
        color: '#454545',
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          { text: 'Profil: ', fontSize: 11, color: '#666666' },
          {
            text:
              window.wtgRoutingProfiles && window.wtgCurrentProfile
                ? window.wtgRoutingProfiles[window.wtgCurrentProfile].name
                : 'Pieszo',
            fontSize: 11,
            color: '#ff6600',
            bold: true,
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: '#ff6600',
          },
        ],
        margin: [0, 0, 0, 15],
      },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Dystans: ', bold: true },
              { text: distance, color: '#454545' },
            ],
            fontSize: 11,
          },
          {
            width: '*',
            text: [
              { text: 'Czas: ', bold: true },
              { text: duration, color: '#454545' },
            ],
            fontSize: 11,
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        text: 'Kroki nawigacji',
        fontSize: 12,
        bold: true,
        color: '#454545',
        margin: [0, 0, 0, 10],
      },
      ...instructionsContent,
    ],
    defaultStyle: {
      font: 'Roboto',
    },
  };

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `wtg-instrukcje-${timestamp}.pdf`;

  // Create and download PDF
  pdfMake.createPdf(docDefinition).download(filename);

  console.log('PDF file downloaded:', filename);
}

// Export functions to global scope
window.wtgRouting = {
  calculateRoute,
  displayRoute,
  clearRoute,
  updateRouteInfo,
  clearRouteInfo,
  showRouteInfoPanel,
  hideRouteInfoPanel,
  displayNavigationInstructions,
  clearNavigationInstructions,
  exportRouteToGeoJSON,
  downloadRouteAsGeoJSON,
  exportInstructionsToPDF,
};
