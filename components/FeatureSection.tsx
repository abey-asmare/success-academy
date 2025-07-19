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
    <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-[600px]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                We&apos;ve Been There. We Can make it Better For you.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet 
                consectetur. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet 
                consectetur. Lorem ipsum dolor sit amet consectetur. Lorem.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl px-8">
              <div className="relative z-10">
                <Image
                  src="/images/hero-image.png"
                  alt="Student working on laptop"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-2xl"
                  priority
                />
              </div>
              {/* Background decoration */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-300 rounded-full opacity-50"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-blue-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
