import Image from "next/image";

function LearnAnything({className}: {className: string}){
    return <div className={className}>
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
      <div className="card flex gap-3 md:gap-4 md:w-[60ch]">
        <div className="text-xl md:text-2xl font-semibold flex flex-col gap-2 items-center flex-shrink-0">
          <span className="w-8 h-8 md:w-10 md:h-10 bg-white text-primary-700 rounded-full flex items-center justify-center text-sm md:text-base">{number}</span>
          {!last && <span className="h-[80px] md:h-[110px] w-0.5 bg-white/30 rounded-full" />}
        </div>
        <div className="flex-1">
          <p className="text-lg md:text-xl font-semibold mb-2">{title}</p>
          <p className="text-sm md:text-base leading-relaxed ">{description}</p>
        </div>
      </div>
    );
  }
  

  export default LearnAnything;