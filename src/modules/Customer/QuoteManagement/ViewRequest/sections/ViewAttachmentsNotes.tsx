import React from 'react';
import { Paperclip, FileText, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';

interface ViewAttachmentsNotesProps {
    formData: any;
}

export const ViewAttachmentsNotes: React.FC<ViewAttachmentsNotesProps> = ({ formData }) => {
    const hasImages = Array.isArray(formData.images) && formData.images.length > 0;

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Attachments & Notes" icon={Paperclip} />

                <ViewField label="Internal Reference" value={formData.internalReference} />

                <SectionHeader title="Attached Documents" icon={Paperclip} />
                <div className="col-span-1 md:col-span-2 space-y-2">
                    {/* Packing List */}
                    <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-500" />
                            <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                    {formData.packingList?.name || 'Packing List'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Document specification</p>
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
                    <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-500" />
                            <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                    {formData.invoice?.name || 'Commercial Invoice'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Commercial pricing document</p>
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

                {hasImages && (
                    <>
                        <SectionHeader title="Cargo Photos" icon={ImageIcon} />
                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                            {formData.images.map((img: any, idx: number) => {
                                const url = typeof img === 'string' ? img : img?.url;
                                const name = img?.name || `Photo ${idx + 1}`;
                                if (!url) return null;
                                return (
                                    <div key={idx} className="group relative border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video flex flex-col justify-end">
                                        <img src={url} alt={name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                        <div className="relative z-10 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-[10px]">
                                            <span className="truncate">{name}</span>
                                            <a href={url} target="_blank" rel="noreferrer" className="p-1 hover:text-brand transition-colors">
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <SectionHeader title="Special Instructions & Customer Notes" icon={FileText} />
                <ViewField label="Special Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.specialInstructions}</span>} />
                <ViewField label="Customer Notes" colSpan value={<span className="whitespace-pre-wrap">{formData.customerNotes}</span>} />
            </div>
        </div>
    );
};
