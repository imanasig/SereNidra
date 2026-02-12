import { useNavigate } from 'react-router-dom';
import SessionCard from './SessionCard';
import { History, Loader2, AlertCircle } from 'lucide-react';

const SessionHistory = ({ sessions = [], loading = false, error = null }) => {
    const navigate = useNavigate();

    // Internal fetching logic removed. Data is now passed via props.

    return (
        <div className="rounded-[2rem] p-5 border border-white/60 dark:border-gray-700 bg-gradient-to-br from-white via-purple-50/50 to-purple-100/50 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 backdrop-blur-xl h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 dark:hover:border-white/50 dark:hover:shadow-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-violet-600" />
                    Recent Sessions
                </h3>
                <button
                    onClick={() => navigate('/history')}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar">
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
                    <SessionCard key={session.id} session={session} compact={true} />
                ))}
            </div>
        </div>
    );
};

export default SessionHistory;
