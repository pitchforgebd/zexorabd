import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, ChevronRight } from 'lucide-react';
import { useDivisionsList } from '../lib/useDivisions';
import { useSiteInfo } from '../lib/useSiteSettings';

export default function Footer() {
  const { divisions } = useDivisionsList();
  const info = useSiteInfo();
  const whatsappDigits = info.whatsapp.replace(/\D/g, '');

  return (
    <footer className="relative bg-[#0A0D14] text-white pt-20 pb-10 border-t border-gray-800/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1: About */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <Link to="/" className="inline-block mb-6 group">
              <img
                src={info.logo}
                alt={info.companyName}
                className="h-14 w-auto brightness-0 invert group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {info.tagline}
            </p>
            <div className="flex space-x-3">
              {info.social.facebook && (
                <a href={info.social.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-primary-blue border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-lg transition-all duration-300 group">
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {info.social.instagram && (
                <a href={info.social.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-primary-blue border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-lg transition-all duration-300 group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {info.social.linkedin && (
                <a href={info.social.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-primary-blue border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-lg transition-all duration-300 group">
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {info.social.youtube && (
                <a href={info.social.youtube} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-red-600 border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-lg transition-all duration-300 group">
                  <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Divisions */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold mb-6 flex items-center text-white">
              <span className="w-2 h-2 bg-primary-blue rounded-full mr-3"></span>
              Our Divisions
            </h4>
            <ul className="space-y-3">
              {divisions.map((div) => (
                <li key={div.id}>
                  <Link to={`/divisions/${div.slug}`} className="group flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 text-primary-blue transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">{div.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold mb-6 flex items-center text-white">
              <span className="w-2 h-2 bg-primary-blue rounded-full mr-3"></span>
              Contact Info
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-primary-blue/20 group-hover:border-primary-blue/30 transition-colors shrink-0">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-primary-blue transition-colors" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Us</span>
                  <a href={`mailto:${info.email}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                    {info.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-primary-blue/20 group-hover:border-primary-blue/30 transition-colors shrink-0">
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-primary-blue transition-colors" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Call Us</span>
                  <a href={`tel:${info.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                    {info.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-primary-blue/20 group-hover:border-primary-blue/30 transition-colors shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-blue transition-colors" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Head Office</span>
                  <span className="text-gray-300 text-sm font-medium leading-relaxed">
                    {info.address}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp QR */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-end justify-center">
            <h4 className="text-lg font-semibold mb-6 flex items-center text-white w-full lg:justify-end">
              Connect on WhatsApp
            </h4>
            <div className="bg-white p-3 rounded-2xl shadow-xl w-40 h-40 flex items-center justify-center group overflow-hidden relative">
              <div className="absolute inset-0 bg-primary-blue/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <img
                src={
                  info.whatsappQrImage ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/${whatsappDigits}`
                }
                alt="WhatsApp QR Code"
                className="w-full h-full object-contain rounded-xl relative z-10"
                onError={(e) => {
                  /* A custom-uploaded QR (Website Settings) is used as-is if
                     set; otherwise generated live from the WhatsApp number,
                     so it's always correct. Falls back to the static file
                     only if the active source is ever unreachable. */
                  const target = e.target as HTMLImageElement;
                  target.src = "/whatsapp-qr.png";
                }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center lg:text-right">
              Scan to chat with us instantly
            </p>
          </div>
        </div>

        {/* Quick Links bottom row */}
        <div className="py-6 border-t border-white/10 flex flex-wrap justify-center gap-6 mb-6">
          {[
            { name: 'Home', path: '/' },
            { name: 'About Us', path: '/about' },
            { name: 'Our Divisions', path: '/divisions' },
            { name: 'Vision & Mission', path: '/vision-mission' },
            { name: 'Global Sourcing', path: '/global-sourcing' },
            { name: 'Contact', path: '/contact' },
          ].map((link) => (
            <Link key={link.name} to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-2">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <div className="text-center md:text-left">
            © 2026 Zexora Corporation. All Rights Reserved. <span className="hidden sm:inline">|</span><br className="sm:hidden" /> Developed By <a href="https://lumensofttech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue text-white transition-colors font-medium">Lumen SoftTech Ltd.</a>
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
