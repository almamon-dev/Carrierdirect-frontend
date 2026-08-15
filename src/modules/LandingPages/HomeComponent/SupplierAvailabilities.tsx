import React, { useRef } from "react";
import { MapPin, Calendar, Truck, ChevronLeft, ChevronRight } from "lucide-react";

interface AvailabilityItem {
  id: string | number;
  pickup_region?: string;
  delivery_region?: string;
  start_date?: string;
  end_date?: string;
  supplier_name?: string;
  supplier_image?: string;
  trailer_type?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Flexible";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

const mockAvailabilities: AvailabilityItem[] = [
  {
    id: 1,
    pickup_region: "London",
    delivery_region: "Manchester",
    start_date: "2026-07-25",
    end_date: "2026-07-26",
    supplier_name: "Swift Transport UK",
    trailer_type: "Luton Van",
  },
  {
    id: 2,
    pickup_region: "Birmingham",
    delivery_region: "Glasgow",
    start_date: "2026-07-26",
    end_date: "2026-07-27",
    supplier_name: "Apex Logistics Fleet",
    trailer_type: "HGV Flatbed",
  },
  {
    id: 3,
    pickup_region: "Leeds",
    delivery_region: "Bristol",
    start_date: "2026-07-28",
    end_date: "2026-07-29",
    supplier_name: "Direct Haulage Co.",
    trailer_type: "Sprinter Van",
  },
];

export default function SupplierAvailabilities() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-transparent pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative">
          <div className="hidden sm:block w-24"></div>

          <div className="text-center w-full sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center mt-2 sm:mt-0">
            <h2 className="text-[#0f0400] text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Available Supplier Capacity
            </h2>
            <p className="text-sm text-gray-500 max-w-sm sm:max-w-md">
              Book empty runs and available capacity directly from our verified suppliers at competitive rates.
            </p>
          </div>

          <div className="flex gap-1.5 mt-4 sm:mt-0 z-10 ml-auto items-start">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ff4a1f] hover:border-[#ff4a1f] transition-all shadow-sm hover:shadow cursor-pointer"
              aria-label="Previous capacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ff4a1f] hover:border-[#ff4a1f] transition-all shadow-sm hover:shadow cursor-pointer"
              aria-label="Next capacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mockAvailabilities.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3 min-w-[260px] max-w-[280px] shrink-0 snap-start"
              >
                <div className="flex items-center mb-1">
                  <Truck className="w-4 h-4 text-orange-400" />
                </div>

                <div className="relative mb-2 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-gray-700">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
                    <div>
                      <span className="font-semibold">{item.pickup_region}</span>
                      <span className="text-gray-400 mx-1">to</span>
                      <span className="font-semibold">{item.delivery_region}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {formatDate(item.start_date)}
                      {item.end_date && ` - ${formatDate(item.end_date)}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold ring-2 ring-orange-50 text-xs">
                      {item.supplier_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#0f0400] text-xs font-semibold truncate max-w-[100px]">
                        {item.supplier_name}
                      </p>
                      <p className="text-gray-400 text-[10px] capitalize">
                        {item.trailer_type || "Standard"}
                      </p>
                    </div>
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
