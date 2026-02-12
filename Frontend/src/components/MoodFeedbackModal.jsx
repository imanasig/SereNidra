import React, { useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';

const MoodFeedbackModal = ({ isOpen, onClose, onSubmit, sessionTitle }) => {
    const [selectedMood, setSelectedMood] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moodOptions = [
        "Calm", "Peaceful", "Hopeful", "Numb", "Slightly stressed",
        "Tired", "Refreshed", "Centered", "Sleepy", "Grateful"
    ];

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setIsSubmitting(true);
        await onSubmit(selectedMood);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

            <div className="relative glass-darker bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl border border-white/20 dark:border-gray-800 animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="text-center space-y-4 mb-8">
                    <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 items-center justify-center shadow-lg shadow-violet-200 dark:shadow-none mb-2">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How do you feel now?</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        After your session: <span className="text-violet-600 dark:text-violet-400 font-medium">{sessionTitle}</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {moodOptions.map((mood) => (
                        <button
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all border ${selectedMood === mood
                                    ? 'bg-violet-600 text-white border-violet-700 shadow-md transform scale-[1.02]'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500'
                                }`}
                        >
                            {mood}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedMood || isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Check className="h-5 w-5" />
                            Submit Feedback
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MoodFeedbackModal;
