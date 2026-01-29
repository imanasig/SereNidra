import { Clock, Calendar, Volume2, Sparkles, Tag } from 'lucide-react';
import AudioGeneratorButton from './AudioGeneratorButton';
import AudioPlayer from './AudioPlayer';

const MeditationDetail = ({ session, onSessionUpdate }) => {
    // Fix Timezone: assume backend sends UTC but might miss 'Z'. 
    // Force UTC interpretation so it converts to local browser time (IST).
    const dateString = session.created_at.endsWith('Z') ? session.created_at : session.created_at + 'Z';
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

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
                            {session.type.replace('-', ' ')}
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

                {/* Audio Player Moved Here */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Audio Meditation</h4>
                    {session.audio_url ? (
                        <AudioPlayer audioUrl={session.audio_url} title="Meditation Audio" />
                    ) : (
                        <AudioGeneratorButton
                            meditationId={session.id}
                            onAudioGenerated={handleAudioGenerated}
                            className="w-full"
                        />
                    )}
                </div>
            </div>

            {/* Removed bottom audio player div */}
        </div>
    );
};

export default MeditationDetail;
