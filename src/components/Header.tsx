import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
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
    { name: 'Company', path: 'https://proactive.com.bd/', external: true },
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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3 lg:py-4' : 'bg-transparent py-4 lg:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt={companyName}
              className={`h-10 lg:h-12 w-auto transition-all duration-300 ${!isSolid ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center mt-1">
            <div className="flex space-x-4 xl:space-x-6 2xl:space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center text-[12px] lg:text-[13px] xl:text-[14px] uppercase tracking-wider font-semibold hover:text-accent-hover transition-colors py-2 ${
                        isSolid ? 'text-body-text' : 'text-gray-200 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {link.submenu && <ChevronDown className="ml-1 w-4 h-4" />}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center text-[12px] lg:text-[13px] xl:text-[14px] uppercase tracking-wider font-semibold hover:text-accent-hover transition-colors py-2 ${
                        (location.pathname.startsWith(link.path) && link.path !== '/') || location.pathname === link.path
                          ? 'text-primary-blue'
                          : isSolid ? 'text-body-text' : 'text-gray-200 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {link.submenu && <ChevronDown className="ml-1 w-4 h-4" />}
                    </Link>
                  )}

                    {/* Desktop Dropdown */}
                    {link.submenu && (
                      <div className="absolute left-0 top-full -mt-1 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-0 transition-all duration-300 ease-out z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-3">
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`block px-5 py-2.5 text-[14px] font-medium hover:bg-gray-50 hover:text-primary-blue transition-colors ${
                                location.pathname === subItem.path ? 'text-primary-blue bg-blue-50/50' : 'text-gray-700'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <Link
                  to="/contact"
                  className="bg-primary-blue hover:bg-accent-hover text-white px-6 py-2 xl:px-8 xl:py-2.5 rounded-full text-[13px] xl:text-[14px] uppercase tracking-wider font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ml-4"
                >
                  Contact
                </Link>
              </div>
            </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isSolid ? 'text-primary-dark' : 'text-white'} hover:text-primary-blue focus:outline-none`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute w-full left-0 top-full max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                <div className="flex justify-between items-center">
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-grow block py-3 text-base font-medium border-b border-gray-50 text-body-text hover:text-primary-blue`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex-grow block py-3 text-base font-medium border-b border-gray-50 ${
                        location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/')
                          ? 'text-primary-blue'
                          : 'text-body-text hover:text-primary-blue'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                  {link.submenu && (
                    <button
                      onClick={(e) => handleMobileExpand(link.name, e)}
                      className="p-3 text-gray-500 hover:text-primary-blue border-b border-gray-50 flex-shrink-0"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                
                {/* Mobile Submenu */}
                {link.submenu && (
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 rounded-lg ${mobileExpanded === link.name ? 'max-h-96 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                    <div className="py-2">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`block px-4 py-2.5 text-sm font-medium ${
                            location.pathname === subItem.path
                              ? 'text-primary-blue'
                              : 'text-gray-600 hover:text-primary-blue'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 pb-2">
              <Link
                to="/contact"
                className="block text-center bg-primary-blue hover:bg-accent-hover text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

