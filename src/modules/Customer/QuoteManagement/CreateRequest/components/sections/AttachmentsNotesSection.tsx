import React from 'react';
import { Paperclip, Upload } from 'lucide-react';
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <TabHeader title="Attachments & Additional Notes" icon={Paperclip} />
                
                <FormRow label="Internal Reference">
                    <Input name="internalReference" value={formData.internalReference} onChange={handleChange} placeholder="PO-2026-99218" />
                </FormRow>

                <FormRow label="Customer Notes" colSpan>
                    <Textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="General notes for carriers..." rows={3} />
                </FormRow>

                <FormRow label="Special Instructions" colSpan>
                    <Textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Driver or dock gate instructions..." rows={3} />
                </FormRow>

                {/* Attachments Upload */}
                <div className="col-span-1 md:col-span-2 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50 text-center">
                        <Paperclip size={20} className="mx-auto mb-1 text-slate-500" />
                        <span className="text-xs font-bold text-slate-800 block">Packing List PDF</span>
                        <p className="text-[11px] text-slate-500 mb-2">{formData.packingList ? formData.packingList.name : 'No file chosen'}</p>
                        <label className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold cursor-pointer hover:bg-slate-100 inline-flex items-center gap-1 text-slate-700">
                            <Upload size={12} /> Select File
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload('packingList', e.target.files?.[0] || null)} />
                        </label>
                    </div>

                    <div className="border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50 text-center">
                        <Paperclip size={20} className="mx-auto mb-1 text-slate-500" />
                        <span className="text-xs font-bold text-slate-800 block">Commercial Invoice</span>
                        <p className="text-[11px] text-slate-500 mb-2">{formData.invoice ? formData.invoice.name : 'No file chosen'}</p>
                        <label className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold cursor-pointer hover:bg-slate-100 inline-flex items-center gap-1 text-slate-700">
                            <Upload size={12} /> Select File
                            <input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => handleFileUpload('invoice', e.target.files?.[0] || null)} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
