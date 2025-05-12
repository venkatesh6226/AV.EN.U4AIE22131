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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockCorrelation = exports.getAverageStockPrice = void 0;
const stockService_1 = require("../services/stockService");
const getAverageStockPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticker } = req.params;
        const { minutes, aggregation } = req.query;
        if (!ticker || !minutes || aggregation !== "average") {
            return res.status(400).json({ error: "Invalid query parameters." });
        }
        const parsedMinutes = parseInt(minutes);
        if (isNaN(parsedMinutes)) {
            return res.status(400).json({ error: "Invalid minutes parameter" });
        }
        const result = yield (0, stockService_1.getStockAverage)(ticker, parsedMinutes);
        const response = {
            averageStockPrice: result.average,
            priceHistory: result.prices.map((price) => ({
                price: price.price,
                lastUpdatedAt: price.lastUpdatedAt,
            })),
        };
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch stock data." });
    }
});
exports.getAverageStockPrice = getAverageStockPrice;
const getStockCorrelation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minutes, ticker: tickers } = req.query;
        if (!minutes || !tickers) {
            return res.status(400).json({ error: "Missing query parameters." });
        }
        const [rawA, rawB] = Array.isArray(tickers) ? tickers : [tickers];
        const tickerA = rawA;
        const tickerB = rawB;
        if (!tickerA || !tickerB || tickerA === tickerB) {
            return res.status(400).json({ error: "You must provide two different tickers." });
        }
        const parsedMinutes = parseInt(minutes);
        if (isNaN(parsedMinutes)) {
            return res.status(400).json({ error: "Invalid 'minutes' parameter." });
        }
        const dataA = yield (0, stockService_1.getStockAverage)(tickerA, parsedMinutes);
        const dataB = yield (0, stockService_1.getStockAverage)(tickerB, parsedMinutes);
        const correlation = yield (0, stockService_1.getCorrelation)(tickerA, tickerB, parsedMinutes);
        const result = {
            correlation: correlation,
            stocks: {
                [tickerA]: {
                    averagePrice: dataA.average,
                    priceHistory: dataA.prices.map((price) => ({
                        price: price.price,
                        lastUpdatedAt: price.lastUpdatedAt,
                    })),
                },
                [tickerB]: {
                    averagePrice: dataB.average,
                    priceHistory: dataB.prices.map((price) => ({
                        price: price.price,
                        lastUpdatedAt: price.lastUpdatedAt,
                    })),
                },
            },
        };
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to calculate stock correlation." });
    }
});
exports.getStockCorrelation = getStockCorrelation;
