import React, { useState } from 'react';
import { Search, MapPin, Building, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
  setMarketplaceSearch: (search: string) => void;
  setMarketplaceRole: (role: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  setMarketplaceTab,
  setMarketplaceSearch,
  setMarketplaceRole,
}) => {
  const [searchCategory, setSearchCategory] = useState('Architects');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCategory === 'Properties') {
      setMarketplaceTab('properties');
      setMarketplaceRole('');
    } else {
      setMarketplaceTab('pros');
      if (searchCategory === 'Architects') {
        setMarketplaceRole('Architect');
      } else if (searchCategory === 'Engineers') {
        setMarketplaceRole('Engineer');
      } else if (searchCategory === 'Contractors') {
        setMarketplaceRole('Contractor');
      } else {
        setMarketplaceRole('');
      }
    }
    setMarketplaceSearch(searchLocation);
    setCurrentView('marketplace');
  };

  const faqs = [
    { q: "How accurate is the AI Construction Cost Estimator?", a: "Our AI estimator parses regional cost databases, materials index rates, and property configurations. It is roughly 92% accurate for structural foundation, brickwork, and utility framing costs in supported metropolitan regions, adjusting dynamically for Standard, Premium, or Luxury specifications." },
    { q: "Do I need special hardware to run the AR Visualizer?", a: "No special hardware is required! The AR space scanning and auto-measuring is fully supported on standard iOS and Android devices running Chrome or Safari browsers through WebXR technology. Laptops and desktops fall back to our interactive 3D WebGL simulator." },
    { q: "Are the engineers and contractors verified on BuildBridge?", a: "Yes, 100%. Every professional listed on BuildBridge undergoes strict license authentication, proof of insurance, identity checks, and structural history audits before gaining the orange verified badge." },
    { q: "How are payment commissions handled?", a: "BuildBridge operates on a transparent escrow system. Homeowners deposit milestones into our secure portal, and payouts are automatically dispersed via secure gateway once structural stages are verified by our site auditors." }
  ];

  return (
    <div className="relative overflow-hidden w-full pb-20">
      {/* Decorative ambient blobs */}
      <div className="ambient-glow top-[15%] left-[5%]"></div>
      <div className="ambient-glow-secondary top-[40%] right-[10%]"></div>
      <div className="absolute top-[8%] right-[15%] w-80 h-80 orange-accent-ring animate-pulse-slow opacity-15"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Copy and actions) */}
          <motion.div 
            className="lg:col-span-7 text-left space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="space-y-4"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider font-display">
                <span>✨ Introducing BuildBridge AI v1.4</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] font-display text-brandDark-black">
                Connecting Vision & <br/>
                <span className="bg-gradient-to-r from-primary via-primary-light to-brandDark-black bg-clip-text text-transparent">
                  Execution
                </span>
              </h1>
              <p className="text-gray-600 font-medium text-sm sm:text-base max-w-lg leading-relaxed">
                Scan rooms in AR, generate automated material quotes in seconds, and book verified structural architects, engineers, and general contractors instantly on one premium platform.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => setCurrentView('marketplace')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Hire a Pro →
              </button>
              <button
                onClick={() => setCurrentView('estimator')}
                className="px-6 py-3.5 rounded-xl border border-brandLight-border bg-white text-gray-700 font-bold text-xs uppercase tracking-wider hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
              >
                AI Cost Estimator
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column (Circular graphics & Portrait layout from Ripon Ahmed's design) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Background Circles */}
            <div className="absolute w-72 h-72 rounded-full border border-primary/10 animate-pulse-slow"></div>
            <div className="absolute w-96 h-96 rounded-full border border-brandLight-border/60"></div>
            
            {/* Floating circular accents */}
            <div className="absolute top-10 left-6 w-4 h-4 rounded-full border border-primary/40"></div>
            <div className="absolute bottom-12 right-4 w-6 h-6 rounded-full border border-primary/30"></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ duration: 0.7, ease: 'easeOut', y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="relative w-80 h-80 flex items-center justify-center"
            >
              {/* Thick glowing orange border background circle */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-primary to-primary-dark opacity-10 blur-xl"></div>
              <div className="absolute w-[260px] h-[260px] rounded-full border-[8px] border-primary/10 bg-primary"></div>

              {/* Verified Professional Image Overlay */}
              <div className="absolute w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300"
                  alt="Ripon Ahmed Portfolio"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Social cards stack overlay matching Ripon Ahmed */}
              <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 bg-white border border-brandLight-border px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2.5 z-20 whitespace-nowrap">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">FOLLOW PRO ON:</span>
                <div className="flex space-x-1.5">
                  <a href="#" className="p-1 rounded text-gray-400 hover:text-primary hover:bg-brandLight-slate transition-all" title="LinkedIn">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="p-1 rounded text-gray-400 hover:text-primary hover:bg-brandLight-slate transition-all" title="Twitter">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="p-1 rounded text-gray-400 hover:text-primary hover:bg-brandLight-slate transition-all" title="GitHub">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI-Powered Search bar bottom container */}
        <div className="mt-12">
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="max-w-7xl mx-auto p-2.5 rounded-3xl bg-white border border-brandLight-border shadow-2xl flex flex-col md:flex-row gap-2 z-10 glass-panel focus-within:ring-2 focus-within:ring-primary/50 transition-shadow duration-300"
          >
            {/* Category selection */}
            <div className="flex-1 flex items-center px-4 py-2 border-r border-brandLight-border/60 md:border-r last:border-0">
              <Building className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Service Category</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-brandDark-black focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="Architects" className="bg-white">Architects</option>
                  <option value="Engineers" className="bg-white">Structural Engineers</option>
                  <option value="Contractors" className="bg-white">General Contractors</option>
                  <option value="Properties" className="bg-white">Properties (Buy/Rent)</option>
                </select>
              </div>
            </div>

            {/* Location field */}
            <div className="flex-1 flex items-center px-4 py-2 border-r border-brandLight-border/60 md:border-r last:border-0">
              <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location / ZIP</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-brandDark-black focus:outline-none placeholder-gray-400 mt-0.5"
                />
              </div>
            </div>

            {/* Budget filter */}
            <div className="flex-1 flex items-center px-4 py-2 last:border-0">
              <Search className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Budget Max (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-brandDark-black focus:outline-none placeholder-gray-400 mt-0.5"
                />
              </div>
            </div>

            {/* Search Trigger */}
            <button
              type="submit"
              className="md:px-8 py-4 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl transition-all duration-200 shadow-glow flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Platform</span>
            </button>
          </motion.form>
        </div>
      </section>

      {/* Grid Quick CTA Actions - Stripe/Apple style grids */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "AI Cost Estimator", desc: "Build & structural budget", color: "from-orange-500/10 to-transparent", view: "estimator", actionText: "Estimate Now", tab: null, role: null },
            { title: "AR Visualiser", desc: "3D camera scanner", color: "from-blue-500/10 to-transparent", view: "ar", actionText: "Scan Spaces", tab: null, role: null },
            { title: "Hire Architects", desc: "Find top design experts", color: "from-green-500/10 to-transparent", view: "marketplace", actionText: "View Directory", tab: 'pros', role: 'Architect' },
            { title: "Explore Properties", desc: "Buy or rent local lots", color: "from-purple-500/10 to-transparent", view: "marketplace", actionText: "Search Plots", tab: 'properties', role: '' }
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, borderColor: '#FF5722' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => {
                if (action.view === 'marketplace') {
                  if (action.tab) setMarketplaceTab(action.tab as any);
                  setMarketplaceSearch('');
                  setMarketplaceRole(action.role || '');
                }
                setCurrentView(action.view);
              }}
              className="group cursor-pointer rounded-3xl p-6 border border-brandDark-border/60 bg-brandDark-charcoal/50 hover:bg-brandDark-charcoal transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48 glass-panel hover-lift light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-30 group-hover:opacity-60 transition-opacity`}></div>
              <div className="relative space-y-2">
                <h3 className="text-white light-theme:text-brandDark-black font-bold text-lg font-display">{action.title}</h3>
                <p className="text-gray-400 light-theme:text-gray-500 text-xs sm:text-sm font-medium leading-tight">{action.desc}</p>
              </div>
              <div className="relative flex items-center space-x-2 text-xs text-primary font-bold tracking-wider uppercase pt-4">
                <span>{action.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Service Modules Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 relative space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white light-theme:text-brandDark-black">
            Platform Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium light-theme:text-gray-500">
            A comprehensive suite of modern software modules facilitating property construction, renovation, and purchase workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Quantity Calculator",
              desc: "Inputs dimension fields and returns precise volumes for cement, sand, brick layout, aggregates, and paints. Reduces material buying surplus by over 15%.",
              badge: "Cost Optimization"
            },
            {
              title: "Defect Scanner Engine",
              desc: "Upload site photos to check dynamic foundation settled cracks or brick defects. Recommends fast structural epoxies and provides immediate contractor estimates.",
              badge: "Image Analysis"
            },
            {
              title: "Escrow Milestone Payouts",
              desc: "Deploy funds securely. Payments are released to general contractors, plumbers, and carpenters only when digital architectural milestones are certified.",
              badge: "Financial Security"
            }
          ].map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              key={idx}
              className="p-8 rounded-3xl border border-brandDark-border/60 bg-brandDark-charcoal/40 hover-card glass-panel hover-lift flex flex-col justify-between h-72 light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
            >
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {item.badge}
                </span>
                <h3 className="text-white light-theme:text-brandDark-black font-extrabold text-lg font-display">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 light-theme:text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-primary font-bold cursor-pointer group pt-4">
                <span>Learn details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Trust & Safety Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-10 rounded-3xl border border-brandDark-border/60 bg-brandDark-charcoal/20 glass-panel text-center light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
          {[
            { value: "₹100Cr+", label: "Escrow Payouts Secured" },
            { value: "48,000+", label: "AI Estimates Generated" },
            { value: "500+", label: "Verified Architecture Experts" },
            { value: "98.7%", label: "Platform Uptime Score" }
          ].map((stat, i) => (
            <div key={i} className="space-y-1.5">
              <p className="text-4xl sm:text-5xl font-black font-display text-primary tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider light-theme:text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQS section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 relative space-y-10">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-primary mx-auto" />
          <h2 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-400 font-medium light-theme:text-gray-500">
            Got queries? We have answers. Find key details about tools and safety.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-brandDark-border/60 bg-brandDark-charcoal/30 overflow-hidden transition-all light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-white hover:text-primary transition-colors focus:outline-none light-theme:text-brandDark-black"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${faqOpen === index ? 'rotate-180 text-primary' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {faqOpen === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-xs sm:text-sm text-gray-400 light-theme:text-gray-500 leading-relaxed font-medium border-t border-brandDark-border/40 light-theme:border-brandLight-border/40 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
