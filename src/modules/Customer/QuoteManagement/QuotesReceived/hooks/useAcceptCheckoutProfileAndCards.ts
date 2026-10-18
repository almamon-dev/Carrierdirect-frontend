import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";

export function useAcceptCheckoutProfileAndCards() {
    const showToast = useToastStore((state) => state.showToast);

    // Dynamic credit limit & payment profile state
    const [payLaterLimit, setPayLaterLimit] = useState<number>(80000);
    const [payLaterStatus, setPayLaterStatus] = useState<string>("approved");

    useEffect(() => {
        const fetchPaymentProfile = async () => {
            try {
                const res: any = await apiClient.get("/customer/profile");
                const profileData = res?.data?.data || res?.data || {};

                const hasAccess = Boolean(profileData.is_pay_later_eligible || profileData.has_wallet_access);
                const dynamicAvailable = hasAccess
                    ? (profileData.pay_later_available ??
                       profileData.wallet_balance ??
                       profileData.available_balance ??
                       profileData.pay_later_limit ??
                       0)
                    : 0;

                setPayLaterLimit(Number(dynamicAvailable));

                const dynamicStatus =
                    profileData.pay_later_status ??
                    profileData.payment_info?.pay_later_status;

                if (dynamicStatus) {
                    setPayLaterStatus(dynamicStatus);
                }
            } catch (e) {
                console.log("Customer payment profile fetch error:", e);
            }
        };
        fetchPaymentProfile();
    }, []);

    // Saved Cards State
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [paymentTab, setPaymentTab] = useState<"saved_card" | "new_card">("saved_card");
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

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
        } catch (e) {
            console.log("Saved cards fetch error:", e);
            setPaymentTab("new_card");
        } finally {
            setIsLoadingCards(false);
        }
    };

    useEffect(() => {
        loadSavedCards();
    }, []);

    const handleSetPrimaryCard = async (cardId: string) => {
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
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to update default card", "error");
        }
    };

    const handleDeleteCard = async (cardId: string) => {
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
            showToast("Card removed successfully", "success");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to delete card", "error");
        }
    };

    return {
        payLaterLimit,
        payLaterStatus,
        savedCards,
        isLoadingCards,
        selectedCardId,
        setSelectedCardId,
        paymentTab,
        setPaymentTab,
        isAddCardModalOpen,
        setIsAddCardModalOpen,
        loadSavedCards,
        handleSetPrimaryCard,
        handleDeleteCard,
    };
}
