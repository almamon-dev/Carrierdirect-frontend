import React from "react";
import { Truck, Users, MapPin, Globe } from "lucide-react";
import { useLandingCMS } from "../components/useLandingCMS";

interface KeyStatsBarProps {
  inBanner?: boolean;
}

export default function KeyStatsBar({ inBanner = false }: KeyStatsBarProps) {
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
    const iconClass = inBanner ? "w-3.5 h-3.5 text-[#ff4a1f]" : "w-3.5 h-3.5 text-[#ea580c]";
    switch (iconName) {
      case "Truck":
        return <Truck className={iconClass} />;
      case "Users":
        return <Users className={iconClass} />;
      case "MapPin":
        return <MapPin className={iconClass} />;
      case "Globe":
      default:
        return <Globe className={iconClass} />;
    }
  };

  if (inBanner) {
    return (
      <div className="w-full">
        <div className="bg-black/60 sm:bg-[#0b0300]/75 backdrop-blur-md rounded-[4px] border border-white/15 shadow-xl py-2.5 sm:py-3 px-3.5 sm:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 ${
                  idx > 0 ? "pt-2 sm:pt-0 sm:pl-4" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-[4px] bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                  {renderIcon(stat.icon)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-white/70 truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs py-2 sm:py-2.5 px-4 sm:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-800">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 ${
                  idx > 0 ? "pt-2 sm:pt-0 sm:pl-4" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-[4px] bg-orange-50 border border-orange-100/70 flex items-center justify-center shrink-0">
                  {renderIcon(stat.icon)}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 tracking-tight leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-slate-400">
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
