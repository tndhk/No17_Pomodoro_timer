'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useNotification } from '@/hooks/useNotification';
import { focusMessages, breakMessages } from '@/lib/messages';
import { useDarkMode } from '@/context/DarkModeContext';
import { Moon, Sun, Settings } from 'lucide-react';
import { SettingsModal } from '@/components/SettingsModal';

export default function Home() {
  const {
    state,
    timeLeft,
    start,
    reset,
    focusDuration,
    breakDuration,
    setFocusDuration,
    setBreakDuration
  } = usePomodoro();

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { sendNotification } = useNotification();

  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const [message, setMessage] = useState<string>(focusMessages[0]);
  const firstMountRef = useRef(true);
  const prevStateRef = useRef(state);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update document title
  useEffect(() => {
    if (state === 'running' || state === 'break') {
      document.title = `${minutes}:${seconds} - FocusNest`;
    } else {
      document.title = 'FocusNest';
    }
  }, [minutes, seconds, state]);

  // Handle state changes and notifications
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }

    // Detect state transition
    if (prevStateRef.current !== state) {
      if (state === 'completed') {
        setMessage('セッション完了！');
        sendNotification('Session Completed!', 'Great job! Take a break.');
      } else if (state === 'break') {
        sendNotification('Break Time', 'Time to relax.');
      }

      if (state !== 'completed') {
        const msgs = state === 'break' ? breakMessages : focusMessages;
        const idx = Math.floor(Math.random() * msgs.length);
        setMessage(msgs[idx]);
      }

      prevStateRef.current = state;
    }
  }, [state, sendNotification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header Controls */}
      <div className="fixed top-6 right-6 flex gap-4">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {mounted && isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 bg-opacity-80 dark:bg-opacity-60 backdrop-blur-xl rounded-3xl p-12 shadow-lg dark:shadow-2xl dark:shadow-black/50 flex flex-col items-center gap-8 w-full max-w-md transition-colors duration-300">
        <h1 className="text-5xl font-semibold text-slate-900 dark:text-white">FocusNest</h1>
        <div className="text-8xl font-mono text-slate-900 dark:text-white tabular-nums">{minutes}:{seconds}</div>
        <p className="text-xl text-center text-slate-700 dark:text-slate-300 min-h-[3rem] flex items-center justify-center">{message}</p>

        <div className="flex gap-6">
          <button
            onClick={start}
            className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-full font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors active:scale-95 transform"
          >
            {state === 'running' || state === 'break' ? 'Resume' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors active:scale-95 transform"
          >
            Reset
          </button>
        </div>

        <a
          href="shortcuts://run-shortcut?name=FocusStart"
          className="mt-4 px-6 py-3 bg-black dark:bg-blue-700 text-white rounded-full font-medium hover:bg-slate-800 dark:hover:bg-blue-800 transition-colors text-sm"
        >
          Start Focus Session (Shortcut)
        </a>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        onSave={(focus, breakTime) => {
          setFocusDuration(focus);
          setBreakDuration(breakTime);
        }}
      />
    </div>
  );
}
