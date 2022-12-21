import { Nullable, Undefineable } from "../types.ts";

export function getDayChange(
  open: Undefineable<number>,
  close: Undefineable<number>
): Nullable<number> {
  return (close && open && ((close - open) / close) * 100) ?? null;
}
