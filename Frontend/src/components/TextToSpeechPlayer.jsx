import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Settings2 } from 'lucide-react';

const TextToSpeechPlayer = ({ text, tone, gender = 'female' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [supported, setSupported] = useState(true);

    // Tone mapping to SpeechSynthesis parameters
    const getSpeechParams = (tone) => {
        const t = tone?.toLowerCase() || 'calm';
        switch (t) {
            case 'energetic':
            case 'focus':
                return { rate: 1.0, pitch: 1.1 };
            case 'anxious': // For anxiety relief
            case 'stress':
                return { rate: 0.8, pitch: 0.9 }; // Slower, deeper
            case 'calm':
            case 'sleep':
            default:
                return { rate: 0.85, pitch: 0.95 }; // Slightly slow and soothing
        }
    };

    const speechParams = getSpeechParams(tone);
    const utteranceRef = useRef(null);

    useEffect(() => {
        if (!window.speechSynthesis) {
            setSupported(false);
            return;
        }

        // Load voices
        const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Try to enable a good default voice based on gender preference or OS
            // This is heuristic as voice names vary wildly across OS
            const voice = availableVoices.find(v =>
                (gender === 'female' && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))) ||
                (gender === 'male' && (v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Google UK English Male')))
            ) || availableVoices[0];

            setSelectedVoice(voice);
        };

        updateVoices();

        // Voice loading is async in Chrome
        window.speechSynthesis.onvoiceschanged = updateVoices;

        // Cleanup on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [gender]);

    const handlePlay = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        // Cancel any current speech
        window.speechSynthesis.cancel();

        // Create new utterance
        // For long text, some browsers choke on a single giant string. 
        // Simple strategy: Let the browser try first. If robust chunking is needed, 
        // we'd split by sentences. For now, we will pass the full text but enable cancellation.
        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = speechParams.rate;
        utterance.pitch = speechParams.pitch;
        utterance.volume = 1;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech verification error", e);
            setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    if (!supported) {
        return (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm">
                Audio playback is not supported in this browser.
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Volume2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Listen to Meditation</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {tone} • {selectedVoice ? selectedVoice.name.slice(0, 15) + '...' : 'Default Voice'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6">
                <button
                    onClick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    className="p-3 text-gray-500 hover:text-rose-500 dark:text-gray-400 transition-colors disabled:opacity-30"
                    title="Stop"
                >
                    <Square className="h-5 w-5 fill-current" />
                </button>

                {!isPlaying ? (
                    <button
                        onClick={handlePlay}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                        title={isPaused ? "Resume" : "Play"}
                    >
                        <Play className="h-6 w-6 fill-current ml-1" />
                    </button>
                ) : (
                    <button
                        onClick={handlePause}
                        className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                        title="Pause"
                    >
                        <Pause className="h-6 w-6 fill-current" />
                    </button>
                )}
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                    Browser-native audio • No download required
                </p>
            </div>
        </div>
    );
};

export default TextToSpeechPlayer;
