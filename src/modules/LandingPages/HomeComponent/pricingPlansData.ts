export interface PlanCycleDetails {
  id: string | number;
  price: string | number;
  billing_period: string;
  features?: string[];
  buttonText?: string;
}

export interface PlanTier {
  id: string | number;
  name: string;
  description: string;
  is_popular?: boolean;
  features: string[];
  buttonText?: string;
  isTrial?: boolean;
  order?: number;
  monthly: PlanCycleDetails;
  yearly: PlanCycleDetails;
}

export const defaultSupplierPlans: PlanTier[] = [
  {
    id: 1,
    name: "7-Day Free Trial",
    description: "Test full platform features with free trial access.",
    is_popular: false,
    isTrial: true,
    order: 1,
    buttonText: "Start Free Trial",
    monthly: { id: 1, price: "0", billing_period: "/7 days" },
    yearly: { id: 1, price: "0", billing_period: "/7 days" },
    features: [
      "7-Day Free Trial (No Credit Card Required)",
      "Submit Quotes & Load Bidding",
      "Direct Shipper Live Chat & Negotiation",
      "Digital POD & Challan Upload",
      "Secure Escrow Payment Protection",
      "Instant Web & Email Lead Notifications",
    ],
  },
  {
    id: 2,
    name: "Professional Carrier",
    description: "Full carrier dispatch toolkit with unlimited quotes, fleet tracking, and priority leads.",
    is_popular: true,
    order: 2,
    buttonText: "Start Professional",
    monthly: { id: 2, price: "49", billing_period: "/mo" },
    yearly: { id: 3, price: "490", billing_period: "/year" },
    features: [
      "Includes all Trial features",
      "Unlimited Quote Submissions & Active Bidding",
      "Priority Real-time Lead Alerts & High-Value RFQs",
      "Fleet Management — Up to 10 Vehicles",
      "Team Management — Up to 5 Staff Accounts",
      "Verified Carrier Trust Badge",
      "Reduced Platform Commission Fee",
      "Automated Fast Stripe Connect Payouts",
      "Priority Fleet Support",
    ],
  },
  {
    id: 4,
    name: "Enterprise Fleet Operator",
    description: "Comprehensive enterprise logistics suite with dedicated account management and VIP dispatch.",
    is_popular: false,
    order: 3,
    buttonText: "Contact Enterprise",
    monthly: { id: 4, price: "129", billing_period: "/mo" },
    yearly: { id: 5, price: "1290", billing_period: "/year" },
    features: [
      "Includes all Professional Carrier features",
      "Unlimited Staff, Driver & Dispatcher Accounts",
      "Unlimited Fleet Vehicles & Capacity Specs",
      "Lowest / Minimal Platform Booking Fee",
      "Featured Carrier Top Placement in Searches",
      "Same-Day Instant Escrow Bank Payouts",
      "Dedicated Freight Lanes & Priority Backhaul",
      "24/7 Dedicated Logistics Account Manager",
    ],
  },
];

export const defaultShipperPlans: PlanTier[] = [
  {
    id: 6,
    name: "7-Day Free Trial",
    description: "Test full platform features with free trial access.",
    is_popular: false,
    isTrial: true,
    order: 1,
    buttonText: "Start Free Trial",
    monthly: { id: 6, price: "0", billing_period: "/7 days" },
    yearly: { id: 6, price: "0", billing_period: "/7 days" },
    features: [
      "7-Day Free Trial (No Credit Card Required)",
      "Up to 3 Quote Requests & RFQs",
      "Multi-Carrier Quote Comparison & Review",
      "Direct Carrier Negotiation & Live Chat",
      "Secure Stripe Escrow Payments & Card Checkout",
      "Real-time Order Tracking & Digital POD",
    ],
  },
  {
    id: 7,
    name: "Starter Shipper",
    description: "Essential freight quote comparison and direct carrier negotiation for shippers.",
    is_popular: false,
    order: 2,
    buttonText: "Choose Starter",
    monthly: { id: 7, price: "29", billing_period: "/mo" },
    yearly: { id: 8, price: "290", billing_period: "/year" },
    features: [
      "Unlimited Single Quote Requests & RFQs",
      "Multi-Carrier Quote Comparison & Price Breakdown",
      "Direct Carrier Negotiation & Live Chat",
      "Secure Escrow Payments & Card Checkout",
      "Digital POD Verification & Saved Address Book",
      "Automated VAT Invoicing & Receipts",
      "Standard Customer Support",
    ],
  },
  {
    id: 9,
    name: "Growth Logistics",
    description: "Advanced road freight logistics, AI-powered RFQ bulk import, and credit terms.",
    is_popular: true,
    order: 3,
    buttonText: "Choose Growth",
    monthly: { id: 9, price: "79", billing_period: "/mo" },
    yearly: { id: 10, price: "790", billing_period: "/year" },
    features: [
      "Includes all Starter Shipper features",
      "AI-Powered Bulk RFQ Import (PDF, Excel, CSV)",
      "Corporate Pay-Later Credit Line (Net 30/60 Days)",
      "Priority RFQ Broadcast to Top-Rated Carriers",
      "Unlimited Saved Locations & 1-Click Rebooking",
      "Shipment Spend & Freight Cost Analytics",
      "Priority Operations Support",
    ],
  },
  {
    id: 11,
    name: "Enterprise Freight Suite",
    description: "Comprehensive enterprise logistics suite with dedicated account management and VIP dispatch.",
    is_popular: false,
    order: 4,
    buttonText: "Contact Logistics",
    monthly: { id: 11, price: "199", billing_period: "/mo" },
    yearly: { id: 12, price: "1990", billing_period: "/year" },
    features: [
      "Includes all Growth Logistics features",
      "Custom Corporate Credit Terms (Net 90/120 Days)",
      "Multi-Department Roles & Procurement Approvals",
      "Specialized Freight Network (Hazmat ADR & Temp)",
      "Guaranteed Dedicated Vehicle Capacity",
      "Real-time Live GPS Fleet Tracking & Geofencing",
      "24/7 Dedicated Logistics Account Manager",
    ],
  },
];
