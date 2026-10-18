export interface Plan {
  id: string | number;
  name: string;
  price: string | number;
  billing_period?: string;
  description?: string;
  is_popular?: boolean;
  features?: string[];
  buttonText?: string;
}

export const defaultSupplierPlans: Plan[] = [
  {
    id: 1,
    name: "Independent Driver",
    price: "0",
    billing_period: "/mo",
    description: "Ideal for single Luton, Sprinter, or Courier vehicle owners.",
    features: ["Direct Load Bidding", "Automated POD Upload", "Standard Support", "Mobile App Access"],
    buttonText: "Register Free",
  },
  {
    id: 2,
    name: "Fleet Operator Pro",
    price: "49",
    billing_period: "/mo",
    is_popular: true,
    description: "Designed for transport businesses with multiple HGV/Van fleets.",
    features: ["Unlimited Carrier Quotes", "Priority Dispatch System", "Multi-Driver Account Management", "Dedicated Account Manager"],
    buttonText: "Start Fleet Pro",
  },
  {
    id: 3,
    name: "Enterprise Logistics",
    price: "149",
    billing_period: "/mo",
    description: "Custom SaaS integration for large haulage and logistics providers.",
    features: ["White-Label Portal", "API & Webhook Integrations", "Custom SLA Guarantees", "24/7 Dedicated Support"],
    buttonText: "Contact Enterprise",
  },
];

export const defaultShipperPlans: Plan[] = [
  {
    id: 101,
    name: "Pay As You Move",
    price: "0",
    billing_period: "/job",
    description: "For households & individuals needing one-off removals or delivery.",
    features: ["Instant Quote Comparison", "Verified Drivers Only", "Escrow Secured Payment", "Real-Time Tracking"],
    buttonText: "Book Move Now",
  },
  {
    id: 102,
    name: "Business Starter",
    price: "29",
    billing_period: "/mo",
    is_popular: true,
    description: "For regular commercial shippers, retailers, and local businesses.",
    features: ["Monthly Consolidated Invoicing", "Priority Driver Allocation", "Dedicated Support Specialist", "Volume Rate Discounts"],
    buttonText: "Open Trade Account",
  },
  {
    id: 103,
    name: "Corporate Freight",
    price: "99",
    billing_period: "/mo",
    description: "Full supply chain management for enterprise distributors.",
    features: ["Custom Rate Card Setup", "Dedicated Freight Logistics Desk", "Guaranteed Capacity SLA", "ERP & Order API Sync"],
    buttonText: "Talk to Logistics",
  },
];
