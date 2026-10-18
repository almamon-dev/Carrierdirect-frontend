import React from "react";
import { GPSComingSoonModal, SubscriptionLockModal } from "@/components/modals";
import { useCustomerDashboard } from "./hooks/useCustomerDashboard";
import { DashboardMetricsGrid } from "./components/DashboardMetricsGrid";
import { DashboardChartsRow } from "./components/DashboardChartsRow";
import { LiveActiveShipmentsTable } from "./components/LiveActiveShipmentsTable";
import { RecentRequestsAndNotifications } from "./components/RecentRequestsAndNotifications";

export default function CustomerDashboard() {
  const {
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
  } = useCustomerDashboard();

  const hasWalletAccess = Boolean(canUsePayLater || profile?.is_pay_later_eligible || profile?.has_wallet_access);

  return (
    <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
      <DashboardMetricsGrid
        metrics={metrics}
        hasWalletAccess={hasWalletAccess}
        loading={loading}
        onUnlockWallet={checkPayLaterOrLock}
      />

      <DashboardChartsRow
        totalSpending={metrics.totalSpending}
        spendFilter={spendFilter}
        onSpendFilterChange={setSpendFilter}
        spendChartData={spendChartData}
        overviewFilter={overviewFilter}
        onOverviewFilterChange={setOverviewFilter}
        orderQuoteChartData={orderQuoteChartData}
        quoteRequestsCount={quoteRequests.length}
        totalQuotesReceived={totalQuotesReceived}
        ordersCount={orders.length}
        orders={orders}
        quoteRequests={quoteRequests}
        invoices={invoices}
      />

      <LiveActiveShipmentsTable
        loading={loading}
        requests={quoteRequests}
        shipments={liveActiveShipments}
        onTrack={setGpsModalData}
      />

      <RecentRequestsAndNotifications
        loading={loading}
        quoteRequests={quoteRequests}
        notifications={notifications}
      />

      {/* Live GPS Tracking Coming Soon Modal */}
      <GPSComingSoonModal
        isOpen={gpsModalData.isOpen}
        onClose={() => setGpsModalData((prev) => ({ ...prev, isOpen: false }))}
        destination={gpsModalData.destination}
      />

      {/* Corporate Pay-Later Subscription Lock Modal */}
      <SubscriptionLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        onUpgrade={handleUpgradeRedirect}
        userType="customer"
        title={modalTitle || "Growth Logistics Plan Required"}
        description={
          modalDescription ||
          "Corporate Pay-Later Credit Line (Net 30/60 Days) is exclusively available on Growth Logistics and Enterprise plans. Please upgrade your plan to unlock."
        }
        requiredPlan={modalRequiredPlan || "Growth Logistics"}
        benefits={
          modalBenefits || [
            "Corporate Pay-Later Credit Line (Net 30/60 Days)",
            "Book Shipments Instantly Without Upfront Card Charge",
            "Automated Monthly Consolidated VAT Invoices",
            "Dedicated Operations Manager & Priority Dispatch",
            "AI Bulk RFQ Import & Document Extraction",
          ]
        }
      />
    </div>
  );
}
