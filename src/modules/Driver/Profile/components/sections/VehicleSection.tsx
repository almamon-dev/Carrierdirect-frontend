import React, { useState } from 'react';
import {
    Truck, ShieldCheck, FileText, CheckCircle2,
    Calendar, Tag, Hash, CreditCard, Box, Radio, Gauge, Navigation,
    Plus, Edit3, Trash2
} from 'lucide-react';
import { DriverProfile } from '../../../types';
import TabHeader from '@/components/ui/tab-header';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import Button from '@/components/ui/button';

interface Props {
    profile: DriverProfile;
}

const KeyValueRow = ({
    label,
    value,
    isMono = false,
    highlight = false,
    icon: Icon,
    iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
    action
}: {
    label: string;
    value: React.ReactNode;
    isMono?: boolean;
    highlight?: boolean;
    icon?: any;
    iconColor?: string;
    action?: React.ReactNode;
}) => (
    <div className="flex items-start justify-between py-[5px] text-[13px]">
        <div className="flex items-start gap-1.5 min-w-0 flex-1 pr-2">
            {Icon && (
                <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                    <Icon size={11} />
                </div>
            )}
            <span className="w-[120px] shrink-0 text-slate-600 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium select-none px-0.5">:</span>
            <span className={`break-words ${isMono ? 'font-mono' : ''} ${highlight ? 'font-bold text-[#ff4a1f]' : 'font-semibold text-slate-900 dark:text-white'}`}>
                {value}
            </span>
        </div>
        {action && <div className="shrink-0 ml-2">{action}</div>}
    </div>
);

export const VehicleSection: React.FC<Props> = ({ profile }) => {
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
        setPreviewDoc({ isOpen: true, title, fileUrl, fileType });
    };

    // Simulate multiple assigned vehicles
    const assignedFleets = [
        {
            id: 'FL-1',
            isPrimary: true,
            tractorModel: 'Freightliner Cascadia',
            year: 2023,
            unitNumber: 'TRK-559',
            vin: 'XXXXXXXX',
            licensePlate: 'ABC-987654',
            equipmentType: '53ft Dry Van',
            eldUnitId: 'Samsara VG54',
            currentMileage: '245,820 mi',
            trailerNumber: 'TRL-559',
            trailerVin: 'XXXXXXXX',
            trailerType: "53' Air-Ride Dry Van",
            gpsTracker: 'AT-9921',
            inspectionStatus: 'Valid',
            inspectionCertificateName: 'FHWA Certificate',
            inspectionCertificateUrl: '/documents/trailers/TRL-559/fhwa-inspection.pdf',
            insuranceStatus: 'Active',
            insuranceCertificateUrl: '/documents/fleet/TRK-559/insurance.pdf',
        },
        {
            id: 'FL-2',
            isPrimary: false,
            tractorModel: 'Volvo VNL 860',
            year: 2021,
            unitNumber: 'TRK-210',
            vin: 'YYYYYYYY',
            licensePlate: 'XYZ-123456',
            equipmentType: 'Refrigerated',
            eldUnitId: 'Samsara VG54',
            currentMileage: '312,450 mi',
            trailerNumber: 'TRL-210',
            trailerVin: 'YYYYYYYY',
            trailerType: "53' Reefer",
            gpsTracker: 'AT-8822',
            inspectionStatus: 'Valid',
            inspectionCertificateName: 'FHWA Certificate',
            inspectionCertificateUrl: '/documents/trailers/TRL-210/fhwa-inspection.pdf',
            insuranceStatus: 'Active',
            insuranceCertificateUrl: '/documents/fleet/TRK-210/insurance.pdf',
        }
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Header & Actions */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <TabHeader title="Assigned Fleet & Equipment" icon={Truck} />
                <Button
                    type="button"
                    size="sm"
                    onClick={() => console.log('Open Add Vehicle Modal')}
                    className="h-8 px-3.5 text-xs sm:text-[13px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                    <Plus size={14} />
                    <span>Assign Vehicle</span>
                </Button>
            </div>

            {/* List of Assigned Vehicles */}
            <div className="space-y-5">
                {assignedFleets.map((fleet, index) => (
                    <div key={fleet.id} className="bg-white dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-800/80 rounded-md p-4 shadow-sm relative group overflow-hidden">
                        
                        {/* Decorative background for primary */}
                        {fleet.isPrimary && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4a1f]"></div>
                        )}

                        {/* Assignment Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 gap-3">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs">
                                        <Truck size={13} />
                                    </div>
                                    <span>
                                        Assignment #{index + 1}
                                        <span className="text-slate-400 font-normal ml-1">
                                            ({fleet.unitNumber} {fleet.trailerNumber ? `+ ${fleet.trailerNumber}` : ''})
                                        </span>
                                    </span>
                                </h3>
                                {fleet.isPrimary && (
                                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] font-bold px-2 py-0.5 rounded-[3px] flex items-center gap-1 uppercase tracking-wider">
                                        <CheckCircle2 size={10} />
                                        Primary
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => console.log('Edit Vehicle', fleet.id)}
                                    className="h-7 px-2.5 text-[12px] font-semibold bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                    <Edit3 size={12} />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => console.log('Unassign Vehicle', fleet.id)}
                                    className="h-7 px-2.5 text-[12px] font-semibold bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                                >
                                    <Trash2 size={12} />
                                    <span className="sr-only sm:not-sr-only">Unassign</span>
                                </Button>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div className="space-y-4">
                            {/* Sub-group 1: Power Unit (Tractor) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                                    <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Truck size={13} className="text-[#ff4a1f]" />
                                        <span>Power Unit (Tractor)</span>
                                    </h4>
                                </div>

                                <div className="space-y-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow
                                            icon={Truck}
                                            iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
                                            label="Tractor Model"
                                            value={fleet.tractorModel}
                                        />
                                        <KeyValueRow
                                            icon={Calendar}
                                            iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400"
                                            label="Year"
                                            value={String(fleet.year)}
                                        />
                                        <KeyValueRow
                                            icon={Tag}
                                            iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                                            label="Unit Number"
                                            value={fleet.unitNumber}
                                            isMono
                                        />
                                        <KeyValueRow
                                            icon={Hash}
                                            iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
                                            label="VIN"
                                            value={fleet.vin}
                                            isMono
                                        />
                                        <KeyValueRow
                                            icon={CreditCard}
                                            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                                            label="License Plate"
                                            value={fleet.licensePlate}
                                            isMono
                                        />
                                        <KeyValueRow
                                            icon={Box}
                                            iconColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400"
                                            label="Equipment Type"
                                            value={fleet.equipmentType}
                                        />
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800/80 my-1" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow
                                            icon={Radio}
                                            iconColor="text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400"
                                            label="ELD Unit ID"
                                            value={fleet.eldUnitId}
                                            isMono
                                        />
                                        <KeyValueRow
                                            icon={Gauge}
                                            iconColor="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400"
                                            label="Current Mileage"
                                            value={fleet.currentMileage}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sub-group 2: Attached Trailer */}
                            {fleet.trailerNumber && (
                                <div className="space-y-1.5 pt-2">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                                        <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <Truck size={13} className="text-blue-500" />
                                            <span>Attached Trailer Unit</span>
                                        </h4>
                                    </div>

                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                            <KeyValueRow
                                                icon={Truck}
                                                iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
                                                label="Trailer Number"
                                                value={fleet.trailerNumber}
                                                isMono
                                            />
                                            <KeyValueRow
                                                icon={Hash}
                                                iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
                                                label="Trailer VIN"
                                                value={fleet.trailerVin}
                                                isMono
                                            />
                                            <KeyValueRow
                                                icon={Box}
                                                iconColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400"
                                                label="Trailer Type"
                                                value={fleet.trailerType}
                                            />
                                            <KeyValueRow
                                                icon={Navigation}
                                                iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                label="GPS Tracker"
                                                value={fleet.gpsTracker}
                                                isMono
                                            />
                                            <KeyValueRow
                                                icon={ShieldCheck}
                                                iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                label="Inspection Status"
                                                value={
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <CheckCircle2 size={13} />
                                                        <span>{fleet.inspectionStatus}</span>
                                                    </span>
                                                }
                                            />
                                        </div>

                                        <hr className="border-slate-100 dark:border-slate-800/80 my-1" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                            <KeyValueRow
                                                icon={FileText}
                                                iconColor="text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/60"
                                                label="Inspection Cert."
                                                value={
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocPreview(`Trailer ${fleet.trailerNumber} Inspection`, fleet.inspectionCertificateUrl || '')}
                                                        className="text-[#ff4a1f] hover:underline font-mono text-xs sm:text-[13px] flex items-center gap-1 cursor-pointer truncate"
                                                    >
                                                        <FileText size={13} className="text-[#ff4a1f] shrink-0" />
                                                        <span className="truncate">fhwa-inspection.pdf</span>
                                                    </button>
                                                }
                                                action={
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocPreview(`Trailer ${fleet.trailerNumber} Inspection`, fleet.inspectionCertificateUrl || '')}
                                                        className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-[2px] cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                }
                                            />
                                            <KeyValueRow
                                                icon={ShieldCheck}
                                                iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                                                label="Insurance Cert."
                                                value={
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocPreview(`Tractor ${fleet.unitNumber} Insurance`, fleet.insuranceCertificateUrl || '')}
                                                        className="text-[#ff4a1f] hover:underline font-mono text-xs sm:text-[13px] flex items-center gap-1 cursor-pointer truncate"
                                                    >
                                                        <FileText size={13} className="text-[#ff4a1f] shrink-0" />
                                                        <span className="truncate">insurance.pdf</span>
                                                    </button>
                                                }
                                                action={
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocPreview(`Tractor ${fleet.unitNumber} Insurance`, fleet.insuranceCertificateUrl || '')}
                                                        className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-[2px] cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc(prev => ({ ...prev, isOpen: false }))}
                title={previewDoc.title}
                fileUrl={previewDoc.fileUrl}
                fileType={previewDoc.fileType}
            />
        </div>
    );
};
