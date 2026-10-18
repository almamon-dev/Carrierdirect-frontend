import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, Check, Award, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/button';

interface CustomerRatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    orderNumber: string;
    onSubmit: (data: { rating: number; skills: string[]; comment: string }) => Promise<void>;
    onSkip: () => void;
}

const AVAILABLE_SKILLS = [
    'Prompt Unloading',
    'Accurate Location',
    'Clear Directions',
    'Polite Staff',
    'Safe Facility',
    'Quick Gate Access',
];

export const CustomerRatingModal: React.FC<CustomerRatingModalProps> = ({
    isOpen,
    onClose,
    customerName,
    orderNumber,
    onSubmit,
    onSkip,
}) => {
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['Prompt Unloading', 'Accurate Location']);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                skills: selectedSkills,
                comment,
            });
            onClose();
        } catch (err) {
            console.error('Failed to submit rating', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingDescriptions = ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'];
    const activeRatingIndex = (hoverRating || rating) - 1;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs font-sans antialiased animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-[#1e2329] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] flex items-center justify-center">
                            <Award size={15} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                Rate Facility & Customer Experience
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Load #{orderNumber} • {customerName}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onSkip}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition-colors cursor-pointer"
                        title="Skip for now"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                    {/* Star Rating Section */}
                    <div className="text-center py-1">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            How was your experience delivering to this customer?
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = star <= (hoverRating ?? rating);
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        className="p-1 transition-transform hover:scale-115 focus:outline-hidden cursor-pointer"
                                    >
                                        <Star
                                            size={28}
                                            className={
                                                isFilled
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs transition-colors'
                                                    : 'text-slate-300 dark:text-slate-700 hover:text-amber-300 transition-colors'
                                            }
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1.5 inline-block">
                            {ratingDescriptions[activeRatingIndex] || 'Select Rating'}
                        </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <span>Key Highlights & Customer Skills</span>
                            <span className="text-[10px] font-normal text-slate-400">(Select all that apply)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {AVAILABLE_SKILLS.map((skill) => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${isSelected
                                                ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border-[#FF4A1F]'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {isSelected && <Check size={11} strokeWidth={2.5} />}
                                        <span>{skill}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feedback Comments */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <MessageSquare size={13} className="text-slate-400" />
                            <span>Additional Feedback (Optional)</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add helpful notes for other drivers (e.g. dock entrance, security check, unloading speed)..."
                            rows={3}
                            className="w-full text-xs p-2.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#FF4A1F] resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onSkip}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 px-2 py-1.5 cursor-pointer transition-colors"
                        >
                            Skip
                        </button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold px-4 py-1.5 rounded h-8 cursor-pointer shadow-xs"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
