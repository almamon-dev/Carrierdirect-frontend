import { echo } from "@/lib/echo";
import { useState, useEffect, useMemo, useCallback } from "react";
import apiClient from "@/lib/axios";
import { useSubscriptionQuota } from "@/hooks/useSubscriptionQuota";
import {
  calculateSpendChartData,
  calculateOrderQuoteChartData,
} from "../utils/dashboardChartCalculators";

export function useCustomerDashboard() {
  const [loading, setLoading] = useState(true);

  const {
    canUsePayLater,
    checkPayLaterOrLock,
    isLockModalOpen,
    setIsLockModalOpen,
    handleUpgradeRedirect,
    modalTitle,
    modalDescription,
    modalRequiredPlan,
    modalBenefits,
  } = useSubscriptionQuota();

  const [gpsModalData, setGpsModalData] = useState<{ isOpen: boolean; destination: string }>({
    isOpen: false,
    destination: "",
  });

  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [overviewStats, setOverviewStats] = useState<any>(null);

  const [spendFilter, setSpendFilter] = useState<"30_days" | "3_months" | "this_year">("30_days");
  const [overviewFilter, setOverviewFilter] = useState<"30_days" | "3_months" | "this_year">("30_days");

  const fetchDashboardData = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const [profileRes, ordersRes, quotesRes, invoicesRes, notifsRes, overviewRes] = await Promise.allSettled([
        apiClient.get("/customer/profile"),
        apiClient.get("/customer/orders"),
        apiClient.get("/customer/quote-requests"),
        apiClient.get("/customer/invoices"),
        apiClient.get("/customer/notifications"),
        apiClient.get("/customer/dashboard-overview"),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data?.data || profileRes.value.data || null);
      if (ordersRes.status === "fulfilled") {
        const list = ordersRes.value.data?.data || ordersRes.value.data || [];
        setOrders(Array.isArray(list) ? list : []);
      }
      if (quotesRes.status === "fulfilled") {
        const list = quotesRes.value.data?.data || quotesRes.value.data || [];
        setQuoteRequests(Array.isArray(list) ? list : []);
      }
      if (invoicesRes.status === "fulfilled") {
        const list = invoicesRes.value.data?.data || invoicesRes.value.data || [];
        setInvoices(Array.isArray(list) ? list : []);
      }
      if (notifsRes.status === "fulfilled") {
        const notifsData = notifsRes.value.data?.data?.notifications || notifsRes.value.data?.notifications || notifsRes.value.data?.data || notifsRes.value.data || [];
        setNotifications(Array.isArray(notifsData) ? notifsData : []);
      }
      if (overviewRes.status === "fulfilled") {
        const ovData = overviewRes.value.data?.data || overviewRes.value.data;
        setOverviewStats(ovData?.stats || ovData || null);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Real-time synchronization for Customer Dashboard
  useEffect(() => {
    const handleSync = () => {
      fetchDashboardData(true);
    };

    window.addEventListener("carrierdirect_notif_update", handleSync);
    window.addEventListener("carrierdirect_quote_updated", handleSync);
    window.addEventListener("order-status-updated", handleSync);

    // Reverb WebSocket direct subscription
    let channel: any = null;
    try {
      const userStr = localStorage.getItem("user");
      const parsedUser = userStr ? JSON.parse(userStr) : null;
      const uid = profile?.id || parsedUser?.id;

      if (uid) {
        channel = echo.private(`App.Models.User.${uid}`);
        channel.notification(() => {
          fetchDashboardData(true);
        });
        channel.listen(".quote.updated", () => {
          fetchDashboardData(true);
        });
        channel.listen(".ShipmentStatusUpdated", () => {
          fetchDashboardData(true);
        });
      }
    } catch (e) {
      console.warn("Customer Dashboard Echo error:", e);
    }

    // Fallback polling every 20 seconds for seamless real-time updates
    const pollTimer = setInterval(() => {
      fetchDashboardData(true);
    }, 20000);

    return () => {
      window.removeEventListener("carrierdirect_notif_update", handleSync);
      window.removeEventListener("carrierdirect_quote_updated", handleSync);
      window.removeEventListener("order-status-updated", handleSync);
      clearInterval(pollTimer);
      if (channel) {
        try {
          channel.stopListening(".Illuminate\Notifications\Events\BroadcastNotificationCreated");
          channel.stopListening(".quote.updated");
          channel.stopListening(".ShipmentStatusUpdated");
        } catch {}
      }
    };
  }, [fetchDashboardData, profile?.id]);

  const metrics = useMemo(() => {
    let totalSpend = invoices.reduce((acc, curr) => {
      const st = (curr.status || "").toLowerCase();
      return st === "paid" || st === "completed" ? acc + (Number(curr.amount) || Number(curr.total) || 0) : acc;
    }, 0);

    if (totalSpend === 0 && orders.length > 0) {
      totalSpend = orders.reduce((acc, curr) => {
        const st = (curr.status || curr.status_raw || "").toLowerCase();
        return ["completed", "delivered", "confirmed", "booked", "in_progress", "assigned"].includes(st)
          ? acc + (Number(curr.total_amount) || Number(curr.amount) || 0)
          : acc;
      }, 0);
    }
    if (totalSpend === 0 && overviewStats?.total_spending) totalSpend = Number(overviewStats.total_spending) || 0;
    else if (totalSpend === 0 && profile?.total_spending) totalSpend = Number(profile.total_spending) || 0;

    const activeOrdersCount = overviewStats?.active_orders ?? orders.filter((o) => {
      const s = (o.status || o.status_raw || "").toLowerCase();
      return !["delivered", "completed", "cancelled"].includes(s);
    }).length;

    const totalRequestsCount = overviewStats?.total_requests ?? quoteRequests.length;
    const activeRequestsCount = overviewStats?.active_quotes ?? overviewStats?.active_requests ?? quoteRequests.filter((q) => {
      const s = (q.status || "").toLowerCase();
      return !["completed", "cancelled", "booked"].includes(s);
    }).length;

    const hasWalletAccess = Boolean(canUsePayLater || profile?.is_pay_later_eligible || profile?.has_wallet_access);
    const walletBal = hasWalletAccess
      ? (profile?.wallet_balance ?? profile?.available_balance ?? profile?.pay_later_available ?? profile?.balance ?? 0)
      : 0;

    let avgRatingVal: string | number = "0.0";
    if (overviewStats?.avg_rating && Number(overviewStats.avg_rating) > 0) avgRatingVal = Number(overviewStats.avg_rating).toFixed(1);
    else if (profile?.avg_rating && Number(profile.avg_rating) > 0) avgRatingVal = Number(profile.avg_rating).toFixed(1);
    else if (profile?.rating && Number(profile.rating) > 0) avgRatingVal = Number(profile.rating).toFixed(1);
    else {
      const ratedOrders = orders.filter((o) => (o.review?.rating || o.rating || o.carrier_rating || o.supplier?.rating) > 0);
      if (ratedOrders.length > 0) {
        const sum = ratedOrders.reduce((acc, curr) => acc + Number(curr.review?.rating || curr.rating || curr.carrier_rating || curr.supplier?.rating || 0), 0);
        avgRatingVal = (sum / ratedOrders.length).toFixed(1);
      }
    }

    return {
      totalSpending: totalSpend,
      activeOrders: activeOrdersCount,
      totalRequests: totalRequestsCount,
      activeRequests: activeRequestsCount,
      walletBalance: walletBal,
      avgRating: avgRatingVal,
    };
  }, [invoices, orders, quoteRequests, profile, overviewStats, canUsePayLater]);

  const spendChartData = useMemo(
    () => calculateSpendChartData(spendFilter, invoices, metrics.totalSpending),
    [spendFilter, invoices, metrics.totalSpending]
  );

  const totalQuotesReceived = useMemo(() => {
    return quoteRequests.reduce((acc, q) => {
      const count = Number(q.quotes_count ?? q.quotes_received_count ?? q.bids_count ?? (Array.isArray(q.quotes_request) ? q.quotes_request.length : Array.isArray(q.quotes) ? q.quotes.length : 0));
      return acc + count;
    }, 0);
  }, [quoteRequests]);

  const orderQuoteChartData = useMemo(
    () => calculateOrderQuoteChartData(quoteRequests, orders, totalQuotesReceived),
    [quoteRequests, orders, totalQuotesReceived]
  );

  const liveActiveShipments = useMemo(() => {
    const filtered = orders.filter((o) => {
      const s = (o.status || o.status_raw || "").toLowerCase();
      return !["delivered", "completed", "cancelled"].includes(s);
    });
    return filtered.length > 0 ? filtered : orders.slice(0, 5);
  }, [orders]);

  return {
    loading,
    profile,
    orders,
    quoteRequests,
    invoices,
    notifications,
    metrics,
    spendFilter,
    setSpendFilter,
    overviewFilter,
    setOverviewFilter,
    spendChartData,
    orderQuoteChartData,
    totalQuotesReceived,
    liveActiveShipments,
    canUsePayLater,
    checkPayLaterOrLock,
    isLockModalOpen,
    setIsLockModalOpen,
    handleUpgradeRedirect,
    modalTitle,
    modalDescription,
    modalRequiredPlan,
    modalBenefits,
    gpsModalData,
    setGpsModalData,
    fetchDashboardData,
  };
}
