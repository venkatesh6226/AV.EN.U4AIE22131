
# Stock Price Aggregation & Correlation Backend

This repository contains the backend implementation for stock price aggregation and correlation analysis. The backend is built using **Node.js** with **TypeScript** and integrates with **Redis** for caching.

## Project Overview

The application provides the following functionalities:

1. **Stock Price Average**: Calculates the average stock price for a given stock ticker over a specified number of minutes.
2. **Stock Correlation**: Calculates the correlation between two different stock tickers based on their price data over a specified time period.
3. **Redis Caching**: To minimize API calls, the stock data and correlation results are cached in **Redis** for efficient data retrieval.

## Requirements

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Redis** (for caching)

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

3. **Set up environment variables**

   Create a `.env` file in the root of the project and add the following environment variables:

   ```env
   EXTERNAL_API_BASE=<external-api-base-url>
   BEARER_TOKEN=<your-bearer-token>
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

   Replace `<external-api-base-url>` and `<your-bearer-token>` with the actual values.

4. **Start the backend server**

   Use **nodemon** for development or **node** for production:

   ```bash
   npm run dev   # For development (with automatic restarts)
   npm start     # For production (after building)
   ```

   The backend will be available at [http://localhost:3001](http://localhost:3001).

## Endpoints

### 1. **GET /api/stocks/{ticker}**

   **Purpose**: Fetch the average stock price for a given ticker over the last `m` minutes.

   **Query Parameters**:
   - `minutes`: Number of minutes for which the stock prices should be aggregated.
   - `aggregation`: Must be `"average"`.

   **Example Request**:
   ```bash
   GET http://localhost:3001/api/stocks/AAPL?minutes=10&aggregation=average
   ```

   **Response**:
   ```json
   {
     "averageStockPrice": 327.33,
     "priceHistory": [
       {
         "price": 262.8346,
         "lastUpdatedAt": "2025-05-12T13:59:51.818709908Z"
       },
       {
         "price": 268.36133,
         "lastUpdatedAt": "2025-05-12T14:05:19.817661425Z"
       },
       {
         "price": 450.80212,
         "lastUpdatedAt": "2025-05-12T14:29:55.817693727Z"
       }
     ]
   }
   ```

### 2. **GET /api/stocks/correlation**

   **Purpose**: Fetch the correlation between two stock tickers.

   **Query Parameters**:
   - `minutes`: Number of minutes for which the correlation should be calculated.
   - `ticker`: Two comma-separated stock tickers (e.g., `AAPL,MSFT`).

   **Example Request**:
   ```bash
   GET http://localhost:3001/api/stocks/correlation?minutes=60&ticker=AAPL,MSFT
   ```

   **Response**:
   ```json
   {
     "correlation": 0.85,
     "stocks": {
       "AAPL": {
         "averagePrice": 327.33,
         "priceHistory": [
           { "price": 262.8346, "lastUpdatedAt": "2025-05-12T13:59:51.818709908Z" },
           { "price": 268.36133, "lastUpdatedAt": "2025-05-12T14:05:19.817661425Z" }
         ]
       },
       "MSFT": {
         "averagePrice": 432.45,
         "priceHistory": [
           { "price": 439.12, "lastUpdatedAt": "2025-05-12T13:53:32Z" },
           { "price": 450.34, "lastUpdatedAt": "2025-05-12T14:00:25Z" }
         ]
       }
     }
   }
   ```

## File Structure

- `src/`
  - `controllers/`: Contains the controllers handling the API logic.
  - `routes/`: Contains the routes and API endpoint definitions.
  - `services/`: Contains the services responsible for fetching stock data and performing calculations.
  - `utils/`: Contains utility functions, such as Redis client.
  - `index.ts`: Main entry point for the server.

## Redis Caching

Redis is used to cache stock data and correlation results. The cache will be used for the following:

- **Stock Data**: The stock prices and the average stock price are cached for `60 seconds`.
- **Correlation Data**: The correlation between two tickers is cached for `60 seconds`.

---

**Note**: The app is designed to minimize API calls by caching data using Redis. Make sure Redis is up and running on the specified host and port in your `.env` file. Used homebrew for redis, it will not work with windows unfortunately. it would be better going with local caching
