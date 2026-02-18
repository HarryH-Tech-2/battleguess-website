export const battleCoordinates: Record<number, { lat: number; lng: number }> = {
  // ============================================================
  // Colonial & Napoleonic (IDs 1, 8, 12, 26, 30, 143-162)
  // ============================================================
  1: { lat: 50.71, lng: 4.41 },    // Battle of Waterloo - Belgium
  8: { lat: 36.18, lng: -6.02 },   // Battle of Trafalgar - off Cape Trafalgar, Spain
  12: { lat: 49.15, lng: 16.76 },  // Battle of Austerlitz - Slavkov, Czech Republic
  26: { lat: 55.52, lng: 35.82 },  // Battle of Borodino - Russia
  30: { lat: 34.05, lng: 129.33 }, // Battle of Tsushima - Tsushima Strait, Japan/Korea
  143: { lat: 50.93, lng: 11.59 }, // Battle of Jena-Auerstedt - Jena, Germany
  144: { lat: 48.25, lng: 16.56 }, // Battle of Wagram - Marchfeld, Austria
  145: { lat: 51.34, lng: 12.37 }, // Battle of Leipzig - Germany
  146: { lat: 51.04, lng: 16.87 }, // Battle of Leuthen - Silesia, Poland
  147: { lat: 48.63, lng: 10.60 }, // Battle of Blenheim - Bavaria, Germany
  148: { lat: 23.80, lng: 88.41 }, // Battle of Plassey - Bengal, India
  149: { lat: 51.29, lng: 11.78 }, // Battle of Rossbach - Saxony, Germany
  150: { lat: 31.32, lng: 30.07 }, // Battle of the Nile - Aboukir Bay, Egypt
  151: { lat: 44.89, lng: 8.68 },  // Battle of Marengo - Piedmont, Italy
  152: { lat: 42.85, lng: -2.67 }, // Battle of Vitoria - Basque Country, Spain
  153: { lat: 50.40, lng: -1.20 }, // Spanish Armada - English Channel
  154: { lat: 49.70, lng: 4.48 },  // Battle of Rocroi - Ardennes, France
  155: { lat: 49.59, lng: 34.55 }, // Battle of Poltava - Ukraine
  156: { lat: 51.39, lng: 12.30 }, // Battle of Breitenfeld - Saxony, Germany
  157: { lat: 51.25, lng: 12.14 }, // Battle of Lutzen - Saxony, Germany
  158: { lat: 53.72, lng: -6.41 }, // Battle of the Boyne - Ireland
  159: { lat: 38.32, lng: 26.30 }, // Battle of Chesme - Aegean coast, Turkey
  160: { lat: 36.14, lng: -5.35 }, // Siege of Gibraltar - Gibraltar
  161: { lat: 37.02, lng: -8.99 }, // Battle of Cape St Vincent - off Portugal
  162: { lat: 54.38, lng: 20.52 }, // Battle of Friedland - East Prussia (Kaliningrad)

  // ============================================================
  // Ancient Greece & Rome (IDs 2, 10, 14, 18, 20, 27, 28, 56-73)
  // ============================================================
  2: { lat: 38.80, lng: 22.56 },   // Battle of Thermopylae - Greece
  10: { lat: 38.11, lng: 23.97 },  // Battle of Marathon - Greece
  14: { lat: 41.31, lng: 16.13 },  // Battle of Cannae - southeastern Italy
  18: { lat: 36.20, lng: 8.50 },   // Battle of Zama - Tunisia
  20: { lat: 52.41, lng: 8.13 },   // Battle of Teutoburg Forest - Germany
  27: { lat: 37.96, lng: 23.49 },  // Battle of Salamis - Greece
  28: { lat: 47.54, lng: 4.50 },   // Battle of Alesia - Burgundy, France
  56: { lat: 38.22, lng: 23.44 },  // Battle of Plataea - Boeotia, Greece
  57: { lat: 38.37, lng: 23.07 },  // Battle of Leuctra - Boeotia, Greece
  58: { lat: 40.22, lng: 27.17 },  // Battle of the Granicus - Turkey
  59: { lat: 39.30, lng: 22.38 },  // Battle of Pharsalus - Thessaly, Greece
  60: { lat: 43.10, lng: 12.10 },  // Battle of Lake Trasimene - Umbria, Italy
  61: { lat: 39.37, lng: 22.70 },  // Battle of Cynoscephalae - Thessaly, Greece
  62: { lat: 41.68, lng: 26.57 },  // Battle of Adrianople - Thrace, Turkey
  63: { lat: 48.97, lng: 4.37 },   // Battle of the Catalaunian Plains - Chalons, France
  64: { lat: 40.37, lng: 22.62 },  // Battle of Pydna - coastal Greece
  65: { lat: 37.07, lng: 15.29 },  // Siege of Syracuse - Sicily
  66: { lat: 41.94, lng: 12.47 },  // Battle of the Milvian Bridge - Rome, Italy
  67: { lat: 38.50, lng: 22.88 },  // Battle of Chaeronea - Boeotia, Greece
  68: { lat: 45.04, lng: 9.61 },   // Battle of the Trebia - northern Italy
  69: { lat: 43.72, lng: 13.07 },  // Battle of the Metaurus - northeastern Italy
  70: { lat: 40.38, lng: 36.00 },  // Battle of Zela - Turkey
  71: { lat: 36.86, lng: 39.03 },  // Battle of Carrhae - Turkey/Syria border
  72: { lat: 41.01, lng: 24.29 },  // Battle of Philippi - Macedonia, Greece
  73: { lat: 31.32, lng: 35.35 },  // Siege of Masada - Israel

  // ============================================================
  // Ancient Egypt & Mesopotamia (IDs 31-55)
  // ============================================================
  31: { lat: 34.56, lng: 36.52 },  // Battle of Kadesh - Orontes River, Syria
  32: { lat: 32.58, lng: 35.18 },  // Battle of Megiddo - Canaan, Israel
  33: { lat: 31.05, lng: 32.55 },  // Battle of Pelusium - Nile Delta, Egypt
  34: { lat: 31.25, lng: 30.05 },  // Battle of the Delta - Nile Delta, Egypt
  35: { lat: 36.83, lng: 38.00 },  // Battle of Carchemish - Syria
  36: { lat: 31.56, lng: 34.85 },  // Siege of Lachish - Judah, Israel
  37: { lat: 36.36, lng: 43.15 },  // Fall of Nineveh - Mosul, Iraq
  38: { lat: 32.54, lng: 44.42 },  // Fall of Babylon - Iraq
  39: { lat: 35.42, lng: 36.34 },  // Battle of Qarqar - Syria
  40: { lat: 31.30, lng: 34.22 },  // Battle of Raphia - near Rafah, Gaza
  41: { lat: 33.27, lng: 35.20 },  // Siege of Tyre - Lebanon
  42: { lat: 36.56, lng: 43.43 },  // Battle of Gaugamela - near Mosul, Iraq
  43: { lat: 36.85, lng: 36.20 },  // Battle of Issus - southern Turkey
  44: { lat: 38.82, lng: 20.72 },  // Battle of Actium - western Greece
  45: { lat: 31.78, lng: 35.23 },  // Siege of Jerusalem - Jerusalem
  46: { lat: 38.50, lng: 28.04 },  // Battle of Thymbra - Lydia, Turkey
  47: { lat: 33.09, lng: 44.25 },  // Battle of Opis - Tigris River, Iraq
  48: { lat: 30.79, lng: 31.82 },  // Siege of Avaris - Nile Delta, Egypt
  49: { lat: 33.80, lng: 35.60 },  // Battle of Djahy - Levantine coast
  50: { lat: 19.60, lng: 30.40 },  // Nubian Campaign of Thutmose I - Upper Nile, Nubia
  51: { lat: 31.94, lng: 48.87 },  // Battle of Ulai - Karun River, Iran
  52: { lat: 32.54, lng: 44.42 },  // Sack of Babylon by Sennacherib - Iraq
  53: { lat: 34.40, lng: 43.80 },  // Battle of Halule - Tigris River, Iraq
  54: { lat: 29.87, lng: 31.25 },  // Siege of Memphis - Memphis, Egypt
  55: { lat: 30.96, lng: 46.10 },  // Fall of Ur - southern Iraq

  // ============================================================
  // Medieval Europe (IDs 4, 7, 19, 21, 74-94)
  // ============================================================
  4: { lat: 50.91, lng: 0.49 },    // Battle of Hastings - England
  7: { lat: 50.46, lng: 2.14 },    // Battle of Agincourt - northern France
  19: { lat: 46.81, lng: 0.69 },   // Battle of Tours - central France
  21: { lat: 50.26, lng: 1.88 },   // Battle of Crecy - northern France
  74: { lat: 56.09, lng: -3.91 },  // Battle of Bannockburn - Scotland
  75: { lat: 41.01, lng: 28.98 },  // Siege of Constantinople - Istanbul, Turkey
  76: { lat: 46.58, lng: 0.34 },   // Battle of Poitiers 1356 - western France
  77: { lat: 50.57, lng: 3.21 },   // Battle of Bouvines - northern France
  78: { lat: 32.81, lng: 35.50 },  // Battle of Hattin - Israel
  79: { lat: 39.14, lng: 43.53 },  // Battle of Manzikert - eastern Turkey
  80: { lat: 45.60, lng: 8.91 },   // Battle of Legnano - northern Italy
  81: { lat: 53.89, lng: -1.26 },  // Battle of Towton - Yorkshire, England
  82: { lat: 32.92, lng: 35.08 },  // Siege of Acre - Israel
  83: { lat: 43.44, lng: 1.32 },   // Battle of Muret - southern France
  84: { lat: 38.29, lng: -3.58 },  // Battle of Las Navas de Tolosa - southern Spain
  85: { lat: 53.49, lng: 20.11 },  // Battle of Tannenberg/Grunwald 1410 - Poland
  86: { lat: 56.12, lng: -3.94 },  // Battle of Stirling Bridge - Scotland
  87: { lat: 43.70, lng: 24.89 },  // Battle of Nicopolis - Bulgaria
  88: { lat: 48.37, lng: 10.90 },  // Battle of Lechfeld - Augsburg, Germany
  89: { lat: 53.36, lng: -6.19 },  // Battle of Clontarf - Dublin, Ireland
  90: { lat: 32.30, lng: 34.88 },  // Battle of Arsuf - Israel
  91: { lat: 47.90, lng: 1.91 },   // Siege of Orleans - Loire, France
  92: { lat: 42.65, lng: 21.17 },  // Battle of Kosovo - Serbia
  93: { lat: 54.00, lng: -0.92 },  // Battle of Stamford Bridge - Yorkshire, England
  94: { lat: 51.28, lng: 3.38 },   // Battle of Sluys - English Channel, Flanders

  // ============================================================
  // Ottoman & Islamic (IDs 17, 23, 95-117)
  // ============================================================
  17: { lat: 38.34, lng: 20.72 },  // Battle of Lepanto - Gulf of Patras, Greece
  23: { lat: 40.38, lng: 26.39 },  // Battle of Gallipoli - Gallipoli peninsula, Turkey
  95: { lat: 32.79, lng: 35.88 },  // Battle of Yarmouk - Jordan
  96: { lat: 23.73, lng: 38.79 },  // Battle of Badr - Hejaz, Saudi Arabia
  97: { lat: 33.31, lng: 44.37 },  // Siege of Baghdad 1258 - Iraq
  98: { lat: 32.60, lng: 35.33 },  // Battle of Ain Jalut - Jezreel Valley, Israel
  99: { lat: 46.00, lng: 18.68 },  // Battle of Mohacs - Hungary
  100: { lat: 48.21, lng: 16.37 }, // Siege of Vienna 1529 - Austria
  101: { lat: 38.95, lng: 20.75 }, // Battle of Preveza - western Greece
  102: { lat: 39.17, lng: 44.02 }, // Battle of Chaldiran - Iran/Turkey border
  103: { lat: 43.20, lng: 27.92 }, // Battle of Varna - Bulgaria
  104: { lat: 39.93, lng: 32.85 }, // Battle of Ankara - Turkey
  105: { lat: 36.63, lng: 37.10 }, // Battle of Marj Dabiq - north of Aleppo, Syria
  106: { lat: 30.11, lng: 31.34 }, // Battle of Ridaniya - near Cairo, Egypt
  107: { lat: 36.44, lng: 28.23 }, // Siege of Rhodes - Rhodes, Greece
  108: { lat: 32.62, lng: 44.02 }, // Battle of Karbala - Iraq
  109: { lat: 36.20, lng: 43.50 }, // Battle of the Zab - northern Iraq
  110: { lat: 42.52, lng: 71.24 }, // Battle of Talas - Central Asia (Kyrgyzstan)
  111: { lat: 29.39, lng: 76.97 }, // First Battle of Panipat - India
  112: { lat: 35.90, lng: 14.43 }, // Siege of Malta - Malta
  113: { lat: 47.81, lng: 20.53 }, // Battle of Mezokeresztes - Hungary
  114: { lat: 40.33, lng: 42.57 }, // Battle of Sarikamish - eastern Turkey
  115: { lat: 29.53, lng: 35.01 }, // Capture of Aqaba - Jordan
  116: { lat: 32.51, lng: 45.82 }, // Battle of Kut - Kut-al-Amara, Iraq
  117: { lat: 47.24, lng: 28.50 }, // Battle of Pruth - Moldova

  // ============================================================
  // East Asia (IDs 118-142)
  // ============================================================
  118: { lat: 29.72, lng: 113.82 }, // Battle of Red Cliffs - Yangtze River, China
  119: { lat: 35.37, lng: 136.46 }, // Battle of Sekigahara - Japan
  120: { lat: 35.80, lng: 112.76 }, // Battle of Changping - Shanxi, China
  121: { lat: 34.69, lng: 135.50 }, // Siege of Osaka - Japan
  122: { lat: 34.95, lng: 137.56 }, // Battle of Nagashino - Aichi, Japan
  123: { lat: 36.00, lng: 126.75 }, // Battle of Baekgang - Geum River, Korea
  124: { lat: 34.90, lng: 128.03 }, // Battle of Noryang - Noryang Strait, Korea
  125: { lat: 34.57, lng: 126.31 }, // Battle of Myeongnyang - Myeongnyang Strait, Korea
  126: { lat: 32.63, lng: 116.97 }, // Battle of Fei River - Anhui, China
  127: { lat: 33.59, lng: 130.40 }, // Mongol Invasion of Japan - Hakata Bay, Japan
  128: { lat: 39.90, lng: 126.00 }, // Battle of Salsu - Salsu River, Korea
  129: { lat: 33.95, lng: 130.95 }, // Battle of Dan-no-ura - Shimonoseki, Japan
  130: { lat: 40.05, lng: 119.75 }, // Battle of Shanhai Pass - Great Wall, China
  131: { lat: 41.85, lng: 124.15 }, // Battle of Sarhu - Manchuria, China
  132: { lat: 22.15, lng: 113.07 }, // Battle of Yamen - Guangdong, China
  133: { lat: 36.56, lng: 138.19 }, // Battle of Kawanakajima - Nagano, Japan
  134: { lat: 35.05, lng: 136.97 }, // Battle of Okehazama - Owari, Japan
  135: { lat: 39.02, lng: 125.74 }, // Siege of Pyongyang - Korea
  136: { lat: 34.77, lng: 113.65 }, // Battle of Guandu - Henan, China
  137: { lat: 30.70, lng: 112.60 }, // Battle of Boju - Hubei, China
  138: { lat: 34.44, lng: 115.65 }, // Battle of Suiyang - Henan, China
  139: { lat: 30.77, lng: 111.30 }, // Battle of Yiling - Hubei, China
  140: { lat: 34.83, lng: 113.00 }, // Battle of Hulao Pass - Henan, China
  141: { lat: 35.10, lng: 129.03 }, // Battle of Busan - Korea
  142: { lat: 41.80, lng: 123.43 }, // Battle of Mukden - Shenyang, China

  // ============================================================
  // American Wars (IDs 3, 16, 22, 29, 163-183)
  // ============================================================
  3: { lat: 39.81, lng: -77.23 },   // Battle of Gettysburg - Pennsylvania
  16: { lat: 42.99, lng: -73.63 },  // Battle of Saratoga - New York
  22: { lat: 37.24, lng: -76.51 },  // Battle of Yorktown - Virginia
  29: { lat: 42.38, lng: -71.06 },  // Battle of Bunker Hill - Massachusetts
  163: { lat: 39.47, lng: -77.74 }, // Battle of Antietam - Maryland
  164: { lat: 35.15, lng: -88.33 }, // Battle of Shiloh - Tennessee
  165: { lat: 32.35, lng: -90.88 }, // Battle of Vicksburg - Mississippi
  166: { lat: 38.30, lng: -77.63 }, // Battle of Chancellorsville - Virginia
  167: { lat: 32.75, lng: -79.87 }, // Battle of Fort Sumter - South Carolina
  168: { lat: 35.05, lng: -85.31 }, // Battle of Chattanooga - Tennessee
  169: { lat: 38.81, lng: -77.52 }, // First Battle of Bull Run - Virginia
  170: { lat: 40.22, lng: -74.76 }, // Battle of Trenton - New Jersey
  171: { lat: 35.14, lng: -81.83 }, // Battle of Cowpens - South Carolina
  172: { lat: 40.27, lng: -74.27 }, // Battle of Monmouth - New Jersey
  173: { lat: 29.95, lng: -89.96 }, // Battle of New Orleans - Louisiana
  174: { lat: 29.43, lng: -98.49 }, // Battle of the Alamo - San Antonio, Texas
  175: { lat: 25.45, lng: -101.00 },// Battle of Buena Vista - Coahuila, Mexico
  176: { lat: 19.42, lng: -99.18 }, // Battle of Chapultepec - Mexico City
  177: { lat: 20.02, lng: -75.82 }, // Battle of San Juan Hill - Santiago de Cuba
  178: { lat: 14.52, lng: 120.76 }, // Battle of Manila Bay - Philippines
  179: { lat: 13.96, lng: 107.84 }, // Battle of Ia Drang - Central Highlands, Vietnam
  180: { lat: 16.60, lng: 106.72 }, // Battle of Khe Sanh - Quang Tri, Vietnam
  181: { lat: 16.47, lng: 107.58 }, // Tet Offensive - Hue, South Vietnam (major battle site)
  182: { lat: 37.45, lng: 126.70 }, // Battle of Inchon - South Korea
  183: { lat: 40.40, lng: 127.25 }, // Battle of Chosin Reservoir - North Korea

  // ============================================================
  // World Wars (IDs 5, 6, 9, 11, 13, 15, 24, 25, 184-200)
  // ============================================================
  5: { lat: 48.72, lng: 44.51 },    // Battle of Stalingrad - Volgograd, Russia
  6: { lat: 49.36, lng: -0.88 },    // D-Day - Normandy, France
  9: { lat: 50.01, lng: 2.69 },     // Battle of the Somme - northern France
  11: { lat: 28.21, lng: -177.37 }, // Battle of Midway - Pacific Ocean
  13: { lat: 51.73, lng: 36.19 },   // Battle of Kursk - Russia
  15: { lat: 49.16, lng: 5.39 },    // Battle of Verdun - France
  24: { lat: 50.07, lng: 5.73 },    // Battle of the Bulge - Ardennes, Belgium
  25: { lat: 24.78, lng: 141.32 },  // Battle of Iwo Jima - Japan
  184: { lat: 53.58, lng: 20.06 },  // Battle of Tannenberg 1914 - East Prussia, Poland
  185: { lat: 48.96, lng: 3.39 },   // Battle of the Marne - France
  186: { lat: 56.68, lng: 5.60 },   // Battle of Jutland - North Sea, off Denmark
  187: { lat: 50.90, lng: 3.00 },   // Battle of Passchendaele - Flanders, Belgium
  188: { lat: 46.25, lng: 13.58 },  // Battle of Caporetto - Kobarid, Italy/Slovenia
  189: { lat: 30.83, lng: 28.95 },  // Battle of El Alamein - Egypt
  190: { lat: -9.43, lng: 160.04 }, // Battle of Guadalcanal - Solomon Islands
  191: { lat: 26.33, lng: 127.77 }, // Battle of Okinawa - Japan
  192: { lat: 52.52, lng: 13.41 },  // Battle of Berlin - Germany
  193: { lat: -14.50, lng: 152.50 },// Battle of the Coral Sea - Pacific Ocean
  194: { lat: 32.08, lng: 23.96 },  // Siege of Tobruk - Libya
  195: { lat: 41.49, lng: 13.81 },  // Battle of Monte Cassino - Italy
  196: { lat: 10.50, lng: 125.50 }, // Battle of Leyte Gulf - Philippines
  197: { lat: 51.51, lng: -0.13 },  // Battle of Britain - United Kingdom (London)
  198: { lat: 59.93, lng: 30.32 },  // Siege of Leningrad - St. Petersburg, Russia
  199: { lat: 51.04, lng: 2.38 },   // Battle of Dunkirk - France
  200: { lat: 51.98, lng: 5.91 },   // Battle of Arnhem - Netherlands
};
