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
      clear: 'Очистити',
      search: 'Пошук',
      ok: 'OK',
    },

    // Tabs
    tabs: {
      explore: 'Дослідити',
      routes: 'Маршрути',
      tours: 'Екскурсії',
      settings: 'Налаштування',
    },

    // Explore page
    explore: {
      title: 'Дослідити',
      locateMe: 'Знайти мене',
    },

    // Routes page
    routes: {
      title: 'Мої маршрути',
      noRoutes: 'Немає збережених маршрутів',
      noRoutesHint: 'Сплануйте маршрут, натиснувши кнопку +',
      planRoute: 'Планування маршруту',
      clearAll: 'Очистити',
      startNavigation: 'Почати навігацію',
      saveRoute: 'Зберегти маршрут',
      routeName: 'Назва маршруту',
      routeNamePlaceholder: 'напр. Прогулянка Старим містом',
      routeDescription: 'Опис (необов’язково)',
      routeDescriptionPlaceholder: 'Додати опис маршруту...',
      savedSuccessfully: 'Маршрут збережено',
      deleteRoute: 'Видалити маршрут',
      deleteConfirm: 'Ви впевнені, що хочете видалити цей маршрут?',
      editRoute: 'Редагувати маршрут',
      routeDetails: 'Деталі маршруту',
      exportRoute: 'Експортувати',
      exportGeoJSON: 'Експорт GeoJSON',
      exportGPX: 'Експорт GPX',
      exportSuccess: 'Маршрут експортовано',
      exportError: 'Помилка експорту',
      favorites: 'Улюблені',
      allRoutes: 'Всі маршрути',
      waypoints: 'Точки маршруту',
      waypointLabel: 'Точка {{number}}',
      createdAt: 'Створено',
      updatedAt: 'Оновлено',
      showOnMap: 'Показати на карті',
      loadRoute: 'Завантажити маршрут',
    },

    // Tours page
    tours: {
      title: 'Екскурсії',
      subtitle: 'Підготовлені екскурсії',
      noTours: 'Немає доступних екскурсій',
      noToursHint:
        'Незабаром будуть доступні готові маршрути польськими містами',
      comingSoon: 'Скоро!',
    },

    // Settings page
    settings: {
      title: 'Налаштування',
      appearance: 'Зовнішній вигляд',
      darkMode: 'Темний режим',
      language: 'Мова',
      navigation: 'Навігація',
      defaultCity: 'Місто за замовчуванням',
      defaultProfile: 'Профіль за замовчуванням',
      units: 'Одиниці',
      unitsKm: 'Кілометри',
      unitsMiles: 'Милі',
      about: 'Про програму',
      version: 'Версія',
      appName: 'WTG Route Machine',
    },

    // POI
    poi: {
      addToRoute: 'Додати до маршруту',
      addToRouteAndGo: 'Додати і перейти до маршруту',
      navigate: 'Навігація',
      added: '"{{name}}" додано до маршруту',
      categories: {
        landmark: "Пам'ятка",
        museum: 'Музей',
        park: 'Парк',
        restaurant: 'Ресторан',
        cafe: "Кав'ярня",
        hotel: 'Готель',
        viewpoint: 'Оглядовий майданчик',
        church: 'Церква',
      },
    },

    // Route planning
    route: {
      distance: 'Відстань',
      duration: 'Час',
      calculating: 'Розрахунок маршруту...',
      noWaypoints: 'Немає точок',
      addWaypointsHint: 'Натисніть на карту, щоб додати точки',
      minWaypoints: 'Потрібно мінімум 2 точки',
      clearAll: 'Очистити все',
      start: 'Старт',
      destination: 'Пункт призначення',
      stopover: 'Зупинка {{number}}',
      hours: 'год.',
      minutes: 'хв',
      profiles: {
        foot: 'Пішки',
        bicycle: 'Велосипед',
        car: 'Автомобіль',
      },
    },

    // Cities
    cities: {
      krakow: 'Краків',
      warszawa: 'Варшава',
      wroclaw: 'Вроцлав',
      trojmiasto: 'Тримісто',
      selectCity: 'Вибрати місто',
    },

    // Navigation instructions
    navigation: {
      turn: 'Поверніть',
      left: 'ліворуч',
      right: 'праворуч',
      slightLeft: 'трохи ліворуч',
      slightRight: 'трохи праворуч',
      sharpLeft: 'різко ліворуч',
      sharpRight: 'різко праворуч',
      straight: 'прямо',
      uturn: 'розворот',
      continue: 'Продовжуйте',
      depart: 'Почати маршрут',
      arrive: 'Ви прибули',
      merge: 'Приєднайтесь',
      roundabout: 'На круговому русі',
      exitRoundabout: 'Виїжджайте з кругового руху',
      onStreet: 'на {{street}}',
    },

    // Saved routes
    savedRoutes: {
      saveRoute: 'Зберегти маршрут',
      routeName: 'Назва маршруту',
      routeNamePlaceholder: 'Напр., Прогулянка Старим містом',
      routeDescription: 'Опис (необов’язково)',
      routeDescriptionPlaceholder: 'Додаткова інформація про маршрут...',
      routeSummary: 'Підсумок маршруту',
      waypoints: 'точки',
      city: 'Місто',
      profile: 'Профіль',
      deleteConfirm: 'Ви впевнені, що хочете видалити цей маршрут?',
      deleteConfirmTitle: 'Видалити маршрут',
      routeSaved: 'Маршрут збережено',
      routeDeleted: 'Маршрут видалено',
    },

    // Errors
    errors: {
      locationDenied: 'Доступ до місцезнаходження заборонено',
      locationUnavailable: 'Місцезнаходження недоступне',
      networkError: 'Помилка мережі',
      routeError: 'Не вдалося розрахувати маршрут',
      unknown: 'Невідома помилка',
    },
  },
};

export default uk;
