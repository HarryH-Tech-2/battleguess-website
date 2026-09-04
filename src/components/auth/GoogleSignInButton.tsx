import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../utils/analytics';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; width?: number; text?: string }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  width?: number;
}

export function GoogleSignInButton({ onSuccess, onError, width = 300 }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { signIn } = useAuth();

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Auth failed (${res.status})`);
      }

      const data = await res.json() as { token: string; isNewUser?: boolean; user: { id: string; email: string; name: string; avatarUrl: string | null } };
      signIn(data.token, data.user);
      if (data.isNewUser) analytics.signUp('google'); else analytics.login('google');
      // Local stats / streak are pushed to the account by App's sign-in sync.

      onSuccess?.();
    } catch (err) {
      console.error('Sign-in failed:', err);
      onError?.(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }, [signIn, onSuccess, onError]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !buttonRef.current) return;

    const renderButton = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
      });
    };

    // If GIS script already loaded
    if (window.google) {
      renderButton();
      return;
    }

    // Load GIS script if not present
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = renderButton;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', renderButton);
    }
  }, [handleCredentialResponse, width]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
