import React from 'react';
import { Paperclip, FileText, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CompanyComplianceCardProps {
  complianceData: any;
}

function renderDocStatusBadge(status?: string) {
  const s = (status || 'pending').toLowerCase();
  let badgeClass = 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
  let dotClass = 'bg-amber-500';
  let label = 'Pending Verification';

  if (s === 'verified' || s === 'approved' || s === 'active') {
    badgeClass = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
    dotClass = 'bg-emerald-500';
    label = 'Verified Active';
  } else if (s === 'rejected' || s === 'declined' || s === 'expired') {
    badgeClass = 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
    dotClass = 'bg-rose-500';
    label = s === 'expired' ? 'Expired' : 'Rejected';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border ${badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span>{label}</span>
    </span>
  );
}

export function CompanyComplianceCard({ complianceData }: CompanyComplianceCardProps) {
  if (!complianceData) return null;

  return (
    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
      <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
        <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
          Compliance & License Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {complianceData.insurance && (
          <div className="p-3 bg-slate-50 dark:bg-[#14181f] rounded-[4px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs text-[#ff4a1f]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Insurance Policy</h4>
                <div className="mt-1 flex items-center gap-1.5">
                  {renderDocStatusBadge(complianceData.insurance.status)}
                </div>
              </div>
            </div>
            {complianceData.insurance.document_url && (
              <a
                href={complianceData.insurance.document_url}
                target="_blank"
                rel="noreferrer"
                className="h-7 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-2xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </a>
            )}
          </div>
        )}
        {complianceData.license && (
          <div className="p-3 bg-slate-50 dark:bg-[#14181f] rounded-[4px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs text-[#ff4a1f]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Carrier Operating License</h4>
                <div className="mt-1 flex items-center gap-1.5">
                  {renderDocStatusBadge(complianceData.license.status)}
                </div>
              </div>
            </div>
            {complianceData.license.document_url && (
              <a
                href={complianceData.license.document_url}
                target="_blank"
                rel="noreferrer"
                className="h-7 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-2xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
