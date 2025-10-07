'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart } from 'lucide-react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/', isActive: pathname === '/' },
    { name: 'Products', href: '/products', isActive: pathname === '/products' },
    { name: 'Projects', href: '/projects', isActive: pathname === '/projects' || pathname.startsWith('/projects/') },
    { name: 'Blog', href: '/blog', isActive: pathname === '/blog' || pathname.startsWith('/blog/') },
    { name: 'About', href: '/about', isActive: pathname === '/about' },
    { name: 'Contact', href: '/contact', isActive: pathname === '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/60 backdrop-blur-xl border-b border-gray-200/30 shadow-lg' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full min-w-0">
            {/* Logo with gradient icon */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <Link href="/" className="text-2xl font-bold flex-shrink-0">
                <span className="logo-font text-gradient-primary">nysa</span>
                <span className="logo-font text-gray-800">decor</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 flex-shrink-0">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                    item.isActive
                      ? 'bg-pink-100 text-red-600 rounded-lg'
                      : 'text-gray-700 hover:text-purple-600'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.name}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 transform origin-left transition-transform duration-300 ease-in-out ${
                    hoveredItem === item.name && !item.isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}></div>
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Shopping Cart */}
              <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-white" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer to account for fixed header height */}
      <div className="h-16"></div>

      {/* Mobile Navigation Menu - Slides in from right */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 shadow-xl transform transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'bg-white/70 backdrop-blur-xl border-l border-gray-200/30' 
            : 'bg-white'
        } ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{ paddingTop: '64px' }}>
          <div className="p-6">
            {/* Close button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Menu title */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-pink-600 mb-2">Navigation Menu</h3>
              <p className="text-sm text-gray-500">Navigate to different sections of the website.</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 ease-in-out transform ${
                    item.isActive
                      ? 'bg-gradient-primary text-white rounded-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100 rounded-lg hover:scale-105'
                  } ${
                    isMobileMenuOpen ? 'animate-in slide-in-from-right-4' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};
