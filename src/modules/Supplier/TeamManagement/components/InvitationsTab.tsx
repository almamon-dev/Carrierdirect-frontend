import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    RefreshCw, X, Mail, MoreVertical, Copy, Check, Trash2, Send, 
    Calendar, Clock, Building2, Shield, RotateCcw, UserPlus
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { InvitationItem } from '../types/team.types';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

interface InvitationRowActionsProps {
    row: InvitationItem;
    onResend: (row: InvitationItem) => void;
    onRevoke: (row: InvitationItem) => void;
}

const InvitationRowActions: React.FC<InvitationRowActionsProps> = ({ row, onResend, onRevoke }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
                title="Actions"
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {(row.status === 'Pending' || row.status === 'Expired') && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onResend(row);
                            }}
                        >
                            <Send size={14} className="text-[#ff4a1f] shrink-0" />
                            <span>Resend Invitation</span>
                        </button>
                    )}

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.email)}
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                            <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        )}
                        <span>{copied ? 'Copied Email!' : 'Copy Email'}</span>
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onRevoke(row);
                        }}
                    >
                        <Trash2 size={14} className="text-red-500 shrink-0" />
                        <span>Revoke Invitation</span>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

interface InvitationsTabProps {
    headerTabs?: React.ReactNode;
}

export default function InvitationsTab({ headerTabs }: InvitationsTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const [invitations, setInvitations] = useState<InvitationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
    const [revokingInvitation, setRevokingInvitation] = useState<InvitationItem | null>(null);

    const fetchInvitations = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/supplier/team/invitations');
            const raw = res.data?.data?.invitations || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: InvitationItem[] = resArray.map((inv: any, idx: number) => {
                const rawRole = inv.role?.name || inv.role || 'Staff Member';
                const dept = inv.department || (
                    rawRole.toLowerCase().includes('fleet') || rawRole.toLowerCase().includes('driver') ? 'Fleet & Drivers' :
                    rawRole.toLowerCase().includes('dispatch') || rawRole.toLowerCase().includes('operat') ? 'Operations & Dispatch' :
                    rawRole.toLowerCase().includes('support') || rawRole.toLowerCase().includes('sales') ? 'Customer Support & Sales' :
                    rawRole.toLowerCase().includes('finan') ? 'Finance & Accounts' : 'Operations & Dispatch'
                );

                const dateSentStr = inv.created_at 
                    ? new Date(inv.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'Recently';

                const expiresStr = inv.expires_at 
                    ? new Date(inv.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'In 7 days';

                return {
                    id: inv.id ? `INV-${String(inv.id).padStart(3, '0')}` : `INV-${String(idx + 1).padStart(3, '0')}`,
                    rawId: inv.id || idx + 1,
                    email: inv.email || 'user@example.com',
                    role: rawRole,
                    department: dept,
                    dateSent: dateSentStr,
                    status: (inv.status === 'accepted' ? 'Accepted' : inv.status === 'expired' ? 'Expired' : 'Pending') as any,
                    expires: expiresStr,
                };
            });

            setInvitations(mapped);
        } catch (err) {
            console.error('Failed to fetch invitations:', err);
            setInvitations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleResend = async (row: InvitationItem) => {
        try {
            const targetId = row.rawId || row.id;
            await apiClient.post(`/supplier/team/invitations/${targetId}/resend`);
            setInvitations(invitations.map(inv => inv.id === row.id ? { ...inv, status: 'Pending', dateSent: 'Resent just now' } : inv));
            showToast(`Invitation email resent successfully to ${row.email}!`, 'success');
        } catch (err: any) {
            console.error('Failed to resend invitation:', err);
            showToast(err.response?.data?.message || 'Failed to resend invitation', 'error');
        }
    };

    const handleConfirmRevoke = async () => {
        if (!revokingInvitation) return;
        try {
            const targetId = revokingInvitation.rawId || revokingInvitation.id;
            await apiClient.delete(`/supplier/team/invitations/${targetId}`);
            setInvitations(prev => prev.filter(inv => inv.id !== revokingInvitation.id));
            showToast(`Revoked invitation for ${revokingInvitation.email}`, 'success');
        } catch (err: any) {
            console.error('Failed to revoke invitation:', err);
            showToast(err.response?.data?.message || 'Failed to revoke invitation', 'error');
        }
    };

    const handleResetFilters = () => {
        setSelectedStatusFilter('all');
        setSelectedDeptFilter('all');
    };

    const isFiltered = selectedStatusFilter !== 'all' || selectedDeptFilter !== 'all';

    const filteredInvitations = useMemo(() => {
        return invitations.filter(inv => {
            if (selectedStatusFilter !== 'all' && inv.status.toLowerCase() !== selectedStatusFilter.toLowerCase()) {
                return false;
            }
            if (selectedDeptFilter !== 'all' && (inv.department || '').toLowerCase() !== selectedDeptFilter.toLowerCase()) {
                return false;
            }
            return true;
        });
    }, [invitations, selectedStatusFilter, selectedDeptFilter]);

    const columns: Column<InvitationItem>[] = [
        { 
            id: 'id', 
            label: 'ID', 
            className: 'w-[85px] min-w-[85px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {row.id}
                    </span>
                </div>
            )
        },
        { 
            id: 'email', 
            label: 'Recipient Email', 
            className: 'min-w-[220px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 min-h-[26px] truncate">
                    <div className="w-5 h-5 rounded-full bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center text-[9.5px] font-bold shrink-0">
                        <Mail size={11} />
                    </div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate" title={row.email}>
                        {row.email}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'department', 
            label: 'Department', 
            className: 'w-[170px] min-w-[170px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px] truncate">
                    <Building2 size={12} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                        {row.department}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'role', 
            label: 'Assigned Role', 
            className: 'w-[140px] min-w-[140px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {row.role}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'dateSent', 
            label: 'Date Sent', 
            className: 'w-[125px] min-w-[125px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px] text-xs text-slate-500 dark:text-slate-400 font-normal">
                    <Calendar size={12} className="text-slate-400 shrink-0" />
                    <span>{row.dateSent}</span>
                </div>
            ) 
        },
        { 
            id: 'expires', 
            label: 'Expires On', 
            className: 'w-[130px] min-w-[130px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px] text-xs text-slate-500 dark:text-slate-400 font-normal">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>{row.expires}</span>
                </div>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status', 
            className: 'w-[100px] min-w-[100px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <Badge variant="secondary" className={
                        row.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold text-[10.5px] border border-amber-200/60 dark:border-amber-800/60' :
                        row.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[10.5px] border border-emerald-200/60 dark:border-emerald-800/60' :
                        'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold text-[10.5px] border border-red-200/60 dark:border-red-800/60'
                    }>
                        {row.status}
                    </Badge>
                </div>
            )
        }
    ];

    const renderGridCard = (inv: InvitationItem) => (
        <div
            key={inv.id}
            className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
        >
            <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="w-7 h-7 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f] shrink-0">
                            <Mail size={14} />
                        </div>
                        <div className="min-w-0">
                            <span className="font-mono text-[10.5px] font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                                {inv.id}
                            </span>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight mt-0.5" title={inv.email}>
                                {inv.email}
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="secondary" className={
                            inv.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold text-[10px] border border-amber-200/60' :
                            inv.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-200/60' :
                            'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold text-[10px] border border-red-200/60'
                        }>
                            {inv.status}
                        </Badge>
                        <InvitationRowActions
                            row={inv}
                            onResend={handleResend}
                            onRevoke={(r) => setRevokingInvitation(r)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 py-1 text-xs">
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Shield size={12} className="text-slate-400" /> Role:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{inv.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Building2 size={12} className="text-slate-400" /> Department:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{inv.department}</span>
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                    <Calendar size={11} /> Sent: {inv.dateSent}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={11} /> Expires: {inv.expires}
                </span>
            </div>
        </div>
    );

    const renderActions = (row: InvitationItem) => (
        <InvitationRowActions
            row={row}
            onResend={handleResend}
            onRevoke={(r) => setRevokingInvitation(r)}
        />
    );

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Status Filter</label>
                    <Select 
                        size="sm"
                        value={selectedStatusFilter} 
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setSelectedStatusFilter(val);
                        }} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Invitations' },
                            { id: 'pending', name: 'Pending' },
                            { id: 'accepted', name: 'Accepted' },
                            { id: 'expired', name: 'Expired' }
                        ]} 
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                    <Select 
                        size="sm"
                        value={selectedDeptFilter} 
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setSelectedDeptFilter(val);
                        }} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Departments' },
                            { id: 'Operations & Dispatch', name: 'Operations & Dispatch' },
                            { id: 'Fleet & Drivers', name: 'Fleet & Drivers' },
                            { id: 'Customer Support & Sales', name: 'Customer Support & Sales' },
                            { id: 'Finance & Accounts', name: 'Finance & Accounts' }
                        ]} 
                    />
                </div>

                {isFiltered && (
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-[30px] text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw size={12} />
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable 
                columns={columns} 
                data={filteredInvitations} 
                compact={true}
                searchPlaceholder="Search invitations by email, role, ID, department..."
                hideViewToggle={false}
                renderGridCard={renderGridCard}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                actions={renderActions}
                actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3"
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Mail}
                        title="No Invitations Found"
                        description="There are currently no active or pending team member invitations matching the criteria."
                    />
                }
            />

            {/* Revoke Invitation Modal */}
            {revokingInvitation && (
                <DeleteConfirmationModal
                    isOpen={Boolean(revokingInvitation)}
                    onClose={() => setRevokingInvitation(null)}
                    onConfirm={handleConfirmRevoke}
                    title="Revoke Invitation"
                    subtitle="Cancel pending team invitation"
                    memberName={revokingInvitation.email}
                    memberEmail={revokingInvitation.email}
                    memberRole={revokingInvitation.role}
                    memberId={revokingInvitation.id}
                    confirmText="Revoke Invitation"
                    warningMessage={`Are you sure you want to revoke the invitation sent to ${revokingInvitation.email}? The invitation link will immediately become invalid.`}
                />
            )}
        </div>
    );
}
