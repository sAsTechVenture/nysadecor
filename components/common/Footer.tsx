import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { colors } from '@/config/theme';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const quickLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Projects', href: '/projects' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    'Custom Blinds',
    'Professional Installation',
    'Free Consultation',
    'Repair & Maintenance',
    'Commercial Solutions',
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'info@blindcraft.com' },
    { icon: MapPin, text: '123 Design Street' },
    { icon: MapPin, text: 'Interior City, IC 12345' },
  ];

  return (
    <footer className="text-white" style={{ background: colors.secondary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section - Four Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info & Social Links */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-3">BlindCraft</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Premium window blinds and treatments for modern homes and offices. 
                Quality craftsmanship since 2010.
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-200 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <li key={index} className="flex items-start space-x-3">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{contact.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-200 text-sm">
              © {currentYear} BlindCraft. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-200 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
