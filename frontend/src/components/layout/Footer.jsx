import { HeartPulse, Facebook, Youtube, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                        <HeartPulse size={28} className="text-green-500" />
                        <span>Jimmie HealthCare</span>
                    </div>
                    <p className="text-slate-400 max-w-sm">
                        Providing the highest quality veterinary care, grooming, and nutrition for your furry family members.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
                        <li><a href="/about" className="hover:text-green-400 transition">About Us</a></li>
                        <li><a href="/services" className="hover:text-green-400 transition">Services</a></li>
                        <li><a href="/contact" className="hover:text-green-400 transition">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
                    <ul className="space-y-2 text-slate-400">
                        <li>Tirupattur</li>
                        <li>Coimbatore</li>
                        <li>Phone: +91 9443809429</li>
                        <li>Email: info@jimmiehealthcare.com</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Jimmie HealthCare. All rights reserved.
                </div>
                {/* Social Media Links with Unique Animated Icons */}
                <div className="flex items-center gap-4">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 bg-slate-700/50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:rotate-6 transition-all duration-300 shadow-sm hover:shadow-blue-500/50">
                        <Facebook size={20} />
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2.5 bg-slate-700/50 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white hover:-translate-y-1 hover:-rotate-6 transition-all duration-300 shadow-sm hover:shadow-red-500/50">
                        <Youtube size={20} />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 bg-slate-700/50 text-slate-400 rounded-xl hover:bg-pink-600 hover:text-white hover:-translate-y-1 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-pink-500/50">
                        <Instagram size={20} />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="p-2.5 bg-slate-700/50 text-slate-400 rounded-xl hover:bg-black hover:text-white hover:-translate-y-1 hover:rotate-12 transition-all duration-300 shadow-sm hover:shadow-slate-500/50 border border-transparent hover:border-slate-700">
                        <Twitter size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
