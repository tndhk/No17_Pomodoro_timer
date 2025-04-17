import { useState, useEffect, useRef, useCallback } from 'react';

export type PomodoroState = 'idle' | 'running' | 'break' | 'completed';

export interface UsePomodoroOptions {
  /** 集中時間（秒） */
  focusDuration?: number;
  /** 休憩時間（秒） */
  breakDuration?: number;
}

export interface UsePomodoroReturn {
  state: PomodoroState;
  /** 残り時間（秒） */
  timeLeft: number;
  /** タイマーを開始または再スタート */
  start: () => void;
  /** タイマーをリセット */
  reset: () => void;
}

export function usePomodoro(
  {
    focusDuration = 25 * 60,
    breakDuration = 5 * 60,
  }: UsePomodoroOptions = {}
): UsePomodoroReturn {
  const [state, setState] = useState<PomodoroState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(focusDuration);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state === 'running' || state === 'break') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearTimer();
    };
  }, [state, clearTimer]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearTimer();
      if (state === 'running') {
        setState('break');
        setTimeLeft(breakDuration);
      } else if (state === 'break') {
        setState('completed');
      }
    }
  }, [timeLeft, state, breakDuration, clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setState('running');
    setTimeLeft(focusDuration);
  }, [clearTimer, focusDuration]);

  const reset = useCallback(() => {
    clearTimer();
    setState('idle');
    setTimeLeft(focusDuration);
  }, [clearTimer, focusDuration]);

  useEffect(() => {
    if (state === 'idle') {
      setTimeLeft(focusDuration);
    }
  }, [focusDuration, state]);

  return {
    state,
    timeLeft,
    start,
    reset,
  };
} 