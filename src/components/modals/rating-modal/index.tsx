import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, X, MessageSquare, Loader2, Sparkles } from 'lucide-react';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; comment: string; tags: string[] }) => void | Promise<void>;
  orderId?: string | number;
  targetName?: string;
  targetRole?: 'Supplier' | 'Customer';
  orderTitle?: string;
}

const QUICK_TAGS_SUPPLIER = [
  'Punctual Delivery',
  'Careful Handling',
  'Great Communication',
  'Professional Driver',
  'Fair Pricing'
];

const QUICK_TAGS_CUSTOMER = [
  'Fast Payment',
  'Accurate Cargo Details',
  'Easy Communication',
  'Ready at Pickup',
  'Polite & Professional'
];

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  orderId = '',
  targetName = 'Supplier',
  targetRole = 'Supplier',
  orderTitle = 'Logistics Cargo Dispatch'
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Format order ID gracefully (e.g. "2" becomes "ORD-0002")
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

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return { label: 'Outstanding Experience', score: '5.0', color: 'text-amber-500' };
      case 4:
        return { label: 'Very Good Service', score: '4.0', color: 'text-amber-500' };
      case 3:
        return { label: 'Average Experience', score: '3.0', color: 'text-amber-600' };
      case 2:
        return { label: 'Needs Improvement', score: '2.0', color: 'text-orange-500' };
      case 1:
        return { label: 'Poor Experience', score: '1.0', color: 'text-red-500' };
      default:
        return { label: 'Select Rating', score: `${val}.0`, color: 'text-slate-500' };
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;
  const feedback = getRatingFeedback(activeRating);

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e2329] rounded-xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center text-[#ff4a1f] shrink-0">
              <Star size={16} className="fill-[#ff4a1f]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Rate {targetRole === 'Supplier' ? 'Carrier & Service' : 'Customer Experience'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
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
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 px-6 flex flex-col items-center justify-center text-center space-y-2.5">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Rating Submitted!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Thank you! Your feedback for <strong className="text-slate-700 dark:text-slate-200">{targetName}</strong> has been successfully recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Interactive Rating Section */}
            <div className="flex flex-col items-center justify-center py-2.5 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Tap a star to rate
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer hover:scale-115 transition-transform"
                    >
                      <Star
                        size={26}
                        className={`transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className={`text-xs font-bold ${feedback.color}`}>
                  {feedback.score}
                </span>
                <span className="text-slate-400">•</span>
                <span className={`text-xs font-semibold ${feedback.color}`}>
                  {feedback.label}
                </span>
              </div>
            </div>

            {/* Quick Highlight Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#ff4a1f]" /> Quick Highlights
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#ff4a1f]" /> Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Tell us what went well or how ${targetName} can improve...`}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 focus:ring-2 focus:ring-[#ff4a1f]/20 focus:border-[#ff4a1f] outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="inline-flex items-center justify-center h-[34px] px-4 rounded-[4px] text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer disabled:opacity-50 box-border leading-none"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-[34px] px-5 rounded-[4px] text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] transition-colors cursor-pointer disabled:opacity-50 gap-1.5 shadow-xs box-border leading-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
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
