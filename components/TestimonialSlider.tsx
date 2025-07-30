'use client'
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    name: "Jane Doe",
    role: "Designer",
    image: "/images/getting-started-1.jpg"
  },
  {
    id: 2,
    quote: "The quality of education and the interactive learning experience at Byway has been exceptional. The courses are well-structured and the instructors are knowledgeable.",
    name: "John Smith",
    role: "Developer",
    image: "/images/getting-started-2.jpg"
  },
  {
    id: 3,
    quote: "I've taken several courses here and each one has helped me advance my career. The practical approach and real-world projects make learning enjoyable and effective.",
    name: "Sarah Wilson",
    role: "Product Manager",
    image: "/images/getting-started-3.jpg"
  },
  {
    id: 4,
    quote: "The hands-on projects and expert guidance have transformed my understanding of technology. I highly recommend these courses to anyone serious about their career growth.",
    name: "Michael Chen",
    role: "Software Engineer",
    image: "/images/getting-started-1.jpg"
  },
  {
    id: 5,
    quote: "Outstanding learning platform with comprehensive content. The community support and mentorship opportunities are invaluable for professional development.",
    name: "Emily Rodriguez",
    role: "Data Scientist",
    image: "/images/getting-started-2.jpg"
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
            {testimonials.map((testimonial) => (
              <CarouselItem 
                key={testimonial.id} 
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
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:block md:-left-12 bg-white shadow-lg hover:shadow-xl" />
          <CarouselNext className="hidden md:block md:-right-12 bg-white shadow-lg hover:shadow-xl" />
        </Carousel>
      </div>
    </div>
  );
}