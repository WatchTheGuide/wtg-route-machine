// Ukrainian translations
const uk = {
  translation: {
    // Common
    common: {
      loading: 'Завантаження...',
      error: 'Сталася помилка',
      cancel: 'Скасувати',
      save: 'Зберегти',
      delete: 'Видалити',
      edit: 'Редагувати',
      close: 'Закрити',
      search: 'Пошук',
      back: 'Назад',
      comingSoon: 'Скоро буде...',
    },

    // Dashboard
    dashboard: {
      title: 'Адмін-панель',
      subtitle: 'Керування екскурсіями та визначними місцями',
      allCities: 'Усі міста',
      selectCity: 'Оберіть місто',
      nav: {
        dashboard: 'Головна',
        tours: 'Екскурсії',
        pois: 'POI',
        settings: 'Налаштування',
        logout: 'Вийти',
      },
      stats: {
        tours: 'Екскурсії',
        pois: 'POI',
        cities: 'Міста',
        views: 'Перегляди',
        thisMonth: 'цього місяця',
        active: 'Активні',
        total: 'Всього',
        fromLastMonth: 'з минулого місяця',
      },
      citySelector: {
        label: 'Місто',
        all: 'Усі міста',
        placeholder: 'Оберіть місто',
      },
      charts: {
        toursOverTime: 'Екскурсії з часом',
        toursOverTimeDesc: 'Кількість екскурсій та POI за місяць',
        toursByCity: 'Екскурсії за містом',
        toursByCityDesc: 'Перегляди за містом',
        viewsPerCity: 'Перегляди за містом',
        viewsPerCityDesc: 'Загальна кількість переглядів для кожного міста',
      },
      quickActions: {
        title: 'Швидкі дії',
        addTour: 'Додати екскурсію',
        addPoi: 'Додати POI',
        viewStats: 'Переглянути статистику',
        managePois: 'Керувати POI',
        viewReports: 'Переглянути звіти',
        analytics: 'Аналітика',
      },
      topTours: {
        title: 'Топ екскурсії',
        subtitle: 'Найбільш переглядані екскурсії',
        views: 'Перегляди',
      },
      status: {
        published: 'Опубліковано',
        draft: 'Чернетка',
      },
      recentTours: {
        title: 'Останні екскурсії',
        subtitle: 'Нещодавно додані та відредаговані екскурсії',
        name: 'Назва',
        city: 'Місто',
        status: 'Статус',
      },
      activity: {
        title: 'Остання активність',
        subtitle: 'Історія змін у системі',
        created: 'створив',
        updated: 'оновив',
        published: 'опублікував',
        deleted: 'видалив',
      },
    },

    // Tours page
    tours: {
      title: 'Екскурсії',
      subtitle: 'Керування пішохідними екскурсіями',
      listTitle: 'Список екскурсій',
    },

    // POIs page
    pois: {
      title: 'Визначні місця',
      subtitle: 'Керування туристичними визначними місцями',
      listTitle: 'Список POI',
    },

    // Settings page
    settings: {
      title: 'Налаштування',
      subtitle: 'Конфігурація адмін-панелі',
      generalTitle: 'Загальні налаштування',
    },

    // Navbar
    nav: {
      features: 'Функції',
      cities: 'Міста',
      about: 'Про проєкт',
      adminPanel: 'Адмін-панель',
    },

    // Hero section
    hero: {
      badge: 'Open Source маршрутизація',
      title: 'Пішохідні екскурсії',
      titleHighlight: 'Просто і зручно',
      description:
        'Легка маршрутизація на основі OSRM для пішохідної навігації. Відкрийте пішохідні маршрути польськими містами з оптимізованими маршрутами та визначними місцями.',
      exploreCities: 'Дослідити міста',
      viewOnGithub: 'Переглянути на GitHub',
    },

    // Features section
    features: {
      title: 'Потужні можливості',
      subtitle:
        'Створено з використанням сучасних технологій для найкращого досвіду.',
      pedestrianRouting: {
        title: 'Пішохідна маршрутизація',
        description:
          'Оптимізовані профілі для пішохідних маршрутів з точними оцінками часу та відстані.',
      },
      poi: {
        title: 'Визначні місця',
        description:
          "Курована база POI з пам'ятками, музеями, ресторанами та прихованими скарбами.",
      },
      mobile: {
        title: 'Мобільний додаток',
        description:
          'Мобільний додаток Ionic React з офлайн-підтримкою та покроковою навігацією.',
      },
      multiCity: {
        title: 'Багато міст',
        description:
          'Масштабована архітектура, що підтримує кілька міст з індивідуальними двигунами маршрутизації.',
      },
    },

    // Cities section
    cities: {
      title: 'Дослідіть міста',
      subtitle: 'Знайдіть пішохідні маршрути найкрасивішими містами Польщі.',
      toursAvailable: '{{count}} екскурсій доступно',
      krakow: {
        name: 'Краків',
        description: 'Історична королівська столиця з вражаючою архітектурою',
      },
      warszawa: {
        name: 'Варшава',
        description: 'Сучасна столиця, що поєднує історію та інновації',
      },
      wroclaw: {
        name: 'Вроцлав',
        description: 'Місто мостів та чарівних статуй гномів',
      },
      trojmiasto: {
        name: 'Тримісто',
        description: 'Балтійське тріо: Гданськ, Сопот, Гдиня',
      },
    },

    // About section
    about: {
      title: 'Про проєкт',
      paragraph1:
        'WTG Route Machine — це проєкт з відкритим кодом, який забезпечує професійні можливості маршрутизації для міських пішохідних екскурсій. Побудований на OSRM (Open Source Routing Machine), він забезпечує швидку та точну пішохідну навігацію.',
      paragraph2:
        'Проєкт включає легкий бекенд, оптимізований для розгортання на AWS, мобільний додаток на Ionic React та Capacitor, а також адмін-панель для управління екскурсіями та визначними місцями.',
      paragraph3:
        'Наша мета — зробити міські дослідження доступними та приємними для всіх, чи ви турист, що відкриває нове місто, чи місцевий житель, який шукає приховані скарби.',
      stats: {
        cities: 'Міста',
        tours: 'Екскурсії',
        pois: 'POI',
        openSource: 'Open Source',
      },
    },

    // Footer
    footer: {
      description:
        'Open-source маршрутизація міських пішохідних екскурсій на базі OSRM. Створено дослідниками для дослідників.',
      links: 'Посилання',
      project: 'Проєкт',
      copyright: '© {{year}} WatchTheGuide. Open source під ліцензією MIT.',
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
        title: 'Увійти',
        subtitle:
          'Введіть свої облікові дані для доступу до панелі адміністратора',
        email: 'Email',
        emailPlaceholder: 'admin@example.com',
        password: 'Пароль',
        passwordPlaceholder: 'Введіть пароль',
        rememberMe: "Запам'ятати мене",
        forgotPassword: 'Забули пароль?',
        submit: 'Увійти',
        signingIn: 'Вхід...',
        backToHome: 'Повернутися на головну',
        error: 'Невірний email або пароль',
        demoCredentials: 'Використовуйте демо-дані:',
      },
      logout: 'Вийти',
      validation: {
        emailRequired: "Email обов'язковий",
        emailInvalid: 'Невірна адреса email',
        passwordRequired: "Пароль обов'язковий",
        passwordMinLength: 'Пароль повинен містити принаймні 6 символів',
      },
    },
  },
};

export default uk;
