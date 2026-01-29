import { useState, useRef } from 'react';
import { Copy, Check, Download, FileText, Feather, Sparkles, Trash2 } from 'lucide-react';

const ScriptView = ({ script, onDelete }) => {
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

    const handleDownloadTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([script], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "meditation-script.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDownloadDoc = () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Meditation Script</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + script.replace(/\n/g, "<br>") + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'meditation-script.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    // Clean up script: remove excessive newlines and spaces around markers
    const processScript = (text) => {
        return text
            // Replace multiple newlines with a single newline
            .replace(/\n{3,}/g, '\n\n')
            // Remove text newlines immediately surrounding PAUSE markers to let block layout handle it
            .replace(/\n\s*(\[.*?\])\s*\n/g, '$1')
            .replace(/\n\s*(\[.*?\])/g, '$1')
            .replace(/(\[.*?\])\s*\n/g, '$1');
    };

    const processedScript = processScript(script);

    return (
        <div className="glass rounded-3xl p-1 border border-white/20 dark:border-gray-800/30 relative overflow-hidden group h-full">
            {/* Decorative background elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-600 rounded-3xl opacity-10 group-hover:opacity-20 transition duration-500 blur"></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-[22px] overflow-hidden h-full flex flex-col">
                {/* Header ToolBar */}
                <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                        <Feather className="h-5 w-5" />
                        <h3 className="text-lg font-bold">Meditation Script</h3>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-violet-50 text-gray-500 hover:text-violet-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-violet-100"
                            title="Copy to Clipboard"
                        >
                            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        <button
                            onClick={handleDownloadTxt}
                            className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-blue-100"
                            title="Download as TXT"
                        >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">TXT</span>
                        </button>

                        <button
                            onClick={handleDownloadDoc}
                            className="p-2 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-indigo-100"
                            title="Download as DOC"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">DOC</span>
                        </button>

                        {onDelete && (
                            <>
                                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                <button
                                    onClick={onDelete}
                                    className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-rose-100"
                                    title="Delete Session"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Delete</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Script Content */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 md:p-12 bg-dots-pattern">
                    <div
                        ref={contentRef}
                        className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none font-serif leading-loose text-gray-700 dark:text-gray-300 whitespace-pre-wrap selection:bg-violet-100 selection:text-violet-900"
                    >
                        {processedScript.split(/(\*\*.*?\*\*|\[.*?\])/).map((part, index) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={index} className="text-violet-700 dark:text-violet-400 font-bold bg-violet-50 dark:bg-violet-900/20 px-1 rounded mx-1">{part.slice(2, -2)}</strong>;
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
                    {/* Footer Decoration */}
                    <div className="h-2 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 opacity-20 mt-12 mb-4 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ScriptView;
