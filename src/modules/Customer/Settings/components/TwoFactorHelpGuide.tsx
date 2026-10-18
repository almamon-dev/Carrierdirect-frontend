import React from 'react';
import { HelpCircle, ShieldCheck, Key, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TwoFactorHelpGuideProps {
  rawSecret: string;
  onClose: () => void;
  onNavigateSupport: () => void;
}

export const TwoFactorHelpGuide: React.FC<TwoFactorHelpGuideProps> = ({
  rawSecret,
  onClose,
  onNavigateSupport,
}) => {
  return (
    <div className="mt-3 p-3 bg-orange-50/70 border border-orange-200 rounded-lg space-y-2 text-[11px] animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-orange-200/60 pb-1.5">
        <h4 className="font-bold text-slate-900 flex items-center gap-1">
          <HelpCircle size={13} className="text-[#ff4a1f]" />
          2-Factor Setup Guide
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-600 hover:text-slate-900 font-bold text-[10px]"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-800">
        <div className="space-y-0.5 bg-white p-2 rounded border border-orange-100">
          <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
            <ShieldCheck size={12} className="text-[#ff4a1f]" /> Authenticator App:
          </p>
          <ol className="list-decimal pl-3.5 space-y-0.5 text-[10.5px] text-slate-700">
            <li>Open <strong>Google Authenticator</strong> / <strong>Authy</strong>.</li>
            <li>Tap <strong>+</strong> and select <strong>Scan QR Code</strong>.</li>
            <li>Scan the QR code on the right.</li>
          </ol>
        </div>

        <div className="space-y-0.5 bg-white p-2 rounded border border-orange-100">
          <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
            <Key size={12} className="text-[#ff4a1f]" /> Manual Key Setup:
          </p>
          <ol className="list-decimal pl-3.5 space-y-0.5 text-[10.5px] text-slate-700">
            <li>Copy Secret Key ({rawSecret}).</li>
            <li>Select <strong>Enter setup key</strong> in app.</li>
            <li>Set Account Name as <strong>CarrierDirect</strong>.</li>
          </ol>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-orange-200/60">
        <span className="text-[10px] text-slate-600 font-medium">Need further help?</span>
        <button
          type="button"
          onClick={onNavigateSupport}
          className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Contact Support</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default TwoFactorHelpGuide;
