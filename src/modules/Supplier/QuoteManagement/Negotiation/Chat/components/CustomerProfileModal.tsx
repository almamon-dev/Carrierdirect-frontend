import React from 'react';
import { BadgeCheck, Phone } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';

interface CustomerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: NegotiationItem;
    onCallClick?: () => void;
}

const ProfileRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex items-center py-2 text-[13px] min-w-0">
        <span className="w-32 sm:w-40 shrink-0 text-slate-500 font-medium">{label}</span>
        <span className="w-4 shrink-0 text-slate-400 font-bold text-center">:</span>
        <div className="flex-1 min-w-0 font-semibold text-slate-800">{value}</div>
    </div>
);

const maskEmail = (emailStr: string) => {
    if (!emailStr) return 'cu••••••1@carrierdirect.com';
    const [local, domain] = emailStr.split('@');
    if (!local || !domain) return 'cu••••••1@carrierdirect.com';
    if (local.length <= 2) return `${local.slice(0, 1)}••••@${domain}`;
    return `${local.slice(0, 2)}••••••${local.slice(-1)}@${domain}`;
};

const maskPhone = (phoneStr: string) => {
    if (!phoneStr) return '+880 17••-••••00';
    const clean = phoneStr.trim();
    if (clean.length < 8) return '+•• •••• ••••';
    const prefix = clean.slice(0, 7);
    const suffix = clean.slice(-2);
    return `${prefix}••-••••${suffix}`;
};

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
    isOpen,
    onClose,
    customer,
    onCallClick
}) => {
    const raw = (customer as any).raw || {};
    const emailName = customer.customer.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawEmail = raw.email || raw.customer_email || `${emailName}@carrierdirect.com`;
    const rawPhone = raw.phone || raw.customer_phone || '+880 1700-882200';
    const isDealAccepted = raw.status === 'accepted' || customer.status === 'accepted' || (customer as any).isAccepted === true;
    const displayedEmail = isDealAccepted ? rawEmail : maskEmail(rawEmail);
    const displayedPhone = isDealAccepted ? rawPhone : maskPhone(rawPhone);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="!max-w-5xl w-full sm:p-5" showCloseButton={true}>
            <div className="flex flex-col font-sans max-h-[85vh] overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-2">
                {/* Header Profile summary */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-50 text-[#FF4A1F] border border-orange-200 flex items-center justify-center font-bold text-xl shadow-2xs">
                                {customer.customerAvatar ? (
                                    <img src={customer.customerAvatar} alt={customer.customer} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{customer.customer.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-2xs" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900 truncate">{customer.customer}</h3>
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                                    <BadgeCheck size={13} className="text-emerald-600" />
                                    Verified Shipper
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[12.5px] text-slate-500">
                                <span className="font-semibold text-[#FF4A1F]">{customer.quoteId}</span>
                                <span>•</span>
                                <span className="font-bold text-amber-600">★ {customer.customerRating || 4.9}</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-semibold">48 completed orders</span>
                                <span>•</span>
                                <span className="text-slate-400">Joined Mar 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two-Column Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-5 pt-4 pb-2">
                    {/* Left Column */}
                    <div className="space-y-4 min-w-0">
                        <div>
                            <h4 className="text-[12.5px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">Account & Verification</h4>
                            <div className="divide-y divide-slate-100">
                                <ProfileRow label="Company Name" value={<span className="truncate block">{customer.customer}</span>} />
                                <ProfileRow
                                    label="Account Status"
                                    value={
                                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 inline-flex items-center gap-1 text-[11px]">
                                            <BadgeCheck size={12} /> Verified Business
                                        </span>
                                    }
                                />
                                <ProfileRow
                                    label="Email Address"
                                    value={
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-mono text-slate-700 tracking-wide">
                                                {displayedEmail}
                                            </span>
                                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200 shrink-0 whitespace-nowrap">Verified</span>
                                        </div>
                                    }
                                />
                                <ProfileRow
                                    label="Direct Phone"
                                    value={
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-mono text-slate-700 tracking-wide">
                                                {displayedPhone}
                                            </span>
                                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200 shrink-0 whitespace-nowrap">Verified</span>
                                        </div>
                                    }
                                />
                                <ProfileRow label="Platform Tenure" value="Member since Mar 2023 (1y 5m)" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[12.5px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">Order Activity & Rating</h4>
                            <div className="divide-y divide-slate-100">
                                <ProfileRow label="Completed Orders" value="48 Completed Shipments" />
                                <ProfileRow label="Fulfillment Rate" value={<span className="text-emerald-600">98.4% Success Rate</span>} />
                                <ProfileRow label="Customer Rating" value={`★ ${customer.customerRating || 4.9} (42 reviews)`} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 min-w-0">
                        <div>
                            <h4 className="text-[12.5px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">Logistics & Freight Profile</h4>
                            <div className="divide-y divide-slate-100">
                                <ProfileRow
                                    label="Active Route"
                                    value={
                                        <span className="block leading-snug text-slate-800" title={`${customer.pickup} → ${customer.delivery}`}>
                                            {customer.pickup} → {customer.delivery}
                                        </span>
                                    }
                                />
                                <ProfileRow label="Required Vehicle" value={customer.vehicleType || 'Covered Van (20ft)'} />
                                <ProfileRow label="Standard Cargo" value={customer.palletType || 'Palletized Commercial Freight'} />
                                <ProfileRow label="Payment Terms" value="Net 15 Days (CarrierDirect Escrow)" />
                                <ProfileRow label="Ongoing RFQs" value="2 Active Negotiations" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[12.5px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">Trust & Compliance</h4>
                            <div className="divide-y divide-slate-100">
                                <ProfileRow label="Payment History" value="100% Secured (0 Disputes)" />
                                <ProfileRow label="Security Escrow" value={<span className="text-emerald-700 font-semibold">Guaranteed by Platform</span>} />
                                <ProfileRow label="Corporate ID" value={<span className="font-medium text-slate-700">BIN-883921-EU</span>} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2 text-xs font-semibold cursor-pointer">
                        Close
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onClose();
                            onCallClick?.();
                        }}
                        className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                        <Phone size={14} />
                        <span>Call Shipper</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
