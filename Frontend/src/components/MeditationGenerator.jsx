import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const MeditationGenerator = () => {
    const navigate = useNavigate();

    return (
        <div className="glass rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-800/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Create New Meditation
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Design a personalized sleep meditation session tailored to your needs using our advanced AI generator.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/generate')}
                    className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 group-hover:translate-x-1"
                >
                    Start Generating
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default MeditationGenerator;
