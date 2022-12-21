import { Nullable } from "../types.ts";

export function getFollowingRedDay(
  nextDayOpen: Nullable<number>,
  nextDayClose: Nullable<number>
): boolean {
  return !!(nextDayOpen && nextDayClose && nextDayClose < nextDayOpen);
}
