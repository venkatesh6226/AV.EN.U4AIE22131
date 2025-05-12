import { Request, Response } from "express";
import { getStockAverage, getCorrelation } from "../services/stockService";

export const getAverageStockPrice = async (req: Request, res: Response) => {
  try {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    if (!ticker || !minutes || aggregation !== "average") {
      return res.status(400).json({ error: "Invalid query parameters." });
    }

    const parsedMinutes = parseInt(minutes as string);
    if (isNaN(parsedMinutes)) {
      return res.status(400).json({ error: "Invalid minutes parameter" });
    }

    const result = await getStockAverage(ticker, parsedMinutes);

    const response = {
      averageStockPrice: result.average,
      priceHistory: result.prices.map((price: any) => ({
        price: price.price,
        lastUpdatedAt: price.lastUpdatedAt,
      })),
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch stock data." });
  }
};

export const getStockCorrelation = async (req: Request, res: Response) => {
  try {
    const { minutes, ticker: tickers } = req.query;

    if (!minutes || !tickers) {
      return res.status(400).json({ error: "Missing query parameters." });
    }

    const [rawA, rawB] = Array.isArray(tickers) ? tickers : [tickers];
    const tickerA = rawA as string;
    const tickerB = rawB as string;

    if (!tickerA || !tickerB || tickerA === tickerB) {
      return res.status(400).json({ error: "You must provide two different tickers." });
    }

    const parsedMinutes = parseInt(minutes as string);
    if (isNaN(parsedMinutes)) {
      return res.status(400).json({ error: "Invalid 'minutes' parameter." });
    }

    const dataA = await getStockAverage(tickerA, parsedMinutes);
    const dataB = await getStockAverage(tickerB, parsedMinutes);

    const correlation = await getCorrelation(tickerA, tickerB, parsedMinutes);

    const result = {
      correlation: correlation,
      stocks: {
        [tickerA]: {
          averagePrice: dataA.average,
          priceHistory: dataA.prices.map((price: any) => ({
            price: price.price,
            lastUpdatedAt: price.lastUpdatedAt,
          })),
        },
        [tickerB]: {
          averagePrice: dataB.average,
          priceHistory: dataB.prices.map((price: any) => ({
            price: price.price,
            lastUpdatedAt: price.lastUpdatedAt,
          })),
        },
      },
    };

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to calculate stock correlation." });
  }
};