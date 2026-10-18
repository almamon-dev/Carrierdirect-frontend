import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FundReleaseHoldCardProps {
  fundReleaseDays: number;
  setFundReleaseDays: (days: number) => void;
}

const HOLD_OPTIONS = [
  { days: 0, label: 'Instant', desc: 'Immediately on POD confirmation' },
  { days: 1, label: '1 Day', desc: '24 hours after completion' },
  { days: 3, label: '3 Days', desc: 'Standard 72-hour hold' },
  { days: 7, label: '7 Days', desc: 'Weekly escrow cycle' },
  { days: 14, label: '14 Days', desc: 'Extended 2-week hold' },
  { days: 30, label: '30 Days', desc: 'Monthly reconciliation' },
];

export function FundReleaseHoldCard({ fundReleaseDays, setFundReleaseDays }: FundReleaseHoldCardProps) {
  return (
    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 w-full rounded-[4px] bg-white dark:bg-[#181a20]">
      <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Calendar className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Fund Release Hold Period (Delivery Escrow)
          </CardTitle>
          <span className="text-[11px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-[3px] border border-orange-200 dark:border-orange-800/50">
            {fundReleaseDays === 0 ? 'Immediate / Instant' : `${fundReleaseDays} Days Hold`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-4 space-y-2.5">
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Configure after how many days your delivery earnings are released from escrow and transferred to your connected Stripe account. This preference dynamically controls automated fund releases for your orders.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {HOLD_OPTIONS.map((opt) => (
            <label
              key={opt.days}
              className={`p-2.5 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                fundReleaseDays === opt.days
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/30'
                  : 'bg-white dark:bg-[#14181f] border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{opt.label}</span>
                <input
                  type="radio"
                  name="fundReleaseDays"
                  value={opt.days}
                  checked={fundReleaseDays === opt.days}
                  onChange={() => setFundReleaseDays(opt.days)}
                  className="accent-[#ff4a1f] cursor-pointer"
                />
              </div>
              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 font-normal leading-tight">
                {opt.desc}
              </p>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
