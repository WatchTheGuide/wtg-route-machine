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
      addTour: 'Додати екскурсію',
      export: 'Експортувати',
      sortBy: 'Сортувати за',
      showing: 'Показано {{from}}-{{to}} з {{total}}',
      selected: 'Вибрано: {{count}}',
      selectAll: 'Вибрати всі',
      selectTour: 'Вибрати екскурсію: {{name}}',
      noResults: 'Екскурсій не знайдено',
      bulkPublish: 'Опублікувати',
      bulkDelete: 'Видалити вибрані',
      filters: {
        title: 'Фільтри',
        clear: 'Очистити фільтри',
        searchPlaceholder: 'Пошук екскурсій...',
        city: 'Місто',
        allCities: 'Усі міста',
        category: 'Категорія',
        allCategories: 'Усі категорії',
        status: 'Статус',
        allStatuses: 'Усі статуси',
        difficulty: 'Складність',
        allDifficulties: 'Усі рівні',
      },
      table: {
        name: 'Назва',
        city: 'Місто',
        category: 'Категорія',
        difficulty: 'Складність',
        pois: 'POI',
        views: 'Перегляди',
        status: 'Статус',
        actions: 'Дії',
      },
      sort: {
        updatedAt: 'Дата оновлення',
        createdAt: 'Дата створення',
        name: 'Назва',
        views: 'Перегляди',
        poisCount: 'Кількість POI',
      },
      categories: {
        historical: 'Історичні',
        cultural: 'Культурні',
        nature: 'Природа',
        architecture: 'Архітектура',
        religious: 'Релігійні',
        nightlife: 'Нічне життя',
        urban: 'Міські',
      },
      status: {
        published: 'Опубліковано',
        draft: 'Чернетка',
        archived: 'Архівовано',
      },
      difficulty: {
        easy: 'Легка',
        medium: 'Середня',
        hard: 'Складна',
      },
      actions: {
        menu: 'Меню дій',
        preview: 'Перегляд',
        edit: 'Редагувати',
        duplicate: 'Дублювати',
        delete: 'Видалити',
      },
      pagination: {
        perPage: 'На сторінку',
        page: 'Сторінка {{current}} з {{total}}',
      },
      deleteDialog: {
        title: 'Ви впевнені, що хочете видалити?',
        description:
          'Ця дія незворотна. Екскурсію "{{name}}" буде остаточно видалено.',
      },
    },

    // Tour Editor
    tourEditor: {
      createTitle: 'Нова екскурсія',
      editTitle: 'Редагувати екскурсію',
      lastSaved: 'Останнє збереження: {{time}}',
      unsavedChanges: 'Незбережені зміни',
      autoSaved: 'Чернетку збережено автоматично',
      saved: 'Екскурсію збережено',
      published: 'Екскурсію опубліковано',
      deleted: 'Екскурсію видалено',
      saveDraft: 'Зберегти чернетку',
      publish: 'Опублікувати',
      previewButton: 'Перегляд',
      tabs: {
        basic: 'Основне',
        media: 'Медіа',
        details: 'Деталі',
        waypoints: 'Точки маршруту',
        settings: 'Налаштування',
      },
      basicInfo: {
        title: 'Основна інформація',
        description: 'Введіть основну інформацію про екскурсію.',
      },
      media: {
        title: 'Фото та медіа',
        description: 'Додайте фотографії до екскурсії.',
        dropzone: 'Перетягніть фотографії сюди або натисніть для вибору',
        browse: 'Вибрати файли',
      },
      details: {
        title: 'Деталі екскурсії',
        description: 'Встановіть тривалість та теги.',
      },
      waypoints: {
        title: 'Точки маршруту',
        description: 'Визначте точки на маршруті екскурсії.',
        jsonNote:
          'Візуальний редактор карти буде доступний у майбутньому. Поки що введіть точки маршруту у форматі JSON.',
      },
      settings: {
        title: 'Налаштування публікації',
        description: 'Керуйте статусом та видимістю екскурсії.',
      },
      fields: {
        name: 'Назва екскурсії',
        description: 'Опис',
        city: 'Місто',
        category: 'Категорія',
        difficulty: 'Складність',
        duration: 'Тривалість',
        tags: 'Теги',
        waypointsJson: 'Точки маршруту (JSON)',
        status: 'Статус',
        featured: 'Рекомендована екскурсія',
      },
      placeholders: {
        name: 'Напр. Королівська дорога',
        description: 'Опишіть екскурсію...',
        city: 'Виберіть місто',
        category: 'Виберіть категорію',
        tags: 'Введіть тег і натисніть Enter',
        waypoints:
          '[\n  {\n    "id": "1",\n    "name": "Початкова точка",\n    "coordinates": [19.9373, 50.0619],\n    "order": 1\n  }\n]',
      },
      hints: {
        name: 'Від 5 до 100 символів',
        description: '{{current}}/{{max}} символів (мін. {{min}})',
        duration:
          'Перетягніть повзунок, щоб встановити орієнтовну тривалість екскурсії',
        tags: 'Натисніть Enter, щоб додати тег. Натисніть на тег, щоб видалити його.',
        waypoints:
          'Формат JSON з масивом точок маршруту. Кожна точка вимагає id, name, coordinates та order.',
        status:
          'Чернетки не видимі для користувачів. Опубліковані екскурсії доступні в додатку.',
        featured: 'Рекомендовані екскурсії виділяються на головній сторінці.',
      },
      validation: {
        nameMin: 'Назва повинна містити щонайменше 5 символів',
        nameMax: 'Назва може містити максимум 100 символів',
        descriptionMin: 'Опис повинен містити щонайменше 50 символів',
        descriptionMax: 'Опис може містити максимум 2000 символів',
        cityRequired: 'Будь ласка, виберіть місто',
        categoryRequired: 'Будь ласка, виберіть категорію',
      },
      preview: {
        title: 'Перегляд',
        description: 'Попередній перегляд екскурсії в реальному часі',
        mapPlaceholder: "Карта маршруту з'явиться тут",
        city: 'Місто',
        category: 'Категорія',
        duration: 'Тривалість',
        status: 'Статус',
      },
      exitDialog: {
        title: 'Незбережені зміни',
        description:
          'У вас є незбережені зміни. Ви впевнені, що хочете вийти без збереження?',
        confirm: 'Вийти без збереження',
      },
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

    // Map Editor
    mapEditor: {
      title: 'Редактор карти',
      newWaypoint: 'Точка {{number}}',
      importedWaypoint: 'Імпортовано {{number}}',
      routeCalculated: 'Маршрут розраховано',
      layers: {
        streets: 'Вулиці',
        satellite: 'Супутник',
        terrain: 'Рельєф',
      },
      addWaypoint: 'Додати точку',
      deleteWaypoint: 'Видалити обрану точку',
      fitToWaypoints: 'Підлаштувати до точок',
      clickToAdd: 'Натисніть на карту, щоб додати точку',
      calculateRoute: 'Розрахувати маршрут',
      import: 'Імпорт',
      export: 'Експорт',
    },

    // Waypoints List
    waypointsList: {
      title: 'Точки маршруту',
      empty: 'Немає точок',
      emptyHint:
        'Натисніть на карту або використайте "Додати точку", щоб додати першу точку.',
      name: 'Назва',
      description: 'Опис',
      stopDuration: 'Тривалість зупинки',
      minutes: 'хвилин',
      coordinates: 'Координати',
      actions: 'Дії',
      calculateRoute: 'Розрахувати маршрут',
      import: 'Імпортувати',
      export: 'Експортувати',
      importedWaypoint: 'Імпортований {{number}}',
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
      errors: {
        invalidCredentials: 'Невірний email або пароль',
        networkError: "Помилка з'єднання. Спробуйте ще раз.",
        tooManyAttempts: 'Забагато спроб входу. Зачекайте та спробуйте знову.',
        sessionExpired: 'Сесія закінчилася. Увійдіть знову.',
      },
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
