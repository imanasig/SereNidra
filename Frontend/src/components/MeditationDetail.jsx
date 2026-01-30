import { useState } from 'react';
import { Clock, Calendar, Volume2, Sparkles, Tag } from 'lucide-react';
import TextToSpeechPlayer from './TextToSpeechPlayer';

const MeditationDetail = ({ session, onSessionUpdate }) => {
    const [showPlayer, setShowPlayer] = useState(false);

    // Safety checks
    if (!session) return null;

    // Fix Timezone: assume backend sends UTC but might miss 'Z'. 
    let formattedDate = "Unknown Date";
    try {
        const createdAt = session.created_at || new Date().toISOString();
        const dateString = createdAt.endsWith('Z') ? createdAt : createdAt + 'Z';
        formattedDate = new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.warn("Date parsing error:", e);
    }

    const handleAudioGenerated = (updatedSession) => {
        if (onSessionUpdate) {
            onSessionUpdate(updatedSession);
        }
    };

    return (
        <div className="glass rounded-3xl p-6 border border-white/20 dark:border-gray-800/30 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Session Details
            </h3>

            <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                        <Tag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Type</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {(session.type || 'meditation').replace('-', ' ')}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Duration</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {session.duration} minutes
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                        <Volume2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Voice Tone</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {session.tone || 'Standard'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Date Created</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                {session.preferences && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Preferences Used:</p>
                        <p className="text-gray-700 dark:text-gray-300 italic">"{session.preferences}"</p>
                    </div>
                )}

                {/* Audio Meditation Section */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Audio Meditation</h4>

                    {!showPlayer ? (
                        <button
                            onClick={() => setShowPlayer(true)}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <Volume2 className="h-5 w-5" />
                            <span>Generate Audio</span>
                            <Sparkles className="h-4 w-4 opacity-70 group-hover:animate-pulse" />
                        </button>
                    ) : (
                        <div className="animate-fade-in">
                            <TextToSpeechPlayer
                                text={session.audio_script || session.script}
                                tone={session.tone}
                                gender={session.voice_gender}
                            />
                            <button
                                onClick={() => setShowPlayer(false)}
                                className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline w-full text-center transition-colors"
                            >
                                Reset Audio Options
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeditationDetail;
