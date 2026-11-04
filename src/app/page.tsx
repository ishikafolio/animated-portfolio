import React from "react";
import StudioSection from "@/components/studio/StudioSection";
import HeroSection from "@/components/home/HeroSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SelectedWorkSection />
      <ExperienceSection />
      <AboutSection />
      <StudioSection />
      <ServicesSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
