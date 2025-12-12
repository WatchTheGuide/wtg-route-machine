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
      clear: 'Leeren',
      remove: 'Entfernen',
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
        media: 'Medien',
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
      addTour: 'Tour hinzufügen',
      export: 'Exportieren',
      sortBy: 'Sortieren nach',
      showing: 'Anzeige {{from}}-{{to}} von {{total}}',
      selected: 'Ausgewählt: {{count}}',
      selectAll: 'Alle auswählen',
      selectTour: 'Tour auswählen: {{name}}',
      noResults: 'Keine Touren gefunden',
      bulkPublish: 'Veröffentlichen',
      bulkDelete: 'Ausgewählte löschen',
      filters: {
        title: 'Filter',
        clear: 'Filter löschen',
        searchPlaceholder: 'Touren suchen...',
        city: 'Stadt',
        allCities: 'Alle Städte',
        category: 'Kategorie',
        allCategories: 'Alle Kategorien',
        status: 'Status',
        allStatuses: 'Alle Status',
        difficulty: 'Schwierigkeit',
        allDifficulties: 'Alle Stufen',
      },
      table: {
        name: 'Name',
        city: 'Stadt',
        category: 'Kategorie',
        difficulty: 'Schwierigkeit',
        pois: 'POIs',
        views: 'Aufrufe',
        status: 'Status',
        actions: 'Aktionen',
      },
      sort: {
        updatedAt: 'Aktualisierungsdatum',
        createdAt: 'Erstellungsdatum',
        name: 'Name',
        views: 'Aufrufe',
        poisCount: 'POI-Anzahl',
      },
      categories: {
        historical: 'Historisch',
        cultural: 'Kulturell',
        nature: 'Natur',
        architecture: 'Architektur',
        religious: 'Religiös',
        nightlife: 'Nachtleben',
        urban: 'Städtisch',
      },
      status: {
        published: 'Veröffentlicht',
        draft: 'Entwurf',
        archived: 'Archiviert',
      },
      difficulty: {
        easy: 'Leicht',
        medium: 'Mittel',
        hard: 'Schwer',
      },
      actions: {
        menu: 'Aktionsmenü',
        preview: 'Vorschau',
        edit: 'Bearbeiten',
        duplicate: 'Duplizieren',
        delete: 'Löschen',
      },
      pagination: {
        perPage: 'Pro Seite',
        page: 'Seite {{current}} von {{total}}',
      },
      deleteDialog: {
        title: 'Möchten Sie wirklich löschen?',
        description:
          'Diese Aktion kann nicht rückgängig gemacht werden. Die Tour "{{name}}" wird dauerhaft gelöscht.',
      },
      // Toast messages
      deleteSuccess: 'Tour "{{name}}" wurde gelöscht',
      deleteError: 'Tour konnte nicht gelöscht werden',
      bulkDeleteSuccess: '{{count}} Touren gelöscht',
      bulkDeleteError: 'Touren konnten nicht gelöscht werden',
      bulkPublishSuccess: '{{count}} Touren veröffentlicht',
      bulkPublishError: 'Touren konnten nicht veröffentlicht werden',
      duplicateSuccess: 'Tour wurde dupliziert',
      duplicateError: 'Tour konnte nicht dupliziert werden',
      loadError: 'Touren konnten nicht geladen werden',
    },

    // Tour Editor
    tourEditor: {
      createTitle: 'Neue Tour',
      editTitle: 'Tour bearbeiten',
      lastSaved: 'Zuletzt gespeichert: {{time}}',
      unsavedChanges: 'Ungespeicherte Änderungen',
      autoSaved: 'Entwurf automatisch gespeichert',
      saved: 'Tour wurde gespeichert',
      published: 'Tour wurde veröffentlicht',
      deleted: 'Tour wurde gelöscht',
      saveError: 'Tour konnte nicht gespeichert werden',
      deleteError: 'Tour konnte nicht gelöscht werden',
      saveDraft: 'Entwurf speichern',
      publish: 'Veröffentlichen',
      previewButton: 'Vorschau',
      tabs: {
        basic: 'Grundinfo',
        media: 'Medien',
        details: 'Details',
        waypoints: 'Wegpunkte',
        pois: 'POIs',
        settings: 'Einstellungen',
      },
      basicInfo: {
        title: 'Grundlegende Informationen',
        description: 'Geben Sie grundlegende Tour-Informationen ein.',
      },
      media: {
        title: 'Fotos und Medien',
        description: 'Fügen Sie Fotos zur Tour hinzu.',
        dropzone: 'Fotos hierher ziehen oder klicken zum Durchsuchen',
        browse: 'Dateien durchsuchen',
        images: 'Bilder',
        hint: 'Wählen Sie Bilder aus der Medienbibliothek oder laden Sie neue hoch.',
      },
      details: {
        title: 'Tour-Details',
        description: 'Dauer und Tags festlegen.',
      },
      waypoints: {
        title: 'Wegpunkte',
        description: 'Definieren Sie Punkte auf der Tour-Route.',
        jsonNote:
          'Ein visueller Karten-Editor wird in Zukunft verfügbar sein. Geben Sie vorerst Wegpunkte als JSON ein.',
      },
      settings: {
        title: 'Veröffentlichungseinstellungen',
        description: 'Tour-Status und Sichtbarkeit verwalten.',
      },
      fields: {
        name: 'Tour-Name',
        description: 'Beschreibung',
        city: 'Stadt',
        category: 'Kategorie',
        difficulty: 'Schwierigkeit',
        duration: 'Dauer',
        tags: 'Tags',
        waypointsJson: 'Wegpunkte (JSON)',
        status: 'Status',
        featured: 'Empfohlene Tour',
      },
      placeholders: {
        name: 'Z.B. Königsweg',
        description: 'Beschreiben Sie die Tour...',
        city: 'Stadt auswählen',
        category: 'Kategorie auswählen',
        tags: 'Tag eingeben und Enter drücken',
        waypoints:
          '[\n  {\n    "id": "1",\n    "name": "Startpunkt",\n    "coordinates": [19.9373, 50.0619],\n    "order": 1\n  }\n]',
      },
      hints: {
        name: '5 bis 100 Zeichen',
        description: '{{current}}/{{max}} Zeichen (min. {{min}})',
        descriptionLocalized:
          'Geben Sie die Beschreibung in mindestens 2 Sprachen ein (Polnisch und Englisch sind erforderlich)',
        duration:
          'Schieberegler ziehen, um die geschätzte Tour-Dauer festzulegen',
        tags: 'Enter drücken, um ein Tag hinzuzufügen. Tag anklicken, um es zu entfernen.',
        waypoints:
          'JSON-Format mit Array von Wegpunkten. Jeder Punkt benötigt id, name, coordinates und order.',
        status:
          'Entwürfe sind für Benutzer nicht sichtbar. Veröffentlichte Touren sind in der App verfügbar.',
        featured: 'Empfohlene Touren werden auf der Startseite beworben.',
      },
      validation: {
        nameMin: 'Name muss mindestens 5 Zeichen haben',
        nameMax: 'Name kann maximal 100 Zeichen haben',
        descriptionMin: 'Beschreibung muss mindestens 50 Zeichen haben',
        descriptionMax: 'Beschreibung kann maximal 2000 Zeichen haben',
        cityRequired: 'Bitte wählen Sie eine Stadt',
        categoryRequired: 'Bitte wählen Sie eine Kategorie',
        plRequired: 'Polnische Version ist erforderlich',
        enRequired: 'Englische Version ist erforderlich',
      },
      preview: {
        title: 'Vorschau',
        description: 'Echtzeit-Tour-Vorschau',
        mapPlaceholder: 'Routenkarte wird hier angezeigt',
        city: 'Stadt',
        category: 'Kategorie',
        duration: 'Dauer',
        status: 'Status',
      },
      exitDialog: {
        title: 'Ungespeicherte Änderungen',
        description:
          'Sie haben ungespeicherte Änderungen. Möchten Sie die Seite wirklich ohne Speichern verlassen?',
        confirm: 'Ohne Speichern verlassen',
      },
    },

    // POIs page
    pois: {
      title: 'Sehenswürdigkeiten',
      subtitle: 'Touristische Sehenswürdigkeiten verwalten',
      listTitle: 'POI-Liste',
      addPoi: 'POI hinzufügen',
      editPoi: 'POI bearbeiten',
      export: 'Exportieren',
      exported: 'POIs wurden exportiert',
      showing: 'Zeige {{from}}-{{to}} von {{total}}',
      selected: 'Ausgewählt: {{count}}',
      selectAll: 'Alle auswählen',
      selectPoi: 'POI auswählen: {{name}}',
      noResults: 'Keine POIs gefunden',
      deleted: 'POI wurde gelöscht',
      bulkDelete: 'Ausgewählte löschen',
      bulkDeleted: '{{count}} POIs gelöscht',
      loadError: 'Fehler beim Laden der POIs',
      stats: {
        total: 'Gesamt POIs',
      },
      table: {
        name: 'Name',
        city: 'Stadt',
        category: 'Kategorie',
        coordinates: 'Koordinaten',
        actions: 'Aktionen',
      },
      filters: {
        city: 'Stadt',
        selectCity: 'Stadt auswählen',
        category: 'Kategorie',
        allCities: 'Alle Städte',
        allCategories: 'Alle Kategorien',
        searchPlaceholder: 'POI suchen...',
        clear: 'Filter löschen',
      },
      actions: {
        menu: 'Aktionsmenü',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        viewOnMap: 'Auf Karte anzeigen',
      },
      pagination: {
        perPage: 'Pro Seite',
        page: 'Seite {{current}} von {{total}}',
      },
      deleteDialog: {
        title: 'Möchten Sie wirklich löschen?',
        description:
          'Diese Aktion kann nicht rückgängig gemacht werden. POI "{{name}}" wird dauerhaft gelöscht.',
      },
      bulkDeleteDialog: {
        title: 'Möchten Sie die ausgewählten POIs wirklich löschen?',
        description:
          'Diese Aktion kann nicht rückgängig gemacht werden. {{count}} POIs werden dauerhaft gelöscht.',
      },
      categories: {
        landmark: 'Wahrzeichen',
        museum: 'Museum',
        park: 'Park',
        restaurant: 'Restaurant',
        viewpoint: 'Aussichtspunkt',
        church: 'Kirche',
      },
      editor: {
        createTitle: 'Neuer POI',
        editTitle: 'POI bearbeiten',
        createDescription: 'Neue Sehenswürdigkeit hinzufügen',
        editDescription: 'Sehenswürdigkeitsinformationen bearbeiten',
        name: 'Name',
        namePlaceholder: 'Z.B. Tuchhallen',
        description: 'Beschreibung',
        descriptionPlaceholder: 'Beschreiben Sie die Sehenswürdigkeit...',
        longitude: 'Längengrad',
        latitude: 'Breitengrad',
        address: 'Adresse',
        addressPlaceholder: 'Z.B. Hauptmarkt 1',
        website: 'Website',
        openingHours: 'Öffnungszeiten',
        openingHoursPlaceholder: 'Z.B. 10:00-18:00',
        estimatedTime: 'Geschätzte Zeit',
        tags: 'Tags',
        tagsPlaceholder: 'Tags durch Kommas getrennt eingeben',
        created: 'POI wurde erstellt',
        updated: 'POI wurde aktualisiert',
        validation: {
          required: 'Name und Beschreibung sind erforderlich',
        },
      },
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

    // Map Editor
    mapEditor: {
      title: 'Karteneditor',
      newWaypoint: 'Punkt {{number}}',
      importedWaypoint: 'Importiert {{number}}',
      routeCalculated: 'Route berechnet',
      layers: {
        streets: 'Straßen',
        satellite: 'Satellit',
        terrain: 'Gelände',
      },
      addWaypoint: 'Wegpunkt hinzufügen',
      deleteWaypoint: 'Ausgewählten Wegpunkt löschen',
      fitToWaypoints: 'Auf Wegpunkte anpassen',
      clickToAdd: 'Klicken Sie auf die Karte, um einen Wegpunkt hinzuzufügen',
      calculateRoute: 'Route berechnen',
      import: 'Importieren',
      export: 'Exportieren',
    },

    // Waypoints List
    waypointsList: {
      title: 'Wegpunkte',
      empty: 'Keine Wegpunkte',
      emptyHint:
        'Klicken Sie auf die Karte oder verwenden Sie "Wegpunkt hinzufügen", um den ersten Wegpunkt hinzuzufügen.',
      name: 'Name',
      description: 'Beschreibung',
      stopDuration: 'Aufenthaltsdauer',
      minutes: 'Minuten',
      coordinates: 'Koordinaten',
      actions: 'Aktionen',
      calculateRoute: 'Route berechnen',
      import: 'Importieren',
      export: 'Exportieren',
      importedWaypoint: 'Importiert {{number}}',
    },

    // Tour POI Selector
    tourPOI: {
      mapTitle: 'POI-Karte',
      selectedPOIs: 'Ausgewählte POIs',
      availablePOIs: 'Verfügbare POIs',
      noSelectedPOIs:
        'Keine POIs ausgewählt. Klicken Sie auf die Karte oder Liste zum Hinzufügen.',
      noPOIs: 'Keine POIs für diese Stadt',
      noResults: 'Keine Ergebnisse für die angegebenen Filter',
      searchPlaceholder: 'POIs suchen...',
      filterByCategory: 'Nach Kategorie filtern',
      clearFilters: 'Filter löschen',
      clickToAdd: 'Klicken Sie, um POI zur Tour hinzuzufügen',
      add: 'Hinzufügen',
      remove: 'Entfernen',
      suggestPOIs: 'POIs vorschlagen',
      suggestPOIsHint: 'Automatisch POIs in der Nähe der Route hinzufügen',
      fromRoute: 'von Route',
      selectCityFirst:
        'Wählen Sie zuerst eine Stadt aus, um verfügbare POIs zu sehen',
      loadError: 'POIs konnten nicht geladen werden',
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
      errors: {
        invalidCredentials: 'Ungültige E-Mail oder Passwort',
        networkError: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
        tooManyAttempts: 'Zu viele Anmeldeversuche. Bitte warten Sie.',
        sessionExpired: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.',
      },
      validation: {
        emailRequired: 'E-Mail ist erforderlich',
        emailInvalid: 'Ungültige E-Mail-Adresse',
        passwordRequired: 'Passwort ist erforderlich',
        passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      },
    },

    // Media Manager
    media: {
      title: 'Medienbibliothek',
      subtitle: 'Bilder und Mediendateien verwalten',
      upload: 'Bilder Hochladen',
      search: 'Medien suchen...',
      filters: 'Filter',
      noResults: 'Keine Medien gefunden',
      noResultsDesc: 'Bilder hochladen, um zu beginnen',
      selectImages: 'Bilder auswählen oder hierher ziehen',
      dropHere: 'Dateien hier ablegen',
      maxFileSize: 'Max. Dateigröße: {{size}} pro Bild',
      maxFiles: 'Maximal {{max}} Dateien gleichzeitig',
      uploadSuccess: '{{count}} Bilder erfolgreich hochgeladen',
      uploadError: 'Upload fehlgeschlagen',
      deleteConfirm:
        'Dieses Bild löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      deleteSuccess: 'Bild gelöscht',
      deleteError: 'Löschen fehlgeschlagen',
      updateSuccess: 'Bild aktualisiert',
      updateError: 'Aktualisierung fehlgeschlagen',
      editMetadata: 'Metadaten Bearbeiten',
      imageDetails: 'Bilddetails',
      dimensions: 'Abmessungen',
      fileSize: 'Dateigröße',
      uploadedAt: 'Hochgeladen',
      tags: 'Tags',
      imageTitle: 'Titel',
      titlePlaceholder: 'Bildtitel eingeben',
      altText: 'Alternativtext',
      altTextPlaceholder: 'Bild für Barrierefreiheit beschreiben',
      tagsPlaceholder: 'stadt, sehenswürdigkeit, architektur',
      tagsHelp: 'Tags mit Kommas trennen',
      contextType: 'Kontext',
      standalone: 'Eigenständig',
      tourImages: 'Tour-Bilder',
      poiImages: 'POI-Bilder',
      allMedia: 'Alle Medien',
      usedIn: 'Verwendet in',
      filename: 'Dateiname',
      tour: 'Tour',
      poi: 'POI',
      uploading: 'Wird hochgeladen...',
      uploadFiles: '{{count}} Dateien hochladen',
      noFilesSelected: 'Keine Dateien ausgewählt',
      fileTooLarge: '{{name}} ist zu groß. Maximum {{max}}',
      tooManyFiles: 'Zu viele Dateien. Maximal {{max}} gleichzeitig',
      selected: '{{count}} ausgewählt',
      uploadFirst: 'Laden Sie Ihr erstes Bild hoch',
      totalMedia: '{{count}} Mediendateien',
      showing: '{{count}} Ergebnisse angezeigt',
      sortByDate: 'Nach Datum sortieren',
      sortByTitle: 'Nach Titel sortieren',
      sortBySize: 'Nach Größe sortieren',
    },

    // Media Picker (Tour Media)
    mediaPicker: {
      selectedTitle: 'Ausgewählte Bilder',
      selectedCount: '({{count}}/{{max}})',
      clearAll: 'Alle löschen',
      emptySelected: 'Keine Bilder ausgewählt',
      emptySelectedHint:
        'Klicken Sie auf ein Bild in der Bibliothek unten, um es hinzuzufügen',
      libraryTitle: 'Medienbibliothek',
      searchPlaceholder: 'Nach Namen suchen...',
      filterAll: 'Alle',
      filterUnused: 'Nicht zugewiesen',
      addToTour: 'Zur Tour hinzufügen',
      removeFromTour: 'Von Tour entfernen',
      setAsPrimary: 'Als Hauptbild festlegen',
      isPrimary: 'Hauptbild',
      alreadySelected: 'Ausgewählt',
      maxLimitReached: 'Limit von {{max}} Bildern erreicht',
      dndHint: 'Karten ziehen, um die Reihenfolge zu ändern',
      toasts: {
        added: '"{{name}}" zur Tour hinzugefügt',
        removed: '"{{name}}" von Tour entfernt',
        clearedAll: 'Alle Bilder entfernt',
        setPrimary: '"{{name}}" als Hauptbild festgelegt',
        reordered: 'Bildreihenfolge geändert',
      },
    },

    // Language Tabs
    languageTabs: {
      languages: {
        pl: 'Polski',
        en: 'English',
        de: 'Deutsch',
        fr: 'Français',
        uk: 'Українська',
      },
      required: 'Erforderlich',
      optional: 'Optional',
      copyFromPolish: 'Aus Polnisch kopieren',
      copied: 'In leere Felder kopiert',
      completeness: 'Übersetzungsvollständigkeit',
      complete: 'Vollständig',
      incomplete: 'Unvollständig',
      fillRequired: 'Pflichtfelder ausfüllen (PL, EN)',
    },
  },
};

export default de;
