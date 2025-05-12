import React from 'react';
import StockPage from './components/StockPage';
import CorrelationHeatmap from './components/CorrelationHeatmap';

const App = () => {
  return (
    <div>
      <h1>Stock Price Aggregation Web Application</h1>
      <StockPage />
      <CorrelationHeatmap />
    </div>
  );
};

export default App;