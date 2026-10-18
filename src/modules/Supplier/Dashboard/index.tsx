import { ServiceAreaAvailabilitySection } from '../Availability/Dashboard/components/ServiceAreaAvailabilitySection';
import { ActiveOrdersList } from './components/ActiveOrdersList';
import { DashboardNotificationsList } from './components/DashboardNotificationsList';
import { MetricCardsGrid } from './components/MetricCardsGrid';
import { RecentQuotesList } from './components/RecentQuotesList';
import { SupplierDashboardChartsRow } from './components/SupplierDashboardChartsRow';
import { useSupplierDashboardData } from './hooks/useSupplierDashboardData';

export default function SupplierDashboard() {
    const {
        isLoading,
        totalEarnings,
        activeOrdersCount,
        pendingQuotesCount,
        withdrawableBalance,
        avgRating,
        earningsFilter,
        setEarningsFilter,
        quoteOverviewFilter,
        setQuoteOverviewFilter,
        recentQuotes,
        displayOrders,
        displayNotifications,
        quoteRequests,
        activeOrders,
        financeSummary,
    } = useSupplierDashboardData();

    return (
        <div className="p-2 sm:p-2.5 md:p-3 space-y-2 sm:space-y-2.5 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Metrics Grid */}
            <MetricCardsGrid
                totalEarnings={totalEarnings}
                activeOrdersCount={activeOrdersCount}
                pendingQuotesCount={pendingQuotesCount}
                withdrawableBalance={withdrawableBalance}
                avgRating={avgRating}
                isLoading={isLoading}
            />

            {/* 3-Column Aesthetic Charts Row */}
            <SupplierDashboardChartsRow
                totalEarnings={totalEarnings}
                financeSummary={financeSummary}
                quoteRequests={quoteRequests}
                activeOrders={activeOrders}
                earningsFilter={earningsFilter}
                onEarningsFilterChange={setEarningsFilter}
                quoteOverviewFilter={quoteOverviewFilter}
                onQuoteOverviewFilterChange={setQuoteOverviewFilter}
                isLoading={isLoading}
            />

            {/* Service Area Coverage & Upcoming Availability Section */}
            <ServiceAreaAvailabilitySection isLoading={isLoading} className="mb-2 sm:mb-2.5" />

            {/* Footer Lists Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                <RecentQuotesList quotes={recentQuotes} isLoading={isLoading} />
                <ActiveOrdersList orders={displayOrders} isLoading={isLoading} />
                <DashboardNotificationsList notifications={displayNotifications} isLoading={isLoading} />
            </div>
        </div>
    );
}
