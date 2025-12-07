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
  },
};

export default fr;
