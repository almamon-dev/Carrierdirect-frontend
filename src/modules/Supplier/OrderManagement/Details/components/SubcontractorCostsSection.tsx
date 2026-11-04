import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import {
    Plus,
    Building2,
    Route,
    DollarSign,
    FileText,
    UploadCloud,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    PieChart,
    ExternalLink,
    ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import {
    SubcontractorCostItem,
    SubcontractorCompany,
    OrderFinancialSummary,
} from '../types/subcontractor.types';
import SubcontractorInvoiceModal from './SubcontractorInvoiceModal';
import AdminInvoiceVerificationModal from './AdminInvoiceVerificationModal';

interface SubcontractorCostsSectionProps {
    orderId: string;
    routeFrom: string;
    routeTo: string;
    customerRevenue?: number;
    platformFee?: number;
}

const DEFAULT_SUBCONTRACTORS: SubcontractorCompany[] = [
    { id: 'sub-1', name: 'ABC Logistics Ltd.', contact_person: 'John Doe', phone: '+353 1 234 5678' },
    { id: 'sub-2', name: 'Swift Haulage Europe', contact_person: 'Marcus Braun', phone: '+49 40 123456' },
    { id: 'sub-3', name: 'Direct Line Freight', contact_person: 'Eoin Kelly', phone: '+353 87 654 3210' },
];

export const SubcontractorCostsSection: React.FC<SubcontractorCostsSectionProps> = ({
    orderId,
    routeFrom,
    routeTo,
    customerRevenue = 1000.0,
    platformFee = 50.0,
}) => {
    // Subcontractors available to select
    const [subcontractors, setSubcontractors] = useState<SubcontractorCompany[]>(DEFAULT_SUBCONTRACTORS);

    useEffect(() => {
        apiClient
            .get('/supplier/subcontractors')
            .then((res) => {
                const data = res.data?.data || res.data;
                if (Array.isArray(data) && data.length > 0) {
                    const mapped: SubcontractorCompany[] = data.map((s: any) => ({
                        id: String(s.id),
                        name: s.name,
                        contact_person: s.contact_name,
                        phone: s.phone,
                    }));
                    setSubcontractors(mapped);
                    if (mapped.length > 0) {
                        setSelectedSubcontractor(mapped[0].name);
                    }
                }
            })
            .catch(() => {});
    }, []);

    // Form inputs for "Add Subcontractor Cost"
    const [selectedSubcontractor, setSelectedSubcontractor] = useState(DEFAULT_SUBCONTRACTORS[0].name);
    const [customSubcontractor, setCustomSubcontractor] = useState('');
    const [journeyLeg, setJourneyLeg] = useState(`${routeFrom} → ${routeTo}`);
    const [agreedCostInput, setAgreedCostInput] = useState('200.00');
    const [notesInput, setNotesInput] = useState('Delivery by external carrier');

    // List of planned / recorded costs for this order
    const [costsList, setCostsList] = useState<SubcontractorCostItem[]>([
        {
            id: 'sc-1',
            order_id: orderId,
            subcontractor_name: 'ABC Logistics',
            journey_leg: `${routeFrom || 'Dublin Port'} → ${routeTo || 'Final Destination'}`,
            agreed_cost: 200.0,
            currency: 'EUR',
            status: 'planned',
            notes: 'Delivery by external carrier',
            created_at: new Date().toISOString().slice(0, 10),
        },
    ]);

    // Fetch live subcontractor costs from backend API
    const cleanOrderId = String(orderId).replace(/^ORD-0*/i, '') || orderId;

    useEffect(() => {
        const fetchCosts = async () => {
            try {
                const res = await apiClient.get(`/supplier/orders/${cleanOrderId}/subcontractor-costs`);
                const data = res.data?.data?.costs || res.data?.costs;
                if (Array.isArray(data) && data.length > 0) {
                    setCostsList(data);
                }
            } catch {
                // Fallback to local initial state
            }
        };
        fetchCosts();
    }, [cleanOrderId]);

    // Active cost item to upload invoice for
    const [invoiceModalItem, setInvoiceModalItem] = useState<SubcontractorCostItem | null>(null);

    // Active cost item to verify in Admin Modal
    const [adminVerifyItem, setAdminVerifyItem] = useState<SubcontractorCostItem | null>(null);

    // Ferry & other costs
    const ferryCosts = 100.0;

    // Calculate accrued subcontractor costs (only if status is accrued)
    const accruedSubcontractorCost = costsList.reduce((acc, item) => {
        if (item.status === 'accrued') {
            return acc + (item.invoice_amount || item.agreed_cost);
        }
        return acc;
    }, 0);

    // Planned total
    const plannedSubcontractorTotal = costsList.reduce((acc, item) => acc + item.agreed_cost, 0);

    // Effective deduction for net profit calculation
    const effectiveContractorCost = accruedSubcontractorCost > 0 ? accruedSubcontractorCost : plannedSubcontractorTotal;
    const estimatedNetProfit = customerRevenue - effectiveContractorCost - ferryCosts - platformFee;

    const financialSummary: OrderFinancialSummary = {
        customer_revenue: customerRevenue,
        subcontractor_costs_accrued: accruedSubcontractorCost > 0 ? accruedSubcontractorCost : plannedSubcontractorTotal,
        ferry_and_other_costs: ferryCosts,
        platform_fee: platformFee,
        estimated_net_profit: estimatedNetProfit,
        currency: '€',
    };

    const handleSaveCost = async (e: React.FormEvent) => {
        e.preventDefault();
        const costVal = parseFloat(agreedCostInput);
        if (isNaN(costVal) || costVal <= 0) return;

        const subName = selectedSubcontractor === 'custom' ? customSubcontractor.trim() || 'External Carrier' : selectedSubcontractor;
        const legVal = journeyLeg.trim() || `${routeFrom} → ${routeTo}`;

        try {
            const res = await apiClient.post(`/supplier/orders/${cleanOrderId}/subcontractor-costs`, {
                subcontractor_name: subName,
                journey_leg: legVal,
                agreed_cost: costVal,
                notes: notesInput.trim(),
            });
            const created = res.data?.data?.cost || res.data?.cost;
            if (created) {
                setCostsList((prev) => [...prev, created]);
            } else {
                throw new Error('No cost object returned');
            }
        } catch {
            const newCost: SubcontractorCostItem = {
                id: `sc-${Date.now()}`,
                order_id: orderId,
                subcontractor_name: subName,
                journey_leg: legVal,
                agreed_cost: costVal,
                currency: 'EUR',
                status: 'planned',
                notes: notesInput.trim(),
                created_at: new Date().toISOString().slice(0, 10),
            };
            setCostsList((prev) => [...prev, newCost]);
        } finally {
            setAgreedCostInput('');
            setNotesInput('');
        }
    };

    const handleDeleteCost = async (costId: string) => {
        try {
            await apiClient.delete(`/supplier/orders/${cleanOrderId}/subcontractor-costs/${costId}`);
        } catch {
            // Local fallback
        }
        setCostsList((prev) => prev.filter((item) => String(item.id) !== String(costId)));
    };

    const handleSaveInvoice = async (
        costId: string,
        invoiceData: {
            invoice_number: string;
            invoice_date: string;
            invoice_amount: number;
            notes?: string;
            file_name?: string;
            file_size?: string;
            file?: File;
        }
    ) => {
        try {
            const formData = new FormData();
            formData.append('invoice_number', invoiceData.invoice_number);
            formData.append('invoice_date', invoiceData.invoice_date);
            formData.append('invoice_amount', String(invoiceData.invoice_amount));
            if (invoiceData.notes) formData.append('notes', invoiceData.notes);
            if (invoiceData.file) formData.append('invoice_file', invoiceData.file);

            await apiClient.post(`/supplier/orders/${cleanOrderId}/subcontractor-costs/${costId}/invoice`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch {
            // Local fallback
        }

        setCostsList((prev) =>
            prev.map((item) => {
                if (String(item.id) === String(costId)) {
                    return {
                        ...item,
                        invoice_number: invoiceData.invoice_number,
                        invoice_date: invoiceData.invoice_date,
                        invoice_amount: invoiceData.invoice_amount,
                        invoice_file_name: invoiceData.file_name,
                        invoice_file_size: invoiceData.file_size,
                        notes: invoiceData.notes || item.notes,
                        status: 'pending_review' as any,
                    };
                }
                return item;
            })
        );
    };

    const handleApproveAsAccrued = async (costId: string) => {
        try {
            await apiClient.post(`/admin/orders/${cleanOrderId}/subcontractor-costs/${costId}/approve`);
        } catch {
            // Local fallback
        }
        setCostsList((prev) =>
            prev.map((item) => {
                if (String(item.id) === String(costId)) {
                    return {
                        ...item,
                        status: 'accrued',
                    };
                }
                return item;
            })
        );
        setAdminVerifyItem(null);
    };

    const handleRejectCost = async (costId: string, reason: string = 'Invoice rejected by admin') => {
        try {
            await apiClient.post(`/admin/orders/${cleanOrderId}/subcontractor-costs/${costId}/reject`, { reason });
        } catch {
            // Local fallback
        }
        setCostsList((prev) =>
            prev.map((item) => {
                if (String(item.id) === String(costId)) {
                    return {
                        ...item,
                        status: 'rejected',
                    };
                }
                return item;
            })
        );
        setAdminVerifyItem(null);
    };

    return (
        <div className="space-y-4 font-sans antialiased text-slate-800 dark:text-slate-200">
            {/* 1. Add Subcontractor Cost Card (Matches Step 2 from image) */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center">
                            <Building2 size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                Add Subcontractor Cost
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Assign an external subcontractor and agreed expense for a specific route journey leg.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/supplier/availability/subcontractors"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 shrink-0"
                    >
                        <span>Manage Subcontractors & Drivers</span>
                        <ExternalLink size={12} />
                    </a>
                </div>

                <form onSubmit={handleSaveCost} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Subcontractor / Carrier */}
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Subcontractor / Carrier *
                            </FormLabel>
                            <select
                                value={selectedSubcontractor}
                                onChange={(e) => setSelectedSubcontractor(e.target.value)}
                                className="w-full h-8.5 px-2.5 text-xs font-semibold bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#ff4a1f]"
                            >
                                {subcontractors.map((sub) => (
                                    <option key={sub.id} value={sub.name}>
                                        {sub.name}
                                    </option>
                                ))}
                                <option value="custom">+ Enter Custom Subcontractor Name</option>
                            </select>

                            {selectedSubcontractor === 'custom' && (
                                <Input
                                    type="text"
                                    placeholder="Enter Subcontractor Company Name"
                                    value={customSubcontractor}
                                    onChange={(e) => setCustomSubcontractor(e.target.value)}
                                    className="mt-1 h-8 text-xs"
                                    required
                                />
                            )}
                        </div>

                        {/* Journey Leg */}
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Journey Leg *
                            </FormLabel>
                            <div className="relative">
                                <Route size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={journeyLeg}
                                    onChange={(e) => setJourneyLeg(e.target.value)}
                                    placeholder="e.g. Dublin Port → Final Destination"
                                    className="w-full h-8.5 pl-8 pr-2.5 text-xs font-semibold bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#ff4a1f]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Agreed Cost (€) */}
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Agreed Cost (€) *
                            </FormLabel>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={agreedCostInput}
                                    onChange={(e) => setAgreedCostInput(e.target.value)}
                                    placeholder="e.g. 200.00"
                                    className="w-full h-8.5 pl-8 pr-2.5 text-xs font-bold bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#ff4a1f]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Notes (Optional)
                            </FormLabel>
                            <input
                                type="text"
                                value={notesInput}
                                onChange={(e) => setNotesInput(e.target.value)}
                                placeholder="e.g. Delivery by external carrier"
                                className="w-full h-8.5 px-2.5 text-xs font-normal bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#ff4a1f]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setAgreedCostInput('');
                                setNotesInput('');
                            }}
                            className="h-8 px-3 text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs flex items-center gap-1.5"
                        >
                            <Plus size={13} />
                            <span>Save Cost</span>
                        </Button>
                    </div>
                </form>
            </div>

            {/* 2. Planned Subcontractor Costs Table (Matches Step 2, 4 & 5 from image) */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Planned Subcontractor Costs ({costsList.length})
                    </h4>
                    <span className="text-xs font-semibold text-slate-500">
                        Total Agreed: <strong className="text-slate-900 dark:text-slate-100">€{plannedSubcontractorTotal.toFixed(2)}</strong>
                    </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-[4px]">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="py-2.5 px-3">Subcontractor</th>
                                <th className="py-2.5 px-3">Journey Leg</th>
                                <th className="py-2.5 px-3">Agreed Cost</th>
                                <th className="py-2.5 px-3">Invoice Amount</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {costsList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-6 text-center text-slate-400">
                                        No subcontractor costs planned for this order.
                                    </td>
                                </tr>
                            ) : (
                                costsList.map((item) => {
                                    const isAccrued = item.status === 'accrued';
                                    const isSubmitted = item.status === 'invoice_submitted';

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                            <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                                                {item.subcontractor_name}
                                                {item.invoice_number && (
                                                    <span className="block text-[10.5px] font-mono text-slate-400 mt-0.5">
                                                        Ref: {item.invoice_number}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                                                {item.journey_leg}
                                            </td>
                                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                                                €{Number(item.agreed_cost).toFixed(2)}
                                            </td>
                                            <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                                {item.invoice_amount ? `€${Number(item.invoice_amount).toFixed(2)}` : '—'}
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-[4px] border ${
                                                        isAccrued
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                                            : isSubmitted
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                                    }`}
                                                >
                                                    {isAccrued ? (
                                                        <CheckCircle2 size={11} />
                                                    ) : isSubmitted ? (
                                                        <Clock size={11} />
                                                    ) : (
                                                        <Clock size={11} />
                                                    )}
                                                    <span className="capitalize">
                                                        {item.status === 'invoice_submitted' ? 'Pending Review' : item.status}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                    {/* If planned: Upload Invoice button (Step 3) */}
                                                    {item.status === 'planned' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setInvoiceModalItem(item)}
                                                            className="px-2.5 py-1 text-[11px] font-bold text-[#ff4a1f] bg-orange-50 hover:bg-orange-100 dark:bg-[#ff4a1f]/15 border border-orange-200 dark:border-orange-800 rounded cursor-pointer transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <UploadCloud size={11} />
                                                            <span>Upload Invoice</span>
                                                        </button>
                                                    )}

                                                    {/* If submitted: Admin Verification button (Step 4) */}
                                                    {item.status === 'invoice_submitted' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setAdminVerifyItem(item)}
                                                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded cursor-pointer transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <ShieldCheck size={11} />
                                                            <span>Admin Verify</span>
                                                        </button>
                                                    )}

                                                    {/* If accrued: View File badge */}
                                                    {item.invoice_file_name && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setAdminVerifyItem(item)}
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                                                        >
                                                            <FileText size={10} />
                                                            <span>View Details</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteCost(item.id)}
                                                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer rounded"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Order Financial Overview Card (Matches Step 6 from image) */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <PieChart size={16} className="text-[#ff4a1f]" />
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Order Financial Overview
                        </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                        Real-time P&L Breakdown
                    </span>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Customer Revenue</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            €{financialSummary.customer_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>Subcontractor Cost (Accrued)</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            - €{financialSummary.subcontractor_costs_accrued.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>Ferry & Other Costs</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            - €{financialSummary.ferry_and_other_costs.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>Platform Fee</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            - €{financialSummary.platform_fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/60 dark:bg-[#ff4a1f]/10 p-2.5 rounded-[4px]">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Estimated Net Profit
                        </span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            €{financialSummary.estimated_net_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal for Supplier Invoice Upload (Step 3) */}
            <SubcontractorInvoiceModal
                isOpen={Boolean(invoiceModalItem)}
                costItem={invoiceModalItem}
                onClose={() => setInvoiceModalItem(null)}
                onSaveInvoice={handleSaveInvoice}
            />

            {/* Modal for Admin Invoice Verification (Step 4 & 5) */}
            <AdminInvoiceVerificationModal
                isOpen={Boolean(adminVerifyItem)}
                costItem={adminVerifyItem}
                orderNumber={orderId}
                onClose={() => setAdminVerifyItem(null)}
                onApproveAsAccrued={handleApproveAsAccrued}
                onReject={handleRejectCost}
            />
        </div>
    );
};

export default SubcontractorCostsSection;
