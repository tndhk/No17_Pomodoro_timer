'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { focusMessages, breakMessages } from '@/lib/messages';

export default function Home() {
  const { state, timeLeft, start, reset } = usePomodoro();
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const [message, setMessage] = useState<string>(focusMessages[0]);
  const firstMountRef = useRef(true);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl p-12 shadow-lg flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-5xl font-semibold text-gray-900">FocusNest</h1>
        <div className="text-8xl font-mono text-gray-900">{minutes}:{seconds}</div>
        <p className="text-xl text-center text-gray-700">{message}</p>
        <div className="flex gap-6">
          <button onClick={start} className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition">Start</button>
          <button onClick={reset} className="px-6 py-3 bg-gray-200 text-gray-900 rounded-full font-medium hover:bg-gray-300 transition">Reset</button>
        </div>
        <a href="shortcuts://run-shortcut?name=FocusStart" className="mt-4 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">Start Focus Session</a>
      </div>
    </div>
  );
}
