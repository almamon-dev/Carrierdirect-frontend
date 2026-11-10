import React from "react";
import { Truck, Users, MapPin, Globe } from "lucide-react";
import { useLandingCMS } from "../components/useLandingCMS";

export default function KeyStatsBar() {
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("key_stats");

  if (!isSectionEnabled("key_stats")) {
    return null;
  }

  const defaultStats = [
    {
      value: "10,000+",
      label: "Shipments Managed",
      icon: "Truck",
    },
    {
      value: "500+",
      label: "Verified Carriers",
      icon: "Users",
    },
    {
      value: "1,200+",
      label: "Active Drivers",
      icon: "MapPin",
    },
    {
      value: "20+",
      label: "European Countries",
      icon: "Globe",
    },
  ];

  const stats =
    Array.isArray(cms?.content?.stats) && cms.content.stats.length > 0
      ? cms.content.stats
      : defaultStats;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Truck":
        return <Truck className="w-4 h-4 text-[#ea580c]" />;
      case "Users":
        return <Users className="w-4 h-4 text-[#ea580c]" />;
      case "MapPin":
        return <MapPin className="w-4 h-4 text-[#ea580c]" />;
      case "Globe":
      default:
        return <Globe className="w-4 h-4 text-[#ea580c]" />;
    }
  };

  return (
    <section className="bg-transparent py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs py-3.5 sm:py-4 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-800">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-3 ${
                  idx > 0 ? "pt-3 sm:pt-0 sm:pl-5" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-[4px] bg-orange-50 border border-orange-100/70 flex items-center justify-center shrink-0">
                  {renderIcon(stat.icon)}
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
