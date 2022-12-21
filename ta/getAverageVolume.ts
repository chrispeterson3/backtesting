import { average } from "https://deno.land/x/simplestatistics@v7.7.5/index.js";
import { Undefineable } from "../types.ts";

export function getAverageVolume(
  currentVolume: Undefineable<number>,
  dataset: Array<number>,
  currentPeriod: number,
  lookbackPeriod: number
): number {
  const volumeSubset = dataset.slice(
    currentPeriod - lookbackPeriod,
    currentPeriod + 1
  );

  return average(volumeSubset.length ? volumeSubset : [currentVolume ?? 0]);
}
