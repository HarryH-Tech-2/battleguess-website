import type { Battle } from '../../types';

export const ottomanIslamicBattles: Battle[] = [
  {
    id: 17,
    name: "Battle of Lepanto",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["lepanto", "battle of lepanto"],
    prompt: "Naval Battle of Lepanto 1571, Holy League galleys clashing with Ottoman fleet in Gulf of Patras, massive Mediterranean galley warfare, ramming and boarding actions, Christian and Ottoman flags, cannons firing at close range, dramatic Renaissance naval battle painting, smoke over turquoise waters",
    hints: [
      "It was the last major battle fought primarily between rowing galleys",
      "It took place in the Gulf of Patras off western Greece",
      "A coalition of Catholic states fought the Ottoman Empire",
      "The Holy League shattered the myth of Ottoman naval invincibility"
    ],
    difficulty: "hard",
    year: 1571,
    location: "Gulf of Patras, Greece",
    description: "The Holy League, a coalition of Spain, Venice, and the Papal States, decisively defeated the Ottoman fleet in one of history's largest naval battles. Over 400 galleys clashed in close combat. The victory shattered the myth of Ottoman naval invincibility and prevented Ottoman expansion into the western Mediterranean, though it did not end Ottoman naval power entirely."
  },
  {
    id: 23,
    name: "Battle of Gallipoli",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["gallipoli", "battle of gallipoli", "gallipoli campaign", "dardanelles"],
    prompt: "World War 1 Gallipoli Campaign 1915, ANZAC soldiers storming beaches under Ottoman fire, steep cliffs and narrow beaches, Turkish defenders firing from above, trenches on hillsides overlooking the sea, Dardanelles strait in background, dramatic WWI Mediterranean battle scene",
    hints: [
      "This failed campaign aimed to knock the Ottoman Empire out of World War I",
      "It took place on a peninsula in modern-day Turkey",
      "Australian and New Zealand troops (ANZACs) played a major role",
      "Winston Churchill was largely responsible for planning this failed campaign"
    ],
    difficulty: "medium",
    year: 1915,
    location: "Turkey",
    description: "The Allied attempt to force the Dardanelles strait and knock the Ottoman Empire out of World War I ended in a costly eight-month failure. ANZAC and British forces landed on the Gallipoli peninsula but could never break through Ottoman defenses commanded by Mustafa Kemal (later Atatürk). The campaign cost over 250,000 Allied casualties and forged the national identities of Australia, New Zealand, and modern Turkey."
  },
  {
    id: 95,
    name: "Battle of Yarmouk",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["yarmouk", "yarmuk", "battle of yarmouk", "battle of yarmuk"],
    prompt: "Battle of Yarmouk 636 CE, Arab Muslim cavalry charging Byzantine heavy infantry near the Yarmouk River gorge, desert warriors with curved swords and green banners clashing with Roman-armored Byzantine soldiers, dust storm swirling across the Levantine plateau, dramatic early Islamic conquest battle scene",
    hints: [
      "A massive dust storm played a critical role in the outcome of this engagement",
      "It was fought near a deep river gorge in the Levant region",
      "This victory opened the entire eastern Mediterranean to Arab conquest",
      "Khalid ibn al-Walid's cavalry tactics destroyed the Byzantine army"
    ],
    difficulty: "hard",
    year: 636,
    location: "Jordan",
    description: "The Rashidun Caliphate's forces under Khalid ibn al-Walid decisively defeated a much larger Byzantine army near the Yarmouk River. The six-day battle ended Byzantine control over the Levant and opened the way for the rapid Arab conquest of Syria, Palestine, and Egypt. A devastating dust storm blinded the Byzantines during the final assault, turning retreat into catastrophe as thousands fell into the river gorge."
  },
  {
    id: 96,
    name: "Battle of Badr",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["badr", "battle of badr"],
    prompt: "Battle of Badr 624 CE, early Muslim warriors in simple robes and turbans with swords and spears facing a larger Meccan army on a desert plain near wells, Prophet Muhammad directing from a shelter, Arabian desert landscape, dramatic early Islamic battle painting with dawn light",
    hints: [
      "This was a pivotal early engagement in the founding of a major world religion",
      "The outnumbered victors had set out originally to raid a trade caravan",
      "It took place at a desert oasis with important wells in the Hejaz region",
      "The Muslim community's first major military victory established their legitimacy in Medina"
    ],
    difficulty: "medium",
    year: 624,
    location: "Saudi Arabia",
    description: "The first major military engagement of the early Muslim community saw roughly 313 Muslims defeat a Meccan force of around 1,000 near the wells of Badr. The victory was a turning point for the nascent Islamic state in Medina, providing crucial legitimacy and resources. The battle is regarded in Islamic tradition as a divinely aided triumph and remains one of the most celebrated events in Islamic history."
  },
  {
    id: 97,
    name: "Siege of Baghdad",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["baghdad", "siege of baghdad", "fall of baghdad", "sack of baghdad"],
    prompt: "Siege of Baghdad 1258, Mongol army besieging the great walled city of Baghdad, Mongol siege engines and cavalry surrounding massive Abbasid capital, the Tigris River running dark, burning libraries and palaces, Hulagu Khan's forces breaching the walls, devastating destruction of an Islamic golden age city",
    hints: [
      "The aftermath famously turned a great river black with ink from destroyed books",
      "It marked the end of a centuries-old Islamic caliphate and golden age of learning",
      "A grandson of Genghis Khan led the attacking forces",
      "Hulagu Khan's Mongol army destroyed the Abbasid capital and killed the last caliph"
    ],
    difficulty: "medium",
    year: 1258,
    location: "Iraq",
    description: "Hulagu Khan's Mongol army besieged and sacked Baghdad, ending the five-century-old Abbasid Caliphate. The last Abbasid caliph, al-Musta'sim, was executed, and the city's legendary libraries, mosques, and hospitals were destroyed. According to accounts, the Tigris ran black with ink from the books thrown into it. The fall of Baghdad is widely considered one of the most catastrophic events in Islamic history, ending the Islamic Golden Age."
  },
  {
    id: 98,
    name: "Battle of Ain Jalut",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["ain jalut", "ayn jalut", "battle of ain jalut", "battle of ayn jalut", "goliath's spring"],
    prompt: "Battle of Ain Jalut 1260, Mamluk cavalry in gleaming armor charging Mongol horsemen on a green valley plain in Galilee, Mamluk Sultan Qutuz rallying his warriors, Mongol horse archers firing volleys, clash between two great cavalry forces, dramatic medieval Middle Eastern battle scene",
    hints: [
      "This battle proved that the seemingly unstoppable conquerors from the east could be defeated",
      "It was fought in a valley whose name translates to 'Spring of Goliath'",
      "The victors used a feigned retreat to lure the enemy into a trap",
      "The Mamluk Sultan Qutuz halted the Mongol advance into the Middle East"
    ],
    difficulty: "hard",
    year: 1260,
    location: "Israel",
    description: "The Mamluk Sultanate of Egypt, led by Sultan Qutuz and his general Baybars, dealt the Mongol Empire its first significant defeat at Ain Jalut in the Jezreel Valley. The Mamluks used a feigned retreat to draw the Mongols into an ambush. The victory halted the Mongol westward advance and preserved Egypt and the remaining Islamic heartlands from Mongol conquest, marking a turning point in world history."
  },
  {
    id: 99,
    name: "Battle of Mohacs",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["mohacs", "mohacs battle", "battle of mohacs"],
    prompt: "Battle of Mohacs 1526, Ottoman Sultan Suleiman the Magnificent's army with janissaries and sipahi cavalry crushing Hungarian knights on a marshy plain, Ottoman cannons firing, Hungarian heavy cavalry charge into Ottoman lines, dramatic 16th century battle scene on the Hungarian plain, Ottoman banners and crescents",
    hints: [
      "The defeated kingdom was subsequently partitioned among three powers for over a century",
      "It was fought on a marshy plain near the Danube in central Europe",
      "The losing king drowned in a swamp while fleeing the battlefield",
      "Sultan Suleiman the Magnificent's victory destroyed the medieval Kingdom of Hungary"
    ],
    difficulty: "hard",
    year: 1526,
    location: "Hungary",
    description: "Sultan Suleiman the Magnificent's Ottoman army annihilated the Hungarian army under King Louis II in less than two hours. The young Hungarian king drowned in a swamp while fleeing the rout. The decisive Ottoman victory led to the partition of Hungary between the Ottomans, Habsburgs, and the Principality of Transylvania, fundamentally reshaping the political map of Central Europe for over 150 years."
  },
  {
    id: 100,
    name: "Siege of Vienna",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["vienna", "siege of vienna", "vienna 1529"],
    prompt: "Siege of Vienna 1529, Ottoman army with massive encampment of tents surrounding the walled city of Vienna, janissaries mining city walls, Habsburg defenders on the ramparts, Ottoman siege cannons, Sultan Suleiman's command tent, dramatic 16th century siege warfare scene with European gothic architecture under assault",
    hints: [
      "Harsh weather and long supply lines ultimately forced the attackers to withdraw",
      "It was a siege of a major European capital on the Danube River",
      "This failed siege marked the farthest extent of Ottoman expansion into central Europe",
      "Sultan Suleiman the Magnificent failed to capture the Habsburg capital"
    ],
    difficulty: "medium",
    year: 1529,
    location: "Austria",
    description: "Sultan Suleiman the Magnificent laid siege to Vienna, the capital of Habsburg Austria, in the Ottoman Empire's deepest thrust into central Europe. The defenders held out despite being heavily outnumbered, aided by autumn rains that bogged down Ottoman supply lines and rendered their heavy siege guns unusable. Suleiman withdrew after two weeks, marking the high-water mark of Ottoman expansion into Western Europe."
  },
  {
    id: 101,
    name: "Battle of Preveza",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["preveza", "battle of preveza"],
    prompt: "Naval Battle of Preveza 1538, Ottoman fleet under Hayreddin Barbarossa engaging Holy League galleys off the Greek coast, Ottoman war galleys maneuvering with superior seamanship, cannon fire across blue Ionian waters, crescent flags against papal and Venetian banners, dramatic 16th century Mediterranean naval battle",
    hints: [
      "This naval victory established Ottoman dominance over the Mediterranean for decades",
      "It was fought off the western coast of Greece in the Ionian Sea",
      "The losing side was a coalition of Christian European naval powers",
      "The legendary corsair Hayreddin Barbarossa commanded the victorious Ottoman fleet"
    ],
    difficulty: "hard",
    year: 1538,
    location: "Greece",
    description: "The Ottoman fleet under the legendary admiral Hayreddin Barbarossa decisively defeated a combined Holy League fleet of Spanish, Venetian, and Papal ships near Preveza in western Greece. Barbarossa's superior tactics and seamanship routed the disorganized Christian coalition. The victory secured Ottoman naval supremacy in the Mediterranean for over three decades until the Battle of Lepanto in 1571."
  },
  {
    id: 102,
    name: "Battle of Chaldiran",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["chaldiran", "battle of chaldiran"],
    prompt: "Battle of Chaldiran 1514, Ottoman janissaries with muskets and cannons facing Safavid Persian cavalry on an Anatolian plain, Sultan Selim I commanding Ottoman forces, Safavid Shah Ismail leading a cavalry charge, gunpowder weapons versus mounted warriors, dramatic 16th century battle between two Islamic empires",
    hints: [
      "This battle demonstrated the decisive advantage of gunpowder weapons over traditional cavalry",
      "It was fought on a plain in eastern Anatolia near the modern Iran-Turkey border",
      "It established the long-lasting border between two rival Islamic empires",
      "Sultan Selim I's Ottoman gunpowder army defeated Shah Ismail's Safavid cavalry"
    ],
    difficulty: "hard",
    year: 1514,
    location: "Iran/Turkey",
    description: "Sultan Selim I's Ottoman army, equipped with muskets and artillery, defeated Shah Ismail I's Safavid Persian cavalry at Chaldiran in eastern Anatolia. The battle demonstrated the superiority of gunpowder weapons against traditional mounted warfare. The victory established Ottoman control over eastern Anatolia and Kurdistan, and set the Ottoman-Safavid border that would largely persist for centuries, defining the Sunni-Shia geopolitical divide."
  },
  {
    id: 103,
    name: "Battle of Varna",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["varna", "battle of varna"],
    prompt: "Battle of Varna 1444, Ottoman Sultan Murad II's army clashing with Crusader knights on the Black Sea coast of Bulgaria, King Wladyslaw III of Poland leading a desperate cavalry charge into the Ottoman center, janissaries defending with pikes, dramatic late medieval Crusade battle scene near the sea",
    hints: [
      "The crusading king was killed when he recklessly charged the enemy center",
      "It was fought on the Black Sea coast of modern-day Bulgaria",
      "This Ottoman victory ended the last major Crusade against the Ottoman Empire",
      "Sultan Murad II came out of retirement to defeat King Wladyslaw III's Crusader army"
    ],
    difficulty: "hard",
    year: 1444,
    location: "Bulgaria",
    description: "Sultan Murad II emerged from retirement to face a Crusader army led by King Wladyslaw III of Poland and Hungary near Varna on the Bulgarian Black Sea coast. The young king launched a reckless cavalry charge into the Ottoman center and was killed, his head displayed on a pike. The decisive Ottoman victory ended the last serious Crusade aimed at driving the Ottomans from Europe and secured Ottoman dominance in the Balkans."
  },
  {
    id: 104,
    name: "Battle of Ankara",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["ankara", "battle of ankara", "angora", "battle of angora"],
    prompt: "Battle of Ankara 1402, Timur's vast Central Asian army with war elephants clashing with Ottoman Sultan Bayezid's forces on the Anatolian plateau, Timurid horse archers and heavy cavalry overwhelming Ottoman lines, Ottoman vassals defecting mid-battle, dramatic medieval Central Asian warfare painting",
    hints: [
      "The defeated sultan was captured and allegedly kept in a cage",
      "It was fought on the central Anatolian plateau in modern Turkey",
      "A conqueror from Central Asia nearly destroyed the Ottoman Empire in its early years",
      "Timur (Tamerlane) captured Ottoman Sultan Bayezid I, triggering a civil war"
    ],
    difficulty: "hard",
    year: 1402,
    location: "Turkey",
    description: "Timur (Tamerlane) crushed the Ottoman army and captured Sultan Bayezid I in one of the most consequential battles of the medieval period. Many Ottoman vassal troops defected to Timur during the battle, sealing Bayezid's defeat. The sultan reportedly died in captivity, and the Ottoman Empire plunged into a decade-long civil war known as the Ottoman Interregnum. The empire nearly collapsed but eventually recovered under Mehmed I."
  },
  {
    id: 105,
    name: "Battle of Marj Dabiq",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["marj dabiq", "battle of marj dabiq"],
    prompt: "Battle of Marj Dabiq 1516, Ottoman army with advanced cannons and muskets facing Mamluk cavalry on a Syrian plain north of Aleppo, Sultan Selim I commanding Ottoman forces, Mamluk horsemen charging into artillery fire, Ottoman janissaries in disciplined formations, dramatic 16th century Middle Eastern battle scene",
    hints: [
      "Treachery within the losing army's ranks helped decide the outcome",
      "It was fought on a plain north of the great Syrian city of Aleppo",
      "This victory gave the Ottomans control of Syria and the Levant",
      "Sultan Selim I's defeat of the Mamluk Sultanate began at this battle"
    ],
    difficulty: "hard",
    year: 1516,
    location: "Syria",
    description: "Sultan Selim I's Ottoman army routed the Mamluk Sultanate's forces under Sultan al-Ghawri north of Aleppo. The Mamluks, who disdained firearms as dishonorable, were devastated by Ottoman artillery and musket fire. Al-Ghawri was killed during the battle amid mass defections from his own ranks. The victory gave the Ottomans control of Syria and opened the road to the conquest of Egypt and the holy cities of Mecca and Medina."
  },
  {
    id: 106,
    name: "Battle of Ridaniya",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["ridaniya", "al-raydaniyya", "battle of ridaniya"],
    prompt: "Battle of Ridaniya 1517, Ottoman army attacking Mamluk defenders outside the walls of Cairo, Ottoman cannons blasting Mamluk positions, janissaries storming Egyptian fortifications, Mamluk cavalry making a last desperate stand, pyramids visible in the distance, dramatic 16th century conquest of Egypt battle scene",
    hints: [
      "This battle completed the conquest of the most powerful Islamic state in the region",
      "It was fought just outside one of the great cities of the Islamic world in Egypt",
      "The victors gained control of the Islamic holy cities and the caliphate title",
      "Sultan Selim I's victory at the gates of Cairo ended the Mamluk Sultanate"
    ],
    difficulty: "hard",
    year: 1517,
    location: "Egypt",
    description: "Sultan Selim I's Ottoman army defeated the last Mamluk sultan, Tuman Bay II, outside Cairo, completing the Ottoman conquest of Egypt. The Mamluk Sultanate, which had ruled Egypt and the Levant for over 250 years, was extinguished. The victory gave the Ottomans control of the Islamic holy cities of Mecca and Medina, the lucrative spice trade routes, and the symbolic title of Caliph of Islam."
  },
  {
    id: 107,
    name: "Siege of Rhodes",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["rhodes", "siege of rhodes"],
    prompt: "Siege of Rhodes 1522, Ottoman army besieging the massive fortified city of Rhodes, Suleiman the Magnificent's forces mining walls and launching assaults, Knights Hospitaller in white crosses defending imposing medieval fortifications, Ottoman galleys blockading the harbor, dramatic 16th century island siege scene",
    hints: [
      "The defenders were a famous Christian military order of warrior monks",
      "It was a siege of a heavily fortified island in the eastern Mediterranean",
      "The defenders were allowed to leave with honor after their surrender",
      "Sultan Suleiman the Magnificent expelled the Knights Hospitaller from their island fortress"
    ],
    difficulty: "hard",
    year: 1522,
    location: "Greece",
    description: "Sultan Suleiman the Magnificent besieged the fortress of the Knights Hospitaller on Rhodes with an army of around 100,000 men. After a grueling five-month siege involving extensive mining and multiple assaults, the vastly outnumbered Knights negotiated an honorable surrender. Suleiman, impressed by their courage, allowed them to depart freely. The Knights eventually resettled on Malta, where they would face the Ottomans again in 1565."
  },
  {
    id: 108,
    name: "Battle of Karbala",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["karbala", "battle of karbala"],
    prompt: "Battle of Karbala 680 CE, Husayn ibn Ali and his small band of followers surrounded by a vast Umayyad army on the desert plains of Iraq, desperate last stand near the Euphrates River, Husayn holding his ground against overwhelming odds, dramatic and tragic early Islamic battle scene with desert heat and dust",
    hints: [
      "This tragic event created the deepest division in a major world religion",
      "It was fought on a desert plain near the Euphrates River in Iraq",
      "The outnumbered side was denied access to water for days before the battle",
      "The martyrdom of Husayn ibn Ali, grandson of the Prophet Muhammad, defines Shia Islam"
    ],
    difficulty: "medium",
    year: 680,
    location: "Iraq",
    description: "Husayn ibn Ali, grandson of the Prophet Muhammad, and a small band of around 72 followers were surrounded and killed by thousands of Umayyad troops under Yazid I's orders on the plains of Karbala. The Umayyads had cut off Husayn's party from the Euphrates River, denying them water for days. Husayn's martyrdom became the foundational event of Shia Islam and created the deepest sectarian divide in the Muslim world, commemorated annually during Ashura."
  },
  {
    id: 109,
    name: "Battle of the Zab",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["zab", "battle of the zab", "great zab", "battle of the great zab"],
    prompt: "Battle of the Zab 750 CE, Abbasid revolutionary army with black banners charging Umayyad forces across the Great Zab River in northern Iraq, Abbasid cavalry crossing the river, Umayyad soldiers in white being routed, dramatic early medieval Islamic revolution battle scene with Mesopotamian landscape",
    hints: [
      "The victors carried distinctive black banners as their symbol",
      "It was fought at a river crossing in northern Mesopotamia (modern Iraq)",
      "This battle toppled an existing dynasty and ushered in an Islamic golden age",
      "The Abbasid revolution overthrew the Umayyad Caliphate at this decisive battle"
    ],
    difficulty: "hard",
    year: 750,
    location: "Iraq",
    description: "The Abbasid revolutionary army, marching under black banners, defeated the Umayyad Caliphate's forces under Caliph Marwan II at the Great Zab River in northern Iraq. The Umayyad army collapsed and Marwan fled, only to be hunted down and killed in Egypt. The Abbasids systematically exterminated the Umayyad dynasty and established a new caliphate centered on Baghdad, ushering in the Islamic Golden Age of learning and culture."
  },
  {
    id: 110,
    name: "Battle of Talas",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["talas", "battle of talas"],
    prompt: "Battle of Talas 751 CE, Abbasid Arab and Turkic allied cavalry clashing with Tang Dynasty Chinese soldiers in the mountains of Central Asia, silk road warriors in diverse armor and weapons, Central Asian steppe landscape with mountain backdrop, dramatic clash of Eastern and Western civilizations",
    hints: [
      "Prisoners from this battle may have introduced papermaking to the Islamic world",
      "It was fought in the mountains of Central Asia along the Silk Road",
      "This battle determined which civilization would dominate Central Asia",
      "The Abbasid Caliphate defeated Tang Dynasty China at the furthest reach of both empires"
    ],
    difficulty: "hard",
    year: 751,
    location: "Central Asia",
    description: "An Abbasid Arab army allied with Turkic Karluk warriors defeated a Tang Dynasty Chinese expeditionary force in the Talas River valley of Central Asia. The battle marked the westernmost extent of Chinese influence and secured Islamic dominance over Central Asia. Captured Chinese prisoners reportedly introduced papermaking technology to the Islamic world, revolutionizing communication and scholarship across the Middle East and eventually Europe."
  },
  {
    id: 111,
    name: "Battle of Panipat",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["panipat", "first panipat", "battle of panipat", "first battle of panipat", "panipat 1526"],
    prompt: "First Battle of Panipat 1526, Babur's Mughal army with cannons and matchlocks facing the massive elephant-cavalry army of the Delhi Sultanate on the North Indian plain, war elephants charging into gunfire, Babur's tactical formations with carts chained together, dramatic founding battle of the Mughal Empire",
    hints: [
      "The victor used a tactic of chaining carts together to create a defensive barrier",
      "It was fought on a plain north of Delhi in India",
      "Gunpowder weapons and superior tactics defeated a much larger army with war elephants",
      "Babur's victory founded the Mughal Empire that would rule India for centuries"
    ],
    difficulty: "hard",
    year: 1526,
    location: "India",
    description: "Babur, a descendant of both Timur and Genghis Khan, defeated Sultan Ibrahim Lodi's much larger Delhi Sultanate army using cannons, matchlock firearms, and innovative cart-based field fortifications. Despite being outnumbered roughly four to one, Babur's gunpowder weapons and tactical genius carried the day. The victory founded the Mughal Empire, which would rule most of the Indian subcontinent for over three centuries and create some of history's greatest architectural and cultural achievements."
  },
  {
    id: 112,
    name: "Siege of Malta",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["malta", "siege of malta", "great siege of malta"],
    prompt: "Great Siege of Malta 1565, Ottoman fleet and army assaulting the fortified harbors of Malta, Knights of St John defending massive stone fortifications against waves of janissaries, Ottoman cannons bombarding Fort St Elmo, dramatic 16th century Mediterranean island siege with turquoise harbor waters",
    hints: [
      "A tiny island garrison held off an invasion force of over 40,000 for months",
      "It took place on a small but strategically vital Mediterranean island",
      "The defenders were a famous order of Christian warrior monks",
      "The Knights of St. John under Jean de Valette repelled the Ottoman invasion"
    ],
    difficulty: "medium",
    year: 1565,
    location: "Malta",
    description: "The Knights of St. John, led by Grand Master Jean de Valette, defended Malta against an Ottoman invasion force of over 40,000 with a garrison of only about 6,000. The brutal four-month siege saw Fort St. Elmo fall after weeks of fighting, but the Knights held their remaining fortifications until a Christian relief force arrived from Sicily. The Ottoman withdrawal marked a significant check on Ottoman expansion in the western Mediterranean."
  },
  {
    id: 113,
    name: "Battle of Mezokeresztes",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["mezokeresztes", "keresztes", "battle of mezokeresztes", "battle of keresztes"],
    prompt: "Battle of Mezokeresztes 1596, Ottoman Sultan Mehmed III's army rallying against Habsburg and Transylvanian forces on the Hungarian plain, janissaries counterattacking after near-defeat, Habsburg cavalry looting the Ottoman camp prematurely, dramatic reversal of fortune on a marshy Hungarian battlefield",
    hints: [
      "The losing side prematurely looted the enemy camp, allowing a dramatic reversal",
      "It was fought on a marshy plain in northeastern Hungary",
      "This battle was part of the Long Turkish War between the Ottomans and Habsburgs",
      "Sultan Mehmed III snatched victory from defeat when Habsburg forces broke discipline to loot"
    ],
    difficulty: "hard",
    year: 1596,
    location: "Hungary",
    description: "During the Long Turkish War, Sultan Mehmed III's Ottoman army faced a combined Habsburg and Transylvanian force at Mezokeresztes in Hungary. The Ottomans were on the verge of defeat when Habsburg troops broke ranks to loot the Ottoman camp, allowing the janissaries to counterattack and rout the disorganized Christian forces. The dramatic reversal turned a near-catastrophe into an Ottoman victory, though the costly Long Turkish War would continue for another decade."
  },
  {
    id: 114,
    name: "Battle of Sarikamish",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["sarikamish", "battle of sarikamish", "sarikamis"],
    prompt: "Battle of Sarikamish 1914-1915, Ottoman soldiers freezing in the Caucasus mountains during a winter offensive against Russian positions, soldiers struggling through deep snow and blizzards, Ottoman troops in thin uniforms dying of exposure, Russian defenders in mountain fortifications, tragic WWI winter mountain warfare scene",
    hints: [
      "Tens of thousands of soldiers froze to death in a reckless winter mountain offensive",
      "It was fought in the Caucasus mountains of eastern Turkey",
      "The disastrous defeat contributed to a wartime genocide against a minority population",
      "Enver Pasha's catastrophic winter offensive against Russia destroyed an entire Ottoman army"
    ],
    difficulty: "hard",
    year: 1914,
    location: "Turkey",
    description: "Ottoman War Minister Enver Pasha personally led a reckless winter offensive against Russian forces in the Caucasus mountains. Poorly equipped Ottoman soldiers, many lacking winter clothing, marched through mountain passes in freezing conditions. Of roughly 100,000 Ottoman troops, fewer than 18,000 survived, with most dying from exposure and disease rather than combat. The catastrophic defeat destabilized the eastern Ottoman Empire and contributed to the tragic events that followed."
  },
  {
    id: 115,
    name: "Capture of Aqaba",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["aqaba", "capture of aqaba", "battle of aqaba"],
    prompt: "Arab Revolt Capture of Aqaba 1917, Arab Bedouin warriors on camels and horseback charging through desert canyons toward the Ottoman-held port of Aqaba, T.E. Lawrence among Arab fighters, dramatic desert assault from the landward side, Red Sea port town with Ottoman garrison, WWI Middle Eastern theater",
    hints: [
      "The attackers approached from the desert, a direction thought impossible",
      "It was a surprise assault on an Ottoman-held port on the Red Sea",
      "A famous British officer who adopted Arab dress helped lead the attack",
      "T.E. Lawrence and Arab rebel forces captured this strategic Ottoman port from the landward side"
    ],
    difficulty: "hard",
    year: 1917,
    location: "Jordan",
    description: "Arab rebel forces, guided by T.E. Lawrence ('Lawrence of Arabia'), captured the strategic Ottoman port of Aqaba by attacking overland from the desert, a direction the Ottoman defenses did not cover. The daring raid involved a grueling march across the Nefud Desert followed by a dramatic camel charge. The capture of Aqaba provided a vital supply port for the Arab Revolt and opened a new front against the Ottoman Empire in World War I."
  },
  {
    id: 116,
    name: "Battle of Kut",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["kut", "battle of kut", "siege of kut", "kut al-amara", "fall of kut"],
    prompt: "Siege of Kut 1916, British Indian Army forces besieged inside the Mesopotamian town of Kut-al-Amara surrounded by Ottoman forces, starving British soldiers behind mud walls, Ottoman artillery bombarding the town, failed British relief attempts on the Tigris River, dramatic WWI Mesopotamian campaign siege scene",
    hints: [
      "The besieged garrison was forced to surrender after failed relief attempts",
      "It took place along the Tigris River in Mesopotamia (modern Iraq)",
      "It was one of the most humiliating British surrenders of the First World War",
      "Ottoman forces besieged and captured an entire British-Indian army at Kut-al-Amara"
    ],
    difficulty: "hard",
    year: 1916,
    location: "Iraq",
    description: "Ottoman forces besieged a British-Indian garrison of around 13,000 troops under General Townshend at Kut-al-Amara on the Tigris River. After 147 days of siege and multiple failed relief attempts that cost 23,000 additional British casualties, Townshend surrendered. It was one of Britain's worst military humiliations, with thousands of captured soldiers dying in Ottoman captivity. The disaster led to a complete overhaul of the British Mesopotamian campaign."
  },
  {
    id: 117,
    name: "Battle of Pruth",
    civilization: 'ottoman-islamic',
    acceptedAnswers: ["pruth", "battle of pruth", "prut", "battle of the pruth"],
    prompt: "Battle of the Pruth 1711, Ottoman army surrounding Peter the Great's Russian forces along the Pruth River in Moldova, Ottoman cavalry and janissaries encircling a trapped Russian army, Peter the Great in desperate negotiations, Moldavian landscape with river valley, dramatic 18th century Eastern European battle scene",
    hints: [
      "A famous European monarch was completely trapped and nearly captured in this campaign",
      "It was fought along a river in what is now Moldova",
      "The trapped army negotiated a humiliating peace to avoid total destruction",
      "The Ottomans surrounded Peter the Great's Russian army and forced a humiliating treaty"
    ],
    difficulty: "hard",
    year: 1711,
    location: "Moldova",
    description: "The Ottoman army under Grand Vizier Baltaci Mehmed Pasha surrounded Tsar Peter the Great's Russian army along the Pruth River in Moldova. Trapped with no escape, Peter was forced to negotiate a humiliating peace, returning the fortress of Azov to the Ottomans and dismantling his Black Sea fleet. The campaign was one of the Ottoman Empire's last great military successes and temporarily reversed Russian expansion toward the Black Sea."
  }
];
