import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/navbar";
import HeroSection from "../components/home/hero";
import FeaturesSection from "../components/home/features";
import AboutSection from "../components/home/about";
import ContactSection from "../components/home/contact";
import Footer from "../components/home/footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection navigate={navigate} />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
