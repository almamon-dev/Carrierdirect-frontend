import React from 'react';
import {
    Files,
    FileText,
    CreditCard,
    ShieldCheck,
    Download,
    Eye,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DriverProfile } from '../../../types';

interface Props {
    profile: DriverProfile;
    onPreviewDoc: (doc: { isOpen: boolean; title: string; url?: string; type?: string }) => void;
}

export const ProfileTabDocuments: React.FC<Props> = ({ profile, onPreviewDoc }) => {
    const cdl = profile.cdlDetails;
    const medical = profile.dotMedical;
    const equipment = profile.fleetEquipment;

    const documents = [
        {
            id: 'cdl',
            title: 'Commercial Driver License (CDL)',
            category: 'Credentials',
            icon: CreditCard,
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-900/40',
            docNumber: cdl?.cdlNumber || undefined,
            docNumberLabel: 'Lic #',
            expiryDate: cdl?.expirationDate ? String(cdl.expirationDate).split('T')[0] : undefined,
            issueDate: cdl?.issueDate ? String(cdl.issueDate).split('T')[0] : undefined,
            frontUrl: cdl?.cdlFrontUrl,
            backUrl: cdl?.cdlBackUrl,
            statusLabel: cdl?.cdlFrontUrl ? 'Verified' : 'Pending',
            hasFile: Boolean(cdl?.cdlFrontUrl || cdl?.cdlBackUrl),
        },
        {
            id: 'medical-card',
            title: 'DOT Medical Examiner Certificate',
            category: 'Medical',
            icon: FileText,
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-900/40',
            docNumber: medical?.nrcmeRegistryId || undefined,
            docNumberLabel: 'NRCME ID',
            expiryDate: medical?.expiryDate ? String(medical.expiryDate).split('T')[0] : undefined,
            issueDate: medical?.examDate ? String(medical.examDate).split('T')[0] : undefined,
            fileUrl: medical?.certificateUrl,
            statusLabel: medical?.certificateUrl ? 'Active & Valid' : 'Pending',
            hasFile: Boolean(medical?.certificateUrl),
        },
        {
            id: 'fleet-insurance',
            title: 'Commercial Fleet Insurance (COI)',
            category: 'Insurance',
            icon: ShieldCheck,
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-900/40',
            docNumber: equipment?.insurancePolicyNumber || undefined,
            docNumberLabel: 'Policy #',
            expiryDate: equipment?.insuranceExpiryDate ? String(equipment.insuranceExpiryDate).split('T')[0] : undefined,
            fileUrl: equipment?.insuranceCertificateUrl,
            statusLabel: equipment?.insuranceCertificateUrl ? 'Active Policy' : 'Pending',
            hasFile: Boolean(equipment?.insuranceCertificateUrl),
        },
    ];

    const availableCount = documents.filter((d) => d.hasFile).length;

    return (
        <Card className="w-full shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
            <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <Files className="w-3.5 h-3.5 text-[#FF4A1F]" />
                    <span>Driver Compliance Documents</span>
                </CardTitle>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-[3px] shadow-2xs">
                    {availableCount} / {documents.length} Available
                </span>
            </CardHeader>

            <CardContent className="p-2 sm:p-2.5 space-y-1.5 w-full">
                {documents.map((doc) => {
                    const Icon = doc.icon;

                    return (
                        <div
                            key={doc.id}
                            className="w-full px-2.5 py-1.5 sm:py-2 bg-slate-50/60 dark:bg-[#14181f] hover:bg-slate-100/70 dark:hover:bg-[#181d26] rounded-[3px] border border-slate-200/80 dark:border-slate-800/80 transition-colors flex items-center justify-between gap-2.5 min-w-0"
                        >
                            {/* Left: Icon, Title & Meta */}
                            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                <div
                                    className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-[3px] border flex items-center justify-center shrink-0 ${doc.iconBg}`}
                                >
                                    <Icon size={13} className={doc.iconColor} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4
                                            className="text-[11.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate"
                                            title={doc.title}
                                        >
                                            {doc.title}
                                        </h4>
                                        <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700/80 px-1 py-0.2 rounded-[2px] shrink-0">
                                            {doc.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 flex-wrap">
                                        {doc.docNumber && (
                                            <span className="font-mono truncate">
                                                <span className="text-slate-400">{doc.docNumberLabel}:</span> {doc.docNumber}
                                            </span>
                                        )}
                                        {doc.expiryDate && (
                                            <span className="truncate">
                                                <span className="text-slate-400">Exp:</span> {doc.expiryDate}
                                            </span>
                                        )}
                                        {doc.issueDate && (
                                            <span className="truncate hidden md:inline">
                                                <span className="text-slate-400">Issued:</span> {doc.issueDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Status & Actions */}
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <span
                                    className={`inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-[2px] border ${
                                        doc.hasFile
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                    }`}
                                >
                                    {doc.hasFile ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                    <span>{doc.statusLabel}</span>
                                </span>

                                {doc.id === 'cdl' ? (
                                    <div className="flex items-center gap-1">
                                        {doc.frontUrl && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onPreviewDoc({
                                                        isOpen: true,
                                                        title: 'Commercial Driver License (Front)',
                                                        url: doc.frontUrl,
                                                        type: 'CDL Front Document',
                                                    })
                                                }
                                                className="h-6 sm:h-6.5 px-2 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[10.5px] font-bold rounded-[3px] flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer transition-colors"
                                            >
                                                <Eye size={11} className="text-[#FF4A1F]" />
                                                <span>{doc.backUrl ? 'Front' : 'View'}</span>
                                            </button>
                                        )}
                                        {doc.backUrl && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onPreviewDoc({
                                                        isOpen: true,
                                                        title: 'Commercial Driver License (Back)',
                                                        url: doc.backUrl,
                                                        type: 'CDL Back Document',
                                                    })
                                                }
                                                className="h-6 sm:h-6.5 px-2 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[10.5px] font-bold rounded-[3px] flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer transition-colors"
                                            >
                                                <Eye size={11} className="text-[#FF4A1F]" />
                                                <span>Back</span>
                                            </button>
                                        )}
                                        {(doc.frontUrl || doc.backUrl) && (
                                            <a
                                                href={doc.frontUrl || doc.backUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="h-6 sm:h-6.5 px-1.5 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-[3px] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-colors"
                                                title="Download License"
                                            >
                                                <Download size={11} />
                                            </a>
                                        )}
                                        {!doc.frontUrl && !doc.backUrl && (
                                            <span className="text-[10px] text-slate-400 italic">No file</span>
                                        )}
                                    </div>
                                ) : doc.hasFile ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onPreviewDoc({
                                                    isOpen: true,
                                                    title: doc.title,
                                                    url: doc.fileUrl,
                                                    type: doc.id === 'medical-card' ? 'Medical Certificate' : 'Insurance Certificate',
                                                })
                                            }
                                            className="h-6 sm:h-6.5 px-2 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[10.5px] font-bold rounded-[3px] flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer transition-colors"
                                        >
                                            <Eye size={11} className="text-[#FF4A1F]" />
                                            <span>View</span>
                                        </button>
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="h-6 sm:h-6.5 px-1.5 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-[3px] flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-colors"
                                            title="Download Document"
                                        >
                                            <Download size={11} />
                                        </a>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-slate-400 italic">No file</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
