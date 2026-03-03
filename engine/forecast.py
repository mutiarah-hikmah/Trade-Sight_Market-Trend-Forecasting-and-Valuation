import os
import pandas as pd
import datetime
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
from dotenv import load_dotenv

load_dotenv()

user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST')
port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')

db_url = f'postgresql://{user}:{password}@{host}:{port}/{db_name}'
mesin_db = create_engine(db_url)

print("Mengambil data historis dari database...")
query = "SELECT record_date, close_price FROM stock_history WHERE ticker = 'HMSP.JK' ORDER BY record_date ASC"
data_saham = pd.read_sql(query, mesin_db)

data_saham['hari_ke'] = range(len(data_saham))
X = data_saham[['hari_ke']] 
y = data_saham['close_price']

print("Menghitung akurasi Simple Moving Average (Baseline)...")
data_saham['SMA_7'] = data_saham['close_price'].rolling(window=7).mean()

sma_data = data_saham.dropna(subset=['SMA_7'])
y_asli_sma = sma_data['close_price']
y_pred_sma = sma_data['SMA_7']

sma_mae = mean_absolute_error(y_asli_sma, y_pred_sma)
sma_mse = mean_squared_error(y_asli_sma, y_pred_sma)
sma_mape = mean_absolute_percentage_error(y_asli_sma, y_pred_sma)

print("Melatih dan menghitung akurasi Linear Regression...")
model_lr = LinearRegression()
model_lr.fit(X, y)

y_pred_lr = model_lr.predict(X)

lr_mae = mean_absolute_error(y, y_pred_lr)
lr_mse = mean_squared_error(y, y_pred_lr)
lr_mape = mean_absolute_percentage_error(y, y_pred_lr)

tanggal_hari_ini = datetime.date.today()
data_evaluasi = [
    {'ticker': 'HMSP.JK', 'model_used': 'SMA (7 Days)', 'evaluation_date': tanggal_hari_ini, 'mae': sma_mae, 'mse': sma_mse, 'mape': sma_mape},
    {'ticker': 'HMSP.JK', 'model_used': 'Linear Regression', 'evaluation_date': tanggal_hari_ini, 'mae': lr_mae, 'mse': lr_mse, 'mape': lr_mape}
]

try:
    pd.DataFrame(data_evaluasi).to_sql('model_evaluations', mesin_db, if_exists='append', index=False)
    print(" Metrik Evaluasi (MAE, MSE, MAPE) berhasil disimpan ke database!")
except Exception as error:
    print(f" Terjadi kesalahan saat menyimpan evaluasi: {error}")

print("Mulai meramal harga 7 hari ke depan...")
hari_terakhir = data_saham['hari_ke'].max()
tanggal_terakhir = data_saham['record_date'].max()
nilai_sma_terakhir = data_saham['SMA_7'].iloc[-1] 

data_prediksi = []

for i in range(1, 8):
    hari_baru = hari_terakhir + i
    tanggal_baru = tanggal_terakhir + datetime.timedelta(days=i)
    tebakan_lr = model_lr.predict(pd.DataFrame({'hari_ke': [hari_baru]}))[0]
    data_prediksi.append({
        'ticker': 'HMSP.JK',
        'target_date': tanggal_baru,
        'predicted_price': round(tebakan_lr, 2),
        'model_used': 'Linear Regression'
    })
    
    data_prediksi.append({
        'ticker': 'HMSP.JK',
        'target_date': tanggal_baru,
        'predicted_price': round(nilai_sma_terakhir, 2),
        'model_used': 'SMA (7 Days)'
    })

tabel_prediksi = pd.DataFrame(data_prediksi)
try:
    tabel_prediksi.to_sql('stock_predictions', mesin_db, if_exists='append', index=False)
    print("Berhasil! memprediksi 7 hari ke depan (dari LR & SMA) masuk ke tabel stock_predictions.")
except Exception as error:
    print(f"Error: {error}")