import { Moon, Music, History, Sliders } from 'lucide-react';

const FEATURE_LIST = [
    {
        icon: <Sliders className="w-8 h-8 text-white" />,
        title: 'Personalized Scripts',
        description: 'Customize your meditation experience with adjustable parameters for length, topic, and guidance style.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        icon: <Music className="w-8 h-8 text-white" />,
        title: 'Soothing Audio',
        description: 'Choose from a variety of background sounds and ambient music to enhance your relaxation.',
        gradient: 'from-violet-500 to-purple-500'
    },
    {
        icon: <Moon className="w-8 h-8 text-white" />,
        title: 'Sleep Focused',
        description: 'Specifically designed techniques to help specific sleep issues like insomnia or racing thoughts.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: <History className="w-8 h-8 text-white" />,
        title: 'Session History',
        description: 'Keep track of your favorite sessions and see your meditation journey over time.',
        gradient: 'from-amber-500 to-orange-500'
    }
];

const Features = () => {
    return (
        <div id="features" className="bg-gray-50 dark:bg-gray-900 py-32 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-lg text-violet-600 dark:text-violet-400 font-bold tracking-wide uppercase mb-3">Why SereNidra?</h2>
                    <p className="mt-2 text-4xl leading-10 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Everything you need for better sleep
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Our AI-driven platform crafts the perfect meditation to help you fall asleep faster and stay asleep longer.
                    </p>
                </div>

                <div className="mt-24">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURE_LIST.map((feature, index) => (
                            <div key={index} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-violet-200 to-fuchsia-200 dark:from-violet-900/40 dark:to-fuchsia-900/40 -z-10 transform group-hover:scale-110"></div>
                                <div className="h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-6 pb-8 pt-10 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="-mt-16 mb-6">
                                        <span className={`inline-flex items-center justify-center p-4 rounded-2xl shadow-lg bg-gradient-to-br ${feature.gradient} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            {feature.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{feature.title}</h3>
                                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
