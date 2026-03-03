import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './App.css';

function App() {
  const [dataSaham, setDataSaham] = useState([]);
  const [evaluasi, setEvaluasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, predictRes, evalRes] = await Promise.all([
          axios.get('/history.json'),
          axios.get('/predictions.json'),
          axios.get('/evaluations.json')
        ]);

        setEvaluasi(evalRes.data);

        const dataMap = {};

        historyRes.data.forEach(item => {
          const date = item.record_date.split('T')[0];
          dataMap[date] = { tanggal: date, Harga_Asli: item.close_price };
        });

        predictRes.data.forEach(item => {
          const date = item.target_date.split('T')[0];
          if (!dataMap[date]) {
            dataMap[date] = { tanggal: date };
          }
          dataMap[date][item.model_used] = item.predicted_price;
        });

        const gabunganData = Object.values(dataMap).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
        
        setDataSaham(gabunganData);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff5f7', color: '#d6336c', fontSize: '24px', fontWeight: 'bold' }}>
        Loading TradeSight Dashboard...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff5f7', minHeight: '100vh', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)', marginBottom: '20px' }}>
          <h1 style={{ color: '#d6336c', textAlign: 'center', margin: '0 0 10px 0' }}>
            StockSense Forecasting Dashboard
          </h1>
          <p style={{ color: '#f06595', textAlign: 'center', margin: 0, fontSize: '16px' }}>
            Analisis Komparatif Model & Prediksi Saham HM Sampoerna (HMSP.JK)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {evaluasi.map((model, index) => (
            <div key={index} style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)', minWidth: '250px' }}>
              <h3 style={{ color: '#d6336c', marginTop: 0, borderBottom: '2px solid #ffe3e8', paddingBottom: '10px' }}>
                {model.model_used}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#888' }}>Error Mutlak (MAE):</span>
                {/* Menambahkan Rp pada metrik MAE */}
                <strong style={{ color: '#d6336c' }}>{formatRupiah(model.mae)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#888' }}>Error Kuadrat (MSE):</span>
                <strong style={{ color: '#d6336c' }}>{Number(model.mse).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Persentase Error (MAPE):</span>
                <strong style={{ color: '#d6336c' }}>{(Number(model.mape) * 100).toFixed(2)}%</strong>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)' }}>
          <h3 style={{ color: '#d6336c', marginTop: 0, marginBottom: '20px' }}>Proyeksi Harga 7 Hari Ke Depan</h3>
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSaham} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffe3e8" />
                <XAxis dataKey="tanggal" stroke="#faa2c1" />
                
                <YAxis domain={['auto', 'auto']} stroke="#faa2c1" tickFormatter={(value) => `Rp ${value}`} />

                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff0f3', borderRadius: '10px', border: 'none' }} 
                  formatter={(value) => formatRupiah(value)}
                />
                <Legend />
                
                <Line type="monotone" dataKey="Harga_Asli" name="Harga Historis" stroke="#d6336c" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Linear Regression" name="Prediksi: Linear Regression" stroke="#ff87ab" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls={true} />
                <Line type="monotone" dataKey="SMA (7 Days)" name="Baseline: SMA 7 Hari" stroke="#a5668b" strokeWidth={3} strokeDasharray="3 3" dot={{ r: 4 }} connectNulls={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;