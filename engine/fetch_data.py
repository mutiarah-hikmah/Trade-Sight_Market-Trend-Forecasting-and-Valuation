import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine

db_url = 'postgresql://postgres:Haimuti0123@localhost:5432/StockSense'
mesin_db = create_engine(db_url)

kode_saham = 'HMSP.JK' 
print(f"Mengambil data saham {kode_saham}...")

data_mentah = yf.download(kode_saham, start='2025-01-01', end='2026-03-01')

data_mentah = data_mentah.reset_index()

tabel_rapi = pd.DataFrame()
tabel_rapi['ticker'] = [kode_saham] * len(data_mentah) 
tabel_rapi['record_date'] = data_mentah['Date']
tabel_rapi['open_price'] = data_mentah['Open'].squeeze()
tabel_rapi['high_price'] = data_mentah['High'].squeeze()
tabel_rapi['low_price'] = data_mentah['Low'].squeeze()
tabel_rapi['close_price'] = data_mentah['Close'].squeeze()
tabel_rapi['volume'] = data_mentah['Volume'].squeeze()

print("Menyimpan data ke database PostgreSQL...")
try:
    tabel_rapi.to_sql('stock_history', mesin_db, if_exists='append', index=False)
    print("Berhasil! Data saham sudah masuk ke database.")
except Exception as error:
    print(f"Error: {error}")