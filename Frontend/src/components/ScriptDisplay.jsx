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
                {/* Decorative background elements */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-3xl opacity-20 group-hover:opacity-30 transition duration-500 blur"></div>

                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

                    {/* Toolbar */}
                    <div className="glass px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Feather className="h-5 w-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Generated Content</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCopy}
                                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-gray-200 dark:border-gray-700 hover:border-violet-200"
                                title="Copy to Clipboard"
                            >
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                <span className="text-sm font-medium hidden sm:block">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-gray-200 dark:border-gray-700 hover:border-violet-200"
                                title="Download Text"
                            >
                                <Download className="h-4 w-4" />
                                <span className="text-sm font-medium hidden sm:block">Download</span>
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
                                            <div key={index} className="my-1 flex justify-start">
                                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800 select-none shadow-sm cursor-default">
                                                    <Sparkles className="w-3 h-3 mr-2 opacity-70" />
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
                    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500 italic flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            Generated with SereNidra AI
                        </div>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                            <RotateCcw className="h-4 w-4" />
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
