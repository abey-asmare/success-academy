import Image from "next/image"

const sectionImages = [
  {
    src: "/images/partners/addis-ababa-gate.webp",
    alt: "addis ababa university gate",
    width: 294,
    height: 220,
    className: "absolute top-0 left-0 md:left-[30px] w-[180px] rounded-2xl shadow-lg"
  },
  {
    src: "/images/partners/aastu.webp",
    alt: "Addis ababa science and technology university",
    width: 320,
    height: 320,
    className: "absolute top-2/6 right-0 md:right-[30px] w-[150px] rounded-2xl shadow-lg"
  },
  {
    src: "/images/partners/astu.webp",
    alt: "Adama science and technology university",
    width: 204,
    height: 192,
    className: "absolute bottom-0 left-0 md:left-[30px] w-[150px] rounded-2xl shadow-lg"
  }
]


export default function SectionFeature() {

  return (
    <section
      aria-labelledby="features-heading"
      className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-white text-slate-900 py-20 px-8"
    >
  <p className="text-center font-semibold text-xl md:text-2xl mb-10">
              Learn Anything, Anytime, Anywhere
            </p>
            <div className="flex flex-col lg:flex-row gap8 md:gap-48 lg:gap-12">
            <div className="relative h-[480px] w-full order-2 lg:order-1 mt-4">
               {sectionImages.map((image, index) => (
                <Image
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className={image.className}
                  priority

                  />
              ))}
              </div>
              <div className="right space-y-6 md:space-y-8 order-1 lg:order-2">
                <LearningDirections
                  number={1}
                  title="Go at your own pace"
                  description="Courses are structured to fit your schedule, as a self paced manner, Learn it anytime, anywhere."
                />
                <LearningDirections
                  number={2}
                  title="Learn From Experts"
                  description="We are not just your teacher, we are your guide, mentor, and coach. Believe it or not, one of many reasons to start this porgram for the university students is a lack of true mentorship, we like to be with you every step of the way, until your exit exam and more."
                />
                <LearningDirections
                  number={3}
                  title="Find Videos and Resources for your need."
                  description="We provide a wide range of resources to help you succeed in your studies. we have a library of videos, books, and other resources to help you succeed in your studies, we also have a Simulation, the environment to feel what it is like to be in a real exam."
                  last
                />
              </div>
            </div>
    </section>
  )
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
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FB4A19] to-[#F7840C] text-white font-semibold shadow-sm">{number}</span>
        {!last && <span className="h-[80px] md:h-[110px] w-0.5  bg-orange-500/20 rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="text-lg md:text-xl font-semibold mb-2">{title}</p>
        <p className="text-sm md:text-base leading-relaxed ">{description}</p>
      </div>
    </div>
  );
}

