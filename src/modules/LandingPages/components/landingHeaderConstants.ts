export const NAVIGATION_LINKS = [
  { id: 1, navigationText: "Home", sectionId: "home" },
  { id: 2, navigationText: "Features", sectionId: "features" },
  { id: 3, navigationText: "Pricing", sectionId: "pricing" },
  { id: 4, navigationText: "How it Works", sectionId: "how-it-works" },
  { id: 5, navigationText: "Carriers", sectionId: "supplier" },
];

export function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
