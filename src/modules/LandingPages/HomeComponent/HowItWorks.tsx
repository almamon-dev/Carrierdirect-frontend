import React, { useState } from "react";
import {
  Package,
  Truck,
  ClipboardList,
  CheckCircle2,
  Radio,
  ShieldCheck,
  Navigation,
  Wallet,
  Sparkles,
} from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { useLandingCMS } from "../components/useLandingCMS";
import SummaryCard from "@/components/cards/summary-card";

export default function HowItWorks() {
  const reveal = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("how_it_works");

  const [activeWorkflow, setActiveWorkflow] = useState<"customer" | "supplier">("customer");

  if (!isSectionEnabled("how_it_works")) {
    return null;
  }

  const badge = cms?.badge || "HOW IT WORKS";
  const title = cms?.title || "A Simple, End-to-End Workflow";
  const subtitle =
    cms?.subtitle ||
    "From quote to delivery — manage freight seamlessly with dedicated workflows for shippers and carriers.";

  const defaultCustomerSteps = [
    {
      step_number: 1,
      title: "Request a Freight Quote",
      description: "Submit shipment specifications, cargo requirements, origin, and destination to get instant digital pricing or competitive live carrier bids within minutes.",
      highlight: "Instant AI & Custom RFQs",
      icon: ClipboardList,
    },
    {
      step_number: 2,
      title: "Compare & Book Carrier",
      description: "Review verified carrier credentials, insurance ratings, and equipment specifications. Confirm your booking with guaranteed escrow protection.",
      highlight: "Verified Carriers & Escrow",
      icon: CheckCircle2,
    },
    {
      step_number: 3,
      title: "Live GPS Tracking",
      description: "Monitor shipment transit progress with continuous live route telemetry, automatic milestone status updates, and direct in-app carrier chat.",
      highlight: "Live GPS & Milestone Alerts",
      icon: Radio,
    },
    {
      step_number: 4,
      title: "Receive POD & Confirm",
      description: "Driver captures electronic receiver signature and photo proof of delivery (POD) on site to instantly verify and securely release payment.",
      highlight: "Instant Digital POD & Release",
      icon: ShieldCheck,
    },
  ];

  const defaultSupplierSteps = [
    {
      step_number: 1,
      title: "Browse Loads & Submit Bids",
      description: "Browse hundreds of verified freight loads matching your vehicle capacity, lane preferences, and quote with flexible pricing and instant notifications.",
      highlight: "Daily High-Value Freight Leads",
      icon: Package,
    },
    {
      step_number: 2,
      title: "Assign Vehicle & Dispatch",
      description: "Allocate available fleet vehicles and dispatch jobs to your drivers in seconds with automated digital trip manifests and cargo instructions.",
      highlight: "One-Click Fleet Dispatch",
      icon: Truck,
    },
    {
      step_number: 3,
      title: "Driver App Live Navigation",
      description: "Drivers receive jobs on mobile, navigate with truck-optimized Google Maps routing, and report real-time progress milestones on the road.",
      highlight: "Driver App Live GPS Routing",
      icon: Navigation,
    },
    {
      step_number: 4,
      title: "Upload POD & Fast Payout",
      description: "Upload digital POD and recipient signature in one click to complete deliveries and receive guaranteed escrow payouts directly in 24-48 hours.",
      highlight: "Fast Automated Escrow Payout",
      icon: Wallet,
    },
  ];

  const customerSteps =
    Array.isArray(cms?.content?.customer_steps) && cms.content.customer_steps.length > 0
      ? cms.content.customer_steps
      : Array.isArray(cms?.content?.steps) && cms.content.steps.length > 0
        ? cms.content.steps
        : defaultCustomerSteps;

  const supplierSteps =
    Array.isArray(cms?.content?.supplier_steps) && cms.content.supplier_steps.length > 0
      ? cms.content.supplier_steps
      : defaultSupplierSteps;

  const currentSteps = activeWorkflow === "customer" ? customerSteps : supplierSteps;

  return (
    <section
      id="how-it-works"
      className="relative bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#ea580c] border border-orange-200/70 mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
              {badge}
            </span>
          )}
          <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6">
              {subtitle}
            </p>
          )}

          {/* Workflow Switcher (Shippers vs Carriers) - Exact style matching Pricing section */}
          <div className="inline-flex bg-white dark:bg-[#1e2329] rounded-full p-1 shadow-2xs dark:shadow-none border border-gray-200 dark:border-[#2b313a] mb-4">
            <button
              type="button"
              onClick={() => setActiveWorkflow("customer")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeWorkflow === "customer"
                  ? "bg-[#0f0400] dark:bg-[#ff4a1f] text-white shadow-xs"
                  : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
              }`}
            >
              For Shippers
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkflow("supplier")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeWorkflow === "supplier"
                  ? "bg-[#0f0400] dark:bg-[#ff4a1f] text-white shadow-xs"
                  : "text-gray-500 dark:text-slate-400 hover:text-[#0f0400] dark:hover:text-white"
              }`}
            >
              For Carriers
            </button>
          </div>
        </div>

        {/* 4 Connected Step Cards Grid (Rendered using SummaryCard) */}
        <div
          ref={reveal.ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative reveal ${
            reveal.isVisible ? "visible" : ""
          }`}
        >
          {currentSteps.map((step: any, idx: number) => {
            const rawTitle = step.title || `Step ${idx + 1}`;
            const cleanTitle = rawTitle.replace(/^\d+[\.\s-]+/, "");
            const defaultStep =
              activeWorkflow === "customer"
                ? defaultCustomerSteps[idx % defaultCustomerSteps.length]
                : defaultSupplierSteps[idx % defaultSupplierSteps.length];
            const highlight = step.highlight || defaultStep.highlight;
            const description =
              step.description && step.description.trim().length >= 60
                ? step.description
                : defaultStep.description;

            return (
              <SummaryCard
                key={`${activeWorkflow}_${idx}`}
                title={cleanTitle}
                description={description}
                highlight={highlight}
                icon={
                  step.icon ||
                  (activeWorkflow === "customer"
                    ? defaultCustomerSteps[idx % defaultCustomerSteps.length].icon
                    : defaultSupplierSteps[idx % defaultSupplierSteps.length].icon)
                }
              />
            );
          })}
        </div>

        {/* Bottom Trust Micro-Bar */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200/70 text-xs font-medium text-gray-600 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            {activeWorkflow === "customer" ? (
              <span>Average quote-to-dispatch turnaround: <strong className="text-gray-900 font-bold">under 15 minutes</strong> across European corridors</span>
            ) : (
              <span>Over <strong className="text-gray-900 font-bold">€2.5M+</strong> in loads completed with guaranteed escrow payouts in 24-48 hours</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
