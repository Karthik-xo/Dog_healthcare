import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Stethoscope, Activity, HeartPulse, Cpu, ShieldCheck,
    ArrowRight, Star, Zap, Waves, Monitor, Lock, CheckCircle2,
    Users, Plus, BrainCircuit, Microscope
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('clinical');
    const [showProtocolModal, setShowProtocolModal] = useState(false);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [showPediatricModal, setShowPediatricModal] = useState(false);
    const [activeLineupIndex, setActiveLineupIndex] = useState(0);

    const disciplines = [
        {
            id: 'clinical',
            title: 'Elite Clinical Care',
            subtitle: 'Specialized Veterinary Medicine',
            desc: 'Our clinical team delivers advanced diagnostics and personalized treatment plans using global best practices.',
            icon: Stethoscope,
            color: 'blue',
            features: ['4D Genetic Mapping', 'Preventative Modeling', 'Neurological Screening'],
            image: '/image/clinical_care.png'
        },
        {
            id: 'surgery',
            title: 'Precision Surgery',
            subtitle: 'Robotic-Assisted Procedures',
            desc: 'State-of-the-art operating theaters equipped with micron-level precision and real-time biometric telemetry.',
            icon: Activity,
            color: 'emerald',
            features: ['Minimal Invasive Tech', 'Zero-Latency Monitoring', 'Post-Op Recovery AI'],
            image: '/image/precision_surgery.png'
        },
        {
            id: 'diagnostics',
            title: 'Vital Diagnostics',
            subtitle: 'Rapid Data Sequencing',
            desc: 'Transforming clinical data into actionable insights with ultra-fast sequencing and high-resolution imaging.',
            icon: HeartPulse,
            color: 'cyan',
            features: ['Rapid Lab Results', 'Full-Body MRI Seq', 'Bio-Marker Analysis'],
            image: '/image/vital_diagnostics.png'
        }
    ];

    const activePatientFeed = [
        { name: 'Cooper', breed: 'Beagle', status: 'In Surgery', progress: 65, color: 'text-orange-400' },
        { name: 'Daisy', breed: 'Golden Retriever', status: 'Observing', progress: 92, color: 'text-green-400' },
        { name: 'Bear', breed: 'Rottweiler', status: 'Pre-Scan', progress: 15, color: 'text-blue-400' },
        { name: 'Milo', breed: 'Frenchie', status: 'Syncing', progress: 40, color: 'text-cyan-400' }
    ];

    const lineup = [
        { id: 1, name: 'Specimen Beta-1024', image: '/image/specimen_beta.png', tag: 'Optimized' },
        { id: 2, name: 'Specimen Alpha-2048', image: '/image/specimen_alpha.png', tag: 'Stable' },
        { id: 3, name: 'Specimen Delta-3096', image: '/image/specimen_delta.png', tag: 'Peak' },
        { id: 4, name: 'Specimen Gamma-4012', image: '/image/dog4.jpg', tag: 'Premium' },
        { id: 5, name: 'Specimen Zeta-5055', image: '/image/dog5.jpg', tag: 'Expert' },
        { id: 6, name: 'Specimen Omega-6022', image: '/image/dog6.jpg', tag: 'Superior' },
        { id: 7, name: 'Specimen Kappe-7024', image: '/image/specimen_kappe.png', tag: 'Elite' },
        { id: 8, name: 'Specimen Luna-8048', image: '/image/specimen_luna.png', tag: 'Majestic' },
        { id: 9, name: 'Specimen Atlas-9096', image: '/image/specimen_atlas.png', tag: 'Power' },
        { id: 10, name: 'Specimen Nova-1012', image: '/image/specimen_nova.png', tag: 'Advanced' },
        { id: 11, name: 'Specimen Sigma-1111', image: '/image/dog24.png', tag: 'Natural' },
        { id: 12, name: 'Specimen Rho-2222', image: '/image/dog3.png', tag: 'Outdoor' },
        { id: 13, name: 'Specimen Epsilon-3333', image: '/image/hero_dog_professional.jpg', tag: 'Pro' },
        { id: 14, name: 'Specimen Theta-4444', image: '/image/dog20.jpg', tag: 'Natural' },
        { id: 15, name: 'Specimen Iota-5555', image: '/image/dog22.jpg', tag: 'Outdoor' },
        { id: 16, name: 'Specimen Kappa-6666', image: '/image/dog25.jpg', tag: 'Expert' },
        { id: 17, name: 'Specimen Mu-7777', image: '/image/dog10.jpg', tag: 'Natural' },
        { id: 18, name: 'Specimen Nu-8888', image: '/image/dog11.jpg', tag: 'Outdoor' },
        { id: 19, name: 'Specimen Xi-9999', image: '/image/dog12.jpg', tag: 'Pro' },
        { id: 20, name: 'Specimen Pi-1010', image: '/image/dog13.jpg', tag: 'Natural' },
        { id: 21, name: 'Specimen Tau-2020', image: '/image/dog15.jpg', tag: 'Outdoor' },
        { id: 22, name: 'Specimen Phi-3030', image: '/image/dog16.jpg', tag: 'Expert' },
        { id: 23, name: 'Specimen Chi-4040', image: '/image/dog19.jpg', tag: 'Natural' },
        { id: 24, name: 'Specimen Psi-5050', image: '/image/dog21.png', tag: 'Outdoor' },
        { id: 25, name: 'Specimen Omega-Final', image: '/image/dog23.jpg', tag: 'Pro' },
        { id: 26, name: 'Specimen Sigma-Ultra', image: '/image/dog7.jpg', tag: 'Natural' },
        { id: 27, name: 'Specimen Alpha-Prime', image: '/image/dog9.jpg', tag: 'Expert' }
    ];

    const nextSlide = () => setActiveLineupIndex((prev) => (prev + 1) % lineup.length);
    const prevSlide = () => setActiveLineupIndex((prev) => (prev - 1 + lineup.length) % lineup.length);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [activeLineupIndex]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-500 selection:text-white">

            {/* CLEAN PROFESSIONAL HERO */}
            <header className="relative bg-white border-b border-slate-100 overflow-hidden pt-32 pb-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#f0f9ff_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 font-bold text-sm mb-8 uppercase tracking-widest">
                                <ShieldCheck size={18} /> Enterprise Care Protocol
                            </div>
                            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-10">
                                Global Standards <br />
                                <span className="text-cyan-600">in Canine Health.</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-12">
                                We combine cutting-edge technology with elite veterinary expertise to provide the highest level of care for your companions.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <button
                                    onClick={() => navigate('/dashboard/appointments')}
                                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    Book Consultation
                                </button>
                                <button
                                    onClick={() => setShowProtocolModal(true)}
                                    className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:border-cyan-500 hover:text-cyan-600 transition-all"
                                >
                                    Explore Protocol
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-10 bg-cyan-500/10 rounded-full blur-[100px]"></div>
                            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.15)] border-8 border-white">
                                <img src="/image/puppy_hero_4k.png" alt="Happy puppy in the Pediatric Unit of Jimmie HealthCare" loading="lazy" className="w-full aspect-[4/5] object-cover" />
                                <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-2xl flex items-center justify-between">
                                    <div>
                                        <div className="text-slate-900 font-black text-2xl tracking-tight mb-1 italic">Pediatric Unit A1</div>
                                        <div className="text-cyan-600 font-bold text-sm uppercase tracking-widest">Active Scan Processed</div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-200">
                                        <Monitor size={28} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* CLINICAL DISCIPLINES - STRUCTURED GRID */}
            <section className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Our Expertise</span>
                            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">Clinical Disciplines.</h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                Our facility is organized into specialized units to ensure every aspect of canine health is managed by domain experts.
                            </p>
                        </div>
                        <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            {['clinical', 'surgery', 'diagnostics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-white text-cyan-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {disciplines.map((d, i) => (
                            <motion.div
                                key={d.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => setActiveTab(d.id)}
                                className={`group p-10 rounded-[3rem] transition-all duration-500 cursor-pointer relative overflow-hidden border ${activeTab === d.id ? 'bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] border-cyan-100 scale-105 z-10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
                            >
                                {activeTab === d.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"
                                    />
                                )}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl mb-10 transition-all duration-500 ${activeTab === d.id ? 'bg-cyan-500 text-white shadow-cyan-200 scale-110' : 'bg-white text-cyan-600 shadow-slate-200'}`}>
                                    <d.icon size={36} />
                                </div>
                                <h3 className={`text-3xl font-extrabold mb-2 tracking-tight transition-colors ${activeTab === d.id ? 'text-slate-900 animate-pulse' : 'text-slate-500 group-hover:text-cyan-600'}`}>{d.title}</h3>
                                <div className="text-cyan-600/60 font-black text-[10px] uppercase tracking-widest mb-6">{d.subtitle}</div>
                                <p className={`leading-relaxed mb-10 transition-colors ${activeTab === d.id ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {d.desc}
                                </p>
                                <ul className="space-y-4 mb-12">
                                    {d.features.map((f, fi) => (
                                        <li key={fi} className={`flex items-center gap-3 font-bold text-sm transition-colors ${activeTab === d.id ? 'text-slate-600' : 'text-slate-400'}`}>
                                            <CheckCircle2 size={18} className={activeTab === d.id ? 'text-cyan-500' : 'text-slate-300'} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDiscipline(d);
                                    }}
                                    className={`flex items-center gap-3 font-black uppercase text-xs tracking-widest transition-all ${activeTab === d.id ? 'text-cyan-600 translate-x-2' : 'text-slate-400 group-hover:text-cyan-600'}`}
                                >
                                    Learn More <ArrowRight size={18} className="text-cyan-500" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DASHBOARD WIDGET - LIVE PIPELINE */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-3xl shadow-slate-200">
                        <div className="absolute top-0 right-0 p-20 opacity-10">
                            <Activity size={200} className="text-cyan-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                                <div>
                                    <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block italic">Live Synchronization</span>
                                    <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none mb-4 italic">Clinic Pipeline.</h2>
                                    <p className="text-slate-400 text-lg max-w-xl">Real-time monitoring of our active specimens currently undergoing specialized clinical services.</p>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-800 border border-white/5 py-4 px-8 rounded-full">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                                    <span className="text-white font-black text-sm tracking-widest uppercase">Live Activity</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                {activePatientFeed.map((specimen, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10 }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="text-white font-black text-2xl italic tracking-tighter mb-1">{specimen.name}</div>
                                                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">{specimen.breed}</div>
                                            </div>
                                            <div className={`${specimen.color} bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5`}>
                                                {specimen.status}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400">
                                                <span>PROGRESS</span>
                                                <span>{specimen.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${specimen.progress}%` }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-cyan-500"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PEDIATRIC UNIT - THE PUPPY FOCUS */}
            <section className="py-40 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, rotate: -5 }}
                                whileInView={{ opacity: 1, rotate: 0 }}
                                transition={{ duration: 1 }}
                                className="relative z-20 rounded-[5rem] overflow-hidden shadow-3xl border-8 border-white"
                            >
                                <img src="/image/dog4.jpg" alt="Young dog receiving pediatric veterinary care" loading="lazy" className="w-full aspect-square object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-12 left-12 right-12">
                                    <div className="text-white font-black text-4xl italic tracking-tighter mb-4">Pediatric Center.</div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-cyan-400"></div>
                                        </div>
                                        <span className="text-white font-black text-xs italic tracking-widest">ACTIVE CARE</span>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-12 -right-12 w-48 h-48 border-4 border-dashed border-cyan-200 rounded-full z-10 flex items-center justify-center p-8"
                            >
                                <Monitor size={60} className="text-cyan-100" />
                            </motion.div>
                        </div>

                        <div>
                            <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Next Generation Medicine</span>
                            <h2 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-10 italic">Puppy Healthcare Expertise.</h2>
                            <p className="text-xl text-slate-500 leading-relaxed mb-12">
                                Special care protocols for the critical early stages of development. We monitor growth metrics with clinical precision to ensure a long, healthy life.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                                {[
                                    { label: 'Growth Syncing', icon: BrainCircuit, color: 'bg-blue-50' },
                                    { label: 'Bio-Monitoring', icon: Microscope, color: 'bg-emerald-50' },
                                    { label: 'Immune System', icon: ShieldCheck, color: 'bg-cyan-50' },
                                    { label: 'Nutrition Tech', icon: Zap, color: 'bg-orange-50' }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-slate-900 shadow-sm`}>
                                            <item.icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-slate-900 font-black text-sm tracking-tight uppercase">{item.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowPediatricModal(true)}
                                className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                View Pediatric Programs <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* BREED SUPPORT - PROFESSIONAL GALLERY (SLIDER) */}
            <section className="py-40 bg-slate-50 border-y border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
                    <div>
                        <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Comprehensive Support</span>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">Canine Lineage support.</h2>
                    </div>
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1, borderColor: '#06b6d4' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevSlide}
                            className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400 group cursor-pointer transition-colors"
                        >
                            <ArrowRight size={24} className="rotate-180 group-hover:text-cyan-600 transition-colors" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, borderColor: '#06b6d4' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSlide}
                            className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400 group cursor-pointer transition-colors"
                        >
                            <ArrowRight size={24} className="group-hover:text-cyan-600 transition-colors" />
                        </motion.button>
                    </div>
                </div>

                <div className="relative h-[650px] flex items-center overflow-hidden cursor-grab active:cursor-grabbing">
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: -((lineup.length - 1) * 448), right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                            const threshold = 100;
                            if (info.offset.x > threshold) prevSlide();
                            else if (info.offset.x < -threshold) nextSlide();
                        }}
                        className="flex gap-12 h-full items-center"
                        animate={{
                            x: -(activeLineupIndex * 448)
                        }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            width: 'max-content',
                            paddingLeft: 'calc(50% - 200px)'
                        }}
                    >
                        {lineup.map((item, idx) => {
                            const isActive = idx === activeLineupIndex;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1 : 0.8,
                                        opacity: 1
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="min-w-[400px] group relative rounded-[4rem] overflow-hidden bg-white border border-slate-200 shadow-2xl transition-all duration-500"
                                >
                                    <div className="aspect-[4/5] overflow-hidden transition-all duration-700">
                                        <img src={item.image} alt={`Clinical success case: ${item.name}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8 pb-12">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase">{item.name}</span>
                                            <div className="flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest">
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isActive ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
                                                {item.tag}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 italic tracking-tighter">Clinical Success Report.</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ENTERPRISE CTA */}
            <section className="py-24 md:py-60 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="bg-slate-900 rounded-[3rem] md:rounded-[5rem] p-12 md:p-40 relative overflow-hidden text-center shadow-3xl shadow-slate-300"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,transparent_70%)] opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-8xl font-extrabold text-white mb-6 md:mb-10 tracking-tight leading-none italic uppercase">Partner with Elite Care.</h2>
                            <p className="text-base md:text-xl text-slate-400 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed">
                                Join our network for advanced clinical management and industry-standard canine healthcare solutions.
                            </p>
                            <Link to="/contact" className="inline-flex items-center gap-4 md:gap-6 bg-cyan-500 text-white px-10 py-5 md:px-20 md:py-8 rounded-full font-bold text-xl md:text-3xl hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-900/40 group active:scale-95">
                                Connect Now <ArrowRight size={window.innerWidth < 768 ? 24 : 44} className="group-hover:translate-x-4 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PROTOCOL MODAL */}
            <AnimatePresence>
                {showProtocolModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => setShowProtocolModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-3xl border border-white/20 relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={() => setShowProtocolModal(false)}
                                    className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                                >
                                    <Plus className="rotate-45" size={24} />
                                </button>
                            </div>
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 font-bold text-sm mb-8 uppercase tracking-widest">
                                <ShieldCheck size={18} /> Protocol Breakdown
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Enterprise Care Protocol.</h2>
                            <div className="space-y-8">
                                {[
                                    { title: 'Screening Phase', desc: 'Initial multi-spectral scanning and genetic baseline establishment.' },
                                    { title: 'Synthesis Phase', desc: 'AI-driven data cross-referencing with global clinical standards.' },
                                    { title: 'Deployment Phase', desc: 'Personalized treatment deployment with real-time biometric tracking.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowProtocolModal(false)}
                                className="w-full mt-12 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all"
                            >
                                Acknowledge Protocol
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DISCIPLINE LEARN MORE MODAL */}
            <AnimatePresence>
                {selectedDiscipline && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => setSelectedDiscipline(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, x: 50 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.9, opacity: 0, x: 50 }}
                            className="bg-white rounded-[4rem] max-w-4xl w-full shadow-3xl border border-white/20 relative overflow-hidden flex flex-col md:flex-row"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-full md:w-1/2 relative h-64 md:h-auto">
                                <img src={selectedDiscipline.image} alt={selectedDiscipline.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                                <div className="absolute bottom-12 left-12 text-white z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                            <selectedDiscipline.icon size={28} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 leading-none">{selectedDiscipline.subtitle}</div>
                                            <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase">{selectedDiscipline.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-12 md:p-16">
                                <div className="absolute top-0 right-0 p-8">
                                    <button
                                        onClick={() => setSelectedDiscipline(null)}
                                        className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                                    >
                                        <Plus className="rotate-45" size={24} />
                                    </button>
                                </div>
                                <h3 className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-6">Expert Methodology</h3>
                                <p className="text-slate-500 text-lg leading-relaxed mb-10">
                                    {selectedDiscipline.desc} Our approach focuses on long-term health optimization using validated clinical data and expert systems.
                                </p>
                                <div className="grid grid-cols-1 gap-6 mb-12">
                                    {selectedDiscipline.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                            <span className="text-slate-900 font-bold text-sm tracking-tight">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSelectedDiscipline(null)}
                                    className="w-full bg-cyan-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-100"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PEDIATRIC PROGRAMS MODAL */}
            <AnimatePresence>
                {showPediatricModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => setShowPediatricModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 100 }}
                            className="bg-white rounded-[3rem] p-12 md:p-20 max-w-5xl w-full shadow-3xl border border-white/20 relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-12">
                                <button
                                    onClick={() => setShowPediatricModal(false)}
                                    className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                                >
                                    <Plus className="rotate-45" size={32} />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-20">
                                <div className="flex-1">
                                    <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-6 block">Curated Excellence</span>
                                    <h2 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight italic">Pediatric Success Programs.</h2>
                                    <p className="text-xl text-slate-500 leading-relaxed mb-12">
                                        Our specialized programs for puppies are designed to maximize genetic potential and ensure robust early development through precision monitoring.
                                    </p>
                                    <div className="space-y-6">
                                        {[
                                            { title: 'Neonatal Optimization', time: '0-8 Weeks', status: 'Priority' },
                                            { title: 'Social Integration Alpha', time: '8-16 Weeks', status: 'Active' },
                                            { title: 'Nutritional Foundation', time: '0-12 Months', status: 'Elite' }
                                        ].map((prog, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all group">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{prog.title}</h3>
                                                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{prog.time}</span>
                                                </div>
                                                <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                                    {prog.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3">
                                    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                        <img src="/image/dog4.jpg" alt="Pediatric Care" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/40 to-transparent"></div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowPediatricModal(false);
                                            navigate('/contact?subject=Pediatric Enrollment');
                                        }}
                                        className="w-full mt-10 bg-slate-900 text-white py-6 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Services;
