import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MeditationGenerator from '../components/MeditationGenerator';
import SessionHistory from '../components/SessionHistory';

const Dashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">{currentUser?.email?.split('@')[0]}</span>!
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Ready to create your next perfect sleep session?
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
