/**
 * WTG Route Machine - UI Module
 * Handles markers, user interactions, and UI updates
 */

// Maximum number of waypoints
const MAX_WAYPOINTS = 10;

// Waypoints array (coordinates as [lon, lat])
let waypoints = [];

// Marker features array
let markerFeatures = [];

// Drag interaction
let dragInteraction = null;

// Flag to prevent click event after drag
let isDragging = false;

/**
 * Initialize UI and event handlers
 * @param {ol.Map} map - OpenLayers map instance
 */
function initUI(map) {
  if (!map) {
    console.error('Map not provided to initUI');
    return;
  }

  // Create marker layer
  const markerSource = new ol.source.Vector();
  const markerLayer = new ol.layer.Vector({
    source: markerSource,
    zIndex: 20, // Above route layer
  });
  map.addLayer(markerLayer);
  window.wtgMarkerLayer = markerLayer;

  // Add click handler for adding markers
  map.on('click', handleMapClick);

  // Add right-click handler for removing markers
  map.getViewport().addEventListener('contextmenu', (event) => {
    event.preventDefault();
    handleRightClick(event, map);
  });

  // Setup drag interaction for markers
  setupDragInteraction(map);

  // Setup search bar
  setupSearchBar();

  // Setup sidebar controls
  setupSidebar();

  // Setup Clear All button
  setupClearAllButton();

  // Setup Export GeoJSON button
  setupExportGeoJSONButton();

  // Setup Export PDF button
  setupExportPDFButton();

  // Setup error notification
  setupErrorNotification();

  console.log('UI initialized');
}

/**
 * Handle map click event
 * @param {ol.MapBrowserEvent} event - Click event
 */
async function handleMapClick(event) {
  // Don't add marker if we just finished dragging
  if (isDragging) {
    isDragging = false;
    return;
  }

  const coordinate = event.coordinate;
  const lonLat = ol.proj.toLonLat(coordinate);

  // Check max waypoints
  if (waypoints.length >= MAX_WAYPOINTS) {
    alert(`Maksymalnie ${MAX_WAYPOINTS} punktów!`);
    return;
  }

  // Add waypoint
  addWaypoint(lonLat, coordinate);

  // Calculate route if we have at least 2 waypoints
  if (waypoints.length >= 2) {
    const routeData = await window.wtgRouting.calculateRoute(
      waypoints,
      window.wtgCurrentOsrmPort
    );

    if (routeData) {
      window.wtgRouting.displayRoute(routeData, window.wtgMap);
      updateExportButtonState();
    }
  }
}

/**
 * Add a waypoint and marker
 * @param {Array} lonLat - Coordinate as [lon, lat]
 * @param {Array} coordinate - Coordinate in map projection
 */
async function addWaypoint(lonLat, coordinate) {
  const waypointNumber = waypoints.length + 1;

  // Add to waypoints array
  waypoints.push(lonLat);

  // Create marker feature
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coordinate),
    waypointIndex: waypoints.length - 1,
    waypointNumber: waypointNumber,
    lonLat: lonLat, // Store original coordinates
  });

  // Fetch address for this waypoint
  if (window.wtgGeocoding && window.wtgGeocoding.reverseGeocode) {
    try {
      const addressInfo = await window.wtgGeocoding.reverseGeocode(
        lonLat[1],
        lonLat[0]
      );
      if (addressInfo) {
        marker.set('address', addressInfo.displayAddress);
        marker.set('fullAddress', addressInfo.fullAddress);
        console.log(
          `Address for waypoint ${waypointNumber}:`,
          addressInfo.displayAddress
        );
      } else {
        marker.set(
          'address',
          window.wtgGeocoding.formatCoordinates(lonLat[1], lonLat[0])
        );
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      marker.set(
        'address',
        window.wtgGeocoding.formatCoordinates(lonLat[1], lonLat[0])
      );
    }
  }

  // Style marker with number
  marker.setStyle(createMarkerStyle(waypointNumber));

  // Add to layer
  window.wtgMarkerLayer.getSource().addFeature(marker);
  markerFeatures.push(marker);

  // Show address tooltip/popup
  updateMarkerTooltip(marker, coordinate);

  // Update waypoints list
  updateWaypointsList();

  console.log(`Waypoint ${waypointNumber} added at:`, lonLat);
}

/**
 * Add GPS position as first waypoint
 * US 8.1: Automatyczny Punkt Startowy GPS
 * @param {number} lon - Longitude
 * @param {number} lat - Latitude
 */
async function addWaypointFromGPS(lon, lat) {
  const lonLat = [lon, lat];
  const coordinate = ol.proj.fromLonLat(lonLat);

  console.log('Adding GPS waypoint:', lonLat);

  // Add to waypoints array
  waypoints.push(lonLat);

  // Create marker feature with GPS indicator
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coordinate),
    waypointIndex: 0, // First waypoint
    waypointNumber: 1,
    lonLat: lonLat,
    isGPS: true, // Mark as GPS waypoint
  });

  // Fetch address for GPS position
  // US 8.1: Reverse geocode GPS coordinates
  if (window.wtgGeocoding && window.wtgGeocoding.reverseGeocode) {
    try {
      const addressInfo = await window.wtgGeocoding.reverseGeocode(lat, lon);
      if (addressInfo) {
        marker.set('address', addressInfo.displayAddress);
        marker.set('fullAddress', addressInfo.fullAddress);
        console.log('GPS address:', addressInfo.displayAddress);
      } else {
        marker.set(
          'address',
          `Twoja lokalizacja\n${window.wtgGeocoding.formatCoordinates(
            lat,
            lon
          )}`
        );
      }
    } catch (error) {
      console.error('Error fetching GPS address:', error);
      marker.set(
        'address',
        `Twoja lokalizacja\n${window.wtgGeocoding.formatCoordinates(lat, lon)}`
      );
    }
  } else {
    marker.set('address', 'Twoja lokalizacja (GPS)');
  }

  // Style marker with number
  marker.setStyle(createMarkerStyle(1));

  // Add to layer
  window.wtgMarkerLayer.getSource().addFeature(marker);
  markerFeatures.push(marker);

  // Show address tooltip/popup
  updateMarkerTooltip(marker, coordinate);

  // Update waypoints list
  updateWaypointsList();

  console.log('GPS waypoint added successfully');
}

/**
 * Handle right-click event for marker removal
 * @param {MouseEvent} event - Right-click event
 * @param {ol.Map} map - OpenLayers map instance
 */
function handleRightClick(event, map) {
  const pixel = map.getEventPixel(event);

  // Check if clicked on a marker
  const feature = map.forEachFeatureAtPixel(pixel, (feature, layer) => {
    if (layer === window.wtgMarkerLayer) {
      return feature;
    }
    return null;
  });

  if (feature) {
    removeWaypoint(feature);
  }
}

/**
 * Remove a waypoint and its marker
 * @param {ol.Feature} feature - Marker feature to remove
 */
async function removeWaypoint(feature) {
  const waypointNumber = feature.get('waypointNumber');
  const waypointIndex = feature.get('waypointIndex');

  console.log('\n=== REMOVING WAYPOINT ===');
  console.log(
    `Removing waypoint number: ${waypointNumber}, index: ${waypointIndex}`
  );
  console.log('markerFeatures before removal:', markerFeatures.length);

  // Find and remove from markerFeatures array
  const index = markerFeatures.indexOf(feature);
  console.log('Feature found at array index:', index);

  if (index > -1) {
    markerFeatures.splice(index, 1);
    console.log('markerFeatures after removal:', markerFeatures.length);
  }

  // Remove from layer
  window.wtgMarkerLayer.getSource().removeFeature(feature);

  // Remove overlay for this marker
  if (window.wtgMap) {
    const overlayId = `tooltip-${waypointNumber}`;
    const overlay = window.wtgMap.getOverlayById(overlayId);
    if (overlay) {
      window.wtgMap.removeOverlay(overlay);
    }
  }

  // Completely rebuild everything from markerFeatures array
  rebuildAllFromMarkerFeatures();

  // Update waypoints list
  updateWaypointsList();

  // Recalculate route if we still have at least 2 waypoints
  if (waypoints.length >= 2) {
    console.log('Calculating route with waypoints:', waypoints);
    const routeData = await window.wtgRouting.calculateRoute(
      waypoints,
      window.wtgCurrentOsrmPort
    );

    if (routeData) {
      window.wtgRouting.displayRoute(routeData, window.wtgMap);
      updateExportButtonState();
    }
  } else {
    // Clear route if less than 2 waypoints
    window.wtgRouting.clearRoute();
    updateExportButtonState();
  }

  console.log(`Waypoint removed. Remaining: ${waypoints.length}`);
}

/**
 * Rebuild all markers and waypoints from markerFeatures array
 * This is the single source of truth for marker order
 */
function rebuildAllFromMarkerFeatures() {
  // Clear waypoints array
  waypoints = [];

  // Clear all old overlays before rebuilding
  if (window.wtgMap) {
    const overlays = window.wtgMap.getOverlays().getArray().slice();
    overlays.forEach((overlay) => {
      if (overlay.getId() && overlay.getId().startsWith('tooltip-')) {
        window.wtgMap.removeOverlay(overlay);
      }
    });
  }

  // Iterate through markerFeatures in order (this preserves insertion order)
  markerFeatures.forEach((feature, index) => {
    const newNumber = index + 1;

    // Get the stored lonLat coordinates
    const lonLat = feature.get('lonLat');

    // Update feature properties
    feature.set('waypointIndex', index);
    feature.set('waypointNumber', newNumber);

    // Update style with new number
    feature.setStyle(createMarkerStyle(newNumber));

    // Update overlay for this marker with new number
    const coordinate = feature.getGeometry().getCoordinates();
    updateMarkerTooltip(feature, coordinate);

    // Add to waypoints array
    waypoints.push(lonLat);
  });
}

/**
 * Setup drag interaction for markers
 * @param {ol.Map} map - OpenLayers map instance
 */
function setupDragInteraction(map) {
  // Create Translate interaction for dragging markers
  dragInteraction = new ol.interaction.Translate({
    layers: [window.wtgMarkerLayer],
  });

  // Start drag
  dragInteraction.on('translatestart', (event) => {
    isDragging = true;
    console.log('Marker drag started');
  });

  // End drag - recalculate route
  dragInteraction.on('translateend', async (event) => {
    const features = event.features.getArray();
    if (features.length > 0) {
      await handleMarkerDragEnd(features[0]);
    }

    // Reset flag after a small delay to prevent click event
    setTimeout(() => {
      isDragging = false;
    }, 100);
  });

  map.addInteraction(dragInteraction);
  console.log('Drag interaction enabled');
}

/**
 * Handle marker drag end - update waypoint and recalculate route
 * @param {ol.Feature} feature - Dragged marker feature
 */
async function handleMarkerDragEnd(feature) {
  // Check if feature still exists in markerFeatures (not removed)
  const markerIndex = markerFeatures.indexOf(feature);
  if (markerIndex === -1) {
    console.log('Dragged marker was removed, ignoring drag end');
    return;
  }

  const waypointIndex = feature.get('waypointIndex');
  const newCoordinate = feature.getGeometry().getCoordinates();
  const newLonLat = ol.proj.toLonLat(newCoordinate);

  // Update lonLat property in feature
  feature.set('lonLat', newLonLat);

  // Update waypoint in array
  waypoints[waypointIndex] = newLonLat;

  // Fetch new address for this location
  if (window.wtgGeocoding && window.wtgGeocoding.reverseGeocode) {
    try {
      const addressInfo = await window.wtgGeocoding.reverseGeocode(
        newLonLat[1],
        newLonLat[0]
      );
      if (addressInfo) {
        feature.set('address', addressInfo.displayAddress);
        feature.set('fullAddress', addressInfo.fullAddress);
        console.log('Updated address after drag:', addressInfo.displayAddress);
      } else {
        feature.set(
          'address',
          window.wtgGeocoding.formatCoordinates(newLonLat[1], newLonLat[0])
        );
      }
    } catch (error) {
      console.error('Error fetching address after drag:', error);
      feature.set(
        'address',
        window.wtgGeocoding.formatCoordinates(newLonLat[1], newLonLat[0])
      );
    }
  }

  // Update tooltip
  updateMarkerTooltip(feature, newCoordinate);

  // Update waypoints list
  updateWaypointsList();

  console.log(`Waypoint ${waypointIndex + 1} moved to:`, newLonLat);

  // Recalculate route if we have at least 2 waypoints
  if (waypoints.length >= 2) {
    const routeData = await window.wtgRouting.calculateRoute(
      waypoints,
      window.wtgCurrentOsrmPort
    );

    if (routeData) {
      window.wtgRouting.displayRoute(routeData, window.wtgMap);
      updateExportButtonState();
    }
  }
}

/**
 * Setup Clear All button handler
 */
function setupClearAllButton() {
  const clearBtn = document.getElementById('clear-all-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearWaypoints();
    });
    console.log('Clear All button initialized');
  }
}

/**
 * Setup Export GeoJSON button handler
 */
function setupExportGeoJSONButton() {
  const exportBtn = document.getElementById('export-geojson-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (window.wtgRouting && window.wtgRouting.downloadRouteAsGeoJSON) {
        window.wtgRouting.downloadRouteAsGeoJSON();
      }
    });
    console.log('Export GeoJSON button initialized');
  }
}

/**
 * Setup Export PDF button handler
 */
function setupExportPDFButton() {
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      if (window.wtgRouting && window.wtgRouting.exportInstructionsToPDF) {
        window.wtgRouting.exportInstructionsToPDF();
      }
    });
    console.log('Export PDF button initialized');
  }
}

/**
 * Enable or disable Export buttons based on route availability
 */
function updateExportButtonState() {
  const exportBtn = document.getElementById('export-geojson-btn');
  const exportPdfBtn = document.getElementById('export-pdf-btn');

  const hasRoute =
    window.wtgRouteLayer &&
    window.wtgRouteLayer.getSource().getFeatures().length > 0;

  if (exportBtn) {
    exportBtn.disabled = !hasRoute;
  }

  if (exportPdfBtn) {
    exportPdfBtn.disabled = !hasRoute;
  }
}

/**
 * Update marker tooltip/popup with address
 * @param {ol.Feature} feature - Marker feature
 * @param {Array} coordinate - Map coordinate
 */
function updateMarkerTooltip(feature, coordinate) {
  const address = feature.get('address');
  const waypointNumber = feature.get('waypointNumber');

  if (address) {
    // Create or update overlay for this marker
    const overlayId = `tooltip-${waypointNumber}`;
    let overlay = window.wtgMap.getOverlayById(overlayId);

    if (!overlay) {
      // Create tooltip element
      const tooltipElement = document.createElement('div');
      tooltipElement.id = overlayId;
      tooltipElement.className =
        'bg-white px-2 py-1 rounded shadow-lg text-xs border border-gray-300 max-w-xs';
      tooltipElement.style.cssText =
        'pointer-events: none; white-space: nowrap; margin-top: -35px;';

      // Create overlay
      overlay = new ol.Overlay({
        id: overlayId,
        element: tooltipElement,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
      });

      window.wtgMap.addOverlay(overlay);
    }

    // Update content and position
    overlay.getElement().innerHTML = `<strong>#${waypointNumber}:</strong> ${address}`;
    overlay.setPosition(coordinate);
  }
}

/**
 * Create marker style with number
 * @param {number} number - Marker number
 * @returns {ol.style.Style} Marker style
 */
function createMarkerStyle(number) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 18,
      fill: new ol.style.Fill({
        color: '#ff6600', // Primary orange
      }),
      stroke: new ol.style.Stroke({
        color: '#ffffff',
        width: 3,
      }),
    }),
    text: new ol.style.Text({
      text: number.toString(),
      fill: new ol.style.Fill({
        color: '#ffffff',
      }),
      font: 'bold 15px sans-serif',
      offsetY: 0,
    }),
  });
}

/**
 * Clear all waypoints and markers
 */
function clearWaypoints() {
  waypoints = [];
  markerFeatures = [];

  if (window.wtgMarkerLayer) {
    window.wtgMarkerLayer.getSource().clear();
  }

  // Clear all overlays (address tooltips)
  if (window.wtgMap) {
    const overlays = window.wtgMap.getOverlays().getArray().slice();
    overlays.forEach((overlay) => {
      if (overlay.getId() && overlay.getId().startsWith('tooltip-')) {
        window.wtgMap.removeOverlay(overlay);
      }
    });
  }

  // Also clear route
  if (window.wtgRouting) {
    window.wtgRouting.clearRoute();
  }

  // Update export button state
  updateExportButtonState();

  // Update waypoints list
  updateWaypointsList();

  console.log('All waypoints cleared');
}

/**
 * Update waypoints list panel
 */
function updateWaypointsList() {
  const sidebar = document.getElementById('route-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const list = document.getElementById('waypoints-list');
  const emptyMsg = document.getElementById('waypoints-empty');

  if (!list) return;

  // Clear list
  list.innerHTML = '';

  if (markerFeatures.length === 0) {
    // Show empty message
    if (emptyMsg) emptyMsg.classList.remove('hidden');

    // Close sidebar when no waypoints
    if (sidebar) {
      sidebar.classList.add('translate-x-full');
      // Don't hide completely, just slide out
    }

    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Hide toggle button
    if (toggleBtn) {
      toggleBtn.classList.add('hidden');
    }

    return;
  }

  // Hide empty message
  if (emptyMsg) emptyMsg.classList.add('hidden');

  // Open sidebar when waypoints exist
  if (sidebar && markerFeatures.length > 0) {
    sidebar.classList.remove('hidden');
    sidebar.classList.remove('translate-x-full');

    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.remove('hidden');
  }

  // Show toggle button
  if (toggleBtn) {
    toggleBtn.classList.remove('hidden');
  }

  // Build list from markerFeatures
  markerFeatures.forEach((feature, index) => {
    const waypointNumber = feature.get('waypointNumber');
    const address = feature.get('address') || 'Pobieranie adresu...';
    const lonLat = feature.get('lonLat');
    const coords = lonLat
      ? `${lonLat[1].toFixed(5)}, ${lonLat[0].toFixed(5)}`
      : '';

    const itemDiv = document.createElement('div');
    itemDiv.className =
      'flex items-start gap-3 p-3 bg-gradient-to-r from-white to-orange-50 rounded-lg hover:shadow-md transition-all cursor-move border border-gray-200';
    itemDiv.dataset.waypointNumber = waypointNumber;
    itemDiv.dataset.waypointIndex = index;
    itemDiv.draggable = true;

    itemDiv.innerHTML = `
      <div class="flex-shrink-0 p-1 text-gray-400 cursor-grab active:cursor-grabbing" data-action="drag-handle">
        <i data-lucide="grip-vertical" class="w-5 h-5"></i>
      </div>
      <div class="flex-shrink-0 w-8 h-8 bg-[#ff6600] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
        ${waypointNumber}
      </div>
      <div class="flex-1 min-w-0 cursor-pointer" data-action="highlight">
        <p class="text-gray-900 font-medium truncate">${address}</p>
        <p class="text-xs text-gray-500 mt-1">${coords}</p>
      </div>
      <button class="flex-shrink-0 p-1 text-gray-500 hover:text-[#ff6600] transition-colors" data-action="delete" title="Usuń punkt">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    `;

    // Drag & Drop event handlers
    itemDiv.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
      itemDiv.classList.add('opacity-50');
      console.log('Drag started for waypoint:', index);
    });

    itemDiv.addEventListener('dragend', (e) => {
      itemDiv.classList.remove('opacity-50');
      // Remove all drag-over styles
      document.querySelectorAll('.border-blue-500').forEach((el) => {
        el.classList.remove('border-blue-500', 'border-2');
      });
    });

    itemDiv.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      itemDiv.classList.add('border-blue-500', 'border-2');
    });

    itemDiv.addEventListener('dragleave', (e) => {
      itemDiv.classList.remove('border-blue-500', 'border-2');
    });

    itemDiv.addEventListener('drop', (e) => {
      e.preventDefault();
      itemDiv.classList.remove('border-blue-500', 'border-2');

      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const dropIndex = index;

      if (draggedIndex !== dropIndex) {
        console.log(`Swapping waypoint ${draggedIndex} with ${dropIndex}`);
        swapWaypoints(draggedIndex, dropIndex);
      }
    });

    // Click event for highlight and delete actions
    itemDiv.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;

      if (action === 'highlight') {
        highlightMarker(feature);
      } else if (action === 'delete') {
        removeWaypoint(feature);
      }
    });

    list.appendChild(itemDiv);
  });

  // Re-initialize Lucide icons for new buttons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Swap two waypoints in the list
 * @param {number} index1 - Index of first waypoint
 * @param {number} index2 - Index of second waypoint
 */
async function swapWaypoints(index1, index2) {
  if (
    index1 < 0 ||
    index2 < 0 ||
    index1 >= markerFeatures.length ||
    index2 >= markerFeatures.length
  ) {
    console.error('Invalid waypoint indices for swap');
    return;
  }

  // Swap in waypoints array
  [waypoints[index1], waypoints[index2]] = [
    waypoints[index2],
    waypoints[index1],
  ];

  // Swap in markerFeatures array
  [markerFeatures[index1], markerFeatures[index2]] = [
    markerFeatures[index2],
    markerFeatures[index1],
  ];

  // Renumber all waypoints
  markerFeatures.forEach((feature, index) => {
    feature.set('waypointNumber', index + 1);
    feature.set('waypointIndex', index);
    feature.setStyle(createMarkerStyle(index + 1));
  });

  // Update tooltips with new numbers
  markerFeatures.forEach((feature) => {
    const coordinate = feature.getGeometry().getCoordinates();
    updateMarkerTooltip(feature, coordinate);
  });

  // Update waypoints list
  updateWaypointsList();

  // Recalculate route if we have at least 2 waypoints
  if (waypoints.length >= 2 && window.wtgRouting) {
    try {
      const routeData = await window.wtgRouting.calculateRoute(
        waypoints,
        window.wtgCurrentOsrmPort
      );

      if (routeData) {
        window.wtgRouting.displayRoute(routeData, window.wtgMap);
        updateExportButtonState();
        console.log('Route recalculated after waypoint swap');
      }
    } catch (error) {
      console.error('Error recalculating route after swap:', error);
    }
  }

  console.log(`Swapped waypoints ${index1 + 1} and ${index2 + 1}`);
}

/**
 * Highlight marker on map when clicked from list
 * @param {ol.Feature} feature - Marker feature to highlight
 */
function highlightMarker(feature) {
  if (!window.wtgMap || !feature) return;

  const geometry = feature.getGeometry();
  const coordinate = geometry.getCoordinates();

  // Center map on marker
  window.wtgMap.getView().animate({
    center: coordinate,
    duration: 500,
    zoom: 17,
  });

  // Temporarily pulse the marker (visual feedback)
  const originalStyle = feature.getStyle();
  const waypointNumber = feature.get('waypointNumber');

  // Create highlighted style
  const highlightStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 20,
      fill: new ol.style.Fill({
        color: '#dc2626',
      }),
      stroke: new ol.style.Stroke({
        color: '#ffffff',
        width: 3,
      }),
    }),
    text: new ol.style.Text({
      text: waypointNumber.toString(),
      font: 'bold 14px sans-serif',
      fill: new ol.style.Fill({
        color: '#ffffff',
      }),
    }),
  });

  // Apply highlight
  feature.setStyle(highlightStyle);

  // Restore original style after animation
  setTimeout(() => {
    feature.setStyle(originalStyle);
  }, 1000);
}

/**
 * Get current waypoints
 * @returns {Array} Array of waypoints
 */
function getWaypoints() {
  return waypoints;
}

/**
 * Show error notification
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorNotification = document.getElementById('error-notification');
  const errorMessage = document.getElementById('error-message');

  if (errorNotification && errorMessage) {
    errorMessage.textContent = message;
    errorNotification.classList.remove('hidden');

    // Auto-hide after 8 seconds
    setTimeout(() => {
      hideError();
    }, 8000);
  }
}

/**
 * Hide error notification
 */
function hideError() {
  const errorNotification = document.getElementById('error-notification');
  if (errorNotification) {
    errorNotification.classList.add('hidden');
  }
}

/**
 * Setup error notification close button
 */
function setupErrorNotification() {
  const closeBtn = document.getElementById('close-error-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideError);
  }
}

/**
 * Setup sidebar toggle and close controls
 */
function setupSidebar() {
  const sidebar = document.getElementById('route-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const overlay = document.getElementById('sidebar-overlay');

  if (!sidebar || !toggleBtn) return;

  // Toggle sidebar open/close
  toggleBtn.addEventListener('click', () => {
    const isHidden = sidebar.classList.contains('translate-x-full');

    if (isHidden) {
      // Open sidebar
      sidebar.classList.remove('translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    } else {
      // Close sidebar
      sidebar.classList.add('translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  });

  // Close button (mobile)
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    });
  }

  // Close on overlay click (mobile)
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    });
  }
}

/**
 * Setup search bar with autocomplete
 */
function setupSearchBar() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  let searchTimeout;
  let isSearchResultsVisible = false;

  // Debounced search on input
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < 3) {
      searchResults.classList.add('hidden');
      isSearchResultsVisible = false;
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  // Show results on focus if there's a query
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 3) {
      searchResults.classList.remove('hidden');
      isSearchResultsVisible = true;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
      isSearchResultsVisible = false;
    }
  });
}

/**
 * Perform search and display results
 * @param {string} query - Search query
 */
async function performSearch(query) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;

  // Show loading state
  searchResults.innerHTML =
    '<div class="px-4 py-3 text-gray-500">Wyszukiwanie...</div>';
  searchResults.classList.remove('hidden');

  try {
    // Get current city bounds for focused search
    const bounds = getCurrentCityBounds();

    // Search with Nominatim
    const results = await window.wtgGeocoding.forwardGeocode(query, {
      boundingBox: bounds,
      limit: 5,
    });

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="px-4 py-3 text-gray-500">Nie znaleziono wyników</div>';
      return;
    }

    // Display results
    searchResults.innerHTML = results
      .map(
        (result) => `
      <div class="search-result-item px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0" 
           data-lat="${result.lat}" 
           data-lon="${result.lon}">
        <div class="font-medium text-gray-900">${result.displayName}</div>
        <div class="text-xs text-gray-500 mt-1">${result.type}</div>
      </div>
    `
      )
      .join('');

    // Add click handlers to results
    searchResults.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const lat = parseFloat(item.dataset.lat);
        const lon = parseFloat(item.dataset.lon);
        selectSearchResult({
          lat,
          lon,
          displayName: item.querySelector('.font-medium').textContent,
        });
      });
    });
  } catch (error) {
    console.error('Search error:', error);
    searchResults.innerHTML =
      '<div class="px-4 py-3 text-red-600">Błąd wyszukiwania</div>';
  }
}

/**
 * Get bounding box for current city
 * @returns {string} Bounding box string "minLon,minLat,maxLon,maxLat"
 */
function getCurrentCityBounds() {
  const cityBounds = {
    krakow: '19.8,49.95,20.2,50.15',
    warszawa: '20.85,52.1,21.3,52.4',
    wroclaw: '16.8,51.0,17.2,51.25',
    trojmiasto: '18.4,54.3,18.8,54.6',
  };

  return cityBounds[window.wtgCurrentCity] || null;
}

/**
 * Handle search result selection
 * @param {Object} result - Selected search result
 */
async function selectSearchResult(result) {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  // Hide dropdown and clear input
  if (searchResults) searchResults.classList.add('hidden');
  if (searchInput) searchInput.value = '';

  // Center map on result
  if (window.wtgMap) {
    const coordinate = ol.proj.fromLonLat([result.lon, result.lat]);
    window.wtgMap.getView().animate({
      center: coordinate,
      duration: 500,
      zoom: 17,
    });

    // Add waypoint at this location
    await addWaypoint([result.lon, result.lat], coordinate);

    // Calculate route if we have at least 2 waypoints (US 5.4)
    if (waypoints.length >= 2 && window.wtgRouting) {
      try {
        const routeData = await window.wtgRouting.calculateRoute(
          waypoints,
          window.wtgCurrentOsrmPort
        );

        if (routeData) {
          window.wtgRouting.displayRoute(routeData, window.wtgMap);
          updateExportButtonState();
          console.log('Route calculated after search selection');
        }
      } catch (error) {
        console.error('Error calculating route after search:', error);
        if (window.wtgUI && window.wtgUI.showError) {
          window.wtgUI.showError(
            'Nie udało się wyliczyć trasy. Spróbuj ponownie.'
          );
        }
      }
    }
  }
}

// Export functions to global scope
window.wtgUI = {
  initUI,
  addWaypoint,
  addWaypointFromGPS,
  removeWaypoint,
  clearWaypoints,
  getWaypoints,
  showError,
  hideError,
  MAX_WAYPOINTS,
};
