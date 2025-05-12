"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const StockRoutes_1 = __importDefault(require("./routes/StockRoutes"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "4000", 10);
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Backend server is running with TypeScript!');
});
app.use('/api/stocks', StockRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
