import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Loader2, ShieldAlert, Sparkles, CheckCircle2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import apiClient from '@/lib/axios';

export default function PayLaterFacilityPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayLaterStatus = async () => {
    setLoading(true);
    try {
      const [profRes, subRes] = await Promise.allSettled([
        apiClient.get('/customer/profile'),
        apiClient.get('/subscription/status'),
      ]);

      if (profRes.status === 'fulfilled') {
        setProfile(profRes.value.data?.data || profRes.value.data || null);
      }
      if (subRes.status === 'fulfilled') {
        setSubscription(subRes.value.data?.data || subRes.value.data || null);
      }
    } catch (err) {
      console.error('Failed to load Pay Later info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayLaterStatus();
  }, []);

  const handleRequestIncrease = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/customer/pay-later/request');
      setRequestSubmitted(true);
      fetchPayLaterStatus();
      setTimeout(() => {
        setRequestSubmitted(false);
      }, 3000);
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Failed to submit Pay Later request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlanId = (subscription?.plan_id || subscription?.plan?.slug || '').toLowerCase();
  const isEnterprise = subscription?.status === 'active' && currentPlanId === 'enterprise';

  const statusStr = profile?.pay_later_status || profile?.user?.pay_later_status || 'not_requested';
  const approvedLimit = profile?.pay_later_limit || profile?.user?.pay_later_limit || 0;
  const cardPm = profile?.pay_later_pm_id || profile?.user?.pay_later_pm_id;

  const isNotActive = statusStr === 'not_requested' || statusStr === 'none' || (!approvedLimit && statusStr !== 'approved');

  return (
    <div className="p-4 md:p-6 w-full space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">
            Pay Later Management
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            Track and manage your credit lines and pay later requests.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">
          <Loader2 size={24} className="animate-spin text-[#ff4a1f] mx-auto mb-2" />
          Checking Pay Later & subscription status...
        </div>
      ) : !isEnterprise ? (
        /* Enterprise Feature Gate */
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 sm:p-8 border border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff4a1f]/20 border border-[#ff4a1f]/40 rounded-full text-[#ff4a1f] text-xs font-bold">
              <Sparkles size={14} /> Enterprise Exclusive Feature
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Unlock 30-Day Pay Later & Cargo Credit Lines
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enterprise Fleet Access members enjoy flexible 30-day post-delivery invoice settlements, corporate credit lines up to €50,000, and automated monthly consolidated billing.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-[#ff4a1f]" /> 30-Day Terms</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-[#ff4a1f]" /> Up to €50k Credit</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-[#ff4a1f]" /> Auto Invoicing</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/customer/subscription')}
            className="px-5 py-3 rounded-lg bg-[#ff4a1f] hover:bg-[#e03d15] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            Upgrade to Enterprise Plan
          </button>
        </div>
      ) : (
        /* Enterprise Subscribed View */
        <>
          {requestSubmitted && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
              Pay Later credit request submitted successfully! Awaiting Admin approval.
            </div>
          )}

          {isNotActive ? (
            <div className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200 dark:border-slate-800 shadow-xs p-6">
              <EmptyState
                icon={CreditCard}
                title="Pay Later Facility Not Active"
                description="You currently do not have an active Pay Later credit line. Submit a request to enable credit-based cargo shipments."
                actionLabel={isSubmitting ? "Submitting..." : "Request Credit Line Approval"}
                onAction={handleRequestIncrease}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Facility Status</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">{statusStr === 'approved' ? 'Approved' : 'Pending Approval'}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusStr === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'}`}>
                      {statusStr.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Approved Credit Limit</span>
                  <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                    € {Number(approvedLimit).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Linked Payment Card</span>
                  <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {cardPm ? 'Card Linked' : 'No Card Linked'}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Request Credit Limit Increase</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#ff4a1f] hover:bg-[#e03d15] text-white"
                    onClick={handleRequestIncrease}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin mr-1" /> : <FileText size={14} className="mr-1" />}
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
