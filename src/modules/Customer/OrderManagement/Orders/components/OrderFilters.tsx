import React from 'react';
import { OrderFilterTabs } from './OrderFilterTabs';
import { TableFilterContent } from './TableFilterContent';
import { CustomerOrderItem, OrderFilterTab, OrderStats } from '../types/order.types';

export { OrderFilterTabs, TableFilterContent };

export interface OrderFiltersProps {
    orders: CustomerOrderItem[];
    stats?: OrderStats | null;
    activeTab: OrderFilterTab;
    onSelectTab: (tab: OrderFilterTab) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    paymentFilter: string;
    setPaymentFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
    orders,
    stats,
    activeTab,
    onSelectTab,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    return (
        <div className="space-y-3">
            <OrderFilterTabs
                orders={orders}
                stats={stats}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
            />
            <TableFilterContent
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onResetFilters={onResetFilters}
            />
        </div>
    );
};

export default OrderFilters;
