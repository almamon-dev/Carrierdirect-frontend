import React, { useState } from 'react';
import { 
  CreditCard, FileText, CheckCircle2, Download, Plus, Receipt, Clock, 
  ArrowUpRight, ShieldCheck, Zap, Sparkles, Check, Building2, AlertCircle, RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Switch from '@/components/ui/switch';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [autoRenew, setAutoRenew] = useState(true);

  // Billing history dataset
  const history = [
    { id: 'INV-2026-004', date: 'Jul 01, 2026', description: 'Professional Carrier Plan (Annual)', amount: '€588.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-003', date: 'Jun 01, 2026', description: 'Additional Fleet Capacity Add-on (5 Trailers)', amount: '€45.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-002', date: 'May 01, 2025', description: 'Professional Carrier Plan (Annual)', amount: '€588.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-001', date: 'Apr 10, 2025', description: 'Carrier Verification & Onboarding Setup', amount: '€149.00', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  const columns = [
    { 
      id: 'id', 
      label: 'Invoice', 
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Receipt className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-900">{row.id}</span>
        </div>
      ) 
    },
    { id: 'date', label: 'Date', render: (row: any) => <span className="text-xs text-slate-600 font-medium">{row.date}</span> },
    { id: 'description', label: 'Description', render: (row: any) => <span className="text-xs text-slate-700 font-medium">{row.description}</span> },
    { id: 'amount', label: 'Amount', render: (row: any) => <span className="text-xs font-bold text-slate-900">{row.amount}</span> },
    { id: 'method', label: 'Payment Method', render: (row: any) => <span className="text-[11px] text-slate-500 font-normal">{row.method}</span> },
    { 
      id: 'status', 
      label: 'Status', 
      render: (row: any) => (
        <Badge className={`text-[10px] font-semibold border ${
          row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {row.status}
        </Badge>
      )
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      render: (row: any) => (
        <button 
          onClick={() => alert(`Downloading Invoice ${row.id}`)}
          className="text-xs text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" /> PDF
        </button>
      )
    },
  ];

  // Available Subscription Plans
  const plans = [
    {
      id: 'starter',
      name: 'Starter Carrier',
      priceMonthly: '€29',
      priceYearly: '€24',
      description: 'Ideal for independent owner-operators with up to 3 trailers.',
      quotesLimit: '50 Quotes / mo',
      fleetLimit: '3 Trailers Max',
      usersLimit: '1 Dispatcher',
      features: ['Basic RFQ Alerts', 'SEPA & Card Payouts', 'Standard Support'],
      isCurrent: false,
    },
    {
      id: 'professional',
      name: 'Professional Fleet',
      priceMonthly: '€59',
      priceYearly: '€49',
      description: 'Best for growing transport companies managing active regional lanes.',
      quotesLimit: '250 Quotes / mo',
      fleetLimit: '15 Trailers Max',
      usersLimit: '5 Dispatchers',
      features: ['Instant Auto-Quoting', 'Priority RFQ Matching', 'Stripe Express Payouts', 'ADR Hazardous Freight'],
      isCurrent: true,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Logistics',
      priceMonthly: '€149',
      priceYearly: '€129',
      description: 'For large freight fleets requiring custom API integrations & unlimited quotes.',
      quotesLimit: 'Unlimited Quotes',
      fleetLimit: 'Unlimited Fleet',
      usersLimit: 'Unlimited Users',
      features: ['Dedicated Account Manager', 'TMS API Integration', '24/7 Priority Hotline', 'Custom SLA Guarantee'],
      isCurrent: false,
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-5 font-sans antialiased pb-20 min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Subscription & Billing Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor active plan quotas, billing cycles, payment methods, and invoice receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Account Verified & Active
          </Badge>
        </div>
      </div>

      {/* Overview Cards: Current Plan + Quota Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Active Plan Overview Card */}
        <Card className="shadow-2xs border-slate-200 lg:col-span-1 flex flex-col justify-between">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-4 h-4 text-[#ff4a1f]" />
              Active Subscription
            </CardTitle>
            <Badge className="bg-[#ff4a1f]/10 text-[#ff4a1f] border border-[#ff4a1f]/30 text-[10px] font-bold uppercase">
              Current Plan
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-slate-900">Professional Fleet</h3>
                <span className="text-xl font-extrabold text-[#ff4a1f]">€49<span className="text-xs text-slate-500 font-normal">/mo</span></span>
              </div>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1">
                Billed annually (€588/yr). Auto-renews on <span className="font-semibold text-slate-800">Jul 01, 2027</span>.
              </p>
            </div>

            {/* Auto Renew Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">Auto-Renewal</span>
                <p className="text-[10.5px] text-slate-500 font-normal">Keep subscription active automatically</p>
              </div>
              <Switch defaultChecked={autoRenew} onChange={() => setAutoRenew(!autoRenew)} />
            </div>
          </CardContent>
        </Card>

        {/* Live Quota Usage Trackers */}
        <Card className="shadow-2xs border-slate-200 lg:col-span-2">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Zap className="w-4 h-4 text-[#ff4a1f]" />
              Monthly Quotas & Usage Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Usage Metric 1: Quotes */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">RFQ Quotes Sent</span>
                <span className="font-bold text-[#ff4a1f]">142 / 250</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#ff4a1f] h-full rounded-full transition-all" style={{ width: '56.8%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">56% of monthly quota used.</p>
            </div>

            {/* Usage Metric 2: Trailers */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Fleet Vehicles</span>
                <span className="font-bold text-slate-800">12 / 15</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '80%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">3 vehicle slots available.</p>
            </div>

            {/* Usage Metric 3: Users */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Dispatcher Seats</span>
                <span className="font-bold text-slate-800">3 / 5</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: '60%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">2 team seats remaining.</p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Subscription Plans Selection Section */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#ff4a1f]" />
              Compare & Change Subscription Plan
            </CardTitle>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Switch plans or upgrade at any time with prorated billing.</p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly Billed
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Yearly Billed</span>
              <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1">Save 20%</Badge>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all relative ${
                  plan.isCurrent 
                    ? 'bg-orange-50/40 border-[#ff4a1f] ring-2 ring-[#ff4a1f]/20 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.popular && !plan.isCurrent && (
                  <Badge className="absolute -top-2.5 right-4 bg-[#ff4a1f] text-white text-[9.5px] font-bold uppercase tracking-wider">
                    Most Popular
                  </Badge>
                )}
                {plan.isCurrent && (
                  <Badge className="absolute -top-2.5 right-4 bg-[#ff4a1f] text-white text-[9.5px] font-bold uppercase tracking-wider">
                    Current Active Plan
                  </Badge>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-normal">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#ff4a1f]" />
                      <span>{plan.quotesLimit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#ff4a1f]" />
                      <span>{plan.fleetLimit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#ff4a1f]" />
                      <span>{plan.usersLimit}</span>
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-normal">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {plan.isCurrent ? (
                    <Button
                      disabled
                      className="w-full h-8.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                    >
                      Active Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => alert(`Switching to ${plan.name}`)}
                      className="w-full h-8.5 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e63d15] text-white shadow-2xs cursor-pointer"
                    >
                      Choose Plan
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method & Billing Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Registered Payment Method */}
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <CreditCard className="w-4 h-4 text-[#ff4a1f]" />
              Primary Payment Method
            </CardTitle>
            <Button variant="outline" className="h-7 text-xs px-2.5 cursor-pointer">
              + Add Card
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  VISA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Visa ending in 4242</h4>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[9.5px] font-bold border border-emerald-200">
                      Default
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">Expires 12 / 2028</p>
                </div>
              </div>

              <button 
                onClick={() => alert('Update Payment Method')}
                className="text-xs text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
              >
                Edit
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address & VAT Details */}
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Building2 className="w-4 h-4 text-[#ff4a1f]" />
              Invoicing & Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Billed Business Name:</span>
              <span className="font-bold text-slate-800">Prime Logistics & Freight GmbH</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">EU Tax / VAT ID:</span>
              <span className="font-bold text-slate-800">DE309281923</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Invoice Email:</span>
              <span className="font-bold text-slate-800">billing@primemovers.eu</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Invoice Receipts Table */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Receipt className="w-4 h-4 text-[#ff4a1f]" />
            Billing History & Downloadable Receipts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={history} hideViewToggle={true} />
        </CardContent>
      </Card>

    </div>
  );
}
