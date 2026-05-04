import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar as CalendarIcon, Clock, User, Activity, CheckCircle2, ChevronRight, Search, Trash2, Pencil } from 'lucide-react';

const Appointments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state for booking
    const [formData, setFormData] = useState({
        petName: '',
        doctor: '',
        date: '',
        time: '',
        reason: '',
        status: 'Upcoming',
        fee: ''
    });

    // Initial appointment orders (Fallback if localStorage is empty)
    const initialAppointments = [
        { id: 'ORD-8921', petName: 'Max (Golden Retriever)', doctor: 'Dr. Sarah Jenkins', date: '2026-04-08', time: '14:00', reason: 'Annual Checkup', status: 'Upcoming', fee: '₹85.00' },
        { id: 'ORD-9641', petName: 'Bella (Poodle)', doctor: 'Dr. Sarah Jenkins', date: '2026-04-10', time: '11:15', reason: 'Post-op Check', status: 'Upcoming', fee: '₹55.00' },
        { id: 'ORD-8922', petName: 'Bella (Poodle)', doctor: 'Dr. Michael T.', date: '2026-04-09', time: '10:30', reason: 'Vaccination', status: 'Pending', fee: '₹45.00' },
        { id: 'ORD-8923', petName: 'Charlie (German Shepherd)', doctor: 'Dr. Sarah Jenkins', date: '2026-04-07', time: '09:00', reason: 'Dental Cleaning', status: 'Completed', fee: '₹120.00' },
        { id: 'ORD-9901', petName: 'Daisy (Bulldog)', doctor: 'Dr. Michael T.', date: '2026-04-05', time: '11:00', reason: 'Consultation', status: 'Finished', fee: '₹40.00' }
    ];

    // Load from localStorage or use initial data
    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem('appointments_data');
        return saved ? JSON.parse(saved) : initialAppointments;
    });

    // Save to localStorage whenever appointments change
    useEffect(() => {
        localStorage.setItem('appointments_data', JSON.stringify(appointments));
    }, [appointments]);

    // Data Cleanup: Fix any zero-fee appointments with affordable random prices
    useEffect(() => {
        const hasZeroFees = appointments.some(a => a.fee === '₹0.00' || !a.fee || a.fee === '₹NaN');
        if (hasZeroFees) {
            const fixed = appointments.map(a => {
                if (a.fee === '₹0.00' || !a.fee || a.fee === '₹NaN') {
                    // Assign a random affordable price between ₹45 and ₹125
                    const randomPrice = (Math.floor(Math.random() * 80) + 45).toFixed(2);
                    return { ...a, fee: `₹${randomPrice}` };
                }
                return a;
            });
            setAppointments(fixed);
        }
    }, []);

    const filteredAppointments = appointments.filter(apt =>
        apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookAppointment = (e) => {
        e.preventDefault();

        let finalFee = formData.fee;
        if (!finalFee || finalFee === '0' || finalFee === '0.00') {
            // Assign a default affordable price if none specified
            finalFee = (Math.floor(Math.random() * 60) + 50).toFixed(2);
        }

        if (editingId) {
            // Update existing appointment
            setAppointments(appointments.map(apt =>
                apt.id === editingId
                    ? { ...apt, ...formData, fee: finalFee.startsWith('₹') ? finalFee : `₹${parseFloat(finalFee).toFixed(2)}` }
                    : apt
            ));
        } else {
            const newAppointment = {
                ...formData,
                id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                fee: finalFee.startsWith('₹') ? finalFee : `₹${parseFloat(finalFee).toFixed(2)}`
            };
            setAppointments([newAppointment, ...appointments]);
        }

        closeModal();
    };

    const handleEditAppointment = (apt) => {
        setFormData({
            petName: apt.petName,
            doctor: apt.doctor,
            date: apt.date,
            time: apt.time,
            reason: apt.reason,
            status: apt.status || 'Upcoming',
            fee: apt.fee ? apt.fee.replace('₹', '') : ''
        });
        setEditingId(apt.id);
        setIsModalOpen(true);
    };

    const handleCompleteAppointment = (id) => {
        const updated = appointments.map(apt => 
            apt.id === id ? { ...apt, status: 'Completed' } : apt
        );
        setAppointments(updated);
        localStorage.setItem('appointments_data', JSON.stringify(updated));
    };

    const handleDeleteAppointment = (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(appointments.filter(apt => apt.id !== id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ petName: '', doctor: '', date: '', time: '', reason: '', status: 'Upcoming' });
    };

    return (
        <div className="space-y-8 pb-10 max-w-6xl mx-auto px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Overview</h1>
                    <p className="text-slate-500 mt-2 text-sm md:text-base">Manage your bookings, view appointment order details, and schedule new visits.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Book Appointment
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Orders', value: appointments.length, icon: CalendarIcon, color: 'text-blue-500', bg: 'bg-blue-100' },
                    { label: 'Upcoming', value: appointments.filter(a => a.status === 'Upcoming').length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
                    { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
                    { label: 'Finished', value: appointments.filter(a => a.status === 'Finished').length, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-100' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform hover:scale-110`}>
                            <stat.icon size={22} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Order Details List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-800">Appointment Order Details</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pet or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/50">
                            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="py-4 px-6 font-bold">Order ID</th>
                                <th className="py-4 px-6 font-bold">Patient & Doctor</th>
                                <th className="py-4 px-6 font-bold">Date & Time</th>
                                <th className="py-4 px-6 font-bold">Reason</th>
                                <th className="py-4 px-6 font-bold">Est. Fee</th>
                                <th className="py-4 px-6 font-bold">Status</th>
                                <th className="py-4 px-6 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((apt, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6 font-bold text-slate-900">{apt.id}</td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-slate-800">{apt.petName}</p>
                                            <p className="text-xs text-slate-500">{apt.doctor}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-slate-700">{apt.date}</p>
                                            <p className="text-xs text-slate-500">{apt.time}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600">{apt.reason}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-800">{apt.fee}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                        apt.status === 'Finished' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {apt.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => handleCompleteAppointment(apt.id)}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEditAppointment(apt)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Appointment"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAppointment(apt.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Cancel Appointment"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400 italic">No appointments found for "{searchTerm}"</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay and Container */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
                        >
                            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                                        <CalendarIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900">{editingId ? 'Edit Appointment' : 'Book Appointment'}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{editingId ? 'Update details' : 'Schedule new visit'}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 overflow-y-auto flex-1">
                                <form onSubmit={handleBookAppointment} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Select Pet</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select name="petName" value={formData.petName} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 appearance-none font-bold text-slate-700 transition-all" required>
                                                <option value="" disabled>Choose a registered pet...</option>
                                                <option value="Max (Golden Retriever)">Max (Golden Retriever)</option>
                                                <option value="Bella (Poodle)">Bella (Poodle)</option>
                                                <option value="Charlie (German Shepherd)">Charlie (German Shepherd)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Preferred Doctor</label>
                                        <div className="relative">
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select name="doctor" value={formData.doctor} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 appearance-none font-bold text-slate-700 transition-all" required>
                                                <option value="" disabled>Select a doctor...</option>
                                                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                                                <option value="Dr. Michael T.">Dr. Michael T.</option>
                                                <option value="No Preference">No Preference</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Date</label>
                                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold text-slate-700 transition-all" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Time</label>
                                            <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold text-slate-700 transition-all" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Reason for Visit</label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            rows="3"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-semibold resize-none"
                                            placeholder="Symptoms or treatment description"
                                        ></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-semibold"
                                        >
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-slate-200 active:scale-[0.98] mt-4 uppercase tracking-[0.2em] text-xs">
                                        {editingId ? 'Update Appointment' : 'Confirm Booking'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appointments;


