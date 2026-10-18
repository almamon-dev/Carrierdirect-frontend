import { TimeFilter } from '../types/dashboard.types';

export function getEarningsChartData(
    earningsDataFromApi: any[] | null,
    earningsFilter: TimeFilter,
    currentTotal: number
) {
    if (earningsDataFromApi && Array.isArray(earningsDataFromApi) && earningsDataFromApi.length > 0) {
        return earningsDataFromApi;
    }

    if (earningsFilter === '3_months') {
        return [
            { name: 'Month 1', earnings: 0 },
            { name: 'Month 2', earnings: 0 },
            { name: 'Month 3', earnings: currentTotal },
        ];
    }
    if (earningsFilter === 'this_year') {
        return [
            { name: 'Jan', earnings: 0 },
            { name: 'Feb', earnings: 0 },
            { name: 'Mar', earnings: 0 },
            { name: 'Apr', earnings: 0 },
            { name: 'May', earnings: currentTotal },
        ];
    }
    return [
        { name: 'Day 01', earnings: 0 },
        { name: 'Day 03', earnings: 0 },
        { name: 'Day 05', earnings: 0 },
        { name: 'Day 08', earnings: 0 },
        { name: 'Day 10', earnings: 0 },
        { name: 'Day 12', earnings: 0 },
        { name: 'Day 15', earnings: 0 },
        { name: 'Day 18', earnings: 0 },
        { name: 'Day 20', earnings: 0 },
        { name: 'Day 23', earnings: 0 },
        { name: 'Day 26', earnings: 0 },
        { name: 'Day 28', earnings: 0 },
        { name: 'Day 30', earnings: currentTotal },
    ];
}

export function getOrderQuoteChartData(
    conversionDataFromApi: any[] | null,
    quoteOverviewFilter: TimeFilter,
    requestsCount: number,
    wonCount: number
) {
    if (conversionDataFromApi && Array.isArray(conversionDataFromApi) && conversionDataFromApi.length > 0) {
        return conversionDataFromApi;
    }

    const submittedCount = 0;

    if (quoteOverviewFilter === '3_months') {
        return [
            { name: 'Month 1', requests: 0, submitted: 0, won: 0 },
            { name: 'Month 2', requests: 0, submitted: 0, won: 0 },
            { name: 'Month 3', requests: requestsCount, submitted: submittedCount, won: wonCount },
        ];
    }
    if (quoteOverviewFilter === 'this_year') {
        return [
            { name: 'Q1', requests: 0, submitted: 0, won: 0 },
            { name: 'Q2', requests: requestsCount, submitted: submittedCount, won: wonCount },
        ];
    }
    return [
        { name: 'Week 1', requests: 0, submitted: 0, won: 0 },
        { name: 'Week 2', requests: 0, submitted: 0, won: 0 },
        { name: 'Week 3', requests: 0, submitted: 0, won: 0 },
        { name: 'Week 4', requests: requestsCount, submitted: submittedCount, won: wonCount },
    ];
}
