import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function MultiAIComparePage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [selectedAIs, setSelectedAIs] = useState(['chatgpt', 'gemini', 'claude']);
  const [detailedMode, setDetailedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [liveStatus, setLiveStatus] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);

  const availableAIs = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', supported: true, badge: 'GPT-4o' },
    { id: 'gemini', name: 'Gemini', icon: '🔷', supported: true, badge: '2.0 Flash' },
    { id: 'claude', name: 'Claude', icon: '📚', supported: true, badge: 'Sonnet 4' },
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleAI = (aiId) => {
    if (selectedAIs.includes(aiId)) {
      setSelectedAIs(selectedAIs.filter(id => id !== aiId));
    } else {
      setSelectedAIs([...selectedAIs, aiId]);
    }
  };

  const selectAll = () => {
    setSelectedAIs(availableAIs.map(ai => ai.id));
  };

  const selectPopular = () => {
    setSelectedAIs(['chatgpt', 'gemini', 'claude']);
  };

  const clearAll = () => {
    setSelectedAIs([]);
  };

  const handleCompare = async () => {
    if (!question.trim() || selectedAIs.length === 0) return;

    setLoading(true);
    setResult(null);
    setLiveStatus({});

    // Initialize live status
    const initialStatus = {};
    selectedAIs.forEach(ai => {
      initialStatus[ai] = { status: '🔄', message: 'İşleniyor...', time: 0 };
    });
    setLiveStatus(initialStatus);

    try {
      const response = await axios.post(`${API}/multi-ai/compare`, {
        question,
        selected_ais: selectedAIs,
        detailed_mode: detailedMode,
      });

      setResult(response.data);

      // Update live status based on results
      const finalStatus = {};
      response.data.responses.forEach(r => {
        const aiId = r.ai_name.toLowerCase();
        if (r.status === 'success') {
          finalStatus[aiId] = { 
            status: '✅', 
            message: `Tamamlandı (${r.response_time.toFixed(1)}s)`,
            time: r.response_time 
          };
        } else if (r.status === 'timeout') {
          finalStatus[aiId] = { 
            status: '❌', 
            message: `Zaman Aşımı (${r.response_time.toFixed(0)}s)`,
            time: r.response_time 
          };
        } else {
          finalStatus[aiId] = { 
            status: '⚠️', 
            message: 'Hata',
            time: r.response_time 
          };
        }
      });
      setLiveStatus(finalStatus);

    } catch (error) {
      console.error('Multi-AI comparison error:', error);
      setResult({
        mode: 'error',
        responses: [],
        recommendation: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'perfect_consensus': return '🎉';
      case 'consensus': return '🎯';
      case 'single': return '💡';
      case 'comparison': return '🤖';
      case 'error': return '❌';
      default: return '📊';
    }
  };

  const getModeTitle = (mode) => {
    switch(mode) {
      case 'perfect_consensus': return '🎉 MÜKEMMEL UYUŞMA!';
      case 'consensus': return 'YÜKSEK KONSENSÜS';
      case 'single': return 'TEK AI SONUCU';
      case 'comparison': return 'SEÇİLİ AI KARŞILAŞTIRMA RAPORU';
      case 'error': return 'İŞLEM HATASI';
      default: return 'SONUÇ';
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">
          ← Ana Menü
        </button>
        <h1 className="title">🤖 Çoklu AI Karşılaştırma</h1>
        <p className="subtitle">Birden fazla AI'dan cevap al ve karşılaştır</p>
      </div>

      {/* AI Seçimi */}
      <div className="card">
        <h3 style={{ marginBottom: '15px', color: '#333' }}>HANGİ AI'LARI KULLANMAK İSTİYORSUNUZ?</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
          {availableAIs.map(ai => (
            <div
              key={ai.id}
              onClick={() => ai.supported && toggleAI(ai.id)}
              style={{
                padding: '12px',
                border: `2px solid ${selectedAIs.includes(ai.id) ? '#4CAF50' : '#ddd'}`,
                borderRadius: '12px',
                background: selectedAIs.includes(ai.id) ? '#E8F5E9' : '#fff',
                cursor: ai.supported ? 'pointer' : 'not-allowed',
                opacity: ai.supported ? 1 : 0.5,
                transition: 'all 0.3s',
                textAlign: 'center',
                position: 'relative',
              }}
              data-testid={`ai-${ai.id}-checkbox`}
            >
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>{ai.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                {selectedAIs.includes(ai.id) ? '✔ ' : ''}{ai.name}
              </div>
              {ai.badge && (
                <div style={{ 
                  fontSize: '10px', 
                  color: ai.supported ? '#4CAF50' : '#999', 
                  marginTop: '3px',
                  fontWeight: ai.supported ? 'bold' : 'normal'
                }}>
                  {ai.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hızlı Seçim Butonları */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={selectAll} className="button" style={{ flex: 1, minWidth: '120px' }}>
            ✅ Tümünü Seç
          </button>
          <button onClick={selectPopular} className="button" style={{ flex: 1, minWidth: '120px' }}>
            🎯 Sadece Popülerler
          </button>
          <button onClick={clearAll} className="button" style={{ flex: 1, minWidth: '120px' }}>
            ❌ Tümünü Temizle
          </button>
        </div>
      </div>

      {/* Detaylı Mod */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>
              🔍 DETAYLI MOD
            </label>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
              {detailedMode ? 'Zaman limiti: 600 saniye (Daha detaylı cevaplar)' : 'Zaman limiti: 60 saniye (Hızlı)'}
            </p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={detailedMode}
              onChange={(e) => setDetailedMode(e.target.checked)}
              style={{ width: '40px', height: '20px', cursor: 'pointer' }}
              data-testid="detailed-mode-toggle"
            />
          </label>
        </div>
      </div>

      {/* Soru Girişi */}
      <div className="card">
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
          Sorunuzu Girin:
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="textarea"
          placeholder="Örn: Yapay zekanın geleceği hakkında ne düşünüyorsunuz?"
          disabled={loading}
          data-testid="question-input"
        />

        <button
          onClick={handleCompare}
          disabled={loading || !question.trim() || selectedAIs.length === 0}
          className="button"
          style={{ marginTop: '15px', width: '100%' }}
          data-testid="compare-button"
        >
          {loading ? (
            <span>
              <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '8px' }}></span>
              Analiz ediliyor... ({elapsedTime.toFixed(1)}s)
            </span>
          ) : (
            `🚀 SEÇİLİ AI'LARA SORU GÖNDER (${selectedAIs.length} AI)`
          )}
        </button>
      </div>

      {/* Canlı Durum */}
      {loading && Object.keys(liveStatus).length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
          <h3 style={{ marginBottom: '15px', color: '#1976D2' }}>⏳ İŞLEM DURUMU</h3>
          {Object.entries(liveStatus).map(([aiId, status]) => {
            const ai = availableAIs.find(a => a.id === aiId);
            return (
              <div key={aiId} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                background: '#fff',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{ai?.icon}</span>
                  <span style={{ fontWeight: 'bold' }}>{ai?.name}:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{status.status}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{status.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sonuçlar */}
      {result && !loading && (
        <div className="card" data-testid="result-card">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>{getModeIcon(result.mode)}</div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>{getModeTitle(result.mode)}</h2>
            <div style={{ 
              background: result.consensus_rate >= 0.8 ? '#E8F5E9' : '#FFF3E0',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {result.recommendation}
            </div>
          </div>

          {/* Konsensüs Bilgisi */}
          {result.consensus_rate !== null && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>UYUŞMA ORANI</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
                {Math.round(result.consensus_rate * 100)}%
              </div>
            </div>
          )}

          {/* Çoğunluk Cevabı */}
          {result.majority_answer && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>
                {result.mode === 'perfect_consensus' ? '✅ ORTAK CEVAP (Tüm AI\'lar):' : '💡 ÇOĞUNLUK CEVABI:'}
              </div>
              <div style={{ 
                background: result.mode === 'perfect_consensus' ? '#E3F2FD' : '#E8F5E9', 
                borderRadius: '12px', 
                padding: '15px', 
                borderLeft: `4px solid ${result.mode === 'perfect_consensus' ? '#2196F3' : '#4CAF50'}` 
              }}>
                <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', margin: 0 }}>
                  {result.majority_answer}
                </p>
              </div>
              {result.mode === 'perfect_consensus' && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  ⭐ {result.responses.filter(r => r.status === 'success').length} AI aynı cevabı verdi - Maksimum güvenilirlik!
                </div>
              )}
            </div>
          )}

          {/* Tüm AI Cevapları - Perfect Consensus'ta gizle */}
          {result.mode !== 'perfect_consensus' && (
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 TÜM AI CEVAPLARI</h3>
            {result.responses.map((response, index) => {
              const ai = availableAIs.find(a => a.name.toUpperCase() === response.ai_name);
              return (
                <div 
                  key={index}
                  style={{
                    background: response.status === 'success' ? '#F1F8E9' : '#FFEBEE',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '12px',
                    border: `2px solid ${response.status === 'success' ? '#8BC34A' : '#F44336'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{ai?.icon}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{response.ai_name}</span>
                    </div>
                    <div style={{ 
                      background: response.status === 'success' ? '#4CAF50' : '#F44336',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {response.status === 'success' ? '✅ Başarılı' : response.status === 'timeout' ? '⏳ Zaman Aşımı' : '❌ Hata'}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '10px' }}>
                    {response.answer || 'Cevap alınamadı'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    ⏱ Süre: {response.response_time.toFixed(2)} saniye
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Detaylı Cevap Göster Butonu - Perfect Consensus için */}
          {result.mode === 'perfect_consensus' && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => {
                  const detailsEl = document.getElementById('detailed-responses');
                  if (detailsEl) {
                    detailsEl.style.display = detailsEl.style.display === 'none' ? 'block' : 'none';
                  }
                }}
                className="button"
                style={{ background: '#E3F2FD', color: '#2196F3', border: '2px solid #2196F3' }}
              >
                📋 Detaylı Cevapları Göster
              </button>
              
              <div id="detailed-responses" style={{ display: 'none', marginTop: '15px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 TÜM AI CEVAPLARI</h3>
                {result.responses.map((response, index) => {
                  const ai = availableAIs.find(a => a.name.toUpperCase() === response.ai_name);
                  return (
                    <div 
                      key={index}
                      style={{
                        background: response.status === 'success' ? '#F1F8E9' : '#FFEBEE',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '12px',
                        border: `2px solid ${response.status === 'success' ? '#8BC34A' : '#F44336'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '24px' }}>{ai?.icon}</span>
                          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{response.ai_name}</span>
                        </div>
                        <div style={{ 
                          background: response.status === 'success' ? '#4CAF50' : '#F44336',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {response.status === 'success' ? '✅ Başarılı' : response.status === 'timeout' ? '⏳ Zaman Aşımı' : '❌ Hata'}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '10px' }}>
                        {response.answer || 'Cevap alınamadı'}
                      </p>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ⏱ Süre: {response.response_time.toFixed(2)} saniye
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toplam Süre */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            ⏱ Toplam İşlem Süresi: {result.total_time.toFixed(2)} saniye
          </div>
        </div>
      )}

      {/* Bilgi Kartı */}
      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>💡 Çoklu AI Karşılaştırma Nasıl Çalışır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Sorunuzu <strong>3 premium AI</strong>'ya aynı anda gönderiyoruz</li>
          <li>✅ <strong>ChatGPT (GPT-4o)</strong> - OpenAI'nin en gelişmiş modeli</li>
          <li>✅ <strong>Gemini (2.0 Flash)</strong> - Google'ın yeni nesil AI'sı</li>
          <li>✅ <strong>Claude (Sonnet 4)</strong> - Anthropic'in güçlü modeli</li>
          <li>Cevapları karşılaştırıp <strong>konsensüs analizi</strong> yapıyoruz</li>
          <li>Tüm AI'lar aynı cevabı verirse → <strong>Tek cevap modu</strong> 🎉</li>
          <li>Detaylı mod ile daha kapsamlı cevaplar alabilirsiniz</li>
        </ul>
      </div>
    </div>
  );
}
