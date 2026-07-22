import React, { useState } from "react";
import { Plus } from "lucide-react";
import useScrollReveal from "@/Hooks/useScrollReveal";

const items = [
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
    content: "Register, upload compliance documents (insurance, FMCSA), and await admin approval (usually 24h).",
  },
];

const halfLeft = items.slice(0, 3);
const halfRight = items.slice(3);

export default function HomeFAQAccordion() {
  const reveal = useScrollReveal();
  const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null);
  const [openIndexRight, setOpenIndexRight] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-transparent pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[#0f0400] text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm">
            Quick answers to common questions about our platform.
          </p>
        </div>

        <div 
          ref={reveal.ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-2 items-start reveal ${reveal.isVisible ? "visible" : ""}`}
        >
          {/* Left Column */}
          <div className="w-full space-y-2">
            {halfLeft.map(({ title, content }, index) => (
              <div key={index} className="border-b border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setOpenIndexLeft(openIndexLeft === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left transition-all cursor-pointer gap-4 outline-none group"
                >
                  <h3 className="text-[#0f0400] font-semibold text-sm group-hover:text-[#ff4a1f] transition-colors">
                    {title}
                  </h3>
                  <Plus className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${openIndexLeft === index ? 'rotate-45 text-[#ff4a1f]' : ''}`} />
                </button>
                {openIndexLeft === index && (
                  <div className="pb-4 text-gray-500 text-xs leading-relaxed pr-6 animate-fade-in">
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full space-y-2">
            {halfRight.map(({ title, content }, index) => (
              <div key={index} className="border-b border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setOpenIndexRight(openIndexRight === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left transition-all cursor-pointer gap-4 outline-none group"
                >
                  <h3 className="text-[#0f0400] font-semibold text-sm group-hover:text-[#ff4a1f] transition-colors">
                    {title}
                  </h3>
                  <Plus className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${openIndexRight === index ? 'rotate-45 text-[#ff4a1f]' : ''}`} />
                </button>
                {openIndexRight === index && (
                  <div className="pb-4 text-gray-500 text-xs leading-relaxed pr-6 animate-fade-in">
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
