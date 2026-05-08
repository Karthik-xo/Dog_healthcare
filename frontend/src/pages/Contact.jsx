import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';


import API_URL from '../config.js';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setStatus({ type: 'success', msg: 'Message Transmitted Successfully' });
                setFormData({ name: '', mobile: '', email: '', message: '' });
                console.log('Submission success:', data);
            } else {
                let errorMsg = 'Transmission Failed. Registry Offline.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = `Server Error: ${response.status} ${response.statusText}`;
                }
                setStatus({ type: 'error', msg: errorMsg.toUpperCase() });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus({ type: 'error', msg: 'Sync Interrupted. Connection Unstable.' });
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden selection:bg-green-500/10">
            {/* Cinematic Background Elements (Light Mode) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] grayscale" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center lg:text-left"
                >
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-emerald-500" />
                        <span className="text-emerald-600 uppercase tracking-[0.3em] text-xs font-bold font-mono">Communication Portal</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900">
                        Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Excellence.</span>
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:ml-0">
                        Our clinical support team is globally synchronized to provide mission-critical assistance for your premium healthcare needs.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                            {[
                                {
                                    icon: MapPin,
                                    title: "Primary Nodes",
                                    content: "Tirupattur Dist, 635601 TN\nCoimbatore Hub, India",
                                    color: "bg-emerald-100",
                                    iconColor: "text-emerald-600"
                                },
                                {
                                    icon: Phone,
                                    title: "Voice Uplink",
                                    content: "+91 9443809429\n08:00 - 20:00 IST",
                                    color: "bg-blue-100",
                                    iconColor: "text-blue-600"
                                },
                                {
                                    icon: Mail,
                                    title: "Secure Channels",
                                    content: "info@jimmiehealthcare.com\nsupport@jimmiehealthcare.com",
                                    color: "bg-purple-100",
                                    iconColor: "text-purple-600"
                                }
                            ].map((info, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,1)" }}
                                    className="p-6 rounded-3xl bg-white/50 border border-slate-200 flex items-start gap-6 backdrop-blur-sm group shadow-sm hover:shadow-md transition-all"
                                >
                                    {info.title === "Secure Channels" ? (
                                        <a href="mailto:info@jimmiehealthcare.com" className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center shrink-0 border border-white hover:scale-105 transition-transform`}>
                                            <info.icon size={24} className={info.iconColor} />
                                        </a>
                                    ) : (
                                        <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center shrink-0 border border-white`}>
                                            <info.icon size={24} className={info.iconColor} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-mono tracking-widest uppercase text-slate-900 font-bold mb-2">{info.title}</h3>
                                        {info.title === "Secure Channels" ? (
                                            <div className="flex flex-col">
                                                <a href="mailto:info@jimmiehealthcare.com" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">info@jimmiehealthcare.com</a>
                                                <a href="mailto:support@jimmiehealthcare.com" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">support@jimmiehealthcare.com</a>
                                            </div>
                                        ) : (
                                            <p className="text-slate-700 leading-relaxed whitespace-pre-line group-hover:text-slate-900 transition-colors font-medium">{info.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Modern Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7"
                    >
                        <div className="relative p-1 rounded-[32px] bg-gradient-to-b from-emerald-500/10 via-slate-200 to-blue-500/10 shadow-2xl">
                            <div className="bg-white/90 backdrop-blur-2xl rounded-[30px] p-8 md:p-12">
                                <AnimatePresence mode="wait">
                                    {status.msg ? (
                                        <motion.div
                                            key="status"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`mb-8 p-6 rounded-2xl flex items-center gap-4 border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                                        >
                                            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                            <span className="font-mono text-sm uppercase tracking-wider">{status.msg}</span>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>

                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-xs font-mono tracking-widest uppercase text-slate-900 font-bold ml-1">Your Name</label>
                                            <input
                                                type="text" id="name" value={formData.name} onChange={handleChange} required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                                                placeholder="SENDER NAME"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mobile" className="text-xs font-mono tracking-widest uppercase text-slate-900 font-bold ml-1">Mobile Number</label>
                                            <input
                                                type="text" id="mobile" value={formData.mobile} onChange={handleChange} required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-mono tracking-widest uppercase text-slate-900 font-bold ml-1">Email Address</label>
                                        <input
                                            type="email" id="email" value={formData.email} onChange={handleChange} required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                                            placeholder="IDENTITY@DOMAIN.COM"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs font-mono tracking-widest uppercase text-slate-900 font-bold ml-1">Message</label>
                                        <textarea
                                            id="message" value={formData.message} onChange={handleChange} required rows={4}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300 resize-none"
                                            placeholder="HOW CAN WE HELP YOU?"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-700 p-[1px] rounded-2xl shadow-lg shadow-emerald-500/20"
                                    >
                                        <div className="relative bg-white group-hover:bg-transparent transition-colors duration-300 rounded-2xl py-5 px-8 flex items-center justify-center gap-3">
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="font-mono tracking-[0.2em] uppercase text-sm font-bold text-slate-900 group-hover:text-white transition-colors">Transmit Data</span>
                                                    <Send size={16} className="text-emerald-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                                </>
                                            )}
                                        </div>
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
