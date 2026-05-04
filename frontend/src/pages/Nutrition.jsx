import { motion } from 'framer-motion';
import { Apple, Droplets, ShieldAlert, ShoppingCart, ArrowLeft, Beef, Utensils, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Nutrition = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const sections = [
        {
            title: "The Balanced Diet",
            icon: <Beef className="text-rose-500" size={32} />,
            content: "Dogs require a precise balance of proteins, fats, carbohydrates, and vitamins. High-quality commercial kibble is formulated to meet these needs based on age and breed size. Always check for a reputable AACO statement on the packaging.",
            image: "/image/nu_diet.png"
        },
        {
            title: "Hydration is Key",
            icon: <Droplets className="text-blue-400" size={32} />,
            content: "Clean, fresh water should be accessible 24/7. Dogs typically need about 1 ounce of water per pound of body weight daily. Monitor their intake carefully, especially during and after outdoor activities.",
            image: "/image/nu_hydration.png"
        },
        {
            title: "Toxic Foods List",
            icon: <ShieldAlert className="text-red-500" size={32} />,
            content: "Many human foods are deadly to dogs. Avoid chocolate, grapes, raisins, onions, garlic, and anything containing Xylitol (a common sweetener). When in doubt, stick to dog-specific treats.",
            image: "/image/nu_toxic.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img 
                        src="/image/dog_nutrition_premium.png" 
                        alt="Dog eating" 
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
                            Proper Nutrition <br/>
                            <span className="text-rose-400">Fuel for Vitality</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light">
                            Understand the science of what goes into your pet's bowl to ensure a long, healthy, and high-energy life.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 -mt-16 relative z-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Water Intake", val: "1 oz/lb", icon: <Droplets className="text-blue-500"/> },
                            { label: "Prime Protein", val: "Animal Based", icon: <Beef className="text-rose-500"/> },
                            { label: "Quality Check", val: "AACO Specs", icon: <Star className="text-yellow-500"/> }
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
                                        <div className="absolute -inset-4 bg-rose-500/10 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
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
                                        <div className="h-1 w-20 bg-rose-500 rounded-full"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Utensils size={48} className="text-rose-500 mx-auto mb-8" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Need a Specialized Diet?</h2>
                    <p className="text-lg text-slate-600 mb-10">
                        From grain-free options to weight management plans, our nutritionists can help craft the ideal menu for your dog's unique needs.
                    </p>
                    <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1">
                        Book a Nutrition Consult
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Nutrition;
