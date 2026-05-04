import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, HeartPulse, User, HelpCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '', newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState('login'); // 'login' or 'forgot'
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [googleView, setGoogleView] = useState('picker'); // 'picker', 'input', or 'password'
    const [googleEmail, setGoogleEmail] = useState('');
    const [googlePassword, setGooglePassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ ...data.user }));

                setIsSuccess(true);
                setTimeout(() => navigate('/'), 1800);
            } else {
                setStatus({ type: 'error', message: data.message || 'Invalid username or password.' });
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Network error: Could not connect to the server.' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Password updated! Please sign in.' });
                setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
                setTimeout(() => navigate('/'), 2000);
            } else {
                setStatus({ type: 'error', message: data.message || 'Reset failed.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSelect = (account) => {
        setLoading(true);
        setTimeout(() => {
            const userName = account.name || (account.email ? account.email.split('@')[0] : 'Google User');
            localStorage.setItem('token', 'mock-google-token');
            localStorage.setItem('user', JSON.stringify({
                username: userName,
                fullName: account.name || userName,
                email: account.email || 'user@gmail.com',
                role: 'user',
                profilePic: account.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
            }));
            setLoading(false);
            setShowGoogleAuth(false);
            setGoogleView('picker');
            setGoogleEmail('');
            setGooglePassword('');
            setIsSuccess(true);
            setTimeout(() => navigate('/'), 1800);
        }, 1500);
    };

    const [googleStatus, setGoogleStatus] = useState('');

    const closeGoogleAuth = () => {
        setShowGoogleAuth(false);
        setGoogleStatus('');
        setTimeout(() => {
            setGoogleView('picker');
            setGoogleEmail('');
            setGooglePassword('');
        }, 300);
    };

    return (
        <div className="min-h-screen flex">
            {/* Premium Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="text-center p-8 rounded-3xl"
                        >
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <svg className="w-full h-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 bg-green-500/10 rounded-full"
                                />
                            </div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold text-white mb-2"
                            >
                                Sign-in Successful
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-slate-400"
                            >
                                Redirecting you home...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Panel - Premium Image Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                {/* Full un-tinted image */}
                <div className="absolute inset-0 bg-[url('/image/dog2.jpg')] bg-cover bg-center"></div>
                {/* Deep dark gradient at the bottom to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
                    <Link to="/" className="flex items-center gap-3 text-white drop-shadow-md">
                        <HeartPulse size={36} className="text-green-400" />
                        <span className="text-2xl font-bold tracking-tight">Jimmie HealthCare</span>
                    </Link>

                    <div className="space-y-6 mt-auto mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl xl:text-5xl font-extrabold text-white leading-tight drop-shadow-lg"
                        >
                            Welcome back to<br />your pet's health hub
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-200 text-lg max-w-md leading-relaxed drop-shadow-md"
                        >
                            Manage vaccinations, appointments, and medical records — all in one place.
                        </motion.p>
                    </div>

                    <p className="text-slate-400 text-sm">&copy; 2026 Jimmie HealthCare. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 text-green-600 justify-center mb-4">
                        <HeartPulse size={32} />
                        <span className="text-2xl font-bold tracking-tight">Jimmie HealthCare</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {view === 'login' ? 'Sign in' : 'Reset Password'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {view === 'login'
                                ? 'Enter your credentials to access your dashboard'
                                : 'Update your credentials for secure access'}
                        </p>
                    </div>

                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'} border text-sm px-4 py-3.5 rounded-2xl flex items-center gap-3 font-medium`}
                        >
                            <div className={`w-1.5 h-full absolute left-0 top-0 bottom-0 rounded-l-2xl ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {status.message}
                        </motion.div>
                    )}

                    {view === 'login' ? (
                        <>
                            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                                        placeholder="e.g. admin"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot')}
                                            className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm pr-12"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <LogIn size={18} />
                                            Sign In
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest font-black"><span className="px-4 bg-white text-slate-300 italic">Security Authentication</span></div>
                            </div>

                            <button
                                onClick={() => setShowGoogleAuth(true)}
                                className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-3 text-sm hover:bg-slate-50 shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </>
                    ) : (
                        <form className="space-y-5" onSubmit={handleResetPassword}>
                            <div>
                                <label htmlFor="reset-username" className="block text-sm font-semibold text-slate-700 mb-2">Target Username</label>
                                <input
                                    id="reset-username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                                    placeholder="Min. 8 characters"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                                    placeholder="Must match password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-green-500/20 text-sm"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition">
                            Create one for free
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Mock Google Auth Modal */}
            <AnimatePresence>
                {showGoogleAuth && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={closeGoogleAuth}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-[400px] bg-white rounded-[1.5rem] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 pb-4 flex flex-col items-center">
                                <div className="w-12 h-12 mb-6 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-full h-full">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-medium text-slate-900 tracking-tight">
                                    {googleView === 'picker' ? 'Choose an account' : 'Sign in'}
                                </h3>
                                <p className="text-slate-600 text-sm mt-3">
                                    to continue to <span className="font-bold text-green-600">Jimmie HealthCare</span>
                                </p>
                            </div>

                            <div className="relative min-h-[300px]">
                                <AnimatePresence mode="wait">
                                    {googleView === 'picker' ? (
                                        <motion.div
                                            key="picker"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-8 pt-6 space-y-2"
                                        >
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => handleGoogleSelect({
                                                        name: 'Medical Administrator',
                                                        email: 'admin@jimmiehealthcare.com',
                                                        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop'
                                                    })}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition border border-slate-100 group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-50 shadow-sm bg-slate-100 flex items-center justify-center relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=100&auto=format&fit=crop"
                                                                alt="Admin"
                                                                className="w-full h-full object-cover z-10"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                            <User size={20} className="absolute text-slate-300" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-slate-800">Medical Administrator</p>
                                                            <p className="text-xs text-slate-500 font-medium">admin@jimmiehealthcare.com</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-green-100">Signed In</div>
                                                </button>

                                                <button
                                                    onClick={() => handleGoogleSelect({
                                                        name: 'Dr. Sophia Martinez',
                                                        email: 'sophia.m@jimmiehealthcare.com',
                                                        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop'
                                                    })}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition border border-slate-100 group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-50 shadow-sm bg-slate-100 flex items-center justify-center relative">
                                                            <img
                                                                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=100&auto=format&fit=crop"
                                                                alt="Supervisor"
                                                                className="w-full h-full object-cover z-10"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                            <User size={20} className="absolute text-slate-300" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-slate-800">Dr. Sophia Martinez</p>
                                                            <p className="text-xs text-slate-500 font-medium">sophia.m@jimmiehealthcare.com</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-blue-100">Staff</div>
                                                </button>



                                                <button
                                                    onClick={() => setGoogleView('input')}
                                                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition border border-transparent group"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition border border-slate-100">
                                                        <User size={20} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Use another account</span>
                                                </button>
                                            </div>

                                            <div className="pt-8 text-xs text-slate-500 leading-relaxed">
                                                To continue, Google will share your name, email address, language preference, and profile picture with Jimmie HealthCare. Before using this app, you can review Jimmie HealthCare’s <span className="text-blue-600 font-bold hover:underline cursor-pointer">privacy policy</span> and <span className="text-blue-600 font-bold hover:underline cursor-pointer">terms of service</span>.
                                            </div>
                                        </motion.div>
                                    ) : googleView === 'input' ? (
                                        <motion.form
                                            key="input"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-8 pt-6"
                                            onSubmit={(e) => { e.preventDefault(); setGoogleView('password'); }}
                                        >
                                            <div className="space-y-6">
                                                <div className="relative group">
                                                    <input
                                                        autoFocus
                                                        type="email"
                                                        value={googleEmail}
                                                        onChange={(e) => setGoogleEmail(e.target.value)}
                                                        className="w-full px-4 py-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-slate-900 placeholder:text-transparent peer"
                                                        placeholder="Email or phone"
                                                        id="google-email"
                                                    />
                                                    <label
                                                        htmlFor="google-email"
                                                        className="absolute left-4 top-4 text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
                                                    >
                                                        Email or phone
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setGoogleStatus('To recover your account, please contact Jimmie HealthCare technical support.')}
                                                        className="text-blue-600 text-sm font-bold mt-2 hover:underline inline-block"
                                                    >
                                                        Forgot email?
                                                    </button>
                                                </div>

                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Not your computer? Use Guest mode to sign in privately. <span className="text-blue-600 font-bold hover:underline cursor-pointer">Learn more</span>
                                                </p>

                                                {googleStatus && (
                                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-xs font-medium leading-relaxed">
                                                        {googleStatus}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setGoogleView('picker')}
                                                        className="text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded transition"
                                                    >
                                                        Create account
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={!googleEmail.includes('@') || loading}
                                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-lg font-bold transition shadow-md shadow-blue-600/20"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="password"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-8 pt-6"
                                            onSubmit={(e) => { e.preventDefault(); handleGoogleSelect({ email: googleEmail }); }}
                                        >
                                            <div className="mb-8 flex items-center gap-3 p-2 pr-4 bg-slate-50 border border-slate-100 rounded-full w-fit max-w-full">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                                    <User size={12} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 truncate">{googleEmail}</span>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="relative">
                                                    <input
                                                        autoFocus
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={googlePassword}
                                                        onChange={(e) => setGooglePassword(e.target.value)}
                                                        className="w-full px-4 py-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-slate-900 placeholder:text-transparent peer"
                                                        placeholder="Enter your password"
                                                        id="google-password"
                                                    />
                                                    <label
                                                        htmlFor="google-password"
                                                        className="absolute left-4 top-4 text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
                                                    >
                                                        Enter your password
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-5 text-slate-400 hover:text-slate-600 transition"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>

                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                                    <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition">Show password</span>
                                                </label>

                                                <div className="flex justify-between items-center pt-10">
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded transition"
                                                    >
                                                        Forgot password?
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={googlePassword.length < 3 || loading}
                                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-lg font-bold transition shadow-md shadow-blue-600/20"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-[110]"
                                    >
                                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-ping mb-4 scale-150"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60">Authenticating</p>
                                    </motion.div>
                                )}
                            </div>

                            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <span className="text-[10px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer">Help</span>
                                    <span className="text-[10px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer">Privacy</span>
                                    <span className="text-[10px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer">Terms</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                    <span>English (United States)</span>
                                    <HelpCircle size={10} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
