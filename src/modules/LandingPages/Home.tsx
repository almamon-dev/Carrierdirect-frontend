import React from "react";
import { ScrollRestoration } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeHero from "./HomeComponent/HomeHero";
import HomeMarquee from "./HomeComponent/HomeMarquee";
import HowItWorks from "./HomeComponent/HowItWorks";
import HomeWhyPlatformDifferent from "./HomeComponent/HomeWhyPlatformDifferent";
import ComparisonTable from "./HomeComponent/ComparisonTable";
import TrustedbyRealShippersCarriers from "./HomeComponent/TrustedbyRealShippersCarriers";
import PricingSection from "./HomeComponent/PricingSection";
import HomeFAQAccordion from "./HomeComponent/HomeFAQAccordion";
import CallToAction from "./HomeComponent/CallToAction";
import SupplierAvailabilities from "./HomeComponent/SupplierAvailabilities";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-[#fafaf9]"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 74, 31, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 74, 31, 0.06) 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Sticky Header Navigation */}
      <Header />

      {/* 1. Hero */}
      <HomeHero />

      {/* 2. Features: Why This Platform Is Different */}
      <HomeWhyPlatformDifferent />

      {/* 3. Features: Comparison Table */}
      <ComparisonTable />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* Supplier Availabilities */}
      <SupplierAvailabilities />

      {/* 5. Pricing */}
      <PricingSection />

      {/* 6. Trusted brand logos marquee strip */}
      <HomeMarquee />

      {/* 7. Carriers / Testimonials */}
      <TrustedbyRealShippersCarriers />

      {/* 8. FAQ */}
      <HomeFAQAccordion />

      {/* 9. CTA Banner */}
      <CallToAction />

      {/* Footer */}
      <Footer />

      <ScrollRestoration />
    </div>
  );
}
