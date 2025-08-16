'use client'
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

// Testimonial data
const testimonials = [
  {
    quote: "I can't thank Success Academy enough for their incredible support during my freshman year in Economics. Their structured guidance and study materials made all the difference, helping me pass every exam with ease.",
    name: "Abenezer Tesfaye",
    title: "Economics Student",
    image: "/images/partners/addis-ababa.png"
  },
  {
    quote: "Success Academy was instrumental in my success as a freshman. The hands-on learning and expert advice I received helped me not only to pass my classes but also to truly understand the material.",
    name: "Robel Haile",
    title: "Software Engineering Student",
    image: "/images/partners/bdr.jpg"
  },
  {
    quote: "I am deeply grateful to Success Academy for their unwavering support throughout my freshman year in Law. Their comprehensive resources and personalized guidance helped me pass all my courses and build a solid foundation for my future studies.",
    name: "Messay Tiruneh",
    title: "Law Student",
    image: "/images/partners/bdr.jpg"
  },
  {
    quote: "Success Academy made my freshman year in Medicine manageable and successful. With their help, I was able to grasp challenging concepts and pass all my exams, setting me on the path to achieving my dream career.",
    name: "Biruk Abera",
    title: "Medicine Student",
    image: "/images/partners/addis-ababa.png"
  }
];
export default function TestimonialSlider() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Customer Say About Us
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <svg 
                        className="w-8 h-8 text-blue-500" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>

                    {/* Quote Text */}
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center mt-auto">
                      <div className="relative w-12 h-12 mr-3">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-xs md:text-sm">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:block lg:-left-8 bg-white shadow-lg hover:shadow-xl" />
          <CarouselNext className="hidden lg:block lg:-right-8 bg-white shadow-lg hover:shadow-xl" />
        </Carousel>
      </div>
    </div>
  );
}