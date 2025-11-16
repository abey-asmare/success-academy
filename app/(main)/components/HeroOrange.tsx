import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
import { getProfileCount } from "@/optimizedQueries/otherOptimizedQueries"

type Props = {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export default async  function HeroOrange({
  heading = "Your shortcut to Academic Success",
  subheading = " Join thousands of Ethiopian students who've achieved academic excellence with our comprehensive learning platform and expert guidance.",
  ctaLabel = "Get Started",
  ctaHref = "/dashboard/search",
  className = ''
}: Props) {
  const allUsers = await getProfileCount() + 11900
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(  
        "relative overflow-hidden text-white",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(to top right, #FB4A19 7%, #FB8218 30%, #F7840C 64%, #952C0F 100%)",
      }}
    >
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:px-6 md:grid-cols-2">
        {/* Left content */}
        <div className="space-y-6">
          <h1 id="hero-heading" className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="max-w-xl text-white/90 text-lg">{subheading}</p>
          <div className="flex items-center gap-4">
            <Button asChild className="bg-white text-orange-700 hover:bg-white/90" size="lg">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Link href="/dashboard/search" className="text-white/90 underline-offset-4 hover:underline">
              Browse Courses
            </Link>
          </div>

          {/* Quick stats strip for desktop */}
          <div className="hidden md:flex gap-10 pt-8">
            <Stat label="Courses" value="600+" />
            <Stat label="Exams" value="300+" />
            <Stat label="Students" value={`${allUsers.toString()}+`} />
          </div>
        </div>

        {/* Right illustration */}
        <div className="md:relative mx-auto h-full w-full max-w-[420px]">
          {/* Ensure parent is relative when using fill, per Next.js recommendations */}
                      <Image
                        src="/images/hero-image.webp"
                        alt="Student working on laptop"
                        width={601}
                        height={1077}
                        className="w-full h-full object-cover object-top"
                        priority
                        fetchPriority="high"
                      />
        </div>

        {/* Stats strip on mobile */}
        <div className="md:hidden absolute bottom-0 -mt-4 grid grid-cols-3 gap-4 py-4">
          <Stat label="Courses" value="600+" />
          <Stat label="Exams" value="300+" />
          <Stat label="Students" value={`${allUsers.toString()}+`} />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
      <div className="text-lg md:text-2xl font-bold">{value}</div>
      <div className="text-sm md:text-base text-white/90">{label}</div>
    </div>
  )
}
// per month
export const revalidate = 2592000
