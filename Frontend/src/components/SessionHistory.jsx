import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SessionCard from './SessionCard';
import { History, Loader2, AlertCircle } from 'lucide-react';

const SessionHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch('http://localhost:8000/api/meditations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }

                const data = await response.json();
                // Take only top 3 for the widget
                setSessions(data.slice(0, 3));
            } catch (err) {
                console.error("Error fetching sessions:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [currentUser]);

    return (
        <div className="rounded-[2rem] p-8 border border-white/60 bg-gradient-to-br from-white via-purple-50/50 to-purple-100/50 backdrop-blur-xl h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-violet-600" />
                    Recent Sessions
                </h3>
                <button
                    onClick={() => navigate('/history')}
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar">
                {loading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                    </div>
                )}

                {error && (
                    <div className="text-rose-500 text-sm flex items-center gap-2 bg-rose-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>Failed to load history</span>
                    </div>
                )}

                {!loading && !error && sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No sessions found. Start generating!
                    </div>
                )}

                {!loading && !error && sessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
};

export default SessionHistory;
