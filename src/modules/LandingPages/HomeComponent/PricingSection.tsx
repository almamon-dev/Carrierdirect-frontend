import React, { useState } from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface Plan {
  id: string | number;
  name: string;
  price: string | number;
  billing_period?: string;
  description?: string;
  is_popular?: boolean;
  features?: string[];
  buttonText?: string;
}

const defaultSupplierPlans: Plan[] = [
  {
    id: 1,
    name: "Independent Driver",
    price: "0",
    billing_period: "/mo",
    description: "Ideal for single Luton, Sprinter, or Courier vehicle owners.",
    features: ["Direct Load Bidding", "Automated POD Upload", "Standard Support", "Mobile App Access"],
    buttonText: "Register Free",
  },
  {
    id: 2,
    name: "Fleet Operator Pro",
    price: "49",
    billing_period: "/mo",
    is_popular: true,
    description: "Designed for transport businesses with multiple HGV/Van fleets.",
    features: ["Unlimited Carrier Quotes", "Priority Dispatch System", "Multi-Driver Account Management", "Dedicated Account Manager"],
    buttonText: "Start Fleet Pro",
  },
  {
    id: 3,
    name: "Enterprise Logistics",
    price: "149",
    billing_period: "/mo",
    description: "Custom SaaS integration for large haulage and logistics providers.",
    features: ["White-Label Portal", "API & Webhook Integrations", "Custom SLA Guarantees", "24/7 Dedicated Support"],
    buttonText: "Contact Enterprise",
  },
];

const defaultShipperPlans: Plan[] = [
  {
    id: 101,
    name: "Pay As You Move",
    price: "0",
    billing_period: "/job",
    description: "For households & individuals needing one-off removals or delivery.",
    features: ["Instant Quote Comparison", "Verified Drivers Only", "Escrow Secured Payment", "Real-Time Tracking"],
    buttonText: "Book Move Now",
  },
  {
    id: 102,
    name: "Business Starter",
    price: "29",
    billing_period: "/mo",
    is_popular: true,
    description: "For regular commercial shippers, retailers, and local businesses.",
    features: ["Monthly Consolidated Invoicing", "Priority Driver Allocation", "Dedicated Support Specialist", "Volume Rate Discounts"],
    buttonText: "Open Trade Account",
  },
  {
    id: 103,
    name: "Corporate Freight",
    price: "99",
    billing_period: "/mo",
    description: "Full supply chain management for enterprise distributors.",
    features: ["Custom Rate Card Setup", "Dedicated Freight Logistics Desk", "Guaranteed Capacity SLA", "ERP & Order API Sync"],
    buttonText: "Talk to Logistics",
  },
];

export default function PricingSection() {
  const heading = useScrollReveal();
  const pricingCards = useScrollReveal();
  
  const [activeRole, setActiveRole] = useState<"customer" | "supplier">("supplier");
  const plans = activeRole === "supplier" ? defaultSupplierPlans : defaultShipperPlans;

  return (
    <section id="pricing" className="w-full bg-transparent pt-12 pb-4 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div
          ref={heading.ref}
          className={`text-center max-w-3xl mx-auto mb-12 reveal ${heading.isVisible ? "visible" : ""}`}
        >
          <span className="text-[#ff4a1f] font-semibold tracking-wider uppercase text-sm mb-3 block">Simple Pricing</span>
          <h2 className="text-[#0f0400] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Transparent Pricing for Everyone
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8">
            Whether you're shipping one pallet or managing a fleet of trucks, we have a plan that fits your business.
          </p>

          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveRole("customer")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${
                activeRole === "customer" 
                  ? "bg-[#0f0400] text-white shadow-md" 
                  : "text-gray-500 hover:text-[#0f0400]"
              }`}
            >
              For Shippers
            </button>
            <button
              onClick={() => setActiveRole("supplier")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${
                activeRole === "supplier" 
                  ? "bg-[#0f0400] text-white shadow-md" 
                  : "text-gray-500 hover:text-[#0f0400]"
              }`}
            >
              For Carriers
            </button>
          </div>
        </div>

        <div ref={pricingCards.ref} className={`reveal ${pricingCards.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch max-w-7xl mx-auto">
            {plans.map((plan, i) => (
              <div 
                key={plan.id || i} 
                className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col h-full ${
                  plan.is_popular 
                    ? "bg-[#0f0400] border-[#ff4a1f] shadow-lg md:-translate-y-2 z-10 text-white" 
                    : "bg-white border-gray-200 shadow-sm hover:shadow hover:border-[#ff4a1f]/30 text-[#0f0400]"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#ff4a1f] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-lg font-bold mb-1 ${plan.is_popular ? "text-white" : "text-[#0f0400]"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs min-h-[36px] leading-relaxed ${plan.is_popular ? "text-gray-400" : "text-gray-500"}`}>
                    {plan.description || "The perfect plan to grow your business."}
                  </p>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-100/10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.is_popular ? "text-white" : "text-[#0f0400]"}`}>
                      £{plan.price}
                    </span>
                    <span className={`text-xs ${plan.is_popular ? "text-gray-400" : "text-gray-500"}`}>
                      {plan.billing_period || "/mo"}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.is_popular ? "bg-[#ff4a1f]/20 text-[#ff4a1f]" : "bg-green-50 text-green-500"
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className={`text-xs leading-relaxed ${plan.is_popular ? "text-gray-300" : "text-gray-600"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/web/register">
                  <button 
                    className={`w-full py-2.5 px-4 rounded-sm font-bold text-xs transition-all duration-300 ${
                      plan.is_popular
                        ? "bg-[#ff4a1f] text-white hover:bg-[#e63d15] hover:shadow-md"
                        : "bg-gray-50 text-[#0f0400] hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {plan.buttonText || "Choose Plan"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
