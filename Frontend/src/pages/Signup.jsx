import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignupForm from '../components/SignupForm';

const Signup = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
            </div>

            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <SignupForm />
            </main>

            <Footer />
        </div>
    );
};

export default Signup;
