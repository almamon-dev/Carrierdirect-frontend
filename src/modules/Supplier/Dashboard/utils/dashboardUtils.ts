export function formatCurrency(num: number | string | undefined): string {
    if (num === undefined || num === null || num === '') return '€0';
    if (typeof num === 'string') {
        if (num.toLowerCase().includes('negotiable')) return 'Negotiable';
        if (num.includes('€')) return num;
    }
    const cleanNum = typeof num === 'string' ? num.replace(/[^0-9.-]+/g, '') : num;
    const val = Number(cleanNum) || 0;
    return `€${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatQuoteBudget(rawBudget: any): string {
    if (rawBudget === undefined || rawBudget === null || rawBudget === '') return 'Negotiable';
    const str = String(rawBudget).trim();
    if (str.toLowerCase().includes('negotiable')) return 'Negotiable';
    if (str === '-' || str === '—' || str === '0' || str === '0.00' || str === '€0' || str === '€0.00' || str === '€ 0') {
        return 'Negotiable';
    }
    const cleanNum = str.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleanNum);
    if (isNaN(num) || num <= 0) return 'Negotiable';
    return `€${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function timeAgo(dateString?: string): string {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs)) return '10 min';
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHr < 24) return `${diffHr} hrs`;
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
