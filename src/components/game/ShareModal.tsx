import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareCard, type ShareCardData } from '../../utils/shareCard';

interface ShareModalProps {
  isOpen: boolean;
  data: ShareCardData | null;
  onClose: () => void;
}

type ToastKind = 'success' | 'error';

interface Toast {
  kind: ToastKind;
  message: string;
}

export function ShareModal({ isOpen, data, onClose }: ShareModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Build the share card whenever the modal opens with fresh data.
  useEffect(() => {
    if (!isOpen || !data) return;
    let cancelled = false;
    setGenerating(true);
    setPreviewUrl(null);
    setBlob(null);
    generateShareCard(data)
      .then((b) => {
        if (cancelled) return;
        setBlob(b);
        setPreviewUrl(URL.createObjectURL(b));
      })
      .catch(() => {
        if (!cancelled) showToast('error', 'Could not generate share image');
      })
      .finally(() => {
        if (!cancelled) setGenerating(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, data]);

  // Free the blob URL when the modal closes / data changes.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Dismiss the modal on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  function showToast(kind: ToastKind, message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 2500);
  }

  async function handleCopyImage() {
    if (!blob) return;
    try {
      if (
        typeof window.ClipboardItem === 'undefined' ||
        !navigator.clipboard?.write
      ) {
        throw new Error('Image clipboard API not supported');
      }
      // Most browsers only allow image/png in the clipboard, so re-encode
      // our JPEG blob through a canvas into PNG.
      const png = await blobToPng(blob);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': png }),
      ]);
      showToast('success', 'Image copied');
    } catch {
      showToast('error', 'Copy failed');
    }
  }

  function handleDownload() {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'battleguess-score.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('success', 'Downloaded');
  }

  // Share the actual image (not a text caption). Tries the native share
  // sheet with the image file first (best UX on mobile — the user picks
  // X/IG/WhatsApp from the OS sheet), then falls back to copying the
  // image to the clipboard and opening the target platform so the user
  // can paste it in.
  async function shareImageTo(platform: 'x' | 'instagram' | 'whatsapp') {
    if (!blob) return;
    const file = new File([blob], 'battleguess-score.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard fallback
      }
    }

    let copied = false;
    try {
      if (
        typeof window.ClipboardItem !== 'undefined' &&
        navigator.clipboard?.write
      ) {
        const png = await blobToPng(blob);
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
        copied = true;
      }
    } catch {
      // ignored — handled below
    }

    const targets = {
      x: 'https://x.com/compose/post',
      instagram: 'https://www.instagram.com/',
      whatsapp: 'https://web.whatsapp.com/',
    } as const;

    if (copied) {
      showToast('success', 'Image copied');
    } else {
      showToast('error', 'Copy failed — try Download');
    }
    window.open(targets[platform], '_blank', 'noopener,noreferrer');
  }

  function handleTwitter() {
    void shareImageTo('x');
  }

  function handleInstagram() {
    void shareImageTo('instagram');
  }

  function handleWhatsApp() {
    void shareImageTo('whatsapp');
  }

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Share your BattleGuess score"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 lg:px-7 py-3 lg:py-4 border-b border-gray-100">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Share your score</h2>
              <button
                onClick={onClose}
                aria-label="Close share dialog"
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview + actions (scrollable) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-7 py-4 lg:py-6 space-y-4 lg:space-y-5">
              {/* Image preview — grows on larger screens */}
              <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[680px] xl:max-w-[760px] mx-auto aspect-[1080/1350] rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/60 shadow-md">
                {generating || !previewUrl ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                    <p className="text-xs text-amber-700 font-medium">Generating your card...</p>
                  </div>
                ) : (
                  <img src={previewUrl} alt="Your BattleGuess score card" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Primary actions */}
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  onClick={handleCopyImage}
                  disabled={!blob}
                  variant="primary"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  }
                  label="Copy image"
                />
                <ActionButton
                  onClick={handleDownload}
                  disabled={!blob}
                  variant="secondary"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  }
                  label="Download"
                />
              </div>

              {/* Social grid — image-only share to X, Instagram, WhatsApp */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Share image to</p>
                <div className="grid grid-cols-3 gap-2">
                  <SocialButton color="#000000" label="X" disabled={!blob} onClick={handleTwitter}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </SocialButton>
                  <SocialButton gradient="linear-gradient(135deg,#feda75 0%,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5 100%)" label="Instagram" disabled={!blob} onClick={handleInstagram}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </SocialButton>
                  <SocialButton color="#25D366" label="WhatsApp" disabled={!blob} onClick={handleWhatsApp}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  </SocialButton>
                </div>
              </div>

            </div>

            {/* Toast — full-width bar pinned to the bottom of the modal */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className={`absolute bottom-0 inset-x-0 py-3 text-center text-white text-sm font-medium ${
                    toast.kind === 'success' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}

function ActionButton({
  onClick,
  disabled,
  variant,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary';
  icon: React.ReactNode;
  label: string;
}) {
  const base =
    'flex items-center justify-center gap-2 px-3 py-2.5 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {icon}
      {label}
    </button>
  );
}

function SocialButton({
  color,
  gradient,
  label,
  onClick,
  disabled,
  children,
}: {
  color?: string;
  gradient?: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Share image to ${label}`}
      title={`Share image to ${label}`}
      className="flex items-center justify-center gap-2 py-3 lg:py-3.5 rounded-xl text-white text-sm lg:text-base font-semibold transition-transform duration-150 hover:scale-[1.03] active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={gradient ? { backgroundImage: gradient } : { backgroundColor: color }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

// Re-encode a JPEG blob as PNG so it can be written to the clipboard
// (most browsers only accept image/png in ClipboardItem).
function blobToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2d context');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((png) => {
          URL.revokeObjectURL(url);
          if (png) resolve(png);
          else reject(new Error('Encode failed'));
        }, 'image/png');
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}
