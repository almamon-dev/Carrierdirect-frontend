import React from "react";
import { ScrollRestoration } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeHero from "./HomeComponent/HomeHero";
import ThePlatformOverview from "./HomeComponent/ThePlatformOverview";
import KeyStatsBar from "./HomeComponent/KeyStatsBar";
import HowItWorks from "./HomeComponent/HowItWorks";
import BuiltForEveryRole from "./HomeComponent/BuiltForEveryRole";
import KeyFeaturesGrid from "./HomeComponent/KeyFeaturesGrid";
import DriverAppShowcase from "./HomeComponent/DriverAppShowcase";
import PricingSection from "./HomeComponent/PricingSection";
import TrustedbyRealShippersCarriers from "./HomeComponent/TrustedbyRealShippersCarriers";
import HomeFAQAccordion from "./HomeComponent/HomeFAQAccordion";
import CallToAction from "./HomeComponent/CallToAction";

// Optional CMS-toggleable modules
import SupplierAvailabilities from "./HomeComponent/SupplierAvailabilities";
import ComparisonTable from "./HomeComponent/ComparisonTable";
import HomeMarquee from "./HomeComponent/HomeMarquee";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-[#fafaf9]"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 74, 31, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 74, 31, 0.04) 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Sticky Header Navigation */}
      <Header />

      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. The Platform (Overview & Laptop/Phone Mockups) */}
      <ThePlatformOverview />

      {/* 3. Key Statistics Bar */}
      <KeyStatsBar />

      {/* 4. How It Works (4-Step Workflow) */}
      <HowItWorks />

      {/* 5. Built for Every Role in the Logistics Chain */}
      <BuiltForEveryRole />

      {/* 6. Key Features (Everything You Need to Move Freight) */}
      <KeyFeaturesGrid />

      {/* Optional: Supplier Capacity & Live Routes (CMS toggled) */}
      <SupplierAvailabilities />

      {/* 7. Driver App for On-the-Go Operations */}
      <DriverAppShowcase />

      {/* 8. Pricing Plans */}
      <PricingSection />

      {/* Optional: Comparison Table (CMS toggled) */}
      <ComparisonTable />

      {/* 9. Customer Stories / Testimonials */}
      <TrustedbyRealShippersCarriers />



      {/* Optional: Brand Partners Marquee Strip (CMS toggled) */}
      <HomeMarquee />

      {/* 11. FAQ Accordion */}
      <HomeFAQAccordion />

      {/* 12. Final CTA Banner */}
      <CallToAction />

      {/* Footer */}
      <Footer />

      <ScrollRestoration />
    </div>
  );
}
