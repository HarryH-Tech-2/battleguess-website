import type { GameMode } from '../types';

export interface GameModeInfo {
  id: GameMode;
  slug: string;
  label: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  rules: string;
  strategy: string;
}

export const gameModeData: GameModeInfo[] = [
  {
    id: 'daily',
    slug: 'daily',
    label: 'Daily',
    icon: '\u{1F4C6}',
    shortDesc: 'Same 5 battles for everyone today',
    longDesc:
      'Everyone gets the same 5 battles each day. Compare your score on the daily leaderboard!',
    rules:
      'Each day a fresh set of 5 battles is selected and shared globally among all players. You get one attempt per day, so every guess matters. Your total score across all 5 battles is posted to the daily leaderboard, which resets at midnight UTC. Hints are available but cost points just like in Classic mode. You cannot replay the daily challenge once you have completed it, so take your time and think carefully.',
    strategy:
      'Since you only get one shot per day, avoid rushing. Study each image thoroughly before committing to an answer. Save your hints for battles you genuinely cannot identify rather than burning them early. Pay close attention to visual cues like terrain, uniforms, and weapon types to narrow down the era before guessing. Check the daily leaderboard afterward to see how you compare and learn from battles you missed.',
  },
  {
    id: 'classic',
    slug: 'classic',
    label: 'Classic',
    icon: '\u{1F3AF}',
    shortDesc: 'Guess the battle from the image',
    longDesc:
      'See an AI-generated image of a famous battle and try to guess which one it is. Use hints if you get stuck!',
    rules:
      'You are presented with an AI-generated image depicting a historical battle. Your goal is to type the name of the battle correctly. You have access to 4 hints per round, each costing 25 points. Points are awarded based on the difficulty of the battle: easy, medium, and hard battles have increasing base point values. Correct answers build your streak, which awards bonus points for consecutive correct guesses.',
    strategy:
      'Start by examining the image for era-specific details such as armor styles, weapons, and landscape. Ancient battles often feature shields, spears, and Mediterranean terrain, while World War battles show trenches, tanks, or modern uniforms. If the image shows naval combat, narrow your options to famous sea battles. Use hints selectively \u2014 the first hint is usually a broad era clue that can save you from a wrong guess. Building and maintaining a streak is one of the best ways to maximize your overall score.',
  },
  {
    id: 'timed',
    slug: 'timed',
    label: 'Timed',
    icon: '\u23F1\uFE0F',
    shortDesc: 'Race against the clock',
    longDesc:
      'Same as Classic, but with a countdown timer. Guess faster to earn bonus points!',
    rules:
      'Timed mode follows the same rules as Classic mode but adds a countdown timer to each round. You must submit your answer before time runs out or the round ends with no points. A speed bonus is awarded based on how quickly you answer \u2014 the faster you guess correctly, the higher the bonus. Hints are still available and cost the same 25 points each. If the timer expires before you answer, you receive zero points for that round and your streak resets.',
    strategy:
      'Speed is rewarded, but accuracy matters more since a wrong answer earns nothing. Develop a quick mental checklist: scan for the era first, then look for distinguishing features like famous landmarks or battle formations. If you recognize the battle instantly, submit immediately for maximum time bonus. If you are unsure, one well-chosen hint is better than a wild guess that breaks your streak. Practice in Classic mode first to build your knowledge base, then switch to Timed once you can identify battles more confidently.',
  },
  {
    id: 'reverse-year',
    slug: 'reverse-year',
    label: 'Year',
    icon: '\u{1F4C5}',
    shortDesc: 'Guess when it happened',
    longDesc:
      "You'll be given a battle name \u2014 guess the year it took place. Within 10 years counts as correct.",
    rules:
      'In Year mode you are told the name of a battle and must guess the year it occurred. Your answer is considered correct if it falls within 10 years of the actual date. The closer your guess is to the exact year, the more points you earn. Battles span from ancient history (BCE dates) through the 20th century. No image is shown \u2014 this mode tests your pure chronological knowledge of military history.',
    strategy:
      'Anchor your knowledge around major historical milestones. For example, the fall of Rome was 476 CE, the Norman Conquest was 1066, and World War I started in 1914. Use these anchors to estimate dates for less familiar battles. Learn the rough century for each major civilization and era in BattleGuess, and you will be within range for most battles. Remember that BCE dates count backward, so the Battle of Thermopylae (480 BCE) is earlier than the Battle of Actium (31 BCE). Even an educated guess within 10 years earns points, so never leave a round blank.',
  },
  {
    id: 'reverse-location',
    slug: 'reverse-location',
    label: 'Location',
    icon: '\u{1F4CD}',
    shortDesc: 'Guess where it happened',
    longDesc:
      "You'll be given a battle name \u2014 type the location where it took place.",
    rules:
      'You are given the name of a historical battle and must type the location where it took place. Accepted answers include the city, region, or country associated with the battle. The game accepts multiple valid spellings and common names for each location. Like Year mode, no image is shown. Points are awarded for correct answers, and your streak continues as long as you keep answering correctly.',
    strategy:
      'Many battles are named after their location, which gives you a direct clue \u2014 the Battle of Gettysburg happened in Gettysburg, and the Battle of Waterloo happened near Waterloo, Belgium. For battles with less obvious names, learn the geographic theaters of major conflicts: the Eastern Front of WWII was in Russia and Eastern Europe, Napoleon fought across Western Europe and Egypt, and ancient Greek battles took place around the Aegean. When unsure, think about which empire or nation was involved and guess the general region. A country-level answer is often accepted when the exact city is unclear.',
  },
  {
    id: 'timeline',
    slug: 'timeline',
    label: 'Timeline',
    icon: '\u{1F4DC}',
    shortDesc: 'Sort battles chronologically',
    longDesc:
      'Drag and drop 5 battles into the correct chronological order. Perfect order earns a bonus!',
    rules:
      'You are given 5 battle names and must arrange them in correct chronological order from earliest to latest. Drag and drop the battles into position. You earn points for each battle placed in the correct position, and a perfect-order bonus is awarded if you get all 5 right. The battles are drawn from different eras and difficulty levels, so you may need to compare ancient battles against modern ones. There is no time limit, so you can take as long as you need to think it through.',
    strategy:
      'Start by identifying battles you are confident about and place those first. Group battles by era \u2014 ancient, medieval, early modern, and modern \u2014 before fine-tuning the order within each group. If you are unsure about two battles from the same era, think about the broader historical context: which empire rose first, which war came before which. Eliminating obviously wrong placements first makes the remaining decisions easier. Since perfect order earns a bonus, it is worth spending extra time to get every position right rather than settling for partial credit.',
  },
  {
    id: 'campaign',
    slug: 'campaign',
    label: 'Campaign',
    icon: '\u{1F5FA}\uFE0F',
    shortDesc: 'Play through history',
    longDesc:
      'Follow a narrative through historical campaigns like Rise of Rome or Napoleon\u2019s Gambit.',
    rules:
      'Campaign mode features themed narrative campaigns, each consisting of a series of progressive missions centered around a specific historical period or commander. Missions increase in difficulty as you advance through the campaign. You must complete each mission to unlock the next one. Each campaign tells a story, providing historical context between battles. Your performance across all missions contributes to a campaign score, and completing an entire campaign unlocks achievements.',
    strategy:
      'Read the narrative text between missions carefully \u2014 it often contains clues about the next battle you will face. Since campaigns are themed around specific eras or commanders, studying that period before starting will give you a significant advantage. Early missions in each campaign tend to be easier, so use them to build momentum and a strong streak before the difficulty ramps up. If you struggle with a mission, take note of the battle and study it before retrying. Campaign mode is one of the best ways to systematically learn a specific slice of military history.',
  },
  {
    id: 'challenge',
    slug: 'challenge',
    label: 'Challenge',
    icon: '\u2694\uFE0F',
    shortDesc: 'Challenge a friend',
    longDesc:
      'Play a set of battles, then share a link. Your friend plays the same battles and tries to beat your score!',
    rules:
      'In Challenge mode you play through a set of battles and your score is recorded. After finishing, you receive a unique shareable link. When someone opens that link, they play the exact same battles in the same order under the same conditions. Both scores are then compared so you can see who performed better. Hints, scoring, and difficulty all work the same as Classic mode. Each challenge link can be shared with multiple people, creating a mini-competition among friends.',
    strategy:
      'When creating a challenge, play carefully and aim for your highest possible score \u2014 your score is the benchmark your friends will try to beat. Avoid using hints if you can so your score is harder to top. When receiving a challenge, treat it like a Timed mode session mentally even though there is no timer, because focus and accuracy will determine who wins. After comparing scores, discuss the battles you each struggled with \u2014 it is a great way to learn together. Share challenges on social media or in group chats to get the most participants and the most competitive results.',
  },
];

export function getGameModeBySlug(slug: string): GameModeInfo | undefined {
  return gameModeData.find(m => m.slug === slug);
}
