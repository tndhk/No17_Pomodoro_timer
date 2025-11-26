'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { focusMessages, breakMessages } from '@/lib/messages';
import { useDarkMode } from '@/context/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const { state, timeLeft, start, reset } = usePomodoro();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mounted, setMounted] = useState(false);
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const [message, setMessage] = useState<string>(focusMessages[0]);
  const firstMountRef = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
    if (state === 'completed') {
      setMessage('セッション完了！');
      return;
    }
    const msgs = state === 'break' ? breakMessages : focusMessages;
    const idx = Math.floor(Math.random() * msgs.length);
    setMessage(msgs[idx]);
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {mounted && isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="bg-white dark:bg-slate-800 bg-opacity-80 dark:bg-opacity-60 backdrop-blur-xl rounded-3xl p-12 shadow-lg dark:shadow-2xl dark:shadow-black/50 flex flex-col items-center gap-8 w-full max-w-md transition-colors duration-300">
        <h1 className="text-5xl font-semibold text-slate-900 dark:text-white">FocusNest</h1>
        <div className="text-8xl font-mono text-slate-900 dark:text-white">{minutes}:{seconds}</div>
        <p className="text-xl text-center text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex gap-6">
          <button
            onClick={start}
            className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-full font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors"
          >
            Start
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Reset
          </button>
        </div>
        <a
          href="shortcuts://run-shortcut?name=FocusStart"
          className="mt-4 px-6 py-3 bg-black dark:bg-blue-700 text-white rounded-full font-medium hover:bg-slate-800 dark:hover:bg-blue-800 transition-colors"
        >
          Start Focus Session
        </a>
      </div>
    </div>
  );
}
