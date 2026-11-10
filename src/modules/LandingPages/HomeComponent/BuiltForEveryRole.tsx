import React, { useState } from "react";
import { Package, Truck, Navigation, Sliders, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLandingCMS } from "../components/useLandingCMS";

export default function BuiltForEveryRole() {
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("built_for_roles");
  const [activeRoleKey, setActiveRoleKey] = useState<string>("shippers");

  if (!isSectionEnabled("built_for_roles")) {
    return null;
  }

  const title =
    cms?.title || "Built for Every Role in the Logistics Chain";
  const subtitle =
    cms?.subtitle ||
    "A unified platform with dedicated tools for shippers, carriers, and drivers.";
  const btnText = cms?.content?.btn_text || "Explore All Features";
  const btnLink = cms?.content?.btn_link || "/register";

  const defaultRoles = [
    {
      key: "shippers",
      title: "Shippers",
      description: "Create shipments, get quotes, and track deliveries.",
      icon: "Package",
    },
    {
      key: "carriers",
      title: "Carriers",
      description: "Manage fleet, capacity, and assign jobs.",
      icon: "Truck",
    },
    {
      key: "drivers",
      title: "Drivers",
      description: "Receive jobs, navigate, and update delivery.",
      icon: "Navigation",
    },
    {
      key: "platform_owners",
      title: "Platform Owners",
      description: "Operate at scale with multi-tenant and subscription control.",
      icon: "Sliders",
    },
  ];

  const roles =
    Array.isArray(cms?.content?.roles) && cms.content.roles.length > 0
      ? cms.content.roles
      : defaultRoles;

  const renderIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-5 h-5 shrink-0 ${isSelected ? "text-white" : "text-[#ea580c]"}`;
    switch (iconName) {
      case "Package":
        return <Package className={iconClass} />;
      case "Truck":
        return <Truck className={iconClass} />;
      case "Navigation":
        return <Navigation className={iconClass} />;
      case "Sliders":
      default:
        return <Sliders className={iconClass} />;
    }
  };

  return (
    <section className="bg-transparent py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0f172a] rounded-xl p-5 sm:p-6 lg:p-7 shadow-xl border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Column: Heading, Subtitle & Action Button */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                {subtitle}
              </p>
              <div className="pt-1">
                <Link
                  to={btnLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-[#ea580c]/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>{btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Role Cards */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {roles.map((role: any, idx: number) => {
                  const isSelected = activeRoleKey === (role.key || `role_${idx}`);
                  return (
                    <div
                      key={role.key || idx}
                      onClick={() => setActiveRoleKey(role.key || `role_${idx}`)}
                      className={`cursor-pointer rounded-lg p-3 sm:p-3.5 transition-all duration-200 border ${isSelected
                          ? "bg-[#ea580c] border-[#ea580c] shadow-lg shadow-[#ea580c]/20 text-white"
                          : "bg-gray-900/80 hover:bg-gray-800/90 border-gray-800 text-gray-300"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center ${isSelected ? "bg-white/20" : "bg-gray-800 border border-gray-700"
                            }`}
                        >
                          {renderIcon(role.icon, isSelected)}
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm tracking-tight">
                          {role.title}
                        </h3>
                      </div>
                      <p
                        className={`text-[11px] sm:text-xs leading-relaxed ${isSelected ? "text-white/90" : "text-gray-400"
                          }`}
                      >
                        {role.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
