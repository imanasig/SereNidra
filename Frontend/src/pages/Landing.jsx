import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Landing = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
            {/* Global Breathing Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 animate-breathe-slow -z-50 pointer-events-none"></div>

            {/* Interactive Spotlight */}
            <div
                className="fixed w-[800px] h-[800px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-[100px] -z-40 pointer-events-none transition-transform duration-75"
                style={{
                    left: mousePosition.x - 400,
                    top: mousePosition.y - 400,
                }}
            ></div>

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <Features />
                <FAQ />
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
