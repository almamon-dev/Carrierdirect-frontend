/**
 * Supplier Quote Management - Won Quotes Page
 * Displays accepted/won transportation quotes with filter tabs and responsive table.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Trophy } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useSupplierWonQuotes } from './hooks/useSupplierWonQuotes';
import { getWonQuoteColumns } from './components/columns';
import { WonRowActions } from './components/WonRowActions';
import { FilterTabs } from './components/FilterTabs';

export default function WonQuotes() {
    const navigate = useNavigate();
    const {
        quotes,
        filteredQuotes,
        isLoading,
        activeTab,
        setActiveTab,
        fetchWonQuotes,
    } = useSupplierWonQuotes();

    const columns = useMemo(() => getWonQuoteColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Won Quotes
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        View and manage transportation quote bids that have been accepted by shippers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchWonQuotes(true)}
                        disabled={isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Main Data Table */}
            <DataTable
                data={filteredQuotes}
                columns={columns}
                actions={(row) => <WonRowActions row={row} />}
                headerTabs={
                    <FilterTabs
                        quotes={quotes}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search won quotes by ID, shipper, pickup, delivery..."
                compact={true}
                hideViewToggle={true}
                isLoading={isLoading}
                skeletonCount={filteredQuotes.length > 0 ? filteredQuotes.length : 3}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Trophy}
                        title="No Won Quotes Found"
                        description={activeTab === 'All'
                            ? "You have not won any quote requests yet. Keep submitting competitive bids to win freight loads."
                            : `No won quotes currently match the '${activeTab}' filter.`
                        }
                        actionLabel="Browse Available RFQs"
                        onAction={() => navigate('/supplier/quotes/requests')}
                    />
                }
            />
        </div>
    );
}
