// Polish translations (default)
const pl = {
  translation: {
    // Common
    common: {
      loading: 'Ładowanie...',
      error: 'Wystąpił błąd',
      cancel: 'Anuluj',
      save: 'Zapisz',
      delete: 'Usuń',
      edit: 'Edytuj',
      close: 'Zamknij',
      search: 'Szukaj',
      back: 'Wróć',
      comingSoon: 'Wkrótce dostępne...',
      clear: 'Wyczyść',
      remove: 'Usuń',
    },

    // Dashboard
    dashboard: {
      title: 'Panel administracyjny',
      subtitle: 'Zarządzaj wycieczkami i punktami POI',
      allCities: 'Wszystkie miasta',
      selectCity: 'Wybierz miasto',
      nav: {
        dashboard: 'Dashboard',
        tours: 'Wycieczki',
        pois: 'Punkty POI',
        media: 'Media',
        settings: 'Ustawienia',
        logout: 'Wyloguj',
      },
      stats: {
        tours: 'Wycieczki',
        pois: 'Punkty POI',
        cities: 'Miasta',
        views: 'Wyświetlenia',
        thisMonth: 'w tym miesiącu',
        active: 'Aktywne',
        total: 'Łącznie',
        fromLastMonth: 'od ostatniego miesiąca',
      },
      citySelector: {
        label: 'Miasto',
        all: 'Wszystkie miasta',
        placeholder: 'Wybierz miasto',
      },
      charts: {
        toursOverTime: 'Wycieczki w czasie',
        toursOverTimeDesc: 'Liczba wycieczek i POI dodanych w każdym miesiącu',
        toursByCity: 'Wycieczki wg miasta',
        toursByCityDesc: 'Wyświetlenia wg miasta',
        viewsPerCity: 'Wyświetlenia wg miasta',
        viewsPerCityDesc: 'Całkowita liczba wyświetleń dla każdego miasta',
      },
      quickActions: {
        title: 'Szybkie akcje',
        addTour: 'Dodaj wycieczkę',
        addPoi: 'Dodaj POI',
        viewStats: 'Zobacz statystyki',
        managePois: 'Zarządzaj POI',
        viewReports: 'Zobacz raporty',
        analytics: 'Analityka',
      },
      topTours: {
        title: 'Najpopularniejsze wycieczki',
        subtitle: 'Najczęściej wyświetlane wycieczki',
        views: 'Wyświetlenia',
      },
      status: {
        published: 'Opublikowana',
        draft: 'Szkic',
      },
      recentTours: {
        title: 'Ostatnie wycieczki',
        subtitle: 'Ostatnio dodane i edytowane wycieczki',
        name: 'Nazwa',
        city: 'Miasto',
        status: 'Status',
      },
      activity: {
        title: 'Ostatnia aktywność',
        subtitle: 'Historia zmian w systemie',
        created: 'utworzył',
        updated: 'zaktualizował',
        published: 'opublikował',
        deleted: 'usunął',
      },
    },

    // Tours page
    tours: {
      title: 'Wycieczki',
      subtitle: 'Zarządzaj kuratorowanymi wycieczkami',
      listTitle: 'Lista wycieczek',
      addTour: 'Dodaj wycieczkę',
      export: 'Eksportuj',
      sortBy: 'Sortuj wg',
      showing: 'Wyświetlanie {{from}}-{{to}} z {{total}}',
      selected: 'Wybrano: {{count}}',
      selectAll: 'Zaznacz wszystkie',
      selectTour: 'Zaznacz wycieczkę: {{name}}',
      noResults: 'Nie znaleziono wycieczek',
      bulkPublish: 'Opublikuj',
      bulkDelete: 'Usuń wybrane',
      filters: {
        title: 'Filtry',
        clear: 'Wyczyść filtry',
        searchPlaceholder: 'Szukaj wycieczek...',
        city: 'Miasto',
        allCities: 'Wszystkie miasta',
        category: 'Kategoria',
        allCategories: 'Wszystkie kategorie',
        status: 'Status',
        allStatuses: 'Wszystkie statusy',
        difficulty: 'Trudność',
        allDifficulties: 'Wszystkie poziomy',
      },
      table: {
        name: 'Nazwa',
        city: 'Miasto',
        category: 'Kategoria',
        difficulty: 'Trudność',
        pois: 'POI',
        views: 'Wyświetlenia',
        status: 'Status',
        actions: 'Akcje',
      },
      sort: {
        updatedAt: 'Data aktualizacji',
        createdAt: 'Data utworzenia',
        name: 'Nazwa',
        views: 'Wyświetlenia',
        poisCount: 'Liczba POI',
      },
      categories: {
        history: 'Historia',
        historical: 'Historyczne',
        cultural: 'Kulturalne',
        nature: 'Przyroda',
        architecture: 'Architektura',
        religious: 'Religijne',
        nightlife: 'Życie nocne',
        urban: 'Miejskie',
        food: 'Jedzenie i gastronomia',
        art: 'Sztuka i kultura',
      },
      status: {
        published: 'Opublikowana',
        draft: 'Szkic',
        archived: 'Zarchiwizowana',
      },
      difficulty: {
        easy: 'Łatwa',
        medium: 'Średnia',
        hard: 'Trudna',
      },
      actions: {
        menu: 'Menu akcji',
        preview: 'Podgląd',
        edit: 'Edytuj',
        duplicate: 'Duplikuj',
        delete: 'Usuń',
      },
      pagination: {
        perPage: 'Na stronę',
        page: 'Strona {{current}} z {{total}}',
      },
      deleteDialog: {
        title: 'Czy na pewno chcesz usunąć?',
        description:
          'Ta operacja jest nieodwracalna. Wycieczka "{{name}}" zostanie trwale usunięta.',
      },
    },

    // Tour Editor
    tourEditor: {
      createTitle: 'Nowa wycieczka',
      editTitle: 'Edycja wycieczki',
      lastSaved: 'Ostatnio zapisano: {{time}}',
      unsavedChanges: 'Niezapisane zmiany',
      autoSaved: 'Zapisano szkic automatycznie',
      saved: 'Wycieczka została zapisana',
      published: 'Wycieczka została opublikowana',
      deleted: 'Wycieczka została usunięta',
      saveDraft: 'Zapisz szkic',
      publish: 'Opublikuj',
      previewButton: 'Podgląd',
      tabs: {
        basic: 'Podstawowe',
        media: 'Media',
        details: 'Szczegóły',
        waypoints: 'Punkty trasy',
        pois: 'POI',
        settings: 'Ustawienia',
      },
      basicInfo: {
        title: 'Podstawowe informacje',
        description: 'Wprowadź podstawowe dane wycieczki.',
      },
      media: {
        title: 'Zdjęcia i media',
        description: 'Dodaj zdjęcia do wycieczki.',
        dropzone: 'Przeciągnij i upuść zdjęcia tutaj lub kliknij, aby wybrać',
        browse: 'Wybierz pliki',
        images: 'Obrazy',
        hint: 'Wybierz obrazy z biblioteki mediów lub prześlij nowe.',
      },
      details: {
        title: 'Szczegóły wycieczki',
        description: 'Ustaw czas trwania i tagi.',
      },
      waypoints: {
        title: 'Punkty trasy',
        description: 'Zdefiniuj punkty na trasie wycieczki.',
        jsonNote:
          'W przyszłości będzie dostępny wizualny edytor mapy. Na razie wprowadź waypoints jako JSON.',
      },
      settings: {
        title: 'Ustawienia publikacji',
        description: 'Zarządzaj statusem i widocznością wycieczki.',
      },
      fields: {
        name: 'Nazwa wycieczki',
        description: 'Opis',
        city: 'Miasto',
        category: 'Kategoria',
        difficulty: 'Trudność',
        duration: 'Czas trwania',
        tags: 'Tagi',
        waypointsJson: 'Punkty trasy (JSON)',
        status: 'Status',
        featured: 'Wyróżniona wycieczka',
      },
      placeholders: {
        name: 'Np. Droga Królewska',
        description: 'Opisz wycieczkę...',
        city: 'Wybierz miasto',
        category: 'Wybierz kategorię',
        tags: 'Wpisz tag i naciśnij Enter',
        waypoints:
          '[\n  {\n    "id": "1",\n    "name": "Punkt startowy",\n    "coordinates": [19.9373, 50.0619],\n    "order": 1\n  }\n]',
      },
      hints: {
        name: 'Od 5 do 100 znaków',
        description: '{{current}}/{{max}} znaków (min. {{min}})',
        descriptionLocalized:
          'Wprowadź opis w co najmniej 2 językach (polski i angielski są wymagane)',
        duration: 'Przeciągnij suwak, aby ustawić szacowany czas wycieczki',
        tags: 'Naciśnij Enter, aby dodać tag. Kliknij tag, aby go usunąć.',
        waypoints:
          'Format JSON z tablicą punktów trasy. Każdy punkt wymaga id, name, coordinates i order.',
        status:
          'Szkic nie jest widoczny dla użytkowników. Opublikowana wycieczka jest dostępna w aplikacji.',
        featured: 'Wyróżnione wycieczki są promowane na stronie głównej.',
      },
      validation: {
        nameMin: 'Nazwa musi mieć co najmniej 5 znaków',
        nameMax: 'Nazwa może mieć maksymalnie 100 znaków',
        descriptionMin: 'Opis musi mieć co najmniej 50 znaków',
        descriptionMax: 'Opis może mieć maksymalnie 2000 znaków',
        cityRequired: 'Wybierz miasto',
        categoryRequired: 'Wybierz kategorię',
        plRequired: 'Wersja polska jest wymagana',
        enRequired: 'Wersja angielska jest wymagana',
      },
      preview: {
        title: 'Podgląd',
        description: 'Podgląd wycieczki w czasie rzeczywistym',
        mapPlaceholder: 'Mapa z trasą pojawi się tutaj',
        city: 'Miasto',
        category: 'Kategoria',
        duration: 'Czas trwania',
        status: 'Status',
      },
      exitDialog: {
        title: 'Niezapisane zmiany',
        description:
          'Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę bez zapisywania?',
        confirm: 'Opuść bez zapisywania',
      },
    },

    // POIs page
    pois: {
      title: 'Punkty POI',
      subtitle: 'Zarządzaj punktami turystycznymi',
      listTitle: 'Lista punktów POI',
      addPoi: 'Dodaj POI',
      editPoi: 'Edytuj POI',
      deletePoi: 'Usuń POI',
      export: 'Eksportuj',
      exported: 'POI zostały wyeksportowane',
      showing: 'Wyświetlanie {{from}}-{{to}} z {{total}}',
      selected: 'Wybrano: {{count}}',
      selectAll: 'Zaznacz wszystkie',
      selectPoi: 'Zaznacz POI: {{name}}',
      noResults: 'Nie znaleziono POI',
      deleted: 'POI został usunięty',
      bulkDelete: 'Usuń wybrane',
      bulkDeleted: 'Usunięto {{count}} POI',
      loadError: 'Błąd ładowania POI',
      stats: {
        total: 'Łączna liczba POI',
      },
      table: {
        name: 'Nazwa',
        city: 'Miasto',
        category: 'Kategoria',
        coordinates: 'Współrzędne',
        actions: 'Akcje',
      },
      filters: {
        city: 'Miasto',
        selectCity: 'Wybierz miasto',
        category: 'Kategoria',
        allCities: 'Wszystkie miasta',
        allCategories: 'Wszystkie kategorie',
        searchPlaceholder: 'Szukaj POI...',
        clear: 'Wyczyść filtry',
      },
      actions: {
        menu: 'Menu akcji',
        edit: 'Edytuj',
        delete: 'Usuń',
        viewOnMap: 'Zobacz na mapie',
      },
      pagination: {
        perPage: 'Na stronę',
        page: 'Strona {{current}} z {{total}}',
      },
      deleteDialog: {
        title: 'Czy na pewno chcesz usunąć?',
        description:
          'Ta operacja jest nieodwracalna. POI "{{name}}" zostanie trwale usunięty.',
      },
      bulkDeleteDialog: {
        title: 'Czy na pewno chcesz usunąć wybrane POI?',
        description:
          'Ta operacja jest nieodwracalna. {{count}} POI zostanie trwale usuniętych.',
      },
      categories: {
        landmark: 'Punkt orientacyjny',
        museum: 'Muzeum',
        park: 'Park',
        restaurant: 'Restauracja',
        viewpoint: 'Punkt widokowy',
        church: 'Kościół',
      },
      editor: {
        createTitle: 'Nowy POI',
        editTitle: 'Edycja POI',
        createDescription: 'Dodaj nowy punkt turystyczny',
        editDescription: 'Edytuj informacje o punkcie turystycznym',
        name: 'Nazwa',
        namePlaceholder: 'Np. Sukiennice',
        description: 'Opis',
        descriptionPlaceholder: 'Opisz punkt turystyczny...',
        longitude: 'Długość geograficzna',
        latitude: 'Szerokość geograficzna',
        address: 'Adres',
        addressPlaceholder: 'Np. Rynek Główny 1',
        website: 'Strona WWW',
        openingHours: 'Godziny otwarcia',
        openingHoursPlaceholder: 'Np. 10:00-18:00',
        estimatedTime: 'Szacowany czas',
        tags: 'Tagi',
        tagsPlaceholder: 'Wpisz tagi oddzielone przecinkami',
        created: 'POI został utworzony',
        updated: 'POI został zaktualizowany',
        validation: {
          required: 'Nazwa i opis są wymagane',
        },
      },
    },

    // Settings page
    settings: {
      title: 'Ustawienia',
      subtitle: 'Konfiguracja panelu administracyjnego',
      generalTitle: 'Ustawienia ogólne',
    },

    // Navbar
    nav: {
      features: 'Funkcje',
      cities: 'Miasta',
      about: 'O projekcie',
      adminPanel: 'Panel Admin',
    },

    // Hero section
    hero: {
      badge: 'Routing Open Source',
      title: 'Spacery po miastach',
      titleHighlight: 'bez komplikacji',
      description:
        'Lekki routing oparty na OSRM do nawigacji pieszej. Odkrywaj trasy spacerowe po polskich miastach z optymalizowanymi trasami i punktami POI.',
      exploreCities: 'Odkryj miasta',
      viewOnGithub: 'Zobacz na GitHub',
    },

    // Features section
    features: {
      title: 'Potężne funkcje',
      subtitle:
        'Zbudowane z nowoczesnych technologii dla najlepszych doświadczeń.',
      pedestrianRouting: {
        title: 'Routing pieszy',
        description:
          'Zoptymalizowane profile do spacerów z dokładnym czasem i dystansem.',
      },
      poi: {
        title: 'Punkty POI',
        description:
          'Kuratorowana baza POI z zabytkami, muzeami, restauracjami i ukrytymi perełkami.',
      },
      mobile: {
        title: 'Aplikacja mobilna',
        description:
          'Aplikacja Ionic React z obsługą offline i nawigacją krok po kroku.',
      },
      multiCity: {
        title: 'Wiele miast',
        description:
          'Skalowalna architektura obsługująca wiele miast z indywidualnymi silnikami.',
      },
    },

    // Cities section
    cities: {
      title: 'Odkryj miasta',
      subtitle: 'Znajdź trasy spacerowe w najpiękniejszych polskich miastach.',
      toursAvailable: '{{count}} wycieczek dostępnych',
      krakow: {
        name: 'Kraków',
        description: 'Historyczna stolica królewska z wspaniałą architekturą',
      },
      warszawa: {
        name: 'Warszawa',
        description: 'Nowoczesna stolica łącząca historię z innowacją',
      },
      wroclaw: {
        name: 'Wrocław',
        description: 'Miasto mostów i uroczych krasnali',
      },
      trojmiasto: {
        name: 'Trójmiasto',
        description: 'Trio nad Bałtykiem: Gdańsk, Sopot, Gdynia',
      },
    },

    // About section
    about: {
      title: 'O projekcie',
      paragraph1:
        'WTG Route Machine to projekt open-source, który oferuje profesjonalne możliwości routingu dla miejskich spacerów. Zbudowany na OSRM (Open Source Routing Machine), zapewnia szybką i dokładną nawigację pieszą.',
      paragraph2:
        'Projekt obejmuje lekki backend zoptymalizowany pod AWS, aplikację mobilną zbudowaną z Ionic React i Capacitor, oraz panel administracyjny do zarządzania wycieczkami i punktami POI.',
      paragraph3:
        'Naszym celem jest udostępnienie eksploracji miejskiej każdemu - czy jesteś turystą odkrywającym nowe miasto, czy lokalnym mieszkańcem szukającym ukrytych perełek.',
      stats: {
        cities: 'Miasta',
        tours: 'Wycieczki',
        pois: 'Punkty POI',
        openSource: 'Open Source',
      },
    },

    // Map Editor
    mapEditor: {
      title: 'Edytor mapy',
      newWaypoint: 'Punkt {{number}}',
      importedWaypoint: 'Importowany {{number}}',
      routeCalculated: 'Trasa obliczona',
      layers: {
        streets: 'Ulice',
        satellite: 'Satelita',
        terrain: 'Teren',
      },
      addWaypoint: 'Dodaj punkt',
      deleteWaypoint: 'Usuń zaznaczony punkt',
      fitToWaypoints: 'Dopasuj do punktów',
      clickToAdd: 'Kliknij na mapę, aby dodać punkt',
      calculateRoute: 'Oblicz trasę',
      import: 'Importuj',
      export: 'Eksportuj',
    },

    // Waypoints List
    waypointsList: {
      title: 'Punkty trasy',
      empty: 'Brak punktów trasy',
      emptyHint:
        'Kliknij na mapę lub użyj przycisku "Dodaj punkt", aby dodać pierwszy punkt.',
      name: 'Nazwa',
      description: 'Opis',
      stopDuration: 'Czas postoju',
      minutes: 'minut',
      coordinates: 'Współrzędne',
      actions: 'Akcje',
      calculateRoute: 'Oblicz trasę',
      import: 'Importuj',
      export: 'Eksportuj',
      importedWaypoint: 'Importowany {{number}}',
    },

    // Tour POI Selector
    tourPOI: {
      mapTitle: 'Mapa POI',
      selectedPOIs: 'Wybrane POI',
      availablePOIs: 'Dostępne POI',
      noSelectedPOIs:
        'Nie wybrano żadnych POI. Kliknij na mapę lub listę, aby dodać.',
      noPOIs: 'Brak POI dla tego miasta',
      noResults: 'Brak wyników dla podanych filtrów',
      searchPlaceholder: 'Szukaj POI...',
      filterByCategory: 'Filtruj wg kategorii',
      clearFilters: 'Wyczyść filtry',
      clickToAdd: 'Kliknij, aby dodać POI do wycieczki',
      add: 'Dodaj',
      remove: 'Usuń',
      suggestPOIs: 'Sugeruj POI',
      suggestPOIsHint: 'Automatycznie dodaj POI w pobliżu trasy',
      fromRoute: 'od trasy',
      selectCityFirst: 'Najpierw wybierz miasto, aby zobaczyć dostępne POI',
      loadError: 'Nie udało się załadować POI',
    },

    // Footer
    footer: {
      description:
        'Routing spacerów miejskich open-source napędzany przez OSRM. Zbudowane dla odkrywców, przez odkrywców.',
      links: 'Linki',
      project: 'Projekt',
      copyright: '© {{year}} WatchTheGuide. Open source na licencji MIT.',
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
        title: 'Zaloguj się',
        subtitle:
          'Wprowadź dane logowania, aby uzyskać dostęp do panelu administracyjnego',
        email: 'Email',
        emailPlaceholder: 'admin@example.com',
        password: 'Hasło',
        passwordPlaceholder: 'Wprowadź hasło',
        rememberMe: 'Zapamiętaj mnie',
        forgotPassword: 'Zapomniałeś hasła?',
        submit: 'Zaloguj się',
        signingIn: 'Logowanie...',
        backToHome: 'Powrót do strony głównej',
        error: 'Nieprawidłowy email lub hasło',
        demoCredentials: 'Użyj testowych danych logowania:',
      },
      logout: 'Wyloguj',
      errors: {
        invalidCredentials: 'Nieprawidłowy email lub hasło',
        networkError: 'Błąd połączenia. Spróbuj ponownie.',
        tooManyAttempts: 'Zbyt wiele prób logowania. Spróbuj za chwilę.',
        sessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
      },
      validation: {
        emailRequired: 'Email jest wymagany',
        emailInvalid: 'Nieprawidłowy adres email',
        passwordRequired: 'Hasło jest wymagane',
        passwordMinLength: 'Hasło musi mieć co najmniej 6 znaków',
      },
    },

    // Media Manager
    media: {
      title: 'Biblioteka Mediów',
      subtitle: 'Zarządzaj obrazami i plikami multimedialnymi',
      upload: 'Prześlij Obrazy',
      search: 'Szukaj mediów...',
      filters: 'Filtry',
      noResults: 'Nie znaleziono mediów',
      noResultsDesc: 'Prześlij obrazy, aby rozpocząć',
      selectImages: 'Wybierz obrazy lub przeciągnij i upuść',
      dropHere: 'Upuść pliki tutaj',
      maxFileSize: 'Maks. rozmiar pliku: {{size}} na obraz',
      maxFiles: 'Maksymalnie {{max}} plików jednocześnie',
      uploadSuccess: 'Przesłano {{count}} obrazów pomyślnie',
      uploadError: 'Przesyłanie nie powiodło się',
      deleteConfirm: 'Usunąć ten obraz? Tej akcji nie można cofnąć.',
      deleteSuccess: 'Obraz usunięty',
      deleteError: 'Usuwanie nie powiodło się',
      updateSuccess: 'Obraz zaktualizowany',
      updateError: 'Aktualizacja nie powiodła się',
      editMetadata: 'Edytuj Metadane',
      imageDetails: 'Szczegóły Obrazu',
      dimensions: 'Wymiary',
      fileSize: 'Rozmiar Pliku',
      uploadedAt: 'Przesłano',
      tags: 'Tagi',
      imageTitle: 'Tytuł',
      titlePlaceholder: 'Wprowadź tytuł obrazu',
      altText: 'Tekst Alternatywny',
      altTextPlaceholder: 'Opisz obraz dla dostępności',
      tagsPlaceholder: 'miasto, zabytek, architektura',
      tagsHelp: 'Oddziel tagi przecinkami',
      contextType: 'Kontekst',
      standalone: 'Samodzielny',
      tourImages: 'Obrazy Wycieczek',
      poiImages: 'Obrazy POI',
      allMedia: 'Wszystkie Media',
      usedIn: 'Użyte w',
      filename: 'Nazwa Pliku',
      tour: 'Wycieczka',
      poi: 'POI',
      uploading: 'Przesyłanie...',
      uploadFiles: 'Prześlij {{count}} plików',
      noFilesSelected: 'Nie wybrano plików',
      fileTooLarge: '{{name}} jest za duży. Maksymalnie {{max}}',
      tooManyFiles: 'Za dużo plików. Maksymalnie {{max}} jednocześnie',
      selected: 'Wybrano {{count}}',
      uploadFirst: 'Prześlij swój pierwszy obraz',
      totalMedia: '{{count}} plików multimedialnych',
      showing: 'Pokazano {{count}} wyników',
      sortByDate: 'Sortuj według Daty',
      sortByTitle: 'Sortuj według Tytułu',
      sortBySize: 'Sortuj według Rozmiaru',
    },

    // Media Picker (Tour Media)
    mediaPicker: {
      selectedTitle: 'Wybrane zdjęcia',
      selectedCount: '({{count}}/{{max}})',
      clearAll: 'Wyczyść wszystkie',
      emptySelected: 'Brak wybranych zdjęć',
      emptySelectedHint:
        'Kliknij na zdjęcie w bibliotece poniżej, aby je dodać',
      libraryTitle: 'Biblioteka mediów',
      searchPlaceholder: 'Szukaj po nazwie...',
      filterAll: 'Wszystkie',
      filterUnused: 'Nieprzypisane',
      addToTour: 'Dodaj do wycieczki',
      removeFromTour: 'Usuń z wycieczki',
      setAsPrimary: 'Ustaw jako główne',
      isPrimary: 'Zdjęcie główne',
      alreadySelected: 'Wybrane',
      maxLimitReached: 'Osiągnięto limit {{max}} zdjęć',
      dndHint: 'Przeciągnij karty aby zmienić kolejność',
      toasts: {
        added: 'Dodano "{{name}}" do wycieczki',
        removed: 'Usunięto "{{name}}" z wycieczki',
        clearedAll: 'Usunięto wszystkie zdjęcia',
        setPrimary: 'Ustawiono "{{name}}" jako zdjęcie główne',
        reordered: 'Zmieniono kolejność zdjęć',
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
      required: 'Wymagane',
      optional: 'Opcjonalne',
      copyFromPolish: 'Kopiuj z polskiego',
      copied: 'Skopiowano do pustych pól',
      completeness: 'Kompletność tłumaczeń',
      complete: 'Kompletne',
      incomplete: 'Niekompletne',
      fillRequired: 'Wypełnij wymagane pola (PL, EN)',
    },
  },
};

export default pl;
