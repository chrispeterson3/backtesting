import { FilteredResult } from "./types.ts";

export type HighVolGapperFilter = (
  data: FilteredResult
) => number | boolean | null;

export const filter: HighVolGapperFilter = (data: FilteredResult) => {
  return (
    data &&
    data.volume &&
    data.volume >= 5000000 &&
    data.close &&
    data.close >= 1 &&
    data.floatRotation &&
    data.floatRotation >= 4 &&
    data.gap &&
    data.gap >= 20
  );
};
