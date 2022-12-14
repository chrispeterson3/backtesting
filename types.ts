export type Nullable<T> = T | null;

export type TickerData = {
  ticker: string;
  float?: Nullable<number>;
  marketCap?: number;
  sicDescription?: Nullable<string>;
  description?: Nullable<string>;
};
