import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import stockRoutes from './routes/StockRoutes';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "4000", 10);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running with TypeScript!');
});

app.use('/api/stocks', stockRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
