export type Nullable<T> = T | null;

export type TickerData = {
  ticker: string;
  float: Nullable<string>;
  marketCap: Nullable<string>;
  sicDescription: Nullable<string>;
  description: Nullable<string>;
};
