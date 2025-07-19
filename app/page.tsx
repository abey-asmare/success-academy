'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import 'react-multi-carousel/lib/styles.css';
import InfiniteScroll from "./InfiniteScroll";
import TestimonialSlider from "@/components/TestimonialSlider";
import FeatureSection from "@/components/FeatureSection";

function Home() {
  return (
    <div className="">
      <Nav />
      <HeroSection />
      <InfiniteScroll />
      <div className="learn-anyting text-white bg-primary-700 space-y-16 py-16">
        <p className="text-center font-semibold text-2xl">Learn Anything, Anytime, Anywhere</p>
        {/* <div className="images"> */}
      <div className="flex gap-8"
      >
        <div className="relative w-1/2">
          <Image src='/images/getting-started-2.jpg' width={600} height={900} alt="student sitting comfortably" className="absolute top-0 left-1/4 w-[200px] rounded-2xl" />
          <Image src='/images/getting-started-1.jpg' width={626} height={417} alt="student sitting comfortably" className="absolute top-1/2 right-[30px] w-[200px] rounded-2xl" />
          <Image src='/images/getting-started-3.jpg' width={626} height={417} alt="student sitting comfortably" className="absolute bottom-[20px] left-[20px] w-[200px] rounded-2xl" />
        </div>
        <div className="right space-y-8">
          <LearningDirections number={1} title="Go at your own pace" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio." />
          <LearningDirections number={2} title="Learn From Experts" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio." />
          <LearningDirections number={3} title="Find Videos and Resources for your need." description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsum cupiditate soluta voluptatem magni earum mollitia neque reiciendis est, dolorum, iure voluptatum quaerat! Natus mollitia dolores fugiat commodi itaque optio." last/>
        </div>
      </div>
        </div>

        <div className="course-list py-6 space-y-8">
          <p className="text-center  text-4xl font-semibold">Our Popular Courses</p>
          <div className="courses flex gap-4 flex-wrap">
          <Card className="p-4 border-2 border-gray-200 w-fit transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
              <div className="wrapper rounded-md overflow-hidden w-[260px]">
                <Image src="/images/getting-started-1.jpg" alt="Course 1" width={500} height={500} className="w-full h-full" />
              </div>
              <div className="description space-y-4">
                <h3 className="font-semibold">Freshman</h3>
                <p className="text-gray-500">12 Chapters. 4 Tests. 30+ resources</p>
                <button className="enroll-in px-4 py-2 font-semibold bg-primary-500 rounded-md text-white">Enroll</button>
              </div>
            </Card>
          <Card className="p-4 border-2 border-gray-200 w-fit transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
              <div className="wrapper rounded-md overflow-hidden w-[260px]">
                <Image src="/images/getting-started-1.jpg" alt="Course 1" width={500} height={500} className="w-full h-full" />
              </div>
              <div className="description space-y-4">
                <h3 className="font-semibold">Freshman</h3>
                <p className="text-gray-500">12 Chapters. 4 Tests. 30+ resources</p>
                <button className="enroll-in px-4 py-2 font-semibold bg-primary-500 rounded-md text-white">Enroll</button>
              </div>
            </Card>
          <Card className="p-4 border-2 border-gray-200 w-fit transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
              <div className="wrapper rounded-md overflow-hidden w-[260px]">
                <Image src="/images/getting-started-1.jpg" alt="Course 1" width={500} height={500} className="w-full h-full" />
              </div>
              <div className="description space-y-4">
                <h3 className="font-semibold">Freshman</h3>
                <p className="text-gray-500">12 Chapters. 4 Tests. 30+ resources</p>
                <button className="enroll-in px-4 py-2 font-semibold bg-primary-500 rounded-md text-white">Enroll</button>
              </div>
            </Card>
          <Card className="p-4 border-2 border-gray-200 w-fit transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
              <div className="wrapper rounded-md overflow-hidden w-[260px]">
                <Image src="/images/getting-started-1.jpg" alt="Course 1" width={500} height={500} className="w-full h-full" />
              </div>
              <div className="description space-y-4">
                <h3 className="font-semibold">Freshman</h3>
                <p className="text-gray-500">12 Chapters. 4 Tests. 30+ resources</p>
                <button className="enroll-in px-4 py-2 font-semibold bg-primary-500 rounded-md text-white">Enroll</button>
              </div>
            </Card>
          </div>
        </div>

        <TestimonialSlider />

        <FeatureSection />

      {/* </div> */}
    </div>
  );
}


function LearningDirections({number, title, description, last=false}: {number: number, title: string, description: string, last?: boolean}) {
    return (
      <div className="card flex gap-4">
      <div className="text-2xl font-semibold flex flex-col gap-2 items-center">
        <span className="">{number}</span>
        {!last && <span className="h-[110px] border-1 rounded-full ms-0.5" />}
      </div>
      <div>
        <p className="text-xl font-semibold">{title}</p>
        <p className="w-[60ch]">{description}</p>
      </div>
    </div>
    )
}
export default Home;
function HeroSection() {
  return (
    <div className="bg-primary-700 text-white flex gap-8 hero-section items-center">
      <div className="left-hero-section">
        <h1 className="text-5xl font-bold leading-snug">
          Leading Education Platform Available In Ethiopia.
        </h1>
        <p className="text-2xl text-gray-300 max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
        </p>
        <button className="px-4 py-2 bg-secondary-500 font-semibold rounded-md text-white">
          Get Started
        </button>
      </div>
      <div className="right-hero-section">
        <Image
          src="/images/hero-image.png"
          alt="Hero Image"
          width={600}
          height={600}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

function Nav() {
  return <nav className="flex justify-between items-center sticky top-0 bg-white">
    <div className="w-14 h-14">
      <Image
        src="/images/success_academy-logo.png"
        alt="Success Academy Logo"
        width={1024}
        height={1024} />
    </div>
    <div className="flex gap-8 items-center">
      <Link href="#" className="font-semibold hover:underline">Home</Link>
      <Link href="#" className="font-semibold hover:underline">Courses</Link>
      <Link href="#" className="font-semibold hover:underline">Blog</Link>
      <Link href="#" className="font-semibold hover:underline">About us</Link>
    </div>
    <button className="px-4 py-2 bg-primary-500 font-semibold rounded-md text-white">
      Sign Up
    </button>
  </nav>;
}

