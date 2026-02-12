import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Brain, Wind, ArrowRight, Moon, Sun, Cloud, Zap, Clock, Activity, Smartphone } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-grow pt-28 pb-12">
                {/* Hero Section - Compact */}
                <div className="container mx-auto px-6 mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 border border-violet-100 dark:border-violet-900/50 text-violet-700 dark:text-violet-400 font-medium text-sm mb-6 animate-fade-in shadow-sm hover:scale-105 transition-transform">
                        <Sparkles className="h-4 w-4" />
                        <span>About SereNidra</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
                        Your Companion for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                            Mindful Rest & Inner Balance
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                        We built this app to help you reclaim calm in a chaotic world, using thoughtfully
                        designed audio experiences and wellness tools backed by science and emotion.
                    </p>
                </div>

                {/* Mission Grid (Colorful Blended Cards) */}
                <div className="container mx-auto px-6 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative p-6 rounded-3xl border border-rose-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default bg-gradient-to-br from-white via-rose-50 to-rose-100 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 backdrop-blur-xl overflow-hidden dark:hover:border-white/50 dark:hover:shadow-white/10">
                            <div className="relative z-10">
                                <div className="bg-white dark:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-rose-100 dark:ring-rose-800 group-hover:scale-110 transition-transform">
                                    <Heart className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">Our Mission</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                    To combat the global sleep crisis by making high-quality, personalized
                                    meditation accessible to everyone, everywhere, at any time.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 rounded-3xl border border-violet-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default bg-gradient-to-br from-white via-violet-50 to-violet-100 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 backdrop-blur-xl overflow-hidden dark:hover:border-white/50 dark:hover:shadow-white/10">
                            <div className="relative z-10">
                                <div className="bg-white dark:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-violet-600 dark:text-violet-400 shadow-sm ring-1 ring-violet-100 dark:ring-violet-800 group-hover:scale-110 transition-transform">
                                    <Brain className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">The Technology</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                    Powered by advanced Generative AI, SereNidra crafts unique scripts,
                                    voices, and ambiances tailored tailored specifically to your current mood.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 rounded-3xl border border-teal-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default bg-gradient-to-br from-white via-teal-50 to-teal-100 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 backdrop-blur-xl overflow-hidden dark:hover:border-white/50 dark:hover:shadow-white/10">
                            <div className="relative z-10">
                                <div className="bg-white dark:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-teal-600 dark:text-teal-400 shadow-sm ring-1 ring-teal-100 dark:ring-teal-800 group-hover:scale-110 transition-transform">
                                    <Wind className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">The Experience</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                    No two sessions are alike. Whether you need stress relief, focus,
                                    or deep sleep, we generate a fresh, soothing journey just for you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Meaning Section - Richer Gradient */}
                <div className="container mx-auto px-6 mb-16">
                    <div className="rounded-[2.5rem] p-8 md:p-10 border border-white/60 dark:border-gray-700 shadow-xl relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100/80 dark:from-gray-800 dark:via-gray-800/80 dark:to-violet-900/20 backdrop-blur-xl">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why "SereNidra"?</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-4xl mx-auto">
                                <div className="group text-center p-6 rounded-3xl bg-gradient-to-br from-white to-violet-50 dark:from-gray-700 dark:to-gray-700/50 border border-violet-100 dark:border-gray-600 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 mb-3 group-hover:scale-105 transition-transform duration-300 inline-block">Sere</h3>
                                    <div className="h-1.5 w-12 bg-violet-200 dark:bg-violet-700 mx-auto rounded-full mb-4 group-hover:w-20 group-hover:bg-violet-400 transition-all duration-300"></div>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Serenity</p>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">A state of deep calm and inner peace.</p>
                                </div>

                                <div className="group text-center p-6 rounded-3xl bg-gradient-to-br from-white to-pink-50 dark:from-gray-700 dark:to-gray-700/50 border border-pink-100 dark:border-gray-600 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600 dark:from-fuchsia-400 dark:to-pink-400 mb-3 group-hover:scale-105 transition-transform duration-300 inline-block">Nidra</h3>
                                    <div className="h-1.5 w-12 bg-pink-200 dark:bg-pink-700 mx-auto rounded-full mb-4 group-hover:w-20 group-hover:bg-pink-400 transition-all duration-300"></div>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Sleep</p>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">Restorative rest for mind and body.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Helps You - Features Grid - Clearly Tinted Cards */}
                <div className="container mx-auto px-6 mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Helps You</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                icon: Sparkles,
                                color: "text-indigo-600 dark:text-indigo-400",
                                borderHover: "hover:border-indigo-300 dark:hover:border-indigo-700",
                                gradient: "from-white to-indigo-100 dark:from-gray-800/80 dark:to-indigo-900/30",
                                title: "Personalized",
                                desc: "Uniquely made for your needs — whether it's sleep, stress relief, or relaxation."
                            },
                            {
                                icon: Activity,
                                color: "text-blue-600 dark:text-blue-400",
                                borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
                                gradient: "from-white to-blue-100 dark:from-gray-800/80 dark:to-blue-900/30",
                                title: "Science-backed",
                                desc: "Using frequencies and patterns known to support sleep and relaxation."
                            },
                            {
                                icon: Smartphone,
                                color: "text-amber-600 dark:text-amber-400",
                                borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
                                gradient: "from-white to-amber-100 dark:from-gray-800/80 dark:to-amber-900/30",
                                title: "Simple & Easy",
                                desc: "No complexity. Just peace in the palm of your hand. Built for everyone."
                            },
                            {
                                icon: Clock,
                                color: "text-emerald-600 dark:text-emerald-400",
                                borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
                                gradient: "from-white to-emerald-100 dark:from-gray-800 dark:to-emerald-900/30",
                                title: "Anytime, Anywhere",
                                desc: "Perfect before bedtime, during breaks, or whenever you need grounding."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className={`relative p-6 rounded-3xl border border-white/60 dark:border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group ${feature.borderHover} bg-gradient-to-br ${feature.gradient} backdrop-blur-md overflow-hidden dark:hover:border-white/50 dark:hover:shadow-white/10`}>
                                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Philosophy Quote - Lighter, Compact & Catchy */}
                <div className="container mx-auto px-6 mb-12">
                    <div className="relative group rounded-[2rem] bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 p-0.5 hover:scale-[1.01] transition-transform duration-500 shadow-xl max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-800/90 dark:via-gray-800 dark:to-gray-800/90 rounded-[1.9rem] p-8 md:p-10 text-center relative overflow-hidden">

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-fuchsia-700 dark:from-violet-400 dark:to-fuchsia-400 leading-tight drop-shadow-sm mb-4">
                                    "Rest is not a luxury.<br />
                                    It’s an essential part of well-being."
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-lg mx-auto leading-relaxed">
                                    Everyone deserves a space to breathe, relax, and fully rest.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA - Connected */}
                <div className="container mx-auto px-6 text-center pb-8 animate-fade-in-up">
                    <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-6">Start Your Journey Today</p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-10 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-black hover:scale-105 transition-all shadow-lg text-lg group"
                    >
                        Let’s Build Calm Together
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
