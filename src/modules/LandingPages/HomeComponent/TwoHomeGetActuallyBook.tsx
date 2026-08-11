import React from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { Check } from "lucide-react";

const features = [
  "Set availability by date or week",
  "Declare capacity (pallets / space)",
  "Get enquiries only when you can actually deliver",
  "Quote directly, manage orders & payments",
];

export default function TwoHomeGetActuallyBook() {
  const text = useScrollReveal();
  const image = useScrollReveal();

  return (
    <section className="w-full section-spacing px-4 relative overflow-hidden bg-slate-900 dark:bg-[#12161c] text-white transition-colors duration-200">
      <div className="relative max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            ref={text.ref}
            className={`flex flex-col justify-center reveal ${text.isVisible ? "visible" : ""}`}
          >
            <span className="inline-block text-[#ff4a1f] text-xs font-bold uppercase tracking-widest mb-4">
              For Carriers
            </span>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Receive only{" "}
              <span className="text-[#ff4a1f]">relevant enquiries</span>{" "}
              — nothing wasted
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10">
              Stop responding to enquiries you can't fulfill. Only see requests that match your availability and capacity.
            </p>
            <ul className="space-y-5">
              {features.map((item, i) => (
                <li key={i} className="flex gap-4 items-center group">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff4a1f] group-hover:scale-110 transition-transform duration-200">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </span>
                  <p className="text-white/90 font-medium text-base">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={image.ref}
            className={`reveal ${image.isVisible ? "visible" : ""}`}
          >
            <div className="rounded-xl overflow-hidden border border-white/10 dark:border-slate-800 shadow-2xl bg-slate-800 dark:bg-[#1e2329]">
              <div className="flex items-center gap-1.5 bg-slate-950 dark:bg-[#181a20] px-3 py-2 border-b border-white/10 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-red-500/70"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500/70"></span>
                <span className="w-2 h-2 rounded-full bg-green-500/70"></span>
                <span className="ml-3 flex-1 bg-white/5 dark:bg-[#1e2329] rounded px-2 py-0.5 text-xs text-white/40 dark:text-slate-400 font-mono">
                  app.getitmoving.com/carrier
                </span>
              </div>
              <img
                src={AllImages.CarriersDashboard}
                alt="Carrier Dashboard"
                className="w-full h-auto block dark:brightness-90 dark:contrast-105"
              />
            </div>
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-md shadow-green-500/30">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Smart Capacity Management</p>
                <p className="text-white/40 text-xs">Only relevant jobs, zero wasted responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
