import React from 'react';
import { Paperclip, FileText, Download } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';

interface ViewAttachmentsNotesProps {
    formData: any;
}

export const ViewAttachmentsNotes: React.FC<ViewAttachmentsNotesProps> = ({ formData }) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Attachments & Notes" icon={Paperclip} />

                <ViewField label="Internal Reference" value={formData.internalReference} />

                <SectionHeader title="Attached Documents" icon={Paperclip} />
                <div className="col-span-1 md:col-span-2 space-y-2">
                    {/* Packing List */}
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-500" />
                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    {formData.packingList?.name || 'Packing List'}
                                </p>
                                <p className="text-[11px] text-slate-500">Document specification</p>
                            </div>
                        </div>
                        {formData.packingList?.url ? (
                            <a
                                href={formData.packingList.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                            >
                                <Download size={13} /> Download
                            </a>
                        ) : (
                            <span className="text-xs text-slate-400 font-medium">None Attached</span>
                        )}
                    </div>

                    {/* Commercial Invoice */}
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-500" />
                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    {formData.invoice?.name || 'Commercial Invoice'}
                                </p>
                                <p className="text-[11px] text-slate-500">Commercial pricing document</p>
                            </div>
                        </div>
                        {formData.invoice?.url ? (
                            <a
                                href={formData.invoice.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                            >
                                <Download size={13} /> Download
                            </a>
                        ) : (
                            <span className="text-xs text-slate-400 font-medium">None Attached</span>
                        )}
                    </div>
                </div>

                <SectionHeader title="Special Instructions & Customer Notes" icon={FileText} />
                <ViewField label="Special Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.specialInstructions}</span>} />
                <ViewField label="Customer Notes" colSpan value={<span className="whitespace-pre-wrap">{formData.customerNotes}</span>} />
            </div>
        </div>
    );
};
