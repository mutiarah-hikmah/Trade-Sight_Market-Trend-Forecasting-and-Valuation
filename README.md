# TradeSight - Market Trend Forecasting & Valuation

TradeSight is a full-stack web application designed to fetch, store, forecast, and visualize stock market trends. The application fetches daily stock data (e.g., HMSP.JK), stores it in a PostgreSQL database, and uses Machine Learning models (Linear Regression and Simple Moving Average) to predict future prices. The frontend provides an interactive visualization of both historical data and future predictions.

## Architecture

The project is divided into four main components:

- **Engine (Python)**:
  - Fetches historical stock data using `yfinance`.
  - Analyzes the data using `pandas` and `scikit-learn`.
  - Evaluates models using Mean Absolute Error (MAE), Mean Squared Error (MSE), and Mean Absolute Percentage Error (MAPE).
  - Forecasts the stock prices 7 days into the future.
  - Stores data into a PostgreSQL database via `SQLAlchemy`.

- **Backend (Node.js/Express)**:
  - Connects to the PostgreSQL database.
  - Exposes RESTful APIs (`/api/history`, `/api/predictions`, `/api/evaluations`) for the frontend to consume.

- **Frontend (React)**:
  - Consumes backend APIs using HTTP requests.
  - Visualizes stock history and predictive models interactively using `recharts`.

- **Database (PostgreSQL)**:
  - Stores stock history, predictions, and model evaluation data in a relational schema.

## Prerequisites

Before setting up the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) and `npm`
- [Python](https://www.python.org/) 3.x
- [PostgreSQL](https://www.postgresql.org/) (running on default port 5432)

## Setup & Installation

Follow these steps to set up the project locally:

### 1. Database Configuration
1. Open pgAdmin or your terminal and create a new database named `StockSense`.
2. Locate the database schema at `database/schema.sql`.
3. Execute the SQL script to create the required tables: `stock_history`, `stock_predictions`, and `model_evaluations`.
4. Ensure the database credentials match your setup in `engine/fetch_data.py`, `engine/forecast.py`, and `backend/server.js` (default: User: `postgres`, Password: `Haimuti0123`).

### 2. Python Engine Setup
1. Open a terminal and navigate to the `engine` directory:
   ```bash
   cd engine
   ```
2. Install the necessary Python packages:
   ```bash
   pip install pandas yfinance sqlalchemy scikit-learn psycopg2
   ```
3. Run the data fetching script to download stock data and populate the database:
   ```bash
   python fetch_data.py
   ```
4. Run the forecasting script to generate predictions and evaluate the models:
   ```bash
   python forecast.py
   ```

### 3. Backend Setup
1. Open a new terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   *The server will run on http://localhost:5000.*

### 4. Frontend Setup
1. Open another terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The application will open in your default browser at http://localhost:3000.*

## Deployment

Before sending the project to GitHub, ensure you:
- Do not commit your `.env` or password files containing sensitive database credentials.
- Have run `npm run build` in the `frontend` folder for production frontend builds as needed.
- Have documented any additional required environment variables.
