import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Shield, Camera, Save, Bell, Lock, Globe, Phone,
    Loader2, CheckCircle2, AlertCircle, X, Image as ImageIcon,
    Video, RefreshCw, Check, Activity
} from 'lucide-react';

import API_URL, { BASE_URL } from '../../config.js';
const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        fullName: '',
        email: '',
        role: '',
        phone: '',
        location: '',
        bio: '',
        profilePic: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploadType, setUploadType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const location = useLocation();
    useEffect(() => {
        if (location.hash === '#activity') {
            const element = document.getElementById('activity');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    // Sync camera stream with video element
    useEffect(() => {
        if (stream && videoRef.current && uploadType === 'camera' && !capturedImage) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, uploadType, capturedImage]);

    // Cleanup camera on modal close
    useEffect(() => {
        if (!isUploadModalOpen) {
            stopCamera();
            setCapturedImage(null);
            setUploadType(null);
            setSelectedFile(null);
        }
    }, [isUploadModalOpen]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to fetch profile' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setUpdating(true);
        setStatus({ type: '', message: '' });
        const result = await persistProfile(user);
        if (result.success) {
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setStatus({ type: '', message: '' }), 4000);
        }
    };

    const persistProfile = async (userData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                // Merge server response into current user state so fields the PUT endpoint
                // doesn't echo back (e.g. profilePic) are not wiped out.
                setUser(prev => ({ ...prev, ...data }));
                // Update local storage user info as well
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data }));
                return { success: true, data };
            } else {
                setStatus({ type: 'error', message: data.message || 'Update failed' });
                return { success: false };
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error' });
            return { success: false };
        } finally {
            setUpdating(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    // Camera Logic
    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(s);
            setUploadType('camera');
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatus({ type: 'error', message: 'Could not access camera. Please check permissions.' });
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const data = canvas.toDataURL('image/jpeg');
        setCapturedImage(data);
        stopCamera();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        // Preview local file
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result);
        };
        reader.readAsDataURL(file);
        setUploadType('file');
    };

    // FIX: Safely convert a base64 data URL to a Blob without using fetch()
    const dataURLtoBlob = (dataURL) => {
        const [header, base64] = dataURL.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: mime });
    };

    const saveProfileImage = async () => {
        if (!capturedImage) {
            setStatus({ type: 'error', message: 'No image captured or selected' });
            return;
        }

        setUploadingImage(true);
        setStatus({ type: '', message: '' });

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authorization required');

            let formData = new FormData();

            if (uploadType === 'camera') {
                // FIX Bug 1: Use reliable base64→Blob conversion instead of fetch(dataURL)
                const blob = dataURLtoBlob(capturedImage);
                formData.append('image', blob, 'profile.jpg');
            } else {
                if (!selectedFile) throw new Error('No file selected');
                formData.append('image', selectedFile);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON: ${text.substring(0, 50)}...`);
            }

            if (response.ok) {
                // FIX Bug 2: Prefer server imageUrl, but fall back to local preview so UI
                // always shows the new photo even if server returns a relative path
                const newPic = data.imageUrl || capturedImage;
                const updatedUser = { ...user, profilePic: newPic };

                // FIX Bug 3: Update UI state first, THEN close modal to avoid race condition
                setUser(updatedUser);
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, profilePic: newPic }));

                const result = await persistProfile(updatedUser);

                if (result.success) {
                    // Re-apply profilePic after persistProfile in case the profile PUT
                    // endpoint doesn't return it (prevents the avatar from reverting).
                    setUser(prev => ({ ...prev, profilePic: newPic }));
                    // Close modal state cleanly after everything is settled
                    setCapturedImage(null);
                    setSelectedFile(null);
                    setUploadType(null);
                    setIsUploadModalOpen(false);
                    setStatus({ type: 'success', message: 'Profile picture updated!' });
                    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
                }
            } else {
                setStatus({ type: 'error', message: data.message || 'Upload failed' });
            }
        } catch (err) {
            console.error('UPLOAD ERROR:', err);
            setStatus({
                type: 'error',
                message: `Upload problem: ${err.message.includes('fetch') ? 'Connection lost' : err.message}`
            });
        } finally {
            setUploadingImage(false);
        }
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
        stopCamera();
        setCapturedImage(null);
        setUploadType(null);
    };

    const handleTakeAction = (alert) => {
        setSelectedAlert(null);
        if (alert.type === 'Medical') {
            navigate('/dashboard/appointments');
        } else if (alert.type === 'Security') {
            // Scroll to security section or focus a field
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setStatus({ type: 'error', message: 'Please update your security settings below.' });
        } else if (alert.type === 'Social') {
            setStatus({ type: 'success', message: 'Navigating to messaging system...' });
        } else {
            navigate('/dashboard');
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <Loader2 className="animate-spin mb-4 text-green-500" size={40} />
                <p className="font-medium">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0 lg:px-8">
            <motion.div
                initial="hidden" animate="visible" variants={fadeUp}
                className="mb-12"
            >
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-green-600 to-emerald-400 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Settings Center</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">Profile</span></h1>
                <p className="text-slate-500 mt-4 text-lg max-w-2xl font-medium leading-relaxed">Manage your professional medical identity and optimize your healthcare platform experience.</p>
            </motion.div>

            {status.message && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                >
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm tracking-tight">{status.message}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Quick Info */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp}
                    className="space-y-8"
                >
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="text-center relative z-10 flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">Profile</span>
                            <div className="relative inline-block mb-8">
                                <div className="w-40 h-40 rounded-full bg-slate-50 border-8 border-white shadow-2xl overflow-hidden relative group/avatar">
                                    <img
                                        key={user.profilePic}
                                        src={user.profilePic ? (user.profilePic.startsWith('data:') ? user.profilePic : `${user.profilePic}?t=${Date.now()}`) : "https://images.unsplash.com/photo-1612349317150-141366ef5085?q=80&w=300&auto=format&fit=crop"}
                                        alt="Profile"
                                        className="w-full h-full object-cover group-hover/avatar:scale-110 transition duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1612349317150-141366ef5085?q=80&w=300&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
                                        <Camera className="text-white mb-2" size={24} />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest text-center">Change Professional Portrait</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="absolute bottom-1 right-1 p-4 bg-gradient-to-tr from-green-600 to-emerald-400 text-white rounded-full border-4 border-white shadow-xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300 active:scale-95 group/btn"
                                >
                                    <Camera size={22} className="group-hover/btn:rotate-12 transition-transform" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.fullName || user.username}</h2>
                            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 italic">
                                <Shield size={12} /> {user.role}
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-50 space-y-6 text-left">
                                <div className="group/item">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover/item:text-green-500 transition">Verified Email</p>
                                    <div className="flex items-center gap-3 text-slate-700 font-bold">
                                        <Mail size={18} className="text-slate-400" />
                                        {user.email}
                                    </div>
                                </div>
                                {user.location && (
                                    <div className="group/item">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover/item:text-green-500 transition">Base Location</p>
                                        <div className="flex items-center gap-3 text-slate-700 font-bold">
                                            <Globe size={18} className="text-slate-400" />
                                            {user.location}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="font-black mb-6 flex items-center gap-3 text-lg uppercase tracking-widest italic"><Shield size={22} className="text-green-500" /> Infrastructure Security</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Multi-Factor Auth</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Data Sovereignty</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">Tier I</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Edit Form */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <User size={24} className="text-green-500" /> Personal Identity
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Updating these fields will modify your public platform presence.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Display Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Your Real Name (e.g. Parimala Jimmie)"
                                            value={user.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Handle</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            value={user.username}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Platform Role</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-400 cursor-not-allowed uppercase font-black text-xs tracking-widest italic"
                                        />
                                        <Lock size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Line</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Base Operations Center</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={user.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Bio</label>
                                <textarea
                                    name="bio"
                                    rows="5"
                                    value={user.bio}
                                    onChange={handleChange}
                                    placeholder="Describe your medical expertise and interests..."
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all resize-none font-bold text-slate-700 leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-xs text-slate-400 font-medium italic">Last sync: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-green-600 hover:to-emerald-500 disabled:from-slate-400 disabled:to-slate-300 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/10 hover:shadow-green-500/30 active:scale-95"
                                >
                                    {updating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {updating ? 'Persisting...' : 'Commit Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Bell size={18} className="text-green-500" /> Notifications</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-md border-slate-300 text-green-500 focus:ring-green-500" />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition font-medium">Critical Health Alerts</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-md border-slate-300 text-green-500 focus:ring-green-500" />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition font-medium">Weekly Analytics Report</span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Lock size={18} className="text-green-500" /> Integrity</h3>
                            <p className="text-sm text-slate-500 mb-6">Your data is encrypted with AES-256 standards.</p>
                            <button className="text-green-600 text-sm font-bold hover:underline">Download Security Log</button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">Update Photo</h3>
                                    <p className="text-slate-500 text-sm mt-1 tracking-tight">Set a professional profile picture.</p>
                                </div>
                                <button
                                    onClick={closeUploadModal}
                                    className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                {!uploadType && !capturedImage && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-green-500 hover:bg-green-50/50 transition group"
                                        >
                                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition text-slate-400 group-hover:text-green-500">
                                                <ImageIcon size={24} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">This PC</span>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </button>
                                        <button
                                            onClick={startCamera}
                                            className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-green-500 hover:bg-green-50/50 transition group"
                                        >
                                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition text-slate-400 group-hover:text-green-500">
                                                <Camera size={24} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Camera</span>
                                        </button>
                                    </div>
                                )}

                                {uploadType === 'camera' && !capturedImage && (
                                    <div className="space-y-6">
                                        <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-square shadow-inner">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover scale-x-[-1]"
                                            />
                                            <div className="absolute inset-0 border-4 border-white/20 pointer-events-none rounded-3xl"></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={stopCamera}
                                                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={takePhoto}
                                                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                            >
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                Capture
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {capturedImage && (
                                    <div className="space-y-6">
                                        <div className="relative rounded-3xl overflow-hidden bg-slate-100 aspect-square shadow-md">
                                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => { setCapturedImage(null); if (uploadType === 'camera') startCamera(); }}
                                                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center justify-center gap-2"
                                            >
                                                <RefreshCw size={18} /> Retake
                                            </button>
                                            <button
                                                onClick={saveProfileImage}
                                                disabled={uploadingImage}
                                                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
                                            >
                                                {uploadingImage ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                {uploadingImage ? 'Uploading...' : 'Save Photo'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Activity History Section */}
            <motion.div
                id="activity"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
                <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Activity className="text-green-500" size={24} /> System Activity & Alerts
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Chronological history of your account security and medical updates.</p>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition px-4 py-2 bg-green-50 rounded-full">
                        Mark All as Read
                    </button>
                </div>

                <div className="divide-y divide-slate-50">
                    {[
                        { id: 1, type: 'Medical', title: 'Vaccine Due Tomorrow', desc: 'Brutus needs his Parvovirus booster at 10 AM.', time: '2 hours ago', unread: true },
                        { id: 2, type: 'Security', title: 'Security Login Detected', desc: 'New login verified from Bangalore, India.', time: '5 hours ago', unread: true },
                        { id: 3, type: 'Social', title: 'New Message from Dr. Jenkins', desc: 'Review Max\'s latest bloodwork results.', time: '1 day ago', unread: false },
                        { id: 4, type: 'System', title: 'Medical Profile Update', desc: "Charlie's dental profile was updated.", time: '2 days ago', unread: false },
                        { id: 5, type: 'Security', title: 'Password Changed', desc: 'Your account password was successfully updated.', time: '1 week ago', unread: false },
                    ].map((log) => (
                        <div 
                            key={log.id} 
                            onClick={() => setSelectedAlert(log)}
                            className={`p-6 md:p-8 flex items-start gap-4 transition-colors hover:bg-slate-50 cursor-pointer group relative ${log.unread ? 'bg-green-50/20' : ''}`}
                        >
                            {log.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${log.type === 'Security' ? 'bg-blue-50 text-blue-500' :
                                log.type === 'Medical' ? 'bg-red-50 text-red-500' :
                                    log.type === 'Social' ? 'bg-green-50 text-green-500' :
                                        'bg-slate-100 text-slate-500'
                                }`}>
                                {log.type === 'Security' ? <Shield size={20} /> :
                                    log.type === 'Medical' ? <Activity size={20} /> :
                                        log.type === 'Social' ? <Mail size={20} /> :
                                            <Globe size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                                    <h4 className="font-bold text-slate-800">{log.title}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{log.desc}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition">
                                <button className="p-2 text-slate-300 hover:text-slate-600 transition">
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-slate-50/50 text-center">
                    <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition">
                        Load Older Activity
                    </button>
                </div>
            </motion.div>

            {/* Alert Details Modal */}
            <AnimatePresence>
                {selectedAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className={`h-4 bg-gradient-to-r ${selectedAlert.type === 'Security' ? 'from-blue-600 to-indigo-500' :
                                selectedAlert.type === 'Medical' ? 'from-red-600 to-pink-500' :
                                    'from-green-600 to-emerald-500'
                                }`}></div>
                            
                            <button 
                                onClick={() => setSelectedAlert(null)}
                                className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-10 md:p-14">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg ${selectedAlert.type === 'Security' ? 'bg-blue-50 text-blue-600' :
                                        selectedAlert.type === 'Medical' ? 'bg-red-50 text-red-600' :
                                            'bg-green-50 text-green-600'
                                        }`}>
                                        {selectedAlert.type === 'Security' ? <Shield size={36} /> :
                                            selectedAlert.type === 'Medical' ? <Activity size={36} /> :
                                                selectedAlert.type === 'Social' ? <Mail size={36} /> :
                                                    <Globe size={36} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedAlert.type === 'Security' ? 'bg-blue-100 text-blue-700' :
                                                selectedAlert.type === 'Medical' ? 'bg-red-100 text-red-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>{selectedAlert.type}</span>
                                            <span className="text-xs font-bold text-slate-400">{selectedAlert.time}</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedAlert.title}</h2>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-slate-50 rounded-[2rem] p-8">
                                        <p className="text-slate-600 font-medium leading-relaxed text-lg">
                                            {selectedAlert.desc}
                                            {selectedAlert.type === 'Security' && " We recommend reviewing your login history and ensuring Two-Factor Authentication is enabled for your secondary email."}
                                            {selectedAlert.type === 'Medical' && " Please ensure you have the pet's medical record handy. You can view or download the specific vaccination protocol from the 'My Pets' section."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleTakeAction(selectedAlert)}
                                            className="flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition shadow-xl uppercase tracking-widest text-xs"
                                        >
                                            Take Action Now
                                        </button>
                                        <button onClick={() => setSelectedAlert(null)} className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-50 transition uppercase tracking-widest text-xs">
                                            Dismiss Alert
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <span>Incident ID: ALR-{selectedAlert.id}892</span>
                                    <span>Platform Status: Secure</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
