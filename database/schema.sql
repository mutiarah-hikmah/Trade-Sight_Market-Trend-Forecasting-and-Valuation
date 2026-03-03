CREATE TABLE stock_predictions (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    target_date DATE NOT NULL,         
    predicted_price NUMERIC(15, 2),    
    model_used VARCHAR(50),           
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_history (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,       
    record_date DATE NOT NULL,         
    open_price NUMERIC(15, 2),         
    high_price NUMERIC(15, 2),         
    low_price NUMERIC(15, 2),          
    close_price NUMERIC(15, 2),        
    volume BIGINT,                     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ticker, record_date)        
);

CREATE TABLE IF NOT EXISTS model_evaluations (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    model_used VARCHAR(50) NOT NULL,
    evaluation_date DATE NOT NULL,
    mae NUMERIC(15, 4),    
    mse NUMERIC(20, 4),    
    mape NUMERIC(10, 4),   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);