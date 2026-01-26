import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                alert('Signup Successful!');
                setIsSubmitting(false);
                setFormData({ fullName: '', email: '', password: '' });
            }, 1000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600"></div>

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                        Create Account
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        Join SereNidra and start your journey to better sleep.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.fullName ? 'border-rose-500 ring-rose-200' : 'border-gray-200 dark:border-gray-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-4 transition-all duration-200 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.fullName && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-rose-500 ring-rose-200' : 'border-gray-200 dark:border-gray-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-4 transition-all duration-200 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-rose-500 ring-rose-200' : 'border-gray-200 dark:border-gray-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-4 transition-all duration-200 sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transform transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating Account...' : (
                            <>
                                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
