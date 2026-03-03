const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'StockSense',
    password: 'Haimuti0123',
    port: 5432,
});

app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM stock_history ORDER BY record_date ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get('/api/predictions', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM stock_predictions ORDER BY target_date ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get('/api/evaluations', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT ON (model_used) * FROM model_evaluations 
            ORDER BY model_used, evaluation_date DESC, created_at DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(port, () => {
    console.log(`✅ Server Backend ONN http://localhost:${port}`);
});