import { useState } from 'react';
import { ArrowRight, Moon, Sun, Zap, Check, Sparkles, AlertCircle } from 'lucide-react';
import ScriptDisplay from './ScriptDisplay';
import MeditationDetail from './MeditationDetail';
import { useAuth } from '../context/AuthContext';

const MeditationForm = () => {
    const [formData, setFormData] = useState({
        type: 'stress-relief',
        duration: 10,
        preferences: '',
        tone: 'calm-soothing',
        voice_gender: 'female',
        mood_before: [],
        health_conditions: [],
    });

    const [isAnalyzingPreferences, setIsAnalyzingPreferences] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedSession, setGeneratedSession] = useState(null);
    const [apiError, setApiError] = useState(null);
    const { currentUser } = useAuth();

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

    const moodOptions = [
        "Calm", "Slightly stressed", "Very anxious", "Overthinking", "Sad",
        "Low energy", "Burned out", "Frustrated", "Angry", "Restless",
        "Tired", "Hopeful", "Numb", "Distracted", "Peaceful"
    ];

    const healthSections = [
        {
            title: "Sleep & Mind",
            options: ["Insomnia", "Frequent Night Awakening", "Overthinking at Night", "ADHD", "Grief"]
        },
        {
            title: "Emotional & Stress",
            options: ["Anxiety", "Mild Depression", "Chronic Stress", "Burnout", "Emotional Overwhelm", "Work Pressure", "Exam Stress"]
        },
        {
            title: "Physical Health",
            options: ["Chronic Pain", "Injury Recovery", "Diabetes", "Hypertension", "Fatigue"]
        },
        {
            title: "Other",
            options: ["Prefer not to say"]
        }
    ];

    const handlePreferenceAnalysis = async () => {
        // Auto-generate summary from user selections
        const moodSummary = formData.mood_before.length > 0
            ? `Feeling: ${formData.mood_before.join(', ')}`
            : '';

        const healthSummary = formData.health_conditions.length > 0
            ? `Health considerations: ${formData.health_conditions.join(', ')}`
            : '';

        const typeSummary = formData.type
            ? `Goal: ${typeOptions.find(t => t.id === formData.type)?.label || formData.type}`
            : '';

        const combinedSummary = [moodSummary, healthSummary, typeSummary]
            .filter(s => s)
            .join('. ');

        if (!combinedSummary) {
            setApiError("Please select your mood, health conditions, or meditation type first");
            return;
        }

        setIsAnalyzingPreferences(true);
        setApiError(null);
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/mood/suggest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mood_text: combinedSummary })
            });

            if (!response.ok) throw new Error("Failed to analyze preferences");

            const data = await response.json();

            // Map backend suggestions to frontend values
            let typeId = 'stress-relief';
            if (data.suggested_type.toLowerCase().includes('sleep')) typeId = 'sleep';
            else if (data.suggested_type.toLowerCase().includes('focus')) typeId = 'focus';

            let toneValue = 'calm-soothing';
            const suggestedTone = data.suggested_tone.toLowerCase();
            if (suggestedTone.includes('steady')) toneValue = 'clear-steady';
            else if (suggestedTone.includes('relaxed')) toneValue = 'relaxed-tone';
            else if (suggestedTone.includes('gentle')) toneValue = 'gentle-peaceful';

            setFormData(prev => ({
                ...prev,
                type: typeId,
                duration: Math.min(data.suggested_duration, 5),
                tone: toneValue,
                preferences: data.suggested_focus_areas || combinedSummary
            }));

        } catch (error) {
            console.error("Preference analysis error:", error);
            setApiError("Failed to generate AI recommendation. Please try again.");
        } finally {
            setIsAnalyzingPreferences(false);
        }
    };

    const toggleHealthCondition = (condition) => {
        setFormData(prev => {
            const current = prev.health_conditions;
            if (condition === "Prefer not to say") return { ...prev, health_conditions: ["Prefer not to say"] };

            const filtered = current.filter(c => c !== "Prefer not to say");
            if (filtered.includes(condition)) {
                return { ...prev, health_conditions: filtered.filter(c => c !== condition) };
            } else {
                return { ...prev, health_conditions: [...filtered, condition] };
            }
        });
    };

    const toggleMood = (mood) => {
        setFormData(prev => {
            const current = prev.mood_before;
            if (current.includes(mood)) {
                return { ...prev, mood_before: current.filter(m => m !== mood) };
            } else {
                return { ...prev, mood_before: [...current, mood] };
            }
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.type) newErrors.type = 'Please select a meditation type';
        if (!formData.duration || formData.duration < 1 || formData.duration > 60) {
            newErrors.duration = 'Duration must be between 1 and 60 minutes';
        }
        if (!formData.tone) newErrors.tone = 'Please select a voice tone';
        if (!formData.mood_before || formData.mood_before.length === 0) newErrors.mood_before = 'Please select at least one mood';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (validate()) {
            setIsSubmitting(true);

            try {
                if (!currentUser) {
                    throw new Error("You must be logged in to generate a meditation.");
                }

                const token = await currentUser.getIdToken();

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meditations/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        mood_before: formData.mood_before.join(', ')
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to generate meditation script');
                }

                const data = await response.json();
                setGeneratedSession(data);

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
        setGeneratedSession(null);
        setApiError(null);
    };

    if (generatedSession) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 -z-10"></div>

                {/* Floating Decorative Orbs */}
                <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-br from-violet-400/30 to-purple-400/30 dark:from-violet-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float -z-10"></div>
                <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-breathe -z-10"></div>
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/20 to-violet-300/20 dark:from-pink-600/10 dark:to-violet-600/10 rounded-full blur-3xl -z-10"></div>

                {/* Main Content */}
                <div className="relative space-y-8 animate-fade-in-up w-full max-w-[95%] xl:max-w-7xl mx-auto py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <MeditationDetail session={generatedSession} onSessionUpdate={setGeneratedSession} />
                        </div>
                        <div className="lg:col-span-2">
                            <ScriptDisplay script={generatedSession.script} onReset={handleReset} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 -z-10"></div>

            {/* Floating Decorative Orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-br from-violet-400/30 to-purple-400/30 dark:from-violet-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float -z-10"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-breathe -z-10"></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/20 to-violet-300/20 dark:from-pink-600/10 dark:to-violet-600/10 rounded-full blur-3xl -z-10"></div>

            {/* Main Content Container */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 mb-4">
                        Design Your Meditation
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Condition-aware personalization for a safer, deeper rest.
                    </p>
                </div>


                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 1. Mood Before (Required - Multi-Select) */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-violet-500/20 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-violet-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">How are you feeling right now?</h2>
                                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-medium">(Select one or more)</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {moodOptions.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => toggleMood(m)}
                                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border flex items-center justify-center gap-2 ${formData.mood_before.includes(m)
                                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-700 shadow-lg shadow-pink-500/30 transform scale-105'
                                            : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-600/50 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-md hover:scale-105 backdrop-blur-sm'
                                            }`}
                                    >
                                        {formData.mood_before.includes(m) && <Check className="h-4 w-4" />}
                                        {m}
                                    </button>
                                ))}
                            </div>
                            {errors.mood_before && (
                                <p className="text-rose-500 text-sm mt-4 flex items-center gap-2 font-medium">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.mood_before}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 2. Health Conditions (Optional) */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 dark:from-teal-500/10 dark:via-cyan-500/10 dark:to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">Do any of these apply to you?</h2>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic font-medium">Selecting these helps the AI adjust instructions for your safety and comfort.</p>

                            <div className="space-y-6">
                                {healthSections.map((section) => (
                                    <div key={section.title}>
                                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 px-1">{section.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {section.options.map((opt) => {
                                                const isSelected = formData.health_conditions.includes(opt);
                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => toggleHealthCondition(opt)}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${isSelected
                                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-600 shadow-md shadow-teal-500/30'
                                                            : 'bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200/50 dark:border-gray-600/50 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md backdrop-blur-sm'
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="h-4 w-4" />}
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Core Settings */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all space-y-8">
                            {/* Meditation Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-widest">Meditation Goal</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {typeOptions.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.type === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setType(type.id)}
                                                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group/card ${isSelected
                                                    ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/40 shadow-lg shadow-violet-500/20'
                                                    : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md hover:-translate-y-1 backdrop-blur-sm'
                                                    }`}
                                            >
                                                <div className={`p-3 rounded-xl transition-transform group-hover/card:scale-110 ${isSelected ? type.bg : 'bg-gray-100 dark:bg-gray-700'} ${type.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <span className={`text-base font-bold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">
                                        Duration (max 5m)
                                    </label>
                                    <input
                                        type="range"
                                        name="duration"
                                        min="1"
                                        max="5"
                                        value={formData.duration > 5 ? 5 : formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                    />
                                    <div className="flex justify-between mt-2 text-xs font-bold text-violet-600">
                                        <span>1 min</span>
                                        <span>{formData.duration > 5 ? 5 : formData.duration} min</span>
                                        <span>5 min</span>
                                    </div>
                                </div>

                                {/* Voice Selection */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Voice Style</label>
                                        <select
                                            name="tone"
                                            value={formData.tone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                                        >
                                            {voiceOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* AI Recommendation for Preferences */}
                            <div className="mb-6 glass rounded-2xl p-5 border border-violet-200 dark:border-violet-900 shadow-md bg-violet-50/50 dark:bg-violet-900/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-violet-500" />
                                        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">AI Recommendation</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handlePreferenceAnalysis}
                                        disabled={isAnalyzingPreferences || (formData.mood_before.length === 0 && formData.health_conditions.length === 0)}
                                        className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold shadow-md hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
                                    >
                                        {isAnalyzingPreferences ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap className="h-4 w-4" />}
                                        Auto-Fill
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                    <p className="font-medium">Your selections will be analyzed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.mood_before.length > 0 && (
                                            <div className="px-3 py-1 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
                                                Moods: {formData.mood_before.join(', ')}
                                            </div>
                                        )}
                                        {formData.health_conditions.length > 0 && (
                                            <div className="px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                                                Health: {formData.health_conditions.join(', ')}
                                            </div>
                                        )}
                                        {formData.type && (
                                            <div className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                                                Goal: {typeOptions.find(t => t.id === formData.type)?.label}
                                            </div>
                                        )}
                                    </div>
                                    {formData.mood_before.length === 0 && formData.health_conditions.length === 0 && (
                                        <p className="text-xs italic text-gray-400">Select your mood and/or health conditions above to enable AI recommendations</p>
                                    )}
                                </div>
                            </div>

                            {/* Preferences */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">
                                    Personal Preferences
                                </label>
                                <textarea
                                    name="preferences"
                                    value={formData.preferences}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                                    placeholder="E.g., Visualize a beach, focus on breath..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {apiError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center space-x-3 text-rose-600 text-sm">
                            <AlertCircle className="h-5 w-5" />
                            <p>{apiError}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="relative group/submit">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover/submit:opacity-75 transition-opacity"></div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full py-6 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black text-xl shadow-2xl hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Sparkles className="h-6 w-6 animate-spin" />
                                    Brewing Calm...
                                </>
                            ) : (
                                <>
                                    Generate Personalized Session
                                    <ArrowRight className="h-6 w-6" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeditationForm;
