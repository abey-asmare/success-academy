import CourseList from "@/components/CourseList";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import "react-multi-carousel/lib/styles.css";
import TestimonialSlider from "@/components/TestimonialSlider";
import CreateProfile from "./components/CreateProfile";
import HeroOrange from "./components/HeroOrange";
import SectionFeature from "./components/SectionFeature";
import Head from 'next/head';

async function Home() {

  return (
   <>
    <Head>
    <title>Success Academy Ethiopia – Online Courses & UAT Programs</title>
    <meta name="description" content="Explore online courses, UAT programs, and university prep with Success Academy Ethiopia. Flexible, engaging education for Ethiopian learners." />

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Success Academy Ethiopia",
          "url": "https://successacademy.et",
          "logo": "https://successacademy.et/images/success_academy-logo.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Addis Ababa",
            "addressCountry": "ET"
          },
          "department": [
            {
              "@type": "Course",
              "name": "UAT Online Program",
              "description": "Flexible UAT online courses for Ethiopian university students."
            },
            {
              "@type": "Course",
              "name": "Entrance Exam",
              "description": "Entrance Exam for Ethiopian university students."
            },
            {
              "@type": "Course",
              "name": "Freshman Course",
              "description": "Freshman courses for all Ethiopian university students."
            },
            
          ]
        })
      }}
    />
    </Head>
    <div className="">
      <CreateProfile/>
      <HeroOrange className="pt-30 md:pt-16  px-4 md:px-10" />
      
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
    </div></>
  );
}



export default Home;
