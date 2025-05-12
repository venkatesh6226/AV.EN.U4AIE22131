import { Router } from "express";
import { getAverageStockPrice, getStockCorrelation } from "../controllers/stockController";

const router = Router();

router.get("/correlation", getStockCorrelation);
router.get("/:ticker", getAverageStockPrice);

export default router;
