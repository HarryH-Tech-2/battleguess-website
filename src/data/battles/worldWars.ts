import type { Battle } from '../../types';

export const worldWarsBattles: Battle[] = [
  {
    id: 5,
    name: "Battle of Stalingrad",
    civilization: 'world-wars',
    acceptedAnswers: ["stalingrad", "battle of stalingrad"],
    prompt: "World War 2 Battle of Stalingrad, brutal urban warfare in destroyed Soviet city, Soviet Red Army soldiers fighting German Wehrmacht in rubble and ruins, snipers in bombed buildings, tanks in snowy streets, Winter 1942-43, dark and gritty atmosphere, dramatic war photography style",
    hints: [
      "This brutal urban battle involved fighting building by building, room by room",
      "It was fought in a Soviet city along the Volga River",
      "It's considered the bloodiest battle in human history",
      "The Soviet victory here marked a turning point against Nazi Germany"
    ],
    difficulty: "medium",
    year: 1943,
    location: "Soviet Union (Russia)",
    description: "The five-month siege of Stalingrad resulted in nearly 2 million casualties, making it the deadliest battle in human history. Soviet defenders fought building by building, sometimes room by room, in brutal urban combat. The German 6th Army's surrender in February 1943 marked a decisive turning point on the Eastern Front and the beginning of Germany's long retreat."
  },
  {
    id: 6,
    name: "D-Day",
    civilization: 'world-wars',
    acceptedAnswers: ["d-day", "d day", "normandy", "battle of normandy", "normandy landings", "operation overlord"],
    prompt: "D-Day Normandy landings June 6 1944, Allied soldiers storming Omaha Beach from landing craft, explosions and gunfire, soldiers wading through water under heavy fire, German bunkers on cliffs, dramatic World War 2 invasion scene, gray stormy sky, intense action, historical war painting",
    hints: [
      "This was the largest seaborne invasion in history",
      "Allied forces landed on five beaches in northern France",
      "Omaha Beach saw the fiercest fighting during the landings",
      "Operation Overlord was its codename"
    ],
    difficulty: "easy",
    year: 1944,
    location: "Normandy, France",
    description: "On June 6, 1944, over 156,000 Allied troops landed on five beaches in Normandy in the largest amphibious invasion in history. Despite fierce German resistance, especially at Omaha Beach, the Allies established a foothold in Nazi-occupied Europe. D-Day opened the Western Front and began the liberation of France, leading to Germany's defeat less than a year later."
  },
  {
    id: 9,
    name: "Battle of the Somme",
    civilization: 'world-wars',
    acceptedAnswers: ["somme", "battle of the somme", "the somme"],
    prompt: "World War 1 Battle of the Somme 1916, British soldiers going over the top from trenches into no man's land, barbed wire and shell craters, artillery bombardment, mud and devastation, gas masks and steel helmets, haunting WWI battlefield atmosphere, grim realistic war painting",
    hints: [
      "The first day remains the bloodiest in British military history",
      "It took place in northern France during World War I",
      "The first day saw nearly 60,000 British casualties",
      "Tanks were used in warfare for the first time in this battle"
    ],
    difficulty: "medium",
    year: 1916,
    location: "France",
    description: "The first day of the Somme remains the bloodiest day in British military history, with nearly 60,000 casualties. Over 140 days, the Allies advanced just six miles at a cost of over one million casualties on both sides. The battle saw the first use of tanks in warfare and came to symbolize the horrific futility of trench warfare on the Western Front."
  },
  {
    id: 11,
    name: "Battle of Midway",
    civilization: 'world-wars',
    acceptedAnswers: ["midway", "battle of midway"],
    prompt: "World War 2 Battle of Midway 1942, American dive bombers attacking Japanese aircraft carriers, explosions and fire on carrier decks, Pacific Ocean naval battle, planes in dogfights, anti-aircraft fire, dramatic WWII aerial and naval combat scene, blue Pacific waters",
    hints: [
      "American codebreakers intercepted enemy plans before this battle",
      "It was fought in the Pacific Ocean near a small atoll",
      "It turned the tide of the Pacific War",
      "Japan lost four aircraft carriers in this decisive defeat"
    ],
    difficulty: "medium",
    year: 1942,
    location: "Pacific Ocean",
    description: "American codebreakers intercepted Japanese plans, allowing Admiral Nimitz to set a trap near Midway Atoll. In just five minutes, American dive bombers destroyed three Japanese carriers, with a fourth sunk later that day. Japan lost four fleet carriers, 248 aircraft, and hundreds of experienced pilots—losses that Japan could never replace. The battle shifted the Pacific War's momentum permanently to the Allies."
  },
  {
    id: 13,
    name: "Battle of Kursk",
    civilization: 'world-wars',
    acceptedAnswers: ["kursk", "battle of kursk"],
    prompt: "World War 2 Battle of Kursk 1943, largest tank battle in history, Soviet T-34 tanks clashing with German Tiger and Panther tanks, massive armored warfare across Russian steppe, explosions and burning vehicles, dramatic Eastern Front combat scene, summer fields turned to battlefield",
    hints: [
      "Over 6,000 tanks clashed in this massive engagement",
      "It's considered the largest tank battle in history",
      "It took place on the Eastern Front in the Soviet Union",
      "The German offensive 'Operation Citadel' failed here"
    ],
    difficulty: "hard",
    year: 1943,
    location: "Soviet Union (Russia)",
    description: "Over 6,000 tanks, 4,000 aircraft, and 2 million soldiers clashed in the largest armored battle ever fought. The Germans' Operation Citadel aimed to eliminate a Soviet bulge in the front lines but failed against prepared Soviet defenses in depth. After Kursk, Germany lost the strategic initiative in the East and would never launch another major offensive on the Eastern Front."
  },
  {
    id: 15,
    name: "Battle of Verdun",
    civilization: 'world-wars',
    acceptedAnswers: ["verdun", "battle of verdun"],
    prompt: "World War 1 Battle of Verdun 1916, French soldiers defending fortress against German assault, brutal trench warfare, artillery bombardment devastating landscape, Fort Douaumont in background, mud blood and steel, grim WWI Western Front atmosphere, 'They shall not pass' spirit",
    hints: [
      "Germany aimed to 'bleed France white' at this fortified city",
      "It was fought around a fortified French city during World War I",
      "'Ils ne passeront pas!' (They shall not pass!) was the rallying cry",
      "It became a symbol of French determination and sacrifice"
    ],
    difficulty: "medium",
    year: 1916,
    location: "France",
    description: "Germany intended to 'bleed France white' at Verdun, but the ten-month battle bled both armies equally with over 700,000 combined casualties. French General Pétain's rallying cry 'Ils ne passeront pas!' (They shall not pass!) became a national symbol of French determination. The battle produced the most concentrated devastation of World War I, turning verdant hills into a moonscape of craters."
  },
  {
    id: 24,
    name: "Battle of the Bulge",
    civilization: 'world-wars',
    acceptedAnswers: ["bulge", "battle of the bulge", "ardennes", "ardennes offensive"],
    prompt: "World War 2 Battle of the Bulge 1944, American soldiers fighting in snowy Ardennes forest, German Tiger tanks advancing through winter landscape, GIs in foxholes defending frozen positions, paratroopers at Bastogne, blizzard conditions, dramatic WWII winter warfare scene",
    hints: [
      "This was Germany's last major offensive on the Western Front",
      "It was fought in the Ardennes forest region of Belgium and Luxembourg",
      "It created a dangerous salient in the Allied front lines",
      "The besieged 101st Airborne at Bastogne replied 'NUTS!' to a German surrender demand"
    ],
    difficulty: "medium",
    year: 1944,
    location: "Belgium & Luxembourg",
    description: "Hitler's last desperate gamble threw 250,000 German troops against thinly held American lines in the Ardennes, creating a dangerous 'bulge' in the Allied front. Despite initial surprise and harsh winter conditions, American forces held key positions, most famously at Bastogne. The failed offensive exhausted Germany's last reserves and hastened the end of the war in Europe."
  },
  {
    id: 25,
    name: "Battle of Iwo Jima",
    civilization: 'world-wars',
    acceptedAnswers: ["iwo jima", "battle of iwo jima", "iwo"],
    prompt: "World War 2 Battle of Iwo Jima 1945, US Marines storming volcanic black sand beaches, fighting through Japanese bunkers and tunnels, Mount Suribachi in background, Marines raising flag on summit, intense Pacific island warfare, explosions and gunfire, dramatic WWII Pacific theater scene",
    hints: [
      "An iconic photograph of a flag-raising was taken during this battle",
      "It took place on a small volcanic island in the Pacific Ocean",
      "The defenders fought from an extensive network of tunnels and bunkers",
      "US Marines stormed black volcanic sand beaches to capture this island"
    ],
    difficulty: "medium",
    year: 1945,
    location: "Iwo Jima, Japan",
    description: "Over 70,000 US Marines fought to capture the heavily fortified volcanic island of Iwo Jima from 21,000 entrenched Japanese defenders. The battle produced some of the fiercest fighting in the Pacific War, with nearly 7,000 Marines killed and virtually the entire Japanese garrison wiped out. The iconic photograph of Marines raising the flag on Mount Suribachi became one of the most famous images of World War II."
  },
  {
    id: 184,
    name: "Battle of Tannenberg",
    civilization: 'world-wars',
    acceptedAnswers: ["tannenberg", "battle of tannenberg"],
    prompt: "World War 1 Battle of Tannenberg 1914, German army encircling Russian forces in East Prussia, massive columns of Russian prisoners marching through forests and lakes, German artillery bombarding trapped Russian troops, Eastern Front early WWI, dramatic landscape of lakes and dense woodland, grim war painting style",
    hints: [
      "This early war battle resulted in an entire army being surrounded and destroyed",
      "It was fought in the lake and forest region of East Prussia",
      "Nearly 100,000 soldiers were captured in this devastating encirclement",
      "German generals Hindenburg and Ludendorff annihilated Russia's Second Army here"
    ],
    difficulty: "hard",
    year: 1914,
    location: "East Prussia (Poland)",
    description: "In one of the most decisive battles of World War I, German generals Hindenburg and Ludendorff exploited poor Russian coordination to encircle and destroy the Russian Second Army. Nearly 92,000 Russian soldiers were captured and 78,000 killed or wounded, while German losses were minimal. The defeated Russian commander, General Samsonov, shot himself in the aftermath. Tannenberg secured East Prussia and made Hindenburg a national hero."
  },
  {
    id: 185,
    name: "Battle of the Marne",
    civilization: 'world-wars',
    acceptedAnswers: ["marne", "battle of the marne", "first battle of the marne", "the marne"],
    prompt: "World War 1 First Battle of the Marne 1914, French and British soldiers counterattacking German advance near Paris, French infantry in blue uniforms charging across open fields, Parisian taxis rushing reinforcements to the front, artillery fire and chaos, early WWI Western Front, dramatic war painting",
    hints: [
      "Taxicabs from a nearby capital city famously rushed reinforcements to this battle",
      "It halted an invasion that threatened to capture a major European capital",
      "This battle ended the war of movement and led to years of trench warfare",
      "The French and British counterattack stopped the German advance on Paris"
    ],
    difficulty: "medium",
    year: 1914,
    location: "France",
    description: "The German Schlieffen Plan nearly succeeded as armies swept through Belgium and into France, reaching within 30 miles of Paris. In a desperate counterattack, French commander Joffre struck the exposed German flank along the Marne River, famously requisitioning Parisian taxicabs to rush reinforcements to the front. The Allied victory saved Paris and ended Germany's hope for a quick victory, condemning both sides to four years of trench warfare."
  },
  {
    id: 186,
    name: "Battle of Jutland",
    civilization: 'world-wars',
    acceptedAnswers: ["jutland", "battle of jutland", "skagerrak", "battle of skagerrak"],
    prompt: "World War 1 Battle of Jutland 1916, massive naval battle in the North Sea, British Royal Navy dreadnoughts exchanging fire with German High Seas Fleet, huge warships firing broadsides, explosions and smoke on the water, dramatic WWI naval warfare scene, stormy gray seas, battlecruisers and battleships in formation",
    hints: [
      "This was the largest naval battle of World War I involving hundreds of warships",
      "It was fought in the waters off the coast of Denmark",
      "Both sides claimed victory though the strategic situation remained unchanged",
      "The British Grand Fleet clashed with the German High Seas Fleet in the North Sea"
    ],
    difficulty: "hard",
    year: 1916,
    location: "North Sea",
    description: "The largest naval battle of World War I saw 250 warships clash in the North Sea off the coast of Denmark. The British Royal Navy lost more ships and sailors than the German High Seas Fleet, yet the strategic outcome favored Britain: the German fleet never again seriously challenged British naval supremacy. Germany's High Seas Fleet remained bottled up in port for the rest of the war, ensuring Allied control of the seas."
  },
  {
    id: 187,
    name: "Battle of Passchendaele",
    civilization: 'world-wars',
    acceptedAnswers: ["passchendaele", "battle of passchendaele", "third ypres", "third battle of ypres"],
    prompt: "World War 1 Battle of Passchendaele 1917, British and Canadian soldiers struggling through knee-deep mud in Flanders, waterlogged shell craters and destroyed landscape, soldiers sinking in mud, endless rain and artillery bombardment, bleak devastated Belgian countryside, haunting WWI trench warfare scene",
    hints: [
      "This battle became synonymous with the horrors of mud and futile slaughter in WWI",
      "It was fought in the Flanders region of Belgium during World War I",
      "Soldiers literally drowned in mud-filled shell craters during the fighting",
      "Canadian forces finally captured the ruined village that gave this battle its name"
    ],
    difficulty: "hard",
    year: 1917,
    location: "Belgium",
    description: "The Third Battle of Ypres, known as Passchendaele, became the defining symbol of the senseless horror of World War I. Torrential rain turned the Flanders battlefield into a quagmire where men and horses drowned in mud-filled shell craters. After three months and over 500,000 combined casualties, Canadian forces captured the ruins of Passchendaele village—an advance of just five miles that was lost within months."
  },
  {
    id: 188,
    name: "Battle of Caporetto",
    civilization: 'world-wars',
    acceptedAnswers: ["caporetto", "battle of caporetto", "kobarid", "twelfth battle of the isonzo"],
    prompt: "World War 1 Battle of Caporetto 1917, Austro-Hungarian and German stormtroopers breaking through Italian lines in the Julian Alps, Italian army in chaotic retreat through mountain valleys, poison gas and artillery in mountainous terrain, soldiers fleeing through Alpine passes, dramatic WWI mountain warfare scene",
    hints: [
      "This battle resulted in one of the most catastrophic military routs of World War I",
      "It was fought in the mountainous border region between Italy and Austria-Hungary",
      "The defeated army lost over 300,000 soldiers as prisoners in the collapse",
      "A combined Austro-Hungarian and German assault shattered the Italian front line"
    ],
    difficulty: "hard",
    year: 1917,
    location: "Italy",
    description: "A surprise Austro-Hungarian and German assault using innovative infiltration tactics shattered the Italian Second Army, triggering a catastrophic rout. The Italian front collapsed as troops fled westward in panic, losing over 300,000 prisoners and nearly 700,000 total casualties. The Italians retreated nearly 100 miles to the Piave River before stabilizing their lines. The disaster was so complete that 'Caporetto' became an Italian byword for catastrophic defeat."
  },
  {
    id: 189,
    name: "Battle of El Alamein",
    civilization: 'world-wars',
    acceptedAnswers: ["el alamein", "battle of el alamein", "alamein", "second battle of el alamein"],
    prompt: "World War 2 Battle of El Alamein 1942, British Eighth Army attacking German Afrika Korps positions in North African desert, tanks advancing through minefields under artillery fire, Montgomery vs Rommel, desert warfare with sand dunes and explosions, dramatic WWII North Africa campaign scene",
    hints: [
      "Churchill said 'Before this battle we never had a victory, after it we never had a defeat'",
      "It was fought in the deserts of North Africa near the Egyptian coast",
      "A famous 'Desert Fox' was defeated at this battle",
      "Montgomery's British Eighth Army defeated Rommel's Afrika Korps here"
    ],
    difficulty: "medium",
    year: 1942,
    location: "Egypt",
    description: "Field Marshal Montgomery's British Eighth Army launched a massive offensive against Rommel's Afrika Korps at El Alamein, breaking through Axis lines after twelve days of intense fighting. The victory ended the Axis threat to Egypt and the Suez Canal, and began the long Allied advance across North Africa. Churchill famously declared it a turning point, saying 'Before Alamein we never had a victory. After Alamein we never had a defeat.'"
  },
  {
    id: 190,
    name: "Battle of Guadalcanal",
    civilization: 'world-wars',
    acceptedAnswers: ["guadalcanal", "battle of guadalcanal", "guadalcanal campaign"],
    prompt: "World War 2 Battle of Guadalcanal 1942-43, US Marines fighting Japanese soldiers in dense tropical jungle, Henderson Field airstrip under attack, naval battles off the coast, Marines in jungle combat with palm trees and dense vegetation, Pacific island warfare, dramatic WWII Pacific theater jungle battle scene",
    hints: [
      "This was the first major Allied ground offensive in the Pacific Theater",
      "It was fought on a tropical island in the Solomon Islands chain",
      "Control of a critical airfield was the key objective throughout the campaign",
      "US Marines fought for six months to secure this jungle-covered Pacific island"
    ],
    difficulty: "medium",
    year: 1942,
    location: "Solomon Islands",
    description: "The six-month campaign for Guadalcanal was the first major Allied offensive in the Pacific, fought in brutal jungle conditions. US Marines seized the critical Henderson Field airstrip, then defended it against relentless Japanese counterattacks by land, sea, and air. The campaign cost Japan irreplaceable ships, aircraft, and veteran troops, and proved that Allied forces could take and hold ground against determined Japanese defenders."
  },
  {
    id: 191,
    name: "Battle of Okinawa",
    civilization: 'world-wars',
    acceptedAnswers: ["okinawa", "battle of okinawa"],
    prompt: "World War 2 Battle of Okinawa 1945, US Marines and Army soldiers fighting through fortified Japanese positions on rocky hillsides, kamikaze planes attacking US Navy ships offshore, fierce combat in caves and bunkers, civilians caught in crossfire, dramatic WWII Pacific island battle, final major battle of the war",
    hints: [
      "This was the largest amphibious assault in the Pacific Theater",
      "It was fought on a large island just south of the Japanese mainland",
      "Thousands of suicide planes attacked the invasion fleet during this battle",
      "It was the last major battle of World War II and influenced the decision to use atomic bombs"
    ],
    difficulty: "medium",
    year: 1945,
    location: "Okinawa, Japan",
    description: "The bloodiest battle of the Pacific War saw over 180,000 American troops invade Okinawa, just 340 miles from mainland Japan. Japanese defenders fought from elaborate cave and tunnel networks, while nearly 2,000 kamikaze attacks sank or damaged hundreds of Allied ships. The staggering casualties on both sides—over 12,000 Americans killed, 100,000 Japanese soldiers dead, and an estimated 100,000 Okinawan civilians lost—heavily influenced the decision to use atomic bombs rather than invade the Japanese mainland."
  },
  {
    id: 192,
    name: "Battle of Berlin",
    civilization: 'world-wars',
    acceptedAnswers: ["berlin", "battle of berlin", "fall of berlin"],
    prompt: "World War 2 Battle of Berlin 1945, Soviet Red Army soldiers storming through the ruined streets of Berlin, Soviet tanks rolling past destroyed buildings, red Soviet flag being raised over the Reichstag, fierce urban combat in the German capital, fires and smoke, dramatic end of WWII in Europe scene",
    hints: [
      "This was the final major battle of the European theater of World War II",
      "It was fought in the capital city of Nazi Germany",
      "Over 2.5 million Soviet soldiers participated in this massive assault",
      "A famous photograph shows a red flag being raised over the Reichstag building"
    ],
    difficulty: "medium",
    year: 1945,
    location: "Germany",
    description: "The final battle of the European war saw 2.5 million Soviet soldiers close in on the German capital in a massive pincer movement. Desperate German defenders, including old men and boys of the Volkssturm, fought block by block as the city was reduced to rubble. Hitler committed suicide in his bunker on April 30 as Soviet soldiers raised the red flag over the Reichstag. Germany surrendered unconditionally eight days later, ending the war in Europe."
  },
  {
    id: 193,
    name: "Battle of the Coral Sea",
    civilization: 'world-wars',
    acceptedAnswers: ["coral sea", "battle of the coral sea", "battle of coral sea"],
    prompt: "World War 2 Battle of the Coral Sea 1942, American and Japanese aircraft carriers launching planes against each other, torpedo bombers and dive bombers attacking enemy carriers, explosions on carrier decks, Pacific Ocean naval aviation battle, planes in flight over tropical blue waters, dramatic WWII carrier battle scene",
    hints: [
      "This was the first naval battle in history where the opposing ships never saw each other",
      "It was fought in the waters near Australia and New Guinea",
      "Aircraft carriers and their planes were the sole offensive weapons used",
      "It checked Japan's advance toward Australia and Port Moresby"
    ],
    difficulty: "hard",
    year: 1942,
    location: "Pacific Ocean",
    description: "The Battle of the Coral Sea was a milestone in naval warfare: the first battle in which opposing fleets fought entirely with carrier-based aircraft, never coming within sight of each other. Though the US lost the carrier Lexington, the battle turned back a Japanese invasion force aimed at Port Moresby, New Guinea, protecting the sea lanes to Australia. The tactical draw was a strategic Allied victory, marking the first time a Japanese naval advance had been checked."
  },
  {
    id: 194,
    name: "Siege of Tobruk",
    civilization: 'world-wars',
    acceptedAnswers: ["tobruk", "siege of tobruk", "battle of tobruk"],
    prompt: "World War 2 Siege of Tobruk 1941, Australian and British soldiers defending the besieged Libyan port against Rommel's Afrika Korps, desert fortifications and bunkers, tanks and artillery in arid North African landscape, soldiers enduring harsh desert conditions, dramatic WWII North Africa siege scene",
    hints: [
      "This siege lasted 241 days in the harsh conditions of the North African desert",
      "It was fought at a key Libyan port city on the Mediterranean coast",
      "The defenders were nicknamed 'Rats' by enemy propaganda and wore the name with pride",
      "Australian and British forces held this Libyan port against Rommel's Afrika Korps"
    ],
    difficulty: "hard",
    year: 1941,
    location: "Libya",
    description: "For 241 days, a garrison of predominantly Australian troops held the Libyan port of Tobruk against Rommel's Afrika Korps, denying the Germans a key supply port and disrupting their advance into Egypt. German propaganda derisively called the defenders 'Rats of Tobruk,' a name the Australians adopted with fierce pride. The successful defense was one of the first times Axis forces had been stopped and held in the war, boosting Allied morale during a dark period."
  },
  {
    id: 195,
    name: "Battle of Monte Cassino",
    civilization: 'world-wars',
    acceptedAnswers: ["monte cassino", "battle of monte cassino", "cassino"],
    prompt: "World War 2 Battle of Monte Cassino 1944, Allied soldiers fighting uphill toward the ancient monastery atop Monte Cassino, bombed ruins of the Benedictine abbey, fierce mountain combat on rocky Italian terrain, Polish and Allied troops assaulting German Gustav Line fortifications, dramatic WWII Italian campaign battle scene",
    hints: [
      "A famous ancient monastery was controversially destroyed by Allied bombing during this battle",
      "It was fought on a mountaintop in central Italy blocking the road to Rome",
      "Four separate assaults over five months were needed to capture this position",
      "Polish troops finally raised their flag over the ruins of the Benedictine abbey"
    ],
    difficulty: "hard",
    year: 1944,
    location: "Italy",
    description: "Four bloody assaults over five months were required to break through the German Gustav Line at Monte Cassino, which blocked the Allied advance on Rome. The Allies controversially bombed the historic sixth-century Benedictine monastery, which the Germans then used as a fortified position. Troops from Poland, Britain, India, New Zealand, France, and the United States all fought and suffered heavy casualties before Polish soldiers of the II Corps finally captured the ruins in May 1944, opening the road to Rome."
  },
  {
    id: 196,
    name: "Battle of Leyte Gulf",
    civilization: 'world-wars',
    acceptedAnswers: ["leyte gulf", "battle of leyte gulf", "leyte"],
    prompt: "World War 2 Battle of Leyte Gulf 1944, massive naval engagement in the Philippines, American battleships and carriers clashing with Japanese fleet, kamikaze planes attacking US ships, destroyers making torpedo runs against battleships, explosions across the ocean, dramatic WWII largest naval battle scene",
    hints: [
      "This is considered the largest naval battle in history by number of ships involved",
      "It was fought in the waters surrounding the Philippine Islands",
      "Kamikaze suicide attacks were used for the first time during this battle",
      "The American victory here effectively destroyed the Imperial Japanese Navy"
    ],
    difficulty: "hard",
    year: 1944,
    location: "Philippines",
    description: "The largest naval battle in history by tonnage involved nearly 300 ships across four separate engagements around the Philippine Islands. Japan committed virtually its entire remaining fleet in a desperate gamble to destroy the American invasion force, deploying kamikaze attacks for the first time. The American victory was decisive: Japan lost four carriers, three battleships, and numerous other warships, effectively ending the Imperial Japanese Navy as a fighting force."
  },
  {
    id: 197,
    name: "Battle of Britain",
    civilization: 'world-wars',
    acceptedAnswers: ["britain", "battle of britain", "the blitz"],
    prompt: "World War 2 Battle of Britain 1940, RAF Spitfires and Hurricanes dogfighting German Luftwaffe Messerschmitts and bombers over the English Channel and London, aerial combat with contrails in blue sky, bombs falling on London during the Blitz, dramatic WWII aerial warfare scene, iconic British defiance",
    hints: [
      "This was the first major military campaign fought entirely by air forces",
      "It was fought in the skies over an island nation in the summer and autumn of 1940",
      "'Never in the field of human conflict was so much owed by so many to so few'",
      "The RAF defended Britain against the Luftwaffe's attempt to gain air superiority"
    ],
    difficulty: "easy",
    year: 1940,
    location: "United Kingdom",
    description: "The first major campaign fought entirely in the air saw the Royal Air Force defend Britain against the German Luftwaffe's attempt to gain air superiority as a precursor to invasion. Despite being heavily outnumbered, RAF Fighter Command's Spitfires and Hurricanes, aided by radar and brilliant tactics, inflicted unsustainable losses on the Luftwaffe. Churchill immortalized the RAF pilots with his famous tribute. Hitler indefinitely postponed Operation Sea Lion, his planned invasion of Britain."
  },
  {
    id: 198,
    name: "Siege of Leningrad",
    civilization: 'world-wars',
    acceptedAnswers: ["leningrad", "siege of leningrad", "leningrad siege", "blockade of leningrad"],
    prompt: "World War 2 Siege of Leningrad 1941-1944, starving Soviet civilians and soldiers enduring the brutal 900-day siege, frozen city streets with bodies and snow, desperate supply convoys crossing frozen Lake Ladoga, anti-aircraft guns defending the city, dark and haunting WWII siege scene, suffering and resilience",
    hints: [
      "This was the longest and most destructive siege in modern history, lasting nearly 900 days",
      "Supplies had to be transported across a frozen lake during winter to keep the city alive",
      "Over one million civilians perished, mostly from starvation and cold",
      "German forces besieged this major Soviet city, formerly the imperial capital of Russia"
    ],
    difficulty: "medium",
    year: 1941,
    location: "Soviet Union (Russia)",
    description: "The 872-day German siege of Leningrad was one of the most devastating episodes of World War II. Cut off from supplies, the city's population endured unimaginable suffering: over one million civilians died from starvation, disease, and bombardment. The only supply route was the 'Road of Life' across frozen Lake Ladoga in winter. Despite the horrors, the city never surrendered, and its resistance became a powerful symbol of Soviet determination and sacrifice."
  },
  {
    id: 199,
    name: "Battle of Dunkirk",
    civilization: 'world-wars',
    acceptedAnswers: ["dunkirk", "battle of dunkirk", "dunkerque", "operation dynamo"],
    prompt: "World War 2 Battle of Dunkirk 1940, massive evacuation of Allied soldiers from French beaches, hundreds of small civilian boats crossing the English Channel alongside Royal Navy ships, soldiers wading out to boats under Luftwaffe air attack, long lines of troops on the beach, smoke and fire from burning oil, dramatic WWII rescue scene",
    hints: [
      "A flotilla of civilian boats played a crucial role in this famous military operation",
      "It was an evacuation from the beaches and harbor of a French coastal city",
      "Over 330,000 Allied soldiers were rescued from encirclement in this operation",
      "Operation Dynamo saved the British Expeditionary Force from destruction after the fall of France"
    ],
    difficulty: "medium",
    year: 1940,
    location: "France",
    description: "With the British Expeditionary Force and French troops trapped against the sea by the rapid German advance, Operation Dynamo launched a desperate evacuation from the beaches and harbor of Dunkirk. A remarkable armada of over 800 vessels—including hundreds of civilian fishing boats, pleasure craft, and yachts—crossed the English Channel to rescue 338,226 Allied soldiers. Though a military defeat, the 'Miracle of Dunkirk' preserved the core of the British Army to fight another day and became a defining moment of British resilience."
  },
  {
    id: 200,
    name: "Battle of Arnhem",
    civilization: 'world-wars',
    acceptedAnswers: ["arnhem", "battle of arnhem", "market garden", "operation market garden"],
    prompt: "World War 2 Battle of Arnhem 1944, British paratroopers fighting to hold the bridge at Arnhem against German Panzer divisions, airborne troops landing by parachute and glider in Dutch countryside, fierce urban combat around the bridge, outnumbered British soldiers defending positions, dramatic WWII Operation Market Garden scene",
    hints: [
      "This battle was part of an ambitious airborne operation intended to end the war by Christmas 1944",
      "Paratroopers were tasked with capturing a series of bridges in the occupied Netherlands",
      "The plan was described as 'a bridge too far' after its failure",
      "British paratroopers held one end of a bridge for four days before being overwhelmed by German armor"
    ],
    difficulty: "hard",
    year: 1944,
    location: "Netherlands",
    description: "Operation Market Garden, the largest airborne operation in history, aimed to capture key bridges across the Netherlands and outflank Germany's Siegfried Line. British 1st Airborne Division landed near the bridge at Arnhem but found themselves facing two SS Panzer divisions unexpectedly stationed nearby. Colonel Frost's paratroopers held the north end of the Arnhem bridge for four days against overwhelming odds before being overrun. Only 2,163 of 10,000 British airborne troops escaped, and the operation's failure dashed Allied hopes for ending the war in 1944."
  }
];
