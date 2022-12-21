import { Nullable, Undefineable } from "../types.ts";

export function getChange(
  close: Undefineable<number>,
  previousDayClose: Nullable<number>
): Nullable<number> {
  return (
    (close &&
      previousDayClose &&
      ((close - previousDayClose) / previousDayClose) * 100) ??
    null
  );
}
