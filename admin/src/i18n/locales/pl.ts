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
    },

    // POIs page
    pois: {
      title: 'Punkty POI',
      subtitle: 'Zarządzaj punktami turystycznymi',
      listTitle: 'Lista punktów POI',
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
      validation: {
        emailRequired: 'Email jest wymagany',
        emailInvalid: 'Nieprawidłowy adres email',
        passwordRequired: 'Hasło jest wymagane',
        passwordMinLength: 'Hasło musi mieć co najmniej 6 znaków',
      },
    },
  },
};

export default pl;
