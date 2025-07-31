import { supportEmail, supportPhone, telegramLink } from "@/app/constants";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import OurCourses from "./custom/OurCourses";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Our Courses
            </h3>
            <OurCourses />
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400" id="about">
              ABOUT US
            </h3>
            <ul className="space-y-2">
              <li>
                <div
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Our Story
                </div>
              </li>
              <li>
                <div
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Our Team
                </div>
              </li>
              <li>
                <div
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mission & Vision
                </div>
                </li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div>
            <h3
              className="text-lg font-semibold mb-4 text-blue-400"
              id="contact"
            >
              CONTACTS
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <Link href={`tel:${supportPhone}`} className="text-gray-300">{supportPhone}</Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <Link
                  href={`mailto:${supportEmail}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {supportEmail}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="oklch(62.3% 0.214 259.815)" className="bi bi-telegram" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                  </svg>
                </div>
                <Link
                  href={telegramLink}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Join our telegram
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm text-white">
                SA
              </span>
            </div>
            <span className="text-white font-semibold">Success Academy</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <div className="hover:text-white transition-colors">
              Privacy Policy
            </div>
            <span className="hidden md:inline">|</span>
            <span>© {new Date().getFullYear()} — Copyright</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
