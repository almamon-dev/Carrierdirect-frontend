import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, Building, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';

export default function PayoutStripeTab() {
  const navigate = useNavigate();
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [paymentTerms, setPaymentTerms] = useState('net15');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get('/supplier/stripe/status');
        const data = res.data?.data || res.data || {};
        setStripeStatus(data);
      } catch (e) {
        console.log('Error fetching stripe status', e);
      }
    };
    fetchStatus();
  }, []);

  const paymentTermsOptions = [
    { id: 'instant', name: 'Instant Clearance (Upon Delivery Proof)' },
    { id: 'net15', name: 'Net 15 Days (Standard)' },
    { id: 'net30', name: 'Net 30 Days (Corporate)' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        payout_schedule: payoutSchedule,
        payment_terms: paymentTerms,
      };
      await apiClient.post('/supplier/profile', payload);

      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (rawUser) {
        const u = JSON.parse(rawUser);
        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...u, ...payload }));
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving payout settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isVerified = stripeStatus?.onboarding_status === 'completed' && stripeStatus?.payouts_enabled;

  return (
    <form onSubmit={handleSave} className="space-y-4 font-sans antialiased w-full">
      
      {/* Central Hub Redirection Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-orange-50/30 dark:from-[#181d24] dark:to-[#1c222b] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs w-full">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Stripe Connect & Settlement Hub
              </h3>
              {isVerified ? (
                <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200">
                  Verified & Active
                </Badge>
              ) : stripeStatus?.onboarding_status === 'pending' ? (
                <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200">
                  Under Review
                </Badge>
              ) : (
                <Badge className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                  Setup Required
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Your connected bank accounts, identity verification documents, and live withdrawal balances are centrally managed in the <strong>Finance & Withdrawals Hub</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/supplier/finance/withdrawal')}
          className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold text-xs rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center"
        >
          <span>Open Finance Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Payout Schedule */}
      <Card className="shadow-2xs border-slate-200 w-full">
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
                Transfers available funds automatically every 24 hours.
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
                Transfers twice a month directly to your registered bank account.
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Invoicing Terms */}
      <Card className="shadow-2xs border-slate-200 w-full">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Building className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Invoicing & Payment Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="flex flex-col gap-1 w-full sm:max-w-md">
            <label className="text-xs font-semibold text-slate-700">Standard Invoice Term *</label>
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
      <div className="flex items-center justify-between pt-1 w-full">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payout preferences updated successfully.
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Payout terms applied across carrier invoices.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

    </form>
  );
}
