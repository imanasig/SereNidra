import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const MeditationGenerator = () => {
    const navigate = useNavigate();

    return (
        <div className="relative rounded-[2.5rem] p-8 md:p-10 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/60 dark:border-gray-700 bg-gradient-to-br from-white via-indigo-50/50 to-indigo-100/50 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 backdrop-blur-xl dark:hover:border-white/50 dark:hover:shadow-white/10">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Create New Meditation
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg text-lg">
                        Design a personalized sleep meditation session tailored to your needs using our advanced AI generator.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/generate')}
                    className="w-full sm:w-auto flex items-center justify-center py-4 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-black dark:hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                >
                    Start Generating
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default MeditationGenerator;
