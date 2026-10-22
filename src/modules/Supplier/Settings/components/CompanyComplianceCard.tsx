import React, { useState } from 'react';
import { Paperclip, FileText, Eye, Upload, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UpdateComplianceModal } from './UpdateComplianceModal';

interface CompanyComplianceCardProps {
  complianceData: any;
  onRefresh?: () => void;
}

function renderDocStatusBadge(status?: string) {
  const s = (status || 'pending').toLowerCase();
  if (s === 'verified' || s === 'approved' || s === 'active') {
    return <StatusBadge status="Verified Active" category="success" />;
  }
  if (s === 'rejected' || s === 'declined') {
    return <StatusBadge status="Rejected" category="failed" />;
  }
  if (s === 'expired') {
    return <StatusBadge status="Expired" category="neutral" />;
  }
  return <StatusBadge status="Pending Verification" category="pending" />;
}

export function CompanyComplianceCard({ complianceData, onRefresh }: CompanyComplianceCardProps) {
  const [modalType, setModalType] = useState<'insurance' | 'license' | null>(null);

  if (!complianceData) return null;

  const insurance = complianceData.insurance || {};
  const license = complianceData.license || {};

  const isInsuranceExpired = (insurance.status || '').toLowerCase() === 'expired' || (insurance.days_until_expiry !== null && insurance.days_until_expiry <= 0);
  const isLicenseExpired = (license.status || '').toLowerCase() === 'expired' || (license.days_until_expiry !== null && license.days_until_expiry <= 0);
  const hasExpiredDoc = isInsuranceExpired || isLicenseExpired;

  return (
    <>
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Compliance & License Documents
          </CardTitle>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Admin Verified Credentials
          </span>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4 space-y-3">
          {/* Global Alert for Expired/Expiring Documents */}
          {hasExpiredDoc && (
            <div className="p-3 bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-red-900/50 rounded-[4px] flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Compliance Document Expired</p>
                <p className="text-[11.5px] text-red-700/90 dark:text-red-400/90 leading-relaxed">
                  One or more verification documents have expired. Please upload your renewed documents below so admin can re-verify your carrier account without service interruption.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 1. Insurance Policy Card */}
            <div className={`p-3.5 rounded-[4px] border flex flex-col justify-between gap-3 shadow-2xs transition-all ${
              isInsuranceExpired
                ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                : 'bg-slate-50/70 dark:bg-[#14181f] border-slate-200/80 dark:border-slate-800'
            }`}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs text-[#ff4a1f]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Insurance Policy
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {insurance.type || 'Goods in Transit Insurance'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {renderDocStatusBadge(isInsuranceExpired ? 'expired' : insurance.status)}
                  </div>
                </div>

                {/* Insurance Metadata */}
                <div className="space-y-1 pt-1 text-[11.5px] border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Provider / Policy:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 ">
                      {insurance.provider_name ? `${insurance.provider_name} (${insurance.policy_number || 'N/A'})` : (insurance.policy_number || '—')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Expiry Date:
                    </span>
                    <span className={`font-semibold ${isInsuranceExpired ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {insurance.expiry_at || '—'}
                      {isInsuranceExpired && ' (Expired)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: View & Update Document */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                {insurance.document_url && (
                  <a
                    href={insurance.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setModalType('insurance')}
                  className={`h-7 px-2.5 text-[11px] font-bold rounded-[3px] flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer ${
                    isInsuranceExpired
                      ? 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white'
                      : 'bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#ff4a1f]" />
                  <span>{isInsuranceExpired ? 'Re-upload Policy' : 'Update Policy'}</span>
                </button>
              </div>
            </div>

            {/* 2. Carrier Operating License Card */}
            <div className={`p-3.5 rounded-[4px] border flex flex-col justify-between gap-3 shadow-2xs transition-all ${
              isLicenseExpired
                ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                : 'bg-slate-50/70 dark:bg-[#14181f] border-slate-200/80 dark:border-slate-800'
            }`}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs text-[#ff4a1f]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Carrier Operating License
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        EU / National Transport Authorization
                      </p>
                    </div>
                  </div>
                  <div>
                    {renderDocStatusBadge(isLicenseExpired ? 'expired' : license.status)}
                  </div>
                </div>

                {/* License Metadata */}
                <div className="space-y-1 pt-1 text-[11.5px] border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Uploaded Date:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {license.uploaded_at || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Expiry Date:
                    </span>
                    <span className={`font-semibold ${isLicenseExpired ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {license.expiry_at || '—'}
                      {isLicenseExpired && ' (Expired)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: View & Update Document */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                {license.document_url && (
                  <a
                    href={license.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setModalType('license')}
                  className={`h-7 px-2.5 text-[11px] font-bold rounded-[3px] flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer ${
                    isLicenseExpired
                      ? 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white'
                      : 'bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#ff4a1f]" />
                  <span>{isLicenseExpired ? 'Re-upload License' : 'Update License'}</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload/Re-upload Modal */}
      {modalType && (
        <UpdateComplianceModal
          isOpen={Boolean(modalType)}
          onClose={() => setModalType(null)}
          type={modalType}
          currentData={modalType === 'insurance' ? insurance : license}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </>
  );
}

export default CompanyComplianceCard;
