import CourseList from "@/components/CourseList";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import "react-multi-carousel/lib/styles.css";
import TestimonialSlider from "@/components/TestimonialSlider";
import CreateProfile from "./components/CreateProfile";
import HeroOrange from "./components/HeroOrange";
import SectionFeature from "./components/SectionFeature";

async function Home() {

  return (
    <div className="">
      <CreateProfile/>
      <HeroOrange className="px-4 md:px-10 pt-16" />
      
        {/* learn anything section */}
        {/* <LearnAnything className="px-4 md:px-10 learn-anyting text-white bg-primary-700 space-y-8 md:space-y-16 py-12 md:py-16"/> */}
      {/* cousrse lists */}
      <SectionFeature/>
      
    <CourseList className="px-4 md:px-10 bg-gradient-to-br from-amber-50 via-orange-50 to-white"/>
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
