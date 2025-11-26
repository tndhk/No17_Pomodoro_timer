import { useCallback, useEffect, useRef } from 'react';

export function useNotification() {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Request permission on mount
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    const playSound = useCallback(() => {
        try {
            if (!audioContextRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Simple chime sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
            oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);

        } catch (error) {
            console.error('Audio playback failed:', error);
        }
    }, []);

    const sendNotification = useCallback((title: string, body: string) => {
        // Play sound
        playSound();

        // Send visual notification
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    body,
                    icon: '/favicon.ico', // Fallback to favicon
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        new Notification(title, {
                            body,
                            icon: '/favicon.ico',
                        });
                    }
                });
            }
        }
    }, [playSound]);

    return { sendNotification };
}
