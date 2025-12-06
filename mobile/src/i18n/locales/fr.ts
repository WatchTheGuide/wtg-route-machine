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
    },

    // Tours page
    tours: {
      title: 'Visites',
      subtitle: 'Visites guidées',
      noTours: 'Aucune visite disponible',
      noToursHint:
        'Des itinéraires prêts à travers les villes polonaises arrivent bientôt',
      comingSoon: 'Bientôt !',
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
