import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RatingSuccessViewProps {
  targetName: string;
}

export const RatingSuccessView: React.FC<RatingSuccessViewProps> = ({ targetName }) => {
  return (
    <div className="py-8 px-5 flex flex-col items-center justify-center text-center space-y-2">
      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
        <CheckCircle2 size={22} />
      </div>
      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Rating Submitted!</h3>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
        Thank you! Your feedback for <strong className="text-slate-700 dark:text-slate-200">{targetName}</strong> has been successfully recorded.
      </p>
    </div>
  );
};
