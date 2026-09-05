import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { getCustomerColumns } from '../CreateRequest/components/columns';
import { FilterTabs } from '../CreateRequest/components/FilterTabs';
import { TableFilterContent } from '../CreateRequest/components/TableFilterContent';
import { HeaderActions } from '../CreateRequest/components/HeaderActions';
import { RowActions } from '../CreateRequest/components/RowActions';
import { useCustomerQuoteRequests } from '../CreateRequest/hooks/useCustomerQuoteRequests';
import { useRequestListDelete } from './hooks/useRequestListDelete';
import { useRequestListImportWizard } from './hooks/useRequestListImportWizard';
import { useFilteredRequestList } from './hooks/useFilteredRequestList';
import { useRequestListFilters } from './hooks/useRequestListFilters';
import { RequestListModals } from './components/RequestListModals';

export default function RequestList() {
    const navigate = useNavigate();
    const filters = useRequestListFilters();
    const { requestData, setRequestData, isLoading, isRepeating, fetchQuoteRequests, handleRepeatRequest } = useCustomerQuoteRequests();
    const deleteState = useRequestListDelete(setRequestData);
    const wizard = useRequestListImportWizard(fetchQuoteRequests);

    const filteredData = useFilteredRequestList({
        requestData,
        activeFilterTab: filters.activeFilterTab,
        priorityFilter: filters.priorityFilter,
        statusFilter: filters.statusFilter,
        quotesFilter: filters.quotesFilter,
        startDate: filters.startDate,
        endDate: filters.endDate,
    });

    const columns = useMemo(() => getCustomerColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-6 min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
                        Quote Requests
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage, track, and create freight quote requests for carrier bidding.
                    </p>
                </div>
                <HeaderActions
                    isLoading={isLoading}
                    onRefresh={() => fetchQuoteRequests(true)}
                    onUploadCsv={() => wizard.openImportWizard('csv')}
                    onUploadPdfZip={() => wizard.openImportWizard('pdf')}
                    onCreateNew={() => navigate('/customer/quotes/create/new')}
                />
            </div>

            <DataTable
                data={filteredData}
                columns={columns}
                actions={(row) => (
                    <RowActions
                        row={row}
                        isRepeating={isRepeating === (row.rawId || row.id)}
                        onRepeatRequest={handleRepeatRequest}
                        onDeleteRequest={deleteState.handleDeleteRequestClick}
                    />
                )}
                actionsColumnClassName="w-[140px] min-w-[140px] text-right pr-3"
                headerTabs={<FilterTabs requestData={requestData} activeTab={filters.activeFilterTab} onSelectTab={filters.setActiveFilterTab} />}
                filterContent={
                    <TableFilterContent
                        priorityFilter={filters.priorityFilter}
                        setPriorityFilter={filters.setPriorityFilter}
                        statusFilter={filters.statusFilter}
                        setStatusFilter={filters.setStatusFilter}
                        quotesFilter={filters.quotesFilter}
                        setQuotesFilter={filters.setQuotesFilter}
                        startDate={filters.startDate}
                        setStartDate={filters.setStartDate}
                        endDate={filters.endDate}
                        setEndDate={filters.setEndDate}
                        onResetFilters={filters.handleResetFilters}
                    />
                }
                searchPlaceholder="Search requests by ID, title, origin, destination..."
                compact={true}
                isLoading={isLoading}
                onRowClick={(row) => navigate(buildSecureQuoteUrl('view', row.rawId || row.id))}
                tableClassName="w-full min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Requests Found"
                        description={filters.activeFilterTab === 'All' ? 'You haven’t created any quote requests yet.' : `No quote requests match '${filters.activeFilterTab}'.`}
                        actionLabel="Create Quote Request"
                        onAction={() => navigate('/customer/quotes/create/new')}
                    />
                }
            />

            <RequestListModals wizard={wizard} deleteState={deleteState} />
        </div>
    );
}
