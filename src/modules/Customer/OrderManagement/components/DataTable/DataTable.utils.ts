/**
 * Table Utility Functions for Order Management
 */

export function filterBySearchTerm<T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    searchableFields: (keyof T | string)[]
): T[] {
    if (!searchTerm || !searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
        return searchableFields.some((field) => {
            const val = getNestedValue(item, String(field));
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(term);
        });
    });
}

export function filterByDateRange<T extends Record<string, any>>(
    items: T[],
    dateField: keyof T | string,
    startDate?: string,
    endDate?: string
): T[] {
    if (!startDate && !endDate) return items;

    const startMs = startDate ? new Date(startDate).getTime() : null;
    const endMs = endDate ? new Date(endDate).getTime() + 86400000 : null;

    return items.filter((item) => {
        const val = getNestedValue(item, String(dateField));
        if (!val) return false;
        const time = new Date(val).getTime();
        if (isNaN(time)) return false;

        if (startMs !== null && time < startMs) return false;
        if (endMs !== null && time > endMs) return false;
        return true;
    });
}

export function getNestedValue(obj: Record<string, any>, path: string): any {
    if (!obj || typeof obj !== 'object') return undefined;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function formatTableCurrency(amount: number | string | null | undefined): string {
    if (amount === null || amount === undefined || amount === '') return '-';
    const num = Number(amount);
    if (isNaN(num)) return String(amount);
    return `£${num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
