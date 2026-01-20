'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MUSIC_FILES } from './musicList';

export default function CountdownClient() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const fadeIntervalRef = useRef(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setIsComplete(true);
                        fadeOutMusic();
                        return 0;
                    }
                    // Start fade out in the last 5 seconds
                    if (prev === 6) {
                        fadeOutMusic();
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const fadeInMusic = useCallback(() => {
        if (!audioRef.current) return;

        audioRef.current.volume = 0;
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));

        let volume = 0;
        fadeIntervalRef.current = setInterval(() => {
            volume += 0.05;
            if (volume >= 1) {
                volume = 1;
                clearInterval(fadeIntervalRef.current);
            }
            if (audioRef.current) {
                audioRef.current.volume = volume;
            }
        }, 100);
    }, []);

    const fadeOutMusic = useCallback(() => {
        if (!audioRef.current) return;

        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }

        let volume = audioRef.current.volume;
        fadeIntervalRef.current = setInterval(() => {
            volume -= 0.05;
            if (volume <= 0) {
                volume = 0;
                clearInterval(fadeIntervalRef.current);
                if (audioRef.current) {
                    audioRef.current.pause();
                }
            }
            if (audioRef.current) {
                audioRef.current.volume = Math.max(0, volume);
            }
        }, 100);
    }, []);

    const playRandomMusic = useCallback(() => {
        // Stop any existing audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Pick a random track
        const randomTrack = MUSIC_FILES[Math.floor(Math.random() * MUSIC_FILES.length)];
        audioRef.current = new Audio(randomTrack.path);
        audioRef.current.loop = true;
        setCurrentTrack(randomTrack.name);

        fadeInMusic();
    }, [fadeInMusic]);

    const stopMusic = useCallback(() => {
        fadeOutMusic();
    }, [fadeOutMusic]);

    const enterFullscreen = useCallback(async () => {
        try {
            if (containerRef.current) {
                if (containerRef.current.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                } else if (containerRef.current.webkitRequestFullscreen) {
                    await containerRef.current.webkitRequestFullscreen();
                } else if (containerRef.current.msRequestFullscreen) {
                    await containerRef.current.msRequestFullscreen();
                }
            }
        } catch (err) {
            console.log('Fullscreen not supported or denied');
        }
    }, []);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (err) {
            console.log('Exit fullscreen failed');
        }
    }, []);

    const handleStart = useCallback(async () => {
        if (timeLeft === 0) {
            setTimeLeft(100);
            setIsComplete(false);
        }
        setIsRunning(true);
        playRandomMusic();
        await enterFullscreen();
    }, [timeLeft, enterFullscreen, playRandomMusic]);

    const handlePause = useCallback(() => {
        setIsRunning(false);
        // Pause music but don't fade out
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const handleResume = useCallback(() => {
        setIsRunning(true);
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        }
    }, []);

    const handleReset = useCallback(async () => {
        setIsRunning(false);
        setTimeLeft(100);
        setIsComplete(false);
        stopMusic();
        await exitFullscreen();
    }, [exitFullscreen, stopMusic]);

    const handleBack = useCallback(async () => {
        stopMusic();
        await exitFullscreen();
        setTimeout(() => {
            router.push('/');
        }, 100);
    }, [exitFullscreen, router, stopMusic]);

    const progress = ((100 - timeLeft) / 100) * 100;

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden"
        >
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
                {/* Timer display */}
                <div className="mb-12">
                    <div
                        className={`text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter transition-all duration-300 ${isComplete ? 'text-white animate-pulse' : 'text-white'
                            }`}
                        style={{
                            fontFamily: 'ui-monospace, monospace',
                            textShadow: isComplete ? '0 0 60px rgba(255,255,255,0.5)' : 'none',
                        }}
                    >
                        {timeLeft}
                    </div>
                    <p className="text-neutral-500 text-xl tracking-widest uppercase mt-4">
                        {isComplete ? "Time's Up" : 'Seconds'}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-2xl h-2 bg-neutral-800 rounded-full mb-12 mx-auto overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${100 - progress}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-4 justify-center">
                    {!isRunning ? (
                        <button
                            onClick={timeLeft === 100 || timeLeft === 0 ? handleStart : handleResume}
                            className="px-12 py-4 border border-neutral-700 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-lg"
                        >
                            {timeLeft === 100 ? 'Start' : timeLeft === 0 ? 'Restart' : 'Resume'}
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="px-12 py-4 border border-neutral-700 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-lg"
                        >
                            Pause
                        </button>
                    )}

                    {(timeLeft !== 100 || isComplete) && (
                        <button
                            onClick={handleReset}
                            className="px-8 py-4 border border-neutral-800 text-neutral-500 font-medium rounded-lg transition-all duration-300 hover:border-neutral-600 hover:text-white text-lg"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Current track display */}
            {currentTrack && (isRunning || timeLeft < 100) && (
                <div className="absolute bottom-20 text-neutral-500 text-sm tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Now Playing: {currentTrack}
                </div>
            )}

            {/* Decorative elements */}
            <div className="absolute bottom-8 text-neutral-600 text-sm tracking-widest">
                100 SECONDS
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-neutral-800" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-neutral-800" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-neutral-800" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-neutral-800" />
        </div>
    );
}
