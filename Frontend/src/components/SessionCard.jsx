import { Play, Calendar, Clock } from 'lucide-react';

const SessionCard = ({ session }) => {
    return (
        <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 hover:border-violet-200 dark:hover:border-violet-800/50 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                        <Play className="h-5 w-5 ml-0.5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {session.title}
                        </h4>
                        <span className="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full">
                            {session.type}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{session.duration}</span>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;
