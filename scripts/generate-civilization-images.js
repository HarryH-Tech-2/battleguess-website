import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually since this runs outside Vite
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ============================================================
// BATTLE MANIFEST - All 200 battles organized by civilization
// ============================================================

const allBattles = {
  'ancient-egypt-mesopotamia': [
    { id: 31, name: "Battle of Kadesh", generals: "Ramesses II and Muwatalli II", landscape: "banks of the Orontes River in ancient Syria with desert terrain" },
    { id: 32, name: "Battle of Megiddo", generals: "Pharaoh Thutmose III and the King of Kadesh", landscape: "narrow mountain pass opening onto a plain before a fortified Canaanite city in the Levant" },
    { id: 33, name: "Battle of Pelusium", generals: "Cambyses II of Persia and Pharaoh Psamtik III", landscape: "fortress city guarding the eastern Nile Delta with sandy terrain" },
    { id: 34, name: "Battle of the Delta", generals: "Ramesses III and the Sea Peoples chieftains", landscape: "mouths of the Nile River with reed marshes and river channels" },
    { id: 35, name: "Battle of Carchemish", generals: "Crown Prince Nebuchadnezzar II and Pharaoh Necho II", landscape: "fortified city on the Euphrates River crossing in northern Syria" },
    { id: 36, name: "Siege of Lachish", generals: "Sennacherib of Assyria and King Hezekiah of Judah", landscape: "arid Judean hills with a fortified hilltop city and massive siege ramp" },
    { id: 37, name: "Fall of Nineveh", generals: "Nabopolassar of Babylon and Cyaxares of the Medes", landscape: "massive walled Assyrian capital city along the Tigris River with ziggurats" },
    { id: 38, name: "Fall of Babylon", generals: "Cyrus the Great and King Nabonidus", landscape: "massive double-walled city of Babylon with the Ishtar Gate and Euphrates River flowing through" },
    { id: 39, name: "Battle of Qarqar", generals: "Shalmaneser III of Assyria and Hadadezer of Damascus", landscape: "Orontes Valley river plain in western Syria" },
    { id: 40, name: "Battle of Raphia", generals: "Ptolemy IV and Antiochus III", landscape: "sandy terrain near Gaza on the border between Egypt and the Levant" },
    { id: 41, name: "Siege of Tyre", generals: "Alexander the Great and the Tyrian defenders", landscape: "Mediterranean island fortress city with a half-mile causeway being built across the sea" },
    { id: 42, name: "Battle of Gaugamela", generals: "Alexander the Great and Darius III", landscape: "wide flat Mesopotamian plain near modern Mosul in Iraq" },
    { id: 43, name: "Battle of Issus", generals: "Alexander the Great and Darius III", landscape: "narrow coastal plain between mountains and the Mediterranean Sea in southern Asia Minor" },
    { id: 44, name: "Battle of Actium", generals: "Octavian (Agrippa) and Mark Antony with Cleopatra VII", landscape: "Ionian Sea off the western coast of Greece with ancient warships" },
    { id: 45, name: "Siege of Jerusalem", generals: "Nebuchadnezzar II and King Zedekiah of Judah", landscape: "hilltop city of Jerusalem with Solomon's Temple and ancient walls" },
    { id: 46, name: "Battle of Thymbra", generals: "Cyrus the Great and King Croesus of Lydia", landscape: "open plain near the wealthy city of Sardis in Anatolia" },
    { id: 47, name: "Battle of Opis", generals: "Cyrus the Great and Belshazzar of Babylon", landscape: "Tigris River plain in Mesopotamia with palm groves and irrigation canals" },
    { id: 48, name: "Siege of Avaris", generals: "Pharaoh Ahmose I and the Hyksos rulers", landscape: "fortified city in the eastern Nile Delta with mud-brick walls" },
    { id: 49, name: "Battle of Djahy", generals: "Ramesses III and the Sea Peoples chieftains", landscape: "Levantine coastal plain with ox carts and Mediterranean shoreline" },
    { id: 50, name: "Nubian Campaign of Thutmose I", generals: "Pharaoh Thutmose I and the Kushite chieftains", landscape: "Upper Nile cataracts with desert cliffs and narrow river valley in Nubia" },
    { id: 51, name: "Battle of Ulai", generals: "Ashurbanipal of Assyria and King Teumman of Elam", landscape: "Ulai River (Karun River) valley in southwestern Iran" },
    { id: 52, name: "Sack of Babylon by Sennacherib", generals: "Sennacherib of Assyria and the Babylonian defenders", landscape: "great city of Babylon with temples and palaces being razed and flooded by diverted canals" },
    { id: 53, name: "Battle of Halule", generals: "Sennacherib of Assyria and the Babylonian-Elamite coalition", landscape: "Tigris River plain in Mesopotamia with palm trees" },
    { id: 54, name: "Siege of Memphis", generals: "Esarhaddon of Assyria and Pharaoh Taharqa", landscape: "ancient Egyptian capital of Memphis near the pyramids with massive walls" },
    { id: 55, name: "Fall of Ur", generals: "Elamite and Amorite invaders and King Ibbi-Sin of Ur", landscape: "great Sumerian city of Ur with ziggurats and crumbling mud-brick walls in southern Mesopotamia" },
  ],

  'ancient-greece-rome': [
    { id: 2, name: "Battle of Thermopylae", generals: "King Leonidas and Xerxes I", landscape: "narrow coastal mountain pass in Greece" },
    { id: 10, name: "Battle of Marathon", generals: "Miltiades and Datis", landscape: "Greek coastal plain near Athens" },
    { id: 14, name: "Battle of Cannae", generals: "Hannibal Barca and Gaius Varro", landscape: "Italian plains near the Aufidus River" },
    { id: 18, name: "Battle of Zama", generals: "Scipio Africanus and Hannibal Barca", landscape: "North African plains with war elephants" },
    { id: 20, name: "Battle of Teutoburg Forest", generals: "Arminius and Publius Varus", landscape: "dense dark Germanic forest with narrow paths" },
    { id: 27, name: "Battle of Salamis", generals: "Themistocles and Xerxes I", landscape: "narrow Greek strait with triremes" },
    { id: 28, name: "Siege of Alesia", generals: "Julius Caesar and Vercingetorix", landscape: "Gallic hilltop fortress with double Roman siege fortifications" },
    { id: 56, name: "Battle of Plataea", generals: "Pausanias of Sparta and Mardonius of Persia", landscape: "open plain in central Greece near Thebes" },
    { id: 57, name: "Battle of Leuctra", generals: "Epaminondas of Thebes and King Cleombrotus of Sparta", landscape: "Boeotian plains in central Greece" },
    { id: 58, name: "Battle of the Granicus", generals: "Alexander the Great and the Persian satraps", landscape: "river crossing in northwestern Asia Minor with rocky riverbanks" },
    { id: 59, name: "Battle of Pharsalus", generals: "Julius Caesar and Pompey the Great", landscape: "open plain in central Greece (Thessaly)" },
    { id: 60, name: "Battle of Lake Trasimene", generals: "Hannibal Barca and Consul Flaminius", landscape: "narrow road between a misty Italian lake and forested hills" },
    { id: 61, name: "Battle of Cynoscephalae", generals: "Titus Quinctius Flamininus and Philip V of Macedon", landscape: "hilly terrain in Thessaly, Greece" },
    { id: 62, name: "Battle of Adrianople", generals: "Emperor Valens and the Gothic chieftains Fritigern and Alatheus", landscape: "open plains near a city in Thrace (modern northwestern Turkey)" },
    { id: 63, name: "Battle of the Catalaunian Plains", generals: "Aetius and Theodoric I against Attila the Hun", landscape: "open plains in northeastern Gaul (modern Champagne, France)" },
    { id: 64, name: "Battle of Pydna", generals: "Lucius Aemilius Paullus and King Perseus of Macedon", landscape: "coastal plain in northeastern Greece" },
    { id: 65, name: "Siege of Syracuse", generals: "Marcus Claudius Marcellus and Archimedes", landscape: "fortified Greek city on the coast of Sicily with harbor and walls" },
    { id: 66, name: "Battle of the Milvian Bridge", generals: "Constantine and Maxentius", landscape: "Tiber River crossing just outside Rome with the Milvian Bridge" },
    { id: 67, name: "Battle of Chaeronea", generals: "Philip II and young Alexander against the Athenian and Theban alliance", landscape: "open plain in Boeotia, central Greece" },
    { id: 68, name: "Battle of the Trebia", generals: "Hannibal Barca and Consul Sempronius", landscape: "freezing river crossing in northern Italy in winter" },
    { id: 69, name: "Battle of the Metaurus", generals: "Consul Claudius Nero and Hasdrubal Barca", landscape: "river valley in northeastern Italy" },
    { id: 70, name: "Battle of Zela", generals: "Julius Caesar and Pharnaces II of Pontus", landscape: "hillside in Asia Minor (modern Turkey)" },
    { id: 71, name: "Battle of Carrhae", generals: "Marcus Licinius Crassus and Surena of Parthia", landscape: "open Mesopotamian desert near the Turkey-Syria border" },
    { id: 72, name: "Battle of Philippi", generals: "Octavian and Mark Antony against Brutus and Cassius", landscape: "marshy plain in eastern Macedonia (modern Greece)" },
    { id: 73, name: "Siege of Masada", generals: "Flavius Silva of Rome and Eleazar ben Ya'ir of the Zealots", landscape: "towering desert cliff-top plateau fortress near the Dead Sea" },
  ],

  'medieval-europe': [
    { id: 4, name: "Battle of Hastings", generals: "William the Conqueror and King Harold II", landscape: "English hillside near the coast" },
    { id: 7, name: "Battle of Agincourt", generals: "King Henry V and Charles d'Albret", landscape: "muddy French farmland with forests" },
    { id: 19, name: "Battle of Tours", generals: "Charles Martel and Abd al-Rahman", landscape: "central French plains between Tours and Poitiers" },
    { id: 21, name: "Battle of Crecy", generals: "King Edward III and Philip VI", landscape: "northern French farmland with gentle hills" },
    { id: 74, name: "Battle of Bannockburn", generals: "Robert the Bruce and King Edward II", landscape: "boggy ground with streams near Stirling Castle in central Scotland" },
    { id: 75, name: "Siege of Constantinople", generals: "Sultan Mehmed II and Emperor Constantine XI", landscape: "massive Theodosian Walls of Constantinople with Hagia Sophia in the background" },
    { id: 76, name: "Battle of Poitiers", generals: "Edward the Black Prince and King John II of France", landscape: "hedgerows and vineyards in western France" },
    { id: 77, name: "Battle of Bouvines", generals: "King Philip II Augustus and Emperor Otto IV", landscape: "open fields in northern France near the Flemish border" },
    { id: 78, name: "Battle of Hattin", generals: "Saladin and King Guy of Lusignan", landscape: "barren hillside of the Horns of Hattin in the Holy Land under scorching sun" },
    { id: 79, name: "Battle of Manzikert", generals: "Sultan Alp Arslan and Emperor Romanos IV Diogenes", landscape: "Anatolian steppe in eastern Turkey" },
    { id: 80, name: "Battle of Legnano", generals: "The Lombard League commanders and Emperor Frederick Barbarossa", landscape: "northern Italian plains" },
    { id: 81, name: "Battle of Towton", generals: "Edward of York and the Lancastrian commanders", landscape: "snow-covered fields in Yorkshire, England during a blizzard" },
    { id: 82, name: "Siege of Acre", generals: "Richard the Lionheart and Philip II of France against Saladin's garrison", landscape: "fortified Mediterranean port city in the Holy Land" },
    { id: 83, name: "Battle of Muret", generals: "Simon de Montfort and King Peter II of Aragon", landscape: "southern French landscape with a walled town" },
    { id: 84, name: "Battle of Las Navas de Tolosa", generals: "Kings Alfonso VIII, Peter II, and Sancho VII against Caliph al-Nasir", landscape: "mountain pass in southern Spain" },
    { id: 85, name: "Battle of Tannenberg (Grunwald)", generals: "King Wladyslaw II Jagiello and Grand Master Ulrich von Jungingen", landscape: "open fields in northeastern Europe (modern Poland)" },
    { id: 86, name: "Battle of Stirling Bridge", generals: "William Wallace and the Earl of Surrey", landscape: "narrow wooden bridge over the River Forth in central Scotland" },
    { id: 87, name: "Battle of Nicopolis", generals: "Sultan Bayezid I and the French-Burgundian Crusader knights", landscape: "Danube River plain in the Balkans (modern Bulgaria)" },
    { id: 88, name: "Battle of Lechfeld", generals: "King Otto I of Germany and the Magyar horsemen", landscape: "river plain near Augsburg in southern Germany" },
    { id: 89, name: "Battle of Clontarf", generals: "High King Brian Boru and the Viking-Leinster alliance", landscape: "Irish coastal countryside near Dublin" },
    { id: 90, name: "Battle of Arsuf", generals: "Richard the Lionheart and Saladin", landscape: "Mediterranean coastal road in the Holy Land" },
    { id: 91, name: "Siege of Orleans", generals: "Joan of Arc and the English siege commanders", landscape: "Loire River city with medieval walls and English siege fortifications" },
    { id: 92, name: "Battle of Kosovo", generals: "Prince Lazar of Serbia and Sultan Murad I", landscape: "wide plain known as the Field of Blackbirds in the Balkans" },
    { id: 93, name: "Battle of Stamford Bridge", generals: "King Harold Godwinson and Harald Hardrada", landscape: "wooden bridge crossing in the Yorkshire countryside of England" },
    { id: 94, name: "Battle of Sluys", generals: "King Edward III and the French fleet commanders", landscape: "harbor off the Flemish coast in the English Channel" },
  ],

  'ottoman-islamic': [
    { id: 17, name: "Battle of Lepanto", generals: "Don John of Austria and Ali Pasha", landscape: "Gulf of Patras with galley warships" },
    { id: 23, name: "Battle of Gallipoli", generals: "Ian Hamilton and Mustafa Kemal", landscape: "Turkish peninsula with steep cliffs and beaches" },
    { id: 95, name: "Battle of Yarmouk", generals: "Khalid ibn al-Walid and the Byzantine commander Vahan", landscape: "Yarmouk River gorge in the Levant with dust storms swirling across the plateau" },
    { id: 96, name: "Battle of Badr", generals: "Prophet Muhammad and Abu Jahl of the Quraysh", landscape: "desert oasis with wells on the Arabian plain in the Hejaz" },
    { id: 97, name: "Siege of Baghdad", generals: "Hulagu Khan and Caliph al-Musta'sim", landscape: "massive walled city of Baghdad along the Tigris River with libraries and mosques" },
    { id: 98, name: "Battle of Ain Jalut", generals: "Sultan Qutuz and General Baybars against Kitbuqa of the Mongols", landscape: "green valley plain at the Spring of Goliath in Galilee" },
    { id: 99, name: "Battle of Mohacs", generals: "Sultan Suleiman the Magnificent and King Louis II of Hungary", landscape: "marshy plain near the Danube River in central Hungary" },
    { id: 100, name: "Siege of Vienna", generals: "Sultan Suleiman the Magnificent and the Habsburg defenders", landscape: "walled European capital city of Vienna on the Danube River" },
    { id: 101, name: "Battle of Preveza", generals: "Hayreddin Barbarossa and the Holy League admirals", landscape: "Ionian Sea waters off the western coast of Greece" },
    { id: 102, name: "Battle of Chaldiran", generals: "Sultan Selim I and Shah Ismail I", landscape: "eastern Anatolian plain near the Iran-Turkey border" },
    { id: 103, name: "Battle of Varna", generals: "Sultan Murad II and King Wladyslaw III of Poland", landscape: "Black Sea coast of Bulgaria" },
    { id: 104, name: "Battle of Ankara", generals: "Timur (Tamerlane) and Sultan Bayezid I", landscape: "central Anatolian plateau in modern Turkey" },
    { id: 105, name: "Battle of Marj Dabiq", generals: "Sultan Selim I and Sultan al-Ghawri of the Mamluks", landscape: "open plain north of Aleppo in Syria" },
    { id: 106, name: "Battle of Ridaniya", generals: "Sultan Selim I and Mamluk Sultan Tuman Bay II", landscape: "outskirts of Cairo with pyramids visible in the distance" },
    { id: 107, name: "Siege of Rhodes", generals: "Sultan Suleiman the Magnificent and Grand Master Philippe de L'Isle-Adam of the Knights Hospitaller", landscape: "heavily fortified Mediterranean island with imposing stone walls and harbor" },
    { id: 108, name: "Battle of Karbala", generals: "Husayn ibn Ali and Umar ibn Sa'ad of the Umayyads", landscape: "desert plains near the Euphrates River in Iraq" },
    { id: 109, name: "Battle of the Zab", generals: "Abbasid commander Abu Muslim and Umayyad Caliph Marwan II", landscape: "Great Zab River crossing in northern Mesopotamia" },
    { id: 110, name: "Battle of Talas", generals: "Abbasid general Ziyad ibn Salih and Tang general Gao Xianzhi", landscape: "mountain valley along the Talas River in Central Asia on the Silk Road" },
    { id: 111, name: "Battle of Panipat", generals: "Babur and Sultan Ibrahim Lodi", landscape: "North Indian plain near Delhi with war elephants" },
    { id: 112, name: "Siege of Malta", generals: "Grand Master Jean de Valette and Ottoman commander Mustafa Pasha", landscape: "small but heavily fortified Mediterranean island with stone harbors and turquoise waters" },
    { id: 113, name: "Battle of Mezokeresztes", generals: "Sultan Mehmed III and Habsburg Archduke Maximilian", landscape: "marshy plain in northeastern Hungary" },
    { id: 114, name: "Battle of Sarikamish", generals: "Enver Pasha and Russian General Yudenich", landscape: "frozen Caucasus mountain passes in eastern Turkey with deep snow and blizzards" },
    { id: 115, name: "Capture of Aqaba", generals: "T.E. Lawrence with Auda abu Tayi and the Ottoman garrison commander", landscape: "desert canyons leading to a Red Sea port town" },
    { id: 116, name: "Battle of Kut", generals: "Ottoman commander Khalil Pasha and British General Townshend", landscape: "Tigris River town of Kut-al-Amara in Mesopotamia with mud walls" },
    { id: 117, name: "Battle of Pruth", generals: "Grand Vizier Baltaci Mehmed Pasha and Tsar Peter the Great", landscape: "Pruth River valley in Moldova" },
  ],

  'east-asia': [
    { id: 118, name: "Battle of Red Cliffs", generals: "Sun Quan and Liu Bei against Cao Cao", landscape: "Yangtze River with cliffs and a massive fleet of chained warships" },
    { id: 119, name: "Battle of Sekigahara", generals: "Tokugawa Ieyasu and Ishida Mitsunari", landscape: "misty plain between mountains in central Japan" },
    { id: 120, name: "Battle of Changping", generals: "Qin general Bai Qi and Zhao general Zhao Kuo", landscape: "mountain valley in northern China with siege fortifications blocking the pass" },
    { id: 121, name: "Siege of Osaka", generals: "Tokugawa Ieyasu and Toyotomi Hideyori", landscape: "massive Japanese castle with stone walls, golden roofs, and wide moats" },
    { id: 122, name: "Battle of Nagashino", generals: "Oda Nobunaga and Takeda Katsuyori", landscape: "Japanese battlefield with wooden palisades and open ground before a besieged castle" },
    { id: 123, name: "Battle of Baekgang", generals: "Tang Admiral Liu Rengui and Japanese Admiral Abe no Hirafu", landscape: "river mouth on the Korean coast with warships" },
    { id: 124, name: "Battle of Noryang", generals: "Admiral Yi Sun-sin and Japanese Admiral Shimazu Yoshihiro", landscape: "narrow Korean strait at night with warships illuminated by fire" },
    { id: 125, name: "Battle of Myeongnyang", generals: "Admiral Yi Sun-sin and the Japanese fleet commanders", landscape: "narrow rocky Korean strait with swirling currents and crashing waves" },
    { id: 126, name: "Battle of Fei River", generals: "Eastern Jin general Xie Xuan and Former Qin Emperor Fu Jian", landscape: "marshlands and river crossing at the Fei River in Anhui, China" },
    { id: 127, name: "Mongol Invasion of Japan", generals: "Kublai Khan's Mongol-Korean fleet and the Japanese samurai defenders", landscape: "Hakata Bay in Japan with warships and approaching typhoon storm clouds" },
    { id: 128, name: "Battle of Salsu", generals: "Goguryeo general Eulji Mundeok and Sui Emperor Yang's forces", landscape: "mountain river valley in Korea with a dammed river" },
    { id: 129, name: "Battle of Dan-no-ura", generals: "Minamoto no Yoshitsune and Taira no Munemori", landscape: "narrow Straits of Shimonoseki in Japan with tidal currents and warships" },
    { id: 130, name: "Battle of Shanhai Pass", generals: "Ming general Wu Sangui and Manchu Prince Dorgon against Li Zicheng", landscape: "Great Wall of China meeting the sea at a fortified mountain pass" },
    { id: 131, name: "Battle of Sarhu", generals: "Manchu leader Nurhaci and the Ming expedition commanders", landscape: "mountainous forested terrain of Manchuria with ridges and valleys" },
    { id: 132, name: "Battle of Yamen", generals: "Yuan Admiral Zhang Hongfan and Song minister Lu Xiufu", landscape: "bay in Guangdong, China with mountains in the background and chained warships" },
    { id: 133, name: "Battle of Kawanakajima", generals: "Takeda Shingen and Uesugi Kenshin", landscape: "river plain between two rivers in central Japan (Nagano) with mist" },
    { id: 134, name: "Battle of Okehazama", generals: "Oda Nobunaga and Imagawa Yoshimoto", landscape: "narrow wooded gorge in Owari, Japan during a thunderstorm" },
    { id: 135, name: "Siege of Pyongyang", generals: "Ming general Li Rusong and Japanese commander Konishi Yukinaga", landscape: "walled Korean city of Pyongyang with traditional architecture under siege" },
    { id: 136, name: "Battle of Guandu", generals: "Cao Cao and Yuan Shao", landscape: "fortified Yellow River crossing in Henan, China with burning supply depots" },
    { id: 137, name: "Battle of Boju", generals: "Wu king Helu (advised by Sun Tzu) and the Chu commanders", landscape: "river plain in Hubei, China during the Spring and Autumn period" },
    { id: 138, name: "Battle of Suiyang", generals: "Tang general Zhang Xun and An Lushan rebel commander Yin Ziqi", landscape: "walled Chinese city with crumbling battlements under prolonged siege" },
    { id: 139, name: "Battle of Yiling", generals: "Shu Han emperor Liu Bei and Wu commander Lu Xun", landscape: "forested Yangtze River gorges in Hubei, China with camps along the wooded valley" },
    { id: 140, name: "Battle of Hulao Pass", generals: "Tang prince Li Shimin and rival warlord Dou Jiande", landscape: "narrow mountain pass in Henan, China with cliffs on both sides" },
    { id: 141, name: "Battle of Busan", generals: "Japanese general Konishi Yukinaga and Korean commander Jeong Bal", landscape: "Korean coastal fortress and port city with Japanese warships in the harbor" },
    { id: 142, name: "Battle of Mukden", generals: "Japanese Marshal Oyama Iwao and Russian General Kuropatkin", landscape: "frozen Manchurian plains with railroad and fortifications in winter" },
  ],

  'colonial-napoleonic': [
    { id: 1, name: "Battle of Waterloo", generals: "Napoleon Bonaparte and Duke of Wellington", landscape: "rolling Belgian farmland with muddy fields" },
    { id: 8, name: "Battle of Trafalgar", generals: "Admiral Nelson and Admiral Villeneuve", landscape: "Atlantic Ocean with wooden warships" },
    { id: 12, name: "Battle of Austerlitz", generals: "Napoleon Bonaparte and Tsar Alexander I", landscape: "frozen Moravian hills with fog" },
    { id: 26, name: "Battle of Borodino", generals: "Napoleon Bonaparte and Mikhail Kutuzov", landscape: "vast Russian countryside with redoubts and villages" },
    { id: 30, name: "Battle of Tsushima", generals: "Admiral Togo and Admiral Rozhestvensky", landscape: "gray seas of Tsushima Strait with steel battleships" },
    { id: 143, name: "Battle of Jena-Auerstedt", generals: "Napoleon Bonaparte and Marshal Davout against the Prussian army", landscape: "Thuringian hills in central Germany with morning fog" },
    { id: 144, name: "Battle of Wagram", generals: "Napoleon Bonaparte and Archduke Charles of Austria", landscape: "flat Marchfeld plain near Vienna, Austria" },
    { id: 145, name: "Battle of Leipzig", generals: "Napoleon Bonaparte against the coalition of Russia, Austria, Prussia, and Sweden", landscape: "city of Leipzig surrounded by multiple villages and rivers in Germany" },
    { id: 146, name: "Battle of Leuthen", generals: "Frederick the Great and Austrian General Daun", landscape: "snowy Silesian fields in winter (modern Poland)" },
    { id: 147, name: "Battle of Blenheim", generals: "Duke of Marlborough and Prince Eugene of Savoy against Marshal Tallard", landscape: "Danube River plain in Bavaria with the village of Blindheim" },
    { id: 148, name: "Battle of Plassey", generals: "Robert Clive and Nawab Siraj-ud-Daulah of Bengal", landscape: "monsoon-season riverbanks and mango groves in eastern India" },
    { id: 149, name: "Battle of Rossbach", generals: "Frederick the Great and the French-Imperial Austrian commanders", landscape: "Saxon countryside in Germany" },
    { id: 150, name: "Battle of the Nile", generals: "Admiral Horatio Nelson and French Admiral Brueys", landscape: "Aboukir Bay on the Egyptian Mediterranean coast at dusk" },
    { id: 151, name: "Battle of Marengo", generals: "Napoleon Bonaparte and Austrian General Melas", landscape: "plains of northern Italy near Alessandria in Piedmont" },
    { id: 152, name: "Battle of Vitoria", generals: "Duke of Wellington and King Joseph Bonaparte", landscape: "wide Spanish valley in the Basque Country with mountains in the background" },
    { id: 153, name: "Spanish Armada", generals: "Sir Francis Drake and the Duke of Medina Sidonia", landscape: "stormy English Channel with Tudor-era warships and fireships" },
    { id: 154, name: "Battle of Rocroi", generals: "Duke of Enghien (Grand Conde) and the Spanish tercio commanders", landscape: "rolling fields near the French-Spanish Netherlands border with morning mist" },
    { id: 155, name: "Battle of Poltava", generals: "Tsar Peter the Great and King Charles XII of Sweden", landscape: "Ukrainian steppe with prepared fortifications" },
    { id: 156, name: "Battle of Breitenfeld", generals: "King Gustavus Adolphus of Sweden and General Tilly of the Catholic League", landscape: "Saxon plains near Leipzig, Germany" },
    { id: 157, name: "Battle of Lutzen", generals: "King Gustavus Adolphus of Sweden and Wallenstein", landscape: "foggy Saxon fields near Lutzen, Germany" },
    { id: 158, name: "Battle of the Boyne", generals: "King William III of Orange and King James II", landscape: "River Boyne crossing in eastern Ireland with green rolling hills" },
    { id: 159, name: "Battle of Chesme", generals: "Russian Admiral Orlov and the Ottoman fleet commanders", landscape: "Chesme harbor on the Aegean coast of Turkey" },
    { id: 160, name: "Siege of Gibraltar", generals: "British General Eliott and the Spanish-French besiegers", landscape: "towering Rock of Gibraltar with Mediterranean Sea and floating batteries" },
    { id: 161, name: "Battle of Cape St Vincent", generals: "Admiral Jervis and Commodore Nelson against the Spanish fleet", landscape: "Atlantic Ocean off the southwestern tip of Portugal" },
    { id: 162, name: "Battle of Friedland", generals: "Napoleon Bonaparte and Russian General Bennigsen", landscape: "Alle River in East Prussia with the burning town of Friedland" },
  ],

  'american-wars': [
    { id: 3, name: "Battle of Gettysburg", generals: "General Meade and General Lee", landscape: "Pennsylvania hills and farmland" },
    { id: 16, name: "Battle of Saratoga", generals: "Horatio Gates and John Burgoyne", landscape: "upstate New York autumn forests and hills" },
    { id: 22, name: "Siege of Yorktown", generals: "George Washington and Lord Cornwallis", landscape: "Virginia coastal fortifications with harbor" },
    { id: 29, name: "Battle of Bunker Hill", generals: "William Prescott and William Howe", landscape: "hill overlooking Boston Harbor with earthworks" },
    { id: 163, name: "Battle of Antietam", generals: "General McClellan and General Lee", landscape: "creek and farmland in western Maryland with a sunken road and stone bridge" },
    { id: 164, name: "Battle of Shiloh", generals: "General Grant and General Albert Sidney Johnston", landscape: "dense Tennessee woodland near a small church with a peach orchard" },
    { id: 165, name: "Battle of Vicksburg", generals: "General Grant and General Pemberton", landscape: "high river bluffs overlooking the Mississippi River in Mississippi" },
    { id: 166, name: "Battle of Chancellorsville", generals: "General Lee and Stonewall Jackson against General Hooker", landscape: "tangled dense Virginia Wilderness forest" },
    { id: 167, name: "Battle of Fort Sumter", generals: "Confederate General Beauregard and Union Major Anderson", landscape: "island fort in Charleston Harbor, South Carolina with shore batteries" },
    { id: 168, name: "Battle of Chattanooga", generals: "General Grant and Confederate General Bragg", landscape: "Missionary Ridge and Lookout Mountain above the Tennessee River valley" },
    { id: 169, name: "First Battle of Bull Run", generals: "Union General McDowell and Confederate General Beauregard", landscape: "Virginia farmland with a stone bridge over Bull Run creek" },
    { id: 170, name: "Battle of Trenton", generals: "George Washington and Hessian Colonel Rall", landscape: "icy Delaware River crossing and snow-covered New Jersey town" },
    { id: 171, name: "Battle of Cowpens", generals: "Daniel Morgan and Banastre Tarleton", landscape: "South Carolina grasslands at a cattle grazing area" },
    { id: 172, name: "Battle of Monmouth", generals: "George Washington and British General Clinton", landscape: "New Jersey farmland in extreme summer heat" },
    { id: 173, name: "Battle of New Orleans", generals: "Andrew Jackson and British General Pakenham", landscape: "Louisiana bayou landscape near the Mississippi River with cotton bale fortifications" },
    { id: 174, name: "Battle of the Alamo", generals: "William Travis and Davy Crockett against General Santa Anna", landscape: "old Spanish mission fortress in San Antonio, Texas" },
    { id: 175, name: "Battle of Buena Vista", generals: "General Zachary Taylor and General Santa Anna", landscape: "narrow mountain pass in the desert of northern Mexico" },
    { id: 176, name: "Battle of Chapultepec", generals: "US General Winfield Scott and the Mexican defenders", landscape: "hilltop castle fortress overlooking Mexico City" },
    { id: 177, name: "Battle of San Juan Hill", generals: "Theodore Roosevelt and the Spanish defenders", landscape: "tropical Cuban hillside with jungle vegetation" },
    { id: 178, name: "Battle of Manila Bay", generals: "Commodore Dewey and the Spanish fleet commanders", landscape: "Manila Bay harbor in the Philippines at dawn" },
    { id: 179, name: "Battle of Ia Drang", generals: "Lt. Col. Hal Moore and NVA commander Nguyen Huu An", landscape: "remote jungle valley in the Central Highlands of Vietnam with tall elephant grass" },
    { id: 180, name: "Battle of Khe Sanh", generals: "US Marine Colonel Lownds and NVA General Tran Quy Hai", landscape: "isolated combat base in foggy mountain terrain of northwestern South Vietnam" },
    { id: 181, name: "Tet Offensive", generals: "NVA General Vo Nguyen Giap and MACV General Westmoreland", landscape: "South Vietnamese cities and streets of Saigon and the Citadel of Hue" },
    { id: 182, name: "Battle of Inchon", generals: "General Douglas MacArthur and the North Korean defenders", landscape: "Korean port city harbor with seawalls and extreme tides" },
    { id: 183, name: "Battle of Chosin Reservoir", generals: "Marine General O.P. Smith and Chinese General Song Shilun", landscape: "frozen reservoir and snow-covered mountain passes in North Korea at minus 35 degrees" },
  ],

  'world-wars': [
    { id: 5, name: "Battle of Stalingrad", generals: "Vasily Chuikov and Friedrich Paulus", landscape: "destroyed Soviet city with ruins and rubble" },
    { id: 6, name: "D-Day (Normandy Landings)", generals: "Dwight Eisenhower and Erwin Rommel", landscape: "French beach with cliffs and bunkers" },
    { id: 9, name: "Battle of the Somme", generals: "Douglas Haig and Fritz von Below", landscape: "WWI trenches and no man's land in France" },
    { id: 11, name: "Battle of Midway", generals: "Chester Nimitz and Isoroku Yamamoto", landscape: "Pacific Ocean with aircraft carriers" },
    { id: 13, name: "Battle of Kursk", generals: "Georgy Zhukov and Erich von Manstein", landscape: "Russian steppe with tank formations" },
    { id: 15, name: "Battle of Verdun", generals: "Philippe Petain and Crown Prince Wilhelm", landscape: "fortified French hills with trenches" },
    { id: 24, name: "Battle of the Bulge", generals: "Dwight Eisenhower and Gerd von Rundstedt", landscape: "snowy Ardennes forest in Belgium" },
    { id: 25, name: "Battle of Iwo Jima", generals: "Holland Smith and Tadamichi Kuribayashi", landscape: "volcanic black sand beach with Mount Suribachi" },
    { id: 184, name: "Battle of Tannenberg", generals: "Hindenburg and Ludendorff against Russian General Samsonov", landscape: "lake and forest region of East Prussia (modern Poland)" },
    { id: 185, name: "Battle of the Marne", generals: "French General Joffre and German General von Moltke", landscape: "Marne River valley near Paris with French countryside" },
    { id: 186, name: "Battle of Jutland", generals: "British Admiral Jellicoe and German Admiral Scheer", landscape: "stormy gray North Sea off the coast of Denmark with dreadnought battleships" },
    { id: 187, name: "Battle of Passchendaele", generals: "British General Haig and German General von Armin", landscape: "waterlogged Flanders mud fields in Belgium with shell craters" },
    { id: 188, name: "Battle of Caporetto", generals: "German General von Below and Italian General Cadorna", landscape: "Julian Alps mountain valleys between Italy and Austria-Hungary" },
    { id: 189, name: "Battle of El Alamein", generals: "Field Marshal Montgomery and Field Marshal Rommel", landscape: "North African desert near the Egyptian coast with sand dunes" },
    { id: 190, name: "Battle of Guadalcanal", generals: "US General Vandegrift and Japanese General Hyakutake", landscape: "tropical jungle island in the Solomon Islands with an airstrip" },
    { id: 191, name: "Battle of Okinawa", generals: "US General Buckner and Japanese General Ushijima", landscape: "fortified rocky hillsides on a Pacific island near the Japanese mainland" },
    { id: 192, name: "Battle of Berlin", generals: "Soviet Marshal Zhukov and German General Weidling", landscape: "ruined streets of Berlin with the Reichstag building" },
    { id: 193, name: "Battle of the Coral Sea", generals: "US Admiral Fletcher and Japanese Admiral Takagi", landscape: "tropical blue Pacific Ocean with aircraft carriers near New Guinea" },
    { id: 194, name: "Siege of Tobruk", generals: "Australian General Morshead and German General Rommel", landscape: "Libyan desert port city on the Mediterranean coast with fortifications" },
    { id: 195, name: "Battle of Monte Cassino", generals: "Polish General Anders and German General von Senger", landscape: "mountaintop ancient Benedictine monastery in central Italy with rocky terrain" },
    { id: 196, name: "Battle of Leyte Gulf", generals: "US Admiral Halsey and Japanese Admiral Kurita", landscape: "Philippine waters with massive warships, carriers, and destroyers" },
    { id: 197, name: "Battle of Britain", generals: "RAF Air Chief Marshal Dowding and Luftwaffe Commander Goering", landscape: "skies over southern England with contrails and the English Channel" },
    { id: 198, name: "Siege of Leningrad", generals: "Soviet General Zhukov and German Field Marshal von Leeb", landscape: "frozen city of Leningrad with Lake Ladoga supply route in winter" },
    { id: 199, name: "Battle of Dunkirk", generals: "British Admiral Ramsay and German General von Rundstedt", landscape: "French coastal beaches with long queues of soldiers and small civilian boats" },
    { id: 200, name: "Battle of Arnhem", generals: "British Colonel Frost and German SS General Bittrich", landscape: "Dutch countryside with a bridge over the Rhine at Arnhem" },
  ],
};

// ============================================================
// IMAGE GENERATION
// ============================================================

function createPrompt(battle) {
  return `Present a clear, 45° top-down isometric miniature 3D cartoon scene of the ${battle.name}. Use soft, refined textures with realistic PBR materials and gentle, lifelike lighting and shadows.

Show soldiers from the time period fighting with the 2 generals (${battle.generals}) on the outskirts of the battle with the correct landscape (${battle.landscape}).

Use a clean, minimalistic composition with a soft, solid-colored background. Do NOT include any text, labels, dates, words, numbers, or writing anywhere in the image. Square 1080x1080 dimension.`;
}

async function generateImage(battle) {
  const prompt = createPrompt(battle);
  console.log(`Generating image for Battle #${battle.id}: ${battle.name}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    const response = result.response;
    const candidates = response.candidates;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(__dirname, '..', 'public', 'battles', `battle-${battle.id}.png`);
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log(`  + Saved battle-${battle.id}.png`);
          return { success: true };
        }
      }
    }

    console.log(`  x No image data returned`);
    return { success: false, error: 'No image data' };
  } catch (error) {
    console.log(`  x Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function updateBattleImagesFile() {
  const imagesPath = path.join(__dirname, '..', 'src', 'data', 'battleImages.ts');
  const battlesDir = path.join(__dirname, '..', 'public', 'battles');

  let lines = ['// Auto-generated battle image paths', 'export const battleImages: Record<number, string> = {'];

  for (let id = 1; id <= 200; id++) {
    const imagePath = path.join(battlesDir, `battle-${id}.png`);
    if (fs.existsSync(imagePath)) {
      lines.push(`  "${id}": "/battles/battle-${id}.png",`);
    }
  }

  lines.push('};');
  lines.push('');

  fs.writeFileSync(imagesPath, lines.join('\n'));
  console.log(`\nUpdated battleImages.ts with all existing image paths.`);
}

async function main() {
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');
  const civFilter = args.find(a => a !== '--force');

  // Flatten battles based on filter
  let battlesToGenerate = [];

  if (civFilter) {
    if (!allBattles[civFilter]) {
      console.error(`Unknown civilization: ${civFilter}`);
      console.error(`Available: ${Object.keys(allBattles).join(', ')}`);
      process.exit(1);
    }
    battlesToGenerate = allBattles[civFilter];
    console.log(`\nFiltering to civilization: ${civFilter} (${battlesToGenerate.length} battles)`);
  } else {
    for (const civ of Object.keys(allBattles)) {
      battlesToGenerate.push(...allBattles[civ]);
    }
    console.log(`\nAll civilizations selected (${battlesToGenerate.length} total battles)`);
  }

  // Filter to only new battles (31-200) unless --force is used for all
  if (!forceFlag) {
    battlesToGenerate = battlesToGenerate.filter(b => b.id >= 31);
    console.log(`Filtering to new battles (IDs 31-200): ${battlesToGenerate.length} battles`);
  }

  // Check which images already exist and skip them
  const battlesDir = path.join(__dirname, '..', 'public', 'battles');
  if (!fs.existsSync(battlesDir)) {
    fs.mkdirSync(battlesDir, { recursive: true });
  }

  if (!forceFlag) {
    const before = battlesToGenerate.length;
    battlesToGenerate = battlesToGenerate.filter(b => {
      const imagePath = path.join(battlesDir, `battle-${b.id}.png`);
      return !fs.existsSync(imagePath);
    });
    const skipped = before - battlesToGenerate.length;
    if (skipped > 0) {
      console.log(`Skipping ${skipped} battles that already have images (use --force to regenerate)`);
    }
  }

  if (battlesToGenerate.length === 0) {
    console.log('\nNo images to generate. All battles already have images.');
    updateBattleImagesFile();
    return;
  }

  console.log(`\nGenerating ${battlesToGenerate.length} battle images...\n`);

  let successCount = 0;
  let failCount = 0;
  const failed = [];

  for (let i = 0; i < battlesToGenerate.length; i++) {
    const battle = battlesToGenerate[i];
    const result = await generateImage(battle);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
      failed.push(battle);
    }

    // Rate limit delay between requests (3 seconds)
    if (i < battlesToGenerate.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`\nDone! ${successCount} succeeded, ${failCount} failed.`);
  if (failed.length > 0) {
    console.log('Failed battles:', failed.map(b => `#${b.id} ${b.name}`).join(', '));
  }

  // Update battleImages.ts
  updateBattleImagesFile();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
