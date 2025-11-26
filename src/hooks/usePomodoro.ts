import { useState, useEffect, useRef, useCallback } from 'react';

export type PomodoroState = 'idle' | 'running' | 'break' | 'completed';

export interface UsePomodoroOptions {
  /** 集中時間（秒） */
  initialFocusDuration?: number;
  /** 休憩時間（秒） */
  initialBreakDuration?: number;
}

export interface UsePomodoroReturn {
  state: PomodoroState;
  /** 残り時間（秒） */
  timeLeft: number;
  /** タイマーを開始または再スタート */
  start: () => void;
  /** タイマーをリセット */
  reset: () => void;
  /** 集中時間を設定（秒） */
  setFocusDuration: (duration: number) => void;
  /** 休憩時間を設定（秒） */
  setBreakDuration: (duration: number) => void;
  focusDuration: number;
  breakDuration: number;
}

export function usePomodoro(
  {
    initialFocusDuration = 25 * 60,
    initialBreakDuration = 5 * 60,
  }: UsePomodoroOptions = {}
): UsePomodoroReturn {
  const [state, setState] = useState<PomodoroState>('idle');
  const [focusDuration, setFocusDuration] = useState(initialFocusDuration);
  const [breakDuration, setBreakDuration] = useState(initialBreakDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialFocusDuration);

  // 終了時刻を保持するRef
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // タイマーの更新ロジック
  const tick = useCallback(() => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.ceil((endTimeRef.current - now) / 1000);

    if (remaining <= 0) {
      setTimeLeft(0);
      clearTimer();

      if (state === 'running') {
        setState('break');
        setTimeLeft(breakDuration);
        // 次のタイマー（休憩）は自動開始しない仕様ならここでストップ
        // 自動開始したい場合はここで endTimeRef を更新して再開するが、
        // 今回はユーザーの操作を待つか、あるいは休憩カウントダウンを即時開始するか。
        // 元のロジックは「休憩に入ったら即カウントダウン」だったのでそれに合わせるなら：
        const nextEndTime = Date.now() + breakDuration * 1000;
        endTimeRef.current = nextEndTime;
        intervalRef.current = window.setInterval(tick, 100); // 精度向上のため100ms
        setTimeLeft(breakDuration);
      } else if (state === 'break') {
        setState('completed');
        endTimeRef.current = null;
      }
    } else {
      setTimeLeft(remaining);
    }
  }, [state, breakDuration, clearTimer]);

  // stateが変わったときの副作用（特にrunning/breakへの遷移時）
  // ただし、tick内で遷移処理を行っているため、ここでは初期化のみ

  const start = useCallback(() => {
    clearTimer();
    const duration = state === 'break' ? breakDuration : focusDuration;
    // もしbreak中にstart押されたら休憩再開？それとも集中開始？
    // 通常は「Start」ボタンは集中開始を意味することが多いが、
    // ここでは現在のモードに応じて開始する

    // 状態が idle または completed なら running (集中) へ
    let targetState = state;
    let targetDuration = duration;

    if (state === 'idle' || state === 'completed') {
      targetState = 'running';
      targetDuration = focusDuration;
    }

    setState(targetState);
    setTimeLeft(targetDuration);

    const now = Date.now();
    endTimeRef.current = now + targetDuration * 1000;

    // 即時実行して表示更新
    tick();
    intervalRef.current = window.setInterval(tick, 100);
  }, [state, focusDuration, breakDuration, clearTimer, tick]);

  const reset = useCallback(() => {
    clearTimer();
    setState('idle');
    setTimeLeft(focusDuration);
    endTimeRef.current = null;
  }, [clearTimer, focusDuration]);

  // 設定変更時の反映
  useEffect(() => {
    if (state === 'idle') {
      setTimeLeft(focusDuration);
    }
  }, [focusDuration, state]);

  // クリーンアップ
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    timeLeft,
    start,
    reset,
    setFocusDuration,
    setBreakDuration,
    focusDuration,
    breakDuration
  };
}