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
      noToursTitle: 'Keine Touren verfügbar',
      noToursHint: 'Fertige Routen durch polnische Städte kommen bald',
      comingSoon: 'Demnächst!',
      error: 'Touren konnten nicht geladen werden',
      stops: 'Haltestellen',
      stopsOnRoute: 'Haltestellen auf der Route',
      showMap: 'Karte anzeigen',
      hideMap: 'Karte verbergen',
      startTour: 'Tour starten',
      allCategories: 'Alle',
      category: {
        history: 'Geschichte',
        architecture: 'Architektur',
        art: 'Kunst',
        food: 'Kulinarik',
        nature: 'Natur',
      },
      difficulty: {
        easy: 'Einfach',
        medium: 'Mittel',
        hard: 'Schwer',
      },
      krakow: {
        landmarks: {
          name: 'Wichtigste Sehenswürdigkeiten von Krakau',
          description:
            'Spaziergang durch Krakau mit Besuch der wichtigsten Denkmäler',
        },
        churches: {
          name: 'Historische Kirchen von Krakau',
          description:
            'Entdecken Sie die schönsten Kirchen Krakaus von Gotik bis Barock',
        },
      },
      warszawa: {
        landmarks: {
          name: 'Wichtigste Sehenswürdigkeiten von Warschau',
          description:
            'Erkundung der polnischen Hauptstadt - von der Altstadt bis zu den Königlichen Łazienki',
        },
        churches: {
          name: 'Historische Kirchen von Warschau',
          description:
            'Entdecken Sie die wichtigsten Kirchen Warschaus und ihre reiche Geschichte',
        },
      },
      wroclaw: {
        landmarks: {
          name: 'Wichtigste Sehenswürdigkeiten von Breslau',
          description:
            'Spaziergang durch das malerische Breslau - vom Marktplatz bis Ostrów Tumski',
        },
        churches: {
          name: 'Historische Kirchen von Breslau',
          description:
            'Entdecken Sie gotische Perlen der sakralen Architektur Breslaus',
        },
      },
      trojmiasto: {
        landmarks: {
          name: 'Wichtigste Sehenswürdigkeiten von Danzig',
          description:
            'Spaziergang durch Danzig - die Hauptstadt der Dreistadt mit reicher Geschichte',
        },
        churches: {
          name: 'Historische Kirchen von Danzig',
          description:
            'Entdecken Sie monumentale Kirchen Danzigs, einschließlich der größten Backsteinbasilika der Welt',
        },
      },
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
