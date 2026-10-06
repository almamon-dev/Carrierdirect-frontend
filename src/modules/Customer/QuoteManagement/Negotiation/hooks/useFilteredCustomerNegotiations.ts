import { useMemo } from 'react';
import { CustomerNegotiationItem } from '../types';
import {
    NegotiationFilterTab,
    isNegotiationAccepted,
    isNegotiationBooked,
    isNegotiationClosed,
    isNegotiationCounter,
    isNegotiationOpen,
} from '../components/NegotiationFilterTabs';

interface UseFilteredNegotiationsParams {
    negotiations: CustomerNegotiationItem[];
    activeTab: NegotiationFilterTab;
    priorityFilter: string;
    statusFilter: string;
    vehicleFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredCustomerNegotiations = ({
    negotiations,
    activeTab,
    priorityFilter,
    statusFilter,
    vehicleFilter,
    startDate,
    endDate,
}: UseFilteredNegotiationsParams) => {
    return useMemo(() => {
        const list = Array.isArray(negotiations) ? negotiations : [];
        return list.filter((item) => {
            if (!item) return false;

            if (activeTab === 'open' && !isNegotiationOpen(item)) return false;
            if (activeTab === 'counter' && !isNegotiationCounter(item)) return false;
            if (activeTab === 'accepted' && !isNegotiationAccepted(item)) return false;
            if (activeTab === 'booked' && !isNegotiationBooked(item)) return false;
            if (activeTab === 'closed' && !isNegotiationClosed(item)) return false;

            if (priorityFilter !== 'all' && item.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }
            if (statusFilter !== 'all') {
                const normStatus = (item.status || item.statusRaw || '').toLowerCase();
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === 'open' && !isNegotiationOpen(item)) return false;
                else if (filterVal === 'counter' && !isNegotiationCounter(item)) return false;
                else if (filterVal === 'accepted' && !isNegotiationAccepted(item)) return false;
                else if (filterVal === 'booked' && !isNegotiationBooked(item)) return false;
                else if (filterVal === 'closed' && !isNegotiationClosed(item)) return false;
                else if (!normStatus.includes(filterVal)) return false;
            }
            if (vehicleFilter !== 'all') {
                const normVehicle = (item.vehicleType || '').toLowerCase().replace(/[\s_-]+/g, '');
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, '');
                if (!normVehicle.includes(targetVehicle)) return false;
            }

            if (startDate || endDate) {
                const rowDateStr = (item as any).created_at || item.requestDate || item.pickupDate || item.lastUpdated;
                if (rowDateStr) {
                    const rowDate = new Date(rowDateStr);
                    if (!isNaN(rowDate.getTime())) {
                        if (startDate) {
                            const start = new Date(startDate);
                            start.setHours(0, 0, 0, 0);
                            if (rowDate < start) return false;
                        }
                        if (endDate) {
                            const end = new Date(endDate);
                            end.setHours(23, 59, 59, 999);
                            if (rowDate > end) return false;
                        }
                    }
                }
            }

            return true;
        });
    }, [negotiations, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);
};
