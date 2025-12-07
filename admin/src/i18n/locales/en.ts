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
      search: 'Search',
      back: 'Back',
      comingSoon: 'Coming soon...',
    },

    // Dashboard
    dashboard: {
      title: 'Admin Dashboard',
      subtitle: 'Manage tours and points of interest',
      allCities: 'All cities',
      selectCity: 'Select city',
      nav: {
        dashboard: 'Dashboard',
        tours: 'Tours',
        pois: 'POIs',
        settings: 'Settings',
        logout: 'Log out',
      },
      stats: {
        tours: 'Tours',
        pois: 'POIs',
        cities: 'Cities',
        views: 'Views',
        thisMonth: 'this month',
        active: 'Active',
        total: 'Total',
        fromLastMonth: 'from last month',
      },
      citySelector: {
        label: 'City',
        all: 'All cities',
        placeholder: 'Select city',
      },
      charts: {
        toursOverTime: 'Tours over time',
        toursOverTimeDesc: 'Number of tours and POIs added each month',
        toursByCity: 'Tours by city',
        toursByCityDesc: 'Views by city',
        viewsPerCity: 'Views per city',
        viewsPerCityDesc: 'Total views for each city',
      },
      quickActions: {
        title: 'Quick Actions',
        addTour: 'Add Tour',
        addPoi: 'Add POI',
        viewStats: 'View Stats',
        managePois: 'Manage POIs',
        viewReports: 'View Reports',
        analytics: 'Analytics',
      },
      topTours: {
        title: 'Top Tours',
        subtitle: 'Most viewed tours',
        views: 'Views',
      },
      status: {
        published: 'Published',
        draft: 'Draft',
      },
      recentTours: {
        title: 'Recent Tours',
        subtitle: 'Recently added and edited tours',
        name: 'Name',
        city: 'City',
        status: 'Status',
      },
      activity: {
        title: 'Recent Activity',
        subtitle: 'System change history',
        created: 'created',
        updated: 'updated',
        published: 'published',
        deleted: 'deleted',
      },
    },

    // Tours page
    tours: {
      title: 'Tours',
      subtitle: 'Manage curated walking tours',
      listTitle: 'Tours List',
    },

    // POIs page
    pois: {
      title: 'Points of Interest',
      subtitle: 'Manage tourist points of interest',
      listTitle: 'POI List',
    },

    // Settings page
    settings: {
      title: 'Settings',
      subtitle: 'Admin panel configuration',
      generalTitle: 'General Settings',
    },

    // Navbar
    nav: {
      features: 'Features',
      cities: 'Cities',
      about: 'About',
      adminPanel: 'Admin Panel',
    },

    // Hero section
    hero: {
      badge: 'Open Source Routing',
      title: 'City Walking Tours',
      titleHighlight: 'Made Simple',
      description:
        'Lightweight OSRM-based routing for pedestrian navigation. Discover walking tours in Polish cities with optimized routes and points of interest.',
      exploreCities: 'Explore Cities',
      viewOnGithub: 'View on GitHub',
    },

    // Features section
    features: {
      title: 'Powerful Features',
      subtitle:
        'Built with modern technologies for the best walking tour experience.',
      pedestrianRouting: {
        title: 'Pedestrian Routing',
        description:
          'Optimized foot profiles for walking tours with accurate time and distance estimates.',
      },
      poi: {
        title: 'Points of Interest',
        description:
          'Curated POI database with landmarks, museums, restaurants, and hidden gems.',
      },
      mobile: {
        title: 'Mobile Ready',
        description:
          'Ionic React mobile app with offline support and turn-by-turn navigation.',
      },
      multiCity: {
        title: 'Multi-City Support',
        description:
          'Scalable architecture supporting multiple cities with individual routing engines.',
      },
    },

    // Cities section
    cities: {
      title: 'Explore Cities',
      subtitle: "Discover walking tours in Poland's most beautiful cities.",
      toursAvailable: '{{count}} tours available',
      krakow: {
        name: 'Kraków',
        description: 'Historic royal capital with stunning architecture',
      },
      warszawa: {
        name: 'Warsaw',
        description: 'Modern capital blending history and innovation',
      },
      wroclaw: {
        name: 'Wrocław',
        description: 'City of bridges and charming dwarf statues',
      },
      trojmiasto: {
        name: 'Tricity',
        description: 'Baltic coast trio: Gdańsk, Sopot, Gdynia',
      },
    },

    // About section
    about: {
      title: 'About the Project',
      paragraph1:
        'WTG Route Machine is an open-source project that brings professional-grade routing capabilities to city walking tours. Built on OSRM (Open Source Routing Machine), it provides fast and accurate pedestrian navigation.',
      paragraph2:
        'The project includes a lightweight backend optimized for AWS deployment, a mobile app built with Ionic React and Capacitor, and an admin panel for managing tours and points of interest.',
      paragraph3:
        "Our goal is to make urban exploration accessible and enjoyable for everyone, whether you're a tourist discovering a new city or a local looking for hidden gems in your neighborhood.",
      stats: {
        cities: 'Cities',
        tours: 'Tours',
        pois: 'POIs',
        openSource: 'Open Source',
      },
    },

    // Footer
    footer: {
      description:
        'Open-source city walking tour routing powered by OSRM. Built for explorers, by explorers.',
      links: 'Links',
      project: 'Project',
      copyright: '© {{year}} WatchTheGuide. Open source under MIT License.',
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
        title: 'Sign In',
        subtitle: 'Enter your credentials to access the admin panel',
        email: 'Email',
        emailPlaceholder: 'admin@example.com',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submit: 'Sign In',
        signingIn: 'Signing in...',
        backToHome: 'Back to home page',
        error: 'Invalid email or password',
        demoCredentials: 'Use demo credentials:',
      },
      logout: 'Logout',
      validation: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters',
      },
    },
  },
};

export default en;
