import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnitConverter() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('uzunluk');
  const [fromUnit, setFromUnit] = useState('metre');
  const [toUnit, setToUnit] = useState('kilometre');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const categories = {
    uzunluk: {
      units: ['metre', 'kilometre', 'santimetre', 'milimetre', 'mil', 'fit', 'inç'],
      conversions: {
        metre: 1,
        kilometre: 0.001,
        santimetre: 100,
        milimetre: 1000,
        mil: 0.000621371,
        fit: 3.28084,
        inç: 39.3701
      }
    },
    ağırlık: {
      units: ['kilogram', 'gram', 'miligram', 'ton', 'pound', 'ons'],
      conversions: {
        kilogram: 1,
        gram: 1000,
        miligram: 1000000,
        ton: 0.001,
        pound: 2.20462,
        ons: 35.274
      }
    },
    hacim: {
      units: ['litre', 'mililitre', 'metreküp', 'galon', 'bardak'],
      conversions: {
        litre: 1,
        mililitre: 1000,
        metreküp: 0.001,
        galon: 0.264172,
        bardak: 4.22675
      }
    },
    sıcaklık: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      conversions: {} // Özel hesaplama gerekir
    }
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult('Lütfen geçerli bir sayı girin');
      return;
    }

    if (category === 'sıcaklık') {
      let celsius;
      if (fromUnit === 'celsius') celsius = val;
      else if (fromUnit === 'fahrenheit') celsius = (val - 32) * 5/9;
      else celsius = val - 273.15;

      let finalResult;
      if (toUnit === 'celsius') finalResult = celsius;
      else if (toUnit === 'fahrenheit') finalResult = celsius * 9/5 + 32;
      else finalResult = celsius + 273.15;

      setResult(`${finalResult.toFixed(2)} ${toUnit}`);
    } else {
      const convs = categories[category].conversions;
      const inBase = val / convs[fromUnit];
      const converted = inBase * convs[toUnit];
      setResult(`${converted.toFixed(6)} ${toUnit}`);
    }
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">⚖️ Birim Dönüştürücü</h1>
        <p className="subtitle">Tüm birimleri anında dönüştürün</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Kategori Seçin</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {Object.keys(categories).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setFromUnit(categories[cat].units[0]);
                setToUnit(categories[cat].units[1] || categories[cat].units[0]);
                setResult('');
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: category === cat ? '2px solid #667eea' : '2px solid #ddd',
                background: category === cat ? '#667eea' : 'white',
                color: category === cat ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Değer</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Değer girin"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              {categories[category].units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>→</div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Sonuç</label>
            <div style={{
              padding: '12px',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#667eea',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {result || 'Hesaplanıyor...'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              {categories[category].units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={convert}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Dönüştür
        </button>
      </div>
    </div>
  );
}
