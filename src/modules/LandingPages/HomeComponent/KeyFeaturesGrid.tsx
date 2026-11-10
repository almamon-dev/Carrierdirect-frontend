import React from "react";
import { useLandingCMS } from "../components/useLandingCMS";
import useScrollReveal from "@/Hooks/useScrollReveal";
import SummaryCard from "@/components/cards/summary-card";

export default function KeyFeaturesGrid() {
  const reveal = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("why_choose_us");

  if (!isSectionEnabled("why_choose_us")) {
    return null;
  }

  const badge = cms?.badge || "KEY FEATURES";
  const title = cms?.title || "Everything You Need to Move Freight";
  const subtitle =
    cms?.subtitle ||
    "All the essential tools and automations designed for modern freight movement.";

  const defaultFeatures = [
    {
      title: "Order & Shipment Management",
      description: "Create, manage, and track shipments with full visibility.",
      icon: "Truck",
    },
    {
      title: "Carrier & Driver Management",
      description: "Onboard, verify, and manage your transport network.",
      icon: "Users",
    },
    {
      title: "Real-Time Tracking",
      description: "Live location, status updates, and delivery visibility.",
      icon: "MapPin",
    },
    {
      title: "Proof of Delivery (POD)",
      description: "Upload, review, and approve delivery proof instantly.",
      icon: "FileCheck",
    },
    {
      title: "Availability & Capacity",
      description: "Set and manage vehicle availability and service areas.",
      icon: "Calendar",
    },
    {
      title: "Payments & Escrow",
      description: "Secure payments with escrow and release on delivery.",
      icon: "Wallet",
    },
    {
      title: "Reporting & Analytics",
      description: "Key insights on orders, performance, and operations.",
      icon: "BarChart3",
    },
    {
      title: "Multi-Tenant & Scalable",
      description: "Run your own logistics platform with flexible subscription plans.",
      icon: "Layers",
    },
  ];

  const features =
    Array.isArray(cms?.content?.features) && cms.content.features.length > 0
      ? cms.content.features
      : defaultFeatures;

  return (
    <section id="features" className="bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {badge && (
            <span className="text-[#ea580c] font-bold text-[11px] uppercase tracking-widest mb-1.5 inline-block">
              {badge}
            </span>
          )}
          <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 8-Card Grid (4 cols on lg, 2 cols on sm) */}
        <div
          ref={reveal.ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 reveal ${
            reveal.isVisible ? "visible" : ""
          }`}
        >
          {features.map((feature: any, idx: number) => (
            <SummaryCard
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
