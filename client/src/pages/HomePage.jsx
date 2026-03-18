import Hero from "../components/home/Hero";
import SpecialitySection from "../components/home/SpecialitySection";
import PopularSection from "../components/home/PopularSection";
import Footer from "../components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <SpecialitySection />
      <PopularSection />
      <Footer />
    </div>
  );
};

export default HomePage;
