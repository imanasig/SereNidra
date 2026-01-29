import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SessionList from '../components/SessionList';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');

    // Debounce search query
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { currentUser } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchSessions = useCallback(async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const token = await currentUser.getIdToken();

            // Build query params
            const params = new URLSearchParams();
            if (debouncedQuery) params.append('query', debouncedQuery);
            if (filterType) params.append('type', filterType);

            // Use search endpoint if filters exist, otherwise default (though search endpoint handles no-params too, 
            // the original list endpoint was /api/meditations. 
            // Let's us /api/meditations/search for everything as it's a superset functionality if implemented correctly,
            // OR strictly stick to requirements. 
            // My implementation of /api/meditations/search handles empty params by returning all user sessions.
            // So we can use it for everything or switch based on params.
            // Let's use /api/meditations/search for consistency if params exist, or just always use it.
            // The previous /api/meditations endpoint is simple, but search is better.
            // However, to be safe and efficient, let's use the new endpoint.

            const url = `http://localhost:8000/api/meditations/search?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }

            const data = await response.json();
            // The API now returns a list of { session: {...}, match_info: {...} } objects
            // We need to extract just the session part for the SessionList component
            const extractedSessions = data.map(item => item.session);
            setSessions(extractedSessions);
            setError(null);
        } catch (err) {
            console.error("Error fetching sessions:", err);
            setError("Unable to load history. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [currentUser, debouncedQuery, filterType]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleDeleteSession = async (sessionId) => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://localhost:8000/api/meditations/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete session');
            }

            // Remove from local state immediately
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        } catch (err) {
            console.error("Error deleting session:", err);
            alert("Failed to delete session. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />

            <div className="container mx-auto px-6 pt-28 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-600">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                                Your Journey
                            </h1>
                            <p className="text-gray-500">Track your meditation sessions and growth</p>
                        </div>
                    </div>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by topic or content..."
                    />
                </div>

                <div className="mb-8">
                    <FilterPanel
                        selectedType={filterType}
                        onSelectType={setFilterType}
                    />
                </div>

                <SessionList
                    sessions={sessions}
                    isLoading={loading}
                    error={error}
                    onDeleteSession={handleDeleteSession}
                />
            </div>
        </div>
    );
};

export default History;
