import FeaturedGuides from "@/components/guides/FeaturedGuides";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import { routes } from "@/config/routes";

export default function GuidesPage() {
  return (
    <>
      <section className="relative min-h-[42vh] overflow-hidden">
        <img
          src="/agents.webp"
          alt="Hosts hero"
          className="absolute inset-0 h-full w-full object-cover object-[center_22%] md:object-[center_18%]"
        />
        <div className="absolute inset-0 bg-slate-950/45" />

        <div className="relative z-10">
          <Navbar />

          <div className="mx-auto w-full px-4 pb-12 pt-8 sm:px-6 lg:w-[80%] lg:px-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
              Hosts
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
              Meet trusted hosts and explore their hotels
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-sky-50/95 sm:text-base">
              Discover every host on Hotelix, compare their portfolios, and jump directly into their listings.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:w-[80%] lg:px-0">
        <Breadcrumb
          items={[
            { label: "Home", href: routes.home },
            { label: "Hosts" },
          ]}
        />
      </div>

      <FeaturedGuides />
      <FloatingChatWidget />
    </>
  );
}