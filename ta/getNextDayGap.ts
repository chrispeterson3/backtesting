import { Nullable, Undefineable } from "../types.ts";

export function getNextDayGap(
  close: Undefineable<number>,
  nextDayOpen: Nullable<number>
): Nullable<number> {
  return (
    (close && nextDayOpen && ((nextDayOpen - close) / close) * 100) ?? null
  );
}
