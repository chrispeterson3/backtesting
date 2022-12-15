import { sum } from "https://deno.land/x/simplestatistics@v7.7.5/index.js";
import { IAggsResults } from "../../polygon_io_client/mod.ts";
import { Nullable } from "../types.ts";
import { toTimeZone } from "./toTimeZone.ts";

type SessionData = {
  pmSessionHighTime: Nullable<string>;
  pmSessionLowTime: Nullable<string>;
  pmSessionVolume: Nullable<number>;
  sessionHighOfDayTime: Nullable<string>;
  sessionLowOfDayTime: Nullable<string>;
  pmSessionHigh: Nullable<number>;
  pmSessionLow: Nullable<number>;
};

type GetHighLow = (
  prev: IAggsResults | undefined,
  curr: IAggsResults
) => IAggsResults;

const getHigh: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.h && curr && curr.h && prev.h > curr.h ? prev : curr;
};

const getLow: GetHighLow = (prev, curr) => {
  if (!prev) return curr;
  return prev && prev.l && curr && curr.l && prev.l < curr.l ? prev : curr;
};

const getClockTime = (time: number) =>
  toTimeZone(time).getHours() * 100 + toTimeZone(time).getMinutes();

const getStringTime = (time: number) =>
  `${toTimeZone(time).getHours()}:${toTimeZone(time).getMinutes()}`;

export function getSessionData(
  data: Array<IAggsResults> | undefined
): SessionData {
  const pmSession = data?.filter((d) => d.t && getClockTime(d.t) < 925);
  const session = data?.filter(
    (d) => d.t && getClockTime(d.t) >= 925 && getClockTime(d.t) <= 1555
  );

  const pmSessionHigh = pmSession?.reduce(getHigh, [] as IAggsResults);
  const pmSessionLow = pmSession?.reduce(getLow, [] as IAggsResults);
  const sessionHigh = session?.reduce(getHigh, [] as IAggsResults);
  const sessionLow = session?.reduce(getLow, [] as IAggsResults);

  const pmSessionHighTime = pmSessionHigh?.t
    ? getStringTime(pmSessionHigh.t)
    : null;
  const pmSessionLowTime = pmSessionLow?.t
    ? getStringTime(pmSessionLow.t)
    : null;
  const pmSessionVolume = sum(
    pmSession?.map((d) => d.v).filter((n) => n) as Array<number>
  );

  const sessionHighOfDayTime = sessionHigh?.t
    ? getStringTime(sessionHigh.t)
    : null;
  const sessionLowOfDayTime = sessionLow?.t
    ? getStringTime(sessionLow.t)
    : null;

  return {
    pmSessionHighTime,
    pmSessionLowTime,
    pmSessionVolume,
    sessionHighOfDayTime,
    sessionLowOfDayTime,
    pmSessionHigh: pmSessionHigh?.h ?? null,
    pmSessionLow: pmSessionLow?.l ?? null,
  };
}
