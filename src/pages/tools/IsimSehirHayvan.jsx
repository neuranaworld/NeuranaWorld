import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function IsimSehirHayvan() {
  const navigate = useNavigate();
  const [letter, setLetter] = useState('');
  const [answers, setAnswers] = useState({
    isim: '',
    sehir: '',
    hayvan: '',
    esya: '',
    bitki: '',
    ulke: '',
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundScore, setRoundScore] = useState(null);
  const [validationResults, setValidationResults] = useState(null);

  const categories = [
    { key: 'isim', label: 'İsim', icon: '👤' },
    { key: 'sehir', label: 'Şehir', icon: '🏙️' },
    { key: 'hayvan', label: 'Hayvan', icon: '🐾' },
    { key: 'esya', label: 'Eşya', icon: '📦' },
    { key: 'bitki', label: 'Bitki', icon: '🌱' },
  ];

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      endRound();
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    const alphabet = 'ABCDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    setLetter(randomLetter);
    setGameStarted(true);
    setTimeLeft(60);
    setRoundScore(null);
    setValidationResults(null);
    setAnswers({ isim: '', sehir: '', hayvan: '', esya: '', bitki: '' });
  };

  const endRound = async () => {
    setGameStarted(false);
    
    // Backend'e doğrulama isteği gönder
    try {
      const response = await fetch(`${API}/games/isim-sehir-hayvan/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          letter
        })
      });
      
      const validationData = await response.json();
      const totalScore = validationData.total_score || 0;
      
      setScore(score + totalScore);
      setRoundScore(totalScore);
      
      // Sonuçları göster
      setValidationResults(validationData.results);
    } catch (error) {
      console.error('Validation error:', error);
      // Fallback: Basit doğrulama
      let totalScore = 0;
      Object.values(answers).forEach((answer) => {
        if (answer.trim().toUpperCase().startsWith(letter)) {
          totalScore += 10;
        }
      });
      setScore(score + totalScore);
      setRoundScore(totalScore);
    }
  };

  const handleInputChange = (category, value) => {
    setAnswers({ ...answers, [category]: value });
  };

  return (
    <div className="page-container">
      <div className="header-gradient green">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🎯 İsim-Şehir-Hayvan-Eşya</h1>
        <p className="subtitle">
          {gameStarted ? `Süre: ${timeLeft}s` : `Toplam Puan: ${score}`}
        </p>
      </div>

      {!gameStarted && (
        <div className="card" style={{ textAlign: 'center' }}>
          {roundScore !== null && (
            <div>
              <div className="alert success" style={{ marginBottom: '20px' }}>
                🎉 Bu turda {roundScore} puan kazandınız!
              </div>
              
              {validationResults && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 Detaylı Sonuçlar:</h3>
                  {Object.entries(validationResults).map(([category, result]) => (
                    <div
                      key={category}
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        borderRadius: '10px',
                        background: result.is_valid ? '#E8F5E9' : '#FFEBEE',
                        borderLeft: `4px solid ${result.is_valid ? '#4CAF50' : '#F44336'}`,
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', textTransform: 'capitalize' }}>
                        {category}: {answers[category]}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <div>
                          <strong>Karar:</strong> {result.karar} ({result.guven}% güven)
                        </div>
                        <div>
                          <strong>Gerekçe:</strong> {result.gerekce}
                        </div>
                        {result.kanit_notu !== '—' && (
                          <div>
                            <strong>Kanıt:</strong> {result.kanit_notu}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={startGame} className="button green" style={{ fontSize: '20px', padding: '20px 40px', marginTop: '20px' }}>
            🎮 Oyunu Başlat
          </button>
        </div>
      )}

      {gameStarted && (
        <div>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
            <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '10px' }}>{letter}</div>
            <div style={{ fontSize: '18px' }}>Bu harfle başlayan kelimeleri yaz!</div>
          </div>

          <div className="card">
            {categories.map((cat) => (
              <div key={cat.key} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>
                  {cat.icon} {cat.label}:
                </label>
                <input
                  type="text"
                  value={answers[cat.key]}
                  onChange={(e) => handleInputChange(cat.key, e.target.value)}
                  className="input"
                  placeholder={`${letter} ile başlayan ${cat.label.toLowerCase()}...`}
                  data-testid={`input-${cat.key}`}
                />
              </div>
            ))}

            <button onClick={endRound} className="button orange" style={{ width: '100%', fontSize: '18px' }}>
              ⏸ Tamamla
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#2E7D32' }}>💡 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Verilen harfle başlayan kelimeleri yaz</li>
          <li>5 kategori: İsim, Şehir, Hayvan, Eşya, Bitki</li>
          <li>60 saniye süren var</li>
          <li>Her doğru kelime puan kazanır!</li>
          <li>Kelimeler doğrulama sisteminden geçer</li>
        </ul>
      </div>
    </div>
  );
}
