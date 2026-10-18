import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';

import { WithdrawalItem } from './types/withdrawal.types';
import { WithdrawalFilterTabs } from './components/WithdrawalFilterTabs';
import { WithdrawalTableFilterContent } from './components/WithdrawalTableFilterContent';
import { getWithdrawalColumns } from './components/WithdrawalColumns';
import { WithdrawalDetailsModal } from './components/WithdrawalDetailsModal';
import { WithdrawalMetricCards } from './components/WithdrawalMetricCards';
import { WithdrawalHeader } from './components/WithdrawalHeader';
import { useWithdrawalFilter } from './hooks/useWithdrawalFilter';
import { useSupplierWithdrawalData } from './hooks/useSupplierWithdrawalData';
import WithdrawModal from '@/modules/Supplier/Wallet/components/WithdrawModal';

export type { WithdrawalItem } from './types/withdrawal.types';

export default function Withdrawal() {
    const location = useLocation();
    const [selectedModalItem, setSelectedModalItem] = useState<WithdrawalItem | null>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const stripeNotice = location.state?.stripeNotice;

    const {
        loading,
        isRefreshing,
        redirectingTarget,
        stats,
        stripeAccountData,
        withdrawals,
        isDevTesting,
        notification,
        setNotification,
        isStripeConnected,
        fetchFinanceData,
        handleRedirectToStripeOnboarding,
        handleTestConnect,
        handleTestReset,
    } = useSupplierWithdrawalData();

    const {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        methodFilter,
        setMethodFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredData,
    } = useWithdrawalFilter(withdrawals);

    const columns = useMemo(() => getWithdrawalColumns((item) => setSelectedModalItem(item)), []);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <WithdrawalHeader
                availableBalance={stats.availableBalance}
                isStripeConnected={isStripeConnected}
                loading={loading}
                isRefreshing={isRefreshing}
                isDevTesting={isDevTesting}
                redirectingTarget={redirectingTarget}
                notification={notification}
                stripeNotice={stripeNotice}
                onTestConnect={handleTestConnect}
                onTestReset={handleTestReset}
                onRefresh={() => fetchFinanceData(true)}
                onRedirectStripe={handleRedirectToStripeOnboarding}
                onCloseNotification={() => setNotification(null)}
            />

            <WithdrawalMetricCards
                stats={stats}
                isStripeConnected={isStripeConnected}
                stripeAccountData={stripeAccountData}
                loading={loading}
                onStripeCardClick={handleRedirectToStripeOnboarding}
            />

            <DataTable
                data={filteredData}
                columns={columns}
                onRowClick={(row) => setSelectedModalItem(row)}
                headerTabs={
                    <WithdrawalFilterTabs
                        withdrawals={withdrawals}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <WithdrawalTableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        methodFilter={methodFilter}
                        setMethodFilter={setMethodFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search payouts by ID, method, reference..."
                isLoading={loading}
                keyExtractor={(item) => item.id}
                emptyState={
                    <EmptyState
                        icon={Building2}
                        title="No Payouts or Settlements Found"
                        description={
                            activeTab === 'all'
                                ? "You don't have any payout transactions or settlement records yet."
                                : `No payout records matching '${activeTab}'.`
                        }
                    />
                }
            />

            <WithdrawalDetailsModal
                isOpen={selectedModalItem !== null}
                onClose={() => setSelectedModalItem(null)}
                item={selectedModalItem}
            />

            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                availableBalance={stats.availableBalance}
                stripeAccount={{ is_connected: isStripeConnected, account_id: stripeAccountData?.account_id }}
                onSuccess={() => fetchFinanceData(true)}
            />
        </div>
    );
}
