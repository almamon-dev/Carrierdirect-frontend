export interface TransactionRow {
    id: number | string;
    transaction_id?: string;
    date: string;
    date_time?: string;
    type: string;
    raw_type?: string;
    description: string;
    amount: string;
    raw_amount?: number;
    currency?: string;
    status: string;
    raw_status?: string;
    reference?: string;
    raw_reference?: string;
}

export interface TransactionFilterTab {
    id: string;
    label: string;
    count: number;
}
