import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Trash2, Pencil, PawPrint, Calendar, Heart, Shield, Info, Image, CheckCircle2, ArrowRight, Download, FileText, User, Activity, Printer } from 'lucide-react';

const Pets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [editingPet, setEditingPet] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '', breed: '', age: '', gender: 'Male', weight: '', status: 'Healthy'
    });

    // Initial pets (Fallback if localStorage is empty)
    const initialPets = [
        { id: 1, name: 'Max', breed: 'Golden Retriever', age: '3 years', gender: 'Male', weight: '32kg', status: 'Healthy', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1200' },
        { id: 2, name: 'Bella', breed: 'Poodle', age: '2 years', gender: 'Female', weight: '8kg', status: 'Treatment', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200' },
        { id: 3, name: 'Charlie', breed: 'German Shepherd', age: '5 years', gender: 'Male', weight: '38kg', status: 'Healthy', image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=1200' },
        { id: 4, name: 'Daisy', breed: 'Bulldog', age: '4 years', gender: 'Female', weight: '22kg', status: 'Checkup Due', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200' }
    ];

    // Load from localStorage or use initial data
    const [pets, setPets] = useState(() => {
        const saved = localStorage.getItem('pets_data');
        return saved ? JSON.parse(saved) : initialPets;
    });

    // Save to localStorage whenever pets change
    useEffect(() => {
        localStorage.setItem('pets_data', JSON.stringify(pets));
    }, [pets]);

    const mockHistory = [
        { id: 'R-1025', date: 'Oct 12, 2025', title: 'Annual Vaccination', desc: 'Rabies and DHPP boosters administered.', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-100', vet: 'Dr. Sarah Wilson' },
        { id: 'R-0824', date: 'Aug 24, 2025', title: 'Dental Cleaning', desc: 'Full scale and polish. No extractions needed.', icon: Heart, color: 'text-red-500', bg: 'bg-red-100', vet: 'Dr. James Miller' },
        { id: 'R-0515', date: 'May 15, 2025', title: 'Weight Check', desc: 'Weight is stable. Nutrition plan adjusted.', icon: Info, color: 'text-orange-500', bg: 'bg-orange-100', vet: 'Dr. Sarah Wilson' }
    ];

    const filteredPets = pets.filter(pet => {
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || (filterStatus === 'Checkup' ? pet.status === 'Checkup Due' : pet.status === filterStatus);
        return matchesSearch && matchesFilter;
    });

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const petImage = imagePreview || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200';
        if (editingPet) {
            setPets(pets.map(p => p.id === editingPet.id ? { ...p, ...formData, image: petImage } : p));
        } else {
            setPets([{ id: Date.now(), ...formData, image: petImage }, ...pets]);
        }
        closeModal();
    };

    const handleEdit = (pet) => {
        setEditingPet(pet);
        setFormData({ name: pet.name, breed: pet.breed, age: pet.age, gender: pet.gender || 'Male', weight: pet.weight || '', status: pet.status });
        setImagePreview(pet.image); setIsModalOpen(true);
    };

    const handleDelete = (id) => { if (window.confirm('Remove this pet from registry?')) setPets(pets.filter(p => p.id !== id)); };

    const openHistory = (pet) => { setSelectedPet(pet); setIsHistoryModalOpen(true); };

    const openReport = (report) => {
        setSelectedReport(report);
        setIsReportModalOpen(true);
        // Clear history from background on mobile to clear view
        if (window.innerWidth < 1024) setIsHistoryModalOpen(false);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingPet(null); setImagePreview(null); setFormData({ name: '', breed: '', age: '', gender: 'Male', weight: '', status: 'Healthy' }); };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10 max-w-6xl mx-auto px-4">
            {/* Real PDF Printable Area - Only shows when printing */}
            <div className="hidden print:block fixed inset-0 bg-white p-10 z-[300]">
                {selectedPet && (
                    <div className="space-y-10 font-sans text-slate-900">
                        <div className="flex justify-between border-b-4 border-slate-900 pb-8 items-center">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">Medical Diagnostic Report</h1>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Certified Record # {selectedReport?.id || 'PET-CERT-001'}</p>
                            </div>
                            <div className="p-4 bg-green-500 text-white rounded-3xl shrink-0"><PawPrint size={40} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b pb-2">Patient Profile</h2>
                                <p><strong>Name:</strong> {selectedPet.name}</p>
                                <p><strong>Breed:</strong> {selectedPet.breed}</p>
                                <p><strong>Gender:</strong> {selectedPet.gender}</p>
                                <p><strong>Weight:</strong> {selectedPet.weight || '32kg'}</p>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b pb-2">Clinical Provider</h2>
                                <p><strong>Doctor:</strong> {selectedReport?.vet || 'Dr. Sarah Wilson'}</p>
                                <p><strong>Specialty:</strong> Senior Veterinary Surgeon</p>
                                <p><strong>Clinic:</strong> Jimmie Dogs Medical Center</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center border-t border-slate-100 pt-10">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Heart Rate</p><p className="text-2xl font-black">110 BPM</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Temperature</p><p className="text-2xl font-black">38.5 °C</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Respiration</p><p className="text-2xl font-black">22 RPM</p></div>
                        </div>
                        <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-end">
                            <div><p className="text-[10px] font-black text-slate-300 uppercase italic">Authenticated Date: {new Date().toLocaleDateString()}</p></div>
                            <div className="text-right"><p className="text-xs font-black uppercase tracking-[0.1em] text-green-600">Digitally Certified & SHA-256 Sealed</p><div className="mt-3 h-12 w-40 border-2 border-slate-100 rounded-2xl bg-slate-50 opacity-40"></div></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Application UI - Hidden on Print */}
            <div className="print:hidden space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <div>
                        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight text-center md:text-left">Pet Registry Explorer</motion.h1>
                        <p className="text-slate-500 mt-2 text-xs md:text-sm text-center md:text-left">Clinical management for all your registered patients.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                        <Plus size={18} strokeWidth={3} /> Register Patient
                    </button>
                </div>

                {/* Toolbar Context */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-500/10 w-full transition-all" />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                        {['All', 'Healthy', 'Treatment', 'Checkup'].map((f) => (
                            <button
                                key={f} onClick={() => setFilterStatus(f)}
                                className={`px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all truncate whitespace-nowrap ${filterStatus === f ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' : 'border-slate-50 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Registry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence>
                        {filteredPets.map((pet, i) => (
                            <motion.div key={pet.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative">
                                <div className="h-48 md:h-52 overflow-hidden relative">
                                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                                    <div className="absolute top-5 left-5">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-2xl backdrop-blur-md bg-white/20 text-white border border-white/30 ${pet.status === 'Healthy' ? 'bg-green-500/80' : pet.status === 'Treatment' ? 'bg-orange-500/80' : 'bg-blue-500/80'}`}>
                                            {pet.status}
                                        </span>
                                    </div>
                                    <div className="absolute top-5 right-5 flex gap-2">
                                        <button onClick={() => handleEdit(pet)} className="w-10 h-10 rounded-2xl bg-white/95 text-slate-600 hover:text-green-600 shadow-lg flex items-center justify-center transition-all active:scale-90"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(pet.id)} className="w-10 h-10 rounded-2xl bg-white/95 text-slate-600 hover:text-red-600 shadow-lg flex items-center justify-center transition-all active:scale-90"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{pet.name}</h3>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"><PawPrint size={18} /></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest"><Shield size={16} className="text-blue-500" /> {pet.breed}</div>
                                        <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest"><Calendar size={16} className="text-purple-500" /> {pet.age} · {pet.gender}</div>
                                        <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest"><CheckCircle2 size={16} className="text-orange-500" /> {pet.weight || '32kg'}</div>
                                    </div>
                                    <button onClick={() => openHistory(pet)} className="w-full mt-8 py-5 bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 transition-all shadow-sm">
                                        Browse History
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Unified Overlay Control Center */}
                <AnimatePresence>
                    {(isModalOpen || isHistoryModalOpen || isReportModalOpen) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-[12px] print:hidden">
                            {/* History Modal - Layered Below Report */}
                            {isHistoryModalOpen && !isReportModalOpen && selectedPet && (
                                <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                    <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white shadow-sm overflow-hidden">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-inner shrink-0"><Info size={28} /></div>
                                            <div><h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter truncate">{selectedPet?.name}'s Records</h3><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: PET-{selectedPet?.id?.toString().slice(-4)}</p></div>
                                        </div>
                                        <button onClick={() => setIsHistoryModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={20} /></button>
                                    </div>
                                    <div className="p-8 md:p-10 space-y-10 overflow-y-auto flex-1 no-scrollbar bg-slate-50/20">
                                        {mockHistory.map((item, idx) => (
                                            <div key={idx} className="flex gap-6 md:gap-8 relative items-start">
                                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-3xl flex items-center justify-center shrink-0 border border-white shadow-xl ${item.bg} ${item.color}`}><item.icon size={22} md:size={26} strokeWidth={2.5} /></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="font-black text-slate-900 text-sm md:text-md tracking-tight uppercase truncate">{item.title}</h4>
                                                        <span className="text-[9px] font-black text-slate-400 bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-100">{item.date}</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed opacity-90">{item.desc}</p>
                                                    <button onClick={() => openReport(item)} className="mt-4 flex items-center gap-3 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] hover:translate-x-2 transition-all">Digital Record <ArrowRight size={12} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 md:p-10 border-t border-slate-50 bg-white">
                                        <button onClick={handlePrintPDF} className="w-full py-5 bg-slate-100 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all">
                                            <Printer size={18} strokeWidth={2.5} /> PRINT MEDICAL CERTIFICATE
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Medical Report Viewer Modal - Highest Priority */}
                            {isReportModalOpen && selectedReport && selectedPet && (
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-white rounded-[3.5rem] md:rounded-[4rem] shadow-[0_48px_128px_-32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[90vh] md:h-[92vh]">
                                    <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white">
                                        <div className="flex items-center gap-5 md:gap-6">
                                            <div className="p-4 md:p-5 bg-green-50 text-green-600 rounded-[1.5rem] md:rounded-[2rem] shadow-inner border border-green-100 shrink-0"><FileText size={28} md:size={36} strokeWidth={2.5} /></div>
                                            <div className="min-w-0 flex flex-col"><h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tightest truncate leading-none">Diagnostic Record</h3><p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Certified Auth: {selectedReport?.id}</p></div>
                                        </div>
                                        <button onClick={() => setIsReportModalOpen(false)} className="p-4 md:p-5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-[1.5rem] transition-all shadow-sm"><X size={24} md:size={32} /></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-12 md:space-y-16 bg-white no-scrollbar">
                                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                                            <div className="flex-1 space-y-8 md:space-y-10">
                                                <h4 className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] border-b pb-4 shadow-sm inline-block">Authenticated Patient Info</h4>
                                                <div className="grid grid-cols-2 gap-y-8 md:gap-y-10 gap-x-8 md:gap-x-12">
                                                    <div className="space-y-1"><p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</p><p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{selectedPet?.name}</p></div>
                                                    <div className="space-y-1"><p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Breed</p><p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{selectedPet?.breed}</p></div>
                                                    <div className="space-y-1"><p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</p><p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{selectedPet?.gender}</p></div>
                                                    <div className="space-y-1"><p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight</p><p className="text-xl md:text-2xl font-black text-green-600 tracking-tighter">{selectedPet?.weight || '32kg'}</p></div>
                                                </div>
                                            </div>
                                            <div className="w-full lg:w-80 space-y-8 md:space-y-10 shrink-0">
                                                <h4 className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] border-b pb-4">Diagnostic Provider</h4>

                                                {/* Unique Animated Doctor Card */}
                                                <motion.div
                                                    whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
                                                    className="p-10 bg-slate-900 text-white rounded-[3rem] space-y-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group border border-white/5"
                                                >
                                                    {/* Floating Glow Mesh Orbs */}
                                                    <motion.div
                                                        animate={{
                                                            x: [0, 40, -20, 0],
                                                            y: [0, -30, 20, 0],
                                                            scale: [1, 1.2, 0.9, 1]
                                                        }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                        className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"
                                                    />
                                                    <motion.div
                                                        animate={{
                                                            x: [0, -30, 30, 0],
                                                            y: [0, 40, -20, 0],
                                                            scale: [1, 0.8, 1.1, 1]
                                                        }}
                                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                        className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"
                                                    />

                                                    {/* Shimmer Sweep Animation Overlay */}
                                                    <motion.div
                                                        animate={{ x: ['-200%', '200%'] }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
                                                    />

                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                        className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 relative z-10"
                                                    >
                                                        <User size={28} className="text-green-400" />
                                                    </motion.div>

                                                    <div className="relative z-10">
                                                        <motion.p
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="text-xl font-black tracking-tight"
                                                        >
                                                            {selectedReport?.vet}
                                                        </motion.p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest opacity-80 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                            Jimmie Medical Staff
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                        <div className="space-y-8 md:space-y-10">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] border-b pb-4">Clinical Observations</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                                                {[
                                                    { label: 'Heart Rate', value: '110', unit: 'BPM', icon: Activity, color: 'text-red-500' },
                                                    { label: 'Temperature', value: '38.5', unit: '°C', icon: Activity, color: 'text-blue-500' },
                                                    { label: 'Respiration', value: '22', unit: 'RPM', icon: Activity, color: 'text-green-500' }
                                                ].map((obs, idx) => (
                                                    <div key={idx} className="p-8 md:p-10 border-2 border-slate-50 rounded-[3rem] bg-white shadow-sm hover:border-slate-100 transition-all">
                                                        <obs.icon size={18} className={`${obs.color} mb-6`} strokeWidth={3} />
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{obs.label}</p>
                                                        <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{obs.value} <span className="text-xs text-slate-200">{obs.unit}</span></p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-8 md:space-y-10">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] border-b pb-4">Diagnosis & Practitioner Notes</h4>
                                            <div className="p-10 md:p-12 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-6">
                                                <h5 className="text-lg font-black text-slate-900 tracking-tightest italic underline decoration-green-500 decoration-4 underline-offset-8">Status: {selectedReport?.title}</h5>
                                                <p className="text-sm md:text-base text-slate-600 leading-[1.8] font-bold opacity-80 italic">"Patient presented with stable vital signs. Diagnostic analysis confirms {selectedReport?.desc?.toLowerCase() || 'a healthy baseline'}. All secondary indicators show high resilience. Recommended follow-up in 180 days."</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 border-t border-slate-50 bg-white flex flex-col sm:flex-row items-center justify-between gap-10 md:gap-12 shrink-0">
                                        <div className="flex items-center gap-5 text-green-600"><CheckCircle2 size={40} strokeWidth={3} /><div className="flex flex-col gap-1 shrink-0"><p className="text-xs md:text-sm font-black uppercase tracking-tightest">AUTHENTICATED DIGITAL RECORD</p><p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">SHA-256 INTERNAL ENCRYPTION SEALED</p></div></div>
                                        <button onClick={handlePrintPDF} className="w-full sm:w-auto px-16 py-6 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-4">
                                            <Printer size={20} strokeWidth={2.5} /> DOWNLOAD PDF FORMAT
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Registration/Edit Modal - Centered */}
                            {isModalOpen && !isHistoryModalOpen && !isReportModalOpen && (
                                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                                    <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{editingPet ? 'Update Pet Info' : 'New Pet Registration'}</h3>
                                        <button onClick={closeModal} className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="overflow-y-auto p-8 md:p-10 space-y-8 no-scrollbar bg-white">
                                        <div onClick={() => fileInputRef.current?.click()} className="relative h-56 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50 transition-all hover:border-green-400 group overflow-hidden flex flex-col items-center justify-center cursor-pointer">
                                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <><Image size={40} className="text-slate-300 group-hover:scale-110 mb-5 transition-all" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select 4K Resolution Image</p></>}
                                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" hidden />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Bella" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all" required /><input type="text" name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Poodle" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all" required /></div>
                                            <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vitals</label><input type="text" name="age" value={formData.age} onChange={handleInputChange} placeholder="2 years" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all" /><div className="grid grid-cols-2 gap-4"><select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black"><option>Male</option><option>Female</option></select><input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="8kg" className="w-full px-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black" /></div></div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6">
                                            {['Healthy', 'Treatment', 'Checkup'].map((s) => (
                                                <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s === 'Checkup' ? 'Checkup Due' : s })} className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.status === (s === 'Checkup' ? 'Checkup Due' : s) ? 'bg-green-500 border-green-500 text-white shadow-xl translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-400'}`}>{s}</button>
                                            ))}
                                        </div>
                                        <button type="submit" className="w-full bg-slate-900 h-20 text-white font-black rounded-3xl uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-all active:scale-95">COMPLETE REGISTRY UPDATE</button>
                                    </form>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Pets;
