import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, HeartPulse, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
    ];

    const isAdmin = user && ['admin', 'worker', 'supervisor'].includes(user.role);

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
                            <HeartPulse size={32} className="text-green-500" />
                            <span>Jimmie HealthCare</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                title={`Learn more about Jimmie HealthCare ${link.name}`}
                                className="text-slate-600 hover:text-green-600 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-slate-200 pl-6 ml-2">
                                <Link to="/dashboard/profile" title="View your medical profile" className="flex items-center gap-2 text-slate-700 font-medium hover:text-green-600 transition-colors group">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                        {user.profilePic ? (
                                            <img key={user.profilePic} src={`${user.profilePic}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle size={20} />
                                        )}
                                    </div>
                                    <span className="capitalize">{user.username}</span>
                                </Link>
                                {isAdmin && (
                                    <Link to="/dashboard" title="Access administrative dashboard" className="text-sm font-semibold text-green-600 hover:text-green-700 transition">
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    title="Securely log out of your account"
                                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-semibold hover:bg-slate-200 transition text-sm"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                title="Sign in to your Jimmie HealthCare account"
                                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition shadow-lg shadow-green-500/30"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle navigation menu"
                            className="text-slate-600 hover:text-green-600 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-white/95 backdrop-blur-md shadow-lg absolute w-full"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {user && (
                                <div className="px-3 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                                        <UserCircle size={20} />
                                        <span className="capitalize">{user.username}</span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">{user.role}</span>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {user ? (
                                <div className="mt-4 space-y-2">
                                    {isAdmin && (
                                        <Link
                                            to="/dashboard"
                                            className="block w-full text-center bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition border border-green-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Go to Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="block w-full text-center bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full text-center mt-4 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
