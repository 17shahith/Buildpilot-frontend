import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Cpu, Eye, Sparkles, Shield, Wrench, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InteractiveGraph } from '../../../components/charts/InteractiveGraph';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
  setMarketplaceSearch: (search: string) => void;
  setMarketplaceRole: (role: string) => void;
}

// 3D Tilt Wrapper for Premium depth effect with dynamic glare reflection
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
    setGlarePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden ${className || ''}`}
    >
      {/* Premium cursor glare reflection overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle 140px at ${glarePos.x}% ${glarePos.y}%, rgba(249, 115, 22, 0.12), transparent 75%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      <div style={{ transform: "translateZ(10px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

// Animated Statistics / Steps Number Counter Component
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 1000;
    const incrementTime = Math.max(Math.floor(totalDuration / end), 50);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count < 10 ? `0${count}` : count}</span>;
};

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView: _setCurrentView }) => {
  const navigate = useNavigate();

  // Mouse Parallax values for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { damping: 40, stiffness: 80 });
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { damping: 40, stiffness: 80 });

  const visualX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), { damping: 40, stiffness: 80 });
  const visualY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 40, stiffness: 80 });

  const textX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { damping: 40, stiffness: 80 });
  const textY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-4, 4]), { damping: 40, stiffness: 80 });

  // Entrance variants using premium custom decel cubic bezier
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const heroTextLineVariants = {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  // Scroll Reveal variants with polished vertical translation and scale
  const scrollRevealVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  // Card stagger reveal variants
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28"
      >
        {/* Subtle decorative background motion particles / glows using existing palette (very light orange/slate glows) */}
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-orange-50/40 blur-3xl pointer-events-none -z-10"
        />
        <motion.div
          style={{ x: bgY, y: bgX }}
          className="absolute bottom-12 right-12 w-96 h-96 rounded-full bg-slate-50/50 blur-3xl pointer-events-none -z-10"
        />

        {/* Floating background decorative shape 1: Organic rotating square border */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/3 w-16 h-16 rounded-3xl border border-orange-200/25 pointer-events-none -z-10"
        />

        {/* Floating background decorative shape 2: Drifting glow dot */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -35, 35, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-[#F97316]/25 pointer-events-none -z-10"
        />

        {/* Floating background decorative shape 3: Drifting ring */}
        <motion.div
          animate={{
            x: [0, -25, 25, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-12 w-6 h-6 rounded-full border border-slate-350/40 pointer-events-none -z-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ x: textX, y: textY }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div variants={heroItemVariants} className="flex items-center space-x-2">
              {/* Floating accent line */}
              <motion.span
                animate={{ width: [32, 48, 32] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="h-0.5 bg-[#F97316]"
              ></motion.span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
                INTELLIGENT • SECURE • CONNECTED
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-[#0F172A] font-display flex flex-col space-y-1 sm:space-y-2"
            >
              <div className="overflow-hidden block w-full">
                <motion.span className="block" variants={heroTextLineVariants} initial="hidden" animate="visible">BUILDING A</motion.span>
              </div>
              <div className="overflow-hidden block w-full">
                <motion.span className="block" variants={heroTextLineVariants} initial="hidden" animate="visible">SMARTER WAY TO</motion.span>
              </div>
              <div className="overflow-hidden block w-full">
                <motion.span className="block text-[#F97316]" variants={heroTextLineVariants} initial="hidden" animate="visible">PLAN & VISUALIZE</motion.span>
              </div>
            </motion.h1>

            <motion.p 
              variants={heroItemVariants} 
              className="text-gray-600 font-medium text-sm sm:text-base max-w-lg leading-relaxed"
            >
              Scan spaces in AR, generate instant AI construction estimates, and hire verified property professionals on a single premium escrow-secured platform.
            </motion.p>

            <motion.div variants={heroItemVariants} className="flex flex-wrap gap-4 pt-4">
              <motion.button
                onClick={() => navigate('/auth')}
                whileHover={{ y: -3, scale: 1.025, boxShadow: '0 12px 30px -5px rgba(249, 115, 22, 0.35)' }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#F97316] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/10"
              >
                <span>Get Started</span>
                {/* Micro interaction on Icon */}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ y: -3, scale: 1.025, boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.08)' }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all bg-white"
              >
                <span>Explore Features</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Hero Interactive Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] as any }}
            style={{ x: visualX, y: visualY }}
            className="lg:col-span-5 relative h-[380px] w-full flex justify-center items-center"
          >
            <InteractiveGraph preset="landing" interactive={true} />
          </motion.div>
        </div>
      </section>

      {/* Features / Modules Section */}
      <motion.section
        id="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollRevealVariants}
        className="bg-slate-50 py-24 border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Powerful Application Modules
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Our intelligent suite connects builders, property owners, and service professionals with modern planning tools.
            </p>
          </div>

          <motion.div
            variants={cardContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    {/* Micro-interaction icon scaling */}
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AI Cost Estimator</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Instantly compute concrete, steel, and total budget estimates based on floors, materials, and regional index data.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AR Space Scanner</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Leverage web-based AR space scanning to dynamically calculate dimensions and preview materials instantly on-device.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AI Interior Studio</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Re-imagine rooms and interior designs using intelligent image-to-image neural style transfer.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Verified Marketplace</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Match with licensed, verified structural engineers, architects, and general contractors using regional audit verification.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Property Listing Hub</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Explore and buy or lease verified plots and property structures cataloged with full structural assessments.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={cardItemVariants} className="h-72">
              <TiltCard className="h-full w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between h-full shadow-sm hover:shadow-xl group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Milestone Escrow Protection</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                      Lock and release development funds dynamically based on digital verification parameters of structural progress.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Ecosystem Network Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollRevealVariants}
        className="py-20 bg-slate-50 border-t border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
              CONNECTED PLATFORM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Interactive Construction Ecosystem
            </h2>
            <p className="text-gray-650 text-sm font-semibold text-gray-500">
              Explore how BuildPilot connects all stages of construction project execution. Hover over any node to inspect descriptions and tools.
            </p>
          </div>
          <div className="h-[500px] w-full shadow-lg rounded-3xl bg-white p-4">
            <InteractiveGraph preset="landing" />
          </div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollRevealVariants}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: 1, title: 'Scope Input', desc: 'Define your area size, floor details, and basic specifications.' },
              { step: 2, title: 'AI Calculation', desc: 'Our engine parses cost index databases to return instant estimates.' },
              { step: 3, title: 'AR Spatial Scan', desc: 'Scan interior environments to accurately map material volumes.' },
              { step: 4, title: 'Match Experts', desc: 'Connect with verified design and construction professionals.' },
              { step: 5, title: 'Escrow Launch', desc: 'Fund milestones securely and track structural deliverables.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-3 relative p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-md transition-shadow duration-300"
              >
                {/* Stats Counter Animation */}
                <span className="text-4xl font-black text-[#F97316]/20 block">
                  <AnimatedCounter value={step.step} />
                </span>
                <h4 className="text-sm font-extrabold text-[#0F172A]">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollRevealVariants}
        className="bg-slate-50 py-24 border-t border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
                Secure Portal Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                Enterprise Identity Protection
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-semibold">
                Access is protected by secure Google Authentication powered by Firebase Identity management, keeping your structural parameters and financial escrow data fully isolated.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 hover:shadow-md transition-all duration-300">
                <h4 className="text-sm font-extrabold text-[#0F172A]">Firebase SSO Protection</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Single Sign-On leveraging secure client credentials avoids credential interception.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 hover:shadow-md transition-all duration-300">
                <h4 className="text-sm font-extrabold text-[#0F172A]">Scoped Permissions</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Escrow, marketplace, and design assets are isolated based on verified role permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scrollRevealVariants}
        className="py-24 bg-white text-center"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
          <h2 className="text-4xl font-black text-[#0F172A]">
            READY TO GET STARTED?
          </h2>
          <p className="text-gray-500 font-semibold text-sm max-w-md mx-auto">
            Authorize your profile to unlock cost estimation, AR space tools, and verified marketplaces.
          </p>
          <motion.button
            onClick={() => navigate('/auth')}
            whileHover={{ y: -2, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.25)' }}
            whileTap={{ scale: 0.98, y: 0 }}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#F97316] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <span>Get Started</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
