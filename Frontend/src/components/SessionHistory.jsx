import SessionCard from './SessionCard';
import { History } from 'lucide-react';

const SessionHistory = () => {
    // Placeholder data - in a real app this would come from the backend
    const sessions = [
        { id: 1, title: 'Deep Sleep Journey', date: 'Oct 24, 2023', duration: '20 min', type: 'Sleep' },
        { id: 2, title: 'Morning Clarity', date: 'Oct 23, 2023', duration: '10 min', type: 'Focus' },
        { id: 3, title: 'Anxiety Relief', date: 'Oct 21, 2023', duration: '15 min', type: 'Relaxation' },
    ];

    return (
        <div className="glass rounded-3xl p-8 border border-white/20 dark:border-gray-800/30 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-violet-600" />
                    Recent Sessions
                </h3>
                <button className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {sessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 text-center">
                <p className="text-xs text-gray-400">
                    Your recent meditation history will appear here.
                </p>
            </div>
        </div>
    );
};

export default SessionHistory;
