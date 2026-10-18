import { WithdrawalItem } from '../types/withdrawal.types';

export const parseMoneyNumber = (val: any): number => {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

const statusMap: Record<string, 'Completed' | 'Processing' | 'Failed'> = {
    completed: 'Completed', approved: 'Completed', paid: 'Completed',
    pending: 'Processing', processing: 'Processing',
    rejected: 'Failed', failed: 'Failed', cancelled: 'Failed',
};

export function mapWithdrawalItems(rawWithdrawals: any[]): WithdrawalItem[] {
    return rawWithdrawals.map((w: any) => {
        const amountNum = parseMoneyNumber(w.amount);
        const feeNum = parseMoneyNumber(w.fee ?? (amountNum * 0.10));
        const netNum = parseMoneyNumber(w.net_amount ?? Math.max(0, amountNum - feeNum));
        const rawStatus = String(w.status || 'pending').toLowerCase();

        return {
            id: w.request_number || `WD-${String(w.id).padStart(5, '0')}`,
            date: w.created_at ? new Date(w.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (w.date || '—'),
            reference: w.reference || w.payment_method || 'Automatic Payout',
            amount: `€${amountNum.toFixed(2)}`,
            fee: `€${feeNum.toFixed(2)} (10%)`,
            netAmount: `€${netNum.toFixed(2)}`,
            method: w.account_details || (w.payment_details ? `Stripe (${w.payment_details.substring(0, 18)})` : (w.payment_method || 'Stripe Payout')),
            status: statusMap[rawStatus] || 'Processing',
        };
    });
}
