import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        if (validate()) {
            setIsSubmitting(true);
            try {
                await login(formData.email, formData.password);
                navigate('/dashboard');
            } catch (error) {
                console.error("Login Error:", error);
                let errorMessage = 'Failed to log in. Please check your credentials.';

                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed attempts. Please try again later.';
                }

                setAuthError(errorMessage);
                setIsSubmitting(false);
            }
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
        if (authError) setAuthError('');
    };

    return (
        <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600"></div>

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        Login to continue your journey to better sleep.
                    </p>
                </div>

                {authError && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl flex items-start space-x-3 animate-fade-in">
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-rose-600 dark:text-rose-400">{authError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <a href="#" className="text-xs font-medium text-violet-600 hover:text-violet-500 transition-colors">Forgot Password?</a>
                        </div>
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
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transform transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                Logging In...
                            </>
                        ) : (
                            <>
                                Login <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
