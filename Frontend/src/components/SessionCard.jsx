import { Calendar, Clock, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session, onDelete, compact = false }) => {
    // Safety check: if session is missing or malformed, don't crash
    if (!session) return null;

    // Helper to get colors based on type
    const getTypeStyles = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('sleep')) return { border: 'group-hover:border-indigo-300', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', gradient: 'from-white to-indigo-50/50' };
        if (t.includes('stress') || t.includes('anxiety')) return { border: 'group-hover:border-teal-300', iconBg: 'bg-teal-100', iconText: 'text-teal-600', gradient: 'from-white to-teal-50/50' };
        if (t.includes('focus')) return { border: 'group-hover:border-amber-300', iconBg: 'bg-amber-100', iconText: 'text-amber-600', gradient: 'from-white to-amber-50/50' };
        return { border: 'group-hover:border-violet-300', iconBg: 'bg-violet-100', iconText: 'text-violet-600', gradient: 'from-white to-violet-50/50' };
    };

    const styles = getTypeStyles(session.type);

    // Format date with fallback
    const createdAt = session.created_at || new Date().toISOString();
    const dateString = typeof createdAt === 'string' && createdAt.endsWith('Z')
        ? createdAt
        : (createdAt + 'Z');

    let date = "Unknown Date";
    try {
        date = new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        console.warn("Invalid date in session:", session);
    }

    // Truncate script for preview (approx 100 chars)
    const scriptText = session.script || "No script content available.";
    const preview = scriptText.length > 120
        ? scriptText.substring(0, 120) + "..."
        : scriptText;

    const typeLabel = session.type ? session.type.replace('-', ' ') : 'Meditation';
    const durationLabel = session.duration || '?';

    const handleDeleteClick = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Standard stop propagation
        onDelete(session.id);
    };

    // List View Mode (Compact but Detailed)
    if (compact) {
        return (
            <Link to={`/session/${session.id}`} className="block group mb-0">
                <div className={`flex items-start gap-4 p-4 rounded-2xl border border-white/40 bg-white/40 hover:bg-white/70 transition-all duration-200 hover:shadow-md ${styles.border}`}>
                    {/* Icon */}
                    <div className={`mt-1 p-2 rounded-xl ${styles.iconBg} ${styles.iconText} shrink-0`}>
                        <Sparkles className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-800 text-sm truncate capitalize">{typeLabel}</h3>
                            <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0 bg-white/50 px-2 py-0.5 rounded-md">{date}</span>
                        </div>

                        {/* Script Snippet - Requested Feature */}
                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 mb-2">
                            {preview}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-400">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {durationLabel}m
                            </span>
                            <span className="w-0.5 h-3 bg-gray-300 rounded-full"></span>
                            <span>{session.tone || 'Standard'} Voice</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className={`self-center ${styles.iconText} opacity-0 group-hover:opacity-100 transition-opacity -ml-1 pl-1`}>
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/session/${session.id}`} className="block h-full">
            <div className={`relative h-full p-6 rounded-[1.5rem] border border-white/60 bg-gradient-to-br ${styles.gradient} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer backdrop-blur-md overflow-hidden ${styles.border}`}>

                {/* Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${styles.iconBg} ${styles.iconText} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 capitalize tracking-tight">{typeLabel}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {durationLabel} min
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {onDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Session"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 relative z-10">
                    {preview}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100/50 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 bg-white/50 rounded-lg">
                        {session.tone || 'Standard'} Voice
                    </span>
                    <span className={`text-xs font-bold ${styles.iconText} flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                        View Details <span className="text-lg leading-none">&rarr;</span>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default SessionCard;
