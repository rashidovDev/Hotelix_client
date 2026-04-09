import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ApolloClientProvider from "@/lib/apollo/provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";
import CloudBackground from "@/components/ui/CloudBackground";
import FeaturedHotels from "@/components/hotel/FeaturedHotels";
import FeaturedTours from "@/components/tours/FeaturedTours";
import FeaturedCars from "@/components/cars/FeaturedCars";
import FeaturedGuides from "@/components/guides/FeaturedGuides";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} flex flex-col min-h-screen`}>
        <ApolloClientProvider>
          
          <CloudBackground>
            <Navbar />
            <main className="flex-1">{children}</main>
          </CloudBackground>
          <FeaturedHotels />
          <FeaturedTours />
          <FeaturedCars />
          <FeaturedGuides />
          <Footer />
        </ApolloClientProvider>
      </body>
    </html>
  );
}