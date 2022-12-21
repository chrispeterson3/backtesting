import { Nullable, Undefineable } from "../types.ts";

export function getRange(
  high: Undefineable<number>,
  low: Undefineable<number>
): Nullable<number> {
  return (high && low && ((high - low) / high) * 100) ?? null;
}
