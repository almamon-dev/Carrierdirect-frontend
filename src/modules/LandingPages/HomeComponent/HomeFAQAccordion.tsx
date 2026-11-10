import React, { useState } from "react";
import { Plus } from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { useLandingCMS } from "../components/useLandingCMS";

const DEFAULT_ITEMS = [
  {
    title: "When do suppliers get paid?",
    content: "Funds are released from escrow within 24-48 hours of job completion and delivery confirmation.",
  },
  {
    title: "Is my payment safe?",
    content: "Yes. All payments are held in a secure escrow account and only released when delivery conditions are met.",
  },
  {
    title: "Can I cancel a shipment?",
    content: "You can cancel before a carrier accepts. Once confirmed, changes require carrier agreement.",
  },
  {
    title: "Can I negotiate quotes?",
    content: "Yes. Clients and suppliers can negotiate directly via our platform messaging thread.",
  },
  {
    title: "What happens in a dispute?",
    content: "Our admin team reviews all evidence and manages the escrow funds for a fair resolution.",
  },
  {
    title: "How do I become a carrier?",
    content: "Register, upload compliance documents (insurance, EU Community licence), and await admin approval (usually 24h).",
  },
];

export default function HomeFAQAccordion() {
  const reveal = useScrollReveal();
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cms = getSection("faq");

  const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null);
  const [openIndexRight, setOpenIndexRight] = useState<number | null>(null);

  if (!isSectionEnabled("faq")) {
    return null;
  }

  const badge = cms?.badge || "FREQUENTLY ASKED QUESTIONS";
  const title = cms?.title || "Have Questions? We've Got Answers.";
  const viewAllLink = cms?.content?.view_all_link || "/faq";

  const dynamicFaqs = cms?.content?.faqs;
  const items = (Array.isArray(dynamicFaqs) && dynamicFaqs.length > 0)
    ? dynamicFaqs.map((f: any, idx: number) => ({
        title: f.question || DEFAULT_ITEMS[idx % DEFAULT_ITEMS.length]?.title || "FAQ Question",
        content: f.answer || DEFAULT_ITEMS[idx % DEFAULT_ITEMS.length]?.content || "",
      }))
    : DEFAULT_ITEMS;

  const midPoint = Math.ceil(items.length / 2);
  const halfLeft = items.slice(0, midPoint);
  const halfRight = items.slice(midPoint);

  return (
    <section id="faq" className="w-full bg-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title on Left and View All on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-gray-100">
          <div>
            {badge && (
              <span className="text-[#ea580c] font-bold tracking-widest text-[11px] uppercase mb-1 block">
                {badge}
              </span>
            )}
            <h2 className="text-gray-900 text-xl sm:text-2xl font-extrabold tracking-tight">
              {title}
            </h2>
          </div>
          <div>
            <a
              href={viewAllLink}
              className="inline-flex items-center text-xs font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline"
            >
              View All FAQs →
            </a>
          </div>
        </div>

        <div 
          ref={reveal.ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-1 items-start reveal ${reveal.isVisible ? "visible" : ""}`}
        >
          {/* Left Column */}
          <div className="w-full space-y-1">
            {halfLeft.map(({ title, content }, index) => (
              <div key={index} className="border-b border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setOpenIndexLeft(openIndexLeft === index ? null : index)}
                  className="flex w-full items-center justify-between py-2.5 sm:py-3 text-left transition-all cursor-pointer gap-3 outline-none group"
                >
                  <h3 className="text-[#0f0400] font-semibold text-xs sm:text-sm group-hover:text-[#ff4a1f] transition-colors">
                    {title}
                  </h3>
                  <Plus className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${openIndexLeft === index ? 'rotate-45 text-[#ff4a1f]' : ''}`} />
                </button>
                {openIndexLeft === index && (
                  <div className="pb-3 text-gray-500 text-xs leading-relaxed pr-6 animate-fade-in">
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full space-y-1">
            {halfRight.map(({ title, content }, index) => (
              <div key={index} className="border-b border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setOpenIndexRight(openIndexRight === index ? null : index)}
                  className="flex w-full items-center justify-between py-2.5 sm:py-3 text-left transition-all cursor-pointer gap-3 outline-none group"
                >
                  <h3 className="text-[#0f0400] font-semibold text-xs sm:text-sm group-hover:text-[#ff4a1f] transition-colors">
                    {title}
                  </h3>
                  <Plus className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${openIndexRight === index ? 'rotate-45 text-[#ff4a1f]' : ''}`} />
                </button>
                {openIndexRight === index && (
                  <div className="pb-3 text-gray-500 text-xs leading-relaxed pr-6 animate-fade-in">
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
