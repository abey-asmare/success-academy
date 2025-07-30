"use client";
import CourseList from "@/components/CourseList";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import "react-multi-carousel/lib/styles.css";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import HeroSection from "./components/HeroSection";
import LearnAnything from "./components/LearnAnything"; 
import {Spotlight} from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/Background-Beams";
import TestimonialSlider from "@/components/TestimonialSlider";

// Testimonial data
const testimonials = [
  {
    quote: "I can't thank Success Academy enough for their incredible support during my freshman year in Economics. Their structured guidance and study materials made all the difference, helping me pass every exam with ease.",
    name: "Abenezer Tesfaye",
    title: "Economics Student"
  },
  {
    quote: "Success Academy was instrumental in my success as a freshman. The hands-on learning and expert advice I received helped me not only to pass my classes but also to truly understand the material.",
    name: "Robel Haile",
    title: "Software Engineering Student"
  },
  {
    quote: "I am deeply grateful to Success Academy for their unwavering support throughout my freshman year in Law. Their comprehensive resources and personalized guidance helped me pass all my courses and build a solid foundation for my future studies.",
    name: "Messay Tiruneh",
    title: "Law Student"
  },
  {
    quote: "Success Academy made my freshman year in Medicine manageable and successful. With their help, I was able to grasp challenging concepts and pass all my exams, setting me on the path to achieving my dream career.",
    name: "Biruk Abera",
    title: "Medicine Student"
  }
];

function Home() {
  return (
    <div className="">
      <HeroSection className="pt-4 px-4 md:px-10" />
      
        {/* learn anything section */}
        <LearnAnything className="px-4 md:px-10 learn-anyting text-white bg-primary-700 space-y-8 md:space-y-16 py-12 md:py-16"/>
      {/* cousrse lists */}
    <CourseList className="px-4 md:px-10"/> 
    {/* testimonials section */}
      <TestimonialSlider />

      {/* <section className="py-16" style={{ backgroundColor: '#083A79' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Hear from students who&apos;ve transformed their academic journey with Success Academy
            </p>
          </div>
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="mb-8"
          />
        </div>
      </section> */}
    {/* feature section */}
      <FeatureSection />

      {/* footer section */}
      <Footer />
    </div>
  );
}



export default Home;
