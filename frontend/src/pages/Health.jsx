import { motion } from 'framer-motion';
import { ShieldCheck, Stethoscope, Bug, ArrowLeft, HeartPulse, Activity, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Health = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const sections = [
        {
            title: "Routine Check-ups",
            icon: <Stethoscope className="text-blue-500" size={32} />,
            content: "Early detection is the key to preventing major health issues. Adult dogs should have a comprehensive physical exam at least once a year. Our clinics monitor weight, dental health, and organ function to ensure peak performance.",
            image: "/image/he_checkup.png"
        },
        {
            title: "Vaccination Schedule",
            icon: <HeartPulse className="text-red-500" size={32} />,
            content: "Protect your dog against Rabies, Distemper, Parvovirus, and Bordetella. Our automated tracking system ensures you never miss a booster shot, keeping your pet safe and compliant with local laws and travel requirements.",
            image: "/image/he_vaccine.png"
        },
        {
            title: "Parasite Prevention",
            icon: <Bug className="text-purple-500" size={32} />,
            content: "Fleas, ticks, and heartworms are constant threats. Monthly preventative treatments are essential to avoid life-threatening conditions. We provide clinical-grade solutions tailored to your pet's lifestyle and environment.",
            image: "/image/he_parasite.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img 
                        src="/image/dog_health_premium.png" 
                        alt="Veterinary clinic" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                </div>
                
                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/about" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium">
                            <ArrowLeft size={20} /> Back to Care Guide
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl mb-4">
                            Health & <br/>
                            <span className="text-blue-400">Veterinary Care</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light">
                            Proactive medical care is the greatest gift you can give your pet. Stay ahead of potential issues with our clinical-grade health management.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 -mt-16 relative z-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Annual Exams", val: "100% Essential", icon: <ClipboardCheck className="text-emerald-500"/> },
                            { label: "Vaccine Status", val: "Auto-Tracked", icon: <ShieldCheck className="text-blue-500"/> },
                            { label: "Health Score", val: "Live Monitoring", icon: <Activity className="text-rose-500"/> }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center gap-4"
                            >
                                <div className="p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-extrabold text-slate-900">{stat.val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-32">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeUp}
                                className={`flex flex-col md:flex-row gap-12 lg:gap-20 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-1/2">
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-blue-500/10 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] z-10">
                                            <img src={section.image} alt={section.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">{section.icon}</div>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                                    </div>
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                                        {section.content}
                                    </p>
                                    <div className="pt-4">
                                        <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <HeartPulse size={48} className="text-blue-500 mx-auto mb-8" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Schedule a Clinical Check-up</h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Stay proactive with your dog's health. Book an appointment with one of our elite veterinary partners today.
                    </p>
                    <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1">
                        Find a Clinic
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Health;
