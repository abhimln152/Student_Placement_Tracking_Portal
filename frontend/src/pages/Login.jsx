import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success('Logged in successfully!');
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } else {
            toast.error(result.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-white">Welcome Back</h2>
                    <p className="mt-2 text-center text-sm text-gray-200">
                        Sign in to access your placement dashboard
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="peer appearance-none w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email-address" className="absolute left-4 -top-2.5 bg-transparent px-1 text-xs text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white">Email Address</label>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="peer appearance-none w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password" className="absolute left-4 -top-2.5 bg-transparent px-1 text-xs text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white">Password</label>
                        </div>
                    </div>

                    <div className="text-sm text-center">
                        <p className="text-gray-200">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-white hover:text-indigo-200 transition underline decoration-white/30 hover:decoration-white">
                                Sign up now
                            </Link>
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform transition hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
