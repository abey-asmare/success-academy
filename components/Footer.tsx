import {
  instagramLink,
  supportEmail,
  supportPhone,
  telegramLink,
  tiktokLink1,
  tiktokLink2,
} from "@/app/constants";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import OurCourses from "./custom/OurCourses";
import {
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandTiktok,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400 ">
              Our Courses
            </h3>
            <OurCourses />
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400 " id="about">
              ABOUT US
            </h3>
            <ul className="space-y-2">
              <li>
                <div className="text-gray-300 hover:text-white transition-colors">
                  Our Story
                </div>
              </li>
              <li>
                <div className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </div>
              </li>
              <li>
                <div className="text-gray-300 hover:text-white transition-colors">
                  Mission & Vision
                </div>
              </li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div>
            <h3
              className="text-lg font-semibold mb-4 text-blue-400 "
              id="contact"
            >
              CONTACTS
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400 " />
                <Link href={`tel:${supportPhone}`} className="text-gray-300">
                  {supportPhone}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400 " />
                <Link
                  href={`mailto:${supportEmail}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {supportEmail}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-blue-400 ">
                  <IconBrandTelegram size={18} />
                </div>
                <Link
                  href={telegramLink}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Join our telegram
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={instagramLink}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <IconBrandInstagram size={20} className="text-blue-400 " />
                  <span>Follow us on Instagram.</span>
                </Link>
              </div>
              <div className="flex gap-2 flex-col text-gray-300">
                <span className="underline text-gray-300 transition-colors">
                  Follow us on TikTok
                </span>
                <div className="flex gap-2 flex-col">
                  <Link
                    href={tiktokLink1}
                    className="text-gray-300 transition-colors flex items-center gap-4"
                  >
                    <IconBrandTiktok size={16} className="text-blue-400 " />
                    <span>uattips</span>
                  </Link>
                  <Link
                    href={tiktokLink2}
                    className="text-gray-300 transition-colors flex items-center gap-4"
                  >
                    <IconBrandTiktok size={16} className="text-blue-400 " />
                    <span>sbjiga</span>
                  </Link>
                </div>
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
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
            <div className="hover:text-white transition-colors">
              <Link href="/terms-of-use">Terms of Service</Link>
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
