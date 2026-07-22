import React from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { 
  ShoppingCart, 
  Settings, 
  Truck, 
  Palette,
  Heart,
  FlaskConical,
  MoreHorizontal
} from "lucide-react";

const industries = [
  { icon: <ShoppingCart className="w-8 h-8 mx-auto" />, name: "Retail" },
  { icon: <Settings className="w-8 h-8 mx-auto" />, name: "Manufacturing" },
  { icon: <Truck className="w-8 h-8 mx-auto" />, name: "E-commerce" },
  { icon: <Palette className="w-8 h-8 mx-auto" />, name: "Automotive" },
  { icon: <Heart className="w-8 h-8 mx-auto" />, name: "Healthcare" },
  { icon: <FlaskConical className="w-8 h-8 mx-auto" />, name: "Food & Beverage" },
  { icon: <MoreHorizontal className="w-8 h-8 mx-auto" />, name: "And More" },
];

export default function IndustriesWeServe() {
  const reveal = useScrollReveal();

  return (
    <section className="w-full bg-transparent py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[#0f0400] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Industries We Serve
          </h2>
        </div>

        <div
          ref={reveal.ref}
          className={`reveal flex flex-wrap justify-center gap-8 md:gap-12 lg:justify-between items-center ${
            reveal.isVisible ? "visible" : ""
          }`}
        >
          {industries.map((ind, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-[#ff4a1f] mb-3 group-hover:scale-110 transition-transform duration-300">
                {ind.icon}
              </div>
              <span className="text-[#0f0400] font-medium text-xs sm:text-sm">
                {ind.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
