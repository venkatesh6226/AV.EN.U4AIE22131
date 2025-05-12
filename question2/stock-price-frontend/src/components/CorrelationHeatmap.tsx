import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CorrelationHeatmap = () => {
  const [tickers, setTickers] = useState(['AAPL', 'MSFT']);
  const [minutes, setMinutes] = useState(10);
  const [correlationData, setCorrelationData] = useState<any>(null);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/stocks/correlation?minutes=${minutes}&ticker=${tickers[0]}&ticker=${tickers[1]}`);
        setCorrelationData(response.data);
      } catch (error) {
        console.error("Error fetching correlation data", error);
      }
    };

    fetchCorrelationData();
  }, [tickers, minutes]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
      </Typography>
      <Typography variant="h6" gutterBottom>
        Stock Pair: {tickers[0]} - {tickers[1]}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Minutes: {minutes}
      </Typography>

      {correlationData && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell>Average Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{tickers[0]}</TableCell>
                <TableCell>{correlationData.stocks[tickers[0]].averagePrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tickers[1]}</TableCell>
                <TableCell>{correlationData.stocks[tickers[1]].averagePrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Correlation</TableCell>
                <TableCell>{correlationData.correlation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CorrelationHeatmap;