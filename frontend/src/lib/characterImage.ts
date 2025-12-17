export function getCatImageByLevel(level: number) {
  if (level >= 40) return "/cat/cat_crown.png";
  if (level >= 10) return "/cat/cat_ribbon.png";
  return "/cat/catpt.png";
}