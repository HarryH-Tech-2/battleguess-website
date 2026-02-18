export interface Campaign {
  id: string;
  name: string;
  description: string;
  icon: string;
  battleIds: number[];
  narratives: {
    intro: string;
    between: string[];
    outro: string;
  };
}

export const campaigns: Campaign[] = [
  {
    id: 'rise-of-rome',
    name: 'Rise of Rome',
    description: 'From the hills of Greece to the gates of Gaul, trace the rise of the greatest empire.',
    icon: '🏛️',
    battleIds: [10, 2, 27, 14, 60, 28, 59, 66],
    narratives: {
      intro: 'The Mediterranean world trembles as great powers clash for supremacy. From the plains of Marathon to the forests of Gaul, warriors will forge the destiny of an empire that will shape civilization for millennia.',
      between: [
        'The Greeks have proven their valor, but a new power rises in the west. Rome watches, learns, and prepares...',
        'The seas run red with the blood of heroes. Salamis has shown that naval power can decide the fate of nations.',
        'Hannibal stands at the gates. Rome faces its greatest trial — will the Republic survive the Carthaginian storm?',
        'The legions have tasted defeat at Trasimene. Desperate times call for desperate measures.',
        'Caesar marches into Gaul. The legions that conquered the Mediterranean now turn north.',
        'Civil war tears the Republic apart. At Pharsalus, Roman faces Roman.',
        'Constantine sees a vision. At the Milvian Bridge, the course of empire — and faith — will change forever.',
      ],
      outro: 'From a small city-state to the master of the known world, Rome\'s military genius shaped Western civilization. But even the greatest empires must eventually fall...',
    },
  },
  {
    id: 'napoleons-gambit',
    name: "Napoleon's Gambit",
    description: 'Follow the Little Corporal from his greatest triumphs to his final defeat.',
    icon: '🎖️',
    battleIds: [150, 151, 12, 143, 162, 144, 26, 145, 1],
    narratives: {
      intro: 'A young Corsican artillery officer rises through the chaos of revolution. His name will echo through history — Napoleon Bonaparte. Follow his meteoric rise and devastating fall across the battlefields of Europe.',
      between: [
        'The Nile campaign has ended in naval disaster, but Napoleon\'s star is only beginning to rise.',
        'Victory at Marengo cements Napoleon\'s power. All of Europe watches with growing unease.',
        'The Sun of Austerlitz! Napoleon\'s masterpiece shatters the Third Coalition.',
        'Prussia falls in a single day. The old order of Europe crumbles before the French war machine.',
        'At Friedland, Russia learns the price of opposing the Emperor.',
        'Wagram — another costly victory. But the Grande Armée remains supreme... for now.',
        'The snows of Russia have consumed the Grande Armée. At Leipzig, all of Europe unites against the Emperor.',
        'Exiled to Elba, Napoleon escapes for one final gamble. The Hundred Days have begun.',
      ],
      outro: 'Waterloo. The word alone tells the story. Napoleon\'s ambition reshaped the map of Europe, but in the end, even the greatest military mind of his age could not defeat the world united against him.',
    },
  },
  {
    id: 'european-theater',
    name: 'The European Theater',
    description: 'From the beaches of Dunkirk to the ruins of Berlin — the war that defined the 20th century.',
    icon: '⭐',
    battleIds: [199, 197, 189, 195, 13, 6, 200, 24, 192],
    narratives: {
      intro: 'September 1939. The world plunges into the deadliest conflict in human history. Across the fields, cities, and beaches of Europe, millions will fight to determine the fate of civilization itself.',
      between: [
        'Dunkirk — a miracle of evacuation. The British Army lives to fight another day, but the continent has fallen.',
        'The skies over Britain become the last line of defense. The Few stand between freedom and darkness.',
        'In the deserts of North Africa, the tide begins to turn. Montgomery faces Rommel in a duel of titans.',
        'The road to Rome passes through Monte Cassino. The ancient monastery becomes a modern fortress.',
        'The greatest tank battle in history erupts at Kursk. The Wehrmacht\'s last offensive in the East shatters against Soviet steel.',
        'D-Day. The largest amphibious invasion in history. The liberation of Europe has begun.',
        'Arnhem — a bridge too far. Even in victory, the Allies suffer painful setbacks.',
        'The Ardennes, December 1944. Hitler\'s final gamble catches the Allies off guard.',
      ],
      outro: 'Berlin falls. The nightmare of fascism ends in the rubble of the Reich Chancellery. The cost: tens of millions dead, a continent in ruins, and a world forever changed.',
    },
  },
  {
    id: 'pacific-storm',
    name: 'Pacific Storm',
    description: 'Island by island, from Midway to Okinawa — the brutal Pacific campaign.',
    icon: '🌊',
    battleIds: [193, 11, 190, 196, 25, 191],
    narratives: {
      intro: 'After the shock of Pearl Harbor, the United States mobilizes for war across the vast Pacific Ocean. Island-hopping through some of the most brutal combat in history, American forces will fight to push back the Japanese Empire.',
      between: [
        'The Coral Sea — the first naval battle where the opposing ships never saw each other. A new era of warfare dawns.',
        'Midway changes everything. In five minutes, three Japanese carriers burn. The tide of the Pacific War turns.',
        'Guadalcanal — six months of desperate jungle fighting. The first major Allied offensive in the Pacific.',
        'Leyte Gulf — the largest naval battle in history. The Imperial Japanese Navy fights its last great engagement.',
        'Iwo Jima. Thirty-six days of carnage for eight square miles of volcanic rock. The flag on Suribachi becomes an eternal symbol.',
      ],
      outro: 'Okinawa foreshadows the terrible cost of invading Japan itself. But the atomic age dawns, and the Pacific War ends not with an invasion, but with a blinding flash over Hiroshima.',
    },
  },
  {
    id: 'crusader-kings',
    name: 'Crusader Kings',
    description: 'The clash of faiths and crowns across the medieval world.',
    icon: '⚔️',
    battleIds: [79, 78, 82, 90, 83, 84, 87, 75],
    narratives: {
      intro: 'The call goes out across Christendom — reclaim the Holy Land! For two centuries, knights, kings, and sultans will clash in a struggle that reshapes the medieval world.',
      between: [
        'Manzikert shatters Byzantine power in Anatolia. The Eastern Emperor begs the West for aid...',
        'The Horns of Hattin. Saladin destroys the Crusader army and reclaims Jerusalem.',
        'Acre falls after a grueling siege. Richard the Lionheart and Saladin face off in the Holy Land.',
        'At Arsuf, Richard proves the Crusaders can still fight. But can they hold what they win?',
        'The Albigensian Crusade turns the sword of faith inward. At Muret, heresy meets steel.',
        'Las Navas de Tolosa — the Reconquista reaches its turning point in Iberia.',
        'The Crusade of Nicopolis ends in disaster. Ottoman power grows unchecked.',
      ],
      outro: 'Constantinople itself falls to the Ottoman cannons. The age of Crusades is over, but its legacy of conflict, exchange, and transformation echoes through the centuries.',
    },
  },
];
