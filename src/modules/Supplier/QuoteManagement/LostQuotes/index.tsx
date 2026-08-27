/**
 * Supplier Quote Management - Lost Quotes Page
 * Displays expired, outbid, and declined quotes with filter tabs and responsive table.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Inbox } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useSupplierLostQuotes } from './hooks/useSupplierLostQuotes';
import { getLostQuoteColumns } from './components/columns';
import { LostRowActions } from './components/LostRowActions';
import { FilterTabs } from './components/FilterTabs';

export default function LostQuotes() {
    const navigate = useNavigate();
    const {
        quotes,
        filteredQuotes,
        isLoading,
        activeTab,
        setActiveTab,
        fetchLostQuotes,
    } = useSupplierLostQuotes();

    const columns = useMemo(() => getLostQuoteColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Lost Quotes
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Review past quote requests that were expired, outbid, or declined.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchLostQuotes(true)}
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
                actions={(row) => <LostRowActions row={row} />}
                headerTabs={
                    <FilterTabs
                        quotes={quotes}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search lost quotes by ID, shipper, location..."
                compact={true}
                hideViewToggle={true}
                isLoading={isLoading}
                skeletonCount={filteredQuotes.length > 0 ? filteredQuotes.length : 3}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Lost Quotes Recorded"
                        description={activeTab === 'All'
                            ? "You do not have any lost or expired quote requests."
                            : `No lost quotes currently match the '${activeTab}' filter.`
                        }
                        actionLabel="View Available Requests"
                        onAction={() => navigate('/supplier/quotes/requests')}
                    />
                }
            />
        </div>
    );
}
