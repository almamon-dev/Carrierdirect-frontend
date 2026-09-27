import React, { useState, useMemo } from "react";
import { CreditCard, ShieldCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";
import Drawer from "@/components/modals/drawer";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess?: (newCard: any) => void;
  endpoint?: string;
}

type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

const validateLuhn = (numStr: string): boolean => {
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

const detectCardBrand = (num: string): CardBrand => {
  const clean = num.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  if (/^(6011|65|64[4-9])/.test(clean)) return "discover";
  return "unknown";
};

export const AddPaymentMethodModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddSuccess, endpoint = "/subscription/payment-methods" }) => {
  const showToast = useToastStore((state) => state.showToast);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track touched/blurred fields for live validation feedback
  const [touched, setTouched] = useState<{
    cardName?: boolean;
    cardNumber?: boolean;
    expiry?: boolean;
    cvc?: boolean;
  }>({});

  const markTouched = (field: "cardName" | "cardNumber" | "expiry" | "cvc") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const cleanNumber = cardNumber.replace(/\D/g, "");
  const cardBrand = detectCardBrand(cleanNumber);
  const expectedCvcLength = cardBrand === "amex" ? 4 : 3;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    if (cardBrand === "amex") {
      // 4-6-5 format for Amex
      return digits.replace(/(\d{4})(\d{6})?(\d{5})?/, (_, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join(" ")
      );
    }
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  // Smart Expiry input formatting (restricts month strictly to 01-12)
  const formatExpiry = (val: string, prevVal: string = ""): string => {
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

    // If user types first digit 2-9, auto prefix with 0 and add slash (e.g. 4 -> 04/)
    if (digits.length === 1) {
      const first = parseInt(digits, 10);
      if (first >= 2) {
        return `0${first}/`;
      }
      return digits;
    }

    // 2 or more digits entered
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

  // Live Field Validations
  const nameError = useMemo(() => {
    if (!touched.cardName && !cardName) return null;
    const trimmed = cardName.trim();
    if (!trimmed) return "Cardholder name is required.";
    if (trimmed.length < 3) return "Name must be at least 3 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name should contain valid letters only.";
    return null;
  }, [cardName, touched.cardName]);

  const cardNumberError = useMemo(() => {
    if (!touched.cardNumber && !cleanNumber) return null;
    if (!cleanNumber) return "Card number is required.";
    const minLength = cardBrand === "amex" ? 15 : 13;
    if (cleanNumber.length < minLength) return `Please enter a complete ${cardBrand === "amex" ? "15" : "16"}-digit card number.`;
    if (!validateLuhn(cleanNumber)) return "Invalid card number checksum (Luhn check failed).";
    return null;
  }, [cleanNumber, cardBrand, touched.cardNumber]);

  const expiryError = useMemo(() => {
    if (!touched.expiry && !expiry) return null;
    const cleanExp = expiry.replace(/\D/g, "");
    if (!cleanExp) return "Expiration date is required (MM/YY).";
    if (cleanExp.length < 2) return "Enter expiration date (MM/YY).";

    const month = parseInt(cleanExp.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      return "Invalid month. Month must be between 01 and 12.";
    }

    if (cleanExp.length < 4) {
      return "Enter 2-digit expiration year (MM/YY).";
    }

    const year = parseInt(cleanExp.slice(2, 4), 10);
    const now = new Date();
    const curYear = now.getFullYear() % 100;
    const curMonth = now.getMonth() + 1;

    if (year < curYear || (year === curYear && month < curMonth)) {
      return `Card has expired (${month < 10 ? '0' + month : month}/${year} is in the past).`;
    }

    if (year > curYear + 25) {
      return "Expiration year is unrealistically far in the future.";
    }

    return null;
  }, [expiry, touched.expiry]);

  const cvcError = useMemo(() => {
    if (!touched.cvc && !cvc) return null;
    const cleanCvc = cvc.replace(/\D/g, "");
    if (!cleanCvc) return "Security code (CVC) is required.";
    if (cleanCvc.length < expectedCvcLength) {
      return `${expectedCvcLength}-digit security code required for ${cardBrand === "amex" ? "AMEX" : "cards"}.`;
    }
    return null;
  }, [cvc, expectedCvcLength, cardBrand, touched.cvc]);

  const isFormValid =
    cardName.trim().length >= 3 &&
    !nameError &&
    cleanNumber.length >= (cardBrand === "amex" ? 15 : 13) &&
    !cardNumberError &&
    !expiryError &&
    expiry.replace(/\D/g, "").length === 4 &&
    cvc.replace(/\D/g, "").length === expectedCvcLength &&
    !cvcError;

  const renderCardBrandBadge = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      cardName: true,
      cardNumber: true,
      expiry: true,
      cvc: true,
    });

    if (!isFormValid) {
      if (expiryError) {
        showToast(expiryError, "error");
      } else if (cardNumberError) {
        showToast(cardNumberError, "error");
      } else if (nameError) {
        showToast(nameError, "error");
      } else if (cvcError) {
        showToast(cvcError, "error");
      } else {
        showToast("Please correct the highlighted card errors before saving.", "error");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.post(endpoint, {
        card_name: cardName.trim(),
        card_number: cleanNumber,
        expiry: expiry,
        cvc: cvc.trim(),
        is_primary: isPrimary,
      });

      const newCard = res.data?.data?.new_card || res.data?.new_card || res.data || res;
      showToast(res.data?.message || res.message || "Payment method added successfully!", "success");

      if (onAddSuccess) {
        onAddSuccess(newCard);
      }

      // Reset form
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setIsPrimary(true);
      setTouched({});
      onClose();
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to add payment method.";
      showToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-[3px] bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center shrink-0">
        <CreditCard size={18} />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 leading-tight">Add Payment Method</h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Add a new credit or debit card for instant bookings.</p>
      </div>
    </div>
  );

  const drawerFooter = (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
        <ShieldCheck size={15} className="text-emerald-600" />
        <span>256-bit Encrypted</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 px-3 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSubmitting ? "Saving Card..." : "Save Card"}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={drawerTitle}
      footer={drawerFooter}
      position="right"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans" noValidate>
        {/* Guidelines */}
        <div className="border-b border-slate-100 pb-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
            <ShieldCheck size={16} className="text-[#ff4a1f]" />
            <span>Payment Terms & Guidelines</span>
          </div>
          <ul className="text-slate-600 font-medium space-y-2 text-xs leading-normal">
            <li className="flex items-start gap-2">
              <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
              <span><strong>No Upfront Fees:</strong> Posting quote requests is 100% free. Your card will only be charged when you accept a carrier quote.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
              <span><strong>Escrow Protection:</strong> Payments are securely held in escrow and released to the carrier only after Proof of Delivery (POD) is uploaded.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
              <span><strong>Supported Cards:</strong> We accept Visa, Mastercard, and American Express with 3D Secure 2.0 verification.</span>
            </li>
          </ul>
        </div>

        <div>
          <Input
            label="Cardholder Name *"
            placeholder="e.g. John Doe"
            value={cardName}
            onChange={(e) => {
              setCardName(e.target.value);
              if (!touched.cardName) markTouched("cardName");
            }}
            onBlur={() => markTouched("cardName")}
            error={nameError || undefined}
            rightIcon={
              touched.cardName && !nameError && cardName.trim().length >= 3 ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : undefined
            }
            required
          />
        </div>

        <div>
          <Input
            label="Card Number *"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              if (!touched.cardNumber) markTouched("cardNumber");
            }}
            onBlur={() => markTouched("cardNumber")}
            maxLength={19}
            className="pl-14"
            icon={renderCardBrandBadge()}
            error={cardNumberError || undefined}
            rightIcon={
              touched.cardNumber && !cardNumberError && cleanNumber.length >= (cardBrand === "amex" ? 15 : 13) ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : undefined
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              label="Expires (MM/YY) *"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                setExpiry((prev) => formatExpiry(e.target.value, prev));
                if (!touched.expiry) markTouched("expiry");
              }}
              onBlur={() => markTouched("expiry")}
              maxLength={5}
              error={expiryError || undefined}
              rightIcon={
                touched.expiry && !expiryError && expiry.replace(/\D/g, "").length === 4 ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : undefined
              }
              required
            />
          </div>

          <div>
            <Input
              label="Security Code (CVC) *"
              placeholder={cardBrand === "amex" ? "1234" : "123"}
              type="password"
              value={cvc}
              onChange={(e) => {
                setCvc(e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength));
                if (!touched.cvc) markTouched("cvc");
              }}
              onBlur={() => markTouched("cvc")}
              maxLength={expectedCvcLength}
              icon={<Lock size={14} />}
              error={cvcError || undefined}
              rightIcon={
                touched.cvc && !cvcError && cvc.replace(/\D/g, "").length === expectedCvcLength ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : undefined
              }
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
          <Checkbox
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
          />
          <span className="text-[13px] font-semibold text-slate-700">Set as primary payment method</span>
        </label>

        <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <Lock size={15} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-normal font-medium">
            Your payment details are protected with <strong>256-bit SSL encryption</strong> and are <strong>PCI-DSS Level 1 compliant</strong>.
          </p>
        </div>
      </form>
    </Drawer>
  );
};
