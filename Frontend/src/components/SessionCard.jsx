import { Calendar, Clock, Sparkles, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session, onDelete }) => {
    // Format date
    const dateString = session.created_at.endsWith('Z') ? session.created_at : session.created_at + 'Z';
    const date = new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Truncate script for preview (approx 100 chars)
    const preview = session.script.length > 150
        ? session.script.substring(0, 150) + "..."
        : session.script;

    const handleDeleteClick = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Standard stop propagation
        onDelete(session.id);
    };

    return (
        <Link to={`/session/${session.id}`} className="block">
            <div className="glass rounded-2xl p-6 border border-gray-200 hover:border-violet-200 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/80 transition-all duration-300 group cursor-pointer flex flex-col relative h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 capitalize">{session.type.replace('-', ' ')}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {session.duration} min
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {onDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Session"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {preview}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-400 capitalize px-2 py-1 bg-gray-50 rounded-lg">
                        {session.tone || 'Standard'} Voice
                    </span>
                    <span className="text-sm font-semibold text-violet-600 group-hover:translate-x-1 transition-transform">
                        View Script &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default SessionCard;
