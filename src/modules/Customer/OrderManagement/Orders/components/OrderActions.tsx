import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Download, Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import { OrderRowActions } from './OrderRowActions';
import { OrderActionsMenu } from './OrderActionsMenu';

export { OrderRowActions, OrderActionsMenu };

export interface OrderHeaderActionsProps {
    isRefreshing: boolean;
    onRefresh: () => void;
    onExportCSV: () => void;
    onCreateRequest?: () => void;
}

export const OrderHeaderActions: React.FC<OrderHeaderActionsProps> = ({
    isRefreshing,
    onRefresh,
    onExportCSV,
    onCreateRequest,
}) => {
    const navigate = useNavigate();

    const handleCreate = onCreateRequest || (() => navigate('/customer/quotes/create/new'));

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <RefreshCw
                    size={13}
                    className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'}
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onExportCSV}
                className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <Download size={13} className="text-slate-500" />
                <span>Export CSV</span>
            </Button>

            <Button
                variant="primary"
                size="sm"
                onClick={handleCreate}
                className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
                <Plus size={14} />
                <span>Create New Request</span>
            </Button>
        </div>
    );
};

export const OrderActions = {
    Header: OrderHeaderActions,
    Row: OrderRowActions,
    Menu: OrderActionsMenu,
};

export default OrderActions;
