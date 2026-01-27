import { useState } from 'react';
import { ArrowRight, Moon, Sun, Zap, Check, Sparkles, AlertCircle } from 'lucide-react';
import ScriptDisplay from './ScriptDisplay';

const MeditationForm = () => {
    const [formData, setFormData] = useState({
        type: 'stress-relief',
        duration: 10,
        preferences: '',
        tone: 'calm-soothing',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedScript, setGeneratedScript] = useState(null);
    const [apiError, setApiError] = useState(null);

    const voiceOptions = [
        { value: 'calm-soothing', label: 'Calm, soothing whisper' },
        { value: 'clear-steady', label: 'Clear, steady voice' },
        { value: 'relaxed-tone', label: 'Calm, relaxed tone' },
        { value: 'gentle-peaceful', label: 'Gentle, peaceful voice' },
    ];

    const typeOptions = [
        { id: 'stress-relief', label: 'Stress Relief', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-100' },
        { id: 'sleep', label: 'Deep Sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-100' },
        { id: 'focus', label: 'Better Focus', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-100' },
    ];

    const validate = () => {
        const newErrors = {};
        if (!formData.type) newErrors.type = 'Please select a meditation type';
        if (!formData.duration || formData.duration < 1 || formData.duration > 60) {
            newErrors.duration = 'Duration must be between 1 and 60 minutes';
        }
        if (!formData.tone) newErrors.tone = 'Please select a voice tone';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (validate()) {
            setIsSubmitting(true);

            try {
                const response = await fetch('http://localhost:8000/api/meditations/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to generate meditation script');
                }

                const data = await response.json();
                setGeneratedScript(data.script);

            } catch (err) {
                console.error("API Error:", err);
                setApiError(err.message || "Something went wrong while generating the script. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        if (apiError) setApiError(null);
    };

    const setType = (id) => {
        setFormData(prev => ({ ...prev, type: id }));
    };

    const handleReset = () => {
        setGeneratedScript(null);
        setApiError(null);
        // Optional: Reset form data or keep it for easy modification
    };

    if (generatedScript) {
        return <ScriptDisplay script={generatedScript} onReset={handleReset} />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-3">
                    Design Your Meditation
                </h1>
                <p className="text-gray-600">
                    Customize every aspect of your session for a perfect experience.
                </p>
            </div>

            {apiError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-600 animate-fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-8 border border-gray-200 shadow-xl">

                {/* Meditation Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Meditation Goal</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {typeOptions.map((type) => {
                            const Icon = type.icon;
                            const isSelected = formData.type === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setType(type.id)}
                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${isSelected
                                            ? 'border-violet-600 bg-violet-50'
                                            : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`p-3 rounded-full ${type.bg} ${type.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className={`font-medium ${isSelected ? 'text-violet-700' : 'text-gray-600'}`}>
                                        {type.label}
                                    </span>
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 text-violet-600">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (minutes)
                        </label>
                        <div className="relative">
                            <input
                                type="range"
                                name="duration"
                                min="1"
                                max="60"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>1 min</span>
                                <span className="font-bold text-violet-600">{formData.duration} min</span>
                                <span>60 min</span>
                            </div>
                        </div>
                        {errors.duration && <p className="text-rose-500 text-xs mt-1">{errors.duration}</p>}
                    </div>

                    {/* Voice Tone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Voice Style</label>
                        <select
                            name="tone"
                            value={formData.tone}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none bg-white transition-all"
                        >
                            {voiceOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Preferences */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Specific Focus Areas (Optional)
                    </label>
                    <textarea
                        name="preferences"
                        value={formData.preferences}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none bg-white transition-all resize-none placeholder-gray-400"
                        placeholder="E.g., relieve shoulder tension, visualize a forest, let go of work stress..."
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Sparkles className="h-5 w-5 animate-spin" />
                            Generating Magic...
                        </>
                    ) : (
                        <>
                            Generate Meditation Script
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>

            </form>
        </div>
    );
};

export default MeditationForm;
