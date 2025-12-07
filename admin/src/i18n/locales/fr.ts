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
    },

    // Dashboard
    dashboard: {
      title: 'Tableau de bord Admin',
      subtitle: "Gérer les circuits et points d'intérêt",
      nav: {
        dashboard: 'Tableau de bord',
        tours: 'Circuits',
        pois: 'POIs',
        settings: 'Paramètres',
        logout: 'Déconnexion',
      },
      stats: {
        tours: 'Circuits',
        pois: 'POIs',
        cities: 'Villes',
        views: 'Vues',
        thisMonth: 'ce mois-ci',
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
    },

    // POIs page
    pois: {
      title: "Points d'intérêt",
      subtitle: "Gérer les points d'intérêt touristiques",
      listTitle: 'Liste des POIs',
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
        email: 'E-mail',
        emailPlaceholder: 'admin@example.com',
        password: 'Mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        submit: 'Se connecter',
        signingIn: 'Connexion en cours...',
        backToHome: "Retour à l'accueil",
        error: 'E-mail ou mot de passe incorrect',
        demoCredentials: 'Utilisez les identifiants de démonstration :',
      },
      logout: 'Déconnexion',
      validation: {
        emailRequired: "L'e-mail est requis",
        emailInvalid: 'Adresse e-mail invalide',
        passwordRequired: 'Le mot de passe est requis',
        passwordMinLength:
          'Le mot de passe doit contenir au moins 6 caractères',
      },
    },
  },
};

export default fr;
