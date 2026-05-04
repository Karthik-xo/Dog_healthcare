import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Globe, Clock, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Account');
    const [showPassword, setShowPassword] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);

    const tabs = [
        { id: 'Account', icon: User, label: 'Account' },
        { id: 'Notifications', icon: Bell, label: 'Notifications' },
        { id: 'Security', icon: Shield, label: 'Security' },
        { id: 'Clinic', icon: Globe, label: 'Preferences' }
    ];

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => setProfilePic(null);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500 mt-2 text-sm md:text-base">Manage your personal information, notification preferences, and security.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold whitespace-nowrap md:whitespace-normal ${
                                activeTab === tab.id 
                                ? 'bg-green-500 text-white shadow-xl shadow-green-500/30' 
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm shadow-slate-200/50"
                    >
                        {activeTab === 'Account' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-24 h-24 rounded-[2rem] bg-green-100 flex items-center justify-center text-green-600 border-4 border-white shadow-xl overflow-hidden">
                                        {profilePic ? (
                                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Profile Photo</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Recommended size 400x400px</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-slate-800"
                                            >
                                                Upload New
                                            </button>
                                            <button 
                                                onClick={handleRemovePhoto}
                                                className="px-4 py-2 bg-slate-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" defaultValue="Admin User" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input type="email" defaultValue="admin@jimmiedogs.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input type="text" defaultValue="+1 (555) 000-0000" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <select className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold appearance-none transition-all">
                                                <option>Asia/Kolkata (IST - Chennai/Tamil Nadu)</option>
                                                <option>America/New_York (UTC-5)</option>
                                                <option>Europe/London (BST)</option>
                                                <option>Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Notifications' && (
                            <div className="space-y-8">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900">Email Notifications</h4>
                                        <p className="text-xs text-slate-500 mt-1">Receive daily summaries and appointment alerts via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900">Phone Alerts</h4>
                                        <p className="text-xs text-slate-500 mt-1">Critical health alerts sent directly to your phone via SMS.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900">Appointment Reminders</h4>
                                        <p className="text-xs text-slate-500 mt-1">Notifications sent 24 hours before any scheduled visit.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Security' && (
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <div className="relative">
                                            <input type={showPassword ? 'text' : 'password'} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all" placeholder="••••••••" />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all" />
                                    </div>
                                </div>

                                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4 shadow-sm shadow-red-500/5">
                                    <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 mt-1 shrink-0">
                                        <Shield size={20} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-red-900 leading-relaxed uppercase tracking-wider">Two-Factor Authentication</p>
                                        <p className="text-xs text-red-700/70 mt-1 leading-relaxed">Improve security by adding a secondary level of verification during login. We'll send a code to your mobile device.</p>
                                        <button className="mt-4 px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Enable 2FA Now</button>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Login Activity</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <p className="font-bold text-slate-700">Windows PC · New York, US</p>
                                            </div>
                                            <span className="text-slate-400">Active Now</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs opacity-60">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                                <p className="font-bold text-slate-700">iPhone 13 · London, UK</p>
                                            </div>
                                            <span className="text-slate-400">2 days ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Clinic' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Language</label>
                                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold appearance-none transition-all">
                                        <option>English (United States)</option>
                                        <option>Spanish (España)</option>
                                        <option>French (France)</option>
                                        <option>Hindi (भारत)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold appearance-none transition-all">
                                        <option>INR (₹) - Indian Rupee</option>
                                        <option>USD ($) - US Dollar</option>
                                        <option>EUR (€) - Euro</option>
                                        <option>GBP (£) - British Pound</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Save Button Container */}
                        <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <AnimatePresence>
                                {isSaved && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">All changes saved!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-slate-200 active:scale-[0.98] ml-auto uppercase tracking-widest text-xs"
                            >
                                <Save size={18} />
                                Save Preferences
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
