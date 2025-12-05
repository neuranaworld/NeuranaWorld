import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function DeepThinkPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDeepThink = async () => {
    if (!question.trim()) return;

    setThinking(true);
    setResult(null);
    setShowExplanation(false);

    try {
      const response = await axios.post(`${API}/llm/deep-think`, {
        question,
        subject: 'math',
        mode: 'deep',
      });
      setResult(response.data);
    } catch (error) {
      console.error('Deep thinking error:', error);
      setResult({
        answer: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        confidence: 0,
        error: true,
      });
    } finally {
      setThinking(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return '#4CAF50';
    if (confidence >= 0.7) return '#FFA726';
    return '#F44336';
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🧠 Derin Düşünme Modu</h1>
        <p className="subtitle">Zaman limiti yok | %0 Hata hedefi</p>
      </div>

      <div className="card">
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
          Matematiksel Probleminizi Girin:
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="textarea"
          placeholder="Örn: 25 × (12 + 8) = ?"
          disabled={thinking}
          data-testid="question-input"
        />

        <button
          onClick={handleDeepThink}
          disabled={thinking || !question.trim()}
          className="button"
          style={{ marginTop: '15px', width: '100%' }}
          data-testid="analyze-button"
        >
          {thinking ? (
            <span>
              <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '8px' }}></span>
              Düşünüyorum...
            </span>
          ) : (
            '🔍 Analiz Et'
          )}
        </button>
      </div>

      {thinking && (
        <div className="alert warning">
          <h3 style={{ marginBottom: '10px' }}>⌛ Derin Düşünme Aktif</h3>
          <p style={{ marginBottom: '8px' }}>
            Sistem şu anda problemi analiz ediyor. Bu işlem birkaç saniye sürebilir.
          </p>
          <p style={{ fontStyle: 'italic' }}>💡 Donmadı — düşünüyor.</p>
        </div>
      )}

      {result && !thinking && (
        <div className="card" data-testid="result-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#333' }}>✅ Sonuç</h3>
            {result.confidence > 0 && (
              <div
                style={{
                  background: getConfidenceColor(result.confidence),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {Math.round(result.confidence * 100)}% Güven
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>📊 Cevap:</div>
            <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '15px', borderLeft: '4px solid #4CAF50' }}>
              <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', fontWeight: 'bold' }} data-testid="answer-text">{result.answer}</p>
            </div>
          </div>

          {result.model && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              🤖 Model: {result.model}
            </div>
          )}

          {result.confidence < 0.9 && result.confidence > 0 && (
            <div className="alert warning">
              ⚠️ Bu sonuç kesin değil. Güven oranı düşük.
            </div>
          )}

          {result.verification && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="button"
              style={{ marginTop: '15px', width: '100%' }}
              data-testid="explanation-button"
            >
              {showExplanation ? '▲ Açıklamayı Gizle' : '🤔 Neden? (Açıklama)'}
            </button>
          )}

          {showExplanation && result.verification && (
            <div style={{ background: '#E3F2FD', borderRadius: '12px', padding: '15px', marginTop: '15px' }} data-testid="explanation-box">
              <h4 style={{ color: '#1976D2', marginBottom: '10px' }}>📚 Adım Adım Açıklama:</h4>
              <p style={{ color: '#333', lineHeight: '1.6' }}>{result.verification}</p>
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>💡 Derin Düşünme Nasıl Çalışır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Zaman sınırsız analiz</li>
          <li>Çoklu AI modeli (GPT-4o + Claude doğrulama)</li>
          <li>Her adımın açıklaması</li>
          <li>Güven oranı göstergesi</li>
          <li>Emin olmadan yanıt vermez</li>
        </ul>
      </div>
    </div>
  );
}
