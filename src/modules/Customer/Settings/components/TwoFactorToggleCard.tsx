import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface TwoFactorToggleCardProps {
  twoFactor?: boolean;
  onToggle?: () => void;
}

export const TwoFactorToggleCard: React.FC<TwoFactorToggleCardProps> = () => {
  return (
    <div className="bg-white dark:bg-[#161a20] p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              Two-Factor Authentication (2FA)
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Upcoming Feature
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            Two-step verification via Google Authenticator or Authy will be available in an upcoming release.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <span className="inline-block text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-[4px] select-none cursor-not-allowed">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default TwoFactorToggleCard;
