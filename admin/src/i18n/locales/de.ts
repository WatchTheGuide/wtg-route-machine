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
      search: 'Suchen',
      back: 'Zurück',
      comingSoon: 'Bald verfügbar...',
    },

    // Dashboard
    dashboard: {
      title: 'Admin-Dashboard',
      subtitle: 'Touren und Sehenswürdigkeiten verwalten',
      allCities: 'Alle Städte',
      selectCity: 'Stadt auswählen',
      nav: {
        dashboard: 'Dashboard',
        tours: 'Touren',
        pois: 'POIs',
        settings: 'Einstellungen',
        logout: 'Abmelden',
      },
      stats: {
        tours: 'Touren',
        pois: 'POIs',
        cities: 'Städte',
        views: 'Aufrufe',
        thisMonth: 'diesen Monat',
        active: 'Aktiv',
        total: 'Gesamt',
        fromLastMonth: 'seit letztem Monat',
      },
      citySelector: {
        label: 'Stadt',
        all: 'Alle Städte',
        placeholder: 'Stadt auswählen',
      },
      charts: {
        toursOverTime: 'Touren im Zeitverlauf',
        toursOverTimeDesc: 'Anzahl der Touren und POIs pro Monat',
        toursByCity: 'Touren nach Stadt',
        toursByCityDesc: 'Aufrufe nach Stadt',
        viewsPerCity: 'Aufrufe pro Stadt',
        viewsPerCityDesc: 'Gesamtaufrufe für jede Stadt',
      },
      quickActions: {
        title: 'Schnellaktionen',
        addTour: 'Tour hinzufügen',
        addPoi: 'POI hinzufügen',
        viewStats: 'Statistiken anzeigen',
        managePois: 'POIs verwalten',
        viewReports: 'Berichte anzeigen',
        analytics: 'Analytik',
      },
      topTours: {
        title: 'Top Touren',
        subtitle: 'Meistgesehene Touren',
        views: 'Aufrufe',
      },
      status: {
        published: 'Veröffentlicht',
        draft: 'Entwurf',
      },
      recentTours: {
        title: 'Aktuelle Touren',
        subtitle: 'Kürzlich hinzugefügte und bearbeitete Touren',
        name: 'Name',
        city: 'Stadt',
        status: 'Status',
      },
      activity: {
        title: 'Letzte Aktivität',
        subtitle: 'Änderungshistorie im System',
        created: 'hat erstellt',
        updated: 'hat aktualisiert',
        published: 'hat veröffentlicht',
        deleted: 'hat gelöscht',
      },
    },

    // Tours page
    tours: {
      title: 'Touren',
      subtitle: 'Kuratierte Stadtführungen verwalten',
      listTitle: 'Tourenliste',
    },

    // POIs page
    pois: {
      title: 'Sehenswürdigkeiten',
      subtitle: 'Touristische Sehenswürdigkeiten verwalten',
      listTitle: 'POI-Liste',
    },

    // Settings page
    settings: {
      title: 'Einstellungen',
      subtitle: 'Admin-Panel-Konfiguration',
      generalTitle: 'Allgemeine Einstellungen',
    },

    // Navbar
    nav: {
      features: 'Funktionen',
      cities: 'Städte',
      about: 'Über',
      adminPanel: 'Admin-Panel',
    },

    // Hero section
    hero: {
      badge: 'Open-Source-Routing',
      title: 'Städte-Spaziergänge',
      titleHighlight: 'Einfach gemacht',
      description:
        'Leichtgewichtiges OSRM-basiertes Routing für Fußgängernavigation. Entdecken Sie Stadtrundgänge in polnischen Städten mit optimierten Routen und Sehenswürdigkeiten.',
      exploreCities: 'Städte erkunden',
      viewOnGithub: 'Auf GitHub ansehen',
    },

    // Features section
    features: {
      title: 'Leistungsstarke Funktionen',
      subtitle:
        'Mit modernen Technologien für das beste Stadtrundgang-Erlebnis gebaut.',
      pedestrianRouting: {
        title: 'Fußgänger-Routing',
        description:
          'Optimierte Fußgängerprofile für Stadtrundgänge mit genauen Zeit- und Entfernungsschätzungen.',
      },
      poi: {
        title: 'Sehenswürdigkeiten',
        description:
          'Kuratierte POI-Datenbank mit Wahrzeichen, Museen, Restaurants und versteckten Schätzen.',
      },
      mobile: {
        title: 'Mobil-App',
        description:
          'Ionic React Mobile-App mit Offline-Unterstützung und Schritt-für-Schritt-Navigation.',
      },
      multiCity: {
        title: 'Mehrere Städte',
        description:
          'Skalierbare Architektur, die mehrere Städte mit individuellen Routing-Engines unterstützt.',
      },
    },

    // Cities section
    cities: {
      title: 'Städte erkunden',
      subtitle: 'Entdecken Sie Stadtrundgänge in Polens schönsten Städten.',
      toursAvailable: '{{count}} Touren verfügbar',
      krakow: {
        name: 'Krakau',
        description: 'Historische Königsstadt mit atemberaubender Architektur',
      },
      warszawa: {
        name: 'Warschau',
        description:
          'Moderne Hauptstadt, die Geschichte und Innovation verbindet',
      },
      wroclaw: {
        name: 'Breslau',
        description: 'Stadt der Brücken und charmanten Zwergenstatuen',
      },
      trojmiasto: {
        name: 'Dreistadt',
        description: 'Ostsee-Trio: Danzig, Sopot, Gdingen',
      },
    },

    // About section
    about: {
      title: 'Über das Projekt',
      paragraph1:
        'WTG Route Machine ist ein Open-Source-Projekt, das professionelle Routing-Funktionen für Stadtrundgänge bietet. Basierend auf OSRM (Open Source Routing Machine) bietet es schnelle und genaue Fußgängernavigation.',
      paragraph2:
        'Das Projekt umfasst ein leichtgewichtiges Backend, optimiert für AWS-Deployment, eine mobile App mit Ionic React und Capacitor, sowie ein Admin-Panel zur Verwaltung von Touren und Sehenswürdigkeiten.',
      paragraph3:
        'Unser Ziel ist es, die Stadtentdeckung für alle zugänglich und angenehm zu machen, ob Sie Tourist sind, der eine neue Stadt erkundet, oder Einheimischer, der versteckte Schätze sucht.',
      stats: {
        cities: 'Städte',
        tours: 'Touren',
        pois: 'POIs',
        openSource: 'Open Source',
      },
    },

    // Footer
    footer: {
      description:
        'Open-Source-Stadtspaziergang-Routing powered by OSRM. Von Entdeckern für Entdecker gebaut.',
      links: 'Links',
      project: 'Projekt',
      copyright: '© {{year}} WatchTheGuide. Open Source unter MIT-Lizenz.',
    },

    // Language names
    languages: {
      pl: 'Polski',
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      uk: 'Українська',
    },

    // Authentication
    auth: {
      login: {
        title: 'Anmelden',
        subtitle:
          'Geben Sie Ihre Anmeldedaten ein, um auf das Admin-Panel zuzugreifen',
        email: 'E-Mail',
        emailPlaceholder: 'admin@example.com',
        password: 'Passwort',
        passwordPlaceholder: 'Passwort eingeben',
        rememberMe: 'Angemeldet bleiben',
        forgotPassword: 'Passwort vergessen?',
        submit: 'Anmelden',
        signingIn: 'Anmeldung...',
        backToHome: 'Zurück zur Startseite',
        error: 'Ungültige E-Mail oder Passwort',
        demoCredentials: 'Demo-Anmeldedaten verwenden:',
      },
      logout: 'Abmelden',
      validation: {
        emailRequired: 'E-Mail ist erforderlich',
        emailInvalid: 'Ungültige E-Mail-Adresse',
        passwordRequired: 'Passwort ist erforderlich',
        passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      },
    },
  },
};

export default de;
