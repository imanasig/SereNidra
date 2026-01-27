import { Calendar, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session }) => {
    // Format date
    const date = new Date(session.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Truncate script for preview (approx 100 chars)
    const preview = session.script.length > 150
        ? session.script.substring(0, 150) + "..."
        : session.script;

    return (
        <Link to={`/session/${session.id}`} className="block">
            <div className="glass rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
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
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {preview}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
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
