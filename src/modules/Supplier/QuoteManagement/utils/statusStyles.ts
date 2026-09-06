/**
 * Dynamic Status Badge Styling for Supplier Quotes & Negotiations
 * Maps diverse statuses to unique, accessible badge color tokens.
 */

export const getStatusBadgeClass = (status?: string): string => {
    const s = (status || '').toLowerCase().trim();

    if (s === 'new') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    }
    if (s === 'viewed') {
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60';
    }
    if (s === 'quoted' || s.includes('submit')) {
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
    }
    if (s === 'counter received' || s === 'counter offer received') {
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    }
    if (s === 'counter offer sent' || s === 'negotiation' || s.includes('counter')) {
        return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60';
    }
    if (s === 'under review' || s === 'pending') {
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    }
    if (s === 'accepted' || s === 'won') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    }
    if (s === 'expired') {
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    }
    if (s === 'lost' || s === 'declined' || s === 'cancelled' || s === 'rejected') {
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
};
