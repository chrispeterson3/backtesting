import { Undefineable } from "../types.ts";

export function getClosedRed(
  open: Undefineable<number>,
  close: Undefineable<number>
): boolean {
  return !!(open && close && close < open);
}
