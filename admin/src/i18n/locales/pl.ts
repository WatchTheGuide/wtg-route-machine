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
  },
};

export default pl;
