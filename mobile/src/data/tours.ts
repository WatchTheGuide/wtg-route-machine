import type { Tour } from '../types';

/**
 * Curated tours for all cities
 * Each city has 2 tours:
 * 1. Main landmarks (walking, ~3h with visiting time)
 * 2. Historic churches (walking, max 4h with visiting time)
 */
export const TOURS: Tour[] = [
  // Kraków - Najważniejsze zabytki
  {
    id: 'krakow-landmarks',
    name: 'tours.krakow.landmarks.name',
    description: 'tours.krakow.landmarks.description',
    cityId: 'krakow',
    category: 'history',
    difficulty: 'easy',
    distance: 5200, // ~5.2 km
    duration: 10800, // 3h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'krakow-rynek',
        name: 'Rynek Główny',
        description: 'Największy średniowieczny rynek w Europie',
        category: 'landmark',
        coordinate: [19.938, 50.0619],
        address: 'Rynek Główny, Kraków',
      },
      {
        id: 'krakow-sukiennice',
        name: 'Sukiennice',
        description: 'Zabytkowe hale targowe z XVI wieku',
        category: 'landmark',
        coordinate: [19.9375, 50.0617],
        address: 'Rynek Główny 1/3, Kraków',
      },
      {
        id: 'krakow-mariacki',
        name: 'Kościół Mariacki',
        description: 'Gotycka bazylika z XIV wieku, słynący z hejnału',
        category: 'landmark',
        coordinate: [19.9395, 50.0618],
        address: 'plac Mariacki 5, Kraków',
      },
      {
        id: 'krakow-wawel',
        name: 'Zamek Królewski na Wawelu',
        description: 'Rezydencja królów polskich, symbol narodowy',
        category: 'landmark',
        coordinate: [19.9355, 50.0544],
        address: 'Wawel 5, Kraków',
      },
      {
        id: 'krakow-katedra',
        name: 'Katedra Wawelska',
        description: 'Miejsce koronacji i pochówków królów polskich',
        category: 'landmark',
        coordinate: [19.9349, 50.0542],
        address: 'Wawel 3, Kraków',
      },
      {
        id: 'krakow-kazimierz',
        name: 'Kazimierz',
        description: 'Historyczna dzielnica żydowska',
        category: 'landmark',
        coordinate: [19.9496, 50.0519],
        address: 'Szeroka 24, Kraków',
      },
    ],
  },

  // Kraków - Najważniejsze kościoły
  {
    id: 'krakow-churches',
    name: 'tours.krakow.churches.name',
    description: 'tours.krakow.churches.description',
    cityId: 'krakow',
    category: 'architecture',
    difficulty: 'medium',
    distance: 6800, // ~6.8 km
    duration: 14400, // 4h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'krakow-mariacki-church',
        name: 'Bazylika Mariacka',
        description: 'Gotycka bazylika z ołtarzem Wita Stwosza',
        category: 'landmark',
        coordinate: [19.9395, 50.0618],
        address: 'plac Mariacki 5, Kraków',
      },
      {
        id: 'krakow-katedra-church',
        name: 'Katedra na Wawelu',
        description: 'Sanktuarium narodowe Polski',
        category: 'landmark',
        coordinate: [19.9349, 50.0542],
        address: 'Wawel 3, Kraków',
      },
      {
        id: 'krakow-franciszkanska',
        name: 'Bazylika Franciszkanów',
        description: 'Kościół z witrażami Stanisława Wyspiańskiego',
        category: 'landmark',
        coordinate: [19.9375, 50.0573],
        address: 'Plac Wszystkich Świętych 5, Kraków',
      },
      {
        id: 'krakow-piotra-pawla',
        name: 'Kościół św. Piotra i Pawła',
        description: 'Najpiękniejszy barokowy kościół w Krakowie',
        category: 'landmark',
        coordinate: [19.9373, 50.0551],
        address: 'Grodzka 52A, Kraków',
      },
      {
        id: 'krakow-sw-andrzeja',
        name: 'Kościół św. Andrzeja',
        description: 'Najstarsza romańska budowla w Krakowie',
        category: 'landmark',
        coordinate: [19.9371, 50.0548],
        address: 'Grodzka 54, Kraków',
      },
      {
        id: 'krakow-bozego-ciala',
        name: 'Kościół Bożego Ciała',
        description: 'Gotycka świątynia w Kazimierzu',
        category: 'landmark',
        coordinate: [19.9505, 50.051],
        address: 'Bożego Ciała 26, Kraków',
      },
    ],
  },

  // Warszawa - Najważniejsze zabytki
  {
    id: 'warszawa-landmarks',
    name: 'tours.warszawa.landmarks.name',
    description: 'tours.warszawa.landmarks.description',
    cityId: 'warszawa',
    category: 'history',
    difficulty: 'easy',
    distance: 5500, // ~5.5 km
    duration: 10800, // 3h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'warszawa-stare-miasto',
        name: 'Stare Miasto',
        description: 'Odbudowane historyczne centrum Warszawy (UNESCO)',
        category: 'landmark',
        coordinate: [21.0122, 52.2496],
        address: 'Rynek Starego Miasta, Warszawa',
      },
      {
        id: 'warszawa-zamek',
        name: 'Zamek Królewski',
        description: 'Dawna rezydencja królewska, obecnie muzeum',
        category: 'landmark',
        coordinate: [21.0145, 52.2477],
        address: 'plac Zamkowy 4, Warszawa',
      },
      {
        id: 'warszawa-kolumna-zygmunta',
        name: 'Kolumna Zygmunta',
        description: 'Najstarszy pomnik świecki w Warszawie',
        category: 'landmark',
        coordinate: [21.014, 52.2478],
        address: 'plac Zamkowy, Warszawa',
      },
      {
        id: 'warszawa-lazienki',
        name: 'Łazienki Królewskie',
        description: 'Najpiękniejszy park w Warszawie z pałacem',
        category: 'park',
        coordinate: [21.0356, 52.2154],
        address: 'Agrykoli 1, Warszawa',
      },
      {
        id: 'warszawa-palac-kultury',
        name: 'Pałac Kultury i Nauki',
        description: 'Najwyższy budynek w Polsce, symbol Warszawy',
        category: 'landmark',
        coordinate: [21.0061, 52.2319],
        address: 'plac Defilad 1, Warszawa',
      },
      {
        id: 'warszawa-wilanow',
        name: 'Pałac w Wilanowie',
        description: 'Barokowa rezydencja króla Jana III Sobieskiego',
        category: 'landmark',
        coordinate: [21.0909, 52.1654],
        address: 'Stanisława Kostki Potockiego 10/16, Warszawa',
      },
    ],
  },

  // Warszawa - Najważniejsze kościoły
  {
    id: 'warszawa-churches',
    name: 'tours.warszawa.churches.name',
    description: 'tours.warszawa.churches.description',
    cityId: 'warszawa',
    category: 'architecture',
    difficulty: 'medium',
    distance: 7200, // ~7.2 km
    duration: 14400, // 4h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'warszawa-archikatedra',
        name: 'Archikatedra św. Jana',
        description: 'Najstarsza i najważniejsza świątynia Warszawy',
        category: 'landmark',
        coordinate: [21.0157, 52.2499],
        address: 'Kanonia 6, Warszawa',
      },
      {
        id: 'warszawa-sw-krzyza',
        name: 'Kościół św. Krzyża',
        description: 'Barokowa świątynia z sercem Chopina',
        category: 'landmark',
        coordinate: [21.0152, 52.2394],
        address: 'Krakowskie Przedmieście 3, Warszawa',
      },
      {
        id: 'warszawa-karmelitow',
        name: 'Kościół Karmelitów',
        description: 'Barokowy kościół z neoklasyczną fasadą',
        category: 'landmark',
        coordinate: [21.0147, 52.2411],
        address: 'Krakowskie Przedmieście 52/54, Warszawa',
      },
      {
        id: 'warszawa-wizytek',
        name: 'Kościół Wizytek',
        description: 'Rokokowa świątynia sióstr Wizytacji',
        category: 'landmark',
        coordinate: [21.0146, 52.2424],
        address: 'Krakowskie Przedmieście 34, Warszawa',
      },
      {
        id: 'warszawa-aleksandrowska',
        name: 'Kościół św. Aleksandra',
        description: 'Neoklasycystyczna rotunda na placu Trzech Krzyży',
        category: 'landmark',
        coordinate: [21.0202, 52.2287],
        address: 'plac Trzech Krzyży 3, Warszawa',
      },
      {
        id: 'warszawa-zbawiciela',
        name: 'Kościół św. Zbawiciela',
        description: 'Neobarokowa świątynia na placu Zbawiciela',
        category: 'landmark',
        coordinate: [21.0258, 52.2209],
        address: 'plac Zbawiciela 1, Warszawa',
      },
    ],
  },

  // Wrocław - Najważniejsze zabytki
  {
    id: 'wroclaw-landmarks',
    name: 'tours.wroclaw.landmarks.name',
    description: 'tours.wroclaw.landmarks.description',
    cityId: 'wroclaw',
    category: 'history',
    difficulty: 'easy',
    distance: 4800, // ~4.8 km
    duration: 10800, // 3h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'wroclaw-rynek',
        name: 'Rynek',
        description: 'Malowniczy rynek z kolorowymi kamieniczkami',
        category: 'landmark',
        coordinate: [17.0319, 51.1099],
        address: 'Rynek, Wrocław',
      },
      {
        id: 'wroclaw-ratusz',
        name: 'Ratusz',
        description: 'Gotycki ratusz - perła architektury',
        category: 'landmark',
        coordinate: [17.0326, 51.1097],
        address: 'Rynek-Ratusz 1, Wrocław',
      },
      {
        id: 'wroclaw-ostrow-tumski',
        name: 'Ostrów Tumski',
        description: 'Najstarsza część Wrocławia, wyspa katedralna',
        category: 'landmark',
        coordinate: [17.0456, 51.1149],
        address: 'Ostrów Tumski, Wrocław',
      },
      {
        id: 'wroclaw-katedra',
        name: 'Katedra św. Jana Chrzciciela',
        description: 'Gotycka katedra z panoramą miasta',
        category: 'landmark',
        coordinate: [17.0457, 51.1147],
        address: 'plac Katedralny 18, Wrocław',
      },
      {
        id: 'wroclaw-uniwersytet',
        name: 'Uniwersytet Wrocławski',
        description: 'Barokowy gmach z Aulą Leopoldyńską',
        category: 'landmark',
        coordinate: [17.0432, 51.1123],
        address: 'plac Uniwersytecki 1, Wrocław',
      },
      {
        id: 'wroclaw-hala-stulecia',
        name: 'Hala Stulecia',
        description: 'Modernistyczny obiekt z początku XX wieku (UNESCO)',
        category: 'landmark',
        coordinate: [17.0777, 51.1068],
        address: 'Wystawowa 1, Wrocław',
      },
    ],
  },

  // Wrocław - Najważniejsze kościoły
  {
    id: 'wroclaw-churches',
    name: 'tours.wroclaw.churches.name',
    description: 'tours.wroclaw.churches.description',
    cityId: 'wroclaw',
    category: 'architecture',
    difficulty: 'medium',
    distance: 6500, // ~6.5 km
    duration: 14400, // 4h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'wroclaw-katedra-church',
        name: 'Archikatedra św. Jana Chrzciciela',
        description: 'Pierwsza gotycka świątynia w Polsce',
        category: 'landmark',
        coordinate: [17.0457, 51.1147],
        address: 'plac Katedralny 18, Wrocław',
      },
      {
        id: 'wroclaw-sw-krzyza',
        name: 'Kościół św. Krzyża',
        description: 'Dwupoziomowy gotycki kościół',
        category: 'landmark',
        coordinate: [17.0447, 51.1142],
        address: 'plac św. Krzyża 3, Wrocław',
      },
      {
        id: 'wroclaw-sw-marcina',
        name: 'Kościół św. Marcina',
        description: 'Gotycki kościół z Ostrowa Tumskiego',
        category: 'landmark',
        coordinate: [17.0469, 51.1152],
        address: 'św. Marcina 1, Wrocław',
      },
      {
        id: 'wroclaw-elzbiety',
        name: 'Kościół św. Elżbiety',
        description: 'Gotycka świątynia z wieżą widokową',
        category: 'landmark',
        coordinate: [17.0332, 51.1112],
        address: 'św. Elżbiety 1/2, Wrocław',
      },
      {
        id: 'wroclaw-marii-magdaleny',
        name: 'Kościół św. Marii Magdaleny',
        description: 'Gotycka świątynia z romańskim portalem',
        category: 'landmark',
        coordinate: [17.0341, 51.111],
        address: 'Szewska 10, Wrocław',
      },
      {
        id: 'wroclaw-sw-wojciecha',
        name: 'Kościół św. Wojciecha',
        description: 'Barokowa świątynia jezuitów',
        category: 'landmark',
        coordinate: [17.0352, 51.1092],
        address: 'plac Dominikański 1, Wrocław',
      },
    ],
  },

  // Trójmiasto (Gdańsk) - Najważniejsze zabytki
  {
    id: 'trojmiasto-landmarks',
    name: 'tours.trojmiasto.landmarks.name',
    description: 'tours.trojmiasto.landmarks.description',
    cityId: 'trojmiasto',
    category: 'history',
    difficulty: 'easy',
    distance: 5000, // ~5 km
    duration: 10800, // 3h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'gdansk-dluga',
        name: 'Ulica Długa',
        description: 'Główny trakt reprezentacyjny Gdańska',
        category: 'landmark',
        coordinate: [18.6486, 54.3487],
        address: 'Długa, Gdańsk',
      },
      {
        id: 'gdansk-dwor-artusa',
        name: 'Dwór Artusa',
        description: 'Historyczne miejsce spotkań kupców',
        category: 'landmark',
        coordinate: [18.6535, 54.3487],
        address: 'Długi Targ 43/44, Gdańsk',
      },
      {
        id: 'gdansk-zlota-brama',
        name: 'Złota Brama',
        description: 'Renesansowa brama miejska',
        category: 'landmark',
        coordinate: [18.6464, 54.3489],
        address: 'Długa 1, Gdańsk',
      },
      {
        id: 'gdansk-mariacka',
        name: 'Bazylika Mariacka',
        description: 'Największa ceglana świątynia w Europie',
        category: 'landmark',
        coordinate: [18.6543, 54.3483],
        address: 'Podkramarska 5, Gdańsk',
      },
      {
        id: 'gdansk-zuraw',
        name: 'Żuraw',
        description: 'Średniowieczny dźwig portowy - symbol Gdańska',
        category: 'landmark',
        coordinate: [18.6573, 54.3486],
        address: 'Szeroka 67/68, Gdańsk',
      },
      {
        id: 'gdansk-westerplatte',
        name: 'Westerplatte',
        description: 'Miejsce wybuchu II wojny światowej',
        category: 'landmark',
        coordinate: [18.6783, 54.4061],
        address: 'Westerplatte, Gdańsk',
      },
    ],
  },

  // Trójmiasto (Gdańsk) - Najważniejsze kościoły
  {
    id: 'trojmiasto-churches',
    name: 'tours.trojmiasto.churches.name',
    description: 'tours.trojmiasto.churches.description',
    cityId: 'trojmiasto',
    category: 'architecture',
    difficulty: 'medium',
    distance: 6200, // ~6.2 km
    duration: 14400, // 4h (walking + visiting)
    imageUrl:
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80&auto=format&fit=crop',
    pois: [
      {
        id: 'gdansk-mariacka-church',
        name: 'Bazylika Mariacka',
        description: 'Największa ceglana świątynia świata',
        category: 'landmark',
        coordinate: [18.6543, 54.3483],
        address: 'Podkramarska 5, Gdańsk',
      },
      {
        id: 'gdansk-sw-mikolaja',
        name: 'Kościół św. Mikołaja',
        description: 'Gotycka świątynia z organami barokowymi',
        category: 'landmark',
        coordinate: [18.6524, 54.3495],
        address: 'Świętego Ducha 2, Gdańsk',
      },
      {
        id: 'gdansk-sw-katarzyny',
        name: 'Kościół św. Katarzyny',
        description: 'Najstarsza świątynia Gdańska',
        category: 'landmark',
        coordinate: [18.6549, 54.3501],
        address: 'Profesorska 1, Gdańsk',
      },
      {
        id: 'gdansk-sw-jana',
        name: 'Kościół św. Jana',
        description: 'Gotycka świątynia z kamiennymi sklepieniami',
        category: 'landmark',
        coordinate: [18.652, 54.35],
        address: 'Świętojańska 2, Gdańsk',
      },
      {
        id: 'gdansk-brygidy',
        name: 'Kościół św. Brygidy',
        description: 'Miejsce działalności Solidarności',
        category: 'landmark',
        coordinate: [18.6508, 54.3516],
        address: 'Profesorska 17, Gdańsk',
      },
      {
        id: 'gdansk-oliwa',
        name: 'Katedra Oliwska',
        description: 'Barokowa katedra ze słynnymi organami',
        category: 'landmark',
        coordinate: [18.5576, 54.4031],
        address: 'biskupa Edmunda Nowickiego 5, Gdańsk',
      },
    ],
  },
];
