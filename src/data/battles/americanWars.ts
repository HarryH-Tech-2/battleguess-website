import type { Battle } from '../../types';

export const americanWarsBattles: Battle[] = [
  {
    id: 3,
    name: "Battle of Gettysburg",
    civilization: 'american-wars',
    acceptedAnswers: ["gettysburg", "battle of gettysburg", "getysburg"],
    prompt: "American Civil War Battle of Gettysburg 1863, Union and Confederate soldiers in fierce combat, Pickett's Charge across open fields, cannons firing, smoke-filled battlefield, blue and gray uniforms, dramatic Pennsylvania landscape with rolling hills, historical war painting style, intense action",
    hints: [
      "This was the bloodiest battle of the American Civil War",
      "It took place in Pennsylvania, a Northern state",
      "It's considered the turning point of the American Civil War",
      "President Lincoln later gave a famous speech honoring the fallen here"
    ],
    difficulty: "medium",
    year: 1863,
    location: "Pennsylvania, USA",
    description: "Fought over three days in July 1863, Gettysburg was the bloodiest battle of the American Civil War with over 50,000 casualties. The failed Confederate assault known as Pickett's Charge marked the 'high water mark' of the Confederacy. President Lincoln's Gettysburg Address, delivered at the battlefield's dedication, became one of the most famous speeches in American history."
  },
  {
    id: 16,
    name: "Battle of Saratoga",
    civilization: 'american-wars',
    acceptedAnswers: ["saratoga", "battle of saratoga", "battles of saratoga"],
    prompt: "American Revolution Battle of Saratoga 1777, Continental Army soldiers in blue coats fighting British redcoats in autumn forest, General Benedict Arnold leading charge on horseback, musket fire and cannon smoke, New York wilderness with fall foliage, dramatic Revolutionary War painting",
    hints: [
      "This victory convinced France to ally with the American cause",
      "It took place in upstate New York during the American Revolution",
      "It's considered the turning point of the American Revolution",
      "British General Burgoyne surrendered his entire army"
    ],
    difficulty: "hard",
    year: 1777,
    location: "New York, USA",
    description: "The American victory at Saratoga was the turning point of the American Revolution. British General Burgoyne's army of 6,000 was surrounded and forced to surrender after two engagements. The victory convinced France to enter the war as an American ally, providing the military and financial support that would ultimately secure American independence."
  },
  {
    id: 22,
    name: "Battle of Yorktown",
    civilization: 'american-wars',
    acceptedAnswers: ["yorktown", "battle of yorktown", "siege of yorktown"],
    prompt: "Siege of Yorktown 1781, American Continental Army and French forces besieging British fortifications, George Washington commanding combined forces, French navy blocking Chesapeake Bay, cannon bombardment of British positions, American Revolution final battle, dramatic historical painting",
    hints: [
      "The French navy blocked any escape by sea during this siege",
      "It was fought in Virginia, USA",
      "French forces played a crucial role both on land and at sea",
      "The British surrender here effectively ended the American Revolution"
    ],
    difficulty: "medium",
    year: 1781,
    location: "Virginia, USA",
    description: "George Washington's Continental Army and French forces under Rochambeau besieged British General Cornwallis at Yorktown while the French navy blocked any escape by sea. After weeks of bombardment, Cornwallis surrendered his army of over 7,000 men. The defeat shattered British will to continue the war, leading to peace negotiations and American independence."
  },
  {
    id: 29,
    name: "Battle of Bunker Hill",
    civilization: 'american-wars',
    acceptedAnswers: ["bunker hill", "battle of bunker hill", "breeds hill", "battle of breeds hill"],
    prompt: "Battle of Bunker Hill 1775, American colonial militia behind earthwork fortifications on hilltop, British redcoats marching uphill in formation, musket volleys and cannon fire, Charlestown burning in background, Boston Harbor with British ships, early American Revolution battle painting",
    hints: [
      "The famous order was 'Don't fire until you see the whites of their eyes!'",
      "It took place on a hill overlooking Boston, Massachusetts",
      "Colonial militia proved they could stand against professional soldiers",
      "The British won the hill but suffered devastating casualties"
    ],
    difficulty: "medium",
    year: 1775,
    location: "Massachusetts, USA",
    description: "Colonial militia fortified Breed's Hill (near Bunker Hill) overlooking British-held Boston, forcing a direct assault. The defenders repulsed two British charges before running out of ammunition during the third. Though the British captured the position, they suffered over 1,000 casualties—nearly half their attacking force. The battle proved that untrained colonists could stand against professional British soldiers and boosted American morale."
  },
  {
    id: 163,
    name: "Battle of Antietam",
    civilization: 'american-wars',
    acceptedAnswers: ["antietam", "battle of antietam", "sharpsburg", "battle of sharpsburg"],
    prompt: "American Civil War Battle of Antietam 1862, Union and Confederate soldiers fighting along a sunken road, bloody cornfield combat, Burnside Bridge with soldiers charging across, Antietam Creek, Maryland countryside, cannons firing, blue and gray uniforms clashing, dramatic historical war painting",
    hints: [
      "This single-day battle remains the bloodiest day in American military history",
      "It was fought near a creek in western Maryland",
      "The outcome gave President Lincoln the opportunity to issue a famous proclamation",
      "General McClellan's Union forces fought Lee's Confederate army to a standstill at Sharpsburg"
    ],
    difficulty: "medium",
    year: 1862,
    location: "Maryland, USA",
    description: "Fought on September 17, 1862, Antietam was the bloodiest single day in American military history with nearly 23,000 casualties. Union General McClellan intercepted Lee's invasion of Maryland and fought the Confederates to a tactical draw, though Lee was forced to withdraw back to Virginia. The strategic Union victory gave President Lincoln the political cover to issue the Emancipation Proclamation, transforming the war into a fight against slavery."
  },
  {
    id: 164,
    name: "Battle of Shiloh",
    civilization: 'american-wars',
    acceptedAnswers: ["shiloh", "battle of shiloh", "pittsburg landing", "battle of pittsburg landing"],
    prompt: "American Civil War Battle of Shiloh 1862, Confederate surprise attack on Union camps at dawn, soldiers fighting in the Hornet's Nest, dense Tennessee woodland combat, Peach Orchard in bloom amid chaos of battle, gunboat shelling from the Tennessee River, dramatic Civil War painting",
    hints: [
      "A surprise attack nearly overran a Union army before reinforcements arrived overnight",
      "It was fought near a small church in southwestern Tennessee",
      "A defensive stand called the 'Hornet's Nest' bought crucial time for the defenders",
      "Confederate General Albert Sidney Johnston was killed leading a charge at this Tennessee battle"
    ],
    difficulty: "hard",
    year: 1862,
    location: "Tennessee, USA",
    description: "Confederate forces under Albert Sidney Johnston launched a surprise dawn attack on Grant's Union army at Pittsburg Landing near Shiloh Church, Tennessee. The Confederates nearly drove the Union into the Tennessee River, but a heroic stand at the 'Hornet's Nest' bought time for reinforcements. Johnston was killed during the assault. Overnight, Union reinforcements arrived, and Grant counterattacked the next day, winning a costly victory with over 23,000 total casualties that shocked the nation."
  },
  {
    id: 165,
    name: "Battle of Vicksburg",
    civilization: 'american-wars',
    acceptedAnswers: ["vicksburg", "battle of vicksburg", "siege of vicksburg"],
    prompt: "American Civil War Siege of Vicksburg 1863, Union forces besieging the Confederate fortress city on Mississippi River bluffs, Grant's army digging trenches and tunnels, Union gunboats bombarding from the river, soldiers in siege lines, dramatic Mississippi landscape with high river bluffs, historical war painting",
    hints: [
      "This siege gave the Union complete control of a vital American waterway",
      "The fortress city sat on high bluffs overlooking a great river in Mississippi",
      "It surrendered on July 4th, the day after another famous Union victory",
      "General Grant's brilliant campaign and 47-day siege captured this Mississippi River stronghold"
    ],
    difficulty: "medium",
    year: 1863,
    location: "Mississippi, USA",
    description: "After a brilliant campaign of maneuver, General Grant besieged the Confederate stronghold of Vicksburg, perched on bluffs overlooking the Mississippi River. For 47 days, Union forces bombarded the city while its defenders and civilians endured starvation. The garrison surrendered on July 4, 1863, the day after Gettysburg. The fall of Vicksburg gave the Union control of the entire Mississippi River, splitting the Confederacy in two."
  },
  {
    id: 166,
    name: "Battle of Chancellorsville",
    civilization: 'american-wars',
    acceptedAnswers: ["chancellorsville", "battle of chancellorsville"],
    prompt: "American Civil War Battle of Chancellorsville 1863, Stonewall Jackson's flank attack crashing into Union right, Confederate soldiers charging through dense Virginia wilderness, evening assault through tangled forest, campfires and chaos, Lee and Jackson planning bold strategy, dramatic Civil War battle painting",
    hints: [
      "A brilliant flanking march through dense forest caught the enemy completely by surprise",
      "It was fought in the tangled Wilderness of Virginia",
      "The victorious side's greatest general was accidentally shot by his own men here",
      "Lee's daring decision to split his army defeated Hooker's much larger Union force"
    ],
    difficulty: "hard",
    year: 1863,
    location: "Virginia, USA",
    description: "Facing a Union army twice his size under General Hooker, Robert E. Lee made the audacious decision to split his force and send Stonewall Jackson on a flanking march through the Virginia Wilderness. Jackson's surprise attack crushed the Union right flank, leading to a stunning Confederate victory. However, the triumph was marred when Jackson was accidentally shot by his own troops and died days later, a loss Lee called losing his 'right arm.'"
  },
  {
    id: 167,
    name: "Battle of Fort Sumter",
    civilization: 'american-wars',
    acceptedAnswers: ["fort sumter", "battle of fort sumter", "attack on fort sumter"],
    prompt: "American Civil War Battle of Fort Sumter 1861, Confederate batteries bombarding the Union-held island fort in Charleston Harbor, cannons firing from shore batteries, explosions hitting the brick fortress, smoke rising over the harbor, South Carolina coast, dramatic painting of the opening shots of the Civil War",
    hints: [
      "No one was killed in the actual bombardment of this engagement",
      "It took place in a harbor in South Carolina",
      "This confrontation marked the very beginning of a devastating American conflict",
      "Confederate artillery bombarded this Union-held fort in Charleston Harbor, starting the Civil War"
    ],
    difficulty: "medium",
    year: 1861,
    location: "South Carolina, USA",
    description: "On April 12, 1861, Confederate batteries opened fire on the Union-held Fort Sumter in Charleston Harbor, beginning the American Civil War. Major Robert Anderson's small garrison held out for 34 hours before surrendering. Remarkably, no one was killed during the bombardment itself. The attack galvanized the North, and President Lincoln called for 75,000 volunteers, prompting four more Southern states to join the Confederacy."
  },
  {
    id: 168,
    name: "Battle of Chattanooga",
    civilization: 'american-wars',
    acceptedAnswers: ["chattanooga", "battle of chattanooga", "battles of chattanooga"],
    prompt: "American Civil War Battle of Chattanooga 1863, Union soldiers charging up Missionary Ridge against Confederate defenses, dramatic uphill assault, Lookout Mountain shrouded in clouds with fighting above the mists, Tennessee River valley, Grant commanding Union forces, epic Civil War battle painting",
    hints: [
      "One assault up a steep ridge succeeded against all expectations without orders to do so",
      "It was fought around a strategic city in southeastern Tennessee",
      "A battle on a nearby mountain was called 'The Battle Above the Clouds'",
      "Grant's forces broke the Confederate siege and opened the gateway to Georgia"
    ],
    difficulty: "hard",
    year: 1863,
    location: "Tennessee, USA",
    description: "After the Union defeat at Chickamauga, Grant was sent to relieve the besieged army at Chattanooga. In a series of engagements, Union forces captured Lookout Mountain in the famous 'Battle Above the Clouds' and then stormed Missionary Ridge in an unplanned but spectacularly successful uphill assault that routed the Confederate army. The victory opened the gateway to Georgia and set the stage for Sherman's March to the Sea."
  },
  {
    id: 169,
    name: "First Battle of Bull Run",
    civilization: 'american-wars',
    acceptedAnswers: ["bull run", "first bull run", "first battle of bull run", "first manassas", "battle of first manassas", "battle of bull run"],
    prompt: "American Civil War First Battle of Bull Run 1861, Union and Confederate armies clashing on Virginia fields, soldiers in fresh uniforms, civilians watching from hillside with picnic baskets, Confederate reinforcements arriving by rail, chaotic retreat of Union forces, Stone Bridge over Bull Run creek, dramatic Civil War painting",
    hints: [
      "Civilians from a nearby capital came with picnics expecting to watch an easy victory",
      "It was the first major land battle of the American Civil War, fought in Virginia",
      "A Confederate general earned his famous nickname by standing firm 'like a stone wall'",
      "The Union rout at this battle near Manassas, Virginia showed both sides the war would be long and bloody"
    ],
    difficulty: "medium",
    year: 1861,
    location: "Virginia, USA",
    description: "The first major battle of the Civil War shattered illusions of a quick conflict. Washington civilians rode out with picnic baskets to watch what they expected to be an easy Union victory. Instead, Confederate reinforcements arriving by rail turned the tide, and Thomas Jackson earned the nickname 'Stonewall' for his brigade's steadfast defense. The Union army broke and fled in a chaotic retreat back to Washington, proving the war would be long and costly."
  },
  {
    id: 170,
    name: "Battle of Trenton",
    civilization: 'american-wars',
    acceptedAnswers: ["trenton", "battle of trenton"],
    prompt: "American Revolution Battle of Trenton 1776, George Washington's Continental Army crossing the icy Delaware River at night in Durham boats, surprise attack on Hessian garrison at dawn, snow and ice, soldiers in ragged uniforms storming through the streets of Trenton, dramatic Revolutionary War painting",
    hints: [
      "This daring attack was launched after a dangerous nighttime river crossing in winter",
      "It took place in New Jersey on the morning after a major holiday",
      "The surprised garrison of foreign mercenaries was quickly overwhelmed",
      "Washington crossed the icy Delaware River on Christmas night to attack the Hessians at this New Jersey town"
    ],
    difficulty: "medium",
    year: 1776,
    location: "New Jersey, USA",
    description: "On Christmas night 1776, George Washington led 2,400 soldiers across the ice-choked Delaware River in a desperate bid to revive the faltering Revolution. At dawn, they surprised the Hessian garrison at Trenton, capturing nearly 1,000 enemy soldiers in under two hours with minimal American losses. The stunning victory restored American morale after a string of devastating defeats and convinced many soldiers to reenlist, keeping the Continental Army alive."
  },
  {
    id: 171,
    name: "Battle of Cowpens",
    civilization: 'american-wars',
    acceptedAnswers: ["cowpens", "battle of cowpens"],
    prompt: "American Revolution Battle of Cowpens 1781, Continental Army and militia executing a tactical retreat then counterattack, Daniel Morgan's double envelopment of British cavalry and infantry, South Carolina grasslands, cavalry charge, militia firing then falling back in planned maneuver, dramatic Revolutionary War painting",
    hints: [
      "The American commander brilliantly used his militia's tendency to flee as a tactical weapon",
      "It was fought at a cattle grazing area in upcountry South Carolina",
      "The double envelopment executed here is compared to Hannibal's tactics at Cannae",
      "Daniel Morgan destroyed Banastre Tarleton's feared British Legion at this South Carolina battlefield"
    ],
    difficulty: "hard",
    year: 1781,
    location: "South Carolina, USA",
    description: "Brigadier General Daniel Morgan devised a brilliant tactical plan that used the militia's tendency to break and run as a deliberate feint. Morgan placed militia in front with orders to fire two volleys then retreat behind the Continental regulars, drawing the British into a trap. When Tarleton's forces pursued, they were hit by disciplined regulars and a cavalry counterattack that destroyed the British force. Over 800 British were killed or captured, dealing a devastating blow to British operations in the South."
  },
  {
    id: 172,
    name: "Battle of Monmouth",
    civilization: 'american-wars',
    acceptedAnswers: ["monmouth", "battle of monmouth", "monmouth courthouse"],
    prompt: "American Revolution Battle of Monmouth 1778, Continental Army fighting British forces in extreme summer heat, Washington rallying retreating troops on horseback, Molly Pitcher manning a cannon, soldiers collapsing from heat exhaustion, New Jersey farmland, dramatic Revolutionary War battle painting",
    hints: [
      "Extreme summer heat caused as many casualties as the fighting itself",
      "It was fought in central New Jersey after the British evacuated a major city",
      "A legendary woman took her fallen husband's place at a cannon during the fighting",
      "Washington personally rallied retreating troops and fought the British to a standstill at this New Jersey courthouse"
    ],
    difficulty: "hard",
    year: 1778,
    location: "New Jersey, USA",
    description: "As the British army marched across New Jersey after evacuating Philadelphia, Washington attacked their rear guard near Monmouth Courthouse. When General Charles Lee ordered a premature retreat, Washington personally rode to the front and rallied the troops. In sweltering heat that killed soldiers on both sides, the Continental Army fought the British to a standstill, demonstrating the improved discipline gained from Baron von Steuben's training at Valley Forge. The legend of 'Molly Pitcher,' a woman who supposedly took over her husband's cannon, was born from this battle."
  },
  {
    id: 173,
    name: "Battle of New Orleans",
    civilization: 'american-wars',
    acceptedAnswers: ["new orleans", "battle of new orleans"],
    prompt: "Battle of New Orleans 1815, Andrew Jackson's American defenders behind cotton bale fortifications, British redcoats advancing across open field, devastating American rifle and cannon fire cutting down British ranks, Louisiana bayou landscape, fog lifting over the Mississippi River, War of 1812 battle painting",
    hints: [
      "This lopsided American victory was actually fought after a peace treaty had already been signed",
      "It took place near a major port city at the mouth of the Mississippi River",
      "The victorious general later became President of the United States",
      "Andrew Jackson's outnumbered defenders destroyed the attacking British army in the War of 1812's most famous battle"
    ],
    difficulty: "medium",
    year: 1815,
    location: "Louisiana, USA",
    description: "Andrew Jackson assembled a diverse force of regulars, militia, free Black soldiers, Choctaw warriors, and even Jean Lafitte's pirates to defend New Orleans against a veteran British army. On January 8, 1815, the British launched a frontal assault across open ground and were cut to pieces by devastating American fire. The British suffered over 2,000 casualties to only 71 American losses. Ironically, the Treaty of Ghent ending the War of 1812 had been signed two weeks earlier, though news had not yet reached the combatants. The victory made Jackson a national hero and future president."
  },
  {
    id: 174,
    name: "Battle of the Alamo",
    civilization: 'american-wars',
    acceptedAnswers: ["alamo", "the alamo", "battle of the alamo"],
    prompt: "Battle of the Alamo 1836, Texan defenders behind the walls of the old mission fortress, Mexican army of Santa Anna storming the walls at dawn, Davy Crockett fighting on the ramparts, Jim Bowie with his knife, William Barrett Travis drawing a line in the sand, dramatic Texas Revolution battle painting",
    hints: [
      "'Remember' this place became a rallying cry for independence",
      "It was fought at an old Spanish mission in what is now a major Texas city",
      "A small band of defenders held out for 13 days against an overwhelming force",
      "Davy Crockett, Jim Bowie, and William Travis died defending this San Antonio mission against Santa Anna's Mexican army"
    ],
    difficulty: "easy",
    year: 1836,
    location: "Texas, USA",
    description: "A garrison of roughly 200 Texan defenders held the fortified Alamo mission against Mexican President Santa Anna's army of thousands for 13 days before being overwhelmed on March 6, 1836. All defenders were killed, including famous frontiersmen Davy Crockett and Jim Bowie, and commander William Barrett Travis. Though a military defeat, the heroic stand became a powerful symbol. 'Remember the Alamo!' became the rallying cry that inspired the Texan army to defeat Santa Anna at the Battle of San Jacinto six weeks later, securing Texas independence."
  },
  {
    id: 175,
    name: "Battle of Buena Vista",
    civilization: 'american-wars',
    acceptedAnswers: ["buena vista", "battle of buena vista"],
    prompt: "Mexican-American War Battle of Buena Vista 1847, General Zachary Taylor's American forces defending a narrow mountain pass against Santa Anna's much larger Mexican army, artillery duels in rugged terrain, US dragoons charging, dramatic desert mountain landscape of northern Mexico, historical war painting",
    hints: [
      "An American general allegedly said 'A little more grape, Captain' during the fierce cannonade",
      "It was fought in a narrow mountain pass in northern Mexico",
      "The outnumbered Americans held off an army nearly four times their size",
      "Zachary Taylor's small force defeated Santa Anna's 20,000-strong Mexican army, making Taylor a future president"
    ],
    difficulty: "hard",
    year: 1847,
    location: "Coahuila, Mexico",
    description: "General Zachary Taylor's force of roughly 5,000 American troops, mostly untested volunteers, faced Santa Anna's army of nearly 20,000 in a narrow mountain pass near the hacienda of Buena Vista. Over two days of fierce fighting, American artillery proved devastating, and the defenders held their positions despite being vastly outnumbered. Santa Anna withdrew his battered army, ending the northern Mexico campaign. The victory made Taylor a national hero and propelled him to the presidency in 1848."
  },
  {
    id: 176,
    name: "Battle of Chapultepec",
    civilization: 'american-wars',
    acceptedAnswers: ["chapultepec", "battle of chapultepec", "chapultapec"],
    prompt: "Mexican-American War Battle of Chapultepec 1847, US Marines and soldiers storming the hilltop castle fortress, scaling walls with ladders, young Mexican military cadets defending to the death, American flag being raised over the castle, Mexico City visible below, dramatic historical battle painting",
    hints: [
      "Young military cadets became martyred heroes for defending this position to the death",
      "The fortress that was stormed overlooked the capital of a nation",
      "US Marines fought here, and the battle is memorialized in their famous hymn",
      "The storming of this castle guarding Mexico City featured the legendary 'Ninos Heroes' and is remembered in the Marines' Hymn's 'Halls of Montezuma'"
    ],
    difficulty: "hard",
    year: 1847,
    location: "Mexico City, Mexico",
    description: "The fortified castle of Chapultepec, perched on a hill overlooking Mexico City, was the last major obstacle to the American capture of the Mexican capital. US forces stormed the position on September 13, 1847, scaling the walls under heavy fire. Six young Mexican military cadets, the 'Ninos Heroes,' chose to die fighting rather than surrender, becoming enduring symbols of Mexican patriotism. The fall of Chapultepec led to the capture of Mexico City and the end of the war. The battle is immortalized in the opening line of the Marines' Hymn: 'From the Halls of Montezuma.'"
  },
  {
    id: 177,
    name: "Battle of San Juan Hill",
    civilization: 'american-wars',
    acceptedAnswers: ["san juan hill", "battle of san juan hill", "san juan heights", "kettle hill"],
    prompt: "Spanish-American War Battle of San Juan Hill 1898, Theodore Roosevelt leading the Rough Riders in a charge up a tropical hillside, American soldiers and Buffalo Soldiers attacking Spanish fortifications, tropical vegetation, dramatic uphill assault in Cuba, smoke and gunfire, historical painting",
    hints: [
      "A volunteer cavalry regiment known by a colorful nickname led the most famous charge",
      "It was fought on a tropical island during a war that lasted only a few months",
      "The victorious colonel parlayed his fame from this battle into a political career all the way to the White House",
      "Theodore Roosevelt and his Rough Riders charged up this Cuban hill during the Spanish-American War"
    ],
    difficulty: "medium",
    year: 1898,
    location: "Santiago de Cuba, Cuba",
    description: "During the Santiago campaign of the Spanish-American War, American forces assaulted the fortified San Juan Heights defending the city. Theodore Roosevelt led his Rough Riders up nearby Kettle Hill while regular infantry and Buffalo Soldiers of the 9th and 10th Cavalry stormed San Juan Hill. The hard-fought victory tightened the siege of Santiago and led to the Spanish surrender in Cuba. Roosevelt's celebrated charge made him a national hero, propelling him to the vice presidency and then the White House."
  },
  {
    id: 178,
    name: "Battle of Manila Bay",
    civilization: 'american-wars',
    acceptedAnswers: ["manila bay", "battle of manila bay", "manila"],
    prompt: "Spanish-American War Battle of Manila Bay 1898, Commodore Dewey's American warships destroying the Spanish fleet in the harbor, modern steel cruisers firing broadsides, burning Spanish vessels, tropical Philippine coastline, dawn naval engagement, smoke over calm waters, dramatic historical naval battle painting",
    hints: [
      "The famous order was 'You may fire when you are ready'",
      "It was a naval battle fought in a harbor in Southeast Asia",
      "The victorious fleet destroyed an entire enemy squadron without losing a single man",
      "Commodore Dewey annihilated the Spanish fleet in the Philippines, launching America as a Pacific power"
    ],
    difficulty: "hard",
    year: 1898,
    location: "Manila Bay, Philippines",
    description: "On May 1, 1898, Commodore George Dewey's Asiatic Squadron sailed into Manila Bay and destroyed the entire Spanish Pacific fleet in a matter of hours. Dewey's famous order to his flagship captain, 'You may fire when you are ready, Gridley,' opened one of the most lopsided naval victories in history. The Americans sank or captured every Spanish vessel without losing a single sailor. The battle established the United States as a Pacific power and led to American acquisition of the Philippines."
  },
  {
    id: 179,
    name: "Battle of Ia Drang",
    civilization: 'american-wars',
    acceptedAnswers: ["ia drang", "battle of ia drang", "ia drang valley", "landing zone x-ray"],
    prompt: "Vietnam War Battle of Ia Drang Valley 1965, US Army 1st Cavalry Division Air Cavalry soldiers fighting North Vietnamese regulars in jungle clearing, Huey helicopters landing under fire, intense close combat in tall elephant grass, soldiers calling in airstrikes, napalm explosions, dramatic Vietnam War battle painting",
    hints: [
      "This was the first large-scale engagement between US and enemy regular forces in a Southeast Asian war",
      "It was fought in a remote jungle valley in the Central Highlands of Vietnam",
      "Helicopters played a revolutionary role in troop movement and support",
      "The 7th Cavalry's fight at Landing Zone X-Ray in the Ia Drang Valley was later depicted in the book and film 'We Were Soldiers'"
    ],
    difficulty: "hard",
    year: 1965,
    location: "Central Highlands, Vietnam",
    description: "The first major battle between US Army troops and North Vietnamese Army regulars took place in the Ia Drang Valley of Vietnam's Central Highlands in November 1965. Lieutenant Colonel Hal Moore's 1st Battalion, 7th Cavalry was helicoptered into Landing Zone X-Ray and immediately surrounded by a much larger NVA force. Over three days of desperate fighting, American firepower and air support prevented the battalion from being overrun. The battle demonstrated both the potential of air cavalry tactics and the determination of the North Vietnamese enemy. It was later immortalized in the book and film 'We Were Soldiers.'"
  },
  {
    id: 180,
    name: "Battle of Khe Sanh",
    civilization: 'american-wars',
    acceptedAnswers: ["khe sanh", "battle of khe sanh", "siege of khe sanh"],
    prompt: "Vietnam War Battle of Khe Sanh 1968, US Marines defending an isolated combat base surrounded by North Vietnamese forces, massive B-52 bombing strikes on surrounding hills, bunkers and trenches under artillery bombardment, foggy mountain terrain, helicopters resupplying under fire, dramatic Vietnam War siege painting",
    hints: [
      "Many feared this isolated base would become an American version of a famous French defeat in Vietnam",
      "It was a prolonged siege of a remote US Marine base near the border with Laos",
      "Massive B-52 bomber strikes helped prevent the base from being overrun",
      "US Marines endured a 77-day siege at this combat base in northwestern South Vietnam, often compared to Dien Bien Phu"
    ],
    difficulty: "hard",
    year: 1968,
    location: "Quang Tri Province, Vietnam",
    description: "For 77 days beginning in January 1968, some 6,000 US Marines at the isolated Khe Sanh Combat Base were besieged by up to 40,000 North Vietnamese troops. Many Americans feared Khe Sanh would become a repeat of the French disaster at Dien Bien Phu. However, unlike the French, the Americans had overwhelming air support. Operation Niagara unleashed massive B-52 strikes that devastated the besieging forces. The siege coincided with the Tet Offensive and became a symbol of the war's grinding nature. The base was ultimately relieved and then controversially abandoned months later."
  },
  {
    id: 181,
    name: "Tet Offensive",
    civilization: 'american-wars',
    acceptedAnswers: ["tet offensive", "tet", "tet 1968"],
    prompt: "Vietnam War Tet Offensive 1968, Viet Cong and North Vietnamese forces attacking South Vietnamese cities during lunar new year, street fighting in Saigon and Hue, US embassy compound under assault, urban warfare in ancient citadel, shocked American soldiers fighting in unexpected urban combat, dramatic Vietnam War painting",
    hints: [
      "This surprise offensive was launched during a major holiday ceasefire",
      "It struck cities and military bases across an entire country simultaneously",
      "Though a military defeat for the attackers, it shattered public confidence in the war back home",
      "The 1968 lunar new year offensive across South Vietnam turned American public opinion against the Vietnam War"
    ],
    difficulty: "medium",
    year: 1968,
    location: "South Vietnam",
    description: "On January 30, 1968, during the Vietnamese lunar new year ceasefire, North Vietnamese and Viet Cong forces launched coordinated attacks on over 100 cities and military installations across South Vietnam. Viet Cong sappers even breached the US Embassy compound in Saigon. The Battle of Hue raged for a month as Marines fought to recapture the ancient citadel. Though the offensive was a devastating military defeat for the communists, who suffered enormous casualties, it shattered American public confidence that the war was being won. The Tet Offensive proved to be a strategic turning point, leading to President Johnson's decision not to seek reelection and the beginning of American disengagement."
  },
  {
    id: 182,
    name: "Battle of Inchon",
    civilization: 'american-wars',
    acceptedAnswers: ["inchon", "battle of inchon", "incheon", "battle of incheon"],
    prompt: "Korean War Battle of Inchon 1950, US Marines conducting amphibious landing at Inchon harbor, landing craft approaching seawall, Marines scaling seawall under fire, naval bombardment of the port city, Korean cityscape, General MacArthur observing from a warship, dramatic Korean War amphibious assault painting",
    hints: [
      "Military planners considered this amphibious landing almost impossibly risky due to extreme tides",
      "It was a daring seaborne assault on a port city on the west coast of the Korean Peninsula",
      "The landing cut enemy supply lines and reversed the course of the war",
      "General MacArthur's bold amphibious landing at this Korean port city cut off the North Korean army and recaptured Seoul"
    ],
    difficulty: "medium",
    year: 1950,
    location: "Inchon, South Korea",
    description: "On September 15, 1950, General Douglas MacArthur launched a daring amphibious assault at Inchon, deep behind North Korean lines. The operation was considered nearly impossible due to extreme tidal variations, narrow approach channels, and high seawalls. Despite the risks, the landing achieved complete surprise. Within two weeks, the Marines had recaptured Seoul and cut the supply lines of the North Korean army besieging the Pusan Perimeter in the south. The North Korean invasion collapsed, and UN forces advanced rapidly northward, completely reversing the course of the war."
  },
  {
    id: 183,
    name: "Battle of Chosin Reservoir",
    civilization: 'american-wars',
    acceptedAnswers: ["chosin reservoir", "battle of chosin reservoir", "chosin", "changjin", "battle of changjin lake"],
    prompt: "Korean War Battle of Chosin Reservoir 1950, US Marines fighting through Chinese forces in brutal winter conditions, frozen reservoir landscape, Marines marching through snow-covered mountain passes, close combat in subzero temperatures, frostbitten soldiers, long column retreating through frozen Korean mountains, dramatic Korean War winter battle painting",
    hints: [
      "Temperatures dropped to minus 35 degrees Fahrenheit during this brutal winter engagement",
      "It was fought around a frozen body of water in the mountains of North Korea",
      "The Marines' fighting withdrawal is one of the most legendary retreats in military history",
      "US Marines fought their way out of a massive Chinese encirclement at this frozen Korean reservoir, declaring they were 'attacking in a different direction'"
    ],
    difficulty: "hard",
    year: 1950,
    location: "North Korea",
    description: "In late November 1950, approximately 30,000 UN troops, primarily US Marines, were surrounded by 120,000 Chinese soldiers at the Chosin Reservoir in the frozen mountains of North Korea. In temperatures plunging to minus 35 degrees Fahrenheit, the Marines fought a legendary 78-mile fighting withdrawal to the port of Hungnam. When told they were retreating, Marine commander General O.P. Smith famously declared, 'Retreat, hell! We're just attacking in a different direction.' Despite suffering heavy casualties from combat and frostbite, the Marines inflicted devastating losses on the Chinese and evacuated successfully by sea, preserving a battle-hardened force that would fight on."
  }
];
