import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { TrendingUp, X, Check } from 'lucide-react';
import Button from '@/components/ui/button';

interface PayLaterIncreaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatedStats: {
    totalCreditLimit?: number;
    monthlyLimit: number;
    weeklyLimit: number;
    dailyLimit: number;
  };
  onSubmit: (target: string, amount: string, reason: string) => Promise<void>;
  isSubmitting: boolean;
}

export const PayLaterIncreaseModal: React.FC<PayLaterIncreaseModalProps> = ({
  isOpen,
  onClose,
  calculatedStats,
  onSubmit,
  isSubmitting,
}) => {
  const [increaseTarget, setIncreaseTarget] = useState<
    'Monthly Limit' | 'Weekly Limit' | 'Daily Limit'
  >('Monthly Limit');
  const [newRequestedLimit, setNewRequestedLimit] = useState('');
  const [increaseReason, setIncreaseReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(increaseTarget, newRequestedLimit, increaseReason);
    setNewRequestedLimit('');
    setIncreaseReason('');
  };

  const currentMonthly =
    calculatedStats?.monthlyLimit && calculatedStats.monthlyLimit > 0
      ? calculatedStats.monthlyLimit
      : 40000;
  const currentWeekly =
    calculatedStats?.weeklyLimit && calculatedStats.weeklyLimit > 0
      ? calculatedStats.weeklyLimit
      : 15000;
  const currentDaily =
    calculatedStats?.dailyLimit && calculatedStats.dailyLimit > 0
      ? calculatedStats.dailyLimit
      : 8000;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-md w-full overflow-hidden shadow-2xl space-y-4"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#ff4a1f]" /> Request Credit Limit Increase
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select which revolving limit you want to increase.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-[4px] p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-2 space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            {(['Monthly Limit', 'Weekly Limit', 'Daily Limit'] as const).map(
              (target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => setIncreaseTarget(target)}
                  className={`p-2.5 rounded-[4px] border text-left cursor-pointer transition-all ${
                    increaseTarget === target
                      ? 'border-[#ff4a1f] bg-orange-50/60 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 truncate">{target}</div>
                  <div className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                    €{' '}
                    {(target === 'Monthly Limit'
                      ? currentMonthly
                      : target === 'Weekly Limit'
                      ? currentWeekly
                      : currentDaily
                    ).toLocaleString()}
                  </div>
                </button>
              )
            )}
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
              Requested Amount (€ EUR)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              disabled={isSubmitting}
              placeholder={
                increaseTarget === 'Monthly Limit'
                  ? 'e.g. 50000'
                  : increaseTarget === 'Weekly Limit'
                  ? 'e.g. 20000'
                  : 'e.g. 10000'
              }
              value={newRequestedLimit}
              onChange={(e) => setNewRequestedLimit(e.target.value)}
              required
              className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-[4px] bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#ff4a1f]"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-[11px]">
              Reason for Limit Increase
            </label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              placeholder={`Provide details for ${increaseTarget.toLowerCase()} expansion...`}
              value={increaseReason}
              onChange={(e) => setIncreaseReason(e.target.value)}
              required
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-[4px] bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#ff4a1f]"
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold rounded-[4px] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="h-8 px-4 text-xs font-semibold rounded-[4px] bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Check size={13} />
            <span>Submit Request</span>
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default PayLaterIncreaseModal;
