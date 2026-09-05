import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, RefreshCw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { getNegotiationColumns } from './components/columns';
import { NegotiationFilterTab, NegotiationFilterTabs } from './components/NegotiationFilterTabs';
import { NegotiationRowActions } from './components/NegotiationRowActions';
import { TableFilterContent } from './components/TableFilterContent';
import { useCustomerNegotiations } from './hooks/useCustomerNegotiations';
import { useFilteredCustomerNegotiations } from './hooks/useFilteredCustomerNegotiations';
import { CustomerNegotiationItem } from './types';

export { type CustomerNegotiationItem, type NegotiationTab } from './types';

export default function CustomerNegotiation() {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<NegotiationFilterTab>('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setPriorityFilter('all');
        setStatusFilter('all');
        setVehicleFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const { negotiations = [], isLoading = false, fetchNegotiations } = useCustomerNegotiations() || {};

    const handleQuoteAction = (row: CustomerNegotiationItem) => {
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(row?.rawId || row?.id || '')}`);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            if (fetchNegotiations) await fetchNegotiations(true);
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const filteredData = useFilteredCustomerNegotiations({
        negotiations,
        activeTab,
        priorityFilter,
        statusFilter,
        vehicleFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getNegotiationColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Quote Negotiations
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage active supplier price counter offers and track negotiation history.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
            </div>

            <DataTable
                data={filteredData || []}
                columns={columns}
                actions={(row) => <NegotiationRowActions row={row} onQuoteAction={handleQuoteAction} />}
                headerTabs={
                    <NegotiationFilterTabs
                        negotiations={negotiations}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item?.id || Math.random().toString()}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={false}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => handleQuoteAction(row)}
                tableLayout="fixed"
                tableClassName="min-w-[1180px]"
                actionsColumnClassName="w-[130px] min-w-[130px]"
                emptyState={
                    <EmptyState
                        icon={MessageSquare}
                        title="No Negotiations Available"
                        description="There are currently no active price negotiations or counter offers matching your criteria. New offers from suppliers will appear here automatically."
                    />
                }
            />
        </div>
    );
}
