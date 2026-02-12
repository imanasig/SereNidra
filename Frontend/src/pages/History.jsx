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
            console.log("Fetching history with token:", token ? "Present" : "Missing");

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

            const url = `${import.meta.env.VITE_API_BASE_URL}/api/meditations/search?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                console.error("Unauthorized access. Redirecting to login.");
                // Optional: navigate('/login') if you want to force it
                setError("Session expired. Please log in again.");
                return;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("Fetch error details:", errData);
                throw new Error(errData.detail || 'Failed to fetch sessions');
            }

            const data = await response.json();
            console.log("History API Response:", data); // Debug log

            // Robust parsing: handle both wrapped search results and raw session lists
            let extractedSessions = [];
            if (Array.isArray(data)) {
                extractedSessions = data.map(item => {
                    // Check if it's a search wrapper (has .session property)
                    if (item.session && item.match_info) {
                        return item.session;
                    }
                    // Otherwise assume it's a raw session object
                    return item;
                });
            } else {
                console.error("Unexpected API response format (not an array)", data);
                setError("Received invalid data from server");
                return;
            }

            // Filter out any null/undefined items to prevent rendering crashes
            const validSessions = extractedSessions.filter(item => item && typeof item === 'object');

            console.log("Filtered Valid Sessions:", validSessions.length);
            setSessions(validSessions);
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meditations/${sessionId}`, {
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 left-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200/50 dark:border-gray-800/50 pb-8 animate-fade-in-up">
                    <div className="flex items-center gap-5">
                        <Link to="/dashboard" className="p-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md rounded-2xl transition-all text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 border border-gray-100 dark:border-gray-700">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400 mb-2">
                                Your Journey
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">Track your growth and revisit your favorite sessions</p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto min-w-[300px]">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search history..."
                        />
                    </div>
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
