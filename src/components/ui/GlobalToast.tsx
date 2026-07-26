import React from 'react';
import { useToastStore } from '@/stores/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function GlobalToast() {
  const { message, type, hideToast } = useToastStore();

  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-[99999] flex items-center gap-3 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-md shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200 min-w-[280px] max-w-md">
      {type === 'success' && (
        <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        </div>
      )}

      {type === 'error' && (
        <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 stroke-[2.5]" />
        </div>
      )}

      {type === 'info' && (
        <div className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 stroke-[2.5]" />
        </div>
      )}

      <span className="flex-1 leading-snug">{message}</span>

      <button
        onClick={hideToast}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer ml-1 p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
