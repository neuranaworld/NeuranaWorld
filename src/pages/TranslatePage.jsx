import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function TranslatePage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('tr');
  const [targetLang, setTargetLang] = useState('en');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'İngilizce', flag: '🇬🇧' },
    { code: 'de', name: 'Almanca', flag: '🇩🇪' },
    { code: 'fr', name: 'Fransızca', flag: '🇫🇷' },
    { code: 'es', name: 'İspanyolca', flag: '🇪🇸' },
    { code: 'it', name: 'İtalyanca', flag: '🇮🇹' },
    { code: 'ja', name: 'Japonca', flag: '🇯🇵' },
    { code: 'zh', name: 'Çince', flag: '🇨🇳' },
    { code: 'ar', name: 'Arapça', flag: '🇸🇦' },
  ];

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API}/llm/translate`, {
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
      });
      setResult(response.data);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Çeviri sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="page-container">
      <div className="header-gradient blue">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🌍 Çeviri</h1>
        <p className="subtitle">Çoklu-LLM Ensemble Çeviri Sistemi</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Kaynak Dil</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="input"
              data-testid="source-lang-select"
              style={{ width: '100%' }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            className="button"
            style={{ marginTop: '25px', padding: '10px 20px' }}
            data-testid="swap-languages-button"
          >
            ⇄
          </button>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Hedef Dil</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="input"
              data-testid="target-lang-select"
              style={{ width: '100%' }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Çevrilecek Metin</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea"
          placeholder="Çevirmek istediğiniz metni buraya yazın..."
          data-testid="translate-input"
        />

        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="button"
          style={{ marginTop: '15px', width: '100%' }}
          data-testid="translate-button"
        >
          {loading ? '🔄 Çevriliyor...' : '🌐 Çevir'}
        </button>
      </div>

      {error && (
        <div className="alert error" data-testid="error-message">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="card" data-testid="translation-result">
          <h3 style={{ marginBottom: '15px', color: '#2196F3' }}>✅ Çeviri Sonucu</h3>
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '15px' }}>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6' }}>{result.answer}</p>
          </div>

          {result.confidence && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Güven Oranı:</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: result.confidence > 0.8 ? '#4CAF50' : '#FFA726' }}>
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
          )}

          {result.model && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              🤖 Model: {result.model}
            </div>
          )}

          {result.alternative && result.alternative !== result.answer && (
            <div style={{ marginTop: '15px', padding: '15px', background: '#FFF3CD', borderRadius: '10px' }}>
              <div style={{ fontWeight: 'bold', color: '#856404', marginBottom: '8px' }}>💡 Alternatif Çeviri:</div>
              <div style={{ color: '#333' }}>{result.alternative}</div>
            </div>
          )}

          {result.warning && (
            <div className="alert warning" style={{ marginTop: '15px' }}>
              ⚠️ {result.warning}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#1976D2' }}>🤖 Ensemble Çeviri Nasıl Çalışır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>GPT-4o ve Claude modelleri aynı anda çevirir</li>
          <li>İki çeviri karşılaştırılır ve benzerlik oranı hesaplanır</li>
          <li>Yüksek benzerlik = Yüksek güven oranı</li>
          <li>Farklı çeviriler size her ikisini de gösterir</li>
        </ul>
      </div>
    </div>
  );
}
