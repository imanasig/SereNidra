import React, { useState } from 'react';
import { Play, Volume2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AudioGeneratorButton = ({ meditationId, onAudioGenerated, className = "" }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!currentUser) {
                throw new Error("You must be logged in.");
            }
            const token = await currentUser.getIdToken();

            const response = await fetch(`http://localhost:8000/api/meditations/${meditationId}/generate-audio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const data = await response.json();
            if (onAudioGenerated) {
                onAudioGenerated(data);
            }
        } catch (err) {
            setError(err.message);
            console.error("Audio generation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300
          ${isLoading
                        ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }
        `}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 text-current" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <Volume2 className="h-5 w-5" />
                        <span>Generate Audio</span>
                    </>
                )}
            </button>
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};

export default AudioGeneratorButton;
