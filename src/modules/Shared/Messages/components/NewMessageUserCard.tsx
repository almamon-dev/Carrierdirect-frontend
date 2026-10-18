import React from 'react';
import { UserCheck } from 'lucide-react';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';
import { ConversationUser } from '@/services/messageService';

interface NewMessageUserCardProps {
    user: ConversationUser;
    hasExistingChat: boolean;
    onSelect: (user: ConversationUser) => void;
}

export const NewMessageUserCard: React.FC<NewMessageUserCardProps> = ({
    user,
    hasExistingChat,
    onSelect,
}) => {
    const displayName = user.company_name || user.name || 'User';
    const isVerified = Boolean(user.is_verified ?? (user as any).email_verified_at);

    return (
        <div
            onClick={() => onSelect(user)}
            className="p-2 hover:bg-slate-100/80 dark:hover:bg-[#181d24] rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2.5"
        >
            <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar */}
                <div className="relative shrink-0 w-8 h-8">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                                (user.user_type || '').toLowerCase().includes('supplier')
                                    ? 'bg-orange-100/80 dark:bg-orange-950/60 text-[#FF4A1F]'
                                    : 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            }`}
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <span className="font-semibold text-[12.5px] text-slate-900 dark:text-slate-100 truncate">
                            {displayName}
                        </span>
                        {isVerified && <VerifiedBadge size={13} />}
                        {(user as any).role && (
                            <span
                                className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded ${
                                    String((user as any).role).includes('Carrier') || String((user as any).role).includes('Supplier')
                                        ? 'bg-orange-50 dark:bg-orange-950/60 text-[#ff4a1f] border border-orange-200/60'
                                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60'
                                }`}
                            >
                                {(user as any).role}
                            </span>
                        )}
                    </div>

                    {/* Assigned Order Numbers if any */}
                    {(user as any).order_numbers && (user as any).order_numbers.length > 0 ? (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-medium">Order:</span>
                            {(user as any).order_numbers.map((on: string) => (
                                <span
                                    key={on}
                                    className="font-mono font-bold text-[10px] text-[#ff4a1f] bg-orange-50/80 dark:bg-orange-950/40 px-1.5 py-0.2 rounded border border-orange-200/50 dark:border-orange-900/40"
                                >
                                    #{on}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                            <span className="font-mono text-[10px]">#CD-{String(user.id).padStart(4, '0')}</span>
                            <span>•</span>
                            <span>Verified Partner</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status */}
            {hasExistingChat ? (
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                    Active Chat
                </span>
            ) : (
                <span className="text-[10px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <UserCheck size={11} /> Start
                </span>
            )}
        </div>
    );
};
