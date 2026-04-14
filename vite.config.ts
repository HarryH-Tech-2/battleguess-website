import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('data/blogPosts')) return 'blog-data';
          if (id.includes('data/battles/')) return 'battle-data';
          if (id.includes('data/battleFacts') || id.includes('data/battleCoordinates') || id.includes('data/battleImages')) return 'battle-meta';
          if (id.includes('data/campaigns') || id.includes('data/achievements')) return 'game-meta';
          if (id.includes('i18n/locales/')) return 'i18n';
          if (id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next')) return 'i18n-lib';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'react-core';
        },
      },
    },
  },
})
