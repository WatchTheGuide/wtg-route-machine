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
      clear: 'Clear',
      remove: 'Remove',
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
        media: 'Media',
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
      addTour: 'Add Tour',
      export: 'Export',
      sortBy: 'Sort by',
      showing: 'Showing {{from}}-{{to}} of {{total}}',
      selected: 'Selected: {{count}}',
      selectAll: 'Select all',
      selectTour: 'Select tour: {{name}}',
      noResults: 'No tours found',
      bulkPublish: 'Publish',
      bulkDelete: 'Delete selected',
      filters: {
        title: 'Filters',
        clear: 'Clear filters',
        searchPlaceholder: 'Search tours...',
        city: 'City',
        allCities: 'All cities',
        category: 'Category',
        allCategories: 'All categories',
        status: 'Status',
        allStatuses: 'All statuses',
        difficulty: 'Difficulty',
        allDifficulties: 'All levels',
      },
      table: {
        name: 'Name',
        city: 'City',
        category: 'Category',
        difficulty: 'Difficulty',
        pois: 'POIs',
        views: 'Views',
        status: 'Status',
        actions: 'Actions',
      },
      sort: {
        updatedAt: 'Updated date',
        createdAt: 'Created date',
        name: 'Name',
        views: 'Views',
        poisCount: 'POI count',
      },
      categories: {
        history: 'History',
        historical: 'Historical',
        cultural: 'Cultural',
        nature: 'Nature',
        architecture: 'Architecture',
        religious: 'Religious',
        nightlife: 'Nightlife',
        urban: 'Urban',
        food: 'Food & Dining',
        art: 'Art & Culture',
      },
      status: {
        published: 'Published',
        draft: 'Draft',
        archived: 'Archived',
      },
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      actions: {
        menu: 'Actions menu',
        preview: 'Preview',
        edit: 'Edit',
        duplicate: 'Duplicate',
        delete: 'Delete',
      },
      pagination: {
        perPage: 'Per page',
        page: 'Page {{current}} of {{total}}',
      },
      deleteDialog: {
        title: 'Are you sure you want to delete?',
        description:
          'This action cannot be undone. The tour "{{name}}" will be permanently deleted.',
      },
      bulkDeleteDialog: {
        title: 'Are you sure you want to delete selected tours?',
        description:
          'This action cannot be undone. {{count}} tours will be permanently deleted.',
      },
      // Toast messages
      deleteSuccess: 'Tour "{{name}}" has been deleted',
      deleteError: 'Failed to delete tour',
      bulkDeleteSuccess: '{{count}} tours deleted',
      bulkDeleteError: 'Failed to delete tours',
      bulkPublishSuccess: '{{count}} tours published',
      bulkPublishError: 'Failed to publish tours',
      duplicateSuccess: 'Tour has been duplicated',
      duplicateError: 'Failed to duplicate tour',
      loadError: 'Failed to load tours',
    },

    // Tour Editor
    tourEditor: {
      createTitle: 'New Tour',
      editTitle: 'Edit Tour',
      lastSaved: 'Last saved: {{time}}',
      unsavedChanges: 'Unsaved changes',
      autoSaved: 'Draft saved automatically',
      saved: 'Tour has been saved',
      published: 'Tour has been published',
      deleted: 'Tour has been deleted',
      saveError: 'Failed to save tour',
      deleteError: 'Failed to delete tour',
      saveDraft: 'Save Draft',
      publish: 'Publish',
      previewButton: 'Preview',
      tabs: {
        basic: 'Basic Info',
        media: 'Media',
        details: 'Details',
        waypoints: 'Waypoints',
        pois: 'POIs',
        settings: 'Settings',
      },
      basicInfo: {
        title: 'Basic Information',
        description: 'Enter basic tour information.',
      },
      media: {
        title: 'Photos and Media',
        description: 'Add photos to the tour.',
        dropzone: 'Drag and drop photos here or click to browse',
        browse: 'Browse Files',
        images: 'Images',
        hint: 'Select images from the media library or upload new ones.',
      },
      details: {
        title: 'Tour Details',
        description: 'Set duration and tags.',
      },
      waypoints: {
        title: 'Waypoints',
        description: 'Define points on the tour route.',
        jsonNote:
          'A visual map editor will be available in the future. For now, enter waypoints as JSON.',
      },
      settings: {
        title: 'Publication Settings',
        description: 'Manage tour status and visibility.',
      },
      fields: {
        name: 'Tour Name',
        description: 'Description',
        city: 'City',
        category: 'Category',
        difficulty: 'Difficulty',
        duration: 'Duration',
        tags: 'Tags',
        waypointsJson: 'Waypoints (JSON)',
        status: 'Status',
        featured: 'Featured Tour',
      },
      placeholders: {
        name: 'E.g., Royal Road',
        description: 'Describe the tour...',
        city: 'Select city',
        category: 'Select category',
        tags: 'Type a tag and press Enter',
        waypoints:
          '[\n  {\n    "id": "1",\n    "name": "Starting Point",\n    "coordinates": [19.9373, 50.0619],\n    "order": 1\n  }\n]',
      },
      hints: {
        name: '5 to 100 characters',
        description: '{{current}}/{{max}} characters (min. {{min}})',
        descriptionLocalized:
          'Enter description in at least 2 languages (Polish and English are required)',
        duration: 'Drag the slider to set estimated tour duration',
        tags: 'Press Enter to add a tag. Click a tag to remove it.',
        waypoints:
          'JSON format with array of waypoints. Each point requires id, name, coordinates and order.',
        status:
          'Drafts are not visible to users. Published tours are available in the app.',
        featured: 'Featured tours are promoted on the home page.',
      },
      validation: {
        nameMin: 'Name must be at least 5 characters',
        nameMax: 'Name can be at most 100 characters',
        descriptionMin: 'Description must be at least 50 characters',
        descriptionMax: 'Description can be at most 2000 characters',
        cityRequired: 'Please select a city',
        categoryRequired: 'Please select a category',
        plRequired: 'Polish version is required',
        enRequired: 'English version is required',
      },
      preview: {
        title: 'Preview',
        description: 'Real-time tour preview',
        mapPlaceholder: 'Route map will appear here',
        city: 'City',
        category: 'Category',
        duration: 'Duration',
        status: 'Status',
      },
      exitDialog: {
        title: 'Unsaved Changes',
        description:
          'You have unsaved changes. Are you sure you want to leave without saving?',
        confirm: 'Leave Without Saving',
      },
    },

    // POIs page
    pois: {
      title: 'Points of Interest',
      subtitle: 'Manage tourist points of interest',
      listTitle: 'POI List',
      addPoi: 'Add POI',
      editPoi: 'Edit POI',
      deletePoi: 'Delete POI',
      export: 'Export',
      exported: 'POIs have been exported',
      showing: 'Showing {{from}}-{{to}} of {{total}}',
      selected: 'Selected: {{count}}',
      selectAll: 'Select all',
      selectPoi: 'Select POI: {{name}}',
      noResults: 'No POIs found',
      deleted: 'POI has been deleted',
      bulkDelete: 'Delete selected',
      bulkDeleted: 'Deleted {{count}} POIs',
      loadError: 'Error loading POIs',
      stats: {
        total: 'Total POIs',
      },
      table: {
        name: 'Name',
        city: 'City',
        category: 'Category',
        coordinates: 'Coordinates',
        actions: 'Actions',
      },
      filters: {
        city: 'City',
        selectCity: 'Select city',
        category: 'Category',
        allCities: 'All cities',
        allCategories: 'All categories',
        searchPlaceholder: 'Search POI...',
        clear: 'Clear filters',
      },
      actions: {
        menu: 'Actions menu',
        edit: 'Edit',
        delete: 'Delete',
        viewOnMap: 'View on map',
      },
      pagination: {
        perPage: 'Per page',
        page: 'Page {{current}} of {{total}}',
      },
      deleteDialog: {
        title: 'Are you sure you want to delete?',
        description:
          'This action cannot be undone. POI "{{name}}" will be permanently deleted.',
      },
      bulkDeleteDialog: {
        title: 'Are you sure you want to delete selected POIs?',
        description:
          'This action cannot be undone. {{count}} POIs will be permanently deleted.',
      },
      categories: {
        landmark: 'Landmark',
        museum: 'Museum',
        park: 'Park',
        restaurant: 'Restaurant',
        viewpoint: 'Viewpoint',
        church: 'Church',
      },
      editor: {
        createTitle: 'New POI',
        editTitle: 'Edit POI',
        createDescription: 'Add a new point of interest',
        editDescription: 'Edit point of interest information',
        name: 'Name',
        namePlaceholder: 'E.g. Cloth Hall',
        description: 'Description',
        descriptionPlaceholder: 'Describe the point of interest...',
        longitude: 'Longitude',
        latitude: 'Latitude',
        address: 'Address',
        addressPlaceholder: 'E.g. Main Square 1',
        website: 'Website',
        openingHours: 'Opening hours',
        openingHoursPlaceholder: 'E.g. 10:00-18:00',
        estimatedTime: 'Estimated time',
        tags: 'Tags',
        tagsPlaceholder: 'Enter tags separated by commas',
        created: 'POI has been created',
        updated: 'POI has been updated',
        validation: {
          required: 'Name and description are required',
        },
      },
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

    // Map Editor
    mapEditor: {
      title: 'Map Editor',
      newWaypoint: 'Point {{number}}',
      importedWaypoint: 'Imported {{number}}',
      routeCalculated: 'Route calculated',
      layers: {
        streets: 'Streets',
        satellite: 'Satellite',
        terrain: 'Terrain',
      },
      addWaypoint: 'Add waypoint',
      deleteWaypoint: 'Delete selected waypoint',
      fitToWaypoints: 'Fit to waypoints',
      clickToAdd: 'Click on the map to add a waypoint',
      calculateRoute: 'Calculate route',
      import: 'Import',
      export: 'Export',
    },

    // Waypoints List
    waypointsList: {
      title: 'Waypoints',
      empty: 'No waypoints',
      emptyHint:
        'Click on the map or use "Add waypoint" button to add the first waypoint.',
      name: 'Name',
      description: 'Description',
      stopDuration: 'Stop duration',
      minutes: 'minutes',
      coordinates: 'Coordinates',
      actions: 'Actions',
      calculateRoute: 'Calculate route',
      import: 'Import',
      export: 'Export',
      importedWaypoint: 'Imported {{number}}',
    },

    // Tour POI Selector
    tourPOI: {
      mapTitle: 'POI Map',
      selectedPOIs: 'Selected POIs',
      availablePOIs: 'Available POIs',
      noSelectedPOIs: 'No POIs selected. Click on the map or list to add.',
      noPOIs: 'No POIs for this city',
      noResults: 'No results for the given filters',
      searchPlaceholder: 'Search POIs...',
      filterByCategory: 'Filter by category',
      clearFilters: 'Clear filters',
      clickToAdd: 'Click to add POI to tour',
      add: 'Add',
      remove: 'Remove',
      suggestPOIs: 'Suggest POIs',
      suggestPOIsHint: 'Automatically add POIs near the route',
      fromRoute: 'from route',
      selectCityFirst: 'Select a city first to see available POIs',
      loadError: 'Failed to load POIs',
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
        passwordPlaceholder: 'Enter password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submit: 'Sign In',
        signingIn: 'Signing in...',
        backToHome: 'Back to home page',
        error: 'Invalid email or password',
        demoCredentials: 'Use demo credentials:',
      },
      logout: 'Logout',
      errors: {
        invalidCredentials: 'Invalid email or password',
        networkError: 'Connection error. Please try again.',
        tooManyAttempts: 'Too many login attempts. Please wait and try again.',
        sessionExpired: 'Session expired. Please log in again.',
      },
      validation: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters',
      },
    },

    // Media Manager
    media: {
      title: 'Media Library',
      subtitle: 'Manage images and media files',
      upload: 'Upload Images',
      search: 'Search media...',
      filters: 'Filters',
      noResults: 'No media found',
      noResultsDesc: 'Upload images to get started',
      selectImages: 'Select images or drag and drop',
      dropHere: 'Drop files here',
      maxFileSize: 'Max file size: {{size}} per image',
      maxFiles: 'Maximum {{max}} files at once',
      uploadSuccess: '{{count}} images uploaded successfully',
      uploadError: 'Upload failed',
      deleteConfirm: 'Delete this image? This action cannot be undone.',
      deleteSuccess: 'Image deleted',
      deleteError: 'Delete failed',
      updateSuccess: 'Image updated',
      updateError: 'Update failed',
      editMetadata: 'Edit Metadata',
      imageDetails: 'Image Details',
      dimensions: 'Dimensions',
      fileSize: 'File Size',
      uploadedAt: 'Uploaded',
      tags: 'Tags',
      imageTitle: 'Title',
      titlePlaceholder: 'Enter image title',
      altText: 'Alt Text',
      altTextPlaceholder: 'Describe the image for accessibility',
      tagsPlaceholder: 'city, landmark, architecture',
      tagsHelp: 'Separate tags with commas',
      contextType: 'Context',
      standalone: 'Standalone',
      tourImages: 'Tour Images',
      poiImages: 'POI Images',
      allMedia: 'All Media',
      usedIn: 'Used in',
      filename: 'Filename',
      tour: 'Tour',
      poi: 'POI',
      uploading: 'Uploading...',
      uploadFiles: 'Upload {{count}} files',
      noFilesSelected: 'No files selected',
      fileTooLarge: '{{name}} is too large. Maximum {{max}}',
      tooManyFiles: 'Too many files. Maximum {{max}} at once',
      selected: '{{count}} selected',
      uploadFirst: 'Upload your first image',
      totalMedia: '{{count}} media files',
      showing: 'Showing {{count}} results',
      sortByDate: 'Sort by Date',
      sortByTitle: 'Sort by Title',
      sortBySize: 'Sort by Size',
    },

    // Media Picker (Tour Media)
    mediaPicker: {
      selectedTitle: 'Selected images',
      selectedCount: '({{count}}/{{max}})',
      clearAll: 'Clear all',
      emptySelected: 'No images selected',
      emptySelectedHint: 'Click on an image in the library below to add it',
      libraryTitle: 'Media Library',
      searchPlaceholder: 'Search by name...',
      filterAll: 'All',
      filterUnused: 'Unused',
      addToTour: 'Add to tour',
      removeFromTour: 'Remove from tour',
      setAsPrimary: 'Set as primary',
      isPrimary: 'Primary image',
      alreadySelected: 'Selected',
      maxLimitReached: 'Limit of {{max}} images reached',
      dndHint: 'Drag cards to reorder',
      toasts: {
        added: 'Added "{{name}}" to tour',
        removed: 'Removed "{{name}}" from tour',
        clearedAll: 'All images removed',
        setPrimary: 'Set "{{name}}" as primary image',
        reordered: 'Images reordered',
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
      required: 'Required',
      optional: 'Optional',
      copyFromPolish: 'Copy from Polish',
      copied: 'Copied to empty fields',
      completeness: 'Translation completeness',
      complete: 'Complete',
      incomplete: 'Incomplete',
      fillRequired: 'Fill required fields (PL, EN)',
    },
  },
};

export default en;
