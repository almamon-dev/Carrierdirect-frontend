import React, { useRef } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
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
    name: "Michael R.",
    role: "Supply Chain Manager",
    rating: 5,
    body: "Carrier Direct helped us save 30% on our freight costs. The platform is easy to use and very efficient.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah L.",
    role: "Operations Director",
    rating: 5,
    body: "We found the best carriers within minutes. Real-time tracking and live updates are a complete game changer.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David K.",
    role: "Logistics Coordinator",
    rating: 5,
    body: "This support team is always available and the entire process is seamless from start to finish.",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "Emily T.",
    role: "Warehouse Supervisor",
    rating: 5,
    body: "The API integration was incredibly fast. We automated all our dispatching with zero downtime.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "James W.",
    role: "Fleet Owner",
    rating: 5,
    body: "As a carrier, this is the most transparent platform I've used. Payments are always on time.",
    img: "https://randomuser.me/api/portraits/men/86.jpg",
  },
  {
    name: "Olivia H.",
    role: "E-commerce Founder",
    rating: 5,
    body: "Getting instant quotes has allowed us to accurately price shipping for our customers at checkout.",
    img: "https://randomuser.me/api/portraits/women/24.jpg",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-xs ${i < count ? "text-amber-400" : "text-gray-200"}`}>★</span>
    ))}
  </div>
);

export default function TrustedbyRealShippersCarriers() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("testimonials");

  if (!isSectionEnabled("testimonials")) {
    return null;
  }

  const badge = cms?.badge || "Trusted Feedback";
  const title = cms?.title || "What Our Customers Say";
  const subtitle = cms?.subtitle || "Real stories from shippers and carriers transforming logistics across Europe.";

  const dynamicReviews = cms?.content?.reviews;
  const reviewsList: Review[] = (Array.isArray(dynamicReviews) && dynamicReviews.length > 0)
    ? dynamicReviews.map((r: any, idx: number) => ({
        name: r.name || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.name || "Verified Customer",
        role: r.role || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.role || "Shipper",
        rating: Number(r.rating) || 5,
        body: r.body || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.body || "",
        img: r.img || DEFAULT_REVIEWS[idx % DEFAULT_REVIEWS.length]?.img || "https://randomuser.me/api/portraits/lego/1.jpg",
      }))
    : DEFAULT_REVIEWS;

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
    <section id="supplier" className="w-full bg-transparent pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto relative">

        <div className="text-center mb-6">
          {badge && (
            <span className="text-[#ff4a1f] font-semibold tracking-wider text-xs mb-1.5 block">
              {badge}
            </span>
          )}
          <h2 className="text-[#0f0400] text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex gap-1.5 justify-end mt-4">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ff4a1f] hover:border-[#ff4a1f] transition-all shadow-sm hover:shadow cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#ff4a1f] hover:border-[#ff4a1f] transition-all shadow-sm hover:shadow cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviewsList.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-md p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3 min-w-[260px] max-w-[280px] shrink-0 snap-start"
              >
                <Stars count={review.rating} />

                <div className="relative mb-2">
                  <Quote className="w-4 h-4 text-orange-200 rotate-180 mb-1" />
                  <p className="text-gray-600 text-xs leading-relaxed">
                    "{review.body}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-50"
                  />
                  <div>
                    <p className="text-[#0f0400] text-xs font-semibold">{review.name}</p>
                    <p className="text-gray-400 text-[10px]">{review.role}</p>
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
