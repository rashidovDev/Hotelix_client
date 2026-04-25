import Navbar from "@/components/layout/Navbar";
import CloudBackground from "@/components/ui/CloudBackground";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import { routes } from "@/config/routes";
import { CheckCircle2, Users, Globe, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <CloudBackground heightClassName="min-h-[50vh]">
        <Navbar />
        <div className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
            About Hotelix
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Revolutionizing the way travelers discover and book their perfect stays
          </p>
        </div>
      </CloudBackground>

      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:w-[80%] lg:px-0">
        <Breadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "About" },
          ]}
        />
      </div>

      {/* Mission Section */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-4 text-lg text-slate-600">
              At Hotelix, we believe travel should be seamless, inspiring, and accessible to everyone. Our mission is to empower travelers with tools and insights to discover exceptional accommodations that match their unique preferences and budget.
            </p>
            <p className="mt-4 text-lg text-slate-600">
              We connect curious travelers with passionate hosts, creating a global community where experiences matter more than just rooms.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-8 border border-slate-200">
            <div className="space-y-6">
              {[
                "Direct connections between travelers and hosts",
                "Transparent pricing with no hidden fees",
                "Verified reviews and ratings",
                "24/7 dedicated support"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-12">Our Core Values</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              title: "Community First",
              description: "We put our travelers and hosts at the heart of everything we do."
            },
            {
              icon: Globe,
              title: "Global Reach",
              description: "Connecting people across continents with genuine hospitality experiences."
            },
            {
              icon: Award,
              title: "Quality Assurance",
              description: "Every property is carefully verified to ensure the best standards."
            },
            {
              icon: CheckCircle2,
              title: "Transparency",
              description: "Honest reviews, clear pricing, and no surprises along the way."
            }
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <Icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-16 sm:px-12 sm:py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Impact</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { number: "50K+", label: "Active Properties" },
              { number: "2M+", label: "Happy Travelers" },
              { number: "150+", label: "Countries" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:w-[80%] lg:px-0">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">Our Story</h2>
        <div className="max-w-3xl space-y-6 text-slate-600">
          <p>
            Founded in 2024, Hotelix emerged from a simple observation: traditional hotel booking platforms lacked personality, and travelers deserved better options. We decided to build something different.
          </p>
          <p>
            What started as a small team passionate about travel has grown into a community of thousands of hosts and millions of travelers exploring the world. We've learned that the best trips aren't just about where you stay—they're about the stories you create and the connections you make.
          </p>
          <p>
            Today, Hotelix continues to innovate, listening to our community and evolving our platform to meet the needs of modern travelers. Whether you're looking for a cozy apartment in Tashkent, a luxury resort in the Maldives, or a countryside villa in Europe, we're here to help you find your perfect stay.
          </p>
        </div>
      </section>

      <FloatingChatWidget />
    </>
  );
}
