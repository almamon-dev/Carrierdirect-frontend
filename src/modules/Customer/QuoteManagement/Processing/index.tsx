import React, { useState, useMemo } from 'react';
import { RefreshCw, Plus, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { TableFilterContent } from '../Negotiation/components/TableFilterContent';
import { useProcessingRequests } from './hooks/useProcessingRequests';
import { useFilteredProcessingRequests } from './hooks/useFilteredProcessingRequests';
import { ProcessingFilterTabs } from './components/ProcessingFilterTabs';
import { getProcessingColumns } from './components/columns';
import { ProcessingRowActions } from './components/ProcessingRowActions';

export default function Processing() {
    const navigate = useNavigate();
    const { requests, isLoading, isRefreshing, stats, fetchProcessingRequests } = useProcessingRequests();

    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setPriorityFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredRequests = useFilteredProcessingRequests({
        requests,
        activeFilterTab,
        statusFilter,
        vehicleFilter,
        priorityFilter,
        startDate,
        endDate,
    });

    const columns = useMemo(() => getProcessingColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">Processing Quote Requests</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track shipments currently in carrier bidding, negotiate terms, or review quotes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchProcessingRequests(true)} disabled={isRefreshing} className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700">
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
                data={filteredRequests}
                columns={columns}
                actions={(row: any) => <ProcessingRowActions row={row} />}
                actionsColumnClassName="w-[145px] min-w-[145px] text-right pr-3"
                headerTabs={<ProcessingFilterTabs stats={stats} activeFilterTab={activeFilterTab} setActiveFilterTab={setActiveFilterTab} />}
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        vehicleFilter={vehicleFilter}
                        setVehicleFilter={setVehicleFilter}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onResetFilters={handleResetFilters}
                    />
                }
                searchPlaceholder="Search requests by ID, route, vehicle..."
                compact={true}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => navigate(buildSecureQuoteUrl(row.rawId || row.id, 'view'))}
                tableClassName="w-full min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Active Requests Found"
                        description={activeFilterTab === 'all' ? 'Create a shipping request to receive competitive carrier quotations.' : `No quote requests match '${activeFilterTab}'.`}
                        actionLabel="Create Quote Request"
                        onAction={() => navigate('/customer/quotes/create/new')}
                    />
                }
            />
        </div>
    );
}
