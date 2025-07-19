import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  Clock,
  BookOpen,
  FileText,
  Play,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduPlatform</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Courses
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About Us
            </Link>
          </nav>

          <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Leading Education Platform
                  <span className="block text-blue-600">
                    Available In Ethiopia.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Join thousands of students learning from expert instructors
                  with comprehensive courses designed for Ethiopian students.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Student with books"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">600+</div>
              <div className="text-gray-600 font-medium">Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">300+</div>
              <div className="text-gray-600 font-medium">Exams</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">184+</div>
              <div className="text-gray-600 font-medium">Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* University Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Ethiopian Universities
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Addis Ababa University"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="University of Gondar"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Hawassa University"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Wolaita Sodo University"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="Unity University"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=80&width=120"
                alt="AASTU"
                width={120}
                height={80}
                className="grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join our community of
            <span className="block text-yellow-300">1200+ Students</span>
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Go at your own pace
                  </h3>
                  <p className="text-gray-600">
                    Learn at your own speed with flexible scheduling. Access
                    course materials 24/7 and progress through lessons when it&apos;s
                    convenient for you. Our self-paced learning approach ensures
                    you master each concept before moving forward.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">2</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Learn from Experts
                  </h3>
                  <p className="text-gray-600">
                    Get taught by industry professionals and experienced
                    educators who bring real-world knowledge to every lesson.
                    Our instructors are carefully selected for their expertise
                    and teaching ability.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">3</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Find Videos and Resources for your need
                  </h3>
                  <p className="text-gray-600">
                    Access comprehensive learning materials including HD videos,
                    downloadable resources, practice exercises, and
                    supplementary materials tailored to Ethiopian curriculum
                    standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Student learning online"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our most enrolled courses designed for Ethiopian
              students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Freshman",
                description:
                  "Foundation courses for first-year university students",
              },
              {
                name: "UAT",
                description: "University Admission Test preparation",
              },
              {
                name: "COC",
                description: "Certificate of Competency programs",
              },
              {
                name: "Remedial",
                description: "Remedial courses for skill enhancement",
              },
            ].map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src={`/placeholder.svg?height=200&width=300&query=${course.name} course thumbnail`}
                    alt={course.name}
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      (1200 Ratings)
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>22 Total Hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>155 Lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>20+ Tests</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    Birr 1000
                  </div>
                  <Button size="sm">Enroll Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say About Us
            </h2>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="space-y-4">
                    <div className="text-4xl text-blue-600"></div>
                    <p className="text-gray-600 italic">
                      Byway&apos;s tech courses are top-notch! As someone who&apos;s
                      always looking to stay ahead in the rapidly evolving tech
                      world, I appreciate the up-to-date content and engaging
                      multimedia.
                    </p>
                    <div className="flex items-center gap-4">
                      <Image
                        src="/placeholder.svg?height=50&width=50"
                        alt="Jane Doe"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold">Jane Doe</div>
                        <div className="text-sm text-gray-600">Designer</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                We&apos;ve Been There. We Can make it Better For you.
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of successful students who have transformed their
                careers with our comprehensive online education platform
                designed specifically for Ethiopian learners.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>In-Depth videos For each Chapter</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Exam and pdf resources Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Active Community to help you along the way</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Students celebrating"
                width={500}
                height={400}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduPlatform</span>
              </div>
              <p className="text-gray-400">
                Leading online education platform serving Ethiopian students
                with quality courses and expert instruction.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <div className="space-y-2 text-gray-400">
                <div>Online Courses</div>
                <div>Exam Preparation</div>
                <div>Certification Programs</div>
                <div>Tutoring Services</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About</h3>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Our Mission</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div>+1 999 888-77-64</div>
                <div>hello@eduplatform.com</div>
                <div className="flex gap-4 pt-2">
                  <span>Telegram</span>
                  <span>Email</span>
                  <span>WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400">© 2023 - Copyright EduPlatform</div>
            <div className="text-gray-400">Privacy Policy</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
