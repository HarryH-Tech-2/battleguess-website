import type { Battle } from '../../types';

export const colonialNapoleonicBattles: Battle[] = [
  {
    id: 1,
    name: "Battle of Waterloo",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["waterloo", "battle of waterloo", "waterlo"],
    prompt: "Epic historical oil painting of the Battle of Waterloo 1815, Napoleon's French army clashing with British and Prussian forces, dramatic cavalry charge across muddy fields, smoke from cannons and muskets, soldiers in period-accurate uniforms, Wellington on horseback, stormy sky, cinematic lighting, highly detailed",
    hints: [
      "This battle ended a famous emperor's rule and his return from exile",
      "It occurred in present-day Belgium, south of Brussels",
      "Napoleon Bonaparte commanded the French army",
      "The Duke of Wellington led the opposing coalition forces"
    ],
    difficulty: "medium",
    year: 1815,
    location: "Belgium",
    description: "The Battle of Waterloo ended Napoleon's rule as French Emperor and his Hundred Days return from exile. The Duke of Wellington's allied forces, combined with Prussian reinforcements under Blücher, defeated Napoleon's army in a hard-fought engagement. This decisive victory reshaped European politics and led to Napoleon's final exile to Saint Helena, where he died six years later."
  },
  {
    id: 8,
    name: "Battle of Trafalgar",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["trafalgar", "battle of trafalgar"],
    prompt: "Naval Battle of Trafalgar 1805, British Royal Navy ships of the line engaging French and Spanish fleet, HMS Victory leading the charge, Admiral Nelson's flagship, massive wooden warships with billowing sails, cannon smoke across the sea, dramatic naval warfare painting, stormy Atlantic waters",
    hints: [
      "This naval victory secured British naval supremacy for over a century",
      "It was fought off the coast of Spain near Gibraltar",
      "Britain's greatest naval hero died in this battle",
      "Admiral Horatio Nelson commanded the British fleet"
    ],
    difficulty: "hard",
    year: 1805,
    location: "Atlantic Ocean, off Spain",
    description: "Admiral Horatio Nelson's bold tactics destroyed the combined French and Spanish fleet, securing British naval supremacy for over a century. Nelson was mortally wounded during the battle but lived long enough to know he had won. His famous signal, 'England expects that every man will do his duty,' became an enduring symbol of British naval tradition."
  },
  {
    id: 12,
    name: "Battle of Austerlitz",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["austerlitz", "battle of austerlitz", "battle of three emperors"],
    prompt: "Battle of Austerlitz 1805, Napoleon Bonaparte commanding French Grande Armée against Russian and Austrian forces, cavalry charge across frozen lakes, dramatic fog lifting to reveal French trap, imperial eagles and tricolor flags, Napoleonic warfare at its finest, epic historical battle painting",
    hints: [
      "It's also known as the 'Battle of the Three Emperors'",
      "Napoleon lured the enemy into a trap by feigning weakness",
      "Napoleon considered this his greatest victory",
      "The battle took place in what is now the Czech Republic"
    ],
    difficulty: "hard",
    year: 1805,
    location: "Czech Republic (Moravia)",
    description: "Napoleon lured the combined Austrian and Russian armies into a trap by feigning weakness, then struck their weakened center while they tried to outflank him. The crushing victory ended the Third Coalition and forced Austria to sue for peace. Napoleon himself considered Austerlitz his finest battle, a masterpiece of military deception and tactical execution."
  },
  {
    id: 26,
    name: "Battle of Borodino",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["borodino", "battle of borodino"],
    prompt: "Battle of Borodino 1812, Napoleon's Grande Armée attacking Russian fortifications, massive artillery duel, French cavalry charging Russian redoubts, burning villages, vast Russian landscape, Napoleon observing from hilltop, dramatic Napoleonic Wars painting, smoke-filled battlefield",
    hints: [
      "It was the bloodiest single day of the Napoleonic Wars",
      "It took place west of Moscow during a famous invasion of Russia",
      "The victor marched on to find the capital abandoned and burning",
      "Napoleon won the field but failed to destroy the Russian army"
    ],
    difficulty: "hard",
    year: 1812,
    location: "Russia",
    description: "The bloodiest day of the Napoleonic Wars saw Napoleon's Grande Armée clash with Kutuzov's Russian army in a brutal frontal battle with over 70,000 casualties. Napoleon captured the battlefield but failed to destroy the Russian army, which withdrew in good order. He marched on to Moscow only to find it abandoned and burning, beginning the catastrophic retreat that would destroy his Grande Armée."
  },
  {
    id: 30,
    name: "Battle of Tsushima",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["tsushima", "battle of tsushima"],
    prompt: "Naval Battle of Tsushima 1905, Japanese battleships under Admiral Togo engaging Russian Baltic Fleet, modern steel warships exchanging broadsides, explosions and smoke, Russian ships sinking, dramatic Russo-Japanese War naval battle, gray seas of Tsushima Strait, early 20th century naval warfare painting",
    hints: [
      "The losing fleet had sailed 18,000 miles over seven months to reach the battle",
      "It took place in a strait between Japan and Korea",
      "This victory marked an Asian power's emergence as a world force",
      "Admiral Togo's decisive victory shocked the Western world"
    ],
    difficulty: "hard",
    year: 1905,
    location: "Tsushima Strait, Japan/Korea",
    description: "Admiral Togo's Japanese fleet annihilated the Russian Baltic Fleet, which had sailed 18,000 miles over seven months to reach the Pacific. In one of the most lopsided naval battles in history, Japan sank 21 Russian ships while losing only 3 torpedo boats. The stunning victory marked Japan's emergence as a world power, ended the Russo-Japanese War, and signaled the decline of European dominance in Asia."
  },
  {
    id: 143,
    name: "Battle of Jena-Auerstedt",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["jena", "auerstedt", "jena-auerstedt", "battle of jena", "battle of auerstedt", "battle of jena-auerstedt"],
    prompt: "Battle of Jena-Auerstedt 1806, Napoleon's Grande Armée smashing Prussian army on two fronts simultaneously, French columns advancing through morning fog across Thuringian hills, Prussian cavalry countercharging in vain, Marshal Davout's III Corps holding against the main Prussian force, dramatic Napoleonic warfare painting, smoke and chaos",
    hints: [
      "This twin battle destroyed a once-legendary military power in a single day",
      "It was fought on two separate fields in central Germany simultaneously",
      "One of Napoleon's marshals defeated the main enemy army with a single corps",
      "Napoleon crushed the Prussian army, leading to the occupation of Berlin within weeks"
    ],
    difficulty: "hard",
    year: 1806,
    location: "Germany",
    description: "Napoleon shattered the Prussian army in a devastating twin engagement. While Napoleon himself defeated one Prussian force at Jena, Marshal Davout's outnumbered III Corps held and routed the main Prussian army at Auerstedt. The double victory destroyed Prussian military power in a single day, and within weeks Napoleon occupied Berlin. Prussia was forced into a humiliating peace that reduced it to a shadow of its former self."
  },
  {
    id: 144,
    name: "Battle of Wagram",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["wagram", "battle of wagram"],
    prompt: "Battle of Wagram 1809, massive Napoleonic battle on the Marchfeld plain near Vienna, Napoleon directing the largest army he ever commanded, French infantry assaulting Austrian positions in burning villages, enormous artillery battery of over 100 guns firing in unison, cavalry charges across open fields, dramatic historical battle painting",
    hints: [
      "This battle was fought on a flat plain near a European capital city",
      "It was one of the largest battles in European history up to that point with over 300,000 soldiers engaged",
      "The victor used a massive concentrated artillery battery to break the enemy center",
      "Napoleon defeated Archduke Charles of Austria to end the War of the Fifth Coalition"
    ],
    difficulty: "hard",
    year: 1809,
    location: "Austria",
    description: "Napoleon assembled the largest army he had ever commanded and defeated Archduke Charles of Austria in a brutal two-day battle on the Marchfeld plain near Vienna. Over 300,000 soldiers clashed in one of the largest battles in European history to that point. Napoleon's massing of over 100 guns into a grand battery to smash the Austrian center proved decisive. The victory forced Austria to sign the Treaty of Schonbrunn and cemented Napoleon's dominance over continental Europe."
  },
  {
    id: 145,
    name: "Battle of Leipzig",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["leipzig", "battle of leipzig", "battle of the nations"],
    prompt: "Battle of Leipzig 1813, massive coalition armies of Russia Austria Prussia and Sweden converging on Napoleon's forces from all directions, enormous battlefield spanning multiple villages, fierce fighting around the city of Leipzig, bridges over rivers, the largest battle in European history before World War I, dramatic Napoleonic Wars painting",
    hints: [
      "It is also known as the 'Battle of the Nations' due to the many countries involved",
      "Over half a million soldiers fought in this engagement, the largest in Europe before World War I",
      "The defeated emperor was forced to retreat across the Rhine and abandon Germany",
      "A coalition of Russia, Austria, Prussia, and Sweden defeated Napoleon at this German city"
    ],
    difficulty: "medium",
    year: 1813,
    location: "Germany",
    description: "The largest battle in European history before World War I saw over 600,000 soldiers clash as a coalition of Russia, Austria, Prussia, and Sweden converged on Napoleon's army at Leipzig. After four days of fighting, Napoleon was decisively defeated and forced to retreat across the Rhine, abandoning Germany entirely. The battle effectively ended French domination of Central Europe and set the stage for the invasion of France and Napoleon's first abdication."
  },
  {
    id: 146,
    name: "Battle of Leuthen",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["leuthen", "battle of leuthen"],
    prompt: "Battle of Leuthen 1757, Frederick the Great of Prussia executing his famous oblique order attack against a much larger Austrian army, Prussian infantry advancing in disciplined echelon formation across snowy Silesian fields, Austrian flanks crumbling under concentrated assault, dramatic Seven Years War painting, winter battlefield",
    hints: [
      "The victor used a brilliant flanking maneuver known as the 'oblique order' to defeat an army twice his size",
      "It was fought in winter in Silesia, a region now in modern Poland",
      "Napoleon later called it a masterpiece of maneuver and resolution",
      "Frederick the Great of Prussia won one of his most celebrated victories here"
    ],
    difficulty: "hard",
    year: 1757,
    location: "Poland (Silesia)",
    description: "Frederick the Great executed his famous oblique order attack, concentrating his outnumbered Prussian army against the Austrian left flank while refusing his own left. The Austrians, with nearly twice Frederick's numbers, were rolled up and routed in one of the most brilliant tactical victories in military history. Napoleon later studied this battle and called it a masterpiece of maneuver, resolution, and determination worthy of study for all time."
  },
  {
    id: 147,
    name: "Battle of Blenheim",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["blenheim", "battle of blenheim", "blindheim"],
    prompt: "Battle of Blenheim 1704, Duke of Marlborough and Prince Eugene leading allied cavalry charge across the Danube plain, British and Austrian forces attacking French and Bavarian positions in burning village of Blindheim, War of the Spanish Succession, dramatic early 18th century battle painting, smoke and musket fire",
    hints: [
      "This victory saved the Holy Roman Empire from collapse during the War of the Spanish Succession",
      "It was fought near a village on the Danube River in Bavaria, Germany",
      "An English general won his greatest triumph alongside his Austrian ally Prince Eugene of Savoy",
      "The Duke of Marlborough shattered the myth of French military invincibility"
    ],
    difficulty: "hard",
    year: 1704,
    location: "Germany (Bavaria)",
    description: "The Duke of Marlborough and Prince Eugene of Savoy achieved a stunning victory over a larger French and Bavarian army on the banks of the Danube. Marlborough's bold cavalry charge across open ground split the Franco-Bavarian army in two, trapping thousands in the village of Blindheim. The victory shattered the myth of French military invincibility under Louis XIV, saved Vienna and the Holy Roman Empire, and established Britain as a major European military power."
  },
  {
    id: 148,
    name: "Battle of Plassey",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["plassey", "battle of plassey", "palashi"],
    prompt: "Battle of Plassey 1757, British East India Company troops under Robert Clive facing the Nawab of Bengal's vast army with war elephants, monsoon rains drenching the battlefield, disciplined British redcoats and Indian sepoys in formation, Bengali cavalry and artillery, mango grove battlefield, dramatic colonial India battle painting",
    hints: [
      "This battle established a trading company as the dominant political power in a major Asian region",
      "It was fought during the monsoon season on the banks of a river in eastern India",
      "Treachery among the losing side's commanders played a decisive role in the outcome",
      "Robert Clive's victory over the Nawab of Bengal launched British rule in India"
    ],
    difficulty: "hard",
    year: 1757,
    location: "India (Bengal)",
    description: "Robert Clive led a small British East India Company force of 3,000 against the Nawab of Bengal's army of 50,000 at Plassey. The battle was decided as much by diplomacy as by fighting, as Clive had secretly negotiated the defection of the Nawab's key general, Mir Jafar, who held his troops back during the engagement. The victory gave the East India Company control of Bengal's vast wealth and resources, marking the beginning of British imperial rule in India."
  },
  {
    id: 149,
    name: "Battle of Rossbach",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["rossbach", "battle of rossbach"],
    prompt: "Battle of Rossbach 1757, Frederick the Great's Prussian cavalry under General Seydlitz charging into the flank of a combined French and Austrian army, Prussian infantry wheeling into position with perfect discipline, enemy columns caught in march formation, dramatic Seven Years War cavalry battle painting, German countryside",
    hints: [
      "The victorious army routed a force twice its size in under ninety minutes",
      "It was fought in Saxony, Germany during the Seven Years' War",
      "A devastating cavalry charge into the enemy flank decided the battle before the infantry fully engaged",
      "Frederick the Great humiliated a combined French and Imperial Austrian army"
    ],
    difficulty: "hard",
    year: 1757,
    location: "Germany (Saxony)",
    description: "Frederick the Great annihilated a combined French and Imperial Austrian army twice his size in under ninety minutes at Rossbach. As the allied army attempted a flanking march, Frederick rapidly redeployed and launched General Seydlitz's cavalry into their exposed flank before the enemy could form battle lines. The allies suffered over 5,000 casualties and 5,000 captured against only 550 Prussian losses. The victory humiliated France and made Frederick a hero across Protestant Europe."
  },
  {
    id: 150,
    name: "Battle of the Nile",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["nile", "battle of the nile", "aboukir bay", "aboukir"],
    prompt: "Battle of the Nile 1798, British Royal Navy ships sailing between the anchored French fleet and the shore in Aboukir Bay Egypt, Admiral Nelson's daring attack at dusk, French flagship L'Orient exploding in massive fireball, naval battle illuminated by burning ships, dramatic Napoleonic naval warfare painting, Mediterranean night battle",
    hints: [
      "The attacking fleet found a gap between the anchored enemy ships and the shoreline",
      "It was fought in a bay on the Egyptian coast of the Mediterranean Sea",
      "The enemy flagship exploded in one of the most dramatic moments in naval history",
      "Admiral Nelson destroyed Napoleon's fleet, stranding the French army in Egypt"
    ],
    difficulty: "hard",
    year: 1798,
    location: "Egypt (Aboukir Bay)",
    description: "Admiral Horatio Nelson launched a daring attack on the anchored French fleet in Aboukir Bay, sailing his ships between the French line and the shore to attack from both sides simultaneously. The French flagship L'Orient exploded in a massive fireball visible for miles, one of the most dramatic events in naval history. Nelson destroyed or captured eleven of thirteen French ships of the line, stranding Napoleon's army in Egypt and establishing British naval supremacy in the Mediterranean."
  },
  {
    id: 151,
    name: "Battle of Marengo",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["marengo", "battle of marengo"],
    prompt: "Battle of Marengo 1800, Napoleon nearly defeated then rescued by General Desaix's dramatic late counterattack, French cavalry charging across the plains of northern Italy, Austrian white-coated infantry retreating in disorder, smoke-filled Italian farmland, dramatic reversal of fortune, Napoleonic Wars painting",
    hints: [
      "The battle was nearly lost before a last-minute reinforcement reversed the outcome",
      "It was fought on the plains of northern Italy near the town of Alessandria",
      "The general who led the decisive counterattack was killed in the charge that saved the day",
      "Napoleon's victory here secured his position as First Consul and ruler of France"
    ],
    difficulty: "hard",
    year: 1800,
    location: "Italy (Piedmont)",
    description: "Napoleon was on the verge of defeat when General Desaix arrived with fresh troops and launched a dramatic counterattack that shattered the advancing Austrian army. Desaix was killed leading the charge that reversed the battle's outcome, but his sacrifice turned a near-disaster into a decisive French victory. Marengo secured Napoleon's political position as First Consul, drove Austria from northern Italy, and cemented his reputation as a military genius who could snatch victory from the jaws of defeat."
  },
  {
    id: 152,
    name: "Battle of Vitoria",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["vitoria", "battle of vitoria", "vittoria"],
    prompt: "Battle of Vitoria 1813, Duke of Wellington's allied army attacking French forces from multiple directions across a wide Spanish valley, British Portuguese and Spanish troops storming French positions, French baggage train being captured and looted, Basque Country mountains in background, Peninsular War painting, dramatic action",
    hints: [
      "The defeated army abandoned a massive baggage train full of plundered treasure",
      "It was fought in the Basque Country of northern Spain during the Peninsular War",
      "The victory effectively ended French control of Spain",
      "The Duke of Wellington routed King Joseph Bonaparte's French army"
    ],
    difficulty: "hard",
    year: 1813,
    location: "Spain (Basque Country)",
    description: "The Duke of Wellington launched a coordinated four-column attack that shattered King Joseph Bonaparte's French army defending the vital crossroads of Vitoria. The French were routed so completely that they abandoned an enormous baggage train laden with plundered Spanish treasure, art, and the French war chest. Wellington's troops broke ranks to loot the spoils, prompting the duke's famous complaint about his army. The victory effectively ended French rule in Spain and forced Napoleon to fight on French soil."
  },
  {
    id: 153,
    name: "Spanish Armada",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["spanish armada", "armada", "the armada", "defeat of the spanish armada"],
    prompt: "Defeat of the Spanish Armada 1588, English warships sending fireships into the anchored Spanish fleet at Calais, massive Spanish galleons scattered by storms, Sir Francis Drake commanding English fleet, dramatic naval battle in the English Channel, Tudor era ships with colorful sails, stormy seas, epic Renaissance naval warfare painting",
    hints: [
      "Storms played a devastating role in destroying the defeated fleet as it tried to sail home",
      "Fireships sent among the anchored enemy fleet caused panic and broke their formation",
      "This naval campaign determined whether a Catholic or Protestant power would dominate the seas",
      "England's defeat of Spain's great invasion fleet in 1588 marked the rise of English sea power"
    ],
    difficulty: "medium",
    year: 1588,
    location: "English Channel",
    description: "King Philip II of Spain launched a massive fleet of 130 ships to invade England and overthrow Queen Elizabeth I. English commanders including Sir Francis Drake used faster, more maneuverable ships and fireships to scatter the Armada from its anchorage at Calais. Fierce storms then devastated the fleeing Spanish fleet as it attempted to sail home around Scotland and Ireland. The defeat ended Spain's hopes of conquering England, boosted English national confidence, and marked the beginning of England's rise as a dominant naval power."
  },
  {
    id: 154,
    name: "Battle of Rocroi",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["rocroi", "battle of rocroi"],
    prompt: "Battle of Rocroi 1643, young Duke of Enghien leading French cavalry charge against the legendary Spanish tercios, Spanish infantry squares holding firm in desperate last stand, French horsemen circling the pike formations, Thirty Years War battlefield in northern France, dramatic 17th century battle painting, morning mist and gunpowder smoke",
    hints: [
      "This battle ended the reputation of a legendary infantry formation that had dominated European warfare for over a century",
      "It was fought near the border of France and the Spanish Netherlands",
      "A 21-year-old prince commanded the victorious army in one of his first battles",
      "The young Duke of Enghien's victory over the Spanish tercios at Rocroi ended Spanish military dominance in Europe"
    ],
    difficulty: "hard",
    year: 1643,
    location: "France (Ardennes)",
    description: "The 21-year-old Duke of Enghien, later known as the Grand Conde, led a French army to a stunning victory over the Spanish Army of Flanders at Rocroi. The battle destroyed the legendary Spanish tercios, the pike-and-shot infantry formations that had been considered invincible for over a century. The Spanish infantry fought to near-annihilation in a heroic last stand, but their destruction marked the end of Spanish military supremacy in Europe and the rise of France as the continent's dominant military power."
  },
  {
    id: 155,
    name: "Battle of Poltava",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["poltava", "battle of poltava"],
    prompt: "Battle of Poltava 1709, Tsar Peter the Great's reformed Russian army crushing the Swedish army of Charles XII, Russian infantry in green coats firing volleys at Swedish attackers, wounded Swedish king directing battle from a stretcher, Ukrainian steppe battlefield, Great Northern War painting, dramatic military clash between two empires",
    hints: [
      "This battle ended one Scandinavian kingdom's status as a great European power",
      "It was fought on the Ukrainian steppe during the Great Northern War",
      "The losing king was wounded before the battle and had to command from a stretcher",
      "Tsar Peter the Great's victory over Charles XII of Sweden transformed Russia into a European power"
    ],
    difficulty: "hard",
    year: 1709,
    location: "Ukraine",
    description: "Tsar Peter the Great's reformed Russian army decisively defeated King Charles XII of Sweden at Poltava, ending Sweden's era as a great European power. Charles XII, wounded days before the battle, commanded from a stretcher as his exhausted and outnumbered army attacked prepared Russian positions and was shattered. The victory transformed Russia from a peripheral kingdom into a major European power, secured Peter's modernizing reforms, and shifted the balance of power in Northern and Eastern Europe permanently."
  },
  {
    id: 156,
    name: "Battle of Breitenfeld",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["breitenfeld", "battle of breitenfeld"],
    prompt: "Battle of Breitenfeld 1631, King Gustavus Adolphus of Sweden leading disciplined Swedish army against the Catholic League's Imperial tercios, Swedish mobile artillery firing canister shot, combined arms tactics of cavalry infantry and artillery working together, Thirty Years War battle on Saxon plains near Leipzig, dramatic 17th century military painting",
    hints: [
      "This victory revolutionized European warfare by demonstrating the power of combined arms tactics",
      "It was fought on the plains of Saxony near Leipzig during the Thirty Years' War",
      "The victorious army used mobile artillery and flexible infantry formations to defeat the traditional tercios",
      "King Gustavus Adolphus of Sweden, the 'Lion of the North,' won a landmark victory over the Catholic League"
    ],
    difficulty: "hard",
    year: 1631,
    location: "Germany (Saxony)",
    description: "King Gustavus Adolphus of Sweden won a revolutionary victory over the Imperial Catholic League army under Tilly at Breitenfeld near Leipzig. Despite his Saxon allies routing early in the battle, Gustavus Adolphus used his innovative combined arms tactics, mobile light artillery, and flexible formations to outmaneuver and destroy the Imperial tercios. The victory proved that the traditional deep infantry formations could be beaten by more modern methods and established Sweden as the champion of the Protestant cause in the Thirty Years' War."
  },
  {
    id: 157,
    name: "Battle of Lutzen",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["lutzen", "lützen", "battle of lutzen", "battle of lützen"],
    prompt: "Battle of Lutzen 1632, King Gustavus Adolphus leading a cavalry charge into thick fog and gunsmoke, Swedish army attacking Imperial positions along a road lined with ditches, the Swedish king falling mortally wounded in the chaos of battle, Thirty Years War dramatic painting, swirling mist and desperate combat",
    hints: [
      "The victorious army's king was killed during the battle, dying while leading a cavalry charge",
      "It was fought in dense fog near a town in Saxony during the Thirty Years' War",
      "Despite the loss of their beloved leader, the army fought on to win the battle in his honor",
      "Gustavus Adolphus of Sweden died at Lutzen but his army defeated Wallenstein's Imperial forces"
    ],
    difficulty: "hard",
    year: 1632,
    location: "Germany (Saxony)",
    description: "King Gustavus Adolphus of Sweden was killed leading a cavalry charge into thick fog at Lutzen while fighting Wallenstein's Imperial army. Despite losing their inspirational king, the enraged Swedish army fought on and drove the Imperial forces from the field. The battle was a tactical Swedish victory but a strategic blow, as the loss of Gustavus Adolphus deprived the Protestant cause of its greatest military leader and prolonged the devastating Thirty Years' War for another sixteen years."
  },
  {
    id: 158,
    name: "Battle of the Boyne",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["boyne", "battle of the boyne"],
    prompt: "Battle of the Boyne 1690, William III of Orange leading his army across the River Boyne in Ireland, Protestant and Catholic armies clashing at the river crossing, cavalry fording the river under fire, King James II watching from the opposite bank, Irish countryside, dramatic late 17th century battle painting, green rolling hills",
    hints: [
      "This battle decided the fate of two rival kings and the religious future of a nation",
      "It was fought at a river crossing in eastern Ireland",
      "The defeated king fled to France and never returned to reclaim his throne",
      "William III of Orange defeated the deposed King James II at a river in Ireland"
    ],
    difficulty: "hard",
    year: 1690,
    location: "Ireland",
    description: "William III of Orange led his army across the River Boyne to defeat the forces of the deposed Catholic King James II in the decisive battle of the Williamite War in Ireland. James II, who had been overthrown in England's Glorious Revolution, had raised an army in Ireland to reclaim his throne but fled the field when the battle turned against him, earning the Irish nickname 'Seamus an Chaca.' The victory secured Protestant rule in Britain and Ireland and remains one of the most politically significant battles in Irish and British history."
  },
  {
    id: 159,
    name: "Battle of Chesme",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["chesme", "battle of chesme", "çeşme", "chesma"],
    prompt: "Battle of Chesme 1770, Russian fleet destroying the Ottoman navy trapped in Chesme harbor, fireships igniting closely packed Turkish vessels, massive explosions and flames engulfing the Ottoman fleet, burning warships lighting up the night sky, Aegean coast of Turkey, dramatic 18th century naval battle painting, inferno at sea",
    hints: [
      "Fireships sent into a crowded harbor destroyed an entire fleet trapped at anchor",
      "It was fought in a harbor on the Aegean coast of modern Turkey",
      "This naval victory gave one empire temporary control of the eastern Mediterranean",
      "The Russian navy annihilated the Ottoman fleet at Chesme during the Russo-Turkish War"
    ],
    difficulty: "hard",
    year: 1770,
    location: "Turkey (Aegean Coast)",
    description: "The Russian Baltic Fleet, having sailed all the way around Europe to the Mediterranean, trapped the Ottoman navy in the harbor of Chesme on the Aegean coast of Turkey. Russian fireships sent into the crowded harbor ignited the closely packed Ottoman vessels, and the resulting inferno destroyed virtually the entire Ottoman fleet. Russia lost only one ship while the Ottomans lost over sixty vessels and thousands of sailors. The victory gave Russia temporary control of the Aegean Sea and demonstrated the growing reach of Russian naval power."
  },
  {
    id: 160,
    name: "Siege of Gibraltar",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["gibraltar", "siege of gibraltar", "great siege of gibraltar"],
    prompt: "Great Siege of Gibraltar 1779-1783, British garrison defending the Rock of Gibraltar against Spanish and French besiegers, massive floating batteries attacking the fortress from the sea, red-hot shot from British cannons setting enemy ships ablaze, dramatic Mediterranean fortress siege, towering cliffs of Gibraltar, 18th century military painting",
    hints: [
      "This siege lasted nearly four years, making it one of the longest in British military history",
      "It took place at a famous rocky peninsula controlling the entrance to the Mediterranean Sea",
      "The defenders used red-hot cannonballs to destroy specially built floating batteries attacking from the sea",
      "The British garrison held Gibraltar against a massive Spanish and French siege during the American Revolutionary War"
    ],
    difficulty: "hard",
    year: 1779,
    location: "Gibraltar",
    description: "Spain and France besieged the British fortress of Gibraltar for nearly four years during the American Revolutionary War, hoping to recapture the strategic peninsula controlling the Mediterranean entrance. The British garrison under General George Eliott endured bombardment, starvation, and a dramatic assault by specially constructed floating batteries, which the defenders destroyed using red-hot shot. The successful defense of Gibraltar was one of Britain's most celebrated military achievements of the 18th century and ensured British control of this vital strategic position."
  },
  {
    id: 161,
    name: "Battle of Cape St Vincent",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["cape st vincent", "battle of cape st vincent", "cape saint vincent", "st vincent"],
    prompt: "Battle of Cape St Vincent 1797, British Royal Navy ships breaking the Spanish line, Commodore Nelson boarding two Spanish ships simultaneously in daring action, HMS Captain alongside massive Spanish four-decker San Josef, close-quarters naval combat, Atlantic Ocean off the Portuguese coast, dramatic 18th century naval battle painting, billowing sails and cannon smoke",
    hints: [
      "One bold captain broke formation without orders and boarded two enemy ships in succession",
      "It was fought in the Atlantic Ocean off the southwestern tip of Portugal",
      "This victory helped maintain British naval control during the French Revolutionary Wars",
      "Commodore Horatio Nelson's daring initiative at Cape St Vincent made him a national hero"
    ],
    difficulty: "hard",
    year: 1797,
    location: "Atlantic Ocean, off Portugal",
    description: "Admiral Jervis led a smaller British fleet against a larger Spanish fleet off Cape St Vincent, Portugal, during the French Revolutionary Wars. Commodore Horatio Nelson, acting on his own initiative, broke from the British line and threw his ship HMS Captain into the path of the escaping Spanish fleet. In a legendary feat of daring, Nelson boarded and captured two Spanish ships in succession, including the massive San Josef. The victory prevented Spain from joining its fleet with the French and made Nelson a national hero."
  },
  {
    id: 162,
    name: "Battle of Friedland",
    civilization: 'colonial-napoleonic',
    acceptedAnswers: ["friedland", "battle of friedland"],
    prompt: "Battle of Friedland 1807, Napoleon's army trapping the Russian forces against the Alle River, Marshal Ney's corps storming the burning town of Friedland, French artillery devastating Russian columns packed against the river, bridges collapsing under retreating soldiers, dramatic Napoleonic Wars painting, smoke and flames rising from the town",
    hints: [
      "The defeated army was trapped against a river with limited bridges, turning retreat into disaster",
      "It was fought in East Prussia on the anniversary of another famous Napoleonic victory",
      "The victory led directly to a famous meeting between two emperors on a raft in the middle of a river",
      "Napoleon's destruction of the Russian army at Friedland forced Tsar Alexander I to sign the Treaty of Tilsit"
    ],
    difficulty: "hard",
    year: 1807,
    location: "Russia (Kaliningrad)",
    description: "Napoleon caught the Russian army with its back to the Alle River at Friedland and launched a devastating assault that shattered the Russian forces. Marshal Ney's corps stormed the town while French artillery poured fire into the Russian columns trapped against the river. The Russians suffered catastrophic losses trying to retreat across inadequate bridges. Fought on the anniversary of Marengo, the victory forced Tsar Alexander I to seek peace, leading to the famous meeting between the two emperors on a raft on the Neman River and the Treaty of Tilsit."
  }
];
