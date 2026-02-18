import type { Battle } from '../../types';

export const medievalEuropeBattles: Battle[] = [
  // ============================================================
  // EXISTING BATTLES (original data preserved, civilization added)
  // ============================================================
  {
    id: 4,
    name: "Battle of Hastings",
    civilization: 'medieval-europe',
    acceptedAnswers: ["hastings", "battle of hastings"],
    prompt: "Medieval Battle of Hastings 1066, Norman knights on horseback charging Saxon shield wall, William the Conqueror leading cavalry, King Harold's army defending hill, arrows flying, medieval weapons and armor, English countryside, dramatic historical painting in the style of the Bayeux Tapestry but realistic",
    hints: [
      "The losing king was allegedly killed by an arrow to the eye",
      "It was fought in southern England near the coast",
      "This battle determined who would become King of England",
      "William the Conqueror led the Norman invasion force"
    ],
    difficulty: "easy",
    year: 1066,
    location: "England",
    description: "On October 14, 1066, William, Duke of Normandy, defeated King Harold II's Saxon army, changing English history forever. Harold was killed, allegedly by an arrow to the eye, and William became the first Norman King of England. The battle introduced feudalism to England and profoundly influenced the English language, culture, and aristocracy for centuries to come."
  },
  {
    id: 7,
    name: "Battle of Agincourt",
    civilization: 'medieval-europe',
    acceptedAnswers: ["agincourt", "battle of agincourt", "azincourt"],
    prompt: "Medieval Battle of Agincourt 1415, English longbowmen releasing volley of arrows at French knights, muddy battlefield, King Henry V leading English army, French cavalry charge failing in deep mud, hundreds of arrows darkening sky, Hundred Years War, dramatic medieval battle painting",
    hints: [
      "This battle was fought during the Hundred Years' War",
      "It took place in northern France",
      "English longbowmen played a decisive role in the victory",
      "King Henry V of England led his outnumbered army to victory"
    ],
    difficulty: "hard",
    year: 1415,
    location: "France",
    description: "Henry V's outnumbered English army defeated a much larger French force thanks to the devastating effectiveness of the English longbow. French knights, bogged down in mud and funneled into a narrow field, were cut down in waves. The battle inspired Shakespeare's famous play 'Henry V' and demonstrated how technology and terrain could overcome numerical superiority."
  },
  {
    id: 19,
    name: "Battle of Tours",
    civilization: 'medieval-europe',
    acceptedAnswers: ["tours", "battle of tours", "poitiers", "battle of poitiers 732", "tours-poitiers"],
    prompt: "Battle of Tours 732 CE, Frankish warriors under Charles Martel forming infantry phalanx against Umayyad cavalry charge, medieval Frankish soldiers with shields and axes, Arab horsemen with curved swords, clash of civilizations on French plains, dramatic early medieval battle painting",
    hints: [
      "It halted a major northward military advance into Western Europe",
      "It took place in central France between two famous cities",
      "Many historians consider it among the most decisive battles in world history",
      "Charles Martel, 'The Hammer,' led the victorious Frankish army"
    ],
    difficulty: "hard",
    year: 732,
    location: "France",
    description: "Charles Martel's Frankish army halted the Umayyad Caliphate's advance into Western Europe, a victory many historians consider among the most decisive in world history. The Frankish infantry held firm against repeated cavalry charges, and the Umayyad commander Abd al-Rahman was killed. The battle preserved Christian Western Europe and established the Carolingian dynasty's prestige, paving the way for Charlemagne."
  },
  {
    id: 21,
    name: "Battle of Cr\u00e9cy",
    civilization: 'medieval-europe',
    acceptedAnswers: ["crecy", "cr\u00e9cy", "battle of crecy", "battle of cr\u00e9cy"],
    prompt: "Medieval Battle of Cr\u00e9cy 1346, English longbowmen raining arrows on French knights, King Edward III commanding from hilltop, French cavalry charge uphill into arrow storm, muddy battlefield, Hundred Years War, medieval armor and heraldry, dramatic historical battle painting",
    hints: [
      "This battle was fought during the Hundred Years' War",
      "It took place in northern France",
      "English longbowmen devastated waves of French cavalry",
      "King Edward III of England won despite being heavily outnumbered"
    ],
    difficulty: "hard",
    year: 1346,
    location: "France",
    description: "Edward III's English army, anchored by devastating longbow fire, destroyed a much larger French force that charged uphill in disorganized waves. The French suffered catastrophic losses among their nobility, including the blind King John of Bohemia who rode into battle tied to his knights. Cr\u00e9cy demonstrated the dominance of the English longbow and heralded the decline of mounted knightly warfare."
  },

  // ============================================================
  // NEW BATTLES (IDs 74-94)
  // ============================================================
  {
    id: 74,
    name: "Battle of Bannockburn",
    civilization: 'medieval-europe',
    acceptedAnswers: ["bannockburn", "battle of bannockburn"],
    prompt: "Medieval Battle of Bannockburn 1314, Scottish spearmen in schiltron formations repelling English heavy cavalry, Robert the Bruce on horseback rallying his troops, marshy terrain and streams disrupting English charge, Scottish saltire banners, English knights falling from horses, Wars of Scottish Independence, dramatic medieval battle painting",
    hints: [
      "This battle secured a small nation's independence from a much larger neighbor",
      "The terrain, including boggy ground and streams, neutralized the enemy's cavalry advantage",
      "It was fought over two days near a royal castle in central Scotland",
      "Robert the Bruce led the Scots to a decisive victory over Edward II's English army"
    ],
    difficulty: "medium",
    year: 1314,
    location: "Scotland",
    description: "Robert the Bruce's Scottish army defeated a far larger English force under Edward II near Stirling Castle. The Scots used dense spear formations called schiltrons and chose boggy terrain that neutralized English heavy cavalry. The decisive victory secured Scottish independence for centuries and cemented Bruce's place as Scotland's greatest king. It remains one of the most celebrated battles in Scottish history."
  },
  {
    id: 75,
    name: "Siege of Constantinople",
    civilization: 'medieval-europe',
    acceptedAnswers: ["constantinople", "siege of constantinople", "fall of constantinople", "constantinople 1453"],
    prompt: "Siege of Constantinople 1453, Ottoman army with massive cannons bombarding the Theodosian Walls, Sultan Mehmed II directing the assault, Byzantine defenders on ancient walls, Ottoman janissaries storming breaches, Greek fire and cannon smoke, Hagia Sophia in background, dramatic fall of the Byzantine Empire painting",
    hints: [
      "This siege ended an empire that had lasted over a thousand years",
      "Enormous cannons, some of the largest ever built, were used to breach legendary walls",
      "The defenders were vastly outnumbered but held out for nearly two months",
      "Sultan Mehmed II conquered the last remnant of the Roman Empire"
    ],
    difficulty: "medium",
    year: 1453,
    location: "Turkey",
    description: "Sultan Mehmed II's Ottoman army besieged the Byzantine capital with over 80,000 troops and massive cannons that battered the ancient Theodosian Walls. Despite a heroic defense led by Emperor Constantine XI, the city fell on May 29, 1453, ending the Byzantine Empire and over a thousand years of Roman imperial continuity. The fall sent shockwaves through Christendom and marked the definitive end of the medieval era."
  },
  {
    id: 76,
    name: "Battle of Poitiers",
    civilization: 'medieval-europe',
    acceptedAnswers: ["poitiers 1356", "battle of poitiers 1356", "poitiers"],
    prompt: "Medieval Battle of Poitiers 1356, English and Gascon forces under the Black Prince fighting French knights, King John II of France surrounded and captured, English longbowmen firing from hedgerows, French cavalry disordered in vineyards and hedges, Hundred Years War, dramatic medieval battle painting",
    hints: [
      "A reigning monarch was captured on the battlefield during this engagement",
      "It was fought in western France during the Hundred Years' War",
      "English longbowmen and dismounted men-at-arms used terrain to devastating effect",
      "Edward the Black Prince captured King John II of France"
    ],
    difficulty: "hard",
    year: 1356,
    location: "France",
    description: "Edward the Black Prince's Anglo-Gascon army defeated a much larger French force and captured King John II of France on the battlefield. The English used hedgerows and vineyards to channel the French attacks, while longbowmen devastated the advancing knights. The capture of the French king led to an enormous ransom and the Treaty of Bretigny, temporarily giving England vast territories in France."
  },
  {
    id: 77,
    name: "Battle of Bouvines",
    civilization: 'medieval-europe',
    acceptedAnswers: ["bouvines", "battle of bouvines"],
    prompt: "Medieval Battle of Bouvines 1214, King Philip II Augustus of France leading French knights against coalition of Holy Roman Empire and English forces, armored cavalry clash on open field, French royal banner with fleur-de-lis, Emperor Otto IV fleeing, dramatic medieval battle painting with heraldic banners",
    hints: [
      "This battle decided the fate of three kingdoms in a single afternoon",
      "It was fought in northern France near the Flemish border",
      "The losing coalition included forces from England and the Holy Roman Empire",
      "King Philip II Augustus of France defeated Emperor Otto IV and King John of England's allies"
    ],
    difficulty: "hard",
    year: 1214,
    location: "France",
    description: "Philip II Augustus of France defeated a powerful coalition of the Holy Roman Emperor Otto IV, King John of England's allies, and the Count of Flanders in a single decisive battle. The victory cemented French royal power, led to John signing the Magna Carta under pressure from his barons, and ended Otto IV's claim to the imperial throne. Bouvines is considered one of the most consequential battles in medieval European history."
  },
  {
    id: 78,
    name: "Battle of Hattin",
    civilization: 'medieval-europe',
    acceptedAnswers: ["hattin", "battle of hattin", "horns of hattin"],
    prompt: "Battle of Hattin 1187, Saladin's Muslim army surrounding exhausted Crusader knights on barren hillside, Crusaders desperate for water under scorching sun, Guy of Lusignan's army trapped near twin-peaked hill, True Cross captured, dramatic Crusades battle painting with desert heat haze",
    hints: [
      "The defeated army was lured into waterless terrain and destroyed by thirst and encirclement",
      "It was fought on a barren hillside in the Holy Land during the Crusades",
      "The most important Christian relic in the East was captured during the battle",
      "Saladin annihilated the Crusader army and recaptured Jerusalem shortly after"
    ],
    difficulty: "hard",
    year: 1187,
    location: "Israel",
    description: "Saladin lured the Crusader army under King Guy of Lusignan away from water sources and trapped them on the barren Horns of Hattin. Exhausted by heat and thirst, the Crusaders were annihilated, and the True Cross was captured. The disaster left the Crusader states virtually defenseless, and Saladin recaptured Jerusalem within three months, prompting the Third Crusade."
  },
  {
    id: 79,
    name: "Battle of Manzikert",
    civilization: 'medieval-europe',
    acceptedAnswers: ["manzikert", "battle of manzikert", "malazgirt"],
    prompt: "Battle of Manzikert 1071, Seljuk Turkish horse archers encircling Byzantine heavy cavalry, Emperor Romanos IV Diogenes captured on battlefield, Turkish mounted warriors with composite bows, Byzantine cataphracts in golden armor, Anatolian steppe landscape, dramatic medieval Eastern battle painting",
    hints: [
      "This defeat opened an entire subcontinent to invasion and permanent settlement",
      "It was fought in eastern Anatolia between a Christian empire and Turkish invaders",
      "The reigning emperor was captured alive on the battlefield",
      "The Seljuk Turks under Alp Arslan defeated the Byzantine Empire, opening Anatolia to Turkish settlement"
    ],
    difficulty: "hard",
    year: 1071,
    location: "Turkey",
    description: "The Seljuk Turks under Sultan Alp Arslan defeated the Byzantine army and captured Emperor Romanos IV Diogenes in one of history's most consequential battles. The disaster shattered Byzantine military power in Anatolia, opening the peninsula to massive Turkish migration and settlement. The loss of Anatolia permanently weakened Byzantium and was a direct catalyst for the First Crusade two decades later."
  },
  {
    id: 80,
    name: "Battle of Legnano",
    civilization: 'medieval-europe',
    acceptedAnswers: ["legnano", "battle of legnano"],
    prompt: "Medieval Battle of Legnano 1176, Lombard League infantry militia defending their carroccio war wagon against Emperor Frederick Barbarossa's German knights, Italian city-state soldiers with pikes and crossbows, Holy Roman Empire cavalry charge repulsed, northern Italian plains, dramatic medieval battle painting",
    hints: [
      "City-state militia infantry defeated the most powerful emperor in Europe",
      "It was fought in northern Italy between a league of cities and an imperial army",
      "The battle centered around the defense of a sacred war wagon called a carroccio",
      "The Lombard League defeated Holy Roman Emperor Frederick Barbarossa"
    ],
    difficulty: "hard",
    year: 1176,
    location: "Italy",
    description: "The Lombard League, an alliance of northern Italian city-states, defeated the army of Holy Roman Emperor Frederick Barbarossa. The Italian militia infantry rallied around their carroccio, a sacred ox-drawn war wagon, and repulsed Barbarossa's cavalry. The victory forced the emperor to recognize the independence of the Italian communes in the Peace of Constance and demonstrated that well-organized infantry could defeat feudal cavalry."
  },
  {
    id: 81,
    name: "Battle of Towton",
    civilization: 'medieval-europe',
    acceptedAnswers: ["towton", "battle of towton"],
    prompt: "Battle of Towton 1461, Yorkist and Lancastrian armies clashing in a blinding snowstorm, Wars of the Roses, thousands of armored knights and men-at-arms fighting in snow-covered fields, white rose and red rose banners, brutal medieval close combat, blood-stained snow, dramatic English civil war painting",
    hints: [
      "It was fought during a blinding snowstorm that gave one side a crucial advantage",
      "This is considered the bloodiest battle ever fought on English soil",
      "It was a pivotal engagement in the Wars of the Roses",
      "The Yorkist victory put Edward IV on the English throne, deposing Henry VI"
    ],
    difficulty: "hard",
    year: 1461,
    location: "England",
    description: "Fought in a blinding snowstorm near the village of Towton in Yorkshire, this was the bloodiest battle ever fought on English soil, with estimates of up to 28,000 killed. The Yorkists used the driving snow to their advantage, as Lancastrian archers fired into the wind and fell short. Edward of York's decisive victory made him King Edward IV and was the defining moment of the Wars of the Roses."
  },
  {
    id: 82,
    name: "Siege of Acre",
    civilization: 'medieval-europe',
    acceptedAnswers: ["acre", "siege of acre", "battle of acre"],
    prompt: "Siege of Acre 1191, Crusader armies besieging the walled port city, Richard the Lionheart and Philip II of France directing siege operations, siege towers and trebuchets bombarding walls, Saladin's relief army attacking Crusader camp from behind, Mediterranean port city under siege, dramatic Third Crusade battle painting",
    hints: [
      "The besieging army was itself besieged by a relief force, creating a double siege",
      "It was fought at a key port city in the Holy Land during the Third Crusade",
      "Two of Europe's most famous kings jointly commanded the attacking force",
      "Richard the Lionheart and Philip II of France captured the city from Saladin's garrison"
    ],
    difficulty: "hard",
    year: 1191,
    location: "Israel",
    description: "The Crusader siege of Acre was one of the most dramatic engagements of the Third Crusade, lasting nearly two years. The besieging Crusaders were themselves encircled by Saladin's relief army, creating a remarkable double siege. The arrival of Richard the Lionheart and Philip II of France turned the tide, and the city fell in July 1191. The capture of Acre gave the Crusaders a vital port and base of operations in the Holy Land."
  },
  {
    id: 83,
    name: "Battle of Muret",
    civilization: 'medieval-europe',
    acceptedAnswers: ["muret", "battle of muret"],
    prompt: "Battle of Muret 1213, Simon de Montfort's small force of Crusader knights charging out of the town against the much larger army of King Peter II of Aragon and Cathar allies, southern French landscape with walled town, Albigensian Crusade cavalry battle, dramatic medieval battle painting",
    hints: [
      "A tiny force of Crusader knights defeated a vastly larger army through a bold cavalry charge",
      "It was fought in southern France during a crusade against Christian heretics",
      "A king from beyond the Pyrenees was killed while defending the heretics' cause",
      "Simon de Montfort defeated King Peter II of Aragon during the Albigensian Crusade"
    ],
    difficulty: "hard",
    year: 1213,
    location: "France",
    description: "Simon de Montfort led a daring cavalry charge from the town of Muret with fewer than 1,000 knights against a combined army of perhaps 30,000 under King Peter II of Aragon and the Counts of Toulouse and Foix. Peter II was killed in the fighting, and his army disintegrated. The victory secured the Albigensian Crusade's success, destroyed Cathar hopes for Aragonese protection, and ultimately brought southern France under the French crown."
  },
  {
    id: 84,
    name: "Battle of Las Navas de Tolosa",
    civilization: 'medieval-europe',
    acceptedAnswers: ["las navas de tolosa", "battle of las navas de tolosa", "navas de tolosa"],
    prompt: "Battle of Las Navas de Tolosa 1212, combined Christian armies of Castile Aragon and Navarre charging Almohad Muslim positions, Spanish Reconquista warriors with cross emblems, Almohad warriors with chain-linked bodyguard ring, mountain pass battlefield in southern Spain, dramatic medieval Iberian battle painting",
    hints: [
      "A coalition of Christian kingdoms united to fight a decisive battle of the Reconquista",
      "It was fought in a mountain pass in southern Spain",
      "The defeated caliph's elite bodyguard were chained together to prevent retreat",
      "The combined armies of Castile, Aragon, and Navarre defeated the Almohad Caliphate"
    ],
    difficulty: "hard",
    year: 1212,
    location: "Spain",
    description: "A grand coalition of the Christian kingdoms of Castile, Aragon, and Navarre, supported by crusaders from across Europe, defeated the Almohad Caliphate in a battle that broke Muslim military power in Iberia. The Almohad caliph's elite bodyguard, chained together to prevent retreat, were overwhelmed. The victory was the turning point of the Reconquista, leading to the rapid Christian conquest of Cordoba, Seville, and most of southern Spain within decades."
  },
  {
    id: 85,
    name: "Battle of Tannenberg",
    civilization: 'medieval-europe',
    acceptedAnswers: ["tannenberg", "battle of tannenberg", "grunwald", "battle of grunwald", "tannenberg 1410"],
    prompt: "Battle of Tannenberg/Grunwald 1410, Polish-Lithuanian cavalry charging Teutonic Knight heavy cavalry, Grand Master Ulrich von Jungingen leading Teutonic charge, Polish and Lithuanian banners with eagle and knight, armored medieval cavalry clash on open field, dramatic late medieval battle painting",
    hints: [
      "This battle ended the military dominance of a powerful crusading order of warrior monks",
      "It was fought on open fields in northeastern Europe between Slavic and Germanic forces",
      "A dual kingdom combining Western and Eastern forces won the day",
      "The Polish-Lithuanian alliance crushed the Teutonic Knights, killing their Grand Master"
    ],
    difficulty: "hard",
    year: 1410,
    location: "Poland",
    description: "The combined Polish-Lithuanian army under King Wladyslaw II Jagiello and Grand Duke Vytautas decisively defeated the Teutonic Knights in one of medieval Europe's largest battles. The Teutonic Grand Master Ulrich von Jungingen was killed along with much of the Order's leadership. The victory broke the Teutonic Knights' power permanently and established the Polish-Lithuanian union as a major European power for centuries to come."
  },
  {
    id: 86,
    name: "Battle of Stirling Bridge",
    civilization: 'medieval-europe',
    acceptedAnswers: ["stirling bridge", "battle of stirling bridge", "stirling"],
    prompt: "Battle of Stirling Bridge 1297, Scottish warriors under William Wallace attacking English knights trapped on a narrow wooden bridge over the River Forth, English heavy cavalry unable to deploy, Scottish spearmen overwhelming English vanguard, river and bridge as focal point, Wars of Scottish Independence, dramatic medieval battle painting",
    hints: [
      "A narrow river crossing became a death trap for a heavily armored invading army",
      "It was fought in central Scotland during the Wars of Scottish Independence",
      "The victorious commander was a commoner, not a noble, which was extraordinary for the time",
      "William Wallace destroyed an English army by attacking as it crossed a bridge"
    ],
    difficulty: "medium",
    year: 1297,
    location: "Scotland",
    description: "William Wallace and Andrew de Moray ambushed an English army as it crossed the narrow bridge over the River Forth near Stirling. The English could only cross a few abreast, and the Scots attacked when roughly half the army had crossed, trapping them against the river. The English vanguard was annihilated, and the remainder fled. The stunning victory made Wallace Guardian of Scotland and a symbol of Scottish resistance."
  },
  {
    id: 87,
    name: "Battle of Nicopolis",
    civilization: 'medieval-europe',
    acceptedAnswers: ["nicopolis", "battle of nicopolis", "nikopol"],
    prompt: "Battle of Nicopolis 1396, French and Burgundian Crusader knights charging recklessly into Ottoman positions, Sultan Bayezid I's disciplined forces counterattacking, Ottoman janissaries and sipahi cavalry, Crusader knights trapped and defeated, Danube River in background, dramatic late medieval Crusade battle painting",
    hints: [
      "Reckless chivalric bravado led the Western knights to charge without coordination",
      "It was fought near the Danube River in the Balkans",
      "This was the last large-scale Crusade of the Middle Ages",
      "Sultan Bayezid I 'the Thunderbolt' crushed a multinational Crusader army"
    ],
    difficulty: "hard",
    year: 1396,
    location: "Bulgaria",
    description: "Sultan Bayezid I destroyed the last great Crusade of the Middle Ages when French and Burgundian knights charged recklessly into prepared Ottoman positions without waiting for their Hungarian allies. The undisciplined Crusader attack was repulsed, and the Ottoman counterattack routed the entire Christian army. Thousands of Crusader nobles were captured and held for ransom. The defeat ended any serious Western attempt to halt Ottoman expansion in the Balkans for decades."
  },
  {
    id: 88,
    name: "Battle of Lechfeld",
    civilization: 'medieval-europe',
    acceptedAnswers: ["lechfeld", "battle of lechfeld"],
    prompt: "Battle of Lechfeld 955, King Otto I leading German heavy cavalry against Magyar horse archers, armored Ottonian knights charging across river plain, Magyar raiders with composite bows retreating, Holy Roman Empire banners, southern German landscape with river, dramatic early medieval battle painting",
    hints: [
      "This victory ended decades of devastating raids that had terrorized Central Europe",
      "It was fought on a river plain in southern Germany",
      "The victorious king was later crowned emperor, founding a new imperial dynasty",
      "Otto I of Germany decisively defeated the Magyar horsemen, ending their raids into Europe"
    ],
    difficulty: "hard",
    year: 955,
    location: "Germany",
    description: "King Otto I of Germany gathered a large army and defeated the Magyars in a decisive battle on the Lechfeld plain near Augsburg. The Magyar raiding force was annihilated as it tried to retreat, ending half a century of devastating Hungarian raids into Western Europe. The victory established Otto as the dominant ruler in Europe and led to his coronation as Holy Roman Emperor in 962, founding the imperial tradition that lasted until 1806."
  },
  {
    id: 89,
    name: "Battle of Clontarf",
    civilization: 'medieval-europe',
    acceptedAnswers: ["clontarf", "battle of clontarf"],
    prompt: "Battle of Clontarf 1014, Irish warriors under High King Brian Boru fighting Viking and Leinster forces near Dublin, fierce hand-to-hand combat with axes and swords, Viking longships beached in background, Irish countryside near coast, aging king killed in his tent after victory, dramatic medieval Irish battle painting",
    hints: [
      "The victorious king was killed in his tent by fleeing enemies after the battle was won",
      "It was fought near a major Viking-founded city on Ireland's east coast",
      "It broke the power of Norse settlers and their local allies in Ireland",
      "High King Brian Boru defeated the Vikings and their Leinster allies at the cost of his life"
    ],
    difficulty: "hard",
    year: 1014,
    location: "Ireland",
    description: "High King Brian Boru's Irish army defeated a coalition of Vikings from Dublin, Orkney, and the Isle of Man, along with the rebellious Kingdom of Leinster, in fierce fighting near Dublin. The battle broke Viking power in Ireland but came at a terrible cost: Brian Boru was killed in his tent by fleeing Norse warriors after the battle was won. His death left Ireland without a strong central ruler, but the Viking age in Ireland was effectively over."
  },
  {
    id: 90,
    name: "Battle of Arsuf",
    civilization: 'medieval-europe',
    acceptedAnswers: ["arsuf", "battle of arsuf", "jaffa"],
    prompt: "Battle of Arsuf 1191, Richard the Lionheart leading Crusader heavy cavalry charge against Saladin's army, Crusader knights in formation along Mediterranean coast, Muslim horse archers harassing marching column, Hospitaller knights charging in disciplined formation, Third Crusade coastal battle, dramatic medieval Crusade painting",
    hints: [
      "The victorious army maintained strict discipline while marching under constant harassment",
      "It was fought along the Mediterranean coast of the Holy Land",
      "The Hospitaller knights broke ranks and charged, forcing the commander to commit to a full attack",
      "Richard the Lionheart defeated Saladin in a pitched battle during the Third Crusade"
    ],
    difficulty: "hard",
    year: 1191,
    location: "Israel",
    description: "Richard the Lionheart marched his Crusader army south along the coast toward Jaffa while Saladin's forces constantly harassed them. At Arsuf, the Hospitaller knights, unable to endure further provocation, broke ranks and charged. Richard seized the moment and ordered a general cavalry charge that routed Saladin's army. The victory was one of the few times a Crusader army defeated Saladin in open battle and demonstrated Richard's superb tactical ability."
  },
  {
    id: 91,
    name: "Siege of Orl\u00e9ans",
    civilization: 'medieval-europe',
    acceptedAnswers: ["orleans", "orl\u00e9ans", "siege of orleans", "siege of orl\u00e9ans", "battle of orleans"],
    prompt: "Siege of Orl\u00e9ans 1429, Joan of Arc in white armor on horseback leading French troops to relieve the besieged city, English siege fortifications being stormed, French soldiers inspired by the Maid, Loire River and city walls, fleur-de-lis banners, dramatic Hundred Years War painting with divine light",
    hints: [
      "A teenage peasant girl claimed divine visions told her to save her kingdom",
      "It was fought along the Loire River in central France during the Hundred Years' War",
      "The relief of this city turned the tide of the entire war",
      "Joan of Arc inspired the French army to break the English siege"
    ],
    difficulty: "medium",
    year: 1429,
    location: "France",
    description: "Joan of Arc, a seventeen-year-old peasant girl claiming divine guidance, inspired the demoralized French army to break the English siege of Orl\u00e9ans in just nine days. Her arrival transformed French morale and led to a series of victories that turned the Hundred Years' War decisively in France's favor. The relief of Orl\u00e9ans paved the way for the coronation of Charles VII at Reims and began the process that would expel the English from France."
  },
  {
    id: 92,
    name: "Battle of Kosovo",
    civilization: 'medieval-europe',
    acceptedAnswers: ["kosovo", "battle of kosovo", "kosovo 1389", "kosovo polje"],
    prompt: "Battle of Kosovo 1389, Serbian knights under Prince Lazar clashing with Ottoman army under Sultan Murad I, both leaders killed in battle, Serbian heavy cavalry charging Ottoman center, dramatic Balkan medieval battlefield, Ottoman janissaries and sipahis, epic tragic medieval battle painting",
    hints: [
      "Both the sultan and the opposing prince were killed during or after this battle",
      "It was fought on a wide plain in the Balkans known as the 'Field of Blackbirds'",
      "Though tactically inconclusive, it led to the gradual subjugation of an entire Christian kingdom",
      "Prince Lazar of Serbia fought Sultan Murad I of the Ottoman Empire on Kosovo Polje"
    ],
    difficulty: "hard",
    year: 1389,
    location: "Serbia",
    description: "Prince Lazar of Serbia and Sultan Murad I of the Ottoman Empire clashed on the Field of Blackbirds (Kosovo Polje) in a battle that killed both leaders. A Serbian knight, Milo\u0161 Obili\u0107, assassinated Murad in his tent, and Lazar was captured and executed. Though the battle's immediate outcome was ambiguous, it led to Serbia's gradual absorption into the Ottoman Empire. Kosovo became the central myth of Serbian national identity, commemorated in epic poetry for centuries."
  },
  {
    id: 93,
    name: "Battle of Stamford Bridge",
    civilization: 'medieval-europe',
    acceptedAnswers: ["stamford bridge", "battle of stamford bridge"],
    prompt: "Battle of Stamford Bridge 1066, King Harold Godwinson's Saxon army surprising Viking invaders, legendary lone Viking berserker holding the bridge against the entire Saxon army, Harald Hardrada's Norse warriors caught without armor, fierce hand-to-hand combat at wooden bridge, Yorkshire countryside, dramatic early medieval battle painting",
    hints: [
      "Legend tells of a single giant warrior who held a bridge alone against an entire army",
      "The defeated invaders had been caught by surprise while resting without their armor",
      "It was fought in northern England just days before another famous battle in 1066",
      "Harold Godwinson destroyed Harald Hardrada's Viking invasion force"
    ],
    difficulty: "hard",
    year: 1066,
    location: "England",
    description: "King Harold Godwinson force-marched his Saxon army north and caught the Viking invasion force of Harald Hardrada and Harold's own brother Tostig completely by surprise at Stamford Bridge. Legend tells of a single giant Viking berserker who held the bridge alone until an Englishman floated under it in a barrel and speared him from below. Both Hardrada and Tostig were killed, ending the Viking Age in England. Just three days later, Harold learned that William of Normandy had landed in the south."
  },
  {
    id: 94,
    name: "Battle of Sluys",
    civilization: 'medieval-europe',
    acceptedAnswers: ["sluys", "battle of sluys", "sluis", "battle of sluis", "l'ecluse"],
    prompt: "Naval Battle of Sluys 1340, English warships grappling and boarding French fleet chained together in harbor, Edward III commanding from his flagship, medieval naval warfare with longbowmen raining arrows onto crowded French decks, ships locked together in brutal close combat, Flemish coast, Hundred Years War naval battle painting",
    hints: [
      "The losing fleet was chained together in a defensive formation that became a death trap",
      "It was fought in a harbor off the coast of Flanders at the start of a long dynastic war",
      "English longbowmen devastated the enemy crews before boarding actions began",
      "Edward III of England destroyed the French fleet, securing English control of the Channel"
    ],
    difficulty: "hard",
    year: 1340,
    location: "English Channel",
    description: "Edward III's English fleet attacked the French navy, which had chained its ships together in the harbor of Sluys off the Flemish coast. English longbowmen decimated the packed French crews before English men-at-arms boarded the French vessels. The French fleet was virtually annihilated, with nearly 200 ships captured or sunk. The victory gave England naval supremacy in the English Channel for a generation and allowed the English to invade France at will during the early Hundred Years' War."
  }
];
