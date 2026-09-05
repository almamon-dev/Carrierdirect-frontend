import React, { useState, useMemo } from 'react';
import { Inbox, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { DeclineOfferModal } from '../Negotiation/Chat/components/DeclineOfferModal';
import { TableFilterContent } from './Filters/TableFilterContent';
import { QuoteReceivedRowActions } from './Actions/QuoteReceivedRowActions';
import { useCustomerQuotesReceived } from './hooks/useCustomerQuotesReceived';
import { useFilteredQuotesReceived } from './hooks/useFilteredQuotesReceived';
import { QuotesReceivedFilterTabs } from './components/QuotesReceivedFilterTabs';
import { getQuotesReceivedColumns } from './components/columns';
import { encryptId } from '@/lib/encryption';

export default function QuotesReceived() {
    const navigate = useNavigate();
    const {
        quotes,
        loading,
        isRefreshing,
        actionLoading,
        rejectModalQuote,
        setRejectModalQuote,
        fetchQuotes,
        handleAccept,
        handleConfirmReject,
    } = useCustomerQuotesReceived();

    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setRatingFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredQuotes = useFilteredQuotesReceived({
        quotes,
        activeFilterTab,
        statusFilter,
        vehicleFilter,
        ratingFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getQuotesReceivedColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">Quotes Received</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review, compare, negotiate, and accept competitive shipping quotes from verified suppliers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchQuotes(true)} disabled={isRefreshing} className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700">
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/customer/quotes/create/new')} className="h-9 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5">
                        <Plus size={14} />
                        <span>Create New Request</span>
                    </Button>
                </div>
            </div>

            <DataTable
                data={filteredQuotes}
                columns={columns}
                actions={(row: any) => (
                    <QuoteReceivedRowActions row={row} isAccepting={actionLoading === row.id} onAccept={handleAccept} onReject={(r) => setRejectModalQuote(r)} />
                )}
                actionsColumnClassName="w-[195px] min-w-[195px] text-right pr-3"
                headerTabs={<QuotesReceivedFilterTabs quotes={quotes} activeFilterTab={activeFilterTab} setActiveFilterTab={setActiveFilterTab} />}
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        ratingFilter={ratingFilter}
                        setRatingFilter={setRatingFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search quotes by ID, supplier, vehicle, or route..."
                compact={true}
                isLoading={loading || isRefreshing}
                onRowClick={(row) => navigate(`/customer/quotes/received/view/${encryptId(row.id)}`)}
                tableClassName="w-full min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Quotes Received Yet"
                        description={activeFilterTab === 'all' ? 'When verified suppliers submit quotes for your shipping requests, they will appear here.' : `No received quotes match '${activeFilterTab}'.`}
                        actionLabel="Create Quote Request"
                        onAction={() => navigate('/customer/quotes/create/new')}
                    />
                }
            />

            <DeclineOfferModal
                isOpen={Boolean(rejectModalQuote)}
                onClose={() => setRejectModalQuote(null)}
                offerAmount={rejectModalQuote?.amount_raw || (rejectModalQuote?.amount ? parseFloat(String(rejectModalQuote.amount).replace(/[^0-9.]/g, '')) : undefined)}
                currency="€"
                onConfirm={handleConfirmReject}
            />
        </div>
    );
}
