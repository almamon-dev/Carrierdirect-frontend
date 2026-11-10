import React from "react";
import { AllImages } from "@/components/AllPhotos/AllImages";
import { useLandingCMS } from "../components/useLandingCMS";

const DEFAULT_BRANDS = [
  { id: 1, name: "Meta", svg: AllImages.Brand1 },
  { id: 2, name: "Stripe", svg: AllImages.Brand2 },
  { id: 3, name: "Adidas", svg: AllImages.Brand3 },
  { id: 4, name: "Alibaba.com", svg: AllImages.Brand4 },
  { id: 5, name: "Google", svg: AllImages.Brand5 },
  { id: 6, name: "Apple", svg: AllImages.Brand6 },
  { id: 7, name: "Airbnb", svg: AllImages.Brand7 },
];

const HomeMarquee = () => {
  const { getSection, isSectionEnabled } = useLandingCMS();
  const cmsBrands = getSection("brands") || getSection("trusted_brands") || getSection("testimonials");

  // Check if brands section is enabled in CMS
  if (cmsBrands && cmsBrands.is_active === false) {
    return null;
  }
  if (!isSectionEnabled("brands") && !isSectionEnabled("trusted_brands")) {
    return null;
  }

  const dynamicBrands = cmsBrands?.content?.brands || cmsBrands?.content?.brand_logos;

  const brandList = (Array.isArray(dynamicBrands) && dynamicBrands.length > 0)
    ? dynamicBrands.map((b: any, idx: number) => {
        const fallback = DEFAULT_BRANDS[idx % DEFAULT_BRANDS.length];
        const imageSrc = (b?.img && typeof b.img === "string" && b.img.trim() !== "")
          ? b.img.trim()
          : fallback.svg;

        return {
          id: idx + 1,
          name: b?.name || fallback.name,
          svg: imageSrc,
        };
      })
    : DEFAULT_BRANDS;

  return (
    <div className="py-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-around flex-wrap gap-8 opacity-75 dark:opacity-90">
        {brandList.map((brand) => (
          <img
            key={brand.id}
            src={brand.svg}
            alt={brand.name}
            title={brand.name}
            className="h-8 max-w-[140px] object-contain hover:scale-105 transition-transform dark:brightness-200 dark:contrast-125 dark:invert cursor-pointer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeMarquee;
