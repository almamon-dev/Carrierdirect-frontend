import React from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Shield, BarChart2, MapPin, Lock, MessageSquare, Globe } from "lucide-react";

const features = [
  { icon: <Shield className="w-5 h-5" />, title: "Verified Compliance", description: "All carriers are strictly FMCSA verified." },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Instant Matching", description: "AI engine instantly pairs you with optimal carriers." },
  { icon: <MapPin className="w-5 h-5" />, title: "Real-time Tracking", description: "Monitor shipments live with instant notifications." },
  { icon: <Lock className="w-5 h-5" />, title: "Secure Payments", description: "Bank-grade encrypted escrow ensures safety." },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Dispute Resolution", description: "Dedicated support team to help resolve issues." },
  { icon: <Globe className="w-5 h-5" />, title: "Global Connectivity", description: "Access our vast carrier network anywhere." },
];

export default function HomeWhyPlatformDifferent() {
  const heading = useScrollReveal();
  const content = useScrollReveal();

  return (
    <section id="features" className="w-full bg-transparent py-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div
          ref={heading.ref}
          className={`mb-12 text-center reveal ${heading.isVisible ? "visible" : ""}`}
        >
          <h2 className="text-[#0f0400] dark:text-slate-100 text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Why Choose Carrierdirect?
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            We've engineered the ultimate freight matching platform, combining AI-driven logistics with uncompromising security to streamline your entire supply chain.
          </p>
        </div>

        <div 
          ref={content.ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center reveal ${content.isVisible ? "visible" : ""}`}
        >
          
          <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2b313a] shadow-xl dark:shadow-none bg-white dark:bg-[#1e2329] w-full">
            <div className="bg-[#0f0400] px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-white/40 text-xs ml-3 font-mono">carrierdirect.app</span>
            </div>
            <img 
              src={AllImages.HeroCard} 
              alt="Platform Dashboard" 
              className="w-full h-auto object-cover" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-[#1e2329] rounded-md px-4 py-3.5 border border-gray-100 dark:border-[#2b313a] shadow-sm dark:shadow-none hover:shadow hover:border-[#ff4a1f]/30 dark:hover:border-[#ff4a1f]/50 transition-all duration-200 group flex flex-col items-start"
              >
                <div className="w-8 h-8 rounded-md bg-[#ff4a1f]/10 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center shrink-0 group-hover:bg-[#ff4a1f] group-hover:text-white transition-colors duration-200 mb-2">
                  {f.icon}
                </div>
                <h3 className="text-[#0f0400] dark:text-slate-100 text-sm font-bold mb-1">{f.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-[13px] leading-tight">{f.description}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
