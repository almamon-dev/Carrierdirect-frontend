export interface WithdrawalItem {
    id: string;
    date: string;
    reference: string;
    amount: string;
    fee: string;
    netAmount: string;
    method: string;
    status: 'Completed' | 'Processing' | 'Failed';
}

export type StripeRedirectTarget = "banner" | "card_stat" | null;
