import { useRef, useState } from 'react';
import { Download, RotateCcw, Copy, Check, Sparkles, Feather } from 'lucide-react';

const ScriptDisplay = ({ script, onReset }) => {
    const [copied, setCopied] = useState(false);
    const contentRef = useRef(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([script], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "meditation-script.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up">

            {/* Header Section */}
            <div className="text-center mb-12 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl -z-10 animate-blob"></div>
                <div className="inline-flex items-center justify-center p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4">
                    <Sparkles className="h-5 w-5 text-violet-500 mr-2" />
                    <span className="text-sm font-semibold text-violet-600 tracking-wide uppercase">Script Ready</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight font-display">
                    Your Personal Sanctuary
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                    A custom meditation crafted just for you. Take a moment to read through, or save it for your practice.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="relative group">
                {/* Enhanced Gradient Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl opacity-30 group-hover:opacity-40 blur-2xl transition duration-500"></div>

                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/60 dark:border-gray-700/60 hover:shadow-violet-500/20 dark:hover:shadow-violet-500/10 transition-all">

                    {/* Toolbar */}
                    <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Feather className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Generated Content</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCopy}
                                className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-md"
                                title="Copy to Clipboard"
                            >
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                <span className="text-sm font-semibold hidden sm:block">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-md"
                                title="Download Text"
                            >
                                <Download className="h-4 w-4" />
                                <span className="text-sm font-semibold hidden sm:block">Download</span>
                            </button>
                        </div>
                    </div>

                    {/* Script Content */}
                    <div className="p-8 md:p-12 max-h-[70vh] overflow-y-auto custom-scrollbar bg-dots-pattern">
                        <div
                            ref={contentRef}
                            className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none font-serif leading-loose text-gray-700 dark:text-gray-300 whitespace-pre-wrap selection:bg-violet-100 selection:text-violet-900"
                        >
                            {script
                                // Logic to process script for better spacing
                                .replace(/\n{3,}/g, '\n\n')
                                .replace(/\n\s*(\[.*?\])\s*\n/g, '$1')
                                .replace(/\n\s*(\[.*?\])/g, '$1')
                                .replace(/(\[.*?\])\s*\n/g, '$1')

                                .split(/(\*\*.*?\*\*|\[.*?\])/).map((part, index) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={index} className="text-violet-700 dark:text-violet-400 font-bold">{part.slice(2, -2)}</strong>;
                                    }
                                    if (part.startsWith('[') && part.endsWith(']')) {
                                        return (
                                            <div key={index} className="my-1.5 flex justify-start">
                                                <span className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 select-none shadow-md shadow-amber-500/20 cursor-default hover:scale-105 transition-transform">
                                                    <Sparkles className="w-3.5 h-3.5 mr-2 opacity-80" />
                                                    {part.slice(1, -1)}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return part;
                                })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Generated with SereNidra AI
                        </div>
                        <button
                            onClick={onReset}
                            className="group/reset flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 active:scale-95"
                        >
                            <RotateCcw className="h-4 w-4 group-hover/reset:rotate-180 transition-transform duration-500" />
                            Create Another
                        </button>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="mt-12 opacity-50 text-center">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto rounded-full"></div>
            </div>
        </div>
    );
};

export default ScriptDisplay;
