import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Play, Pause, Heart, Shield, Sparkles, ChevronRight, Stethoscope,
    Video, Maximize2, Volume2, VolumeX, MonitorPlay,
    Languages, Minimize2, Square
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ── Time-coded subtitle tracks ────────────────────────────────────────────────
const TRACKS = {
    English: [
        { s: 0,  e: 6,  t: 'Welcome to our dog healthcare platform.' },
        { s: 6,  e: 12, t: 'We provide comprehensive care for your beloved pets.' },
        { s: 12, e: 18, t: 'Expert veterinarians available around the clock.' },
        { s: 18, e: 24, t: 'Schedule appointments and track health records.' },
        { s: 24, e: 30, t: "Your dog's health is our top priority." },
        { s: 30, e: 37, t: 'Join thousands of happy pet owners today.' },
        { s: 37, e: 44, t: 'Advanced diagnostics and personalised treatment plans.' },
        { s: 44, e: 51, t: 'Caring for every paw, every day.' },
        { s: 51, e: 58, t: 'Experience the future of dog healthcare.' },
        { s: 58, e: 65, t: 'Trusted by over 10,000 pet families worldwide.' },
        { s: 65, e: 72, t: 'Because every dog deserves the best care.' },
        { s: 72, e: 80, t: 'Start your journey with us today.' },
    ],
    Tamil: [
        { s: 0,  e: 6,  t: 'எங்கள் நாய் சுகாதார தளத்திற்கு வரவேற்கிறோம்.' },
        { s: 6,  e: 12, t: 'உங்கள் செல்லப்பிராணிகளுக்கு முழுமையான சேவை வழங்குகிறோம்.' },
        { s: 12, e: 18, t: 'நிபுணர் மருத்துவர்கள் எப்போதும் கிடைக்கிறார்கள்.' },
        { s: 18, e: 24, t: 'சந்திப்புகளை திட்டமிட்டு உடல்நல பதிவுகளை கண்காணியுங்கள்.' },
        { s: 24, e: 30, t: 'உங்கள் நாயின் ஆரோக்கியம் எங்கள் முதல் முன்னுரிமை.' },
        { s: 30, e: 37, t: 'மகிழ்ச்சியான செல்லப்பிராணி உரிமையாளர்களுடன் சேருங்கள்.' },
        { s: 37, e: 44, t: 'மேம்பட்ட நோயறிதல் மற்றும் சிகிச்சை திட்டங்கள்.' },
        { s: 44, e: 51, t: 'ஒவ்வொரு நாளும் ஒவ்வொரு கால்பாதத்தையும் கவனிக்கிறோம்.' },
        { s: 51, e: 58, t: 'நாய் சுகாதாரத்தின் எதிர்காலத்தை அனுபவியுங்கள்.' },
        { s: 58, e: 65, t: 'உலகெங்கும் 10,000 செல்லப்பிராணி குடும்பங்களால் நம்பகமான.' },
        { s: 65, e: 72, t: 'ஒவ்வொரு நாயும் சிறந்த சேவைக்கு தகுதியானது.' },
        { s: 72, e: 80, t: 'இன்றே எங்களுடன் உங்கள் பயணத்தை தொடங்குங்கள்.' },
    ],
    Russian: [
        { s: 0,  e: 6,  t: 'Добро пожаловать на наш сайт.' },
        { s: 6,  e: 12, t: 'Мы обеспечиваем уход за вашими питомцами.' },
        { s: 12, e: 18, t: 'Ветеринары доступны круглосуточно.' },
        { s: 18, e: 24, t: 'Записывайтесь на приём и отслеживайте здоровье.' },
        { s: 24, e: 30, t: 'Здоровье вашей собаки — наш главный приоритет.' },
        { s: 30, e: 37, t: 'Присоединяйтесь к тысячам владельцев питомцев.' },
        { s: 37, e: 44, t: 'Передовая диагностика и планы лечения.' },
        { s: 44, e: 51, t: 'Забота о каждой лапке каждый день.' },
        { s: 51, e: 58, t: 'Ощутите будущее ухода за собаками.' },
        { s: 58, e: 65, t: 'Нам доверяют более 10 000 семей по всему миру.' },
        { s: 65, e: 72, t: 'Каждая собака заслуживает лучшего ухода.' },
        { s: 72, e: 80, t: 'Начните своё путешествие с нами сегодня.' },
    ],
};

const LANGS = [
    { key: 'English', flag: '🇬🇧', short: 'EN' },
    { key: 'Tamil',   flag: '🇮🇳', short: 'IN' },
    { key: 'Russian', flag: '🇷🇺', short: 'RU' },
];

const fmt = t => { const m = Math.floor(t / 60), s = Math.floor(t % 60); return `${m}:${s < 10 ? '0' : ''}${s}`; };

// ── Window position styles (CSS-only transitions, no framer-motion layout) ────
const WIN_STYLE = {
    normal: {
        position: 'fixed', zIndex: 100,
        top: '50%', left: '50%', bottom: 'auto', right: 'auto',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 1120px)', height: 'min(85vh, 700px)',
        borderRadius: '2.5rem',
    },
    mini: {
        position: 'fixed', zIndex: 100,
        bottom: '16px', right: '16px', top: 'auto', left: 'auto',
        transform: 'none',
        width: '360px', height: 'auto',
        borderRadius: '1.25rem',
    },
    maximized: {
        position: 'fixed', zIndex: 100,
        top: '8px', left: '8px', right: '8px', bottom: '8px',
        transform: 'none', width: 'auto', height: 'auto',
        borderRadius: '1rem',
    },
};

const TRANSITION = [
    'top', 'left', 'bottom', 'right', 'width', 'height', 'border-radius', 'transform'
].map(p => `${p} .36s cubic-bezier(.4,0,.2,1)`).join(', ');

// ── Component ─────────────────────────────────────────────────────────────────
const VideoModal = ({ isOpen, onClose }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration]       = useState(0);
    const [isPlaying, setIsPlaying]     = useState(true);
    const [isMuted, setIsMuted]         = useState(false);
    const [isEnhanced, setIsEnhanced]   = useState(false);
    const [isPiP, setIsPiP]             = useState(false);
    const [winState, setWinState]       = useState('normal');

    // Subtitle state — null = off, 'English' | 'Tamil' | 'Russian' = active
    const [subLang, setSubLang]           = useState(null);
    const [showSubMenu, setShowSubMenu]   = useState(false);
    const [currentSubtitle, setCurrentSubtitle] = useState('');

    const videoRef       = useRef(null);
    const progressBarRef = useRef(null);

    // ── Mobile Controls Logic ───────────────────────────────────────────────
    const [showControls, setShowControls] = useState(false);
    useEffect(() => {
        if (!showControls) return;
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
    }, [showControls]);

    const handleVideoClick = () => { if (isMobile) setShowControls(true); };

    // ── Subtitle sync (time-based, no audio) ─────────────────────────────────
    useEffect(() => {
        if (!subLang) { setCurrentSubtitle(''); return; }
        const cue = (TRACKS[subLang] || []).find(c => currentTime >= c.s && currentTime < c.e);
        setCurrentSubtitle(cue ? cue.t : '');
    }, [currentTime, subLang]);

    // ── Reset on open / close ─────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen) {
            setIsPlaying(true);
            setIsEnhanced(false);
            setShowSubMenu(false);
            setWinState('normal');
            setSubLang(null);
            setCurrentSubtitle('');
        } else {
            setSubLang(null);
            setCurrentSubtitle('');
            setShowSubMenu(false);
        }
    }, [isOpen]);

    // ── Video handlers ────────────────────────────────────────────────────────
    const handleTimeUpdate    = () => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); };
    const handleLoadedMeta    = () => { if (videoRef.current) setDuration(videoRef.current.duration); };
    const togglePlay          = () => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause(); else videoRef.current.play();
        setIsPlaying(p => !p);
    };
    const handleProgressClick = e => {
        if (!videoRef.current || !progressBarRef.current) return;
        const r = progressBarRef.current.getBoundingClientRect();
        videoRef.current.currentTime = ((e.clientX - r.left) / r.width) * duration;
    };

    // ── Responsive Tracking ──────────────────────────────────────────────────
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;

    // ── Dynamic Window Styles ───────────────────────────────────────────────
    const currentWinStyle = {
        ...WIN_STYLE[winState],
        ...(winState === 'normal' && isMobile ? {
            width: '94vw',
            height: '90vh',
            borderRadius: '1.5rem',
        } : {})
    };

    const togglePiP = async () => {
        try {
            if (document.pictureInPictureElement) { await document.exitPictureInPicture(); setIsPiP(false); }
            else if (videoRef.current) { await videoRef.current.requestPictureInPicture(); setIsPiP(true); }
        } catch (e) { console.error(e); }
    };

    const selectLang = lang => { setSubLang(lang); setShowSubMenu(false); };
    const clearSub   = () => { setSubLang(null); setCurrentSubtitle(''); };

    const isMini = winState === 'mini';

    const tips = [
        { icon: <Heart className="text-pink-500"      size={18} />, title: 'Emotional Health', desc: 'Daily play and positive reinforcement are key.' },
        { icon: <Shield className="text-blue-500"     size={18} />, title: 'Preventive Care',  desc: 'Regular vaccinations and checkups save lives.' },
        { icon: <Stethoscope className="text-emerald-500" size={18} />, title: 'Dental Hygiene', desc: 'Brush daily to prevent periodontal disease.' },
        { icon: <Sparkles className="text-yellow-500" size={18} />, title: 'Pure Nutrition',   desc: 'Balanced diet tailored to age and breed.' },
    ];

    return (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <AnimatePresence>
                {!isMini && (
                  <motion.div key="bd"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                    style={{ zIndex: 99 }}
                    onClick={() => { onClose(); setShowSubMenu(false); }}
                  />
                )}
              </AnimatePresence>

              {/* ── Main Window ── */}
              <div
                className="bg-slate-900 border border-white/10 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
                style={{ ...currentWinStyle, transition: TRANSITION }}
                onClick={e => e.stopPropagation()}
              >
                {/* Mini title bar */}
                {isMini && (
                  <div className="flex items-center justify-between px-3 py-2.5 bg-slate-800 border-b border-white/10 shrink-0 select-none">
                    <div className="flex items-center gap-2">
                      <Video size={13} className="text-emerald-400" />
                      <span className="text-white text-xs font-bold">Dog Healthcare</span>
                      {subLang && (
                        <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase">
                          {LANGS.find(l => l.key === subLang)?.flag} CC
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setWinState('normal')} title="Restore"
                        className="w-7 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition text-xs">▢</button>
                      <button onClick={() => setWinState('maximized')} title="Maximize"
                        className="w-7 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-emerald-500 text-white/70 hover:text-white transition">
                        <Maximize2 size={12} /></button>
                      <button onClick={onClose} title="Close"
                        className="w-7 h-6 flex items-center justify-center rounded bg-red-500/70 hover:bg-red-500 text-white transition">
                        <X size={12} /></button>
                    </div>
                  </div>
                )}

                <div className={`flex overflow-hidden flex-1 ${isMini ? 'flex-col' : 'flex-col md:flex-row'}`}>

                  {/* ── VIDEO ── */}
                  <div
                    onClick={handleVideoClick}
                    className={`relative bg-black group overflow-hidden select-none flex-1 flex flex-col ${!isMini && isMobile ? 'min-h-[210px] h-[210px] shrink-0' : ''}`}
                    style={isMini ? { height: 195 } : {}}>

                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover transition-all duration-700 ${isEnhanced ? 'contrast-[1.1] brightness-[1.1] saturate-[1.2] sepia-[0.05]' : ''}`}
                      src="/Dog Care MP4.mp4"
                      autoPlay loop
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMeta}
                    />

                    {/* ── SUBTITLE OVERLAY ── */}
                    <AnimatePresence mode="wait">
                      {currentSubtitle && (
                        <motion.div
                          key={currentSubtitle}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.25 }}
                          className={`absolute left-0 right-0 flex justify-center z-20 pointer-events-none px-4 ${isMini ? 'bottom-12' : isMobile ? 'bottom-16' : 'bottom-[5.5rem]'}`}
                        >
                          <div className="bg-black/85 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 shadow-2xl max-w-[90%] text-center">
                            <span
                              className={`text-white font-semibold leading-snug drop-shadow-lg ${isMini || isMobile ? 'text-[13px]' : 'text-sm md:text-[15px]'}`}
                              style={{ fontFamily: subLang === 'Tamil' ? "'Noto Sans Tamil', sans-serif" : 'inherit' }}
                            >
                              {currentSubtitle}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active subtitle badge */}
                    {subLang && !isMini && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="absolute top-[4.5rem] left-6 z-20 flex items-center gap-2 bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-400/30 shadow-lg"
                      >
                        <Languages size={12} className="text-white" />
                        <span className="text-[10px] text-white font-black tracking-widest uppercase">
                          {LANGS.find(l => l.key === subLang)?.flag} {subLang} Subtitles
                        </span>
                        <button onClick={clearSub} className="ml-1 text-white/60 hover:text-white transition">
                          <X size={10} />
                        </button>
                      </motion.div>
                    )}

                    {/* Gradient + controls */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 transition-opacity duration-300 ${isMini || (isMobile && showControls) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

                      {/* TOP control bar (not mini) */}
                      {!isMini && (
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isEnhanced ? 'bg-yellow-400 text-slate-900' : 'bg-emerald-500 text-white'}`}>
                              <Video size={isMobile ? 14 : 16} />
                            </div>
                            <span className="text-[9px] md:text-[10px] uppercase font-black text-white tracking-[0.2em] bg-white/10 backdrop-blur-md px-2 md:px-3 py-1.5 rounded-full border border-white/20">
                              8K ULTRA HD
                            </span>
                            {subLang && (
                              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                className="text-[9px] md:text-[10px] font-black text-blue-300 tracking-[0.15em] bg-blue-500/10 backdrop-blur-md px-2 md:px-3 py-1.5 rounded-full border border-blue-400/20">
                                CC · {LANGS.find(l => l.key === subLang)?.flag} {isMobile ? LANGS.find(l => l.key === subLang)?.short : subLang}
                              </motion.span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* PiP */}
                            <button onClick={togglePiP} title="Picture in Picture"
                              className={`p-2 rounded-xl transition-all ${isPiP ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}>
                              <MonitorPlay size={17} />
                            </button>

                            {/* Minimize */}
                            <button onClick={() => setWinState('mini')} title="Minimize to mini-player"
                              className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-amber-500 hover:text-white transition-all">
                              <Minimize2 size={17} />
                            </button>

                            {/* Maximize / Restore */}
                            <button
                              onClick={() => setWinState(s => s === 'maximized' ? 'normal' : 'maximized')}
                              title={winState === 'maximized' ? 'Restore' : 'Maximize'}
                              className={`p-2 rounded-xl transition-all ${winState === 'maximized' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/70 hover:bg-emerald-600 hover:text-white'}`}>
                              <Square size={17} />
                            </button>

                            {/* Subtitle language picker */}
                            <div className="relative">
                              <button
                                onClick={() => setShowSubMenu(v => !v)}
                                title="Subtitles / CC"
                                className={`p-2 rounded-xl transition-all relative ${showSubMenu || subLang ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}>
                                <Languages size={17} />
                                {subLang && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />}
                              </button>

                              {/* Subtitle dropdown */}
                              <AnimatePresence>
                                {showSubMenu && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 6 }}
                                    className="absolute top-12 right-0 w-48 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl z-[130]"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <div className="px-4 py-2.5 border-b border-white/10">
                                      <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Subtitles / CC</span>
                                    </div>
                                    {/* Off option */}
                                    <button
                                      onClick={() => { clearSub(); setShowSubMenu(false); }}
                                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${!subLang ? 'bg-blue-600/20 text-blue-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                    >
                                      <span className="font-semibold">Off</span>
                                      {!subLang && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                    </button>
                                    {/* Language options */}
                                    {LANGS.map(l => (
                                      <button key={l.key}
                                        onClick={() => selectLang(l.key)}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${subLang === l.key ? 'bg-blue-600/20 text-blue-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                      >
                                        <span className="flex items-center gap-2.5">
                                          <span className="text-base">{l.flag}</span>
                                          <span className="font-semibold">{l.key}</span>
                                        </span>
                                        {subLang === l.key && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* Bottom playback bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div ref={progressBarRef} onClick={handleProgressClick}
                          className="relative h-1 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-blue-500"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%`, transition: 'width .1s linear' }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition active:scale-90">
                              {isPlaying ? <Pause size={isMini ? 20 : 24} fill="currentColor" /> : <Play size={isMini ? 20 : 24} fill="currentColor" />}
                            </button>
                            <button onClick={() => setIsMuted(m => !m)} className="text-white/80 hover:text-white transition">
                              {isMuted ? <VolumeX size={isMini ? 15 : 19} /> : <Volume2 size={isMini ? 15 : 19} />}
                            </button>
                            {!isMini && (
                              <span className="text-xs font-black text-white/70 font-mono">{fmt(currentTime)} / {fmt(duration)}</span>
                            )}
                          </div>
                          {!isMini ? (
                            <button onClick={() => setIsEnhanced(e => !e)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${isEnhanced ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}>
                              <Sparkles size={11} fill={isEnhanced ? 'currentColor' : 'none'} /> SMART ENHANCE
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button onClick={() => setWinState('normal')} title="Restore"
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"><Square size={13} /></button>
                              <button onClick={() => setWinState('maximized')} title="Maximize"
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-600 text-white/70 hover:text-white transition"><Maximize2 size={13} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hero text */}
                    {!isMini && (
                      <div className="absolute bottom-[5.5rem] left-6 text-white max-w-sm hidden md:block pointer-events-none drop-shadow-2xl">
                        <h3 className="text-2xl font-black italic tracking-tight opacity-90">Caring for Every Paw.</h3>
                        <p className="text-slate-300 text-xs mt-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl inline-block border border-white/5">
                          Experience the future of dog healthcare.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── SIDEBAR ── */}
                  {!isMini && (
                    <div className="w-full md:w-80 bg-white flex flex-col overflow-y-auto shrink-0 flex-1 md:flex-none">
                      <div className={`${isMobile ? 'p-5' : 'p-6'} flex-1`}>
                        <div className={`flex items-center justify-between ${isMobile ? 'mb-5' : 'mb-7'}`}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-2xl"><Sparkles className="text-yellow-400" size={17} /></div>
                            <h4 className="font-black text-slate-900 text-base uppercase tracking-tight">Quick Care Tips</h4>
                          </div>
                          <motion.button
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="text-slate-950/40 hover:text-black transition-colors p-1"
                          >
                            <X size={20} strokeWidth={3} />
                          </motion.button>
                        </div>
                        <div className="space-y-5">
                          {tips.map((tip, i) => (
                            <motion.div key={i} initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.07 * i }} className="group cursor-default">
                              <div className="flex items-start gap-4">
                                <div className="mt-0.5 transform group-hover:scale-125 group-hover:rotate-6 transition duration-500">{tip.icon}</div>
                                <div>
                                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-tight mb-0.5 group-hover:text-blue-600 transition">{tip.title}</h5>
                                  <p className="text-slate-500 text-[11px] leading-5">{tip.desc}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* ── Subtitle Language Picker in sidebar ── */}
                        <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Languages size={13} className="text-blue-600" />
                              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Subtitles / CC</span>
                            </div>
                            {subLang && (
                              <button onClick={clearSub} className="text-[10px] text-slate-400 hover:text-red-500 font-bold transition uppercase">Off</button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {LANGS.map(l => (
                              <button key={l.key} onClick={() => setSubLang(subLang === l.key ? null : l.key)}
                                className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all border
                                  ${subLang === l.key
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
                              >
                                <span className="text-lg">{l.flag}</span>
                                <span className="mt-0.5">{l.key}</span>
                              </button>
                            ))}
                          </div>
                          <p className={`text-[10px] mt-2 text-center font-semibold ${subLang ? 'text-blue-600' : 'text-slate-400'}`}>
                            {subLang
                              ? `● ${LANGS.find(l => l.key === subLang)?.flag} ${subLang} subtitles active`
                              : 'Select a language to show subtitles'}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <button onClick={onClose}
                          className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-[1.2rem] transition shadow-[0_16px_32px_-8px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 group uppercase tracking-widest text-xs">
                          Get Started <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
    );
};

export default VideoModal;
