import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Activity, ShieldCheck, ArrowRight, CalendarDays, PlayCircle, Star, BadgeCheck, Clock, Users, HeartPulse, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import VideoModal from '../components/VideoModal';

const Home = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const handleBookingClick = () => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/dashboard/appointments');
        } else {
            navigate('/login');
        }
    };


    // Parallax animation transforms
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Appearance Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-500 selection:text-white">


            {/* PARALLAX HERO SECTION */}
            <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">

                {/* Parallax Background Layer */}
                <motion.div
                    className="absolute inset-0 z-0 origin-top"
                    style={{
                        y: backgroundY,
                        scale: backgroundScale,
                    }}
                >
                    <motion.img
                        src="/image/hero_premium_8k_centered.png"
                        alt="Professional 4K Veterinary Healthcare and Canine Wellness"
                        width="1920"
                        height="1080"
                        fetchpriority="high"
                        decoding="async"
                        className="w-full h-full object-cover object-center relative z-0 opacity-100"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Perfect gradient overlay for readable unboxed text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>
                </motion.div>

                {/* Floating Foreground Text Layer */}
                <motion.div
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
                    style={{ y: textY, opacity: textOpacity }}
                >
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-green-300 font-medium text-sm mb-6 shadow-lg"
                        >
                            <BadgeCheck size={16} />
                            <span>Voted #1 Pet Tech Platform 2026</span>
                        </motion.div>

                        <motion.h1
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-xl"
                        >
                            <motion.span variants={fadeUp} className="block">Modern Healthcare</motion.span>
                            <motion.span variants={fadeUp} className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 block">
                                For Your Best Friend
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl font-light drop-shadow-md"
                        >
                            The all-in-one SaaS platform unifying medical records, smart appointment scheduling, and real-time health alerts for pet owners and world-class veterinary clinics.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 mb-4"
                        >
                            <button 
                                onClick={handleBookingClick}
                                className="group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_60px_-15px_rgba(34,197,94,0.7)] hover:-translate-y-1"
                            >
                                Book Appointment <CalendarDays size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1 shadow-lg"
                            >
                                <PlayCircle size={20} /> Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="mt-12 flex flex-col md:flex-row items-center gap-6 text-sm text-slate-300 drop-shadow-lg"
                        >
                            <div className="flex -space-x-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                    className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 ring-2 ring-white/20 shadow-xl bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop')" }}
                                ></motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                    className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 ring-2 ring-white/20 shadow-xl bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop')" }}
                                ></motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                    className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 ring-2 ring-white/20 shadow-xl bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop')" }}
                                ></motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                    className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 ring-2 ring-white/20 shadow-xl bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop')" }}
                                ></motion.div>
                            </div>
                            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="flex text-yellow-500 mb-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                                </div>
                                <span className="font-bold text-slate-100 uppercase tracking-widest text-[11px] drop-shadow-md">Trusted by 10,000+ Happy Pet Parents & 12k+ Elite Clinics</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Decorative Bottom Wave/Skew */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
                    <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-slate-50"></path>
                    </svg>
                </div>
            </section>

            {/* ELITE TRUST MARQUEE */}
            <section className="py-16 border-y border-slate-200 bg-white overflow-hidden relative group">
                {/* Subtle Background Glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2"
                    >
                        Powering Modern Veterinary Practices
                    </motion.p>
                    <div className="h-1 w-12 bg-green-500 mx-auto rounded-full opacity-50"></div>
                </div>

                <div className="relative flex overflow-hidden">
                    {/* Infinite Loop Wrapper */}
                    <motion.div
                        animate={{ x: [0, -1035] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-16 whitespace-nowrap min-w-max px-8"
                    >
                        {[...Array(3)].map((_, loopIdx) => (
                            <div key={loopIdx} className="flex items-center gap-16 md:gap-24">
                                <motion.div
                                    whileHover={{ scale: 1.05, color: "#ef4444" }}
                                    className="text-3xl font-black text-slate-400 flex items-center gap-3 transition-colors duration-300 cursor-pointer group/icon"
                                >
                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover/icon:bg-red-50 transition-colors duration-300">
                                        <HeartPulse size={32} className="group-hover/icon:animate-pulse" />
                                    </div>
                                    <span className="tracking-tighter">VetCore</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, color: "#10b981" }}
                                    className="text-3xl font-black text-slate-400 flex items-center gap-3 transition-colors duration-300 cursor-pointer group/icon"
                                >
                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover/icon:bg-emerald-50 transition-colors duration-300">
                                        <Activity size={32} className="group-hover/icon:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <span className="tracking-tighter">PetHealth+</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, color: "#3b82f6" }}
                                    className="text-3xl font-black text-slate-400 flex items-center gap-3 transition-colors duration-300 cursor-pointer group/icon"
                                >
                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover/icon:bg-blue-50 transition-colors duration-300">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <span className="tracking-tighter">SafePaws</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, color: "#f59e0b" }}
                                    className="text-3xl font-black text-slate-400 flex items-center gap-3 transition-colors duration-300 cursor-pointer group/icon"
                                >
                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover/icon:bg-amber-50 transition-colors duration-300">
                                        <Users size={32} />
                                    </div>
                                    <span className="tracking-tighter">Animalia</span>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Gradient Fades for depth */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                </div>
            </section>

            {/* BENTO GRID FEATURES */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 md:text-center max-w-3xl mx-auto">
                        <motion.h2
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
                        >
                            Everything you need. <br className="hidden md:block" />
                            <span className="text-green-500">Nothing you don't.</span>
                        </motion.h2>
                        <motion.p
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="text-lg text-slate-600"
                        >
                            We've completely re-imagined pet healthcare software from the ground up to be beautiful, lightning-fast, and incredibly powerful.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                        {/* Big Feature Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                            className="md:col-span-2 relative overflow-hidden bg-slate-100 rounded-[2rem] p-8 lg:p-12 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-50/0"></div>
                            <div className="relative z-10 max-w-md">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-500 mb-6">
                                    <Activity size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Unified Medical Records</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Access your pet’s entire medical history instantly. View past diagnoses, track chronic conditions, and share complete files securely with any vet in seconds.
                                </p>
                            </div>
                            <img
                                src="/image/dog_health_premium.png"
                                alt="Dashboard visualization showing dog health records and medical history"
                                loading="lazy"
                                className="absolute -bottom-10 -right-10 w-2/3 max-w-[400px] rounded-tl-2xl shadow-2xl group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-700 ease-out hidden sm:block"
                            />
                        </motion.div>

                        {/* Tall Feature Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 lg:p-12 relative overflow-hidden group text-white"
                        >
                            <div className="absolute inset-0 bg-[url('/image/dog_training_premium.png')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-green-400 mb-6 border border-white/10">
                                        <Calendar size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Smart Appointments</h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-lg mt-8">
                                    Book, reschedule, or cancel clinic visits with one tap. Automated SMS & email reminders ensure you never miss a checkup.
                                </p>
                            </div>
                        </motion.div>

                        {/* Standard Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-green-500 rounded-[2rem] p-8 lg:p-12 text-slate-900 relative overflow-hidden group hover:bg-green-400 transition-colors duration-500"
                        >
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 tracking-tight">Vaccine Tracker</h3>
                            <p className="text-green-950 font-medium">
                                Smart alerts notify you 30 days before immunizations expire. Keep your pet safe and compliant.
                            </p>
                        </motion.div>

                        {/* Wide Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="md:col-span-2 bg-slate-100 rounded-[2rem] p-8 lg:p-12 flex flex-col sm:flex-row items-center gap-8 group"
                        >
                            <div className="flex-1">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-500 mb-6">
                                    <Clock size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Health Insights</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Our proprietary AI monitors symptom logs and test results to proactively detect potential health risks before they become emergencies.
                                </p>
                            </div>
                            <div className="w-full sm:w-1/3 aspect-square rounded-2xl bg-[url('/image/dog_nutrition_premium.png')] bg-cover bg-center shadow-lg group-hover:scale-105 transition-transform duration-700"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CREATIVE PET WELLNESS SECTION */}
            <section className="py-32 bg-slate-900 overflow-hidden relative">
                {/* Animated background highlights */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-xs uppercase tracking-[0.2em] mb-6"
                            >
                                <Activity size={14} />
                                <span>Holistic Excellence</span>
                            </motion.div>

                            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Every Day is an <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Investment in Life.</span>
                            </h2>

                            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light max-w-xl">
                                The journey to longevity is paved with clinical precision and daily care. Our expert-led wellness framework covers the four pillars of pet vitality.
                            </p>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12">
                                {[
                                    { title: "Physicality", desc: "Adaptive exercise", icon: Activity },
                                    { title: "Vitality", desc: "Scientific nutrition", icon: HeartPulse },
                                    { title: "Psychology", desc: "Positive training", icon: Users },
                                    { title: "Clinical", desc: "Proactive monitoring", icon: ShieldCheck }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-green-500">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-white font-bold">{item.title}</span>
                                            <span className="text-slate-500 text-sm font-medium">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link to="/exercise" className="group relative inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-full font-black text-lg transition-all hover:bg-green-500 hover:text-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <span className="relative z-10">Access Health Blueprint</span>
                                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Link>
                        </motion.div>

                        {/* Right Side: STAGGERED GLASS GRID */}
                        <div className="relative">
                            <div className="grid grid-cols-12 grid-rows-12 gap-4 h-[550px] md:h-[650px]">

                                {/* Main Hero Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    className="col-span-8 row-span-10 rounded-[3rem] overflow-hidden shadow-2xl relative group border border-white/5"
                                >
                                    <img
                                        src="/image/wellness_golden_retriever.png"
                                        alt="Happy Golden Retriever receiving veterinary wellness care"
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8">
                                        <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Vitals Monitoring: Active
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Secondary Image Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="col-span-6 col-start-7 row-span-6 row-start-7 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-slate-900 z-10"
                                >
                                    <img
                                        src="/image/dog_exercise_premium.png"
                                        alt="Dog running and exercising for physical health"
                                        loading="lazy"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                    />
                                </motion.div>

                                {/* Glass Metric Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="col-span-5 col-start-8 row-span-4 row-start-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[2.5rem] p-3 md:p-6 flex items-center justify-center gap-2 md:gap-4 shadow-2xl z-20 group hover:bg-white/10 transition-all"
                                >
                                    <HeartPulse className="w-8 h-8 md:w-10 md:h-10 shrink-0 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                                    <div className="flex flex-col justify-center">
                                        <div className="text-2xl md:text-4xl font-black text-white leading-none mb-0.5 md:mb-1">98%</div>
                                        <div className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest font-black leading-tight">Vitality<br />Index</div>
                                    </div>
                                </motion.div>

                                {/* Floating Chip 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        opacity: { duration: 0.5, delay: 0.6 }
                                    }}
                                    className="absolute top-[20%] -left-8 md:-left-12 z-30 px-6 py-3 bg-green-500 rounded-2xl shadow-[0_20px_40px_rgba(34,197,94,0.3)] text-slate-900 font-black text-xs md:text-sm flex items-center gap-2"
                                >
                                    <Star size={16} fill="currentColor" />
                                    Daily Routine: Synchronized
                                </motion.div>

                                {/* Floating Chip 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{
                                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                                        opacity: { duration: 0.5, delay: 0.8 }
                                    }}
                                    className="absolute bottom-[20%] -right-4 md:-right-8 z-30 px-6 py-3 bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-2xl text-white font-bold text-xs md:text-sm shadow-2xl flex items-center gap-2"
                                >
                                    <Users size={16} className="text-green-400" />
                                    Community Verified
                                </motion.div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900">Loved by Pets & Professionals</h2>
                    </div>

                    <motion.div
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                name: "Dr. Sarah Jenkins",
                                role: "Chief of Veterinary Medicine",
                                text: "Jimmie HealthCare delivers unmatched precision in patient data management. It's the gold standard for modern clinics.",
                                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop"
                            },
                            {
                                name: "Dr. Michael T.",
                                role: "Senior Clinical Director",
                                text: "As a surgeon and Labradoodle parent, I need a platform that handles complex records effortlessly. This is it.",
                                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
                            },
                            {
                                name: "Jessica R.",
                                role: "Pet Groomer",
                                text: "The scheduling module is flawless. My clients love the automated reminders, and no-shows have dropped to zero!",
                                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                            }
                        ].map((review, i) => (
                            <motion.div key={i} variants={fadeUp} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex text-green-500 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-700 text-lg mb-8 leading-relaxed italic">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full bg-slate-200 bg-cover bg-center border border-slate-100"
                                        style={{ backgroundImage: `url('${review.image}')` }}
                                    ></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{review.name}</h4>
                                        <p className="text-sm text-slate-500">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA FOOTER BANNER */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-8 py-16 md:py-20 text-center shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent"></div>
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-30"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to upgrade your pet's life?</h2>
                            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                                Join thousands of clinics and pet owners bringing veterinary care into the modern era. Start tracking today.
                            </p>
                            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 px-10 py-4 rounded-full font-bold text-xl transition-all shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] hover:-translate-y-1">
                                Create Free Account <ArrowRight size={22} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </div>
    );
};

export default Home;
