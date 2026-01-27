import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SessionCard from './SessionCard';
import { Loader2, AlertCircle, History } from 'lucide-react';

const SessionList = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

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
                setSessions(data);
            } catch (err) {
                console.error("Error fetching sessions:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-violet-600">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertCircle className="h-5 w-5" />
                <p>Unable to load history. Please try again later.</p>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-gray-100">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <History className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No Sessions Yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                    Create your first personalized meditation to see it here automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    );
};

export default SessionList;
