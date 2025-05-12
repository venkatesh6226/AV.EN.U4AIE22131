import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TextField, Button } from '@mui/material';

const StockPage = () => {
  const [ticker, setTicker] = useState('AAPL');
  const [minutes, setMinutes] = useState(10);
  const [stockData, setStockData] = useState<any>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/stocks/${ticker}?minutes=${minutes}&aggregation=average`);
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };

    fetchStockData();
  }, [ticker, minutes]);

  const handleTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value);
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(Number(event.target.value));
  };

  const handleSubmit = () => {
    // You can add any custom logic here
  };

  return (
    <div>
      <h1>Stock Price Aggregation</h1>
      <div>
        <TextField label="Stock Ticker" value={ticker} onChange={handleTickerChange} />
        <TextField label="Minutes" type="number" value={minutes} onChange={handleMinutesChange} />
        <Button variant="contained" onClick={handleSubmit}>Fetch Data</Button>
      </div>

      {stockData && (
        <div>
          <h2>{ticker} Price Data</h2>
          <h3>Average Price: {stockData.averageStockPrice}</h3>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stockData.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdatedAt" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StockPage;