
import { ScrollRestoration } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";

import BuiltForEveryRole from "./HomeComponent/BuiltForEveryRole";
import CallToAction from "./HomeComponent/CallToAction";
import DriverAppShowcase from "./HomeComponent/DriverAppShowcase";
import HomeFAQAccordion from "./HomeComponent/HomeFAQAccordion";
import HomeHero from "./HomeComponent/HomeHero";
import HowItWorks from "./HomeComponent/HowItWorks";
import KeyFeaturesGrid from "./HomeComponent/KeyFeaturesGrid";
import PricingSection from "./HomeComponent/PricingSection";
import ThePlatformOverview from "./HomeComponent/ThePlatformOverview";
import TrustedbyRealShippersCarriers from "./HomeComponent/TrustedbyRealShippersCarriers";

// Optional CMS-toggleable modules
import ComparisonTable from "./HomeComponent/ComparisonTable";
import HomeMarquee from "./HomeComponent/HomeMarquee";
import SupplierAvailabilities from "./HomeComponent/SupplierAvailabilities";

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

      {/* 10. Pricing Plans */}
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
