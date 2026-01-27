import Navbar from '../components/Navbar';
import SessionList from '../components/SessionList';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-600">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                            Your Journey
                        </h1>
                        <p className="text-gray-500">Track your meditation sessions and growth</p>
                    </div>
                </div>

                <SessionList />
            </div>
        </div>
    );
};

export default History;
