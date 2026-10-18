export const QUICK_TAGS_SUPPLIER = [
  'Punctual Delivery',
  'Careful Handling',
  'Great Communication',
  'Professional Driver',
  'Fair Pricing'
];

export const QUICK_TAGS_CUSTOMER = [
  'Fast Payment',
  'Accurate Cargo Details',
  'Easy Communication',
  'Ready at Pickup',
  'Polite & Professional'
];

export const getRatingFeedback = (val: number) => {
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
