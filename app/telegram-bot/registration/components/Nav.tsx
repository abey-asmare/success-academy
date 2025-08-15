"use client";
import Image from "next/image";

function Nav() {
  return (
    <nav className="px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-white shadow-sm">
      {/* Logo */}
      <div className="w-12 h-12 md:w-14 md:h-14">
          <Image
            src="/images/success_academy-logo.png"
            alt="Success Academy Logo"
            width={1024}
            height={1024}
            className="w-full h-full object-contain"
          />
      </div>
    </nav>
  );  
}

export default Nav;
