import React from 'react';
import { Copy, Check } from 'lucide-react';

interface InvitationAcceptedCredentialsBoxProps {
    emailParam?: string;
    passwordParam?: string;
    copied: boolean;
    onCopyPassword: () => void;
}

export const InvitationAcceptedCredentialsBox: React.FC<InvitationAcceptedCredentialsBoxProps> = ({
    emailParam,
    passwordParam,
    copied,
    onCopyPassword,
}) => {
    if (!emailParam && !passwordParam) return null;

    return (
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-[4px] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto text-left text-xs space-y-2">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Your Login Credentials
            </div>

            {emailParam && (
                <div className="flex items-center justify-between py-0.5 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Email:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{emailParam}</span>
                </div>
            )}

            {passwordParam && (
                <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-slate-800 pt-1.5 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Password:</span>
                    <div className="flex items-center gap-1.5">
                        <code className="px-2 py-0.5 rounded-[3px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-800 dark:text-slate-100">
                            {passwordParam}
                        </code>
                        <button
                            type="button"
                            onClick={onCopyPassword}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Copy Password"
                        >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
