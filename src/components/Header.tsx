import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useSiteInfo } from '../lib/useSiteSettings';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { logo, companyName } = useSiteInfo();

  const isHome = location.pathname === '/';
  const isSolid = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'About Us',
      path: '/about',
      submenu: [
        { name: 'Message from Founder & CEO', path: '/ceo-message' },
        { name: 'Vision & Mission', path: '/vision-mission' }
      ]
    },
    { name: 'Our Divisions', path: '/divisions' },
    { name: 'Global Sourcing', path: '/global-sourcing' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Company', path: '/company' },
    {
      name: 'Media Centre',
      path: '/media-centre',
      submenu: [
        { name: 'News', path: '/media-centre/news' },
        { name: 'Photo Gallery', path: '/media-centre/photo-gallery' },
        { name: 'Video Gallery', path: '/media-centre/video-gallery' }
      ]
    },
    { name: 'Career', path: '/career' },
  ];

  const handleMobileExpand = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isSolid ? 'bg-white/90 backdrop-blur-lg shadow-[0_4px_24px_-8px_rgba(15,23,42,0.1)] border-b border-gray-100 py-3 lg:py-3.5' : 'bg-transparent py-4 lg:py-6'}`}>
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt={companyName}
              className={`h-10 lg:h-12 w-auto transition-all duration-300 ${!isSolid ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Nav - only from xl (1280px): at 8 top-level items, lg
              (1024px) is too narrow to fit a single line without wrapping,
              so those widths get the mobile hamburger menu instead. */}
          <div className="hidden xl:flex items-center mt-1">
            <div className="flex items-center space-x-1 2xl:space-x-1.5">
              {navLinks.map((link) => {
                const isActive =
                  (location.pathname.startsWith(link.path) && link.path !== '/') || location.pathname === link.path;
                return (
                  <div key={link.name} className="relative group">
                    <Link
                      to={link.path}
                      className={`relative flex items-center whitespace-nowrap text-[12px] 2xl:text-[13px] uppercase tracking-wider font-semibold transition-all duration-300 py-2 px-3.5 2xl:px-4 rounded-full ${
                        isActive
                          ? isSolid
                            ? 'text-primary-blue bg-primary-blue/8'
                            : 'text-white bg-white/15'
                          : isSolid
                            ? 'text-body-text hover:text-primary-blue hover:bg-primary-blue/5'
                            : 'text-gray-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                      {link.submenu && (
                        <ChevronDown className="ml-1 w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Desktop Dropdown */}
                    {link.submenu && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-gray-100 overflow-hidden py-2.5 relative">
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary-blue via-accent-hover to-primary-blue" />
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`group/item flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium transition-all ${
                                location.pathname === subItem.path
                                  ? 'text-primary-blue bg-primary-blue/5'
                                  : 'text-gray-600 hover:text-primary-blue hover:bg-gray-50'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full shrink-0 transition-all duration-300 ${
                                  location.pathname === subItem.path
                                    ? 'bg-primary-blue scale-100'
                                    : 'bg-gray-300 scale-0 group-hover/item:scale-100'
                                }`}
                              />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                to="/contact"
                className="group relative flex items-center gap-1.5 overflow-hidden bg-primary-blue text-white px-5 py-2.5 2xl:px-6 2xl:py-2.5 rounded-full text-[12px] 2xl:text-[13px] uppercase tracking-wider font-bold transition-all shadow-md shadow-primary-blue/25 hover:shadow-lg hover:shadow-primary-blue/35 hover:-translate-y-0.5 ml-3"
              >
                <span className="absolute inset-0 bg-linear-to-r from-accent-hover to-primary-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Contact</span>
                <ArrowRight className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors ${
                isSolid ? 'text-primary-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden bg-white shadow-xl shadow-slate-900/10 absolute w-full left-0 top-full max-h-[85vh] overflow-y-auto border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/');
              return (
                <div key={link.name}>
                  <div className="flex items-center gap-1">
                    <Link
                      to={link.path}
                      className={`grow py-3 px-3.5 rounded-xl text-base font-medium transition-colors ${
                        isActive ? 'text-primary-blue bg-primary-blue/5' : 'text-body-text hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {link.submenu && (
                      <button
                        onClick={(e) => handleMobileExpand(link.name, e)}
                        className="p-3 text-gray-400 hover:text-primary-blue shrink-0"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  {link.submenu && (
                    <div className={`overflow-hidden transition-all duration-300 bg-gray-50 rounded-xl ${mobileExpanded === link.name ? 'max-h-96 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                      <div className="py-2">
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium ${
                              location.pathname === subItem.path
                                ? 'text-primary-blue'
                                : 'text-gray-600 hover:text-primary-blue'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${location.pathname === subItem.path ? 'bg-primary-blue' : 'bg-gray-300'}`} />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-4 pb-2">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 bg-primary-blue hover:bg-accent-hover text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md"
              >
                Contact
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
