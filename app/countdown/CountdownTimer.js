'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CountdownTimer() {
    const router = useRouter();
    const containerRef = useRef(null);
    const audioRef = useRef(null);

    // Settings state
    const [inputHours, setInputHours] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(5);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [timerLabel, setTimerLabel] = useState('');

    // Timer state
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showSettings, setShowSettings] = useState(true);

    const presets = [
        { label: '5m', value: 300 },
        { label: '25m', value: 1500 }
    ];

    // Format time for display
    const formatDisplay = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const playAlarm = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    }, []);

    const stopAlarm = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    const sendNotification = useCallback((label) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(label ? `⏰ ${label} - Time's Up!` : "⏰ Time's Up!", {
                body: label ? `Your "${label}" timer has finished.` : 'Your countdown timer has finished.',
                icon: '/favicon.ico',
                tag: 'countdown-timer',
            });
        }
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }, []);

    const enterFullscreen = useCallback(async () => {
        try {
            await containerRef.current?.requestFullscreen?.();
        } catch (e) { }
    }, []);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
        } catch (e) { }
    }, []);

    const startTimer = async () => {
        const total = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
        if (total <= 0) return;

        await requestNotificationPermission();
        setTotalTime(total);
        setTimeLeft(total);
        setIsRunning(true);
        setIsComplete(false);
        setShowSettings(false);
        await enterFullscreen();
    };

    const pauseTimer = () => setIsRunning(false);

    const resumeTimer = () => {
        if (timeLeft > 0) setIsRunning(true);
    };

    const resetTimer = async () => {
        setIsRunning(false);
        setTimeLeft(0);
        setTotalTime(0);
        setIsComplete(false);
        setShowSettings(true);
        stopAlarm();
        await exitFullscreen();
    };

    const handleBack = async () => {
        stopAlarm();
        await exitFullscreen();
        router.push('/');
    };

    const applyPreset = (val) => {
        setInputHours(Math.floor(val / 3600));
        setInputMinutes(Math.floor((val % 3600) / 60));
        setInputSeconds(val % 60);
    };

    // Timer countdown effect
    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsRunning(false);
                    setIsComplete(true);
                    playAlarm();
                    sendNotification(timerLabel);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, playAlarm, sendNotification, timerLabel]);

    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    const hasInput = inputHours > 0 || inputMinutes > 0 || inputSeconds > 0;

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Alarm Audio */}
            <audio ref={audioRef} src="/music/Chris Zabriskie - Cylinder Five.mp3" />

            {/* Background pulse effect */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    background: `radial-gradient(circle at center, white ${progress}%, transparent ${progress + 20}%)`,
                    transition: 'all 0.3s ease-out',
                }}
            />

            {/* Back button */}
            <button
                onClick={handleBack}
                className="absolute top-8 left-8 text-neutral-500 hover:text-white transition-colors text-sm z-50"
            >
                ← Back
            </button>

            {/* Main content */}
            <div className="relative z-10 text-center">
                {showSettings ? (
                    /* Settings Panel */
                    <>
                        {/* Time Input Display - Large Numbers */}
                        <div className="mb-12">
                            <div
                                className="text-[6rem] md:text-[10rem] font-bold leading-none tracking-tighter flex items-center justify-center"
                                style={{ fontFamily: 'ui-monospace, monospace' }}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={inputHours || ''}
                                    onChange={(e) => setInputHours(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                                    placeholder="0"
                                    className="w-[2.5ch] text-center bg-transparent outline-none placeholder-neutral-700 text-white"
                                />
                                <span className="text-neutral-600 mx-1">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={inputMinutes.toString().padStart(2, '0')}
                                    onChange={(e) => setInputMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                    placeholder="00"
                                    className="w-[2.5ch] text-center bg-transparent outline-none placeholder-neutral-700 text-white"
                                />
                                <span className="text-neutral-600 mx-1">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={inputSeconds.toString().padStart(2, '0')}
                                    onChange={(e) => setInputSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                    placeholder="00"
                                    className="w-[2.5ch] text-center bg-transparent outline-none placeholder-neutral-700 text-white"
                                />
                            </div>
                            <p className="text-neutral-500 text-xl tracking-widest uppercase mt-4">
                                Set Timer
                            </p>
                        </div>

                        {/* Timer Label Input */}
                        {/* <div className="mb-8">
                            <input
                                type="text"
                                value={timerLabel}
                                onChange={(e) => setTimerLabel(e.target.value)}
                                placeholder="Timer label (optional)"
                                maxLength={30}
                                className="w-64 px-4 py-3 bg-transparent border border-neutral-800 rounded-lg text-center text-neutral-300 placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                            />
                        </div> */}

                        {/* Presets */}
                        <div className="flex flex-wrap gap-3 justify-center mb-12">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => applyPreset(preset.value)}
                                    className="px-6 py-3 border border-neutral-800 text-neutral-400 rounded-lg transition-all duration-300 hover:border-neutral-600 hover:text-white"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={startTimer}
                            disabled={!hasInput}
                            className="px-12 py-4 border border-neutral-700 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-neutral-700"
                        >
                            Start
                        </button>
                    </>
                ) : (
                    /* Timer Display */
                    <>
                        <div className="mb-12">
                            {timerLabel && (
                                <p className="text-neutral-400 text-2xl tracking-widest uppercase mb-4">
                                    {timerLabel}
                                </p>
                            )}
                            <div
                                className={`text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter transition-all duration-300 ${isComplete ? 'text-white animate-pulse' : 'text-white'}`}
                                style={{
                                    fontFamily: 'ui-monospace, monospace',
                                    textShadow: isComplete ? '0 0 60px rgba(255,255,255,0.5)' : 'none',
                                }}
                            >
                                {formatDisplay(timeLeft)}
                            </div>
                            <p className="text-neutral-500 text-xl tracking-widest uppercase mt-4">
                                {isComplete ? "Time's Up" : 'Remaining'}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 justify-center">
                            {!isComplete && (
                                <button
                                    onClick={isRunning ? pauseTimer : resumeTimer}
                                    className="px-12 py-4 border border-neutral-700 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-lg"
                                >
                                    {isRunning ? 'Pause' : 'Resume'}
                                </button>
                            )}
                            <button
                                onClick={resetTimer}
                                className="px-8 py-4 border border-neutral-800 text-neutral-500 font-medium rounded-lg transition-all duration-300 hover:border-neutral-600 hover:text-white text-lg"
                            >
                                Reset
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Decorative label */}
            <div className="absolute bottom-8 text-neutral-600 text-sm tracking-widest">
                COUNTDOWN TIMER
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-neutral-800" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-neutral-800" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-neutral-800" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-neutral-800" />

            {/* Hide number input spinners */}
            <style jsx>{`
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
}
