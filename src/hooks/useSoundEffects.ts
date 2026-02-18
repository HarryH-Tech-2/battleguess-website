import { useCallback, useRef, useEffect } from 'react';

type SoundId = 'correct' | 'incorrect' | 'hint' | 'streak' | 'giveUp' | 'complete';

function createOscillatorSound(
  ctx: AudioContext,
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume: number = 0.3,
  rampTo?: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (rampTo) {
    osc.frequency.linearRampToValueAtTime(rampTo, ctx.currentTime + duration);
  }
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

const soundGenerators: Record<SoundId, (ctx: AudioContext) => void> = {
  correct: (ctx) => {
    createOscillatorSound(ctx, 523, 'sine', 0.15, 0.25);
    setTimeout(() => createOscillatorSound(ctx, 659, 'sine', 0.15, 0.25), 100);
    setTimeout(() => createOscillatorSound(ctx, 784, 'sine', 0.25, 0.25), 200);
  },
  incorrect: (ctx) => {
    createOscillatorSound(ctx, 300, 'square', 0.2, 0.15);
    setTimeout(() => createOscillatorSound(ctx, 250, 'square', 0.3, 0.15), 150);
  },
  hint: (ctx) => {
    createOscillatorSound(ctx, 440, 'sine', 0.2, 0.2, 880);
  },
  streak: (ctx) => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => createOscillatorSound(ctx, freq, 'sine', 0.15, 0.2), i * 80);
    });
  },
  giveUp: (ctx) => {
    createOscillatorSound(ctx, 400, 'sawtooth', 0.5, 0.1, 150);
  },
  complete: (ctx) => {
    [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
      setTimeout(() => createOscillatorSound(ctx, freq, 'sine', 0.2, 0.2), i * 120);
    });
  },
};

export function useSoundEffects(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  const play = useCallback((id: SoundId) => {
    if (muted) return;
    try {
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new AudioContext();
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      soundGenerators[id](ctxRef.current);
    } catch {
      // Ignore audio errors
    }
  }, [muted]);

  return { play };
}
