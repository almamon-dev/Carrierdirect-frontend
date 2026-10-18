import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { QUICK_TAGS_SUPPLIER, QUICK_TAGS_CUSTOMER } from './ratingModalConstants';
import { RatingModalStars } from './RatingModalStars';
import { RatingSuccessView } from './RatingSuccessView';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; comment: string; tags: string[] }) => void | Promise<void>;
  orderId?: string | number;
  targetName?: string;
  targetRole?: 'Supplier' | 'Customer';
  orderTitle?: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  orderId = '',
  targetName = 'Supplier',
  targetRole = 'Supplier',
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const formattedOrderId = useMemo(() => {
    if (!orderId && orderId !== 0) return '';
    const str = String(orderId).trim();
    if (!str) return '';
    if (str.startsWith('ORD-') || str.startsWith('INV-') || str.startsWith('#')) {
      return str;
    }
    if (!isNaN(Number(str))) {
      return `ORD-${str.padStart(4, '0')}`;
    }
    return str;
  }, [orderId]);

  if (!isOpen) return null;

  const availableTags = targetRole === 'Supplier' ? QUICK_TAGS_SUPPLIER : QUICK_TAGS_CUSTOMER;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ rating, comment, tags: selectedTags });
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e2329] rounded-xl max-w-[390px] w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center text-[#ff4a1f] shrink-0">
              <Star size={14} className="fill-[#ff4a1f]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Rate {targetRole === 'Supplier' ? 'Carrier & Service' : 'Customer Experience'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{targetName}</span>
                {formattedOrderId && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-500 font-medium">{formattedOrderId}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md p-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {isSubmitted ? (
          <RatingSuccessView targetName={targetName} />
        ) : (
          <form onSubmit={handleSubmit} className="p-3.5 space-y-3 text-xs">
            <RatingModalStars
              rating={rating}
              hoverRating={hoverRating}
              onRatingChange={setRating}
              onHoverChange={setHoverRating}
            />

            {/* Quick Highlight Tags */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#ff4a1f]" /> Quick Highlights
              </label>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#ff4a1f] text-white border-[#ff4a1f] shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={12} className="text-[#ff4a1f]" /> Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Tell us what went well or how ${targetName} can improve...`}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 focus:ring-1 focus:ring-[#ff4a1f]/30 focus:border-[#ff4a1f] outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="inline-flex items-center justify-center h-[30px] px-3.5 rounded-[4px] text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer disabled:opacity-50 box-border leading-none"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-[30px] px-4 rounded-[4px] text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] transition-colors cursor-pointer disabled:opacity-50 gap-1.5 shadow-xs box-border leading-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Feedback</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
