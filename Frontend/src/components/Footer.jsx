import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="col-span-1">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400">
                            SereNidra
                        </span>
                        <p className="mt-6 text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                            Helping you find peace and tranquility through AI-generated sleep meditations. Rest better, live better.
                        </p>
                    </div>
                    <div>
                        {/* Spacer */}
                    </div>
                    <div className="text-left md:text-right">
                        {/* You could put social links or newsletter here, keeping it simple for now as requested */}
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase">Navigate</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="/about" className="text-base text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-base text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} SereNidra. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 md:mt-0">
                        <span>Crafted with</span>
                        <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
                        <span>for your sweet dreams.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
