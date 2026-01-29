import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MeditationGenerator from '../components/MeditationGenerator';
import SessionHistory from '../components/SessionHistory';

const Dashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col transition-colors duration-300 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="inline-block">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">{currentUser?.email?.split('@')[0]}</span>!
                            </h1>
                            <div className="h-1.5 w-1/3 bg-gradient-to-r from-violet-200 to-transparent rounded-full mt-2"></div>
                        </div>

                        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl">
                            Ready to reclaim your calm? Create a new session or revisit your favorites below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <MeditationGenerator />
                        </div>
                        <div className="lg:col-span-1 h-full">
                            <SessionHistory />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
