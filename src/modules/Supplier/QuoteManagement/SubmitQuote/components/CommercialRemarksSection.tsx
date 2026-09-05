import React, { useState } from 'react';
import { FileText, Sparkles, X, Plus, Check } from 'lucide-react';
import FormLabel from '@/components/ui/label';
import { FREIGHT_TEMPLATES, POPULAR_CLAUSES } from '../utils/freightTemplates';

export interface CommercialRemarksSectionProps {
    notes: string;
    onChange: (notes: string) => void;
    isExpired: boolean;
}

export const CommercialRemarksSection: React.FC<CommercialRemarksSectionProps> = ({
    notes,
    onChange,
    isExpired,
}) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId);
        if (!templateId) return;
        const tmpl = FREIGHT_TEMPLATES.find((t) => t.id === templateId);
        if (tmpl) onChange(tmpl.text);
    };

    const handleAddClause = (clauseText: string) => {
        if (isExpired || notes.includes(clauseText)) return;
        if (!notes.trim()) {
            onChange(`• ${clauseText}`);
        } else {
            onChange(`${notes.trim()}\n• ${clauseText}`);
        }
    };

    const handleClear = () => {
        onChange('');
        setSelectedTemplateId('');
    };

    return (
        <div className="space-y-1.5 font-sans">
            <div className="flex items-center justify-between gap-2">
                <FormLabel className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0 flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400" />
                    <span>Commercial Remarks</span>
                </FormLabel>

                <div className="flex items-center gap-2">
                    {!isExpired && (
                        <select
                            value={selectedTemplateId}
                            onChange={(e) => handleTemplateSelect(e.target.value)}
                            className="text-[11px] h-6 px-1.5 py-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-600 dark:text-slate-300 focus:outline-none focus:border-slate-400 cursor-pointer font-normal"
                        >
                            <option value="">⚡ Load template...</option>
                            {FREIGHT_TEMPLATES.map((tmpl) => (
                                <option key={tmpl.id} value={tmpl.id}>
                                    {tmpl.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {notes && !isExpired && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-[10.5px] text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-normal cursor-pointer transition-colors flex items-center gap-0.5"
                            title="Clear remarks"
                        >
                            <X size={10.5} /> Clear
                        </button>
                    )}
                </div>
            </div>

            <textarea
                disabled={isExpired}
                placeholder={
                    isExpired
                        ? 'This quote request has expired.'
                        : 'Specify terms, delivery conditions, or pick a template above...'
                }
                rows={2}
                className="w-full px-2.5 py-1.5 text-xs rounded-[3px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#181d24] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 dark:focus:border-slate-300 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed font-normal leading-relaxed resize-none transition-colors"
                value={notes}
                onChange={(e) => onChange(e.target.value)}
            />

            {!isExpired && (
                <div className="flex flex-wrap items-center gap-1 pt-0.5 max-w-full">
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5 mr-0.5 shrink-0">
                        <Sparkles size={10} className="text-amber-500" />
                        Quick:
                    </span>
                    {POPULAR_CLAUSES.map((clause, idx) => {
                        const isAdded = notes.includes(clause.text);
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddClause(clause.text)}
                                disabled={isAdded}
                                className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-normal transition-all border flex items-center gap-0.5 cursor-pointer ${
                                    isAdded
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 cursor-default opacity-85'
                                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80'
                                }`}
                            >
                                {isAdded ? (
                                    <Check size={9} className="text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <Plus size={9} className="text-slate-400" />
                                )}
                                <span>{clause.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CommercialRemarksSection;
