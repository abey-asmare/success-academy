"use client";
import { CourseCard } from "@/components/CourseList";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSlider from "@/components/TestimonialSlider";
import Footer from "@/components/Footer";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import InfiniteMovingCards from "./InfiniteMovingCards";
import Nav from "./components/Nav";
function Home() {
  return (
    <div className="">
      <Nav />
      <HeroSection className="px-4 md:px-10" />
      <InfiniteMovingCards />
      <div className="px-4 md:px-10 learn-anyting text-white bg-primary-700 space-y-8 md:space-y-16 py-12 md:py-16">
        <p className="text-center font-semibold text-xl md:text-2xl">
          Learn Anything, Anytime, Anywhere
        </p>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="relative w-full lg:w-1/2 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] order-2 lg:order-1">
            <Image
              src="/images/getting-started-2.jpg"
              width={600}
              height={900}
              alt="student sitting comfortably"
              className="absolute top-0 left-1/4 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] rounded-2xl shadow-lg"
            />
            <Image
              src="/images/getting-started-1.jpg"
              width={626}
              height={417}
              alt="student sitting comfortably"
              className="absolute top-1/2 right-[15px] sm:right-[20px] md:right-[30px] w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] rounded-2xl shadow-lg"
            />
            <Image
              src="/images/getting-started-3.jpg"
              width={626}
              height={417}
              alt="student sitting comfortably"
              className="absolute bottom-[10px] md:bottom-[20px] left-[10px] md:left-[20px] w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] rounded-2xl shadow-lg"
            />
          </div>
          <div className="right space-y-6 md:space-y-8 order-1 lg:order-2">
            <LearningDirections
              number={1}
              title="Go at your own pace"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio."
            />
            <LearningDirections
              number={2}
              title="Learn From Experts"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio."
            />
            <LearningDirections
              number={3}
              title="Find Videos and Resources for your need."
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio."
              last
            />
          </div>
        </div>
      </div>

      <div className="course-list py-8 md:py-12 space-y-6 md:space-y-8 px-4 md:px-10">
        <p className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
          Our Popular Courses
        </p>
        <div className="courses grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">

          <CourseCard/>
          <CourseCard/>
          <CourseCard/>
          <CourseCard/>
        </div>
      </div>

      <TestimonialSlider />

      <FeatureSection />

      <Footer />
      {/* </div> */}
    </div>
  );
}

function LearningDirections({
  number,
  title,
  description,
  last = false,
}: {
  number: number;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div className="card flex gap-3 md:gap-4">
      <div className="text-xl md:text-2xl font-semibold flex flex-col gap-2 items-center flex-shrink-0">
        <span className="w-8 h-8 md:w-10 md:h-10 bg-white text-primary-700 rounded-full flex items-center justify-center text-sm md:text-base">{number}</span>
        {!last && <span className="h-[80px] md:h-[110px] w-0.5 bg-white/30 rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="text-lg md:text-xl font-semibold mb-2">{title}</p>
        <p className="text-sm md:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default Home;
function HeroSection({ className }: { className: string }) {
  return (
    <div
      className={`bg-primary-700 text-white flex flex-col lg:flex-row gap-8 lg:gap-12 hero-section items-center py-12 lg:py-16 ${className}`}
    >
      <div className="left-hero-section flex-1 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
          Leading Education Platform Available In Ethiopia.
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
          nulla auctor, vestibulum magna sed, convallis ex.
        </p>
        <button className="px-6 py-3 bg-secondary-500 font-semibold rounded-md text-white hover:bg-secondary-600 transition-colors">
          Get Started
        </button>
      </div>
      <div className="right-hero-section flex-1 max-w-md lg:max-w-none">
        <Image
          src="/images/hero-image.png"
          alt="Hero Image"
          width={600}
          height={600}
          className="rounded-xl w-full h-auto"
        />
      </div>
    </div>
  );
}
