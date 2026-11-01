/** DART's published "more than 171,000 passengers daily" figure (rounded; not a measured daily count). */
export const DAILY_TRIPS = 171_000;

/** Whole days completed in the year before `now` (local time). Jan 2 → 1, Nov 1 → 304 (non-leap). */
export function completedDaysThisYear(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today.getTime() - start.getTime()) / 86_400_000);
}

/** Estimate = published daily figure × completed days. An estimate, not a DART-reported total. */
export function estimateYtdTrips(now: Date): number {
  return DAILY_TRIPS * completedDaysThisYear(now);
}
