import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PawPrint, Calendar, Settings, LogOut, Menu, X, Bell, User } from 'lucide-react';

const SidebarLink = ({ icon: Icon, label, path, active, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
            active 
                ? 'bg-green-500 text-white shadow-xl shadow-green-500/40 scale-[1.02]' 
                : 'text-slate-600 hover:bg-green-50 hover:text-green-600'
        }`}
    >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        <span className={`font-bold tracking-tight ${active ? 'text-white' : 'text-slate-600 group-hover:text-green-600'}`}>{label}</span>
    </Link>
);

const DashboardLayout = () => {
    const [currentUser, setCurrentUser] = useState({ username: 'User', role: 'General', fullName: 'User', profilePic: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: User, label: 'My Profile', path: '/dashboard/profile' },
        { icon: PawPrint, label: 'My Pets', path: '/dashboard/pets' },
        { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    const handleMobileLinkClick = () => {
        if (isMobile) setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 z-50 bg-white w-72 h-screen border-r border-slate-100 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${!sidebarOpen && !isMobile ? 'md:-ml-72' : ''}`}
            >
                <div className="p-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-2xl font-black text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <PawPrint size={24} />
                        </div>
                        <span className="tracking-tighter">Jimmie</span>
                    </Link>
                    <button
                        className="md:hidden text-slate-400 hover:text-slate-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="px-6 flex-1 space-y-1.5 mt-6 overflow-y-auto">
                    {links.map(link => (
                        <SidebarLink
                            key={link.label}
                            {...link}
                            active={location.pathname === link.path}
                            onClick={handleMobileLinkClick}
                        />
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-slate-50 shrink-0">
                    <Link 
                        to="/login" 
                        className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                            <LogOut size={20} />
                        </div>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen w-full relative z-0">
                {/* Topbar */}
                <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 sticky top-0 print:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-green-600 transition flex-shrink-0"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2 sm:gap-4 relative">
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`relative p-2.5 rounded-xl transition ${notificationsOpen ? 'bg-green-50 text-green-600 shadow-inner' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                                        >
                                            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                                                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Recent Alerts</h4>
                                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md italic">2 New</span>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                <Link 
                                                    to="/dashboard/profile#activity"
                                                    onClick={() => setNotificationsOpen(false)}
                                                    className="p-4 hover:bg-slate-50 transition cursor-pointer border-b border-slate-50 block"
                                                >
                                                    <p className="text-sm font-bold text-slate-800">Vaccine Due Tomorrow</p>
                                                    <p className="text-xs text-slate-500 mt-1">Brutus needs his Parvovirus booster at 10 AM.</p>
                                                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">2 hours ago</span>
                                                </Link>
                                                <Link 
                                                    to="/dashboard/profile#activity"
                                                    onClick={() => setNotificationsOpen(false)}
                                                    className="p-4 hover:bg-slate-50 transition cursor-pointer block"
                                                >
                                                    <p className="text-sm font-bold text-slate-800">Security Login Detected</p>
                                                    <p className="text-xs text-slate-500 mt-1">New login verified from Bangalore, India.</p>
                                                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">5 hours ago</span>
                                                </Link>
                                            </div>
                                            <Link 
                                                to="/dashboard/profile#activity" 
                                                onClick={() => setNotificationsOpen(false)}
                                                className="block w-full py-4 bg-slate-50 text-[10px] font-black text-slate-500 text-center uppercase tracking-widest hover:bg-green-50 hover:text-green-600 transition"
                                            >
                                                View All Activity
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link to="/dashboard/profile" className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 group">
                            <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden flex items-center justify-center text-green-600 shadow-inner shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                                {currentUser.profilePic ? (
                                    <img key={currentUser.profilePic} src={`${currentUser.profilePic}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-bold text-slate-700 leading-tight truncate max-w-[120px]">{currentUser.fullName || currentUser.username}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-500 transition-colors uppercase">{currentUser.role}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
