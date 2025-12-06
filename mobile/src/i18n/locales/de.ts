// German translations
const de = {
  translation: {
    // Common
    common: {
      loading: 'Laden...',
      error: 'Ein Fehler ist aufgetreten',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      clear: 'Löschen',
      search: 'Suchen',
      ok: 'OK',
      back: 'Zurück',
    },

    // Tabs
    tabs: {
      explore: 'Erkunden',
      routes: 'Routen',
      tours: 'Touren',
      settings: 'Einstellungen',
    },

    // Explore page
    explore: {
      title: 'Erkunden',
      locateMe: 'Mich lokalisieren',
    },

    // Routes page
    routes: {
      title: 'Meine Routen',
      noRoutes: 'Keine gespeicherten Routen',
      noRoutesHint: 'Planen Sie eine Route durch Tippen auf die Schaltfläche +',
      planRoute: 'Routenplanung',
      clearAll: 'Löschen',
      startNavigation: 'Navigation starten',
      saveRoute: 'Route speichern',
      routeName: 'Routenname',
      routeNamePlaceholder: 'z.B. Spaziergang durch die Altstadt',
      routeDescription: 'Beschreibung (optional)',
      routeDescriptionPlaceholder: 'Routenbeschreibung hinzufügen...',
      savedSuccessfully: 'Route gespeichert',
      deleteRoute: 'Route löschen',
      deleteConfirm: 'Möchten Sie diese Route wirklich löschen?',
      editRoute: 'Route bearbeiten',
      routeDetails: 'Routendetails',
      exportRoute: 'Exportieren',
      exportGeoJSON: 'GeoJSON exportieren',
      exportGPX: 'GPX exportieren',
      exportSuccess: 'Route exportiert',
      exportError: 'Export fehlgeschlagen',
      favorites: 'Favoriten',
      allRoutes: 'Alle Routen',
      waypoints: 'Wegpunkte',
      waypointLabel: 'Wegpunkt {{number}}',
      createdAt: 'Erstellt',
      updatedAt: 'Aktualisiert',
      showOnMap: 'Auf Karte anzeigen',
      loadRoute: 'Route laden',
      draftRoute: 'Entwurfsroute',
      newRoute: 'Neue Route',
      unsaved: 'Nicht gespeichert',
      continueEditing: 'Weiter bearbeiten',
      discard: 'Verwerfen',
      draftDiscarded: 'Entwurfsroute verworfen',
      profiles: {
        foot: 'Zu Fuß',
        bicycle: 'Fahrrad',
        car: 'Auto',
      },
    },

    // Tours page
    tours: {
      title: 'Touren',
      subtitle: 'Kuratierte Touren',
      noTours: 'Keine Touren verfügbar',
      noToursHint: 'Fertige Routen durch polnische Städte kommen bald',
      comingSoon: 'Demnächst!',
    },

    // Settings page
    settings: {
      title: 'Einstellungen',
      appearance: 'Erscheinungsbild',
      darkMode: 'Dunkelmodus',
      language: 'Sprache',
      navigation: 'Navigation',
      defaultCity: 'Standardstadt',
      defaultProfile: 'Standardprofil',
      units: 'Einheiten',
      unitsKm: 'Kilometer',
      unitsMiles: 'Meilen',
      about: 'Über',
      version: 'Version',
      appName: 'WTG Route Machine',
    },

    // POI
    poi: {
      addToRoute: 'Zur Route hinzufügen',
      addToRouteAndGo: 'Hinzufügen und zur Route',
      navigate: 'Navigieren',
      added: '"{{name}}" zur Route hinzugefügt',
      categories: {
        landmark: 'Sehenswürdigkeit',
        museum: 'Museum',
        park: 'Park',
        restaurant: 'Restaurant',
        cafe: 'Café',
        hotel: 'Hotel',
        viewpoint: 'Aussichtspunkt',
        church: 'Kirche',
      },
    },

    // Route planning
    route: {
      distance: 'Entfernung',
      duration: 'Zeit',
      calculating: 'Route wird berechnet...',
      noWaypoints: 'Keine Wegpunkte',
      addWaypointsHint: 'Tippen Sie auf die Karte, um Wegpunkte hinzuzufügen',
      minWaypoints: 'Mindestens 2 Wegpunkte erforderlich',
      clearAll: 'Alles löschen',
      start: 'Start',
      destination: 'Ziel',
      stopover: 'Zwischenstopp {{number}}',
      hours: 'Std.',
      minutes: 'Min',
      profiles: {
        foot: 'Zu Fuß',
        bicycle: 'Fahrrad',
        car: 'Auto',
      },
    },

    // Cities
    cities: {
      krakow: 'Krakau',
      warszawa: 'Warschau',
      wroclaw: 'Breslau',
      trojmiasto: 'Dreistadt',
      selectCity: 'Stadt auswählen',
    },

    // Navigation instructions
    navigation: {
      turn: 'Abbiegen',
      left: 'links',
      right: 'rechts',
      slightLeft: 'leicht links',
      slightRight: 'leicht rechts',
      sharpLeft: 'scharf links',
      sharpRight: 'scharf rechts',
      straight: 'geradeaus',
      uturn: 'wenden',
      continue: 'Weiter',
      depart: 'Route starten',
      arrive: 'Sie haben Ihr Ziel erreicht',
      merge: 'Einfädeln',
      roundabout: 'Am Kreisverkehr',
      exitRoundabout: 'Kreisverkehr verlassen',
      onStreet: 'auf {{street}}',
    },

    // Saved routes
    savedRoutes: {
      saveRoute: 'Route speichern',
      routeName: 'Routenname',
      routeNamePlaceholder: 'Z.B., Spaziergang durch die Altstadt',
      routeDescription: 'Beschreibung (optional)',
      routeDescriptionPlaceholder: 'Zusätzliche Informationen zur Route...',
      routeSummary: 'Routenübersicht',
      waypoints: 'Wegpunkte',
      city: 'Stadt',
      profile: 'Profil',
      deleteConfirm: 'Möchten Sie diese Route wirklich löschen?',
      deleteConfirmTitle: 'Route löschen',
      routeSaved: 'Route wurde gespeichert',
      routeDeleted: 'Route wurde gelöscht',
    },

    // Errors
    errors: {
      locationDenied: 'Standortzugriff verweigert',
      locationUnavailable: 'Standort nicht verfügbar',
      networkError: 'Netzwerkfehler',
      routeError: 'Route konnte nicht berechnet werden',
      unknown: 'Unbekannter Fehler',
    },
  },
};

export default de;
