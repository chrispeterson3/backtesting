# Backtesting

backtesting is a library for analyzing stock market data using Polygon.io using [Deno](https://deno.land/)

## Usage

```javascript
import {
  getChartData,
  getStrategyData,
  createCharts,
  mergeData,
} from "./setups/highVolGappers/mod.ts"; // or a setup you define

// pull strategy data
const strategyData = await getStrategyData("2016-12-31", "2022-12-31");

// get chart data
const chartData = await getChartData(strategyData);

// create charts
const charts = await createCharts(chartData);

// merge and massage data
const mergedData = mergeData(strategyData, chartData, charts);

// export data
Deno.writeTextFile(
  `./setups/highVolGappers/data/highVolGappers-dataset.json`,
  JSON.stringify(mergedData)
);
```

## Contributing

I'd love to collaborate on strategy and development
