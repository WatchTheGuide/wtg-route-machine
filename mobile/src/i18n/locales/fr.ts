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
      clear: 'Effacer',
      search: 'Rechercher',
      ok: 'OK',
      back: 'Retour',
    },

    // Tabs
    tabs: {
      explore: 'Explorer',
      routes: 'Itinéraires',
      tours: 'Visites',
      settings: 'Paramètres',
    },

    // Explore page
    explore: {
      title: 'Explorer',
      locateMe: 'Me localiser',
    },

    // Routes page
    routes: {
      title: 'Mes itinéraires',
      noRoutes: 'Aucun itinéraire enregistré',
      noRoutesHint: 'Planifiez un itinéraire en appuyant sur le bouton +',
      planRoute: "Planification d'itinéraire",
      clearAll: 'Effacer',
      startNavigation: 'Démarrer la navigation',
      saveRoute: "Enregistrer l'itinéraire",
      routeName: "Nom de l'itinéraire",
      routeNamePlaceholder: 'ex. Promenade dans la vieille ville',
      routeDescription: 'Description (optionnel)',
      routeDescriptionPlaceholder: "Ajouter une description de l'itinéraire...",
      savedSuccessfully: 'Itinéraire enregistré',
      deleteRoute: "Supprimer l'itinéraire",
      deleteConfirm: 'Voulez-vous vraiment supprimer cet itinéraire ?',
      editRoute: "Modifier l'itinéraire",
      routeDetails: "Détails de l'itinéraire",
      exportRoute: 'Exporter',
      exportGeoJSON: 'Exporter GeoJSON',
      exportGPX: 'Exporter GPX',
      exportSuccess: 'Itinéraire exporté',
      exportError: "Erreur d'exportation",
      favorites: 'Favoris',
      allRoutes: 'Tous les itinéraires',
      waypoints: 'Points de passage',
      waypointLabel: 'Point {{number}}',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      showOnMap: 'Afficher sur la carte',
      loadRoute: "Charger l'itinéraire",
      draftRoute: 'Itinéraire brouillon',
      newRoute: 'Nouvel itinéraire',
      unsaved: 'Non enregistré',
      continueEditing: "Continuer l'édition",
      discard: 'Rejeter',
      draftDiscarded: 'Itinéraire brouillon rejeté',
      profiles: {
        foot: 'À pied',
        bicycle: 'Vélo',
        car: 'Voiture',
      },
    },

    // Tours page
    tours: {
      title: 'Circuits',
      subtitle: 'Circuits organisés',
      noToursTitle: 'Aucun circuit disponible',
      noToursHint:
        'Des itinéraires prêts dans les villes polonaises bientôt disponibles',
      comingSoon: 'Bientôt disponible!',
      error: 'Échec du chargement des circuits',
      stops: 'arrêts',
      stopsOnRoute: 'Arrêts sur le parcours',
      showMap: 'Afficher la carte',
      hideMap: 'Masquer la carte',
      startTour: 'Commencer le circuit',
      allCategories: 'Tous',
      category: {
        history: 'Histoire',
        architecture: 'Architecture',
        art: 'Art',
        food: 'Gastronomie',
        nature: 'Nature',
      },
      difficulty: {
        easy: 'Facile',
        medium: 'Moyen',
        hard: 'Difficile',
      },
      krakow: {
        landmarks: {
          name: 'Monuments principaux de Cracovie',
          description:
            'Promenade dans le centre de Cracovie avec visite des monuments les plus importants',
        },
        churches: {
          name: 'Églises historiques de Cracovie',
          description:
            'Découvrez les plus belles églises de Cracovie, du gothique au baroque',
        },
      },
      warszawa: {
        landmarks: {
          name: 'Monuments principaux de Varsovie',
          description:
            'Exploration de la capitale polonaise - de la Vieille Ville aux Bains Royaux',
        },
        churches: {
          name: 'Églises historiques de Varsovie',
          description:
            'Découvrez les églises les plus importantes de Varsovie et leur riche histoire',
        },
      },
      wroclaw: {
        landmarks: {
          name: 'Monuments principaux de Wrocław',
          description:
            'Promenade dans le pittoresque Wrocław - de la Place du Marché à Ostrów Tumski',
        },
        churches: {
          name: 'Églises historiques de Wrocław',
          description:
            "Découvrez les perles gothiques de l'architecture sacrée de Wrocław",
        },
      },
      trojmiasto: {
        landmarks: {
          name: 'Monuments principaux de Gdańsk',
          description:
            'Promenade à Gdańsk - la principale ville de Tri-City avec une riche histoire',
        },
        churches: {
          name: 'Églises historiques de Gdańsk',
          description:
            'Découvrez les églises monumentales de Gdańsk, dont la plus grande basilique en brique du monde',
        },
      },
    },

    // Settings page
    settings: {
      title: 'Paramètres',
      appearance: 'Apparence',
      darkMode: 'Mode sombre',
      language: 'Langue',
      navigation: 'Navigation',
      defaultCity: 'Ville par défaut',
      defaultProfile: 'Profil par défaut',
      units: 'Unités',
      unitsKm: 'Kilomètres',
      unitsMiles: 'Miles',
      about: 'À propos',
      version: 'Version',
      appName: 'WTG Route Machine',
    },

    // POI
    poi: {
      addToRoute: "Ajouter à l'itinéraire",
      addToRouteAndGo: "Ajouter et aller à l'itinéraire",
      navigate: 'Naviguer',
      added: '"{{name}}" ajouté à l\'itinéraire',
      categories: {
        landmark: 'Monument',
        museum: 'Musée',
        park: 'Parc',
        restaurant: 'Restaurant',
        cafe: 'Café',
        hotel: 'Hôtel',
        viewpoint: 'Point de vue',
        church: 'Église',
      },
    },

    // Route planning
    route: {
      distance: 'Distance',
      duration: 'Durée',
      calculating: "Calcul de l'itinéraire...",
      noWaypoints: 'Aucun point',
      addWaypointsHint: 'Appuyez sur la carte pour ajouter des points',
      minWaypoints: 'Minimum 2 points requis',
      clearAll: 'Tout effacer',
      start: 'Départ',
      destination: 'Destination',
      stopover: 'Étape {{number}}',
      hours: 'h',
      minutes: 'min',
      profiles: {
        foot: 'À pied',
        bicycle: 'Vélo',
        car: 'Voiture',
      },
    },

    // Cities
    cities: {
      krakow: 'Cracovie',
      warszawa: 'Varsovie',
      wroclaw: 'Wrocław',
      trojmiasto: 'Tri-Ville',
      selectCity: 'Sélectionner une ville',
    },

    // Navigation instructions
    navigation: {
      turn: 'Tourner',
      left: 'à gauche',
      right: 'à droite',
      slightLeft: 'légèrement à gauche',
      slightRight: 'légèrement à droite',
      sharpLeft: 'fortement à gauche',
      sharpRight: 'fortement à droite',
      straight: 'tout droit',
      uturn: 'faire demi-tour',
      continue: 'Continuer',
      depart: "Démarrer l'itinéraire",
      arrive: 'Vous êtes arrivé',
      merge: 'Rejoindre',
      roundabout: 'Au rond-point',
      exitRoundabout: 'Sortir du rond-point',
      onStreet: 'sur {{street}}',
    },

    // Saved routes
    savedRoutes: {
      saveRoute: "Enregistrer l'itinéraire",
      routeName: "Nom de l'itinéraire",
      routeNamePlaceholder: 'Ex., Promenade dans la vieille ville',
      routeDescription: 'Description (facultatif)',
      routeDescriptionPlaceholder:
        "Informations supplémentaires sur l'itinéraire...",
      routeSummary: "Résumé de l'itinéraire",
      waypoints: 'points',
      city: 'Ville',
      profile: 'Profil',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet itinéraire ?',
      deleteConfirmTitle: "Supprimer l'itinéraire",
      routeSaved: "L'itinéraire a été enregistré",
      routeDeleted: "L'itinéraire a été supprimé",
    },

    // Errors
    errors: {
      locationDenied: 'Accès à la localisation refusé',
      locationUnavailable: 'Localisation indisponible',
      networkError: 'Erreur réseau',
      routeError: "Impossible de calculer l'itinéraire",
      unknown: 'Erreur inconnue',
    },
  },
};

export default fr;
