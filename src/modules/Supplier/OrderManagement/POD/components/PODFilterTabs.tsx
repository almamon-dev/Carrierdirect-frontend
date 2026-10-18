import React, { useMemo } from 'react';
import { PODFilterTab, PODOrderItem } from '../types';

interface PODFilterTabsProps {
    orders: PODOrderItem[];
    activeTab: PODFilterTab;
    onSelectTab: (tab: PODFilterTab) => void;
}

export const PODFilterTabs: React.FC<PODFilterTabsProps> = ({
    orders,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let all = orders.length;
        let needsUpload = 0;
        let inReview = 0;
        let approved = 0;
        let rejected = 0;

        orders.forEach((o) => {
            const ps = String(o.pod_status || '').toLowerCase().trim();
            const rawStatus = String(o.status_raw || o.status || '').toLowerCase().trim();
            const hasPod = Boolean(o.has_pod || o.pod_document_url || o.pod_file_url);

            const isApproved = ps === 'approved' || ps.includes('approv') || ps === 'confirmed' || rawStatus === 'completed' || rawStatus === 'pod accepted';
            const isRejected = !isApproved && (ps === 'rejected' || ps.includes('reject'));
            const isInReview = !isApproved && !isRejected && hasPod && (ps === 'pending review' || ps.includes('review') || ps.includes('pending') || rawStatus === 'pod_uploaded');
            const isNeedsUpload = !isApproved && !isRejected && !isInReview && (!hasPod || ps === 'not uploaded' || ps === 'awaiting');

            if (isApproved) approved++;
            else if (isRejected) rejected++;
            else if (isInReview) inReview++;
            else if (isNeedsUpload) needsUpload++;
        });

        return {
            all,
            needs_upload: needsUpload,
            in_review: inReview,
            approved,
            rejected,
        };
    }, [orders]);

    // Professional tab names: Needs Upload | In Review | Approved | Rejected
    const tabs: { id: PODFilterTab; label: string; count: number }[] = [
        { id: 'needs_upload', label: 'Needs Upload', count: counts.needs_upload },
        { id: 'in_review', label: 'In Review', count: counts.in_review },
        { id: 'approved', label: 'Approved', count: counts.approved },
        { id: 'rejected', label: 'Rejected', count: counts.rejected },
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 rounded-[3px] ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                isActive
                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default PODFilterTabs;
