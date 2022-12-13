export type Nullable<T> = T | null;

export type TickerData = {
  ticker: string;
  float?: number;
  marketCap?: number;
  sicDescription?: Nullable<string>;
  description?: Nullable<string>;
};
