import type { Battle } from '../types';

export const battles: Battle[] = [
  {
    id: 1,
    name: "Battle of Waterloo",
    acceptedAnswers: ["waterloo", "battle of waterloo", "waterlo"],
    prompt: "Epic historical oil painting of the Battle of Waterloo 1815, Napoleon's French army clashing with British and Prussian forces, dramatic cavalry charge across muddy fields, smoke from cannons and muskets, soldiers in period-accurate uniforms, Wellington on horseback, stormy sky, cinematic lighting, highly detailed",
    hints: [
      "This decisive battle took place in June 1815",
      "It occurred in present-day Belgium, south of Brussels",
      "Napoleon Bonaparte commanded the French army",
      "The Duke of Wellington led the opposing coalition forces"
    ],
    difficulty: "medium",
    year: 1815,
    location: "Belgium",
    description: "The final defeat of Napoleon Bonaparte"
  },
  {
    id: 2,
    name: "Battle of Thermopylae",
    acceptedAnswers: ["thermopylae", "battle of thermopylae", "thermopylai", "300 spartans"],
    prompt: "Ancient Greek battle scene at Thermopylae, 300 Spartan warriors in bronze armor and red cloaks defending a narrow mountain pass against massive Persian army, King Leonidas at the front with spear and shield, dramatic cliffs, dust and arrows filling the air, heroic last stand, epic ancient warfare painting",
    hints: [
      "This battle occurred in 480 BCE during the Greco-Persian Wars",
      "It took place at a narrow coastal pass in Greece",
      "A small Greek force famously held off a much larger Persian army",
      "King Leonidas led 300 Spartan warriors in this legendary stand"
    ],
    difficulty: "easy",
    year: -480,
    location: "Greece",
    description: "The legendary last stand of 300 Spartans"
  },
  {
    id: 3,
    name: "Battle of Gettysburg",
    acceptedAnswers: ["gettysburg", "battle of gettysburg", "getysburg"],
    prompt: "American Civil War Battle of Gettysburg 1863, Union and Confederate soldiers in fierce combat, Pickett's Charge across open fields, cannons firing, smoke-filled battlefield, blue and gray uniforms, dramatic Pennsylvania landscape with rolling hills, historical war painting style, intense action",
    hints: [
      "This battle was fought in July 1863 during the American Civil War",
      "It took place in Pennsylvania, a Northern state",
      "It's considered the turning point of the American Civil War",
      "President Lincoln later gave a famous speech honoring the fallen here"
    ],
    difficulty: "medium",
    year: 1863,
    location: "Pennsylvania, USA",
    description: "The turning point of the American Civil War"
  },
  {
    id: 4,
    name: "Battle of Hastings",
    acceptedAnswers: ["hastings", "battle of hastings"],
    prompt: "Medieval Battle of Hastings 1066, Norman knights on horseback charging Saxon shield wall, William the Conqueror leading cavalry, King Harold's army defending hill, arrows flying, medieval weapons and armor, English countryside, dramatic historical painting in the style of the Bayeux Tapestry but realistic",
    hints: [
      "This battle took place in October 1066",
      "It was fought in southern England near the coast",
      "This battle determined who would become King of England",
      "William the Conqueror led the Norman invasion force"
    ],
    difficulty: "medium",
    year: 1066,
    location: "England",
    description: "The Norman conquest of England"
  },
  {
    id: 5,
    name: "Battle of Stalingrad",
    acceptedAnswers: ["stalingrad", "battle of stalingrad"],
    prompt: "World War 2 Battle of Stalingrad, brutal urban warfare in destroyed Soviet city, Soviet Red Army soldiers fighting German Wehrmacht in rubble and ruins, snipers in bombed buildings, tanks in snowy streets, Winter 1942-43, dark and gritty atmosphere, dramatic war photography style",
    hints: [
      "This brutal battle lasted from 1942 to 1943 during World War II",
      "It was fought in a Soviet city along the Volga River",
      "It's considered the bloodiest battle in human history",
      "The Soviet victory here marked a turning point against Nazi Germany"
    ],
    difficulty: "medium",
    year: 1943,
    location: "Soviet Union (Russia)",
    description: "The bloodiest battle in human history"
  },
  {
    id: 6,
    name: "D-Day",
    acceptedAnswers: ["d-day", "d day", "normandy", "battle of normandy", "normandy landings", "operation overlord"],
    prompt: "D-Day Normandy landings June 6 1944, Allied soldiers storming Omaha Beach from landing craft, explosions and gunfire, soldiers wading through water under heavy fire, German bunkers on cliffs, dramatic World War 2 invasion scene, gray stormy sky, intense action, historical war painting",
    hints: [
      "This operation took place on June 6, 1944",
      "It was the largest seaborne invasion in history",
      "Allied forces landed on beaches in northern France",
      "Operation Overlord was its codename"
    ],
    difficulty: "easy",
    year: 1944,
    location: "Normandy, France",
    description: "The Allied invasion of Nazi-occupied France"
  },
  {
    id: 7,
    name: "Battle of Agincourt",
    acceptedAnswers: ["agincourt", "battle of agincourt", "azincourt"],
    prompt: "Medieval Battle of Agincourt 1415, English longbowmen releasing volley of arrows at French knights, muddy battlefield, King Henry V leading English army, French cavalry charge failing in deep mud, hundreds of arrows darkening sky, Hundred Years War, dramatic medieval battle painting",
    hints: [
      "This battle was fought in October 1415 during the Hundred Years' War",
      "It took place in northern France",
      "English longbowmen played a decisive role in the victory",
      "King Henry V of England led his outnumbered army to victory"
    ],
    difficulty: "hard",
    year: 1415,
    location: "France",
    description: "English longbowmen vs French knights"
  },
  {
    id: 8,
    name: "Battle of Trafalgar",
    acceptedAnswers: ["trafalgar", "battle of trafalgar"],
    prompt: "Naval Battle of Trafalgar 1805, British Royal Navy ships of the line engaging French and Spanish fleet, HMS Victory leading the charge, Admiral Nelson's flagship, massive wooden warships with billowing sails, cannon smoke across the sea, dramatic naval warfare painting, stormy Atlantic waters",
    hints: [
      "This naval battle occurred in October 1805",
      "It was fought off the coast of Spain near Gibraltar",
      "Britain's greatest naval hero died in this battle",
      "Admiral Horatio Nelson commanded the British fleet"
    ],
    difficulty: "hard",
    year: 1805,
    location: "Atlantic Ocean, off Spain",
    description: "Britain's greatest naval victory"
  },
  {
    id: 9,
    name: "Battle of the Somme",
    acceptedAnswers: ["somme", "battle of the somme", "the somme"],
    prompt: "World War 1 Battle of the Somme 1916, British soldiers going over the top from trenches into no man's land, barbed wire and shell craters, artillery bombardment, mud and devastation, gas masks and steel helmets, haunting WWI battlefield atmosphere, grim realistic war painting",
    hints: [
      "This battle was fought from July to November 1916",
      "It took place in northern France during World War I",
      "The first day saw nearly 60,000 British casualties",
      "Tanks were used in warfare for the first time in this battle"
    ],
    difficulty: "medium",
    year: 1916,
    location: "France",
    description: "One of the bloodiest battles of WWI"
  },
  {
    id: 10,
    name: "Battle of Marathon",
    acceptedAnswers: ["marathon", "battle of marathon"],
    prompt: "Ancient Greek Battle of Marathon 490 BCE, Athenian hoplites in bronze armor charging Persian army on coastal plain, Greek phalanx formation with overlapping shields, Persian archers and cavalry, dramatic ancient warfare, Mediterranean coastline, epic historical painting style",
    hints: [
      "This battle was fought in 490 BCE",
      "It took place on a plain near Athens, Greece",
      "A legendary run after this battle inspired a modern sporting event",
      "The Athenians defeated a larger Persian invasion force"
    ],
    difficulty: "medium",
    year: -490,
    location: "Greece",
    description: "Athens defeats the Persian invasion"
  },
  {
    id: 11,
    name: "Battle of Midway",
    acceptedAnswers: ["midway", "battle of midway"],
    prompt: "World War 2 Battle of Midway 1942, American dive bombers attacking Japanese aircraft carriers, explosions and fire on carrier decks, Pacific Ocean naval battle, planes in dogfights, anti-aircraft fire, dramatic WWII aerial and naval combat scene, blue Pacific waters",
    hints: [
      "This naval battle occurred in June 1942",
      "It was fought in the Pacific Ocean near a small atoll",
      "American codebreakers helped win this battle",
      "Japan lost four aircraft carriers in this decisive defeat"
    ],
    difficulty: "medium",
    year: 1942,
    location: "Pacific Ocean",
    description: "The turning point of the Pacific War"
  },
  {
    id: 12,
    name: "Battle of Austerlitz",
    acceptedAnswers: ["austerlitz", "battle of austerlitz", "battle of three emperors"],
    prompt: "Battle of Austerlitz 1805, Napoleon Bonaparte commanding French Grande Armée against Russian and Austrian forces, cavalry charge across frozen lakes, dramatic fog lifting to reveal French trap, imperial eagles and tricolor flags, Napoleonic warfare at its finest, epic historical battle painting",
    hints: [
      "This battle was fought in December 1805",
      "It's also known as the 'Battle of the Three Emperors'",
      "Napoleon considered this his greatest victory",
      "The battle took place in what is now the Czech Republic"
    ],
    difficulty: "hard",
    year: 1805,
    location: "Czech Republic (Moravia)",
    description: "Napoleon's greatest military victory"
  },
  {
    id: 13,
    name: "Battle of Kursk",
    acceptedAnswers: ["kursk", "battle of kursk"],
    prompt: "World War 2 Battle of Kursk 1943, largest tank battle in history, Soviet T-34 tanks clashing with German Tiger and Panther tanks, massive armored warfare across Russian steppe, explosions and burning vehicles, dramatic Eastern Front combat scene, summer fields turned to battlefield",
    hints: [
      "This battle was fought in July-August 1943",
      "It's considered the largest tank battle in history",
      "It took place on the Eastern Front in the Soviet Union",
      "The German offensive 'Operation Citadel' failed here"
    ],
    difficulty: "hard",
    year: 1943,
    location: "Soviet Union (Russia)",
    description: "The largest tank battle in history"
  },
  {
    id: 14,
    name: "Battle of Cannae",
    acceptedAnswers: ["cannae", "battle of cannae"],
    prompt: "Ancient Battle of Cannae 216 BCE, Hannibal's Carthaginian army executing double envelopment of Roman legions, African and Spanish infantry with Numidian cavalry surrounding Romans, tactical masterpiece in action, ancient warfare on Italian plains, dust and chaos of ancient battle",
    hints: [
      "This battle was fought in 216 BCE during the Second Punic War",
      "It took place in southeastern Italy",
      "It's studied as one of the greatest tactical victories ever",
      "Hannibal Barca led the Carthaginian forces to victory"
    ],
    difficulty: "hard",
    year: -216,
    location: "Italy",
    description: "Hannibal's tactical masterpiece"
  },
  {
    id: 15,
    name: "Battle of Verdun",
    acceptedAnswers: ["verdun", "battle of verdun"],
    prompt: "World War 1 Battle of Verdun 1916, French soldiers defending fortress against German assault, brutal trench warfare, artillery bombardment devastating landscape, Fort Douaumont in background, mud blood and steel, grim WWI Western Front atmosphere, 'They shall not pass' spirit",
    hints: [
      "This battle lasted most of 1916 during World War I",
      "It was fought around a fortified French city",
      "'Ils ne passeront pas!' (They shall not pass!) was the rallying cry",
      "It became a symbol of French determination and sacrifice"
    ],
    difficulty: "medium",
    year: 1916,
    location: "France",
    description: "France's symbol of WWI resistance"
  }
];

export const getRandomBattle = (excludeIds: number[] = []): Battle => {
  const availableBattles = battles.filter(b => !excludeIds.includes(b.id));
  if (availableBattles.length === 0) {
    return battles[Math.floor(Math.random() * battles.length)];
  }
  return availableBattles[Math.floor(Math.random() * availableBattles.length)];
};

export const getBattleById = (id: number): Battle | undefined => {
  return battles.find(b => b.id === id);
};
