import React from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { AllImages } from '@/components/AllPhotos/AllImages';
import { Check } from "lucide-react";

const features = [
  {
    title: "See only suppliers available on your pickup date",
    desc: "Real-time availability matching — no more chasing ghosts.",
  },
  {
    title: "View remaining capacity before engaging",
    desc: "Know exactly what's available before you commit.",
  },
  {
    title: "Compare quotes from verified, capable carriers",
    desc: "All quotes are transparent — no hidden broker fees.",
  },
];

export default function HomeGetActuallyBook() {
  const image = useScrollReveal();
  const text = useScrollReveal();

  return (
    <section className="w-full section-spacing px-4 relative overflow-hidden bg-white dark:bg-[#12161c] transition-colors duration-200">
      <div className="relative max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            ref={image.ref}
            className={`order-2 lg:order-1 reveal ${image.isVisible ? "visible" : ""}`}
          >
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-[#1e2329]">
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#181a20] px-3 py-2 border-b border-gray-200 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="ml-3 flex-1 bg-white dark:bg-[#1e2329] rounded px-2 py-0.5 text-xs text-gray-400 dark:text-slate-400 font-mono">
                  app.getitmoving.com/quotes
                </span>
              </div>
              <img
                src={AllImages.ShippersDashboard}
                className="w-full h-auto block dark:brightness-90 dark:contrast-105"
                alt="Quotes Dashboard"
              />
            </div>
            <div className="mt-4 bg-orange-50 dark:bg-[#1e2329] border border-orange-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ff4a1f] flex items-center justify-center shrink-0 shadow-md shadow-[#ff4a1f]/30">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-[#0f0400] dark:text-slate-100 text-sm font-semibold">Instant Quote Matching</p>
                <p className="text-gray-400 dark:text-slate-400 text-xs">Avg. response time under 2 hours</p>
              </div>
            </div>
          </div>

          <div
            ref={text.ref}
            className={`flex flex-col justify-center order-1 lg:order-2 reveal ${text.isVisible ? "visible" : ""}`}
          >
            <span className="inline-block text-[#ff4a1f] text-xs font-bold uppercase tracking-widest mb-4">
              For Shippers
            </span>
            <h2 className="text-[#0f0400] dark:text-slate-100 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Get quotes you can{" "}
              <span className="text-[#ff4a1f]">actually book</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
              No more chasing unavailable carriers or receiving quotes from suppliers who can't deliver.
            </p>
            <ul className="space-y-6">
              {features.map((item, index) => (
                <li key={index} className="flex gap-4 items-start group">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff4a1f] group-hover:scale-110 transition-transform duration-200">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[#0f0400] dark:text-slate-100 font-semibold text-base leading-snug">{item.title}</p>
                    <p className="mt-1.5 text-gray-400 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
