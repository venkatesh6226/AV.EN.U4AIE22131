"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const router = (0, express_1.Router)();
router.get("/correlation", stockController_1.getStockCorrelation);
router.get("/:ticker", stockController_1.getAverageStockPrice);
exports.default = router;
