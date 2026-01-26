import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 pt-32 pb-32 space-y-24 min-h-screen flex items-center">
            <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
                            <span className="block">Find Your Inner Calm</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400 mt-2">
                                Before You Sleep
                            </span>
                        </h1>
                        <p className="mt-8 text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                            Welcome to <span className="font-semibold text-violet-600 dark:text-violet-400">SereNidra</span>. Generate personalized sleep meditations tailored to your needs. Relax, unwind, and drift into a peaceful slumber.
                        </p>
                        <div className="mt-12 flex justify-center gap-6 animate-fade-in-up animation-delay-400">
                            <Link
                                to="/signup"
                                className="px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full transition-all shadow-lg hover:shadow-violet-500/50 transform hover:-translate-y-1 hover:scale-105"
                            >
                                Start Sleeping Better
                            </Link>
                            <Link
                                to="/about"
                                className="px-10 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-full transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-300/30 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default Hero;
