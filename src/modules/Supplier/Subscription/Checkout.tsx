import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Info,
  Rocket,
  CreditCard,
  MoreVertical,
  Check,
  Download,
  ArrowRight,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import PageHeader from "@/components/common/page-header";
import FormLabel from "@/components/ui/label";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import { decryptId } from "@/lib/encryption";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import SubscriptionCheckoutSkeleton from "@/components/common/SubscriptionCheckoutSkeleton";

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
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return "discover";
  return "unknown";
};

// Crisp SVG Card Logos matching reference mockup
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

export default function SupplierSubscriptionCheckout() {
    const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);

  const { planId } = useParams<{ planId?: string }>();
  const cleanPlanId = planId ? decryptId(planId) : null;
  const planFromState = location.state?.plan;

  const queryPlanId = searchParams.get("plan") || searchParams.get("plan_id") || cleanPlanId;
  const queryCycle = (searchParams.get("cycle") || searchParams.get("billing_cycle") || location.state?.billingCycle || planFromState?.cycle || "").toLowerCase();
  const initialCycle: "monthly" | "yearly" = queryCycle === "yearly" || queryCycle === "annual" ? "yearly" : "monthly";

  // Selected Plan state
  const [selectedPlan, setSelectedPlan] = useState<any>(
    planFromState && !planFromState?.isTrial && !String(planFromState?.name || "").toLowerCase().includes("trial") ? {
      ...planFromState,
      cycle: initialCycle,
    } : {
      id: queryPlanId && String(queryPlanId) !== "1" ? (isNaN(Number(queryPlanId)) ? queryPlanId : Number(queryPlanId)) : 2,
      name: "Professional Carrier",
      priceMonthly: 49,
      priceYearly: 490,
      cycle: initialCycle,
      features: [
        "Includes all Trial features",
        "Unlimited Quote Submissions & Active Bidding",
        "Priority Real-time Lead Alerts & High-Value RFQs",
        "Team Management — Up to 5 Staff Accounts",
        "Fleet Management — Up to 10 Vehicles & Capacity Specs",
        "Verified Carrier & CMR Insurance Trust Badge",
        "Reduced Platform Commission Fee (5% Booking Fee)",
        "Automated Stripe Connect Payouts (2 Business Days)",
        "Bid Performance & Win-Rate Analytics",
        "Priority Fleet Support",
      ],
    }
  );

  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);

  const [paymentTab, setPaymentTab] = useState<"saved_card" | "new_card">("saved_card");
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  // New Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  // Touched state for live inline validation
  const [touched, setTouched] = useState<{
    cardName?: boolean;
    cardNumber?: boolean;
    cardExpiry?: boolean;
    cardCvc?: boolean;
  }>({});

  const markTouched = (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Input refs for Stripe-like auto-focus
  const cardNameRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCvcRef = useRef<HTMLInputElement>(null);

  // Processing & Modals
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const normalizePlanName = (name: string) =>
    (name || "").toLowerCase().replace(/\s*\((monthly|yearly|annual|trial)\)/gi, "").trim();

  // Load Saved Cards from API
  const loadSavedCards = async () => {
    setIsLoadingCards(true);
    try {
      const res: any = await apiClient.get("/subscription/payment-methods");
      const cards = res?.data?.saved_cards || res?.data?.data?.saved_cards || [];
      setSavedCards(cards);

      if (cards.length > 0) {
        const primary = cards.find((c: any) => c.is_primary) || cards[0];
        setSelectedCardId(String(primary.id));
        setPaymentTab("saved_card");
      } else {
        setPaymentTab("new_card");
      }
    } catch {
      setPaymentTab("new_card");
    } finally {
      setIsLoadingCards(false);
    }
  };

  const fetchPlanDetails = async () => {
    const targetPlanKey = queryPlanId || planFromState?.id;

    try {
      const res: any = await apiClient.get(`/subscription/plans?user_type=supplier`);
      const rawPlans = res?.data?.plans || res?.data?.data?.plans || res?.data?.data || res?.data || [];
      const plansList = Array.isArray(rawPlans) ? rawPlans : (rawPlans?.data || []);

      // Filter out trial plans from checkout (Checkout is only for paid commercial plans)
      const paidPlans = plansList.filter((p: any) =>
        p.billing_period !== "trial" &&
        !(p.name || "").toLowerCase().includes("trial") &&
        Number(p.price) > 0
      );

      const activeList = paidPlans.length > 0 ? paidPlans : plansList;

      if (Array.isArray(activeList) && activeList.length > 0) {
        let matched = targetPlanKey ? activeList.find(
          (p: any) =>
            (String(p.id) === String(targetPlanKey) ||
             String(p.planId) === String(targetPlanKey) ||
             p.name?.toLowerCase().includes(String(targetPlanKey).toLowerCase())) &&
            p.billing_period !== "trial" &&
            !(p.name || "").toLowerCase().includes("trial")
        ) : null;

        if (!matched) {
          matched = activeList.find((p: any) => p.is_popular || p.popular) || activeList[0];
        }

        if (matched) {
          const baseName = (matched.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase();
          const monthlyVariant = activeList.find((p: any) =>
            (p.billing_period === "monthly" || !p.billing_period) &&
            (p.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase() === baseName
          );
          const yearlyVariant = activeList.find((p: any) =>
            (p.billing_period === "annual" || p.billing_period === "yearly") &&
            (p.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim().toLowerCase() === baseName
          );

          const monthlyPrice = Number(monthlyVariant?.price ?? matched.price ?? 49);
          const yearlyPrice = Number(yearlyVariant?.price ?? (monthlyPrice * 10));

          const determinedCycle: "monthly" | "yearly" = (matched.billing_period === "annual" || matched.billing_period === "yearly")
            ? "yearly"
            : (queryCycle === "yearly" || queryCycle === "annual" ? "yearly" : (planFromState?.cycle === "yearly" ? "yearly" : "monthly"));

          const activePlanId = determinedCycle === "yearly" ? (yearlyVariant?.id || matched.id) : (monthlyVariant?.id || matched.id);

          const resolvedPlan = {
            id: activePlanId,
            name: (matched.name || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").trim(),
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            cycle: determinedCycle,
            features: matched.features || planFromState?.features || [
              "Includes all Trial features",
              "Unlimited Quote Submissions & Active Bidding",
              "Priority Real-time Lead Alerts & High-Value RFQs",
              "Team Management — Up to 5 Staff Accounts",
              "Fleet Management — Up to 10 Vehicles & Capacity Specs",
              "Verified Carrier & CMR Insurance Trust Badge",
              "Reduced Platform Commission Fee (5% Booking Fee)",
              "Automated Stripe Connect Payouts (2 Business Days)",
              "Bid Performance & Win-Rate Analytics",
              "Priority Fleet Support",
            ],
          };
          setSelectedPlan(resolvedPlan);
          return resolvedPlan;
        }
      }
    } catch (e) {
      console.log("Plan fetch error:", e);
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;
    const initializeCheckout = async () => {
      setIsInitialLoading(true);
      try {
        const [cardsRes, statusData, planData] = await Promise.all([
          loadSavedCards().catch(() => null),
          apiClient.get("/subscription/status").then(r => r?.data?.data || r?.data || {}).catch(() => null),
          fetchPlanDetails(),
        ]);

        if (statusData && isMounted) {
          setCurrentSub(statusData);

          // If user is already subscribed to this exact active commercial plan, redirect back to overview
          const isPaidActive = Boolean(
            statusData?.has_subscription &&
            statusData?.is_active &&
            !statusData?.is_trial
          );

          if (isPaidActive) {
            const currentName = normalizePlanName(statusData?.plan_name || "");
            const targetName = normalizePlanName(planData?.name || selectedPlan?.name || "");
            const currentId = String(statusData?.plan_id || "");
            const targetId = String(queryPlanId || planFromState?.id || planData?.id || "");

            if ((currentId && targetId && currentId === targetId) || (currentName && targetName && currentName === targetName)) {
              showToast(`You are already actively subscribed to the ${statusData?.plan_name || selectedPlan?.name} plan.`, "info");
              navigate("/supplier/subscription", { replace: true });
              return;
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };
    initializeCheckout();

    return () => {
      isMounted = false;
    };
  }, [queryPlanId, queryCycle]);

    const isAlreadySubscribed = Boolean(
    currentSub?.has_subscription &&
    currentSub?.is_active &&
    !currentSub?.is_trial &&
    selectedPlan?.name &&
    (
      String(currentSub?.plan_id) === String(selectedPlan?.id) ||
      (currentSub?.plan_name && normalizePlanName(currentSub.plan_name) === normalizePlanName(selectedPlan.name))
    )
  );

  const handleCycleChange = (cycle: "monthly" | "yearly") => {
    setSelectedPlan((prev: any) => ({ ...prev, cycle }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("cycle", cycle);
      return next;
    }, { replace: true });
  };

  const planCycle: "monthly" | "yearly" = (selectedPlan?.cycle === "yearly" || queryCycle === "yearly" || queryCycle === "annual") ? "yearly" : "monthly";
  const planPrice = planCycle === "yearly" ? Number(selectedPlan?.priceYearly || 490) : Number(selectedPlan?.priceMonthly || 49);
  const totalAmount = planPrice;

  // Next billing date calculation
  const nextBillingDateText = useMemo(() => {
    const d = new Date();
    if (planCycle === "yearly") {
      d.setFullYear(d.getFullYear() + 1);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [planCycle]);

  // Card validation helpers
  const cleanCardNum = cardNumber.replace(/\D/g, "");
  const cardBrand = detectCardBrand(cleanCardNum);
  const expectedCvcLength = cardBrand === "amex" ? 4 : 3;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    if (cardBrand === "amex") {
      return digits.replace(/(\d{4})(\d{6})?(\d{5})?/, (_, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join(" ")
      );
    }
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  // Smart Expiry Masking (Month 01-12 strictly)
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

    if (digits.length === 1) {
      const first = parseInt(digits, 10);
      if (first >= 2) {
        return `0${first}/`;
      }
      return digits;
    }

    if (digits.length >= 2) {
      let month = parseInt(digits.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      const monthStr = month < 10 ? "0" + month : "" + month;

      if (digits.length >= 3) {
        const year = digits.slice(2, 4);
        return `${monthStr}/${year}`;
      }
      return `${monthStr}/`;
    }

    return digits;
  };

  // Stripe-Grade Real-Time Field Errors
  const fieldErrors = useMemo(() => {
    const errs: {
      cardName?: string;
      cardNumber?: string;
      cardExpiry?: string;
      cardCvc?: string;
    } = {};

    if (paymentTab !== "new_card") return errs;

    const cleanNum = cardNumber.replace(/\D/g, "");
    const brand = detectCardBrand(cleanNum);
    const expectedNumLen = brand === "amex" ? 15 : 16;
    const expectedCvcLen = brand === "amex" ? 4 : 3;
    const cleanExp = cardExpiry.replace(/\D/g, "");
    const cleanCvcVal = cardCvc.replace(/\D/g, "");

    // 1. Cardholder Name
    if (!cardName.trim()) {
      if (touched.cardName || isSubmitted) {
        errs.cardName = "Cardholder name is required.";
      }
    } else if (cardName.trim().length < 2) {
      if (touched.cardName || isSubmitted) {
        errs.cardName = "Cardholder name must be at least 2 characters.";
      }
    }

    // 2. Card Number
    if (!cleanNum) {
      if (touched.cardNumber || isSubmitted) {
        errs.cardNumber = "Card number is required.";
      }
    } else if (cleanNum.length === expectedNumLen) {
      // Immediate real-time checksum check when completed!
      if (!validateLuhn(cleanNum)) {
        errs.cardNumber = "Your card number is invalid.";
      }
    } else if (cleanNum.length < expectedNumLen) {
      if (touched.cardNumber || isSubmitted) {
        errs.cardNumber = `Your card number is incomplete (${cleanNum.length}/${expectedNumLen} digits).`;
      }
    }

    // 3. Expiry Date (MM/YY)
    if (!cleanExp) {
      if (touched.cardExpiry || isSubmitted) {
        errs.cardExpiry = "Expiry date is required.";
      }
    } else if (cleanExp.length >= 2) {
      const m = parseInt(cleanExp.slice(0, 2), 10);
      if (m < 1 || m > 12) {
        errs.cardExpiry = "Your card's expiration month is invalid.";
      } else if (cleanExp.length === 4) {
        const y = parseInt(cleanExp.slice(2, 4), 10);
        const now = new Date();
        const curY = now.getFullYear() % 100;
        const curM = now.getMonth() + 1;
        if (y < curY || (y === curY && m < curM)) {
          errs.cardExpiry = "Your card's expiration year is in the past.";
        } else if (y > curY + 25) {
          errs.cardExpiry = "Your card's expiration year is invalid.";
        }
      } else if (touched.cardExpiry || isSubmitted) {
        errs.cardExpiry = "Your card's expiration date is incomplete.";
      }
    } else if (touched.cardExpiry || isSubmitted) {
      errs.cardExpiry = "Your card's expiration date is incomplete.";
    }

    // 4. CVC
    if (!cleanCvcVal) {
      if (touched.cardCvc || isSubmitted) {
        errs.cardCvc = "CVC is required.";
      }
    } else if (cleanCvcVal.length < expectedCvcLen) {
      if (touched.cardCvc || isSubmitted) {
        errs.cardCvc = `Your card's security code is incomplete (${cleanCvcVal.length}/${expectedCvcLen} digits).`;
      }
    }

    return errs;
  }, [paymentTab, cardName, cardNumber, cardExpiry, cardCvc, touched, isSubmitted]);

  // Form Validation Validator for Submission
  const getFormValidationError = (): { field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc"; message: string } | null => {
    if (paymentTab !== "new_card") return null;

    const cleanNum = cardNumber.replace(/\D/g, "");
    const brand = detectCardBrand(cleanNum);
    const expectedNumLen = brand === "amex" ? 15 : 16;
    const expectedCvcLen = brand === "amex" ? 4 : 3;
    const cleanExp = cardExpiry.replace(/\D/g, "");
    const cleanCvcVal = cardCvc.replace(/\D/g, "");

    if (!cardName.trim()) {
      return { field: "cardName", message: "Cardholder name is required." };
    }
    if (cardName.trim().length < 2) {
      return { field: "cardName", message: "Cardholder name must be at least 2 characters." };
    }
    if (!cleanNum) {
      return { field: "cardNumber", message: "Card number is required." };
    }
    if (cleanNum.length < expectedNumLen) {
      return { field: "cardNumber", message: "Your card number is incomplete." };
    }
    if (!validateLuhn(cleanNum)) {
      return { field: "cardNumber", message: "Your card number is invalid." };
    }
    if (!cleanExp) {
      return { field: "cardExpiry", message: "Expiry date is required." };
    }
    if (cleanExp.length < 4) {
      return { field: "cardExpiry", message: "Your card's expiration date is incomplete." };
    }
    const m = parseInt(cleanExp.slice(0, 2), 10);
    const y = parseInt(cleanExp.slice(2, 4), 10);
    const now = new Date();
    const curY = now.getFullYear() % 100;
    const curM = now.getMonth() + 1;
    if (m < 1 || m > 12) {
      return { field: "cardExpiry", message: "Your card's expiration month is invalid." };
    }
    if (y < curY || (y === curY && m < curM)) {
      return { field: "cardExpiry", message: "Your card's expiration year is in the past." };
    }
    if (y > curY + 25) {
      return { field: "cardExpiry", message: "Your card's expiration year is invalid." };
    }
    if (!cleanCvcVal) {
      return { field: "cardCvc", message: "CVC is required." };
    }
    if (cleanCvcVal.length < expectedCvcLen) {
      return { field: "cardCvc", message: "Your card's security code is incomplete." };
    }
    return null;
  };

  // Real-Time Input Handlers with Stripe-Grade Auto-Advance
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const brand = detectCardBrand(digits);
    const expectedLen = brand === "amex" ? 15 : 16;
    const formatted = formatCardNumber(raw);
    setCardNumber(formatted);

    // Auto-focus next field (Expiry Date) if valid card number completed!
    if (digits.length === expectedLen && validateLuhn(digits)) {
      cardExpiryRef.current?.focus();
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value, cardExpiry);
    setCardExpiry(formatted);

    // Auto-focus CVC if valid MM/YY entered!
    const cleanExp = formatted.replace(/\D/g, "");
    if (cleanExp.length === 4) {
      const m = parseInt(cleanExp.slice(0, 2), 10);
      const y = parseInt(cleanExp.slice(2, 4), 10);
      const now = new Date();
      const curY = now.getFullYear() % 100;
      const curM = now.getMonth() + 1;
      if (m >= 1 && m <= 12 && (y > curY || (y === curY && m >= curM))) {
        cardCvcRef.current?.focus();
      }
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength);
    setCardCvc(digits);
  };

  // Handle Set Default Card
  const handleSetPrimary = async (cardId: string) => {
    setActiveCardMenuId(null);
    try {
      await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
      setSavedCards((prev) =>
        prev.map((c) => ({
          ...c,
          is_primary: String(c.id) === String(cardId),
        }))
      );
      setSelectedCardId(cardId);
      showToast("Default card updated successfully", "success");
    } catch {
      showToast("Failed to update default card", "error");
    }
  };

  // Handle Delete Card
  const handleDeleteCard = async (cardId: string) => {
    setActiveCardMenuId(null);
    try {
      await apiClient.delete(`/subscription/payment-methods/${cardId}`);
      setSavedCards((prev) => {
        const next = prev.filter((c) => String(c.id) !== String(cardId));
        if (selectedCardId === String(cardId)) {
          setSelectedCardId(next.length > 0 ? String(next[0].id) : null);
          if (next.length === 0) setPaymentTab("new_card");
        }
        return next;
      });
      showToast("Card removed", "info");
    } catch {
      showToast("Failed to remove card", "error");
    }
  };

  // Checkout Submission
  const handleCheckoutSubmit = async () => {
    if (isAlreadySubscribed) {
      showToast(`You are already actively subscribed to the ${selectedPlan.name} plan.`, "info");
      return;
    }
    if (paymentTab === "saved_card" && !selectedCardId && savedCards.length > 0) {
      showToast("Please select a payment card to continue.", "error");
      return;
    }

    if (paymentTab === "new_card") {
      setIsSubmitted(true);
      setTouched({ cardName: true, cardNumber: true, cardExpiry: true, cardCvc: true });
      const validationError = getFormValidationError();
      if (validationError) {
        showToast(validationError.message, "error");
        if (validationError.field === "cardName") cardNameRef.current?.focus();
        else if (validationError.field === "cardNumber") cardNumberRef.current?.focus();
        else if (validationError.field === "cardExpiry") cardExpiryRef.current?.focus();
        else if (validationError.field === "cardCvc") cardCvcRef.current?.focus();
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload: any = {
        plan_id: selectedPlan.id || cleanPlanId || 2,
        billing_cycle: planCycle,
        payment_method_type: paymentTab,
      };

      if (paymentTab === "saved_card") {
        payload.saved_card_id = selectedCardId;
      } else {
        payload.card_name = cardName;
        payload.card_number = cleanCardNum;
        payload.expiry = cardExpiry;
        payload.cvc = cardCvc;
        payload.save_card = saveCardForFuture;
      }

      const res: any = await apiClient.post("/subscription/process-payment", payload);
      const resData = res?.data?.data || res?.data || {};

      setSuccessData({
        plan_name: resData?.plan_name || selectedPlan.name,
        invoice_number: resData?.invoice_number || "SUB-2026-9871",
        amount_formatted: resData?.amount_formatted || `€${totalAmount.toFixed(2)}`,
        payment_method: paymentTab === "saved_card" ? "Saved Card" : "New Card",
        expires_at: resData?.expires_at,
        download_url: resData?.download_url,
      });

      window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
      showToast("Subscription activated successfully!", "success");
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error("Subscription payment error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to process payment.";
      showToast(msg, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const planFeatures: string[] = selectedPlan?.features || [
    "Unlimited Single Quote Requests & RFQs",
    "Multi-Carrier Quote Comparison & Price Breakdown",
    "Direct Carrier Live Chat & Real-Time Negotiation",
    "Real-time Order Tracking & Digital POD (Challan)",
    "Automated PDF Invoices & Tax Receipts",
    "Priority Customer Support (24/7 Response)",
    "Corporate Payment Terms & Net 30 Credit Eligibility",
    "AI Document & Bulk Shipment Extraction",
  ];

  const visibleFeatures = isFeaturesExpanded ? planFeatures : planFeatures.slice(0, 4);

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] text-slate-900 dark:text-slate-100 space-y-6">
      {/* Top Page Header Component */}
      <PageHeader
        title="Complete Subscription Checkout"
        badge={
          <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-[3px] border border-blue-200 dark:border-blue-800">
            {selectedPlan?.name || "Selected Plan"}
          </Badge>
        }
        description="Choose your payment method to activate your plan. All transactions are 256-bit encrypted."
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>SSL Secure</span>
          </span>
        </div>
      </PageHeader>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Payment Method Selection & Inputs in a Card */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6 font-sans">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CreditCard size={17} className="text-blue-600 dark:text-blue-400" />
                  <span>Payment Method</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a saved card or enter new credit/debit card details.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-[3px] border border-emerald-200/80 dark:border-emerald-800/60 self-start sm:self-auto">
                <ShieldCheck size={14} />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* 1. Payment Method Segmented Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Payment method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Saved card */}
                <div
                  onClick={() => setPaymentTab("saved_card")}
                  className={`p-3.5 rounded-[3px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentTab === "saved_card"
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentTab === "saved_card"
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {paymentTab === "saved_card" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={15} className={paymentTab === "saved_card" ? "text-blue-600" : "text-slate-500"} />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Saved card</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Use one of your saved cards</p>
                  </div>
                </div>

                {/* Option 2: Add new card */}
                <div
                  onClick={() => setPaymentTab("new_card")}
                  className={`p-3.5 rounded-[3px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentTab === "new_card"
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentTab === "new_card"
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {paymentTab === "new_card" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={15} className={paymentTab === "new_card" ? "text-blue-600" : "text-slate-500"} />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Add new card</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Enter a new card to pay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Your Saved Cards Section (When Saved Card Tab is Active) */}
            {paymentTab === "saved_card" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Your saved cards
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    + Add another card
                  </button>
                </div>

                {isLoadingCards ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span>Loading saved cards...</span>
                  </div>
                ) : savedCards.length === 0 ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-[3px] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                    <p className="text-xs text-slate-500">No saved cards found on your account.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentTab("new_card")}
                      className="text-xs font-semibold rounded-[3px]"
                    >
                      Enter Card Details Below
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedCards.map((card) => {
                      const isSelected = String(card.id) === String(selectedCardId);
                      const isDefault = Boolean(card.is_primary || card.isDefault);
                      const last4 = card.last_four || card.last4 || "4242";
                      const brand = card.brand || card.type || "VISA";
                      const exp = `${String(card.exp_month || card.expiry_month || "12").padStart(2, "0")}/${String(card.exp_year || card.expiry_year || "28").slice(-2)}`;

                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardId(String(card.id))}
                          className={`p-3.5 rounded-[3px] border cursor-pointer transition-all flex items-center justify-between relative ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-2xs"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>

                            <div className="w-10 flex items-center justify-center">
                              {renderCardLogo(brand)}
                            </div>

                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {brand.toUpperCase()} ending in {last4}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Expires {exp}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isDefault && (
                              <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-[3px]">
                                Default
                              </span>
                            )}

                            {/* 3 dots action popup */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCardMenuId(activeCardMenuId === String(card.id) ? null : String(card.id));
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {activeCardMenuId === String(card.id) && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-7 w-36 bg-white dark:bg-slate-900 rounded-[3px] shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 text-xs animate-fade-in"
                                >
                                  {!isDefault && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPrimary(String(card.id))}
                                      className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                                    >
                                      <Check size={13} className="text-emerald-500" />
                                      <span>Set as Default</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCard(String(card.id))}
                                    className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
                                  >
                                    <Trash2 size={13} />
                                    <span>Remove Card</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Divider OR (When in Saved Card view) */}
            {paymentTab === "saved_card" && (
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OR
                </span>
              </div>
            )}

            {/* 3. Add a New Card Section */}
            <div className={`space-y-4 ${paymentTab === "saved_card" ? "opacity-90" : ""}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Add a new card
                </label>
                {paymentTab === "saved_card" && (
                  <button
                    type="button"
                    onClick={() => setPaymentTab("new_card")}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Use this form
                  </button>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                {/* 1. Cardholder Name */}
                <div>
                  <FormLabel htmlFor="checkout-cardholder-name" required className="text-xs font-semibold mb-1 block">
                    Cardholder Name
                  </FormLabel>
                  <Input
                    ref={cardNameRef}
                    id="checkout-cardholder-name"
                    value={cardName}
                    placeholder="e.g. John Doe"
                    onChange={handleCardNameChange}
                    onBlur={() => markTouched("cardName")}
                    error={fieldErrors.cardName}
                    className="!h-10 text-xs rounded-[3px]"
                  />
                </div>

                {/* 2. Card Number */}
                <div>
                  <FormLabel htmlFor="checkout-card-num" required className="text-xs font-semibold mb-1 block">
                    Card Number
                  </FormLabel>
                  <div className="relative">
                    <Input
                      ref={cardNumberRef}
                      id="checkout-card-num"
                      value={cardNumber}
                      placeholder="4242 •••• •••• 4242"
                      maxLength={19}
                      onChange={handleCardNumberChange}
                      onBlur={() => markTouched("cardNumber")}
                      error={fieldErrors.cardNumber}
                      className="!h-10 text-xs font-mono tracking-wider rounded-[3px] pr-12"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                      {renderCardLogo(cardBrand)}
                    </div>
                  </div>
                </div>

                {/* 3. Expiry & CVC in 2 columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormLabel htmlFor="checkout-card-expiry" required className="text-xs font-semibold mb-1 block">
                      Expiry Date
                    </FormLabel>
                    <div className="relative">
                      <Input
                        ref={cardExpiryRef}
                        id="checkout-card-expiry"
                        value={cardExpiry}
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={handleExpiryChange}
                        onBlur={() => markTouched("cardExpiry")}
                        error={fieldErrors.cardExpiry}
                        className="!h-10 text-xs rounded-[3px] pr-8"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Calendar size={14} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FormLabel htmlFor="checkout-card-cvc" required className="text-xs font-semibold mb-1 block">
                      CVC {cardBrand === "amex" ? "(4 Digits)" : "(3 Digits)"}
                    </FormLabel>
                    <div className="relative">
                      <Input
                        ref={cardCvcRef}
                        id="checkout-card-cvc"
                        value={cardCvc}
                        placeholder={cardBrand === "amex" ? "1234" : "888"}
                        maxLength={expectedCvcLength}
                        onChange={handleCvcChange}
                        onBlur={() => markTouched("cardCvc")}
                        error={fieldErrors.cardCvc}
                        className="!h-10 text-xs font-mono rounded-[3px] pr-8"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" title="3 or 4-digit security code on the back of your card">
                        <Info size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save card checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="checkout-save-card"
                    type="checkbox"
                    checked={saveCardForFuture}
                    onChange={(e) => setSaveCardForFuture(e.target.checked)}
                    className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 rounded-[3px] cursor-pointer"
                  />
                  <label
                    htmlFor="checkout-save-card"
                    className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium"
                  >
                    Save this card for future renewals and platform billing
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* RIGHT COLUMN: Compact Sticky Subscription Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4 font-sans">
              {/* Header: Plan info & Price */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-[3px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Rocket size={13} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {selectedPlan.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 pl-7.5">
                    <button
                      type="button"
                      onClick={() => handleCycleChange("monthly")}
                      className={`text-[10.5px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                        planCycle === "monthly"
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycleChange("yearly")}
                      className={`text-[10.5px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        planCycle === "yearly"
                          ? "bg-[#ff4a1f] text-white shadow-2xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#ff4a1f] dark:text-slate-400 dark:hover:text-[#ff4a1f]"
                      }`}
                    >
                      <span>Yearly</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded font-black">Save 20%</span>
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                    €{totalAmount.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    /{planCycle === "yearly" ? "year" : "month"}
                  </span>
                </div>
              </div>

              {/* What's included checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <span>What's included</span>
                  <span className="text-[10px] text-slate-400 font-semibold lowercase">
                    ({planFeatures.length} features)
                  </span>
                </div>

                <div className="space-y-1.5">
                  {visibleFeatures.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check size={9} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {planFeatures.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                    className="w-full pt-0.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span>{isFeaturesExpanded ? "Show fewer features" : `+ Show ${planFeatures.length - 4} more features`}</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${isFeaturesExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Plan Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">€{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Tax / VAT (0%)</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">€0.00</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Due Today</span>
                  <span className="text-lg font-black text-blue-600">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Next billing date reminder */}
              <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-[3px] flex items-center gap-2">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/60 rounded-[3px] text-blue-600 dark:text-blue-400 shrink-0">
                  <Calendar size={14} />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Next billing date: {nextBillingDateText}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Charged €{totalAmount.toFixed(2)} automatically upon renewal.
                  </span>
                </div>
              </div>

              {/* Already Subscribed Notice */}
              {isAlreadySubscribed && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-[3px] text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info size={13} className="text-amber-600 dark:text-amber-400" />
                    <span>Already Subscribed</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You are already actively subscribed to the <strong>{selectedPlan.name}</strong> plan{currentSub?.expires_at ? ` until ${currentSub.expires_at}` : ""}.
                  </p>
                </div>
              )}

              {/* Subscribe Action Button */}
              <div className="pt-0.5">
                <Button
                  type="button"
                  variant="primary"
                  isLoading={isProcessing}
                  disabled={isProcessing || isAlreadySubscribed}
                  onClick={handleCheckoutSubmit}
                  className={`w-full h-10 text-xs sm:text-sm font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 rounded-[3px] transition-all ${
                    isAlreadySubscribed
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                      : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  }`}
                >
                  {isAlreadySubscribed ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Current Active Plan</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Subscribe Now · €{totalAmount.toFixed(2)}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Trust Badges Footer */}
              <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <div className="space-y-0.5">
                  <ShieldCheck size={14} className="text-blue-600 mx-auto" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Secure payment</span>
                  <span className="text-[8.5px] text-slate-400 block leading-none">Stripe 256-bit</span>
                </div>

                <div className="space-y-0.5">
                  <Lock size={14} className="text-blue-600 mx-auto" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Data protected</span>
                  <span className="text-[8.5px] text-slate-400 block leading-none">SSL Encrypted</span>
                </div>

                <div className="space-y-0.5">
                  <RotateCcw size={14} className="text-blue-600 mx-auto" />
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Cancel anytime</span>
                  <span className="text-[8.5px] text-slate-400 block leading-none">No lock-in</span>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <p className="text-[9.5px] text-slate-400 dark:text-slate-500 text-center leading-normal">
                By subscribing, you agree to our{" "}
                <a href="/terms" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddSuccess={() => {
          loadSavedCards();
        }}
      />

      {/* Success Modal */}
      {isSuccessModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in font-sans">
          <div className="bg-white dark:bg-[#1e2329] rounded-[4px] max-w-[390px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-center space-y-3.5 relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-inner">
              <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>

            <div>
              <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold mb-1 px-2.5 py-0.5 rounded-[3px]">
                Payment Confirmed
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Subscription Activated!
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                Welcome to <span className="font-bold text-slate-900 dark:text-slate-100">{successData?.plan_name || selectedPlan.name}</span>. Your tools and quota are now active.
              </p>
            </div>

            {/* Receipt Summary Box with Crisp Key-Value Alignment */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-[4px] border border-slate-200/80 dark:border-slate-700/60 text-left text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Invoice Number:</span>
                <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100 truncate text-right">
                  {successData?.invoice_number || "SUB-2026-9871"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Amount Paid:</span>
                <span className="font-mono font-bold text-[11.5px] text-emerald-600 dark:text-emerald-400 text-right">
                  {successData?.amount_formatted || `€${totalAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Payment Method:</span>
                <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 text-right">
                  {successData?.payment_method || "Credit Card"}
                </span>
              </div>
              {successData?.expires_at && (
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Next Renewal:</span>
                  <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 text-right">
                    {(() => {
                      try {
                        const d = new Date(successData.expires_at);
                        if (!isNaN(d.getTime())) {
                          return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        }
                      } catch {}
                      return String(successData.expires_at).split(" ")[0] || successData.expires_at;
                    })()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2.5">
              {successData?.download_url ? (
                <a
                  href={successData.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors truncate"
                >
                  <Download size={13} className="shrink-0" />
                  <span className="truncate">Tax Invoice</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    navigate("/supplier/settings?tab=billing");
                  }}
                  className="h-9 px-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors truncate"
                >
                  <Download size={13} className="shrink-0" />
                  <span className="truncate">Tax Invoice</span>
                </button>
              )}
              <Button
                variant="primary"
                className="h-9 px-2 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5 rounded-[3px] truncate"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/supplier/subscription");
                }}
              >
                <span className="truncate">Dashboard</span>
                <ArrowRight size={13} className="shrink-0" />
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
