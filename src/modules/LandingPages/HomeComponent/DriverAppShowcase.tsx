import useScrollReveal from "@/Hooks/useScrollReveal";
import { API_CONFIG } from "@/config/api";
import { ClipboardCheck, Navigation, UploadCloud } from "lucide-react";
import { useLandingCMS } from "../components/useLandingCMS";

function getAssetUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const apiBase = API_CONFIG.baseURL ? API_CONFIG.baseURL.replace(/\/api\/?$/, "") : "http://localhost:8000";
  return `${apiBase}/${trimmed.replace(/^\//, "")}`;
}

export default function DriverAppShowcase() {
  const reveal = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("driver_app");

  if (!isSectionEnabled("driver_app")) {
    return null;
  }

  const title = cms?.title || "Driver App for On-the-Go Operations";
  const subtitle =
    cms?.subtitle ||
    "A dedicated mobile app for drivers to receive jobs, navigate efficiently, and complete deliveries with POD.";

  const playStoreUrl = cms?.content?.play_store_url || "https://play.google.com";
  const appStoreUrl = cms?.content?.app_store_url || "https://apple.com/app-store";

  // Single showcase image uploaded from Admin CMS
  const showcaseImage =
    cms?.content?.image ||
    cms?.content?.preview_image ||
    cms?.content?.app_image ||
    cms?.content?.mockup_image;

  const defaultFeatures = [
    {
      title: "Receive & Manage Jobs",
      description: "Instant trip assignment alerts and order manifests.",
      icon: "ClipboardCheck",
    },
    {
      title: "Turn-by-Turn Navigation",
      description: "Optimized truck routes with live Google Maps navigation.",
      icon: "Navigation",
    },
    {
      title: "Upload POD & Update Status",
      description: "Capture photo and digital receiver signature in one click.",
      icon: "UploadCloud",
    },
  ];

  const features =
    Array.isArray(cms?.content?.features) && cms.content.features.length > 0
      ? cms.content.features
      : defaultFeatures;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "ClipboardCheck":
        return <ClipboardCheck className="w-4 h-4 text-[#ea580c]" />;
      case "Navigation":
        return <Navigation className="w-4 h-4 text-[#ea580c]" />;
      case "UploadCloud":
      default:
        return <UploadCloud className="w-4 h-4 text-[#ea580c]" />;
    }
  };

  return (
    <section id="driver-app" className="bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          ref={reveal.ref}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center reveal ${reveal.isVisible ? "visible" : ""
            }`}
        >
          {/* Left Column: Heading, Subtitle & App Store Badges */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                <span className="text-[#ea580c] block">Driver App</span>
                for On-the-Go Operations
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Store Download Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Google Play Store Badge */}
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-gray-800 text-white rounded-[4px] transition-all shadow-md hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.378-.403-.61-.954-.61-1.579V3.393c0-.625.232-1.176.61-1.579zm11.235 11.238l2.083 2.083-11.89 6.848 9.807-8.931zm0-2.104L5.037 1.996l11.89 6.848-2.083 2.104zm1.488 1.052l3.411 1.964c.942.542.942 1.428 0 1.97l-3.411 1.964-2.34-2.34 2.34-2.34z" />
                </svg>
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-300 leading-none">GET IT ON</span>
                  <span className="block text-[11px] font-bold leading-tight">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-gray-800 text-white rounded-[4px] transition-all shadow-md hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z" />
                </svg>
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-300 leading-none">Download on the</span>
                  <span className="block text-[11px] font-bold leading-tight">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Center Column: Single Showcase Image or Default 3-Phone Mockup (No Scroll, Tall & High-Fidelity) */}
          <div className="lg:col-span-5 flex justify-center items-center py-2 overflow-visible">
            {showcaseImage ? (
              /* If Admin uploaded 1 showcase image */
              <div className="relative mx-auto max-w-lg w-full flex items-center justify-center overflow-visible">
                <img
                  src={getAssetUrl(showcaseImage)}
                  alt="CarrierDirect Driver App Showcase"
                  className="w-full h-auto max-h-[440px] sm:max-h-[480px] object-contain drop-shadow-xl"
                />
              </div>
            ) : (
              <div className="flex justify-center items-end gap-2 sm:gap-3 md:gap-3.5 overflow-visible py-4 select-none">

                {/* SCREEN 1: Today's Jobs (Taller Smartphone) */}
                <div className="w-32 sm:w-36 md:w-40 bg-gray-900 rounded-[26px] p-1.5 sm:p-2 shadow-xl border border-gray-700 shrink-0 h-[280px] sm:h-[310px] flex flex-col justify-between">
                  <div className="w-8 h-1 bg-gray-700 rounded-full mx-auto mb-1.5 shrink-0" />
                  <div className="bg-white rounded-[18px] p-2 sm:p-2.5 text-gray-800 flex flex-col justify-between flex-1 overflow-hidden text-[9px] shadow-inner space-y-1.5">
                    <div>
                      <div className="font-extrabold text-[10px] text-gray-900 pb-1 border-b border-gray-100 flex items-center justify-between">
                        <span>Today's Jobs</span>
                        <span className="text-[8px] bg-orange-100 text-[#ea580c] px-1 py-0.2 rounded font-bold">2 Active</span>
                      </div>

                      <div className="mt-1.5 space-y-1.5">
                        <div className="bg-orange-50/90 border border-orange-200/90 rounded-lg p-1.5">
                          <div className="font-bold text-[#ea580c] flex justify-between text-[8.5px]">
                            <span>CD-1054</span>
                            <span className="text-[7px] bg-[#ea580c] text-white px-1 rounded font-bold">ACTIVE</span>
                          </div>
                          <p className="font-bold text-gray-800 mt-0.5 text-[9px] leading-tight">Berlin → Munich</p>
                          <p className="text-[7.5px] text-gray-400">Pickup: 10:00 AM • 4 Pallets</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5">
                          <div className="font-bold text-gray-700 flex justify-between text-[8.5px]">
                            <span>CD-1055</span>
                            <span className="text-[7px] bg-gray-200 text-gray-600 px-1 rounded font-semibold">PENDING</span>
                          </div>
                          <p className="font-bold text-gray-800 mt-0.5 text-[9px] leading-tight">Hamburg → Frankfurt</p>
                          <p className="text-[7.5px] text-gray-400">Pickup: 12:30 PM • 6 Pallets</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-1.5 hidden sm:block">
                          <div className="font-bold text-gray-500 flex justify-between text-[8px]">
                            <span>CD-1056</span>
                            <span className="text-[6.5px] bg-gray-200 text-gray-500 px-1 rounded">TOMORROW</span>
                          </div>
                          <p className="font-semibold text-gray-700 text-[8.5px]">Dortmund → Cologne</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[7.5px] text-gray-400 font-medium">
                      <span>Status: On Duty</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="w-10 h-0.5 bg-gray-700 rounded-full mx-auto mt-1 shrink-0" />
                </div>

                {/* SCREEN 2: Live Navigation Map (Center, Taller & Elevated) */}
                <div className="w-36 sm:w-42 md:w-46 bg-gray-900 rounded-[28px] p-1.5 sm:p-2 shadow-2xl border-2 border-[#ea580c]/60 shrink-0 h-[315px] sm:h-[345px] flex flex-col justify-between -translate-y-3 z-10">
                  <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-1.5 shrink-0" />
                  <div className="bg-slate-100 rounded-[20px] p-2 sm:p-2.5 text-gray-800 flex flex-col justify-between flex-1 relative overflow-hidden text-[9px] shadow-inner">
                    {/* Top Route Prompt */}
                    <div className="space-y-1">
                      <div className="bg-white/95 backdrop-blur-xs rounded-lg p-1.5 shadow-xs flex items-center justify-between text-[8px] font-bold border border-gray-100">
                        <span className="text-[#ea580c] font-black">CD-1054</span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          In Transit
                        </span>
                      </div>
                      <div className="bg-gray-900 text-white rounded-md px-1.5 py-1 text-[7.5px] flex items-center gap-1 font-semibold">
                        <span className="text-orange-400 font-bold">↗ 1.2 km:</span>
                        <span className="truncate">Exit 24 on A9 Highway</span>
                      </div>
                    </div>

                    {/* Vector Navigation Map Illustration */}
                    <div className="relative my-auto py-1">
                      <svg className="w-full h-28 sm:h-32 overflow-hidden" viewBox="0 0 130 95" fill="none">
                        {/* Background road grid */}
                        <line x1="0" y1="25" x2="130" y2="25" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="65" x2="130" y2="65" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="45" y1="0" x2="45" y2="95" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="95" y1="0" x2="95" y2="95" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Highway route line */}
                        <path
                          d="M 18 80 Q 40 25 75 48 T 115 18"
                          stroke="#1a73e8"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        {/* Completed path pulse */}
                        <path
                          d="M 18 80 Q 40 25 75 48"
                          stroke="#ea580c"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* Origin Marker */}
                        <circle cx="18" cy="80" r="4.5" fill="#ea580c" />

                        {/* Truck GPS Pin */}
                        <circle cx="75" cy="48" r="7" fill="#ea580c" fillOpacity="0.25" />
                        <circle cx="75" cy="48" r="4.5" fill="#0f172a" />
                        <circle cx="75" cy="48" r="2" fill="#38bdf8" />

                        {/* Destination Pin */}
                        <circle cx="115" cy="18" r="4.5" fill="#10b981" />
                        <circle cx="115" cy="18" r="7" stroke="#10b981" strokeOpacity="0.4" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Floating ETA & Speed telemetry */}
                    <div className="bg-gray-900 text-white rounded-lg p-1.5 flex items-center justify-between text-[8px] font-bold shadow-md">
                      <div>
                        <span className="block text-gray-400 text-[6.5px] uppercase">ETA</span>
                        <span className="text-white font-extrabold">38 min</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-gray-400 text-[6.5px] uppercase">Speed</span>
                        <span className="text-orange-400 font-extrabold">82 km/h</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-700 rounded-full mx-auto mt-1 shrink-0" />
                </div>

                {/* SCREEN 3: Upload POD (Taller Smartphone) */}
                <div className="w-32 sm:w-36 md:w-40 bg-gray-900 rounded-[26px] p-1.5 sm:p-2 shadow-xl border border-gray-700 shrink-0 h-[280px] sm:h-[310px] flex flex-col justify-between">
                  <div className="w-8 h-1 bg-gray-700 rounded-full mx-auto mb-1.5 shrink-0" />
                  <div className="bg-white rounded-[18px] p-2 sm:p-2.5 text-gray-800 flex flex-col justify-between flex-1 overflow-hidden text-[9px] shadow-inner space-y-1.5">
                    <div>
                      <div className="font-extrabold text-[10px] text-gray-900 pb-1 border-b border-gray-100 flex items-center justify-between">
                        <span>Upload POD</span>
                        <span className="text-[7.5px] text-gray-400 font-medium">CD-1054</span>
                      </div>

                      <div className="mt-1.5 space-y-1.5">
                        {/* Photo Document Preview */}
                        <div className="w-full h-18 sm:h-20 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-1">
                          <div className="w-6 h-6 rounded bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold text-[8px]">
                            BOL
                          </div>
                          <span className="text-[7.5px] font-bold text-gray-700 mt-1">Signed BOL Document</span>
                          <span className="text-[6.5px] text-gray-400">Captured at 10:24 AM</span>
                        </div>

                        {/* Customer Signature Box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5">
                          <span className="block text-[7px] text-gray-400 font-medium">Customer Signature:</span>
                          <div className="h-6 flex items-center justify-center border-b border-gray-300 pb-1">
                            <span className="italic font-serif text-[10px] text-gray-700">M. Schmidt ✓</span>
                          </div>
                        </div>

                        {/* Delivery Completed confirmation */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1 text-center">
                          <span className="block font-bold text-emerald-700 text-[8px]">Delivery Completed</span>
                          <span className="text-[6.5px] text-emerald-600">POD verified & submitted</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-600 text-white rounded-md py-1 text-center font-bold text-[8px] shadow-xs">
                      Confirmed ✓
                    </div>
                  </div>
                  <div className="w-10 h-0.5 bg-gray-700 rounded-full mx-auto mt-1 shrink-0" />
                </div>

              </div>
            )}
          </div>

          {/* Right Column: 3 Highlights */}
          <div className="lg:col-span-3 space-y-3.5">
            {features.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-md bg-orange-100/70 text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5">
                  {renderIcon(feature.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
