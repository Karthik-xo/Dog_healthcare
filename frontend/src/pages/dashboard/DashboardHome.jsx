import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, CalendarDays, ArrowUpRight, Bell, X, ShieldCheck, Mail, Info, RefreshCw } from 'lucide-react';

import API_URL from 'https://dog-healthcare-backend.onrender.com';

const DashboardHome = () => {
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const displayName = user?.username || 'Admin';

    // Alerts State
    const [alerts, setAlerts] = useState([
        { id: 1, title: 'Vaccine Due Tomorrow', desc: 'Brutus needs his Parvovirus booster at 10 AM.', time: '2 hours ago', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 2, title: 'Security Login Detected', desc: 'New login verified from Bangalore, India.', time: '5 hours ago', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 3, title: 'New Message from Dr. Jenkins', desc: 'Review Max\'s latest bloodwork results.', time: '1 day ago', icon: Mail, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 4, title: 'Medical Profile Update', desc: 'Charlie\'s dental profile was updated.', time: '2 days ago', icon: Info, color: 'text-orange-500', bg: 'bg-orange-50' },
    ]);

    // Live Alert State
    const [liveAlert, setLiveAlert] = useState(null);

    // Simulate Live Alerts appearing at any time
    useEffect(() => {
        const timer = setTimeout(() => {
            setLiveAlert({
                title: 'Live: System Sync Complete',
                desc: 'All patient records are now synchronized with global databases.',
                time: 'Just now'
            });
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const clearAllActivity = () => {
        setAlerts([]);
        // Live alert remains unaffected as requested
    };

    // Dashboard State
    const [statsData, setStatsData] = useState({
        totalPets: '0',
        upcomingAppointments: '0',
        healthAlerts: 0,
        recentAppointments: []
    });
    const [isLoading, setIsLoading] = useState(true);

    // Stats calculation from Local Storage
    useEffect(() => {
        const calculateLocalStats = () => {
            const localPets = JSON.parse(localStorage.getItem('pets_data') || '[]');
            const localApts = JSON.parse(localStorage.getItem('appointments_data') || '[]');

            // Filter important appointments (Upcoming, Pending, Completed)
            const importantApts = localApts.filter(a =>
                a.status === 'Upcoming' || a.status === 'Pending' || a.status === 'Completed'
            ).sort((a, b) => {
                // Primary sort: Date (Most recent first)
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                // Secondary sort: Status (Pending first?)
                return 0;
            });

            setStatsData({
                totalPets: localPets.length.toLocaleString(),
                upcomingAppointments: localApts.filter(a => a.status === 'Upcoming' || a.status === 'Pending').length,
                healthAlerts: 0, // Will be updated when modal opens or live sync
                recentAppointments: importantApts.map(a => ({
                    pet: a.petName,
                    owner: 'Verified Owner',
                    date: a.date,
                    status: a.status
                })).slice(0, 8)
            });
            setIsLoading(false);
        };

        calculateLocalStats();
        // Listen for local storage changes (optional but good)
        window.addEventListener('storage', calculateLocalStats);
        return () => window.removeEventListener('storage', calculateLocalStats);
    }, []);

    // Fetch Live Alerts specifically
    const fetchLiveAlerts = async () => {
        try {
            const response = await fetch('/api/alerts');
            if (response.ok) {
                const data = await response.json();
                // Map string icon names to Lucide components
                const iconMap = { Activity, ShieldCheck, Mail, Info };
                const mappedAlerts = data.map(a => ({
                    ...a,
                    icon: iconMap[a.iconType] || Activity
                }));
                setAlerts(mappedAlerts);
                setStatsData(prev => ({ ...prev, healthAlerts: mappedAlerts.length }));
            }
        } catch (error) {
            console.error('Failed to fetch live alerts:', error);
        }
    };

    // Only live sync for alerts
    useEffect(() => {
        fetchLiveAlerts();
    }, []);

    const stats = [
        { title: 'Total Registered Pets', value: statsData.totalPets, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100', path: '/dashboard/pets' },
        { title: 'Upcoming Appointments', value: statsData.upcomingAppointments, icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-100', path: '/dashboard/appointments' },
        { title: 'Health Alerts', value: statsData.healthAlerts, icon: Activity, color: 'text-red-500', bg: 'bg-red-100', onClick: () => { fetchLiveAlerts(); setIsAlertsModalOpen(true); } },
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            {/* Live Alert Banner */}
            <AnimatePresence>
                {liveAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-xl shadow-slate-200/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                <RefreshCw size={20} className="animate-spin-slow" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm md:text-base leading-none">{liveAlert.title}</h4>
                                <p className="text-slate-400 text-xs mt-1 line-clamp-1">{liveAlert.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setLiveAlert(null)}
                            className="p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-capitalize">Welcome back, {displayName}! 👋</h1>
                <p className="text-slate-500 mt-2 text-sm md:text-base">Here is what's happening at your clinic today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={stat.onClick ? stat.onClick : undefined}
                        className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition active:scale-95 cursor-pointer ${stat.onClick ? 'ring-2 ring-transparent hover:ring-red-500/20' : ''}`}
                    >
                        {stat.path ? (
                            <Link to={stat.path} className="flex-1 flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                    <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                            </Link>
                        ) : (
                            <>
                                <div>
                                    <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                    <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Appointments */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 shrink-0">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">Recent Appointments</h2>
                        <Link to="/dashboard/appointments" className="text-green-600 text-sm font-semibold hover:text-green-700 flex items-center gap-1 transition">
                            <span className="hidden sm:inline">View All</span> <ArrowUpRight size={18} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-slate-50/50">
                                <tr className="text-slate-500 text-sm border-b border-slate-200">
                                    <th className="py-4 px-6 font-semibold">Pet Name</th>
                                    <th className="py-4 px-6 font-semibold">Owner</th>
                                    <th className="py-4 px-6 font-semibold">Date & Time</th>
                                    <th className="py-4 px-6 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {statsData.recentAppointments.length > 0 ? (
                                    statsData.recentAppointments.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-slate-800">{row.pet}</td>
                                            <td className="py-4 px-6 text-slate-600">{row.owner}</td>
                                            <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{row.date}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    row.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                        row.status === 'Finished' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-10 text-center text-slate-400 font-bold italic">
                                            {isLoading ? 'Connecting to live server...' : 'No recent appointments found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col h-full">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6 shrink-0">Quick Actions</h2>
                    <div className="space-y-4 flex-1">
                        {[
                            { title: 'Register New Pet', desc: 'Add a new patient to DB', path: '/dashboard/pets' },
                            { title: 'Schedule Appointment', desc: 'Book a clinic slot manually', path: '/dashboard/appointments' },
                            { title: 'View Medical Alerts', desc: 'Check critical health updates', onClick: () => setIsAlertsModalOpen(true) },
                        ].map((action, idx) => (
                            action.path ? (
                                <Link key={idx} to={action.path} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:shadow-md transition-all group flex items-center justify-between bg-white">
                                    <div className="pr-4">
                                        <p className="font-bold text-slate-800 group-hover:text-green-600 transition truncate">{action.title}</p>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{action.desc}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-green-50 transition">
                                        <ArrowUpRight size={18} className="text-slate-400 group-hover:text-green-500" />
                                    </div>
                                </Link>
                            ) : (
                                <button key={idx} onClick={action.onClick} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:shadow-md transition-all group flex items-center justify-between bg-white">
                                    <div className="pr-4">
                                        <p className="font-bold text-slate-800 group-hover:text-green-600 transition truncate">{action.title}</p>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{action.desc}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-green-50 transition">
                                        <ArrowUpRight size={18} className="text-slate-400 group-hover:text-green-500" />
                                    </div>
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts Modal */}
            <AnimatePresence>
                {isAlertsModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAlertsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                                        <Bell size={24} className="animate-bounce" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Alerts</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Notifications</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAlertsModalOpen(false)}
                                    className="p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                                {alerts.length > 0 ? (
                                    alerts.map((alert, i) => (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-5 rounded-3xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group flex gap-4"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${alert.bg} ${alert.color} group-hover:scale-110 transition-transform`}>
                                                <alert.icon size={22} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-black text-slate-800">{alert.title}</p>
                                                    <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck size={40} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm italic">All caught up! No active alerts.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                <button
                                    onClick={clearAllActivity}
                                    disabled={alerts.length === 0}
                                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-slate-200 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]"
                                >
                                    Clear All Activity
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardHome;
