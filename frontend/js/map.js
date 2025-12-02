/**
 * WTG Route Machine - Map Initialization
 * US 1.1: Wyświetlanie Mapy
 * US 1.2: Zmiana Miasta
 */

// Routing profiles configuration
// US 8.2: Route profile selection
const ROUTING_PROFILES = {
  foot: {
    name: 'Pieszo',
    icon: 'footprints',
    description: 'Trasa piesza',
  },
  bicycle: {
    name: 'Rower',
    icon: 'bike',
    description: 'Trasa rowerowa',
  },
  car: {
    name: 'Auto',
    icon: 'car',
    description: 'Trasa samochodowa',
  },
};

// City configurations with coordinates and OSRM ports per profile
const CITIES = {
  krakow: {
    name: 'Kraków',
    center: [19.9385, 50.0647],
    zoom: 14,
    ports: {
      foot: 5001,
      bicycle: 5002,
      car: 5003,
    },
  },
  warszawa: {
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    zoom: 13,
    ports: {
      foot: 5004,
      bicycle: 5005,
      car: 5006,
    },
  },
  wroclaw: {
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    zoom: 13,
    ports: {
      foot: 5007,
      bicycle: 5008,
      car: 5009,
    },
  },
  trojmiasto: {
    name: 'Trójmiasto',
    center: [18.6466, 54.352], // Gdańsk center
    zoom: 12,
    ports: {
      foot: 5010,
      bicycle: 5011,
      car: 5012,
    },
  },
};

// Current city, profile, and OSRM port
let currentCity = 'krakow';
let currentProfile = 'foot'; // Default profile
let currentOsrmPort = CITIES[currentCity].ports[currentProfile];

// Load saved profile from localStorage
// US 8.2: Profile saved in localStorage
const savedProfile = localStorage.getItem('wtg-routing-profile');
if (savedProfile && ROUTING_PROFILES[savedProfile]) {
  currentProfile = savedProfile;
  currentOsrmPort = CITIES[currentCity].ports[currentProfile];
}

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
  window.wtgCurrentProfile = currentProfile;
  window.wtgCurrentOsrmPort = currentOsrmPort;
  window.wtgRoutingProfiles = ROUTING_PROFILES;

  console.log('Map initialized successfully');
  console.log('City:', cityConfig.name);
  console.log('Center:', cityConfig.center);
  console.log('Profile:', currentProfile);
  console.log('OSRM Port:', currentOsrmPort);

  // Set up city selector event listener
  setupCitySelector();

  // Set up profile selector event listener
  // US 8.2: Route profile selection
  setupProfileSelector();

  // Initialize UI module (markers and interactions)
  // US 2.1: Dodawanie Punktów
  if (window.wtgUI && window.wtgUI.initUI) {
    window.wtgUI.initUI(map);
    console.log('UI module initialized');
  }

  // Request geolocation and set as first waypoint
  // US 8.1: Automatyczny Punkt Startowy GPS
  requestGeolocation();

  return map;
}

/**
 * Request user's geolocation and set as first waypoint
 * US 8.1: Automatyczny Punkt Startowy GPS
 */
function requestGeolocation() {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by this browser');
    return;
  }

  console.log('Requesting geolocation permission...');

  // Request current position with timeout
  navigator.geolocation.getCurrentPosition(
    // Success callback
    function (position) {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      const accuracy = position.coords.accuracy;

      console.log('GPS position obtained:', { lon, lat, accuracy });

      // Check if position is within reasonable bounds of current city
      const cityConfig = CITIES[currentCity];
      const cityCenter = cityConfig.center;
      const distance = calculateDistance(
        lat,
        lon,
        cityCenter[1],
        cityCenter[0]
      );

      // If position is more than 50km from city center, show warning
      if (distance > 50) {
        console.warn(
          'GPS position is far from selected city:',
          distance.toFixed(1),
          'km'
        );
        alert(
          `Twoja lokalizacja (${distance.toFixed(
            1
          )} km od centrum) jest poza wybranym miastem.\n\nMożesz kontynuować, ale routing może nie działać poprawnie.`
        );
      }

      // Center map on user location with appropriate zoom
      // US 8.1: Center map on user location
      const map = window.wtgMap;
      if (map) {
        const view = map.getView();
        view.animate({
          center: ol.proj.fromLonLat([lon, lat]),
          zoom: 15,
          duration: 1000,
        });
      }

      // Add GPS position as first waypoint
      // US 8.1: Set GPS position as first waypoint
      if (window.wtgUI && window.wtgUI.addWaypointFromGPS) {
        window.wtgUI.addWaypointFromGPS(lon, lat);
        console.log('GPS position added as first waypoint');
      }
    },
    // Error callback
    function (error) {
      console.log('Geolocation error:', error.message);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('User denied geolocation permission');
          // App continues normally without GPS waypoint
          break;
        case error.POSITION_UNAVAILABLE:
          console.warn('Position information is unavailable');
          break;
        case error.TIMEOUT:
          console.warn('Geolocation request timed out');
          break;
        default:
          console.error('Unknown geolocation error:', error);
      }
    },
    // Options
    {
      enableHighAccuracy: true,
      timeout: 10000, // 10 second timeout as per US 8.1
      maximumAge: 0, // Don't use cached position
    }
  );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

  // Update current city and OSRM port based on current profile
  currentCity = cityKey;
  currentOsrmPort = cityConfig.ports[currentProfile];
  window.wtgCurrentCity = currentCity;
  window.wtgCurrentOsrmPort = currentOsrmPort;

  // Center map on new city with animation
  const view = map.getView();
  view.animate({
    center: ol.proj.fromLonLat(cityConfig.center),
    zoom: cityConfig.zoom,
    duration: 1000,
  });

  // Clear existing route and markers
  // US 2.1: Dodawanie Punktów
  if (window.wtgUI && window.wtgUI.clearWaypoints) {
    window.wtgUI.clearWaypoints();
  }

  console.log('Switched to:', cityConfig.name);
  console.log('Profile:', currentProfile);
  console.log('New OSRM port:', currentOsrmPort);
}

/**
 * Set up profile selector buttons event listeners
 * US 8.2: Route profile selection
 */
function setupProfileSelector() {
  const profileButtons = document.querySelectorAll('.profile-btn');
  if (!profileButtons || profileButtons.length === 0) {
    console.error('Profile buttons not found');
    return;
  }

  // Set initial active state based on saved profile
  updateProfileButtonState(currentProfile);

  // Add click event listeners
  profileButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const newProfile = this.getAttribute('data-profile');
      switchProfile(newProfile);
    });
  });

  console.log('Profile selector initialized with profile:', currentProfile);
}

/**
 * Switch to a different routing profile
 * US 8.2: Route profile selection
 * @param {string} profileKey - Key of the profile to switch to ('foot', 'bicycle', 'car')
 */
async function switchProfile(profileKey) {
  if (!ROUTING_PROFILES[profileKey]) {
    console.error('Unknown profile:', profileKey);
    return;
  }

  if (profileKey === currentProfile) {
    console.log('Already using profile:', profileKey);
    return;
  }

  console.log('Switching to profile:', profileKey);

  // Check if profile is available for current city
  const cityConfig = CITIES[currentCity];
  if (!cityConfig.ports[profileKey]) {
    alert(
      `Profil "${ROUTING_PROFILES[profileKey].name}" nie jest dostępny dla wybranego miasta.\n\nPowrót do profilu "Pieszo".`
    );
    return;
  }

  // Update current profile and OSRM port
  currentProfile = profileKey;
  currentOsrmPort = cityConfig.ports[currentProfile];
  window.wtgCurrentProfile = currentProfile;
  window.wtgCurrentOsrmPort = currentOsrmPort;

  // Save profile to localStorage
  // US 8.2: Profile saved in localStorage
  localStorage.setItem('wtg-routing-profile', currentProfile);

  // Update button states
  updateProfileButtonState(currentProfile);

  console.log('Switched to profile:', ROUTING_PROFILES[profileKey].name);
  console.log('New OSRM port:', currentOsrmPort);

  // Recalculate route if waypoints exist
  // US 8.2: Automatic route recalculation
  const waypoints = window.wtgUI ? window.wtgUI.getWaypoints() : [];
  if (waypoints && waypoints.length >= 2) {
    console.log('Recalculating route with new profile...');
    const routeData = await window.wtgRouting.calculateRoute(
      waypoints,
      currentOsrmPort
    );
    if (routeData) {
      window.wtgRouting.displayRoute(routeData);
    }
  }
}

/**
 * Update profile button visual states
 * @param {string} activeProfile - The currently active profile key
 */
function updateProfileButtonState(activeProfile) {
  const profileButtons = document.querySelectorAll('.profile-btn');
  profileButtons.forEach((button) => {
    const profile = button.getAttribute('data-profile');
    if (profile === activeProfile) {
      // Active state
      button.className =
        'profile-btn px-3 py-1.5 rounded-md font-medium text-sm transition-all flex items-center gap-1.5 bg-primary text-white shadow-md';
    } else {
      // Inactive state
      button.className =
        'profile-btn px-3 py-1.5 rounded-md font-medium text-sm transition-all flex items-center gap-1.5 text-gray-600 hover:bg-gray-200';
    }
  });
}

// Initialize map when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
