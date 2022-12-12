# Backtesting

backtesting is a library for analyzing stock market data using Polygon.io using [Deno](https://deno.land/)

## Usage

```javascript
import { strategy } from "./strategies/*/mod.ts"; // or a strategy you define

// pulls strategy data
// pulls intraday data
// creates charts
// merges data and writes to file
await orchestrateStrategy("2022-12-09", "2022-12-31");
```

## Contributing

I'd love to collaborate on strategy and development
