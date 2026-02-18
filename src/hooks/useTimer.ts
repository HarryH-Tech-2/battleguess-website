import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerOptions {
  onExpire?: () => void;
}

export function useTimer({ onExpire }: UseTimerOptions = {}) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds: number) => {
    clear();
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    setIsRunning(true);
  }, [clear]);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  const reset = useCallback(() => {
    clear();
    setTimeRemaining(0);
    setTotalTime(0);
    setIsRunning(false);
  }, [clear]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clear();
  }, [isRunning, clear]);

  return {
    timeRemaining,
    totalTime,
    isRunning,
    start,
    stop,
    reset,
  };
}
