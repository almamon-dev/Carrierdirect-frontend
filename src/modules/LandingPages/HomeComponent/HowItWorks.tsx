import React from "react";
import { Package, CheckCircle2, Sparkles, Layers } from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";

export default function HowItWorks() {
  const reveal = useScrollReveal();

  return (
    <section 
      id="how-it-works" 
      className="relative bg-[#fafaf9] py-12 md:py-16 px-4 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 74, 31, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 74, 31, 0.04) 1px, transparent 1px)`,
        backgroundSize: `32px 32px`,
      }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title */}
        <h2 className="text-[#0f0400] text-2xl sm:text-3xl font-bold tracking-tight text-center mb-8 md:mb-10">
          How It Works
        </h2>

        {/* Central Connected Diagram Area */}
        <div ref={reveal.ref} className={`relative reveal ${reveal.isVisible ? "visible" : ""}`}>
          
          {/* Top Central Hub Icon Badge */}
          <div className="flex justify-center mb-6 relative z-20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-[#ff7e5f] p-0.5 shadow-md shadow-[#ff4a1f]/20 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#ff4a1f] border border-white/50 flex items-center justify-center">
                <Layers className="text-white w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SVG Connecting Tree Lines (Desktop Only) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1000 380" fill="none">
              {/* Left Branch */}
              <path 
                d="M 500 35 L 500 55 Q 500 90 250 90 L 250 130" 
                stroke="#ff4a1f" 
                strokeWidth="1.5" 
                strokeOpacity="0.25" 
                fill="none" 
              />
              {/* Right Branch */}
              <path 
                d="M 500 35 L 500 55 Q 500 90 750 90 L 750 130" 
                stroke="#ff4a1f" 
                strokeWidth="1.5" 
                strokeOpacity="0.25" 
                fill="none" 
              />
              {/* Center Down Branch */}
              <path 
                d="M 500 35 L 500 240" 
                stroke="#ff4a1f" 
                strokeWidth="1.5" 
                strokeOpacity="0.25" 
                fill="none" 
              />
            </svg>
          </div>

          {/* Top Row: 2 Cards (Submit A Quote & Smart Matching) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8 relative z-10">
            
            {/* Card 1: Submit A Quote Request */}
            <div className="relative bg-gradient-to-l from-[#FFF2ED] via-white to-white rounded-2xl p-5 sm:p-6 shadow-md shadow-orange-950/5 border border-orange-100/80 md:text-right flex flex-col items-center md:items-end justify-center group hover:-translate-y-0.5 transition-all duration-200">
              {/* Floating Badge Icon */}
              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-[#ff7a57] text-white flex items-center justify-center shadow-sm shadow-[#ff4a1f]/20 border border-white">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f0400] mb-1.5">
                Submit A Quote Request
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-normal max-w-sm">
                Client enters route (Country → Country / City → City), pickup date, pallets, weight, and dimensions.
              </p>
            </div>

            {/* Card 2: Smart Matching */}
            <div className="relative bg-gradient-to-r from-[#FFF2ED] via-white to-white rounded-2xl p-5 sm:p-6 shadow-md shadow-orange-950/5 border border-orange-100/80 md:text-left flex flex-col items-center md:items-start justify-center group hover:-translate-y-0.5 transition-all duration-200">
              {/* Floating Badge Icon */}
              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-[#ff7a57] text-white flex items-center justify-center shadow-sm shadow-[#ff4a1f]/20 border border-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f0400] mb-1.5">
                Smart Matching
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-normal max-w-sm">
                The system automatically matches your shipment to a trusted pickup date availability and capacity.
              </p>
            </div>

          </div>

          {/* Bottom Row: 1 Centered Card (Receive Real Quotes) */}
          <div className="flex justify-center relative z-10">
            <div className="w-full md:w-6/12 bg-gradient-to-b from-[#FFF2ED] via-white to-white rounded-2xl p-5 sm:p-6 shadow-md shadow-orange-950/5 border border-orange-100/80 text-center flex flex-col items-center justify-center group hover:-translate-y-0.5 transition-all duration-200">
              {/* Floating Badge Icon */}
              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-[#ff7a57] text-white flex items-center justify-center shadow-sm shadow-[#ff4a1f]/20 border border-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f0400] mb-1.5">
                Receive Real Quotes
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-normal max-w-sm">
                Suppliers review the request, submit final prices, and client compares & accepts the best option.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
