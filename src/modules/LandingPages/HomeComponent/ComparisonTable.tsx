import React from "react";
import { Check, X, Sparkles } from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";

const comparisons = [
  {
    traditional: "Hidden Fees & Broker Markups",
    platform: "Transparent Flat-Rate Pricing",
  },
  {
    traditional: "Slow Manual Email Quotes (2-24 hrs)",
    platform: "Instant AI-Powered Digital Quotes",
  },
  {
    traditional: "Limited Regional Carrier Access",
    platform: "10,000+ Verified Carrier Fleet Network",
  },
  {
    traditional: "Endless Phone Calls & Status Checks",
    platform: "All-in-One Real-Time SaaS Dashboard",
  },
  {
    traditional: "Manual Paper PODs & Invoicing",
    platform: "Fully Automated Digital Workflows",
  },
];

export default function ComparisonTable() {
  const reveal = useScrollReveal();

  return (
    <section className="w-full bg-transparent pt-12 pb-6 px-4 overflow-hidden relative">
      <div className="relative max-w-7xl mx-auto">

        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="text-[#ff4a1f] font-semibold tracking-wider uppercase text-xs mb-2 block">
            Why Switch
          </span>
          <h2 className="text-[#0f0400] dark:text-slate-100 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            The Smart Choice
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            See why modern shippers are abandoning traditional freight brokers for our completely digital platform.
          </p>
        </div>

        {/* Comparison Matrix Container */}
        <div 
          ref={reveal.ref}
          className={`rounded-2xl border border-gray-200 dark:border-[#384150] bg-white dark:bg-[#181a20] shadow-xl dark:shadow-none overflow-hidden reveal ${reveal.isVisible ? "visible" : ""}`}
        >
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200 dark:border-[#384150]">
            
            {/* Left Header */}
            <div className="px-6 py-4 bg-gray-100/70 dark:bg-[#14181f] flex items-center justify-between border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#384150]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <h3 className="text-gray-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                  Traditional Brokers
                </h3>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-200/70 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                Legacy
              </span>
            </div>

            {/* Right Header */}
            <div className="px-6 py-4 bg-[#0f0400] dark:bg-[#1c2128] flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff4a1f]/20 via-transparent to-[#ff4a1f]/10 pointer-events-none"></div>
              <div className="flex items-center gap-2 relative z-10">
                <Sparkles className="w-4 h-4 text-[#ff4a1f]" />
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                  Carrierdirect Platform
                </h3>
              </div>
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ff4a1f] text-white shadow-sm">
                Recommended
              </span>
            </div>

          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-gray-100 dark:divide-transparent">
            {comparisons.map((row, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 group hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors"
              >
                
                {/* Traditional Side */}
                <div className="px-6 py-4 flex items-center gap-3 bg-gray-50/40 dark:bg-[#14181f]/40 md:border-r border-gray-200 dark:border-[#384150]">
                  <span className="w-5 h-5 rounded-full bg-gray-200/80 dark:bg-red-500/10 flex items-center justify-center shrink-0 border border-transparent dark:border-red-500/20">
                    <X className="w-3 h-3 text-gray-500 dark:text-red-400 stroke-[3]" />
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 text-xs font-medium">
                    {row.traditional}
                  </span>
                </div>

                {/* Carrierdirect Side */}
                <div className="px-6 py-4 flex items-center gap-3 bg-white dark:bg-[#181a20] group-hover:bg-orange-50/30 dark:group-hover:bg-[#ff4a1f]/10 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#ff4a1f]/10 dark:bg-[#ff4a1f]/20 flex items-center justify-center shrink-0 border border-[#ff4a1f]/30">
                    <Check className="w-3 h-3 text-[#ff4a1f] stroke-[3]" />
                  </span>
                  <span className="text-[#0f0400] dark:text-white text-xs font-bold">
                    {row.platform}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
