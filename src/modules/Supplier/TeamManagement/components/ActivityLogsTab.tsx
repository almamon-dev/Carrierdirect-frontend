import React, { useMemo } from 'react';
import { Activity, RotateCcw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { useActivityLogsData } from '../hooks/useActivityLogsData';
import { ActivityLogItem, ActivityLogActions } from './ActivityLogActions';
import { getActivityLogColumns } from './activityLogColumns';
import { ActivityLogGridCard } from './ActivityLogGridCard';
import { ActivityLogDetailModal } from './ActivityLogDetailModal';

export type { ActivityLogItem };

interface ActivityLogsTabProps {
    headerTabs?: React.ReactNode;
}

export default function ActivityLogsTab({ headerTabs }: ActivityLogsTabProps = {}) {
    const {
        filteredLogs,
        isLoading,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedActionFilter,
        setSelectedActionFilter,
        selectedUserFilter,
        setSelectedUserFilter,
        selectedLog,
        setSelectedLog,
        userOptions,
        isFiltered,
        handleResetFilters,
    } = useActivityLogsData();

    const columns = useMemo(() => getActivityLogColumns({ onSelectLog: setSelectedLog }), [setSelectedLog]);

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Module Category
                    </label>
                    <Select 
                        size="sm"
                        value={selectedCategoryFilter} 
                        onChange={(val: any) => setSelectedCategoryFilter(val?.target?.value ?? val?.value ?? val)} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Modules' },
                            { id: 'team', name: 'Team & Staff' },
                            { id: 'roles', name: 'Roles & Permissions' },
                            { id: 'security', name: 'Security & Auth' },
                            { id: 'dispatch', name: 'Dispatch & Orders' },
                            { id: 'settings', name: 'Settings & Config' },
                            { id: 'finance', name: 'Finance & Billing' },
                        ]} 
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Action Type
                    </label>
                    <Select 
                        size="sm"
                        value={selectedActionFilter} 
                        onChange={(val: any) => setSelectedActionFilter(val?.target?.value ?? val?.value ?? val)} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Action Types' },
                            { id: 'create', name: 'Created / Added' },
                            { id: 'update', name: 'Updated / Modified' },
                            { id: 'delete', name: 'Deleted / Removed' },
                            { id: 'invite', name: 'Invitations & Invites' },
                            { id: 'security', name: 'Security & Auth' },
                            { id: 'status', name: 'Status & Dispatch' },
                        ]} 
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Staff Member
                    </label>
                    <Select 
                        size="sm"
                        value={selectedUserFilter} 
                        onChange={(e: any) => setSelectedUserFilter(e?.target?.value ?? e?.value ?? e)} 
                        showSearch={true} 
                        placeholder="Search staff member..."
                        options={userOptions} 
                    />
                </div>

                {isFiltered && (
                    <div className="sm:col-span-3 pt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-[30px] text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw size={12} />
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable 
                columns={columns} 
                data={filteredLogs} 
                compact={true}
                searchPlaceholder="Search logs by staff, action, log ID, target..."
                hideViewToggle={false}
                renderGridCard={(log) => (
                    <ActivityLogGridCard
                        key={log.id}
                        log={log}
                        onViewDetails={(r) => setSelectedLog(r)}
                    />
                )}
                tableLayout="fixed"
                tableClassName="min-w-[1080px]"
                actions={(row: ActivityLogItem) => (
                    <ActivityLogActions row={row} onViewDetails={(r) => setSelectedLog(r)} />
                )}
                actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3"
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState 
                        icon={Activity}
                        title="No Activity Logs Found" 
                        description="No team activity or audit logs match your selected filter criteria." 
                    />
                }
            />

            <ActivityLogDetailModal
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
            />
        </div>
    );
}
