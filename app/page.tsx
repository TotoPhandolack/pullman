import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Rooms from "./components/Rooms";
import Gallery from "./components/Gallery";
import Amenities from "./components/Amenities";
import Reviews from "./components/Reviews";
import BookingBar from "./components/BookingBar";
import Location from "./components/Location";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Gallery />
        <Amenities />
        <Reviews />
        <BookingBar />
        <Location />
      </main>
      <Footer />
    </>
  );
}
