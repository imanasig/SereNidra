import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Send, Sparkles, User, Coffee, Globe, Heart } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        setTimeout(() => {
            setStatus('sent');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-grow pt-28 pb-12">
                <div className="container mx-auto px-6">

                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 border border-violet-100 dark:border-violet-900/50 text-violet-700 dark:text-violet-400 font-medium text-sm mb-6 shadow-sm">
                            <MessageSquare className="h-4 w-4" />
                            <span>Get in Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Let's Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">Something Magical</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Have a collaborative idea, a suggestion for the app, or just want to say hi?
                            We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                        {/* Vision & Mission Column */}
                        <div className="space-y-8 animate-fade-in-up animation-delay-200">
                            {/* Creator Card */}
                            <div className="bg-white/60 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300 dark:hover:border-white/50 dark:hover:shadow-white/10">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-violet-100 to-transparent dark:from-violet-900/30 rounded-full opacity-50 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    The Vision
                                </h3>

                                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <p>
                                        Hi, I'm <span className="font-semibold text-gray-900 dark:text-white">Manasi Gaikwad</span>.
                                        I created SereNidra with a simple but powerful belief:
                                        <span className="italic text-violet-700 dark:text-violet-400 font-medium"> everyone deserves a peaceful mind.</span>
                                    </p>
                                    <p>
                                        In a world that never stops, finding a moment of true rest can feel impossible.
                                        My mission is to use technology not to distract, but to heal—creating
                                        personalized sanctuaries of sound that help you reconnect with yourself.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <Globe className="h-4 w-4" />
                                        <span>Open for Collaborations</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <Coffee className="h-4 w-4" />
                                        <span>Always Learning</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info / Socials Placeholder */}
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                                    <p className="text-violet-100 mb-6">Follow our journey and stay updated with the latest in mindful tech.</p>

                                    <div className="flex gap-4">
                                        {/* Social placeholders */}
                                        <button className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
                                            <Globe className="h-5 w-5" />
                                        </button>
                                        <button className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Column */}
                        <div className="lg:pl-8 animate-fade-in-up animation-delay-400">
                            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"></div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 transition-colors">Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 transition-colors">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 transition-colors">Message</label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="block w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none resize-none"
                                            placeholder="Tell us about your project or idea..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending' || status === 'sent'}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2
                                            ${status === 'sent'
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-gray-900 hover:bg-black hover:-translate-y-1 dark:bg-violet-600 dark:hover:bg-violet-700'
                                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {status === 'sending' ? (
                                            <span className="animate-pulse">Sending...</span>
                                        ) : status === 'sent' ? (
                                            <>
                                                <Heart className="h-5 w-5 animate-bounce" />
                                                Message Sent!
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
