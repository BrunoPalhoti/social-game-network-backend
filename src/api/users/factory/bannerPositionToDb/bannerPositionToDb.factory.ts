export function bannerPositionToDb(
  bannerPosition?: 'top' | 'center' | 'bottom' | number,
): string | null {
  if (bannerPosition === undefined) return null;
  if (typeof bannerPosition === 'number') {
    return Number.isFinite(bannerPosition)
      ? String(Math.round(bannerPosition))
      : null;
  }
  return bannerPosition;
}
