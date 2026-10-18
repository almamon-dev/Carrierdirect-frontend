import React from 'react';
import { Star } from 'lucide-react';
import { getRatingFeedback } from './ratingModalConstants';

interface RatingModalStarsProps {
  rating: number;
  hoverRating: number | null;
  onRatingChange: (val: number) => void;
  onHoverChange: (val: number | null) => void;
}

export const RatingModalStars: React.FC<RatingModalStarsProps> = ({
  rating,
  hoverRating,
  onRatingChange,
  onHoverChange,
}) => {
  const activeRating = hoverRating !== null ? hoverRating : rating;
  const feedback = getRatingFeedback(activeRating);

  return (
    <div className="flex flex-col items-center justify-center py-2 px-3 bg-slate-50/70 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-1">
      <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
        Tap a star to rate
      </span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeRating;
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => onHoverChange(star)}
              onMouseLeave={() => onHoverChange(null)}
              onClick={() => onRatingChange(star)}
              className="p-0.5 cursor-pointer hover:scale-115 transition-transform"
            >
              <Star
                size={21}
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
        <span className={`text-[11px] font-bold ${feedback.color}`}>
          {feedback.score}
        </span>
        <span className="text-slate-400">•</span>
        <span className={`text-[11px] font-semibold ${feedback.color}`}>
          {feedback.label}
        </span>
      </div>
    </div>
  );
};
