import { Sofa, BedDouble, UtensilsCrossed, Archive, Table2, Briefcase, Settings, type LucideIcon } from "lucide-react";

const MAP: [RegExp, LucideIcon][] = [
  [/sofa|ruang tamu|santai/i, Sofa],
  [/kamar|tidur|bed/i, BedDouble],
  [/makan|dining|meja.*makan/i, UtensilsCrossed],
  [/lemari|wardrobe|cabinet|closet/i, Archive],
  [/kursi|meja|table|chair/i, Table2],
  [/kantor|office/i, Briefcase],
  [/custom/i, Settings],
];

export function categoryIcon(name: string): LucideIcon {
  const hit = MAP.find(([re]) => re.test(name));
  return hit ? hit[1] : Sofa;
}
