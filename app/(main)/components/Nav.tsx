"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const auth = useAuth();
  const path = usePathname();

  return (
    <nav className="px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-white shadow-sm">
      {/* Logo */}
      <div className="w-12 h-12 md:w-14 md:h-14">
        <Link href="/" className="w-full h-full">
          <Image
            src="/images/success_academy-logo.png"
            alt="Success Academy Logo"
            width={1024}
            height={1024}
            className="w-full h-full object-contain"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="/"
          className={cn(
            "font-semibold hover:underline transition-all",
            path === "/" ? "underline" : ""
          )}
        >
          Home
        </Link>
        <Link
          href="/dashboard/search"
          className="font-semibold hover:underline transition-all"
        >
          Courses
        </Link>
        <Link
          href="#about"
          className="font-semibold hover:underline transition-all"
        >
          About us
        </Link>
        <Link
          href="#contact"
          className="font-semibold hover:underline transition-all"
        >
          Contact us
        </Link>
      </div>

      {/* Desktop Sign Up Button */}
      {auth.sessionId ? (
        <div className="hidden md:block">
          <UserButton />
        </div>
      ) : (
        <Link
          href="/sign-in"
          className="hidden md:block px-4 py-2 bg-primary-500 font-semibold rounded-md text-white hover:bg-primary-600 transition-colors"
        >
          Sign In
        </Link>
      )}

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden flex flex-col gap-1 p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
            isMenuOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
            isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        ></span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className={cn(
                "font-semibold hover:text-primary-500 transition-colors py-2",
                path === "/" ? "underline" : ""
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard/search"
              className="font-semibold hover:text-primary-500 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="#about"
              className="font-semibold hover:text-primary-500 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="font-semibold hover:text-primary-500 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact us
            </Link>
            {auth.sessionId ? (
              <UserButton />
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-primary-500 font-semibold rounded-md text-white hover:bg-primary-600 transition-colors mt-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
