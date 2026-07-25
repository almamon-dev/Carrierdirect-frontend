import React, { useState } from 'react';
import { Star, CheckCircle2, X, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; comment: string; tags: string[] }) => void;
  orderId?: string;
  targetName?: string;
  targetRole?: 'Supplier' | 'Customer';
  orderTitle?: string;
}

const QUICK_TAGS_SUPPLIER = [
  'Punctual Delivery',
  'Careful Cargo Handling',
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
  orderId = 'ORD-2026-9912',
  targetName = 'Express Freight Logistics',
  targetRole = 'Supplier',
  orderTitle = 'Dhaka to Chittagong Heavy Transport'
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const availableTags = targetRole === 'Supplier' ? QUICK_TAGS_SUPPLIER : QUICK_TAGS_CUSTOMER;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, comment, tags: selectedTags });
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
    >
      {isSubmitted ? (
        <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Thank You for Your Feedback!</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Your rating and review for <strong className="text-slate-800">{targetName}</strong> have been recorded successfully.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 font-sans antialiased">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-3.5 rounded-lg border border-orange-100 text-center space-y-1">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-[#ff4a1f] text-white rounded-full mb-1">
              <Award size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Order Completed!</h2>
            <p className="text-xs text-slate-600 font-medium">
              Rate your experience with <span className="font-bold text-[#ff4a1f]">{targetName}</span>
            </p>
            <div className="pt-1 flex items-center justify-center gap-2 text-[10.5px] text-slate-500">
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{orderId}</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{orderTitle}</span>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center space-y-2 py-2">
            <label className="text-xs font-bold text-slate-700 block">Overall Rating</label>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = hoverRating !== null ? hoverRating : rating;
                const isFilled = star <= currentRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-bold text-amber-600 h-4">
              {rating === 5 && '🌟 Outstanding Experience!'}
              {rating === 4 && '👍 Very Good Service!'}
              {rating === 3 && '😐 Average Experience'}
              {rating === 2 && '👎 Needs Improvement'}
              {rating === 1 && '⚠️ Poor Service'}
            </p>
          </div>

          {/* Quick Compliment Tags */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <ThumbsUp size={12} className="text-[#ff4a1f]" /> Quick Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer border ${
                      isSelected
                        ? 'bg-[#ff4a1f] text-white border-[#ff4a1f]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Review Textarea */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <MessageSquare size={12} className="text-[#ff4a1f]" /> Detailed Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share more details about working with ${targetName}...`}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#ff4a1f] focus:border-[#ff4a1f] outline-none text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 text-xs font-semibold px-3 cursor-pointer"
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs font-bold px-4 bg-[#ff4a1f] hover:bg-[#e63d15] text-white cursor-pointer shadow-2xs"
            >
              Submit Rating
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
