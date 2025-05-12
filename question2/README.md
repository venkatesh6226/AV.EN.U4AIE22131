
# Stock Price Aggregation & Correlation Frontend (Question 2)

This repository contains the frontend implementation for displaying stock price aggregation and correlation analysis. The frontend is built using **React**, **Material UI**, and **Recharts** for data visualization.

## Project Overview

The frontend interacts with the backend to fetch stock data, display stock prices, and visualize stock correlations using charts.

### Features
1. **Stock Price Display**: Fetches and displays the average stock price for a given ticker over a specified number of minutes.
2. **Stock Correlation**: Fetches and visualizes the correlation between two different stock tickers over a given time period.

## Requirements

- **Node.js** (version 16 or higher)
- **npm** or **yarn**

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**

   Use **npm** or **yarn** to install the necessary dependencies.

   ```bash
   npm install
   ```

3. **Start the frontend application**

   Run the following command to start the frontend server:

   ```bash
   npm run dev
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

## File Structure

- `src/`
  - `components/`: Contains the React components for displaying stock price and correlation data.
  - `App.tsx`: Main entry point for the frontend.
  - `index.tsx`: The entry point for the React app.

## API Integration

The frontend makes the following API requests:

1. **GET /api/stocks/{ticker}**: Fetches the average stock price for a given ticker over the last `m` minutes.
2. **GET /api/stocks/correlation**: Fetches the correlation between two stock tickers.

## Visualization

- **Stock Price**: Displays the average price and historical price data in a line chart.
- **Correlation**: Displays the correlation between two stock tickers in a table format, with historical data for each ticker.

## Testing

Ensure that the backend is up and running before testing the frontend.

### Testing with Mock Data

You can also run the frontend with mock data if the backend is not available.

---

**Note**: Make sure the frontend is pointing to the correct backend URL (e.g., `http://localhost:3001`) as specified in the API calls.
