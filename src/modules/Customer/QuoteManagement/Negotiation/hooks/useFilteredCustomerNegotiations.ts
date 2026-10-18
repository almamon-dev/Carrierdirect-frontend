import { useMemo } from 'react';
import { CustomerNegotiationItem, NegotiationFilterTab } from '../types';
import {
    isNegotiationActive,
    isNegotiationAgreed,
    isNegotiationClosed,
    isWaitingForYou,
    isWaitingForSupplier,
} from '../components/NegotiationFilterTabs';

interface UseFilteredCustomerNegotiationsProps {
    negotiations: CustomerNegotiationItem[];
    activeTab: NegotiationFilterTab;
    priorityFilter: string;
    statusFilter: string;
    vehicleFilter: string;
    startDate: string;
    endDate: string;
}

export function useFilteredCustomerNegotiations({
    negotiations,
    activeTab,
    priorityFilter,
    statusFilter,
    vehicleFilter,
    startDate,
    endDate,
}: UseFilteredCustomerNegotiationsProps) {
    return useMemo(() => {
        return (negotiations || []).filter((item) => {
            if (!item) return false;

            if (activeTab === 'active' && !isNegotiationActive(item)) return false;
            if (activeTab === 'waiting_you' && (!isNegotiationActive(item) || !isWaitingForYou(item))) return false;
            if (activeTab === 'waiting_supplier' && (!isNegotiationActive(item) || !isWaitingForSupplier(item))) return false;
            if (activeTab === 'agreed' && !isNegotiationAgreed(item)) return false;
            if (activeTab === 'closed' && !isNegotiationClosed(item)) return false;

            if (priorityFilter !== 'all') {
                const normPriority = (item.priority || '').toLowerCase();
                if (!normPriority.includes(priorityFilter.toLowerCase())) return false;
            }

            if (statusFilter !== 'all') {
                const normStatus = (item.status || item.statusRaw || '').toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                const normVehicle = (item.vehicleType || '').toLowerCase();
                if (!normVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            if (startDate || endDate) {
                const dateVal = item.createdAt || item.date || item.pickupDate;
                if (dateVal) {
                    const time = new Date(dateVal).getTime();
                    if (!isNaN(time)) {
                        if (startDate && time < new Date(startDate).setHours(0, 0, 0, 0)) return false;
                        if (endDate && time > new Date(endDate).setHours(23, 59, 59, 999)) return false;
                    }
                }
            }

            return true;
        });
    }, [negotiations, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);
}
