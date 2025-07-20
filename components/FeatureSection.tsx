'use client'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    "In-Depth videos For each Chapter.",
    "Exam and pdf resources included.",
    "Active Community to help you along the way."
  ];

  return (
    <div className="py-12 md:py-16 bg-gray-50 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px] lg:h-[600px]">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                We&apos;ve Been There. We Can make it Better For you.
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet 
                consectetur. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet 
                consectetur. Lorem ipsum dolor sit amet consectetur. Lorem.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 md:space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-3 md:pt-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold w-full sm:w-auto"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-first lg:order-last">
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
    </div>
  );
}
