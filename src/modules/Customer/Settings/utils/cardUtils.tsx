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
  if (/^(6011|65|64[4-9])/.test(clean)) return "discover";
  return "unknown";
};

export const formatCardNumber = (val: string, cardBrand: CardBrand): string => {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  if (cardBrand === "amex") {
    return digits.replace(/(\d{4})(\d{6})?(\d{5})?/, (_, p1, p2, p3) =>
      [p1, p2, p3].filter(Boolean).join(" ")
    );
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

export const formatExpiry = (val: string, prevVal: string = ""): string => {
  const isDeleting = val.length < prevVal.length;
  const digits = val.replace(/\D/g, "");

  if (isDeleting) {
    if (digits.length === 2 && prevVal.endsWith("/")) {
      return digits.slice(0, 1);
    }
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  }

  if (!digits) return "";

  if (digits.length === 1) {
    const first = parseInt(digits, 10);
    if (first >= 2) {
      return `0${first}/`;
    }
    return digits;
  }

  let monthStr = digits.slice(0, 2);
  const firstDigit = parseInt(digits[0], 10);
  const secondDigit = parseInt(digits[1], 10);

  if (firstDigit === 0 && secondDigit === 0) {
    monthStr = "01";
  } else if (firstDigit === 1 && secondDigit > 2) {
    monthStr = "12";
  } else if (firstDigit > 1) {
    monthStr = `0${firstDigit}`;
  }

  const yearStr = digits.slice(2, 4);
  if (digits.length >= 2) {
    return `${monthStr}/${yearStr}`;
  }
  return monthStr;
};

export const renderCardBrandBadge = (cardBrand: CardBrand) => {
  switch (cardBrand) {
    case "visa":
      return (
        <span className="bg-[#1a1f71] text-white font-black text-[9.5px] px-1.5 py-0.5 rounded-[3px] tracking-wider shadow-2xs select-none">
          VISA
        </span>
      );
    case "mastercard":
      return (
        <span className="bg-[#eb001b] text-white font-black text-[9.5px] px-1.5 py-0.5 rounded-[3px] tracking-wider shadow-2xs select-none">
          MC
        </span>
      );
    case "amex":
      return (
        <span className="bg-[#007bc1] text-white font-black text-[9.5px] px-1.5 py-0.5 rounded-[3px] tracking-wider shadow-2xs select-none">
          AMEX
        </span>
      );
    case "discover":
      return (
        <span className="bg-[#ff6000] text-white font-black text-[9.5px] px-1.5 py-0.5 rounded-[3px] tracking-wider shadow-2xs select-none">
          DISC
        </span>
      );
    default:
      return <CreditCard size={16} className="text-slate-400" />;
  }
};
