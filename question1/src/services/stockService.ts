import axios from "axios";
import redisClient from "../utils/redisClient";

const BASE_URL = process.env.EXTERNAL_API_BASE;
const TOKEN = process.env.BEARER_TOKEN;

export const getStockAverage = async (ticker: string, minutes: number) => {
  const cacheKey = `stock-${ticker}-${minutes}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const url = `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const prices = Array.isArray(response.data) ? response.data : [];
    if (!prices.length) {
      throw new Error("No price data available.");
    }

    const total = prices.reduce((sum: number, p: any) => sum + p.price, 0);
    const average = prices.length > 0 ? parseFloat((total / prices.length).toFixed(2)) : 0;

    const result = {
      ticker,
      average,
      prices,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
    return result;

  } catch (err: any) {
    throw new Error("Failed to fetch stock data.");
  }
};

const pearsonCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

  return denominator === 0 ? 0 : parseFloat((numerator / denominator).toFixed(4));
};

export const getCorrelation = async (tickerA: string, tickerB: string, minutes: number) => {
  const key = `correlation-${tickerA}-${tickerB}-${minutes}`;
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const dataA = await getStockAverage(tickerA, minutes);
  const dataB = await getStockAverage(tickerB, minutes);

  const mapA: Map<string, number> = new Map(dataA.prices.map((p: any) => [p.timestamp, p.price]));
  const x: number[] = [];
  const y: number[] = [];

  dataB.prices.forEach((p: any) => {
    if (mapA.has(p.timestamp)) {
      x.push(mapA.get(p.timestamp)!);
      y.push(p.price);
    }
  });

  const correlation = pearsonCorrelation(x, y);

  const result = {
    correlation,
  };

  await redisClient.setEx(key, 60, JSON.stringify(result));
  return result;
};