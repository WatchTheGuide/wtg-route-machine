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
      clear: 'Wyczyść',
      search: 'Szukaj',
      ok: 'OK',
    },

    // Tabs
    tabs: {
      explore: 'Odkrywaj',
      routes: 'Trasy',
      tours: 'Wycieczki',
      settings: 'Ustawienia',
    },

    // Explore page
    explore: {
      title: 'Odkrywaj',
      locateMe: 'Lokalizuj mnie',
    },

    // Routes page
    routes: {
      title: 'Moje trasy',
      noRoutes: 'Brak zapisanych tras',
      noRoutesHint: 'Zaplanuj trasę klikając przycisk + poniżej',
      planRoute: 'Planowanie trasy',
      clearAll: 'Wyczyść',
      startNavigation: 'Rozpocznij nawigację',
      saveRoute: 'Zapisz trasę',
      routeName: 'Nazwa trasy',
      routeNamePlaceholder: 'np. Spacer po Starym Mieście',
      routeDescription: 'Opis (opcjonalnie)',
      routeDescriptionPlaceholder: 'Dodaj opis trasy...',
      savedSuccessfully: 'Trasa zapisana',
      deleteRoute: 'Usuń trasę',
      deleteConfirm: 'Czy na pewno chcesz usunąć tę trasę?',
      editRoute: 'Edytuj trasę',
      routeDetails: 'Szczegóły trasy',
      exportRoute: 'Eksportuj',
      exportGeoJSON: 'Eksport GeoJSON',
      exportGPX: 'Eksport GPX',
      exportSuccess: 'Trasa wyeksportowana',
      exportError: 'Błąd eksportu trasy',
      favorites: 'Ulubione',
      allRoutes: 'Wszystkie trasy',
      waypoints: 'Punkty trasy',
      waypointLabel: 'Punkt {{number}}',
      createdAt: 'Utworzono',
      updatedAt: 'Zaktualizowano',
      showOnMap: 'Pokaż na mapie',
      loadRoute: 'Wczytaj trasę',
    },

    // Tours page
    tours: {
      title: 'Wycieczki',
      subtitle: 'Kuratorowane wycieczki',
      noTours: 'Brak dostępnych wycieczek',
      noToursHint: 'Wkrótce dostępne będą gotowe trasy po miastach Polski',
      comingSoon: 'Wkrótce!',
    },

    // Settings page
    settings: {
      title: 'Ustawienia',
      appearance: 'Wygląd',
      darkMode: 'Tryb ciemny',
      language: 'Język',
      navigation: 'Nawigacja',
      defaultCity: 'Domyślne miasto',
      defaultProfile: 'Domyślny profil',
      units: 'Jednostki',
      unitsKm: 'Kilometry',
      unitsMiles: 'Mile',
      about: 'O aplikacji',
      version: 'Wersja',
      appName: 'WTG Route Machine',
    },

    // POI
    poi: {
      addToRoute: 'Dodaj do trasy',
      addToRouteAndGo: 'Dodaj i przejdź do trasy',
      navigate: 'Nawiguj',
      added: 'Dodano "{{name}}" do trasy',
      categories: {
        landmark: 'Zabytek',
        museum: 'Muzeum',
        park: 'Park',
        restaurant: 'Restauracja',
        cafe: 'Kawiarnia',
        hotel: 'Hotel',
        viewpoint: 'Punkt widokowy',
        church: 'Kościół',
      },
    },

    // Route planning
    route: {
      distance: 'Dystans',
      duration: 'Czas',
      calculating: 'Obliczam trasę...',
      noWaypoints: 'Brak punktów',
      addWaypointsHint: 'Kliknij na mapę, aby dodać punkty trasy',
      minWaypoints: 'Potrzeba minimum 2 punktów',
      clearAll: 'Wyczyść wszystko',
      start: 'Start',
      destination: 'Cel',
      stopover: 'Przystanek {{number}}',
      hours: 'godz.',
      minutes: 'min',
      profiles: {
        foot: 'Pieszo',
        bicycle: 'Rower',
        car: 'Samochód',
      },
    },

    // Cities
    cities: {
      krakow: 'Kraków',
      warszawa: 'Warszawa',
      wroclaw: 'Wrocław',
      trojmiasto: 'Trójmiasto',
      selectCity: 'Wybierz miasto',
    },

    // Navigation instructions
    navigation: {
      turn: 'Skręć',
      left: 'w lewo',
      right: 'w prawo',
      slightLeft: 'lekko w lewo',
      slightRight: 'lekko w prawo',
      sharpLeft: 'ostro w lewo',
      sharpRight: 'ostro w prawo',
      straight: 'prosto',
      uturn: 'zawróć',
      continue: 'Kontynuuj',
      depart: 'Rozpocznij trasę',
      arrive: 'Dotarłeś do celu',
      merge: 'Włącz się',
      roundabout: 'Na rondzie',
      exitRoundabout: 'Zjedź z ronda',
      onStreet: 'na {{street}}',
    },

    // Saved routes
    savedRoutes: {
      saveRoute: 'Zapisz trasę',
      routeName: 'Nazwa trasy',
      routeNamePlaceholder: 'Np. Spacer po Starym Mieście',
      routeDescription: 'Opis (opcjonalnie)',
      routeDescriptionPlaceholder: 'Dodatkowe informacje o trasie...',
      routeSummary: 'Podsumowanie trasy',
      waypoints: 'punkty',
      city: 'Miasto',
      profile: 'Profil',
      deleteConfirm: 'Czy na pewno chcesz usunąć tę trasę?',
      deleteConfirmTitle: 'Usuń trasę',
      routeSaved: 'Trasa została zapisana',
      routeDeleted: 'Trasa została usunięta',
    },

    // Errors
    errors: {
      locationDenied: 'Brak dostępu do lokalizacji',
      locationUnavailable: 'Lokalizacja niedostępna',
      networkError: 'Błąd sieci',
      routeError: 'Nie można obliczyć trasy',
      unknown: 'Nieznany błąd',
    },
  },
};

export default pl;
