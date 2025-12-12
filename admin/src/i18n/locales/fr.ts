// French translations
const fr = {
  translation: {
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      search: 'Rechercher',
      back: 'Retour',
      comingSoon: 'Bientôt disponible...',
      clear: 'Effacer',
      remove: 'Retirer',
    },

    // Dashboard
    dashboard: {
      title: 'Tableau de bord Admin',
      subtitle: "Gérer les circuits et points d'intérêt",
      allCities: 'Toutes les villes',
      selectCity: 'Sélectionner une ville',
      nav: {
        dashboard: 'Tableau de bord',
        tours: 'Circuits',
        pois: 'POIs',
        media: 'Médias',
        settings: 'Paramètres',
        logout: 'Déconnexion',
      },
      stats: {
        tours: 'Circuits',
        pois: 'POIs',
        cities: 'Villes',
        views: 'Vues',
        thisMonth: 'ce mois-ci',
        active: 'Actifs',
        total: 'Total',
        fromLastMonth: 'depuis le mois dernier',
      },
      citySelector: {
        label: 'Ville',
        all: 'Toutes les villes',
        placeholder: 'Sélectionner une ville',
      },
      charts: {
        toursOverTime: 'Circuits dans le temps',
        toursOverTimeDesc: 'Nombre de circuits et POIs ajoutés par mois',
        toursByCity: 'Circuits par ville',
        toursByCityDesc: 'Vues par ville',
        viewsPerCity: 'Vues par ville',
        viewsPerCityDesc: 'Nombre total de vues pour chaque ville',
      },
      quickActions: {
        title: 'Actions rapides',
        addTour: 'Ajouter un circuit',
        addPoi: 'Ajouter un POI',
        viewStats: 'Voir les stats',
        managePois: 'Gérer les POIs',
        viewReports: 'Voir les rapports',
        analytics: 'Analytique',
      },
      topTours: {
        title: 'Top Circuits',
        subtitle: 'Circuits les plus vus',
        views: 'Vues',
      },
      status: {
        published: 'Publié',
        draft: 'Brouillon',
      },
      recentTours: {
        title: 'Circuits récents',
        subtitle: 'Circuits récemment ajoutés et modifiés',
        name: 'Nom',
        city: 'Ville',
        status: 'Statut',
      },
      activity: {
        title: 'Activité récente',
        subtitle: 'Historique des modifications',
        created: 'a créé',
        updated: 'a mis à jour',
        published: 'a publié',
        deleted: 'a supprimé',
      },
    },

    // Tours page
    tours: {
      title: 'Circuits',
      subtitle: 'Gérer les circuits pédestres',
      listTitle: 'Liste des circuits',
      addTour: 'Ajouter un circuit',
      export: 'Exporter',
      sortBy: 'Trier par',
      showing: 'Affichage {{from}}-{{to}} sur {{total}}',
      selected: 'Sélectionnés: {{count}}',
      selectAll: 'Tout sélectionner',
      selectTour: 'Sélectionner le circuit: {{name}}',
      noResults: 'Aucun circuit trouvé',
      bulkPublish: 'Publier',
      bulkDelete: 'Supprimer la sélection',
      filters: {
        title: 'Filtres',
        clear: 'Effacer les filtres',
        searchPlaceholder: 'Rechercher des circuits...',
        city: 'Ville',
        allCities: 'Toutes les villes',
        category: 'Catégorie',
        allCategories: 'Toutes les catégories',
        status: 'Statut',
        allStatuses: 'Tous les statuts',
        difficulty: 'Difficulté',
        allDifficulties: 'Tous les niveaux',
      },
      table: {
        name: 'Nom',
        city: 'Ville',
        category: 'Catégorie',
        difficulty: 'Difficulté',
        pois: 'POIs',
        views: 'Vues',
        status: 'Statut',
        actions: 'Actions',
      },
      sort: {
        updatedAt: 'Date de mise à jour',
        createdAt: 'Date de création',
        name: 'Nom',
        views: 'Vues',
        poisCount: 'Nombre de POIs',
      },
      categories: {
        historical: 'Historique',
        cultural: 'Culturel',
        nature: 'Nature',
        architecture: 'Architecture',
        religious: 'Religieux',
        nightlife: 'Vie nocturne',
        urban: 'Urbain',
      },
      status: {
        published: 'Publié',
        draft: 'Brouillon',
        archived: 'Archivé',
      },
      difficulty: {
        easy: 'Facile',
        medium: 'Moyen',
        hard: 'Difficile',
      },
      actions: {
        menu: "Menu d'actions",
        preview: 'Aperçu',
        edit: 'Modifier',
        duplicate: 'Dupliquer',
        delete: 'Supprimer',
      },
      pagination: {
        perPage: 'Par page',
        page: 'Page {{current}} sur {{total}}',
      },
      deleteDialog: {
        title: 'Êtes-vous sûr de vouloir supprimer?',
        description:
          'Cette action est irréversible. Le circuit "{{name}}" sera définitivement supprimé.',
      },
      // Toast messages
      deleteSuccess: 'Circuit "{{name}}" supprimé',
      deleteError: 'Échec de la suppression du circuit',
      bulkDeleteSuccess: '{{count}} circuits supprimés',
      bulkDeleteError: 'Échec de la suppression des circuits',
      bulkPublishSuccess: '{{count}} circuits publiés',
      bulkPublishError: 'Échec de la publication des circuits',
      duplicateSuccess: 'Circuit dupliqué',
      duplicateError: 'Échec de la duplication du circuit',
      loadError: 'Échec du chargement des circuits',
    },

    // Tour Editor
    tourEditor: {
      createTitle: 'Nouveau circuit',
      editTitle: 'Modifier le circuit',
      lastSaved: 'Dernière sauvegarde: {{time}}',
      unsavedChanges: 'Modifications non enregistrées',
      autoSaved: 'Brouillon enregistré automatiquement',
      saved: 'Circuit enregistré',
      published: 'Circuit publié',
      deleted: 'Circuit supprimé',
      saveError: "Échec de l'enregistrement du circuit",
      deleteError: 'Échec de la suppression du circuit',
      saveDraft: 'Enregistrer brouillon',
      publish: 'Publier',
      previewButton: 'Aperçu',
      tabs: {
        basic: 'Infos de base',
        media: 'Médias',
        details: 'Détails',
        waypoints: 'Points de passage',
        pois: 'POIs',
        settings: 'Paramètres',
      },
      basicInfo: {
        title: 'Informations de base',
        description: 'Entrez les informations de base du circuit.',
      },
      media: {
        title: 'Photos et médias',
        description: 'Ajoutez des photos au circuit.',
        dropzone: 'Glissez-déposez des photos ici ou cliquez pour parcourir',
        browse: 'Parcourir les fichiers',
        images: 'Images',
        hint: 'Sélectionnez des images de la médiathèque ou téléchargez-en de nouvelles.',
      },
      details: {
        title: 'Détails du circuit',
        description: 'Définissez la durée et les tags.',
      },
      waypoints: {
        title: 'Points de passage',
        description: 'Définissez les points sur le parcours du circuit.',
        jsonNote:
          "Un éditeur de carte visuel sera disponible à l'avenir. Pour l'instant, entrez les points de passage en JSON.",
      },
      settings: {
        title: 'Paramètres de publication',
        description: 'Gérez le statut et la visibilité du circuit.',
      },
      fields: {
        name: 'Nom du circuit',
        description: 'Description',
        city: 'Ville',
        category: 'Catégorie',
        difficulty: 'Difficulté',
        duration: 'Durée',
        tags: 'Tags',
        waypointsJson: 'Points de passage (JSON)',
        status: 'Statut',
        featured: 'Circuit en vedette',
      },
      placeholders: {
        name: 'Ex. Chemin Royal',
        description: 'Décrivez le circuit...',
        city: 'Sélectionner une ville',
        category: 'Sélectionner une catégorie',
        tags: 'Tapez un tag et appuyez sur Entrée',
        waypoints:
          '[\n  {\n    "id": "1",\n    "name": "Point de départ",\n    "coordinates": [19.9373, 50.0619],\n    "order": 1\n  }\n]',
      },
      hints: {
        name: '5 à 100 caractères',
        description: '{{current}}/{{max}} caractères (min. {{min}})',
        descriptionLocalized:
          'Entrez la description dans au moins 2 langues (polonais et anglais sont requis)',
        duration:
          'Faites glisser le curseur pour définir la durée estimée du circuit',
        tags: 'Appuyez sur Entrée pour ajouter un tag. Cliquez sur un tag pour le supprimer.',
        waypoints:
          'Format JSON avec un tableau de points de passage. Chaque point nécessite id, name, coordinates et order.',
        status:
          "Les brouillons ne sont pas visibles pour les utilisateurs. Les circuits publiés sont disponibles dans l'app.",
        featured:
          "Les circuits en vedette sont mis en avant sur la page d'accueil.",
      },
      validation: {
        nameMin: 'Le nom doit avoir au moins 5 caractères',
        nameMax: 'Le nom peut avoir au maximum 100 caractères',
        descriptionMin: 'La description doit avoir au moins 50 caractères',
        descriptionMax: 'La description peut avoir au maximum 2000 caractères',
        cityRequired: 'Veuillez sélectionner une ville',
        categoryRequired: 'Veuillez sélectionner une catégorie',
        plRequired: 'La version polonaise est requise',
        enRequired: 'La version anglaise est requise',
      },
      preview: {
        title: 'Aperçu',
        description: 'Aperçu du circuit en temps réel',
        mapPlaceholder: 'La carte du parcours apparaîtra ici',
        city: 'Ville',
        category: 'Catégorie',
        duration: 'Durée',
        status: 'Statut',
      },
      exitDialog: {
        title: 'Modifications non enregistrées',
        description:
          'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter sans enregistrer?',
        confirm: 'Quitter sans enregistrer',
      },
    },

    // POIs page
    pois: {
      title: "Points d'intérêt",
      subtitle: "Gérer les points d'intérêt touristiques",
      listTitle: 'Liste des POIs',
      addPoi: 'Ajouter POI',
      editPoi: 'Modifier POI',
      export: 'Exporter',
      exported: 'POIs exportés',
      showing: 'Affichage {{from}}-{{to}} sur {{total}}',
      selected: 'Sélectionnés: {{count}}',
      selectAll: 'Tout sélectionner',
      selectPoi: 'Sélectionner POI: {{name}}',
      noResults: 'Aucun POI trouvé',
      deleted: 'POI supprimé',
      bulkDelete: 'Supprimer la sélection',
      bulkDeleted: '{{count}} POIs supprimés',
      loadError: 'Erreur de chargement des POIs',
      stats: {
        total: 'Total des POIs',
      },
      table: {
        name: 'Nom',
        city: 'Ville',
        category: 'Catégorie',
        coordinates: 'Coordonnées',
        actions: 'Actions',
      },
      filters: {
        city: 'Ville',
        selectCity: 'Sélectionner une ville',
        category: 'Catégorie',
        allCities: 'Toutes les villes',
        allCategories: 'Toutes les catégories',
        searchPlaceholder: 'Rechercher POI...',
        clear: 'Effacer les filtres',
      },
      actions: {
        menu: "Menu d'actions",
        edit: 'Modifier',
        delete: 'Supprimer',
        viewOnMap: 'Voir sur la carte',
      },
      pagination: {
        perPage: 'Par page',
        page: 'Page {{current}} sur {{total}}',
      },
      deleteDialog: {
        title: 'Êtes-vous sûr de vouloir supprimer?',
        description:
          'Cette action est irréversible. Le POI "{{name}}" sera définitivement supprimé.',
      },
      bulkDeleteDialog: {
        title: 'Êtes-vous sûr de vouloir supprimer les POIs sélectionnés?',
        description:
          'Cette action est irréversible. {{count}} POIs seront définitivement supprimés.',
      },
      categories: {
        landmark: 'Monument',
        museum: 'Musée',
        park: 'Parc',
        restaurant: 'Restaurant',
        viewpoint: 'Point de vue',
        church: 'Église',
      },
      editor: {
        createTitle: 'Nouveau POI',
        editTitle: 'Modifier POI',
        createDescription: "Ajouter un nouveau point d'intérêt",
        editDescription: "Modifier les informations du point d'intérêt",
        name: 'Nom',
        namePlaceholder: 'Ex. Halle aux Draps',
        description: 'Description',
        descriptionPlaceholder: "Décrivez le point d'intérêt...",
        longitude: 'Longitude',
        latitude: 'Latitude',
        address: 'Adresse',
        addressPlaceholder: 'Ex. Place du Marché 1',
        website: 'Site web',
        openingHours: "Heures d'ouverture",
        openingHoursPlaceholder: 'Ex. 10:00-18:00',
        estimatedTime: 'Temps estimé',
        tags: 'Tags',
        tagsPlaceholder: 'Entrez les tags séparés par des virgules',
        created: 'POI créé',
        updated: 'POI mis à jour',
        validation: {
          required: 'Le nom et la description sont requis',
        },
      },
    },

    // Settings page
    settings: {
      title: 'Paramètres',
      subtitle: 'Configuration du panneau admin',
      generalTitle: 'Paramètres généraux',
    },

    // Navbar
    nav: {
      features: 'Fonctionnalités',
      cities: 'Villes',
      about: 'À propos',
      adminPanel: 'Panneau Admin',
    },

    // Hero section
    hero: {
      badge: 'Routage Open Source',
      title: 'Promenades en ville',
      titleHighlight: 'Simplifiées',
      description:
        "Routage léger basé sur OSRM pour la navigation piétonne. Découvrez des circuits pédestres dans les villes polonaises avec des itinéraires optimisés et des points d'intérêt.",
      exploreCities: 'Explorer les villes',
      viewOnGithub: 'Voir sur GitHub',
    },

    // Features section
    features: {
      title: 'Fonctionnalités puissantes',
      subtitle:
        'Construit avec des technologies modernes pour la meilleure expérience de visite.',
      pedestrianRouting: {
        title: 'Routage piéton',
        description:
          'Profils piétons optimisés pour les visites avec des estimations précises de temps et de distance.',
      },
      poi: {
        title: "Points d'intérêt",
        description:
          'Base de données POI organisée avec monuments, musées, restaurants et trésors cachés.',
      },
      mobile: {
        title: 'Application mobile',
        description:
          'Application mobile Ionic React avec support hors ligne et navigation étape par étape.',
      },
      multiCity: {
        title: 'Multi-villes',
        description:
          'Architecture évolutive prenant en charge plusieurs villes avec des moteurs de routage individuels.',
      },
    },

    // Cities section
    cities: {
      title: 'Explorer les villes',
      subtitle:
        'Découvrez des circuits pédestres dans les plus belles villes de Pologne.',
      toursAvailable: '{{count}} circuits disponibles',
      krakow: {
        name: 'Cracovie',
        description:
          'Capitale royale historique avec une architecture époustouflante',
      },
      warszawa: {
        name: 'Varsovie',
        description: 'Capitale moderne mêlant histoire et innovation',
      },
      wroclaw: {
        name: 'Wrocław',
        description: 'Ville des ponts et des charmantes statues de nains',
      },
      trojmiasto: {
        name: 'Tricity',
        description: 'Trio de la côte baltique : Gdańsk, Sopot, Gdynia',
      },
    },

    // About section
    about: {
      title: 'À propos du projet',
      paragraph1:
        'WTG Route Machine est un projet open-source qui apporte des capacités de routage professionnelles aux visites pédestres de villes. Construit sur OSRM (Open Source Routing Machine), il fournit une navigation piétonne rapide et précise.',
      paragraph2:
        "Le projet comprend un backend léger optimisé pour le déploiement AWS, une application mobile construite avec Ionic React et Capacitor, et un panneau d'administration pour gérer les circuits et points d'intérêt.",
      paragraph3:
        "Notre objectif est de rendre l'exploration urbaine accessible et agréable pour tous, que vous soyez un touriste découvrant une nouvelle ville ou un habitant à la recherche de trésors cachés.",
      stats: {
        cities: 'Villes',
        tours: 'Circuits',
        pois: 'POIs',
        openSource: 'Open Source',
      },
    },

    // Map Editor
    mapEditor: {
      title: 'Éditeur de carte',
      newWaypoint: 'Point {{number}}',
      importedWaypoint: 'Importé {{number}}',
      routeCalculated: 'Itinéraire calculé',
      layers: {
        streets: 'Rues',
        satellite: 'Satellite',
        terrain: 'Terrain',
      },
      addWaypoint: 'Ajouter un point',
      deleteWaypoint: 'Supprimer le point sélectionné',
      fitToWaypoints: 'Ajuster aux points',
      clickToAdd: 'Cliquez sur la carte pour ajouter un point',
      calculateRoute: "Calculer l'itinéraire",
      import: 'Importer',
      export: 'Exporter',
    },

    // Waypoints List
    waypointsList: {
      title: 'Points de passage',
      empty: 'Aucun point',
      emptyHint:
        'Cliquez sur la carte ou utilisez "Ajouter un point" pour ajouter le premier point.',
      name: 'Nom',
      description: 'Description',
      stopDuration: "Durée d'arrêt",
      minutes: 'minutes',
      coordinates: 'Coordonnées',
      actions: 'Actions',
      calculateRoute: "Calculer l'itinéraire",
      import: 'Importer',
      export: 'Exporter',
      importedWaypoint: 'Importé {{number}}',
    },

    // Tour POI Selector
    tourPOI: {
      mapTitle: 'Carte des POI',
      selectedPOIs: 'POI sélectionnés',
      availablePOIs: 'POI disponibles',
      noSelectedPOIs:
        'Aucun POI sélectionné. Cliquez sur la carte ou la liste pour ajouter.',
      noPOIs: 'Aucun POI pour cette ville',
      noResults: 'Aucun résultat pour les filtres donnés',
      searchPlaceholder: 'Rechercher des POI...',
      filterByCategory: 'Filtrer par catégorie',
      clearFilters: 'Effacer les filtres',
      clickToAdd: 'Cliquez pour ajouter un POI à la visite',
      add: 'Ajouter',
      remove: 'Supprimer',
      suggestPOIs: 'Suggérer des POI',
      suggestPOIsHint: "Ajouter automatiquement des POI près de l'itinéraire",
      fromRoute: "de l'itinéraire",
      selectCityFirst:
        "Sélectionnez d'abord une ville pour voir les POI disponibles",
      loadError: 'Échec du chargement des POI',
    },

    // Footer
    footer: {
      description:
        'Routage open-source pour visites pédestres alimenté par OSRM. Construit par des explorateurs, pour des explorateurs.',
      links: 'Liens',
      project: 'Projet',
      copyright: '© {{year}} WatchTheGuide. Open source sous licence MIT.',
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
        title: 'Connexion',
        subtitle:
          "Entrez vos identifiants pour accéder au panneau d'administration",
        email: 'Email',
        emailPlaceholder: 'admin@example.com',
        password: 'Mot de passe',
        passwordPlaceholder: 'Entrer le mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        submit: 'Se connecter',
        signingIn: 'Connexion en cours...',
        backToHome: "Retour à l'accueil",
        error: 'E-mail ou mot de passe incorrect',
        demoCredentials: 'Utilisez les identifiants de démonstration :',
      },
      logout: 'Déconnexion',
      errors: {
        invalidCredentials: 'Email ou mot de passe invalide',
        networkError: 'Erreur de connexion. Veuillez réessayer.',
        tooManyAttempts: 'Trop de tentatives de connexion. Veuillez patienter.',
        sessionExpired: 'Session expirée. Veuillez vous reconnecter.',
      },
      validation: {
        emailRequired: "L'e-mail est requis",
        emailInvalid: 'Adresse e-mail invalide',
        passwordRequired: 'Le mot de passe est requis',
        passwordMinLength:
          'Le mot de passe doit contenir au moins 6 caractères',
      },
    },
    // Media Manager
    media: {
      title: 'Bibliothèque Multimédia',
      subtitle: 'Gérer les images et fichiers multimédias',
      upload: 'Télécharger des Images',
      search: 'Rechercher des médias...',
      filters: 'Filtres',
      noResults: 'Aucun média trouvé',
      noResultsDesc: 'Téléchargez des images pour commencer',
      selectImages: 'Sélectionner des images ou glisser-déposer',
      dropHere: 'Déposer les fichiers ici',
      maxFileSize: 'Taille max du fichier: {{size}} par image',
      maxFiles: 'Maximum {{max}} fichiers à la fois',
      uploadSuccess: '{{count}} images téléchargées avec succès',
      uploadError: 'Échec du téléchargement',
      deleteConfirm:
        'Supprimer cette image? Cette action ne peut être annulée.',
      deleteSuccess: 'Image supprimée',
      deleteError: 'Échec de la suppression',
      updateSuccess: 'Image mise à jour',
      updateError: 'Échec de la mise à jour',
      editMetadata: 'Modifier les Métadonnées',
      imageDetails: "Détails de l'Image",
      dimensions: 'Dimensions',
      fileSize: 'Taille du Fichier',
      uploadedAt: 'Téléchargé',
      tags: 'Tags',
      imageTitle: 'Titre',
      titlePlaceholder: "Entrer le titre de l'image",
      altText: 'Texte Alternatif',
      altTextPlaceholder: "Décrire l'image pour l'accessibilité",
      tagsPlaceholder: 'ville, monument, architecture',
      tagsHelp: 'Séparer les tags par des virgules',
      contextType: 'Contexte',
      standalone: 'Autonome',
      tourImages: 'Images de Tour',
      poiImages: 'Images de POI',
      allMedia: 'Tous les Médias',
      usedIn: 'Utilisé dans',
      filename: 'Nom du Fichier',
      tour: 'Tour',
      poi: 'POI',
      uploading: 'Téléchargement...',
      uploadFiles: 'Télécharger {{count}} fichiers',
      noFilesSelected: 'Aucun fichier sélectionné',
      fileTooLarge: '{{name}} est trop grand. Maximum {{max}}',
      tooManyFiles: 'Trop de fichiers. Maximum {{max}} à la fois',
      selected: '{{count}} sélectionné',
      uploadFirst: 'Téléchargez votre première image',
      totalMedia: '{{count}} fichiers multimédias',
      showing: 'Affichage de {{count}} résultats',
      sortByDate: 'Trier par Date',
      sortByTitle: 'Trier par Titre',
      sortBySize: 'Trier par Taille',
    },

    // Media Picker (Tour Media)
    mediaPicker: {
      selectedTitle: 'Images sélectionnées',
      selectedCount: '({{count}}/{{max}})',
      clearAll: 'Tout effacer',
      emptySelected: 'Aucune image sélectionnée',
      emptySelectedHint:
        "Cliquez sur une image dans la bibliothèque ci-dessous pour l'ajouter",
      libraryTitle: 'Bibliothèque de médias',
      searchPlaceholder: 'Rechercher par nom...',
      filterAll: 'Tous',
      filterUnused: 'Non attribués',
      addToTour: 'Ajouter à la visite',
      removeFromTour: 'Retirer de la visite',
      setAsPrimary: 'Définir comme principale',
      isPrimary: 'Image principale',
      alreadySelected: 'Sélectionné',
      maxLimitReached: 'Limite de {{max}} images atteinte',
      dndHint: 'Faites glisser les cartes pour réorganiser',
      toasts: {
        added: '"{{name}}" ajouté à la visite',
        removed: '"{{name}}" retiré de la visite',
        clearedAll: 'Toutes les images supprimées',
        setPrimary: '"{{name}}" défini comme image principale',
        reordered: 'Images réorganisées',
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
      required: 'Obligatoire',
      optional: 'Optionnel',
      copyFromPolish: 'Copier du polonais',
      copied: 'Copié dans les champs vides',
      completeness: 'Complétude des traductions',
      complete: 'Complet',
      incomplete: 'Incomplet',
      fillRequired: 'Remplir les champs obligatoires (PL, EN)',
    },
  },
};

export default fr;
