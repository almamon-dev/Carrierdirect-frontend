import React from 'react';
import { RefreshCw, Download, FileText, Lock, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PayLaterHeaderProps {
  payLaterDays: number;
  isRefreshing: boolean;
  canUsePayLater: boolean;
  onRefresh: () => void;
  onExportCSV: () => void;
  onRequestIncrease: () => void;
}

export const PayLaterHeader: React.FC<PayLaterHeaderProps> = ({
  payLaterDays,
  isRefreshing,
  canUsePayLater,
  onRefresh,
  onExportCSV,
  onRequestIncrease,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
          Corporate Pay Later Facility
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Flexible Net-{payLaterDays} corporate credit for freight orders, consolidated monthly
          billing, and auto-settlements.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportCSV}
          className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download size={13} className="text-slate-500" />
          <span>Export CSV</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/customer/finance/invoices')}
          className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
        >
          <FileText size={13} className="text-slate-500" />
          <span>All Invoices</span>
        </Button>

        <Button
          variant={canUsePayLater ? 'primary' : 'outline'}
          size="sm"
          onClick={onRequestIncrease}
          className={`h-8 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            !canUsePayLater
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40'
              : 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white'
          }`}
        >
          {!canUsePayLater ? <Lock size={13} /> : <TrendingUp size={14} />}
          <span>Request Limit Increase</span>
        </Button>
      </div>
    </div>
  );
};

export default PayLaterHeader;
