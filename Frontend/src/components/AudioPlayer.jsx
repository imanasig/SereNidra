import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Square, Music } from 'lucide-react';

const AudioPlayer = ({ audioUrl, title }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Prepend backend URL if relative path
    const fullAudioUrl = audioUrl.startsWith('http')
        ? audioUrl
        : `http://localhost:8000${audioUrl}`;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-lg w-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                    <Music className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                    {title && <h3 className="text-gray-900 dark:text-white text-sm font-bold">{title}</h3>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Narration</p>
                </div>
            </div>

            <audio ref={audioRef} src={fullAudioUrl} preload="metadata" />

            <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            backgroundSize: `${(currentTime / (duration || 1)) * 100}% 100%`
                        }}
                        className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb-violet"
                    />
                    <span className="w-10">{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={stop}
                        className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        title="Stop"
                    >
                        <Square className="h-4 w-4 fill-current" />
                    </button>

                    <button
                        onClick={play}
                        className={`p-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center ${isPlaying
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/30'
                            }`}
                        title="Play"
                        disabled={isPlaying}
                    >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                    </button>

                    <button
                        onClick={pause}
                        className={`p-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center ${!isPlaying
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/30'
                            }`}
                        title="Pause"
                        disabled={!isPlaying}
                    >
                        <Pause className="h-5 w-5 fill-current" />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
