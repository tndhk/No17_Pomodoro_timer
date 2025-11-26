import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    focusDuration: number;
    breakDuration: number;
    onSave: (focus: number, breakTime: number) => void;
}

export function SettingsModal({
    isOpen,
    onClose,
    focusDuration,
    breakDuration,
    onSave,
}: SettingsModalProps) {
    const [focusMin, setFocusMin] = useState(Math.floor(focusDuration / 60));
    const [breakMin, setBreakMin] = useState(Math.floor(breakDuration / 60));

    useEffect(() => {
        if (isOpen) {
            setFocusMin(Math.floor(focusDuration / 60));
            setBreakMin(Math.floor(breakDuration / 60));
        }
    }, [isOpen, focusDuration, breakDuration]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(focusMin * 60, breakMin * 60);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Focus Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={focusMin}
                            onChange={(e) => setFocusMin(Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Break Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={breakMin}
                            onChange={(e) => setBreakMin(Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
