export interface EarningItem {
    id: string;
    raw_id?: number | string;
    order_id?: number | string;
    order_number?: string;
    customer: string;
    customer_name?: string;
    pickup_address?: string;
    delivery_address?: string;
    pickup?: string;
    delivery?: string;
    date: string;
    gross: string;
    fee: string;
    net: string;
    status: "Cleared" | "Pending Clearance";
    raw_status?: string;
}
