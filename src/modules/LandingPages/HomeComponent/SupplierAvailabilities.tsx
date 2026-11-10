import apiClient from "@/lib/axios";
import {
  ArrowRight,
  Box,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Layers,
  MapPin,
  Snowflake,
  Target,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLandingCMS } from "../components/useLandingCMS";

interface AvailabilityItem {
  id: string | number;
  pickup_region?: string;
  delivery_region?: string;
  country?: string;
  start_date?: string;
  end_date?: string;
  supplier_name?: string;
  supplier_image?: string;
  trailer_type?: string;
  radius_km?: number;
  specs?: string;
  tag?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Today";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

const filterTabs = [
  { id: "all", label: "All", icon: null },
  { id: "curtainsider", label: "Curtainsider", icon: Truck },
  { id: "box", label: "Box Van", icon: Box },
  { id: "refrigerated", label: "Refrigerated", icon: Snowflake },
  { id: "flatbed", label: "Flatbed", icon: Layers },
  { id: "tanker", label: "Tanker", icon: Fuel },
];

export default function SupplierAvailabilities() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cmsSupplier = getSection("supplier_capacity");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [availabilities, setAvailabilities] = useState<AvailabilityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get("/public/supplier-availabilities")
      .then((res: any) => {
        if (!isMounted) return;
        const list = res.data?.data?.availabilities || res.data?.availabilities || [];
        if (Array.isArray(list) && list.length > 0) {
          setAvailabilities(list);
        }
      })
      .catch(() => {
        // Fallback default sample if API fails
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items dynamically based on selected tab
  const filteredList = useMemo(() => {
    if (activeCategory === "all") return availabilities;

    return availabilities.filter((item) => {
      const type = (item.trailer_type || "").toLowerCase();
      if (activeCategory === "curtainsider") return type.includes("curtain") || type.includes("luton");
      if (activeCategory === "box") return type.includes("box") || type.includes("van") || type.includes("courier") || type.includes("sprinter");
      if (activeCategory === "refrigerated") return type.includes("refrig") || type.includes("temp") || type.includes("cold") || type.includes("frozen");
      if (activeCategory === "flatbed") return type.includes("flatbed") || type.includes("machinery") || type.includes("low loader") || type.includes("artic");
      if (activeCategory === "tanker") return type.includes("tank") || type.includes("bulk") || type.includes("adr");
      return true;
    });
  }, [availabilities, activeCategory]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!isSectionEnabled("supplier_capacity")) {
    return null;
  }

  const badge = cmsSupplier?.badge || "REAL-TIME FLEET AVAILABILITY";
  const title = cmsSupplier?.title || "Available Supplier Capacity";
  const subtitle = cmsSupplier?.subtitle || "Book empty runs, return legs, and available truck space directly from verified carriers at discounted backhaul rates.";

  // If no database items loaded yet or empty, provide a clean loading or display state
  const displayItems = filteredList.length > 0 ? filteredList : availabilities;

  return (
    <section id="supplier-capacity" className="w-full bg-transparent pt-8 pb-5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Centered Header Matching Screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#ff4a1f]/10 text-[#ff4a1f] border border-[#ff4a1f]/20 mb-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#ff4a1f]" />
            {badge}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>

          <h2 className="text-[#0f0400] dark:text-slate-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filters and Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 w-full sm:w-auto">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-[#ff4a1f] text-white shadow-xs"
                    : "bg-white dark:bg-[#1e2329] text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:text-[#ff4a1f] hover:border-[#ff4a1f] transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              aria-label="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full bg-[#ff4a1f] hover:bg-[#e63d15] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Next"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Cards Carousel */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 pt-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              // Loading Skeleton Placeholders
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[260px] sm:min-w-[290px] max-w-[320px] bg-white dark:bg-[#1e2329] rounded-[4px] p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 animate-pulse shrink-0 snap-start shadow-2xs"
                >
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-[2px] w-1/3 mb-3" />
                  <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-[4px] w-full mb-2.5" />
                  <div className="h-3.5 bg-gray-200 dark:bg-slate-800 rounded-[2px] w-2/3 mb-3" />
                  <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-[4px] w-full mt-3" />
                </div>
              ))
            ) : displayItems.length === 0 ? (
              <div className="w-full py-8 text-center bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <Truck className="w-7 h-7 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-xs">No live capacity listed in this category right now.</p>
              </div>
            ) : (
              displayItems.map((item, idx) => {
                const originText = item.pickup_region || "Flexible Origin";
                const destText = item.delivery_region || "Any European Route";
                const trailerType = item.trailer_type || "Standard Curtain";
                const dateText = item.start_date ? formatDate(item.start_date) : "Immediate";

                return (
                  <div
                    key={item.id || idx}
                    className="min-w-[260px] sm:min-w-[290px] max-w-[320px] bg-white dark:bg-[#1e2329] rounded-[4px] p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between shrink-0 snap-start shadow-2xs group"
                  >
                    <div>
                      {/* Top Header Row with Route Tag & Date */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-900/40 shadow-2xs">
                          <Truck className="w-3 h-3" />
                          {trailerType}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {dateText}
                        </span>
                      </div>

                      {/* Route Locations */}
                      <div className="space-y-1.5 mb-3 bg-gray-50/70 dark:bg-[#15191f] p-2.5 rounded-[4px] border border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                            {originText}
                          </div>
                        </div>

                        <div className="pl-0.5 text-gray-300 dark:text-slate-600 text-[9px]">
                          ↓
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                          <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                            {destText}
                          </div>
                        </div>
                      </div>

                      {/* Carrier Details Card Snippet */}
                      <div className="flex items-center gap-2.5 mb-3.5 pt-0.5">
                        {item.supplier_image ? (
                          <img
                            src={item.supplier_image}
                            alt={item.supplier_name || "Supplier"}
                            className="w-7 h-7 rounded-[4px] object-cover border border-gray-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-[4px] bg-[#0f0400] text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                            {(item.supplier_name || "C").charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-bold text-xs text-gray-900 dark:text-white">
                            <span className="truncate max-w-[130px]">
                              {item.supplier_name || "Verified Supplier"}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4a1f] fill-[#ff4a1f] text-white shrink-0" />
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-slate-500">
                            Verified Carrier
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Run CTA Button */}
                    <Link to="/web/register/customer" className="w-full">
                      <button className="w-full py-2 px-3 rounded-[4px] bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <span>Book Run</span>
                      </button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
