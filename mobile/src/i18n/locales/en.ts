// English translations
const en = {
  translation: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      clear: 'Clear',
      search: 'Search',
      ok: 'OK',
      back: 'Back',
    },

    // Tabs
    tabs: {
      explore: 'Explore',
      routes: 'Routes',
      tours: 'Tours',
      settings: 'Settings',
    },

    // Explore page
    explore: {
      title: 'Explore',
      locateMe: 'Locate me',
    },

    // Routes page
    routes: {
      title: 'My Routes',
      noRoutes: 'No saved routes',
      noRoutesHint: 'Plan a route by tapping the + button below',
      planRoute: 'Route planning',
      clearAll: 'Clear',
      startNavigation: 'Start navigation',
      saveRoute: 'Save route',
      routeName: 'Route name',
      routeNamePlaceholder: 'e.g. Walk through Old Town',
      routeDescription: 'Description (optional)',
      routeDescriptionPlaceholder: 'Add route description...',
      savedSuccessfully: 'Route saved',
      deleteRoute: 'Delete route',
      deleteConfirm: 'Are you sure you want to delete this route?',
      editRoute: 'Edit route',
      routeDetails: 'Route details',
      exportRoute: 'Export',
      exportGeoJSON: 'Export GeoJSON',
      exportGPX: 'Export GPX',
      exportSuccess: 'Route exported',
      exportError: 'Export failed',
      favorites: 'Favorites',
      allRoutes: 'All routes',
      waypoints: 'Waypoints',
      waypointLabel: 'Waypoint {{number}}',
      createdAt: 'Created',
      updatedAt: 'Updated',
      showOnMap: 'Show on map',
      loadRoute: 'Load route',
      draftRoute: 'Draft route',
      newRoute: 'New route',
      unsaved: 'Unsaved',
      continueEditing: 'Continue editing',
      discard: 'Discard',
      draftDiscarded: 'Draft route discarded',
      profiles: {
        foot: 'Walking',
        bicycle: 'Cycling',
        car: 'Driving',
      },
    },

    // Tours page
    tours: {
      title: 'Tours',
      subtitle: 'Curated tours',
      noTours: 'No tours available',
      noToursHint: 'Ready-made routes through Polish cities coming soon',
      comingSoon: 'Coming soon!',
    },

    // Settings page
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark mode',
      language: 'Language',
      navigation: 'Navigation',
      defaultCity: 'Default city',
      defaultProfile: 'Default profile',
      units: 'Units',
      unitsKm: 'Kilometers',
      unitsMiles: 'Miles',
      about: 'About',
      version: 'Version',
      appName: 'WTG Route Machine',
    },

    // POI
    poi: {
      addToRoute: 'Add to route',
      addToRouteAndGo: 'Add and go to route',
      navigate: 'Navigate',
      added: 'Added "{{name}}" to route',
      categories: {
        landmark: 'Landmark',
        museum: 'Museum',
        park: 'Park',
        restaurant: 'Restaurant',
        cafe: 'Café',
        hotel: 'Hotel',
        viewpoint: 'Viewpoint',
        church: 'Church',
      },
    },

    // Route planning
    route: {
      distance: 'Distance',
      duration: 'Time',
      calculating: 'Calculating route...',
      noWaypoints: 'No waypoints',
      addWaypointsHint: 'Tap on the map to add waypoints',
      minWaypoints: 'Minimum 2 waypoints required',
      clearAll: 'Clear all',
      start: 'Start',
      destination: 'Destination',
      stopover: 'Stopover {{number}}',
      hours: 'h',
      minutes: 'min',
      profiles: {
        foot: 'Walking',
        bicycle: 'Bicycle',
        car: 'Car',
      },
    },

    // Cities
    cities: {
      krakow: 'Krakow',
      warszawa: 'Warsaw',
      wroclaw: 'Wroclaw',
      trojmiasto: 'Tri-City',
      selectCity: 'Select city',
    },

    // Navigation instructions
    navigation: {
      turn: 'Turn',
      left: 'left',
      right: 'right',
      slightLeft: 'slight left',
      slightRight: 'slight right',
      sharpLeft: 'sharp left',
      sharpRight: 'sharp right',
      straight: 'straight',
      uturn: 'make a U-turn',
      continue: 'Continue',
      depart: 'Start route',
      arrive: 'You have arrived',
      merge: 'Merge',
      roundabout: 'At the roundabout',
      exitRoundabout: 'Exit roundabout',
      onStreet: 'onto {{street}}',
    },

    // Saved routes
    savedRoutes: {
      saveRoute: 'Save Route',
      routeName: 'Route Name',
      routeNamePlaceholder: 'E.g., Old Town Walk',
      routeDescription: 'Description (optional)',
      routeDescriptionPlaceholder: 'Additional information about the route...',
      routeSummary: 'Route Summary',
      waypoints: 'waypoints',
      city: 'City',
      profile: 'Profile',
      deleteConfirm: 'Are you sure you want to delete this route?',
      deleteConfirmTitle: 'Delete Route',
      routeSaved: 'Route has been saved',
      routeDeleted: 'Route has been deleted',
    },

    // Errors
    errors: {
      locationDenied: 'Location access denied',
      locationUnavailable: 'Location unavailable',
      networkError: 'Network error',
      routeError: 'Could not calculate route',
      unknown: 'Unknown error',
    },
  },
};

export default en;
