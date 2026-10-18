import React, { useState } from 'react';
import { Truck, FileText, CheckCircle2, Edit3 } from 'lucide-react';
import { DriverProfile } from '../../../types';
import TabHeader from '@/components/ui/tab-header';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import Button from '@/components/ui/button';
import { EditEquipmentModal } from './EditEquipmentModal';
import { VehicleSpecCards } from './VehicleSpecCards';

interface Props {
    profile: DriverProfile;
}

export const VehicleSection: React.FC<Props> = ({ profile }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        fileUrl: string;
        fileType?: string;
    }>({
        isOpen: false,
        title: '',
        fileUrl: '',
    });

    const openDocPreview = (title: string, fileUrl: string, fileType = 'PDF Document') => {
        if (!fileUrl) return;
        setPreviewDoc({ isOpen: true, title, fileUrl, fileType });
    };

    const fleet = profile.fleetEquipment || ({} as any);

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Header & Actions */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <TabHeader title="Assigned Fleet & Equipment" icon={Truck} />
                <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    className="h-8 px-3.5 text-xs sm:text-[13px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                    <Edit3 size={14} />
                    <span>Edit Equipment Specs</span>
                </Button>
            </div>

            {/* Live Assigned Vehicle Card */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-800/80 rounded-md p-4 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4a1f]"></div>

                {/* Assignment Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-800/60">
                            <Truck size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {fleet.tractorModel || 'Equipment Not Assigned'}
                                </h3>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                        fleet.unitNumber || fleet.tractorModel
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <CheckCircle2
                                        size={12}
                                        className={`mr-1 ${
                                            fleet.unitNumber || fleet.tractorModel ? 'text-emerald-600' : 'text-slate-400'
                                        }`}
                                    />
                                    {fleet.unitNumber || fleet.tractorModel ? 'Active Assigned' : 'Pending Assignment'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Unit Number:{' '}
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {fleet.unitNumber || '—'}
                                </span>{' '}
                                • Trailer:{' '}
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {fleet.trailerNumber || '—'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {fleet.insuranceCertificateUrl && (
                            <button
                                type="button"
                                onClick={() => openDocPreview('Commercial Insurance Policy', fleet.insuranceCertificateUrl)}
                                className="h-7 px-2.5 text-xs font-semibold text-[#ff4a1f] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 border border-orange-200/60 dark:border-orange-800/60 rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileText size={12} />
                                <span>Insurance Policy</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Detailed Spec Grid */}
                <VehicleSpecCards fleet={fleet} />
            </div>

            {/* Edit Equipment Modal */}
            <EditEquipmentModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                fleet={fleet}
            />

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
                title={previewDoc.title}
                fileUrl={previewDoc.fileUrl}
                fileType={previewDoc.fileType}
            />
        </div>
    );
};

export default VehicleSection;
