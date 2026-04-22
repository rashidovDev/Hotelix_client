import AIInput from "@/components/ui/AIInput";
import Navbar from "@/components/layout/Navbar";
import CloudBackground from "@/components/ui/CloudBackground";
import FeaturedHotels from "@/components/hotel/FeaturedHotels";
import FeaturedTours from "@/components/tours/FeaturedTours";
import FeaturedCars from "@/components/cars/FeaturedCars";
import FeaturedGuides from "@/components/guides/FeaturedGuides";
import FeaturedDestinations from "@/components/destinations/FeaturedDestinations";

export default function Home() {
  return (
    <div>
      <main>
        <CloudBackground>
          <Navbar />
          <AIInput />
        </CloudBackground>
        <FeaturedDestinations/>
        <FeaturedHotels />
        {/* <FeaturedTours />
        <FeaturedCars />*/}
       <FeaturedGuides /> 
      </main>
    </div>
  );
}
