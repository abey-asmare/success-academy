import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Our Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white transition-colors">
                  Freshman Course
                </Link>
              </li>
              <li>
                <Link href="/tutoring" className="text-gray-300 hover:text-white transition-colors">
                UAT Course
                </Link>
              </li>
              <li>
                <Link href="/certification" className="text-gray-300 hover:text-white transition-colors">
                    Certificate Programs                    
                </Link>
              </li>
            </ul>
          </div>

          {/* Works Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">WORKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                  Student Portfolio
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-300 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              
              <li>
                <Link href="/achievements" className="text-gray-300 hover:text-white transition-colors">
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">ABOUT US</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-gray-300 hover:text-white transition-colors">
                  Mission & Vision
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">CONTACTS</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-300">+999 888-77-64</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a 
                  href="mailto:successacademy.ethiopia@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >   
                  successacademy.ethiopia@gmail.com
                </a>
              </div>
              
              {/* Social Media Links */}
              <div className="pt-4">
                <p className="text-sm text-gray-400 mb-3">Follow us:</p>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label="Telegram"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">SA</span>
            </div>
            <span className="text-white font-semibold">Success Academy</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <span>© {new Date().getFullYear()} — Copyright</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
