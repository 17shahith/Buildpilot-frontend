import React from 'react';
import { ArrowRight, Cpu, Eye, Sparkles, Shield, Wrench, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InteractiveGraph } from '../../../components/charts/InteractiveGraph';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
  setMarketplaceSearch: (search: string) => void;
  setMarketplaceRole: (role: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView: _setCurrentView }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-0.5 bg-[#F97316]"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F97316]">
                INTELLIGENT • SECURE • CONNECTED
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-[#0F172A] font-display">
              BUILDING A <br />
              SMARTER WAY TO <br />
              <span className="text-[#F97316]">PLAN & VISUALIZE</span>
            </h1>
            <p className="text-gray-600 font-medium text-sm sm:text-base max-w-lg leading-relaxed">
              Scan spaces in AR, generate instant AI construction estimates, and hire verified property professionals on a single premium escrow-secured platform.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-gray-300 hover:border-[#F97316] text-gray-700 hover:text-[#F97316] font-bold text-xs uppercase tracking-wider transition-all bg-white"
              >
                <span>Explore Features</span>
              </button>
            </div>
          </div>

          {/* Right Hero Interactive Graph */}
          <div className="lg:col-span-5 relative h-[380px] w-full flex justify-center items-center">
            <InteractiveGraph preset="landing" interactive={true} />
          </div>
        </div>
      </section>

      {/* Features / Modules Section */}
      <section id="features-section" className="bg-slate-50 py-24 border-t border-slate-100">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AI Cost Estimator</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Instantly compute concrete, steel, and total budget estimates based on floors, materials, and regional index data.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AR Space Scanner</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Leverage web-based AR space scanning to dynamically calculate dimensions and preview materials instantly on-device.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">AI Interior Studio</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Re-imagine rooms and interior designs using intelligent image-to-image neural style transfer.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Verified Marketplace</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Match with licensed, verified structural engineers, architects, and general contractors using regional audit verification.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Property Listing Hub</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Explore and buy or lease verified plots and property structures cataloged with full structural assessments.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#F97316] transition-all flex flex-col justify-between h-72 shadow-sm group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide uppercase text-[#0F172A]">Milestone Escrow Protection</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                  Lock and release development funds dynamically based on digital verification parameters of structural progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Network Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
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
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
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
              { step: '01', title: 'Scope Input', desc: 'Define your area size, floor details, and basic specifications.' },
              { step: '02', title: 'AI Calculation', desc: 'Our engine parses cost index databases to return instant estimates.' },
              { step: '03', title: 'AR Spatial Scan', desc: 'Scan interior environments to accurately map material volumes.' },
              { step: '04', title: 'Match Experts', desc: 'Connect with verified design and construction professionals.' },
              { step: '05', title: 'Escrow Launch', desc: 'Fund milestones securely and track structural deliverables.' },
            ].map((step, i) => (
              <div key={i} className="space-y-3 relative p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-4xl font-black text-[#F97316]/20 block">{step.step}</span>
                <h4 className="text-sm font-extrabold text-[#0F172A]">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-slate-50 py-24 border-t border-b border-slate-100">
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-sm font-extrabold text-[#0F172A]">Firebase SSO Protection</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Single Sign-On leveraging secure client credentials avoids credential interception.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-sm font-extrabold text-[#0F172A]">Scoped Permissions</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Escrow, marketplace, and design assets are isolated based on verified role permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
          <h2 className="text-4xl font-black text-[#0F172A]">
            READY TO GET STARTED?
          </h2>
          <p className="text-gray-500 font-semibold text-sm max-w-md mx-auto">
            Authorize your profile to unlock cost estimation, AR space tools, and verified marketplaces.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
