import React from "react";
import { AllImages } from "@/components/AllPhotos/AllImages";

const HomeMarquee = () => {
  const reviews = [
    { id: 1, svg: AllImages.Brand1 },
    { id: 2, svg: AllImages.Brand2 },
    { id: 3, svg: AllImages.Brand3 },
    { id: 4, svg: AllImages.Brand4 },
    { id: 5, svg: AllImages.Brand5 },
    { id: 6, svg: AllImages.Brand6 },
    { id: 7, svg: AllImages.Brand7 },
  ];

  return (
    <div className="py-6 bg-white border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-around flex-wrap gap-8 opacity-75">
        {reviews.map((review) => (
          <img
            key={review.id}
            src={review.svg}
            alt={`Brand ${review.id}`}
            className="h-8 object-contain hover:scale-105 transition-transform"
          />
        ))}
      </div>
    </div>
  );
};

export default HomeMarquee;
