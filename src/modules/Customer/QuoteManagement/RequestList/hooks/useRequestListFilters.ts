import { useState } from 'react';
import { FilterTabId } from '../../CreateRequest/types';

export function useRequestListFilters() {
    const [activeFilterTab, setActiveFilterTab] = useState<FilterTabId>('All');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [quotesFilter, setQuotesFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setPriorityFilter('all');
        setStatusFilter('all');
        setQuotesFilter('all');
        setStartDate('');
        setEndDate('');
    };

    return {
        activeFilterTab,
        setActiveFilterTab,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        quotesFilter,
        setQuotesFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
    };
}
