"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrelation = exports.getStockAverage = void 0;
const axios_1 = __importDefault(require("axios"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const BASE_URL = process.env.EXTERNAL_API_BASE;
const TOKEN = process.env.BEARER_TOKEN;
const getStockAverage = (ticker, minutes) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `stock-${ticker}-${minutes}`;
    const cached = yield redisClient_1.default.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    try {
        const url = `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`;
        const response = yield axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const prices = Array.isArray(response.data) ? response.data : [];
        if (!prices.length) {
            throw new Error("No price data available.");
        }
        const total = prices.reduce((sum, p) => sum + p.price, 0);
        const average = prices.length > 0 ? parseFloat((total / prices.length).toFixed(2)) : 0;
        const result = {
            ticker,
            average,
            prices,
        };
        yield redisClient_1.default.setEx(cacheKey, 60, JSON.stringify(result));
        return result;
    }
    catch (err) {
        throw new Error("Failed to fetch stock data.");
    }
});
exports.getStockAverage = getStockAverage;
const pearsonCorrelation = (x, y) => {
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
const getCorrelation = (tickerA, tickerB, minutes) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `correlation-${tickerA}-${tickerB}-${minutes}`;
    const cached = yield redisClient_1.default.get(key);
    if (cached) {
        return JSON.parse(cached);
    }
    const dataA = yield (0, exports.getStockAverage)(tickerA, minutes);
    const dataB = yield (0, exports.getStockAverage)(tickerB, minutes);
    const mapA = new Map(dataA.prices.map((p) => [p.timestamp, p.price]));
    const x = [];
    const y = [];
    dataB.prices.forEach((p) => {
        if (mapA.has(p.timestamp)) {
            x.push(mapA.get(p.timestamp));
            y.push(p.price);
        }
    });
    const correlation = pearsonCorrelation(x, y);
    const result = {
        correlation,
    };
    yield redisClient_1.default.setEx(key, 60, JSON.stringify(result));
    return result;
});
exports.getCorrelation = getCorrelation;
