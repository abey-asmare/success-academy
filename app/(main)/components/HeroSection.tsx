import Image from "next/image";

function HeroSection({ className }: { className: string }) {
    return (
      <div
        className={`bg-primary-700 text-white flex flex-col lg:flex-row gap-8 lg:gap-12 hero-section items-center ${className}`}
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
  

  export default HeroSection;   