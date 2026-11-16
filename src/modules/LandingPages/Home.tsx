import React from "react";
import { ScrollRestoration } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeHero from "./HomeComponent/HomeHero";
import ThePlatformOverview from "./HomeComponent/ThePlatformOverview";
import HowItWorks from "./HomeComponent/HowItWorks";
import BuiltForEveryRole from "./HomeComponent/BuiltForEveryRole";
import KeyFeaturesGrid from "./HomeComponent/KeyFeaturesGrid";
import LatestFeatureReleases from "./HomeComponent/LatestFeatureReleases";
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
    <div className="relative min-h-screen bg-[#fafaf9] dark:bg-[#0e1217]">
      {/* Sticky Header Navigation */}
      <Header />

      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Brand Partners Marquee Strip (Immediate Authority & Trust) */}
      <HomeMarquee />

      {/* 3. The Platform (Overview & Laptop/Phone Mockups) */}
      <ThePlatformOverview />

      {/* 5. How It Works (4-Step Workflow) */}
      <HowItWorks />

      {/* 6. Built for Every Role in the Logistics Chain */}
      <BuiltForEveryRole />

      {/* 7. Key Features (Everything You Need to Move Freight) */}
      <KeyFeaturesGrid />

      {/* 8. Driver App for On-the-Go Operations */}
      <DriverAppShowcase />

      {/* 9. Live Supplier Capacity & Routes */}
      <SupplierAvailabilities />

      {/* 10. Latest Feature Releases & Platform Innovations (Noticeboard) */}
      <LatestFeatureReleases />

      {/* 11. Pricing Plans */}
      <PricingSection />

      {/* 12. Comparison Table (Traditional Brokers vs CarrierDirect) */}
      <ComparisonTable />

      {/* 13. Customer Stories / Testimonials */}
      <TrustedbyRealShippersCarriers />

      {/* 14. FAQ Accordion */}
      <HomeFAQAccordion />

      {/* 15. Final CTA Banner */}
      <CallToAction />

      {/* Footer */}
      <Footer />

      <ScrollRestoration />
    </div>
  );
}
