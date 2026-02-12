import { useState, useEffect } from 'react';

const BreathingAnimation = ({ isPlaying }) => {
    const [instruction, setInstruction] = useState('Inhale...');

    useEffect(() => {
        if (!isPlaying) return;

        // Reset to initial state when playback starts
        setInstruction('Inhale...');

        const interval = setInterval(() => {
            setInstruction((prev) => (prev === 'Inhale...' ? 'Exhale...' : 'Inhale...'));
        }, 4000); // 4 seconds per phase (8s total cycle matched with CSS)

        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!isPlaying) return null;

    return (
        <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="relative flex items-center justify-center w-32 h-32">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-xl animate-breathe"></div>

                {/* Middle Ring */}
                <div className="absolute inset-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 rounded-full border border-violet-200 dark:border-violet-700/50 animate-breathe" style={{ animationDelay: '0.1s' }}></div>

                {/* Inner Core */}
                <div className="absolute inset-8 bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-gray-700 rounded-full shadow-inner flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-300 tracking-wider">
                        {instruction === 'Inhale...' ? 'IN' : 'OUT'}
                    </span>
                </div>
            </div>

            <p className="mt-4 text-lg font-medium text-violet-600 dark:text-violet-300 tracking-widest uppercase transition-all duration-1000">
                {instruction}
            </p>
        </div>
    );
};

export default BreathingAnimation;
