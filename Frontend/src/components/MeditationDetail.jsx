import { useState } from 'react';
import { Clock, Calendar, Volume2, Sparkles, Tag, Loader2 } from 'lucide-react';
import TextToSpeechPlayer from './TextToSpeechPlayer';
import { useAuth } from '../context/AuthContext';
import MoodFeedbackModal from './MoodFeedbackModal';

const MeditationDetail = ({ session, onSessionUpdate }) => {
    const { currentUser } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState('');
    const [showMoodModal, setShowMoodModal] = useState(false);

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

    const handleGenerateAudio = async () => {
        setIsGenerating(true);
        setGenerationError('');
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://localhost:8000/api/meditations/${session.id}/audio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voice_gender: session.voice_gender || 'Female'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const data = await response.json();

            // Update session locally
            const updatedSession = {
                ...session,
                audio_url: data.audio_url,
                voice_used: session.voice_gender || 'Female',
                audio_generated_at: new Date().toISOString()
            };

            if (onSessionUpdate) {
                onSessionUpdate(updatedSession);
            }
        } catch (error) {
            console.error("Audio generation error:", error);
            setGenerationError("Failed to generate audio. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMoodSubmit = async (moodAfter) => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://localhost:8000/api/meditations/${session.id}/mood-after`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mood_after: moodAfter })
            });

            if (response.ok) {
                const data = await response.json();
                if (onSessionUpdate) onSessionUpdate(data);
            }
        } catch (err) {
            console.error("Mood feedback error:", err);
        }
    };

    return (
        <>
            <div className="relative group h-full">
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>

                {/* Main Glassmorphism Container */}
                <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 transition-all h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
                            {session.title || 'Session Details'}
                        </h3>
                    </div>

                    {/* Session Details */}
                    <div className="space-y-5 flex-grow">
                        {/* Type */}
                        <div className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all cursor-default">
                            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/30">
                                <Tag className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Type</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                    {(session.type || 'meditation').replace('-', ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all cursor-default">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg shadow-indigo-500/30">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Duration</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {session.duration} minutes
                                </p>
                            </div>
                        </div>

                        {/* Voice Tone */}
                        <div className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all cursor-default">
                            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/30">
                                <Volume2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Voice Tone</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                    {session.tone || 'Standard'}
                                </p>
                            </div>
                        </div>

                        {/* Date Created */}
                        <div className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all cursor-default">
                            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg shadow-teal-500/30">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Date Created</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>

                        {/* Preferences */}
                        {session.preferences && (
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-2">Preferences Used</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{session.preferences}"</p>
                            </div>
                        )}
                    </div>

                    {/* Audio Meditation Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-5 uppercase tracking-widest">Audio Meditation</h4>

                        {generationError && (
                            <p className="text-rose-500 text-sm mb-4">{generationError}</p>
                        )}

                        {!session.audio_url && !isGenerating ? (
                            <button
                                onClick={handleGenerateAudio}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <Volume2 className="h-5 w-5" />
                                <span>Generate Audio</span>
                                <Sparkles className="h-4 w-4 opacity-70 group-hover:animate-pulse" />
                            </button>
                        ) : isGenerating ? (
                            <div className="w-full py-6 flex flex-col items-center justify-center gap-2 text-violet-600 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-100 dark:border-violet-800">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="text-sm font-medium">Generating Audio (this may take a moment)...</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <TextToSpeechPlayer
                                    audioUrl={`http://localhost:8000${session.audio_url}`}
                                    voiceUsed={session.voice_used || session.voice_gender}
                                    onEnded={() => {
                                        setShowMoodModal(true);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div >

            <MoodFeedbackModal
                isOpen={showMoodModal}
                onClose={() => setShowMoodModal(false)}
                onSubmit={handleMoodSubmit}
                sessionTitle={session.title}
            />
        </>
    );
};

export default MeditationDetail;
