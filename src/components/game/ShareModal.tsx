import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareCard, generateShareText, type ShareCardData } from '../../utils/shareCard';

interface ShareModalProps {
  isOpen: boolean;
  data: ShareCardData | null;
  onClose: () => void;
}

const SHARE_URL = 'https://battleguess.app';

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

  const shareText = data ? generateShareText(data) : '';

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
      showToast('success', 'Image copied — paste it anywhere!');
    } catch {
      // Fall back to copying the share text so the user always gets something.
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('success', 'Image copy not supported here — text copied instead');
      } catch {
        showToast('error', 'Copy failed');
      }
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
    showToast('success', 'Image saved');
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('success', 'Caption copied');
    } catch {
      showToast('error', 'Copy failed');
    }
  }

  async function handleNativeShare() {
    if (!data || !blob) return;
    if (!navigator.share) {
      showToast('error', 'Native share not available');
      return;
    }
    try {
      const file = new File([blob], 'battleguess-score.jpg', { type: 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'BattleGuess Score', text: shareText, url: SHARE_URL, files: [file] });
      } else {
        await navigator.share({ title: 'BattleGuess Score', text: shareText, url: SHARE_URL });
      }
    } catch {
      // user cancelled — silent
    }
  }

  function openSocial(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function handleTwitter() {
    const tweet = data?.isDaily
      ? `🎖️ BattleGuess Daily: ${data.battlesWon}/${data.totalBattles}\nCan you beat me?`
      : `🎖️ Just scored ${data?.score.toLocaleString()} pts on BattleGuess (${data?.rank})\n⭐ ${data?.accuracy}% accuracy · 🔥 ${data?.streak} streak\nCan you beat me?`;
    const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(SHARE_URL)}&hashtags=BattleGuess,MilitaryHistory`;
    openSocial(u);
  }

  function handleFacebook() {
    const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(shareText)}`;
    openSocial(u);
  }

  function handleReddit() {
    const title = data?.isDaily
      ? `Today's BattleGuess: ${data.battlesWon}/${data.totalBattles} — can you beat it?`
      : `I scored ${data?.score.toLocaleString()} pts on BattleGuess — can you beat it?`;
    const u = `https://www.reddit.com/submit?url=${encodeURIComponent(SHARE_URL)}&title=${encodeURIComponent(title)}`;
    openSocial(u);
  }

  function handleLinkedIn() {
    const u = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
    openSocial(u);
  }

  function handleWhatsApp() {
    const u = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    openSocial(u);
  }

  function handleTelegram() {
    const u = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(shareText)}`;
    openSocial(u);
  }

  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

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
            className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Share your score</h2>
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
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
              {/* Image preview */}
              <div className="relative w-full max-w-[320px] mx-auto aspect-[1080/1350] rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/60 shadow-md">
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

              {/* Social grid */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Share to</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  <SocialButton color="#000000" label="X" onClick={handleTwitter}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </SocialButton>
                  <SocialButton color="#1877F2" label="Facebook" onClick={handleFacebook}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" /></svg>
                  </SocialButton>
                  <SocialButton color="#FF4500" label="Reddit" onClick={handleReddit}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z" /></svg>
                  </SocialButton>
                  <SocialButton color="#0A66C2" label="LinkedIn" onClick={handleLinkedIn}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </SocialButton>
                  <SocialButton color="#25D366" label="WhatsApp" onClick={handleWhatsApp}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  </SocialButton>
                  <SocialButton color="#26A5E4" label="Telegram" onClick={handleTelegram}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </SocialButton>
                </div>
              </div>

              {/* Secondary actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyText}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-2.5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Copy caption
                </button>
                {supportsNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    disabled={!blob}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-2.5 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    More...
                  </button>
                )}
              </div>

              <p className="text-[10px] text-gray-400 text-center pt-1">
                Tip: Copy the image and paste it directly into Instagram, Discord, or any social app.
              </p>
            </div>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg whitespace-nowrap ${
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
    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
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
  label,
  onClick,
  children,
}: {
  color: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Share to ${label}`}
      title={`Share to ${label}`}
      className="aspect-square flex items-center justify-center rounded-xl text-white transition-transform duration-150 hover:scale-110 active:scale-95 shadow-md"
      style={{ backgroundColor: color }}
    >
      {children}
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
