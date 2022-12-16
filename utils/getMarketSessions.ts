import { IAggsResults } from "../../polygon_io_client/mod.ts";
import { StrategyBarsResult } from "../strategy/getStrategyBars.ts";

type MarketSessions = {
  nextDay: IAggsResults;
  previousDay: IAggsResults;
};

export function getMarketSessions(
  session: StrategyBarsResult,
  dataset: Array<StrategyBarsResult>
): MarketSessions {
  const previousDay: IAggsResults =
    dataset.find(
      (d) =>
        d.t &&
        session.t &&
        d.t === session.t - 86400000 && // minus 24 hours
        session.ticker === d.ticker
    ) ?? {};

  const nextDay: IAggsResults =
    dataset.find(
      (d) =>
        d.t &&
        session.t &&
        d.t === session.t + 86400000 && // plus 24 hours
        session.ticker === d.ticker
    ) ?? {};

  return {
    previousDay,
    nextDay,
  };
}
