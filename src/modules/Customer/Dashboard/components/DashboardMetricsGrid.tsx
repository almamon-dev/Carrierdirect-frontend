import React from "react";
import { CreditCard, Euro, FileText, Lock, Package, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/cards/metric-card";
import { formatCurrency } from "../utils/dashboardUtils";

interface DashboardMetricsGridProps {
  metrics: {
    totalSpending: number;
    activeOrders: number;
    totalRequests: number;
    activeRequests: number;
    walletBalance: number;
    avgRating: string | number;
  };
  hasWalletAccess: boolean;
  loading: boolean;
  onUnlockWallet: () => void;
}

export const DashboardMetricsGrid: React.FC<DashboardMetricsGridProps> = ({
  metrics,
  hasWalletAccess,
  loading,
  onUnlockWallet,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 mt-0.5 sm:mt-1">
      <MetricCard
        title="Total Spending"
        description="Total spending across confirmed shipments."
        value={formatCurrency(metrics.totalSpending)}
        icon={Euro}
        colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
        isLoading={loading}
      />
      <MetricCard
        title="Active Orders"
        description="Shipments currently being processed or in transit."
        value={metrics.activeOrders}
        icon={Package}
        colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
        isLoading={loading}
      />
      <MetricCard
        title="Total Requests"
        description="Total quote requests submitted."
        value={metrics.totalRequests}
        icon={FileText}
        colorClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
        isLoading={loading}
      />
      {hasWalletAccess ? (
        <MetricCard
          title="Wallet Balance"
          description="Balance available for instant booking."
          value={formatCurrency(metrics.walletBalance)}
          icon={CreditCard}
          colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          isLoading={loading}
          onClick={() => navigate("/customer/finance/pay-later")}
        />
      ) : (
        <MetricCard
          title="Wallet Balance"
          description="Subscribe to Growth or Enterprise to unlock."
          value="Locked 🔒"
          valueClassName="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400"
          icon={Lock}
          colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
          isLoading={loading}
          badge={
            <span
              onClick={(e) => {
                e.stopPropagation();
                onUnlockWallet();
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff4a1f] text-white hover:bg-[#e63d15] transition-colors cursor-pointer shadow-xs"
            >
              Unlock
            </span>
          }
          onClick={onUnlockWallet}
        />
      )}
      <MetricCard
        title="Avg. Rating"
        description="Average rating feedback for logistics."
        value={metrics.avgRating}
        icon={Star}
        colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
        isLastOnMobile={true}
        isLoading={loading}
      />
    </div>
  );
};

export default DashboardMetricsGrid;
