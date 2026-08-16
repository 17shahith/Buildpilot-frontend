import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-150 py-16 text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-0.5 h-6">
                <div className="w-2 bg-[#F97316] rounded-t" style={{ height: '50%' }}></div>
                <div className="w-2 bg-[#F97316] rounded-t" style={{ height: '100%' }}></div>
                <div className="w-2 bg-[#F97316] rounded-t" style={{ height: '70%' }}></div>
              </div>
              <span className="text-[#0F172A] font-black text-lg tracking-tight font-display">
                Build<span className="text-[#F97316]">Core</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              BuildCore is a heavy construction company delivering world-class infrastructure and building projects with integrity and excellence.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {['facebook', 'linkedin', 'instagram', 'youtube'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                  title={platform}
                >
                  <span className="text-[10px] uppercase font-bold">{platform.substring(0, 2)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#0F172A] font-extrabold text-xs uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs uppercase font-extrabold tracking-wider text-gray-400">
              <li><a href="#" className="hover:text-[#F97316]">About Us</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Services</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Projects</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Safety</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Careers</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#0F172A] font-extrabold text-xs uppercase tracking-widest mb-4">Services</h4>
            <ul className="space-y-2 text-xs uppercase font-extrabold tracking-wider text-gray-400">
              <li><a href="#" className="hover:text-[#F97316]">Heavy Construction</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Infrastructure</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Earthwork</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Concrete Work</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Steel Structures</a></li>
              <li><a href="#" className="hover:text-[#F97316]">Project Management</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-3 text-xs sm:text-sm text-gray-400 font-semibold">
            <h4 className="text-[#0F172A] font-extrabold text-xs uppercase tracking-widest mb-4">Contact Us</h4>
            <div className="flex items-start space-x-2">
              <span className="text-[#F97316]">📍</span>
              <span>1234 BuildCore Drive, Houston, TX 77001</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#F97316]">📞</span>
              <span>(713) 555-0198</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#F97316]">✉️</span>
              <span>info@buildcore.com</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#F97316]">🕒</span>
              <span>Mon - Fri: 7:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-150 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-semibold">
          <p>© {new Date().getFullYear()} BuildCore Construction. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-[#F97316]">Privacy Policy</a>
            <a href="#" className="hover:text-[#F97316]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
