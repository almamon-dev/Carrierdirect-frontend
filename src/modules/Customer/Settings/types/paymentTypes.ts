export interface CardItem {
  id: string | number;
  type: string;
  last4: string;
  expiry: string;
  is_primary?: boolean;
  isPrimary?: boolean;
  holder_name?: string;
}

export interface PayLaterInfo {
  status: string;
  is_active: boolean;
  approved_limit: number;
  approved_limit_formatted: string;
  monthly_limit: number;
  weekly_limit: number;
  daily_limit: number;
  currently_used: number;
  currently_used_formatted: string;
  available_balance: number;
  available_balance_formatted: string;
  requested_at?: string | null;
  rejection_reason?: string | null;
  has_linked_card?: boolean;
}

export const INITIAL_PAY_LATER: PayLaterInfo = {
  status: "inactive",
  is_active: false,
  approved_limit: 0,
  approved_limit_formatted: "€ 0.00",
  monthly_limit: 40000,
  weekly_limit: 15000,
  daily_limit: 8000,
  currently_used: 0,
  currently_used_formatted: "€ 0.00",
  available_balance: 0,
  available_balance_formatted: "€ 0.00",
};
