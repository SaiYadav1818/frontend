import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustSecurity from "./components/TrustSecurity";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import GoldPriceWidget from "./components/GoldPriceWidget";
import MobileApp from "./components/MobileApp";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <TrustSecurity />
      <HowItWorks />
      <Features />
      <GoldPriceWidget />
      <MobileApp />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;