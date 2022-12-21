import { Nullable, Undefineable } from "../types.ts";

export function getGap(
  open: Undefineable<number>,
  previousDayClose: Undefineable<number>
): Nullable<number> {
  return (
    (previousDayClose &&
      open &&
      ((open - previousDayClose) / previousDayClose) * 100) ??
    null
  );
}
