import { useState } from 'react';
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, toggle, index }) => {
    return (
        <div
            className={`border-b last:border-0 border-gray-100 dark:border-gray-700/50 transition-all duration-300 ${isOpen ? 'bg-white/40 dark:bg-gray-800/40 rounded-2xl border-transparent my-2' : ''}`}
        >
            <button
                onClick={toggle}
                className={`w-full py-5 px-2 flex items-center justify-between gap-4 text-left focus:outline-none group ${isOpen ? 'px-4' : ''} transition-all duration-300`}
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400'}`}>
                    {question}
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 shrink-0 ${isOpen ? 'bg-violet-100 dark:bg-violet-500/20 rotate-180 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-violet-50 dark:group-hover:bg-gray-700'}`}>
                    {isOpen ? (
                        <Minus className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                    ) : (
                        <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-violet-500 dark:group-hover:text-violet-400" />
                    )}
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-2">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0); // Open first one by default for engagement

    const faqs = [
        {
            question: "How is this different from other meditation apps?",
            answer: "Unlike generic apps with static libraries, SereNidra generates personalized scripts in real-time using AI.\nYour mood, preferences, and history shape every unique session."
        },
        {
            question: "How does the AI personalize my meditation?",
            answer: "We analyze your emotional state, health context, and preferred tone before every session.\nThe AI then adapts the pacing, language, and structure to create a relevant, focused experience just for you."
        },
        {
            question: "Why are sessions limited to under 5 minutes?",
            answer: "Consistency beats duration. Research shows short, focused sessions are more effective for habit building.\nMicro-meditations prevent burnout and deliver meaningful results quickly."
        },
        {
            question: "Is this a replacement for therapy?",
            answer: "No. This tool supports relaxation and clarity but is not a substitute for professional healthcare.\nPlease consult a provider for medical or psychological conditions."
        },
        {
            question: "Is my data private and secure?",
            answer: "Yes. Your sessions, mood inputs, and preferences are private and securely stored.\nWe do not share your personal well-being journey."
        },
        {
            question: "How does the audio generation work?",
            answer: "Scripts are converted into natural-sounding speech using advanced AI.\nThe voice tone adapts to your choice (calm, steady, whisper) for a truly immersive experience."
        },
        {
            question: "Why ask for my mood?",
            answer: "Tracking emotional shifts helps measure progress. Comparing how you feel before and after helps you see tangible improvement over time."
        },
        {
            question: "Can I use this with specific health concerns?",
            answer: "Yes. You can select contexts like insomnia or anxiety, and the AI will adjust the tone and pacing to be supportive.\nAlways use this as a complement to your routine, not medical advice."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Dynamic Animated Background - Subtler */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-violet-50/30 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900 -z-30 transition-colors duration-500"></div>

            {/* Moving Gradient Overlay - Very Light */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-fuchsia-200/20 to-indigo-200/20 dark:from-violet-900/10 dark:via-fuchsia-900/10 dark:to-indigo-900/10 animate-gradient-flow blur-3xl -z-20 mix-blend-multiply dark:mix-blend-screen opacity-50"></div>

            {/* Floating Orbs for extra depth - Lighter */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-300/10 dark:bg-violet-500/10 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-300/10 dark:bg-indigo-500/10 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-2000"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 text-violet-700 dark:text-violet-300 font-medium text-sm mb-6 backdrop-blur-md shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 mb-4 drop-shadow-sm">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Everything you need to know about your personalized meditation journey.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-white/80 via-white/60 to-violet-50/50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-indigo-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-violet-500/10 dark:shadow-violet-900/20 border border-white/60 dark:border-white/10 relative overflow-hidden transition-all duration-500 hover:shadow-violet-500/20 dark:hover:shadow-violet-900/30">
                    {/* Glass sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

                    <div className="space-y-2 relative z-10">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                index={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                toggle={() => toggleFAQ(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
