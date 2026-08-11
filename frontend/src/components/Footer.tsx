import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.9 }
    });
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 5000);
  };

  return (
    <footer className="relative border-t border-brandDark-border bg-brandDark-black text-gray-400 py-16 transition-colors duration-500 overflow-hidden light-theme:bg-gradient-to-b light-theme:from-brandLight-panel light-theme:to-white light-theme:border-brandLight-border/50 light-theme:text-gray-600">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
                <span className="text-white font-extrabold text-sm font-display">B</span>
              </div>
              <span className="text-white light-theme:text-brandDark-black font-extrabold text-lg tracking-tight font-display">
                BuildBridge
              </span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed">
              The AI + AR Construction and Property Marketplace. We bridge the gap between homeowners, architects, general contractors, and professional property services globally.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-brandDark-charcoal hover:bg-primary hover:text-white transition-all light-theme:bg-brandLight-slate light-theme:hover:bg-primary" title="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-brandDark-charcoal hover:bg-primary hover:text-white transition-all light-theme:bg-brandLight-slate light-theme:hover:bg-primary" title="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-brandDark-charcoal hover:bg-primary hover:text-white transition-all light-theme:bg-brandLight-slate light-theme:hover:bg-primary" title="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-brandDark-charcoal hover:bg-primary hover:text-white transition-all light-theme:bg-brandLight-slate light-theme:hover:bg-primary" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Group 1 */}
          <div>
            <h4 className="text-white light-theme:text-brandDark-black font-semibold text-sm uppercase tracking-wider mb-4 font-display">
              Marketplaces
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Architect Directory</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Structural Engineers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">General Contractors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Local Handymen</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Property Listings</a></li>
            </ul>
          </div>

          {/* Quick Links Group 2 */}
          <div>
            <h4 className="text-white light-theme:text-brandDark-black font-semibold text-sm uppercase tracking-wider mb-4 font-display">
              AI Tools & AR
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Cost Estimator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Quotation Engine</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Defect Scanner</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AR Camera Sandbox</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Smart Room Planner</a></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4">
            <h4 className="text-white light-theme:text-brandDark-black font-semibold text-sm uppercase tracking-wider mb-2 font-display">
              Stay Updated
            </h4>
            <p className="text-xs leading-relaxed">
              Get the latest property market analysis, building cost changes, and feature updates.
            </p>
            {submitted ? (
              <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-xl font-medium animate-pulse">
                ✓ Thank you! You've been subscribed.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full bg-brandDark-charcoal border border-brandDark-border rounded-xl pl-10 pr-12 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors light-theme:bg-white light-theme:border-brandLight-border light-theme:text-brandDark-black"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && <p className="text-red-500 text-[10px] mt-1.5 font-medium ml-1">{error}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-brandDark-border mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0 light-theme:border-brandLight-border">
          <p>© {new Date().getFullYear()} BuildBridge Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Controls</a>
            <a href="#" className="hover:text-primary transition-colors">API Keys</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
