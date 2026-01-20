# BattleGuess - Game Development Plan

A web-based game where users guess the name of historical battles from AI-generated images.

---

## 1. Recommended Tech Stack

### Frontend Framework
- **React 18+ with Vite** - Fast build times, modern development experience, excellent for interactive UIs
- **TypeScript** - Type safety for better maintainability

### Styling
- **Tailwind CSS** - Utility-first CSS for rapid development with custom blue/white palette
- **Custom CSS Variables** - For consistent theming

### Animations & Interactivity
- **Framer Motion** - Production-ready animations for React
  - Smooth transitions between game states
  - Entrance/exit animations for components
  - Interactive hover/tap feedback
  - Layout animations for dynamic content

### AI Image Generation
- Pre-generate images with nano-banana and store them to reduce API costs

### State Management
- **React Hooks** (useState, useReducer, useContext) - Sufficient for game state
- **localStorage** - Persist scores and progress

### Deployment
- **Vercel** - Free tier, optimized for React/Vite, automatic deployments

---

## 2. File Structure

```
BattleGuess-Web-app/
├── public/
│   ├── favicon.ico
│   └── og-image.png              # Social sharing image
├── src/
│   ├── assets/
│   │   └── images/               # Static images (logo, icons)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx        # Reusable button component
│   │   │   ├── Card.tsx          # Card container component
│   │   │   ├── Input.tsx         # Styled input component
│   │   │   └── Modal.tsx         # Modal/dialog component
│   │   ├── game/
│   │   │   ├── BattleImage.tsx   # Displays the AI-generated battle image
│   │   │   ├── GuessInput.tsx    # Input field for user guesses
│   │   │   ├── HintButton.tsx    # Button to reveal hints
│   │   │   ├── HintDisplay.tsx   # Shows progressive hints
│   │   │   ├── ResultFeedback.tsx # Win/lose animation & feedback
│   │   │   ├── ScoreDisplay.tsx  # Current score/streak display
│   │   │   └── Timer.tsx         # Optional countdown timer
│   │   ├── layout/
│   │   │   ├── Header.tsx        # App header with logo
│   │   │   ├── Footer.tsx        # Footer with Buy Me a Coffee link
│   │   │   └── Layout.tsx        # Main layout wrapper
│   │   └── support/
│   │       └── BuyMeACoffee.tsx  # Buy Me a Coffee widget/link
│   ├── hooks/
│   │   ├── useGame.ts            # Main game logic hook
│   │   ├── useLocalStorage.ts    # Persist data to localStorage
│   │   └── useImageGeneration.ts # Gemini API integration
│   ├── data/
│   │   └── battles.ts            # Battle database with hints
│   ├── services/
│   │   └── gemini.ts             # Gemini API service
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── scoring.ts            # Score calculation logic
│   │   └── stringMatch.ts        # Fuzzy matching for answers
│   ├── styles/
│   │   └── globals.css           # Global styles & Tailwind config
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts
├── .env.example                  # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. Design Considerations

### Color Palette (Blue/White Theme)

```css
/* Primary Blues */
--primary-50: #eff6ff;    /* Lightest - backgrounds */
--primary-100: #dbeafe;   /* Light hover states */
--primary-200: #bfdbfe;   /* Borders, dividers */
--primary-300: #93c5fd;   /* Secondary elements */
--primary-400: #60a5fa;   /* Icons, accents */
--primary-500: #3b82f6;   /* Primary buttons */
--primary-600: #2563eb;   /* Primary hover */
--primary-700: #1d4ed8;   /* Active states */
--primary-800: #1e40af;   /* Dark accents */
--primary-900: #1e3a8a;   /* Darkest text on light */

/* Neutrals */
--white: #ffffff;
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-900: #0f172a;      /* Dark text */
```

### UI/UX Principles

1. **Visual Hierarchy**
   - Large, prominent battle image as focal point
   - Clear call-to-action for guess input
   - Secondary elements (hints, score) less prominent

2. **Feedback & Responsiveness**
   - Immediate visual feedback on all interactions
   - Loading states for image generation
   - Success/error animations for guesses
   - Smooth transitions between game states

3. **Accessibility**
   - High contrast ratios (4.5:1 minimum)
   - Keyboard navigation support
   - `prefers-reduced-motion` respect
   - Screen reader friendly

4. **Mobile-First Design**
   - Touch-friendly tap targets (min 44px)
   - Responsive image sizing
   - Virtual keyboard considerations

### Animation Strategy (Framer Motion)

| Element | Animation | Trigger |
|---------|-----------|---------|
| Battle Image | Scale + fade in | New round |
| Guess Input | Shake | Wrong answer |
| Score | Pop/bounce | Correct answer |
| Hints | Slide down | Reveal |
| Results | Confetti/celebration | Win |
| Cards | Subtle hover lift | Mouse enter |
| Buttons | Scale on tap | Press |

---

## 4. Step-by-Step Implementation Plan

### Phase 1: Project Setup
1. Initialize Vite + React + TypeScript project
2. Install dependencies (Tailwind CSS, Framer Motion)
3. Configure Tailwind with custom blue/white theme
4. Set up project structure and base files
5. Create environment variables template for API keys

### Phase 2: Core UI Components
1. Build reusable UI components (Button, Card, Input, Modal)
2. Create layout components (Header, Footer, Layout)
3. Implement Buy Me a Coffee component with your link
4. Set up responsive container and grid system
5. Add global styles and typography

### Phase 3: Game Components
1. Build BattleImage component with loading states
2. Create GuessInput with validation and feedback
3. Implement HintButton and HintDisplay (progressive hints)
4. Build ResultFeedback component (win/lose states)
5. Create ScoreDisplay for streak tracking

### Phase 4: Game Logic
1. Create battles database with:
   - Battle name and acceptable answers
   - Image generation prompt
   - Progressive hints (3-4 per battle)
   - Difficulty rating
   - Historical context
2. Implement `useGame` hook with:
   - Current battle state
   - Score/streak tracking
   - Hint management
   - Answer validation (fuzzy matching)
3. Add localStorage persistence for scores

### Phase 5: AI Integration
1. Set up Gemini API service
2. Implement image generation with prompts like:
   - "Historical oil painting depicting the Battle of [X], dramatic lighting, soldiers, epic scale"
3. Add caching to avoid regenerating same images
4. Implement fallback for API failures
5. Consider pre-generating images for cost savings

### Phase 6: Animations & Polish
1. Add entrance animations for all components
2. Implement answer feedback animations (shake, confetti)
3. Add smooth transitions between game states
4. Create loading skeletons for better UX
5. Add sound effects (optional, with mute toggle)

### Phase 7: Advanced Features
1. Difficulty levels (Easy/Medium/Hard)
2. Daily challenge mode
3. Leaderboard (would require backend)
4. Share results to social media
5. Achievement system

### Phase 8: Testing & Deployment
1. Test across browsers and devices
2. Optimize images and bundle size
3. Set up Vercel deployment
4. Configure environment variables
5. Add analytics (optional)

---

## 5. Key Technical Decisions

### Image Generation Strategy

**Option A: Real-time Generation (Higher cost, always fresh)**
- Generate images on-demand using Gemini API
- Estimated cost: $0.039-0.24 per game round
- Pros: Unique images, no storage needed
- Cons: API costs, 2-8 second wait per image

**Option B: Pre-generated Library (Lower cost, instant)**
- Generate images for all battles once, store in cloud storage
- One-time cost, then free serving
- Pros: Instant loading, predictable costs
- Cons: Less variety, storage needed

**Recommended: Hybrid Approach**
- Pre-generate 2-3 images per battle
- Randomly select from pre-generated pool
- Use real-time generation for "bonus rounds" or premium feature

### Answer Validation

Use fuzzy string matching to accept:
- "Battle of Waterloo" or "Waterloo"
- Minor typos ("Waterlloo")
- Different capitalizations

Libraries: `string-similarity` or custom Levenshtein distance

### Hint System Design

Progressive hints that reveal more information:
1. **Hint 1**: Era/Time period ("This battle occurred in the early 19th century")
2. **Hint 2**: Location/Region ("It took place in present-day Belgium")
3. **Hint 3**: Key figure ("Napoleon Bonaparte commanded one side")
4. **Hint 4**: Major detail ("It ended Napoleon's rule as Emperor")

Each hint reduces potential score for that round.

---

## 6. Sample Battles Database

```typescript
const battles: Battle[] = [
  {
    id: 1,
    name: "Battle of Waterloo",
    acceptedAnswers: ["waterloo", "battle of waterloo"],
    prompt: "Epic oil painting of the Battle of Waterloo 1815, Napoleon's army, dramatic cavalry charge, smoke and cannons, historically accurate uniforms",
    hints: [
      "This battle took place in June 1815",
      "It occurred in present-day Belgium",
      "Napoleon Bonaparte led one of the armies",
      "This defeat ended Napoleon's rule as Emperor of France"
    ],
    difficulty: "medium",
    year: 1815
  },
  // ... more battles
];
```

---

## 7. External Resources

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Buy Me a Coffee Button Generator](https://www.buymeacoffee.com/widget)

---

## 8. Estimated Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "framer-motion": "^11.x",
    "@google/generative-ai": "^0.x",
    "string-similarity": "^4.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "@types/react": "^18.x"
  }
}
```

---

## Next Steps

Ready to begin implementation? Start with **Phase 1: Project Setup** by running:
```bash
npm create vite@latest . -- --template react-ts
```
