import React, { useState, useEffect } from "react";
import {
  Pin,
  Sparkles,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  Truck,
  HeartPulse,
  Navigation,
  Gauge,
  CreditCard,
  List,
} from "lucide-react";
import { useLandingCMS } from "../components/useLandingCMS";
import {
  featureReleaseService,
  FeatureAnnouncement,
  CURRENT_RELEASE_VERSION,
} from "@/services/featureReleaseService";
import { WhatsNewModal } from "@/components/shared/WhatsNewModal";

export default function LatestFeatureReleases() {
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("latest_features");

  const [announcements, setAnnouncements] = useState<FeatureAnnouncement[]>([]);
  const [releaseVersion, setReleaseVersion] = useState(CURRENT_RELEASE_VERSION);
  const [activeFilter, setActiveFilter] = useState<"updates" | "features">("updates");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    featureReleaseService.getActiveAnnouncements().then((res) => {
      if (isMounted) {
        setAnnouncements(res?.all || []);
        if (res?.version) setReleaseVersion(res.version);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isSectionEnabled("latest_features")) {
    return null;
  }

  const badge = cms?.badge || "SYSTEM NOTICEBOARD";
  const title = cms?.title || "Platform Releases & Feature Notices";
  const subtitle =
    cms?.subtitle ||
    "Stay up to date with the latest updates and new features on CarrierDirect.";

  // Group announcements into Updates and New Features
  const updatesList = announcements.filter(
    (item) =>
      item.badge?.toLowerCase().includes("update") ||
      item.category === "telematics" ||
      item.category === "billing" ||
      item.status === "coming_soon"
  );

  const newFeaturesList = announcements.filter(
    (item) =>
      item.badge?.toLowerCase().includes("new") ||
      item.category === "dispatch" ||
      item.category === "safety" ||
      item.status === "live"
  );

  const displayedList = activeFilter === "updates" ? updatesList : newFeaturesList;

  const getNoticeIcon = (category?: string, key?: string) => {
    const c = (category || "").toLowerCase();
    const k = (key || "").toLowerCase();
    if (k.includes("relay") || k.includes("reassign") || c === "dispatch")
      return <Truck size={18} />;
    if (k.includes("sick") || k.includes("emergency") || c === "safety")
      return <HeartPulse size={18} />;
    if (k.includes("delay") || k.includes("date") || k.includes("calendar"))
      return <Calendar size={18} />;
    if (k.includes("gps") || k.includes("nav"))
      return <Navigation size={18} />;
    if (k.includes("telematics") || k.includes("fuel"))
      return <Gauge size={18} />;
    if (k.includes("escrow") || k.includes("billing"))
      return <CreditCard size={18} />;
    return <Sparkles size={18} />;
  };

  return (
    <section id="whats-new" className="py-5 sm:py-7 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {subtitle}
        </p>

        {/* Controls Row: Category Pills (Left) & View All Button (Right) */}
        <div className="mt-3.5 mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left filter pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("updates")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "updates"
                  ? "bg-[#FF4A1F] text-white shadow-2xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <RotateCcw size={12} />
              <span>Updates</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === "updates" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {updatesList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("features")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "features"
                  ? "bg-[#FF4A1F] text-white shadow-2xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Sparkles size={12} />
              <span>New Features</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === "features" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {newFeaturesList.length}
              </span>
            </button>
          </div>

          {/* Right action button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-orange-200/90 bg-white hover:bg-orange-50/50 text-[#FF4A1F] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <List size={12} />
            <span>View All Updates</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Minimal Cards List */}
        <div className="space-y-2.5">
          {displayedList.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-white rounded-[4px] border border-dashed border-slate-200">
              No releases found in this category.
            </div>
          ) : (
            displayedList.map((item) => {
              const isLive = item.status === "live";
              const isUpcoming = item.status === "coming_soon" || !isLive;

              return (
                <div
                  key={item.id}
                  onClick={() => setIsModalOpen(true)}
                  className={`rounded-[4px] border transition-all p-3 sm:p-3.5 shadow-2xs cursor-pointer flex flex-col justify-between ${
                    isLive
                      ? "border-orange-200 bg-[#fffcf9] hover:bg-[#fff9f5]"
                      : "border-purple-200 bg-[#faf8ff] hover:bg-[#f6f2ff]"
                  }`}
                >
                  {/* Top content row */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                      {/* Icon Container */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[4px] flex items-center justify-center shrink-0 shadow-2xs ${
                          isLive
                            ? "bg-orange-100/80 text-[#FF4A1F]"
                            : "bg-purple-100/80 text-purple-600"
                        }`}
                      >
                        {getNoticeIcon(item.category, item.feature_key)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        {/* Tag Pill */}
                        <div className="mb-0.5">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                              <Sparkles size={10} className="text-purple-600" />
                              <span>{item.badge || "New Feature"}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                              <RotateCcw size={10} className="text-purple-600" />
                              <span>{item.badge || "Upcoming Feature"}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge (Top Right) */}
                    <div className="shrink-0">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                          <Clock size={11} className="text-purple-600" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer of card */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Calendar size={12} className="text-slate-400" />
                      <span>
                        {isUpcoming && !item.release_date?.startsWith("ETA")
                          ? `ETA: ${item.release_date || "30 Nov 2026"}`
                          : item.release_date || "16 Nov 2026"}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4A1F] hover:underline">
                      <span>Details</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Notice Board Modal */}
      <WhatsNewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role="all"
      />
    </section>
  );
}
