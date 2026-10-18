import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/lib/axios";
import { decryptId } from "@/lib/encryption";
import { useToastStore } from "@/stores/useToastStore";

export function useSubscriptionCheckoutState() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const showToast = useToastStore((state) => state.showToast);

  const { planId } = useParams<{ planId?: string }>();
  const cleanPlanId = planId ? decryptId(planId) : null;
  const planFromState = location.state?.plan;

  const queryPlanId = searchParams.get("plan") || searchParams.get("plan_id") || cleanPlanId;
  const queryCycle = (searchParams.get("cycle") || location.state?.billingCycle || planFromState?.cycle || "").toLowerCase();
  const initialCycle: "monthly" | "yearly" = queryCycle === "yearly" || queryCycle === "annual" ? "yearly" : "monthly";

  const [selectedPlan, setSelectedPlan] = useState<any>(
    planFromState || {
      id: queryPlanId ? (isNaN(Number(queryPlanId)) ? queryPlanId : Number(queryPlanId)) : 2,
      name: "Professional Carrier",
      priceMonthly: 49,
      priceYearly: 490,
      cycle: initialCycle,
      features: [
        "Unlimited Quote Submissions & Active Bidding",
        "Priority Real-time Lead Alerts & High-Value RFQs",
        "Team Management — Up to 5 Staff Accounts",
        "Fleet Management — Up to 10 Vehicles & Capacity Specs",
        "Verified Carrier & CMR Insurance Trust Badge",
        "Automated Stripe Connect Payouts (2 Business Days)",
      ],
    }
  );

  const [paymentTab, setPaymentTab] = useState<"saved_card" | "new_card">("saved_card");
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean | undefined>>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const markTouched = (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const loadSavedCards = async () => {
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
    }
  };

  const fetchPlanDetails = async () => {
    try {
      const res: any = await apiClient.get(`/subscription/plans?user_type=supplier`);
      const rawPlans = res?.data?.plans || res?.data?.data?.plans || res?.data?.data || res?.data || [];
      const plansList = Array.isArray(rawPlans) ? rawPlans : (rawPlans?.data || []);
      const paidPlans = plansList.filter((p: any) => p.billing_period !== "trial" && Number(p.price) > 0);

      const targetId = queryPlanId || planFromState?.id;
      const matched = targetId
        ? paidPlans.find((p: any) => String(p.id) === String(targetId) || String(p.planId) === String(targetId))
        : paidPlans[0];

      if (matched) {
        setSelectedPlan((prev: any) => ({
          ...prev,
          id: matched.id,
          name: matched.name,
          priceMonthly: Number(matched.price || 49),
          priceYearly: Number(matched.yearly_price || (matched.price * 10)),
          features: matched.features || prev.features,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([loadSavedCards(), fetchPlanDetails()]).finally(() => {
      setIsInitialLoading(false);
    });
  }, []);

  const handleCycleChange = (cycle: "monthly" | "yearly") => {
    setSelectedPlan((prev: any) => ({ ...prev, cycle }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("cycle", cycle);
      return next;
    }, { replace: true });
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const payload: any = {
        plan_id: selectedPlan.id,
        billing_cycle: selectedPlan.cycle || "monthly",
      };

      if (paymentTab === "saved_card" && selectedCardId) {
        payload.payment_method_id = selectedCardId;
      } else {
        payload.card_name = cardName;
        payload.card_number = cardNumber.replace(/\s+/g, "");
        payload.card_expiry = cardExpiry;
        payload.card_cvc = cardCvc;
        payload.save_card = saveCardForFuture;
      }

      const res: any = await apiClient.post("/subscription/subscribe", payload);
      const resData = res?.data?.data || res?.data || res;
      setSuccessData(resData);
      setIsSuccessModalOpen(true);
      showToast("Subscription payment completed successfully!", "success");
    } catch (err: any) {
      const msg = err?.data?.message || err?.response?.data?.message || err?.message || "Payment processing failed";
      showToast(msg, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = selectedPlan?.cycle === "yearly"
    ? Number(selectedPlan?.priceYearly || 490)
    : Number(selectedPlan?.priceMonthly || 49);

  return {
    selectedPlan,
    paymentTab,
    setPaymentTab,
    savedCards,
    selectedCardId,
    setSelectedCardId,
    cardName,
    setCardName,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    saveCardForFuture,
    setSaveCardForFuture,
    touched,
    markTouched,
    isProcessing,
    isInitialLoading,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    successData,
    totalAmount,
    handleCycleChange,
    handlePay,
  };
}
