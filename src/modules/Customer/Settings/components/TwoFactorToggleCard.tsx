import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import Badge from '@/components/ui/badge';

interface TwoFactorToggleCardProps {
  twoFactor: boolean;
  onToggle: () => void;
}

export const TwoFactorToggleCard: React.FC<TwoFactorToggleCardProps> = ({
  twoFactor,
  onToggle,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            twoFactor ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-[#ff4a1f]'
          }`}
        >
          {twoFactor ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Two-Factor Authentication (2FA)
            </h4>
            {twoFactor && (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Enabled
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            Scan QR code using Google / Authy Authenticator app for 2-step verification.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
          twoFactor ? 'bg-[#ff4a1f]' : 'bg-slate-200'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            twoFactor ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default TwoFactorToggleCard;
