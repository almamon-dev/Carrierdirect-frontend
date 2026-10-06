export type TabKey = "overview" | "packages" | "history";

export interface SubscriptionPlan {
  id: number | string;
  name: string;
  subtitle?: string;
  badge?: string;
  is_popular?: boolean;
  price: number;
  price_formatted?: string;
  billing_period: "monthly" | "yearly" | "lifetime" | string;
  features: string[];
  cta_text?: string;
}

export interface UserSubscriptionData {
  id?: number | string;
  status?: string;
  is_active?: boolean;
  is_trial?: boolean;
  auto_renew?: boolean;
  on_grace_period?: boolean;
  days_remaining?: number;
  started_at?: string;
  expires_at?: string;
  plan?: SubscriptionPlan;
  quota?: {
    allowed?: boolean;
    is_trial?: boolean;
    quotes_used?: number;
    limit?: number;
    quotes_remaining?: number;
    message?: string;
  };
}

export interface SubscriptionBillingHistoryItem {
  id: number | string;
  raw_id?: number | string;
  invoice_number: string;
  plan_name: string;
  subscription_plan?: string;
  billing_cycle?: string;
  billing_period?: string;
  amount: number;
  amount_formatted: string;
  total_amount?: number;
  total_amount_formatted?: string;
  status: string;
  raw_status?: string;
  status_badge?: string;
  badge_color?: string;
  payment_method?: string;
  payment_method_label?: string;
  method?: string;
  card_brand?: string;
  card_last4?: string;
  is_trial?: boolean;
  billing_date?: string;
  payment_date?: string;
  due_date?: string;
  issue_date?: string;
  created_at?: string;
  download_url?: string;
  receipt_url?: string;
  rawInvoice?: any;
}

export interface SavedCardItem {
  id: string;
  cardType: string;
  last4: string;
  brand: "MC" | "VISA" | "AMEX" | string;
  isDefault: boolean;
}
