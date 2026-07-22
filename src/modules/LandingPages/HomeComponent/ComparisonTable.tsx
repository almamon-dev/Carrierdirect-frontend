import React from "react";
import { Check, X } from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";

const traditional = [
  "Hidden Fees & Markups",
  "Slow Manual Quotes",
  "Limited Carrier Network",
  "Endless Phone Calls",
  "Paperwork & Emails",
];

const platform = [
  "Transparent Flat Pricing",
  "Instant AI-Powered Quotes",
  "Thousands of Verified Carriers",
  "All-in-One Dashboard",
  "Fully Automated Workflows",
];

export default function ComparisonTable() {
  const reveal = useScrollReveal();

  return (
    <section className="w-full bg-transparent pt-12 pb-4 px-4 overflow-hidden relative">
      <div className="relative max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-[#0f0400] text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            The Smart Choice
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            See why modern shippers are abandoning traditional freight brokers for our completely digital platform.
          </p>
        </div>

        <div 
          ref={reveal.ref}
          className={`relative grid grid-cols-1 md:grid-cols-2 gap-0 items-center reveal ${reveal.isVisible ? "visible" : ""}`}
        >

          <div className="flex flex-col bg-gray-50 rounded-2xl md:rounded-r-none md:rounded-l-2xl overflow-hidden border border-gray-200 border-r-0">
            <div className="px-6 py-4 text-center border-b border-gray-200 bg-gray-100/50">
              <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Traditional Brokers</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-200/60 p-1">
              {traditional.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 text-gray-500 stroke-[3]" />
                  </span>
                  <span className="text-gray-500 text-xs font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center z-20 text-[#ff4a1f] font-bold text-[10px]">
            VS
          </div>

          <div className="flex flex-col bg-white rounded-2xl md:rounded-2xl overflow-hidden shadow-lg border-2 border-[#ff4a1f] relative z-10 -mt-2 md:mt-0 md:-translate-x-1">
            <div className="bg-[#0f0400] px-6 py-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff4a1f] opacity-20 blur-[20px] -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-white font-bold text-sm tracking-wide relative z-10">Carrierdirect Platform</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-50 p-1">
              {platform.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50/30 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#ff4a1f]/10 flex items-center justify-center shrink-0 border border-[#ff4a1f]/20">
                    <Check className="w-3 h-3 text-[#ff4a1f] stroke-[3]" />
                  </span>
                  <span className="text-[#0f0400] text-xs font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
