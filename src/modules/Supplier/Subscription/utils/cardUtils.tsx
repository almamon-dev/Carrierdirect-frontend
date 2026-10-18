import React from "react";
import { CreditCard } from "lucide-react";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export const validateLuhn = (numStr: string): boolean => {
  let sum = 0;
  let isEven = false;
  for (let i = numStr.length - 1; i >= 0; i--) {
    let digit = parseInt(numStr.charAt(i), 10);
    if (isNaN(digit)) return false;
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

export const detectCardBrand = (num: string): CardBrand => {
  const clean = num.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return "discover";
  return "unknown";
};

export const renderCardLogo = (brand?: string) => {
  const b = (brand || "").toLowerCase();
  if (b.includes("visa")) {
    return (
      <div className="w-9 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[3px] flex items-center justify-center text-[#1a1f71] dark:text-blue-400 font-black italic text-[10px] tracking-tight shrink-0 shadow-2xs">
        VISA
      </div>
    );
  }
  if (b.includes("master") || b.includes("mc")) {
    return (
      <div className="w-9 h-6 bg-gradient-to-r from-[#eb001b] via-[#e63946] to-[#f79e1b] rounded-[3px] flex items-center justify-center text-white font-black text-[9px] tracking-tight shrink-0 shadow-2xs">
        MC
      </div>
    );
  }
  if (b.includes("amex") || b.includes("american")) {
    return (
      <div className="w-9 h-6 bg-[#007bc1] rounded-[3px] flex items-center justify-center text-white font-bold text-[8px] tracking-tight shrink-0 shadow-2xs">
        AMEX
      </div>
    );
  }
  if (b.includes("discover") || b.includes("disc")) {
    return (
      <div className="w-9 h-6 bg-gradient-to-r from-[#ff6000] to-[#f79e1b] rounded-[3px] flex items-center justify-center text-white font-black text-[7.5px] tracking-tight shrink-0 shadow-2xs">
        DISC
      </div>
    );
  }
  return (
    <div className="text-slate-400 dark:text-slate-500 shrink-0 flex items-center justify-center">
      <CreditCard size={17} />
    </div>
  );
};
