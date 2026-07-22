import React from "react";
import useScrollReveal from "@/Hooks/useScrollReveal";
import { Shield, CheckCircle2, Lock, Key } from "lucide-react";

const badges = [
  { icon: <Shield className="w-5 h-5" />, title: "SOC 2\nCompliant" },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Verified\nCarriers" },
  { icon: <Lock className="w-5 h-5" />, title: "Encrypted\nPayments" },
  { icon: <Key className="w-5 h-5" />, title: "Data Privacy\nProtected" },
];

export default function SecurityCompliance() {
  const reveal = useScrollReveal();

  return (
    <section className="w-full bg-transparent py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.isVisible ? "visible" : ""}`}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
            <h3 className="text-[#0f0400] text-xl sm:text-2xl font-bold mb-8">
              Security & Compliance You Can Trust
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-gray-100">
              {badges.map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <span className="text-[#ff4a1f]">{item.icon}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-semibold whitespace-pre-line text-left leading-tight">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
