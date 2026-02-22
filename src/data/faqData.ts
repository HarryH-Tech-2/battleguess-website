export interface FAQItem {
  question: string;
  answer: string;
  category: 'gameplay' | 'account' | 'technical' | 'content';
}

export const faqItems: FAQItem[] = [
  // --- First 5: match existing JSON-LD in index.html ---
  {
    question: 'What is BattleGuess?',
    answer:
      'BattleGuess is a free online history trivia game where players identify famous historical battles from AI-generated images. It covers battles from ancient Egypt and Mesopotamia through to the World Wars, with 8 different game modes including classic, timed, reverse, timeline, campaign, daily challenge, and multiplayer challenges.',
    category: 'gameplay',
  },
  {
    question: 'How do you play BattleGuess?',
    answer:
      'You are shown an AI-generated image of a historical battle and must guess which battle it depicts. You can use hints (at a point cost) to help identify the battle. Choose from 8 game modes: Classic (standard guessing), Timed (beat the clock), Year (guess the year), Location (guess the location), Timeline (order battles chronologically), Campaign (progressive missions), Daily (new challenge every day), and Challenge (compete with friends).',
    category: 'gameplay',
  },
  {
    question: 'Is BattleGuess free to play?',
    answer:
      'Yes, BattleGuess is completely free to play. No account or download is required \u2014 just visit battleguess.app and start playing in your browser on any device.',
    category: 'gameplay',
  },
  {
    question: 'What historical periods does BattleGuess cover?',
    answer:
      'BattleGuess covers battles from 8 historical eras: Ancient Egypt and Mesopotamia, Ancient Greece and Rome, Medieval Europe, Ottoman and Islamic Empires, East Asia, Colonial and Napoleonic Era, American Wars, and World Wars. Each era has multiple battles at easy, medium, and hard difficulty levels.',
    category: 'content',
  },
  {
    question: 'What game modes are available in BattleGuess?',
    answer:
      'BattleGuess offers 8 game modes: Classic (identify the battle from an image), Timed (guess before time runs out), Year (guess when the battle took place), Location (guess where it happened), Timeline (place battles in chronological order), Campaign (complete themed missions), Daily Challenge (new battle every day), and Challenge (create shareable challenges for friends).',
    category: 'gameplay',
  },

  // --- 10 additional questions ---
  {
    question: 'How does scoring work?',
    answer:
      'Your score for each battle is determined by several factors. You earn base points according to the difficulty of the battle: easy battles award fewer points while hard battles award more. A streak bonus rewards consecutive correct answers, so keeping your streak alive is key. Each hint you use costs 25 points, so use them wisely. In Timed mode you also earn a speed bonus for answering quickly \u2014 the faster you guess, the more bonus points you receive.',
    category: 'gameplay',
  },
  {
    question: 'What are hints and how do I use them?',
    answer:
      'Each battle round gives you access to 4 hints that can help you identify the battle. To reveal a hint, click the General mascot on the right side of the screen. Each hint costs 25 points from your potential score for that round. Hints are progressive \u2014 the first hint is a general clue, while later hints become increasingly specific. Using hints strategically can help you answer correctly rather than guessing blindly and earning zero points.',
    category: 'gameplay',
  },
  {
    question: 'Do I need an account to play?',
    answer:
      'No, you do not need an account to play BattleGuess. The game runs entirely in your browser with no sign-up or download required. If you want to appear on the global leaderboard, you can optionally set a display name in the settings, but this is not required to enjoy the full game experience.',
    category: 'account',
  },
  {
    question: 'How does the leaderboard work?',
    answer:
      'BattleGuess features a global leaderboard that tracks high scores across all players. To participate, set your display name in the game settings. Your scores are recorded automatically as you play. In Daily mode there is a separate daily leaderboard that resets each day, letting you compete for the top spot against everyone who plays the same set of battles. Your all-time stats and streaks are also tracked for your personal records.',
    category: 'account',
  },
  {
    question: 'Can I play on my phone?',
    answer:
      'Yes, BattleGuess is fully responsive and works on all modern devices including smartphones, tablets, and desktop computers. The interface adapts to your screen size automatically, so you get the same great experience whether you are playing on a large monitor or a mobile phone. No app download is needed \u2014 just open battleguess.app in your mobile browser.',
    category: 'technical',
  },
  {
    question: 'Does BattleGuess work offline?',
    answer:
      'BattleGuess requires an internet connection to play. The game needs to load AI-generated battle images from the server, submit your scores to the global leaderboard, and sync daily challenge data. While the core application files may be cached by your browser for faster loading, an active internet connection is necessary for the full gameplay experience.',
    category: 'technical',
  },
  {
    question: 'Where do the battle images come from?',
    answer:
      'All battle images in BattleGuess are AI-generated using Google Gemini. Each image is carefully prompted to depict a specific historical battle with period-accurate details such as armor, weapons, terrain, and formations. The AI-generated approach allows the game to provide vivid, unique depictions of battles that may have limited or no historical illustrations available.',
    category: 'content',
  },
  {
    question: 'How accurate is the historical information?',
    answer:
      'The historical information in BattleGuess is well-researched and designed to be educational. Battle descriptions, dates, locations, and key facts have been verified against reputable historical sources. While the AI-generated images are artistic interpretations rather than exact recreations, the factual content \u2014 including battle names, years, belligerents, and outcomes \u2014 is accurate and intended to help players learn real military history as they play.',
    category: 'content',
  },
  {
    question: 'Will more battles be added?',
    answer:
      'BattleGuess currently features around 200 battles spanning thousands of years of military history, and more are planned. New battles, eras, and campaigns are added in regular updates to keep the game fresh and expand its educational coverage. The goal is to build the most comprehensive collection of historical battles in any trivia game.',
    category: 'content',
  },
  {
    question: 'Can I challenge my friends?',
    answer:
      'Yes! In Challenge mode you play through a set of battles and then receive a unique shareable link. Send that link to a friend and they will play the exact same battles under the same conditions. Once they finish, you can compare scores to see who knows their military history better. It is a great way to compete head-to-head even if you are not online at the same time.',
    category: 'gameplay',
  },
];
