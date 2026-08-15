import React, { useState } from 'react';
import { CreditCard, Clock, Euro, Building, ExternalLink, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PayoutStripeTab() {
  const [isStripeConnected, setIsStripeConnected] = useState(true);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [paymentTerms, setPaymentTerms] = useState('net15');
  const [isSaved, setIsSaved] = useState(false);

  const paymentTermsOptions = [
    { id: 'instant', name: 'Instant Clearance (Upon Delivery Proof)' },
    { id: 'net15', name: 'Net 15 Days (Standard)' },
    { id: 'net30', name: 'Net 30 Days (Corporate)' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-3.5 font-sans antialiased">
      
      {/* Stripe Status Card */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-4.5 h-4.5 text-[#ff4a1f] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">Stripe Express Connect</span>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                Connected
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              Payouts linked to Commerzbank AG (IBAN **** 4242).
            </p>
          </div>
        </div>

        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noreferrer"
          className="h-8 px-3.5 bg-[#635bff] hover:bg-[#534be0] text-white font-semibold text-xs rounded-md shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Stripe Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/80" />
        </a>
      </div>

      {/* Payout Schedule */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Clock className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Payout Transfer Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label 
              onClick={() => setPayoutSchedule('daily')}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'daily' 
                  ? 'bg-orange-50/60 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/20' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Daily Payouts</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'daily'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-normal">
                Transfers funds automatically every 24 hours.
              </p>
            </label>

            <label 
              onClick={() => setPayoutSchedule('weekly')}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'weekly' 
                  ? 'bg-orange-50/60 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/20' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Weekly (Every Monday)</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'weekly'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-normal">
                Consolidates earnings into a single batch payout every Monday.
              </p>
            </label>

            <label 
              onClick={() => setPayoutSchedule('biweekly')}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                payoutSchedule === 'biweekly' 
                  ? 'bg-orange-50/60 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/20' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Bi-Weekly (1st & 15th)</span>
                <input type="radio" name="payoutSchedule" checked={payoutSchedule === 'biweekly'} onChange={() => {}} className="accent-[#ff4a1f]" />
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-normal">
                Transfers twice a month to your bank account.
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Invoicing Terms */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Building className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Invoicing Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-xs font-semibold text-slate-700">Standard Payment Term *</label>
            <Select
              value={paymentTerms}
              onChange={(opt) => setPaymentTerms(typeof opt === 'object' ? opt.id : opt)}
              options={paymentTermsOptions}
              showSearch={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Action Footer */}
      <div className="flex items-center justify-between pt-1">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payout settings updated
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Payouts processed securely via Stripe.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          Save Payout Settings
        </Button>
      </div>

    </form>
  );
}
