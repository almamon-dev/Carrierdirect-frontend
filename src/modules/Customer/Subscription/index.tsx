import React, { useState } from 'react';
import { 
  CreditCard, FileText, CheckCircle2, Download, Plus, Receipt, Clock, 
  ArrowUpRight, ShieldCheck, Zap, Sparkles, Check, Building2, Package, Euro
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Switch from '@/components/ui/switch';

export default function CustomerSubscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [autoRenew, setAutoRenew] = useState(true);

  // Billing history dataset for Customer
  const history = [
    { id: 'INV-CST-2026-004', date: 'Jul 01, 2026', description: 'Enterprise Shipper Subscription (Annual)', amount: '€1,188.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-CST-2026-003', date: 'Jun 15, 2026', description: 'Express Priority Freight Dispatch Fee', amount: '€250.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-CST-2026-002', date: 'May 01, 2025', description: 'Enterprise Shipper Subscription (Annual)', amount: '€1,188.00', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  const columns = [
    { 
      id: 'id', 
      label: 'Invoice No.', 
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
          onClick={() => alert(`Downloading Receipt ${row.id}`)}
          className="text-xs text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" /> Receipt
        </button>
      )
    },
  ];

  // Available Shipper Plans
  const plans = [
    {
      id: 'starter',
      name: 'Starter Shipper',
      priceMonthly: '€0',
      priceYearly: '€0',
      description: 'Free plan for occasional shippers posting occasional cargo requests.',
      rfqLimit: '10 Cargo Requests / mo',
      payLaterLimit: 'No Pay Later Facility',
      support: 'Standard Email Support',
      features: ['Basic Carrier Matching', 'Standard POD Access', 'Card Payments'],
      isCurrent: false,
    },
    {
      id: 'business',
      name: 'Business Shipper',
      priceMonthly: '€49',
      priceYearly: '€39',
      description: 'Ideal for small-to-medium businesses shipping regular weekly freight.',
      rfqLimit: '100 Cargo Requests / mo',
      payLaterLimit: '€10,000 Pay Later Limit',
      support: 'Priority Chat & Phone',
      features: ['Live GPS Tracking', 'Direct Supplier Counter-Offers', 'SEPA & Pay Later', 'Multi-User Access'],
      isCurrent: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Shipper',
      priceMonthly: '€119',
      priceYearly: '€99',
      description: 'Full enterprise suite for high-volume shippers with custom logistics needs.',
      rfqLimit: 'Unlimited Cargo Requests',
      payLaterLimit: '€50,000 Pay Later Credit',
      support: '24/7 Dedicated Manager',
      features: ['ERP & TMS API Integrations', 'Custom Payment Terms (Net 30)', 'Dedicated Logistics Coordinator', 'SLA Guarantee'],
      isCurrent: true,
      popular: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-5 font-sans antialiased pb-20 min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Customer Subscription & Billing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your shipper subscription plan, credit limits, payment methods, and invoice receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Premium Shipper Account
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
              Current Active Plan
            </CardTitle>
            <Badge className="bg-[#ff4a1f]/10 text-[#ff4a1f] border border-[#ff4a1f]/30 text-[10px] font-bold uppercase">
              Enterprise Tier
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-slate-900">Enterprise Shipper</h3>
                <span className="text-xl font-extrabold text-[#ff4a1f]">€99<span className="text-xs text-slate-500 font-normal">/mo</span></span>
              </div>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1">
                Billed annually (€1,188/yr). Auto-renews on <span className="font-semibold text-slate-800">Jul 01, 2027</span>.
              </p>
            </div>

            {/* Auto Renew Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">Auto-Renewal</span>
                <p className="text-[10.5px] text-slate-500 font-normal">Maintain uninterrupted enterprise access</p>
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
              Shipper Usage & Credit Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Usage Metric 1: Cargo Requests */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Cargo Requests</span>
                <span className="font-bold text-[#ff4a1f]">Unlimited</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#ff4a1f] h-full rounded-full transition-all" style={{ width: '100%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">Unlimited requests active.</p>
            </div>

            {/* Usage Metric 2: Pay Later Facility */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Pay Later Credit</span>
                <span className="font-bold text-slate-800">€ 24,500 / € 50k</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '49%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">€25,500 available credit.</p>
            </div>

            {/* Usage Metric 3: Team Members */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Team Accounts</span>
                <span className="font-bold text-slate-800">8 Users</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: '80%' }} />
              </div>
              <p className="text-[10.5px] text-slate-500 font-normal">Unlimited team access.</p>
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
              Shipper Subscription Plans
            </CardTitle>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Select the plan that matches your monthly shipping volume.</p>
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
                    Recommended
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
                      <span>{plan.rfqLimit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#ff4a1f]" />
                      <span>{plan.payLaterLimit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#ff4a1f]" />
                      <span>{plan.support}</span>
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
                      onClick={() => navigate('/customer/subscription/checkout', { 
                        state: { 
                          plan: { 
                            id: plan.id, 
                            name: plan.name, 
                            priceMonthly: plan.id === 'starter' ? 0 : plan.id === 'business' ? 49 : 119, 
                            priceYearly: plan.id === 'starter' ? 0 : plan.id === 'business' ? 39 : 99, 
                            cycle: billingCycle 
                          } 
                        } 
                      })}
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

      {/* Payment Method & Invoicing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Saved Credit Card */}
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

        {/* Company Billing Profile */}
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <Building2 className="w-4 h-4 text-[#ff4a1f]" />
              Billing Profile & VAT Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Billed Business Name:</span>
              <span className="font-bold text-slate-800">Walton Group BD Ltd.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">VAT / Tax BIN:</span>
              <span className="font-bold text-slate-800">BIN-987654321</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Invoice Contact Email:</span>
              <span className="font-bold text-slate-800">billing@walton.bd</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Downloadable Billing History */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Receipt className="w-4 h-4 text-[#ff4a1f]" />
            Subscription Invoices & Receipts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={history} hideViewToggle={true} />
        </CardContent>
      </Card>

    </div>
  );
}
