import React from "react";
import { Monitor, Smartphone, Link2, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { useLandingCMS } from "../components/useLandingCMS";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { API_CONFIG } from "@/config/api";

function getAssetUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const apiBase = API_CONFIG.baseURL ? API_CONFIG.baseURL.replace(/\/api\/?$/, "") : "http://localhost:8000";
  return `${apiBase}/${trimmed.replace(/^\//, "")}`;
}

export default function ThePlatformOverview() {
  const reveal = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("platform_overview");

  if (!isSectionEnabled("platform_overview")) {
    return null;
  }

  const badge = cms?.badge || "THE PLATFORM";
  const title = cms?.title || "A Complete Freight Platform for Modern Logistics";
  const subtitle =
    cms?.subtitle ||
    "Manage orders, carriers, drivers, and deliveries in one connected system. Built for shippers, suppliers, and transport operators across Europe.";

  // Single custom image uploaded from Admin CMS (Exactly ONE image)
  const platformImage =
    cms?.content?.image ||
    cms?.content?.preview_image ||
    cms?.content?.mobile_image ||
    cms?.content?.laptop_image ||
    cms?.content?.web_image ||
    cms?.content?.app_image;

  const defaultFeatures = [
    {
      title: "Web Platform",
      description: "Manage orders, carriers, drivers, pricing, and operations.",
      icon: "Monitor",
    },
    {
      title: "Driver App",
      description: "Receive jobs, navigate, update status, and upload proof of delivery (POD).",
      icon: "Smartphone",
    },
    {
      title: "Connected Ecosystem",
      description: "Real-time sync between shippers, suppliers, and drivers.",
      icon: "Link2",
    },
  ];

  const features =
    Array.isArray(cms?.content?.features) && cms.content.features.length > 0
      ? cms.content.features
      : defaultFeatures;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor":
        return <Monitor className="w-5 h-5 text-[#ea580c]" />;
      case "Smartphone":
        return <Smartphone className="w-5 h-5 text-[#ea580c]" />;
      case "Link2":
      default:
        return <Link2 className="w-5 h-5 text-[#ea580c]" />;
    }
  };

  return (
    <section
      id="the-platform"
      className="relative bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Mockup & Features Grid */}
        <div
          ref={reveal.ref}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center reveal ${
            reveal.isVisible ? "visible" : ""
          }`}
        >
          {/* Left/Center Visual Area: Exactly ONE Single Image (No Border, No Box Background) */}
          <div className="lg:col-span-8 flex items-center justify-center">
            {platformImage ? (
              <div className="relative mx-auto max-w-2xl lg:max-w-none w-full flex items-center justify-center">
                <img
                  src={getAssetUrl(platformImage)}
                  alt="CarrierDirect Platform Preview"
                  className="w-full h-auto max-h-[440px] object-contain"
                />
              </div>
            ) : (
              <div className="w-full max-w-xl h-64 sm:h-80 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center">
                <Monitor className="w-10 h-10 text-[#ea580c] mb-2" />
                <p className="font-bold text-gray-700 text-sm">Platform Overview Image</p>
                <p className="text-xs text-gray-400 mt-1">Upload a single overview image in Admin CMS</p>
              </div>
            )}
          </div>

          {/* Right Column: 3 Feature Description Cards (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3">
            {features.map((feature: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-[4px] bg-white dark:bg-[#1e2329] hover:bg-orange-50/20 border border-slate-200/90 dark:border-slate-800 hover:border-[#ff4a1f]/40 shadow-2xs transition-all duration-200 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-[4px] bg-orange-50 border border-orange-100/70 group-hover:bg-[#ff4a1f] group-hover:text-white text-[#ff4a1f] flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                    {renderIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm mb-0.5 group-hover:text-[#ff4a1f] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
