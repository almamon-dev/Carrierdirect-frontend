import React from "react";
import { useLandingCMS } from "../components/useLandingCMS";

interface Review {
  name: string;
  role: string;
  rating: number;
  body: string;
  img: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Michael A.",
    role: "Transport Manager",
    rating: 5,
    body: "CarrierDirect has streamlined our entire transport operation. Booking, tracking, and POD are now seamless.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah K.",
    role: "Operations Lead",
    rating: 5,
    body: "The driver app is simple and reliable. Our drivers love the real-time updates and easy POD upload.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David T.",
    role: "Logistics Director",
    rating: 5,
    body: "Great platform for managing multiple carriers and shipments across regions.",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "Emily R.",
    role: "Fleet Manager",
    rating: 5,
    body: "Excellent support and a platform that truly understands the logistics business.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5 text-amber-400 text-xs mb-2">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-amber-400" : "text-gray-200"}>★</span>
    ))}
  </div>
);

export default function TrustedbyRealShippersCarriers() {
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("testimonials");

  if (!isSectionEnabled("testimonials")) {
    return null;
  }

  const badge = cms?.badge || "CUSTOMER STORIES";
  const title = cms?.title || "Trusted by Transport Businesses Across Europe";
  const subtitle =
    cms?.subtitle || "See how CarrierDirect helps businesses move freight smarter and faster.";

  const dynamicReviews = cms?.content?.reviews;
  const reviewsList: Review[] =
    Array.isArray(dynamicReviews) && dynamicReviews.length > 0
      ? dynamicReviews.map((r: any, idx: number) => ({
          name: r.name || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.name || "Customer",
          role: r.role || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.role || "Logistics",
          rating: Number(r.rating) || 5,
          body: r.body || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.body || "",
          img: r.img || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.img || "https://randomuser.me/api/portraits/lego/1.jpg",
        }))
      : DEFAULT_REVIEWS;

  return (
    <section className="bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {badge && (
            <span className="text-[#ea580c] font-bold text-[11px] uppercase tracking-widest mb-1.5 inline-block">
              {badge}
            </span>
          )}
          <h2 className="text-gray-900 dark:text-slate-100 text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 4 Review Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviewsList.map((review, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1e2329] rounded-[4px] p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <Stars count={review.rating} />
                <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed italic mb-4">
                  "{review.body}"
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-slate-800">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">
                    {review.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
