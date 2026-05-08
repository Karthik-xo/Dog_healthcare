import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, HeartPulse, CheckCircle } from 'lucide-react';


import API_URL from '@/config.js';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (formData.password.length < 3) {
            setError('Password must be at least 3 characters.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error: Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        'Track vaccinations and medical records',
        'Schedule appointments with ease',
        'Get health alerts and reminders',
        'Manage multiple pets in one place',
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Premium Image Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                {/* Full un-tinted image */}
                <div className="absolute inset-0 bg-[url('/image/dog3.png')] bg-cover bg-center"></div>
                {/* Deep dark gradient at the bottom to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
                    <Link to="/" className="flex items-center gap-3 text-white drop-shadow-md">
                        <HeartPulse size={36} className="text-green-400" />
                        <span className="text-2xl font-bold tracking-tight">Jimmie HealthCare</span>
                    </Link>

                    <div className="space-y-8 mt-auto mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl xl:text-5xl font-extrabold text-white leading-tight drop-shadow-lg"
                        >
                            Join the best<br />pet care platform
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            {features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-200 drop-shadow-md">
                                    <CheckCircle size={20} className="text-green-400 shrink-0" />
                                    <span className="text-base font-medium">{feat}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <p className="text-slate-400 text-sm">&copy; 2026 Jimmie HealthCare. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-6"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 text-green-600 justify-center mb-2">
                        <HeartPulse size={32} />
                        <span className="text-2xl font-bold tracking-tight">Jimmie HealthCare</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create account</h2>
                        <p className="text-slate-500 mt-2">Start managing your pet's health today</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                                <input name="username" type="text" required autoComplete="username" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" placeholder="johndoe" value={formData.username} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                                <select name="role" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm appearance-none cursor-pointer" value={formData.role} onChange={handleChange}>
                                    <option value="user">Pet Owner</option>
                                    <option value="worker">Clinic Worker</option>
                                    <option value="supervisor">Supervisor</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <input name="email" type="email" required autoComplete="email" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:flex sm:gap-4 w-full">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input name="password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm pr-10" placeholder="••••••" value={formData.password} onChange={handleChange} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                <input name="confirmPassword" type="password" required autoComplete="new-password" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" placeholder="••••••" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-600 pt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition">
                            Sign in instead
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
