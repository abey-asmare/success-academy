import CourseList from "@/components/CourseList";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import "react-multi-carousel/lib/styles.css";
import HeroSection from "./components/HeroSection";
import LearnAnything from "./components/LearnAnything"; 
import TestimonialSlider from "@/components/TestimonialSlider";
import { CourseMinimized } from "@/types";


async function Home() {
  // const courses: CourseMinimized[] = await fetch('/api/courses').then(res => res.json())
  // const ping = await fetch('/api/courses/c').then(res => res.json())
  // console.log('ping', ping)
  return (
    <div className="">
      <HeroSection className="pt-4 px-4 md:px-10" />
      
        {/* learn anything section */}
        <LearnAnything className="px-4 md:px-10 learn-anyting text-white bg-primary-700 space-y-8 md:space-y-16 py-12 md:py-16"/>
      {/* cousrse lists */}
      
    <CourseList className="px-4 md:px-10"/>
    {/* testimonials section */}
      <TestimonialSlider />

    {/* feature section */}
      <FeatureSection />

      {/* footer section */}
      <Footer />
    </div>
  );
}



export default Home;
