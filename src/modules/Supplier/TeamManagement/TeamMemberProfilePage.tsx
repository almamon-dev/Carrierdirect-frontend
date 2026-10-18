import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import BlockMemberModal from './components/BlockMemberModal';
import { useTeamMemberProfile } from './hooks/useTeamMemberProfile';
import { MemberProfileSidebar } from './components/MemberProfileSidebar';
import { MemberRulesMatrix } from './components/MemberRulesMatrix';

export default function TeamMemberProfilePage() {
    const {
        member,
        setMember,
        isLoading,
        isBlockModalOpen,
        setIsBlockModalOpen,
        handleDelete,
        handleUnblock,
        navigate,
    } = useTeamMemberProfile();

    if (isLoading) {
        return (
            <div className="p-3.5 sm:p-4 w-full mx-auto min-h-[200px] h-auto bg-[#f8fafc] dark:bg-[#12161c] flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff4a1f]" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="p-3.5 sm:p-4 w-full mx-auto h-auto bg-[#f8fafc] dark:bg-[#12161c] space-y-2 font-sans">
                <div className="bg-white dark:bg-[#1e2329] p-5 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    Team Member not found.
                </div>
            </div>
        );
    }

    const isBlocked = member.status === 'Blocked' || Boolean(member.isBlocked);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 h-auto font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Team Member Profile
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        <button
                            type="button"
                            onClick={() => navigate('/supplier/team?tab=members&view=table')}
                            className="hover:text-[#ff4a1f] transition-colors cursor-pointer"
                        >
                            Team Management
                        </button>
                        <span>/</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{member.name}</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded shadow-2xs self-start sm:self-auto"
                    onClick={() => navigate('/supplier/team?tab=members&view=table')}
                >
                    <ArrowLeft size={13} />
                    <span>Back to Team</span>
                </Button>
            </div>

            {/* 2-Column Left & Right Layout */}
            <div className="flex flex-col lg:flex-row items-start gap-3.5 h-auto">
                <MemberProfileSidebar
                    member={member}
                    isBlocked={isBlocked}
                    onOpenBlockModal={() => setIsBlockModalOpen(true)}
                    onUnblock={handleUnblock}
                    onDelete={handleDelete}
                />
                <MemberRulesMatrix roleName={member.role} />
            </div>

            {/* Block Modal */}
            {isBlockModalOpen && (
                <BlockMemberModal
                    member={member}
                    onClose={() => setIsBlockModalOpen(false)}
                    onSuccess={(updated) => {
                        setMember(updated);
                    }}
                />
            )}
        </div>
    );
}
