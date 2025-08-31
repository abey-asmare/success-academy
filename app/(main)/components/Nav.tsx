"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Nav({classname}: {classname?: string}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);  // Track scroll

  const auth = useAuth();
  const path = usePathname();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed z-100 top-0 left-0 right-0 font-bold transition-colors duration-300",
        scrolled
          ? "bg-white text-black shadow-md"
          : ("bg-transparent text-white " + classname)
      )}
    >
      <nav className="px-4 md:px-10 flex justify-between items-center h-16 bg-white sm:bg-transparent">
        {/* Logo */}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-transparent">
          <Link href="/" className="w-full h-full">
            <Image
              src="/images/success_academy-logo.png"
              alt="Success Academy Logo"
              width={1024}
              height={1024}
              className="w-full h-full object-contain rounded-md"
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
        <div className="w-24 flex justify-center items-center">
          {auth.sessionId ? (
            <div className="hidden md:block">
              <UserButton />
            </div>
          ) : (
            <Button asChild  className={cn("hidden md:block rounded-md transition-colors",
              scrolled
              ? "bg-orange-700 text-white hover:bg-white/90"
              : "bg-white text-orange-600 hover:bg-white/90")}
              >
            <Link
              href="/sign-in"
             
              >
              Sign In
            </Link>
              </Button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={cn(
            "md:hidden flex flex-col gap-1 p-2 text-black",
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 shadow-sm md:hidden text-black bg-white",
            )}
          >
            <div className="flex flex-col p-4 space-y-4 text-black">
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
                <Button asChild className="px-4 py-2 font-semibold rounded-md transition-colors mt-2 w-fit hover:bg-orange-700/90 bg-orange-700 hover:text-white">

                <Link
                  href="/sign-in"

                  >
                  Sign In
                </Link>
                  </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Nav;
