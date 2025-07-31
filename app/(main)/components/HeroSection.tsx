import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function HeroSection({ className }: { className: string }) {
  return (
    <div
      className={`relative bg-white text-gray-900 flex flex-col lg:flex-row gap-8 lg:gap-12 hero-section items-center min-h-[90vh] ${className}`}
    >
      {/* Content Container */}
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="left-hero-section flex-1 text-center lg:text-left space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
            Your shortcur to
            <span className="block text-primary-600">Academic Success</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-xl lg:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
            Join thousands of Ethiopian students who&apos;ve achieved academic
            excellence with our comprehensive learning platform and expert
            guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button className="bg-primary-500 hover:bg-primary-500/80 !py-2 mb-4" size="lg">
              <Link href="/dashboard/search">
              Start Learning Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative order-first lg:order-last mb-8">
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl md:rounded-3xl px-4 md:px-8 py-4 md:py-6">
            <div className="relative z-10">
              <Image
                src="/images/hero-image.png"
                alt="Student working on laptop"
                width={600}
                height={400}
                className="w-[600px] h-[600px] object-cover rounded-xl md:rounded-2xl object-top"
                priority
              />
            </div>
            {/* Background decoration */}
            <div className="absolute top-2 md:top-4 right-2 md:right-4 w-12 h-12 md:w-20 md:h-20 bg-blue-300 rounded-full opacity-50"></div>
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 w-8 h-8 md:w-12 md:h-12 bg-blue-400 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
