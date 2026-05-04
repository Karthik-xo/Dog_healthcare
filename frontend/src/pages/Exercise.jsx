import { motion } from 'framer-motion';
import { Activity, Clock, ShieldAlert, Heart, ArrowLeft, Trophy, Zap, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exercise = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const sections = [
        {
            title: "Why Exercise Matters",
            icon: <Heart className="text-red-500" size={32} />,
            content: "Physical activity is fundamental to your dog's cardiovascular health, joint mobility, and mental well-being. Regular movement helps prevent obesity, reduces anxiety, and curbs destructive behaviors like chewing or excessive barking.",
            image: "/image/ex_benefits.png"
        },
        {
            title: "Daily Duration Guide",
            icon: <Clock className="text-blue-500" size={32} />,
            content: "Most healthy adult dogs require 30 to 60 minutes of high-energy exercise daily. Puppies need shorter, more frequent bursts, while senior dogs benefit from slow, steady walks to keep joints lubricated without overexertion.",
            image: "/image/ex_duration.png"
        },
        {
            title: "Safety & Weather",
            icon: <ShieldAlert className="text-amber-500" size={32} />,
            content: "Always check the pavement temperature—if it's too hot for your hand, it's too hot for their paws. During summer, exercise in the early morning or late evening. Ensure constant access to fresh water.",
            image: "/image/ex_safety.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img 
                        src="/image/dog_exercise_premium.png" 
                        alt="Dog running in a field" 
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
                            Regular Exercise <br/>
                            <span className="text-green-400">For a Happy Life</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light">
                            Unlock the secrets to keeping your furry friend fit, agile, and mentally sharp across every stage of their life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* QUICK STATS */}
            <section className="py-12 -mt-16 relative z-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Active Minutes", val: "30-60", icon: <Zap className="text-yellow-500"/> },
                            { label: "Check Pavement", val: "7 Sec Rule", icon: <Sun className="text-orange-500"/> },
                            { label: "Health Benefit", val: "+3 Years", icon: <Trophy className="text-emerald-500"/> }
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

            {/* DETAILED CONTENT */}
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
                                        <div className="absolute -inset-4 bg-green-500/10 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
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
                                        <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Activity size={48} className="text-green-500 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Need a Custom Exercise Plan?</h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Our specialized veterinarians can help you design the perfect activity regime tailored to your dog's breed, age, and health condition.
                    </p>
                    <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1">
                        Consult a Vet Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Exercise;
