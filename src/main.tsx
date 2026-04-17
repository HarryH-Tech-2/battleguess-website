import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppRouter } from './AppRouter'
import { i18nReady } from './i18n'
import './index.css'

// Wait for i18n to finish loading the detected locale before first render.
// For English users this resolves synchronously on the next microtask
// (English is bundled statically). For fr/es users we wait on a ~25KB chunk
// to avoid a missing-translation flash.
i18nReady.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  )
})
