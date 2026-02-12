import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MeditationGenerator from '../components/MeditationGenerator';
import SessionHistory from '../components/SessionHistory';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchSessionsAndCalculateStreak = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meditations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }

                const data = await response.json();
                console.log("Dashboard Sessions Data:", data);

                // Handle both array and wrapped object formats (if API changed)
                let validSessions = [];
                if (Array.isArray(data)) {
                    validSessions = data;
                } else if (data.sessions && Array.isArray(data.sessions)) {
                    validSessions = data.sessions;
                } else {
                    console.error("Unexpected data format:", data);
                    setSessions([]);
                    return;
                }

                setSessions(validSessions);

                // Calculate Streak
                if (validSessions.length > 0) {
                    calculateStreak(validSessions);
                } else {
                    setStreak(0);
                }

            } catch (err) {
                console.error("Error fetching sessions:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionsAndCalculateStreak();
    }, [currentUser]);

    const calculateStreak = (sessionsData) => {
        // Extract unique dates (YYYY-MM-DD)
        const uniqueDates = new Set();
        sessionsData.forEach(session => {
            if (session.created_at) {
                const date = new Date(session.created_at).toISOString().split('T')[0];
                uniqueDates.add(date);
            }
        });

        const sortedDates = Array.from(uniqueDates).sort().reverse();

        if (sortedDates.length === 0) {
            setStreak(0);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let currentStreak = 0;
        let checkDate = new Date(); // Start checking from today

        // If the most recent session wasn't today or yesterday, streak is broken (0)
        // Unless we want to be lenient and say streak continues even if you missed today but did yesterday?
        // Usually, if you haven't done it today typically streak is still "active" from yesterday until midnight.
        // Let's check if the latest date is today or yesterday.
        const lastSessionDate = sortedDates[0];

        if (lastSessionDate !== today && lastSessionDate !== yesterday) {
            setStreak(0);
            return;
        }

        // Logic: Iterate back from today/yesterday
        // We need to check for consecutive days.

        // Let's normalize logic:
        // 1. Check if today exists in sortedDates. If yes, start streak count from today.
        // 2. If no, check if yesterday exists. If yes, start streak count from yesterday.
        // 3. If neither, streak is 0.

        let pointer = new Date();
        let pointerStr = pointer.toISOString().split('T')[0];

        if (!uniqueDates.has(today)) {
            // Check yesterday
            pointer.setDate(pointer.getDate() - 1);
            pointerStr = pointer.toISOString().split('T')[0];

            if (!uniqueDates.has(pointerStr)) {
                setStreak(0);
                return;
            }
        }

        // Count backwards
        while (uniqueDates.has(pointerStr)) {
            currentStreak++;
            pointer.setDate(pointer.getDate() - 1);
            pointerStr = pointer.toISOString().split('T')[0];
        }

        setStreak(currentStreak);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col transition-colors duration-300 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/40 dark:bg-violet-900/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="inline-block">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">{currentUser?.email?.split('@')[0]}</span>!
                                </h1>
                                <div className="h-1.5 w-1/3 bg-gradient-to-r from-violet-200 to-transparent rounded-full mt-2"></div>
                            </div>

                            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl">
                                Ready to reclaim your calm? Create a new session or revisit your favorites below.
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Streak Display */}
                            <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Current Streak</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {streak} {streak === 1 ? 'Day' : 'Days'}
                                    </p>
                                </div>
                            </div>

                            {/* Emotional Progress */}
                            <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50">
                                <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Emotions Calmed</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {sessions.filter(s => s.improvement_score > 0).length} Sessions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <MeditationGenerator />
                        </div>
                        <div className="lg:col-span-1 h-full">
                            <SessionHistory
                                sessions={sessions.slice(0, 3)}
                                loading={loading}
                                error={error}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
