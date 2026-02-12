import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MeditationDetail from '../components/MeditationDetail';
import ScriptView from '../components/ScriptView';
import ConfirmationModal from '../components/ConfirmationModal';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const MeditationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meditations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error('Meditation session not found');
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch session details');
                }

                const data = await response.json();
                console.log("Session Details API Response:", data); // Debug log
                setSession(data);
            } catch (err) {
                console.error("Error fetching session:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id, currentUser]);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meditations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete session');
            }

            // Redirect to history on success
            navigate('/history');
        } catch (err) {
            console.error("Error deleting session:", err);
            alert("Failed to delete session. Please try again.");
        } finally {
            setDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex justify-center items-center h-[80vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-violet-600" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="container mx-auto px-6 py-12 text-center">
                    <div className="bg-rose-50 text-rose-600 p-6 rounded-3xl inline-flex flex-col items-center gap-4 max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12" />
                        <h3 className="text-xl font-bold">Error Loading Session</h3>
                        <p>{error}</p>
                        <button
                            onClick={() => navigate('/history')}
                            className="bg-rose-200 hover:bg-rose-300 text-rose-800 px-6 py-2 rounded-xl transition-colors font-semibold"
                        >
                            Return to History
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navbar />

            <div className="w-full max-w-[95%] mx-auto px-4 pt-28 pb-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                            Session Details
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Review your personalized meditation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <MeditationDetail session={session} onSessionUpdate={setSession} />
                    </div>

                    {/* Right Column: Script */}
                    <div className="lg:col-span-2 h-[calc(100vh-140px)] min-h-[500px]">
                        <ScriptView script={session.script} onDelete={handleDeleteClick} />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Session?"
                message="Are you sure you want to delete this meditation session? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
};

export default MeditationDetailsPage;
