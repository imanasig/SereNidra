import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

const TextToSpeechPlayer = ({ audioUrl, voiceUsed }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        // Events
        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // If audioUrl changes, reset
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            setIsPlaying(false);
        }
    }, [audioUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(e => console.error("Playback failed:", e));
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        }
    }

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Volume2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Listen to Meditation</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Voice: {voiceUsed || 'Gemini AI'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center gap-6">
                    <button
                        onClick={handleStop}
                        disabled={!isPlaying && currentTime === 0}
                        className="p-3 text-gray-500 hover:text-rose-500 dark:text-gray-400 transition-colors disabled:opacity-30"
                        title="Stop"
                    >
                        <Square className="h-5 w-5 fill-current" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className={`h-14 w-14 rounded-full ${isPlaying ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'} flex items-center justify-center hover:scale-105 transition-transform active:scale-95`}
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
                    </button>

                    {/* Placeholder for symmetry or extra controls */}
                    <div className="w-11"></div>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 cursor-pointer overflow-hidden"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            audioRef.current.currentTime = percent * duration;
                        }}>
                        <div
                            className="bg-violet-600 h-full rounded-full transition-all duration-100"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                    Generated by Gemini TTS • Server-side Audio
                </p>
            </div>
        </div>
    );
};

export default TextToSpeechPlayer;
