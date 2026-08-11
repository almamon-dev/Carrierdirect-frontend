import React from 'react';
import { Paperclip, Upload, Eye } from 'lucide-react';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileUpload: (field: 'packingList' | 'invoice', file: File | null) => void;
}

export const AttachmentsNotesSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    handleFileUpload,
}) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                <div className="col-span-1 md:col-span-2">
                    <TabHeader title="Attachments & Additional Notes" icon={Paperclip} />
                </div>

                <FormRow label="Internal Reference" colSpan>
                    <Input name="internalReference" value={formData.internalReference} onChange={handleChange} placeholder="PO-2026-99218" />
                </FormRow>

                <FormRow label="Customer Notes" colSpan>
                    <Textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="General notes for carriers..." rows={3} />
                </FormRow>

                <FormRow label="Special Instructions" colSpan>
                    <Textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Driver or dock gate instructions..." rows={3} />
                </FormRow>

                <FormRow label="Packing List PDF" colSpan>
                    <div className="flex items-center gap-3">
                        <label className="px-3.5 py-1.5 bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-2 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors shrink-0">
                            <Upload size={14} className="text-slate-500 dark:text-slate-400" />
                            <span>Choose Packing List</span>
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload('packingList', e.target.files?.[0] || null)} />
                        </label>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[260px]">
                                {formData.packingList ? formData.packingList.name : 'No file chosen (.pdf, .doc)'}
                            </span>
                            {formData.packingList && (
                                <a
                                    href={URL.createObjectURL(formData.packingList)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 w-fit mt-0.5"
                                >
                                    <Eye size={11} />
                                    <span>View</span>
                                </a>
                            )}
                        </div>
                    </div>
                </FormRow>

                <FormRow label="Commercial Invoice" colSpan>
                    <div className="flex items-center gap-3">
                        <label className="px-3.5 py-1.5 bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-2 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors shrink-0">
                            <Upload size={14} className="text-slate-500 dark:text-slate-400" />
                            <span>Choose Invoice File</span>
                            <input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => handleFileUpload('invoice', e.target.files?.[0] || null)} />
                        </label>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[260px]">
                                {formData.invoice ? formData.invoice.name : 'No file chosen (.pdf, .jpg, .png)'}
                            </span>
                            {formData.invoice && (
                                <a
                                    href={URL.createObjectURL(formData.invoice)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 w-fit mt-0.5"
                                >
                                    <Eye size={11} />
                                    <span>View</span>
                                </a>
                            )}
                        </div>
                    </div>
                </FormRow>
            </div>
        </div>
    );
};
