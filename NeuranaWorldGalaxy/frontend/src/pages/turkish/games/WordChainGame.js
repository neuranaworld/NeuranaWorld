import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WordChainGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [userWord, setUserWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    setFeedback(null);
    setUserWord('');

    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/turkish/word-chain/start?user_id=${userId}`);
      setGameId(response.data.game_id);
      setGameData({
        current_word: response.data.current_word,
        last_letter: response.data.last_letter,
        score: response.data.score,
        chain: [response.data.current_word],
      });
      setFeedback({ type: 'info', message: response.data.message });
    } catch (error) {
      console.error('Game start error:', error);
      setFeedback({ type: 'error', message: 'Oyun başlatılamadı' });
    } finally {
      setLoading(false);
    }
  };

  const submitWord = async () => {
    if (!userWord.trim() || !gameId) return;

    try {
      const response = await axios.post(`${API}/games/turkish/word-chain/answer`, {
        game_id: gameId,
        word: userWord.toUpperCase(),
      });

      if (response.data.is_valid) {
        setGameData({
          current_word: response.data.current_word,
          last_letter: response.data.last_letter,
          score: response.data.score,
          chain: response.data.chain,
        });
        setFeedback({ type: 'success', message: response.data.message });
        setUserWord('');
      } else {
        setFeedback({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      console.error('Word submission error:', error);
      setFeedback({ type: 'error', message: `Kelime gönderilemedi: ${error.response?.data?.detail || error.message}` });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userWord.trim()) {
      submitWord();
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🔗 Kelime Türetme</h1>
        {gameData && <p className="subtitle">Puan: {gameData.score}</p>}
      </div>

      {feedback && <div className={`alert ${feedback.type}`} data-testid="feedback-message">{feedback.message}</div>}

      {gameData && (
        <div>
          <div className="card">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Mevcut Kelime:</div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#E91E63',
                  textAlign: 'center',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                }}
                data-testid="current-word"
              >
                {gameData.current_word}
              </div>
            </div>

            <div
              style={{
                padding: '15px',
                background: '#FFF3E0',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '18px', color: '#E65100', fontWeight: 'bold' }}>
                👉 '<span style={{ fontSize: '28px' }} data-testid="last-letter">{gameData.last_letter}</span>' harfi ile başla!
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                Yeni Kelime:
              </label>
              <input
                type="text"
                value={userWord}
                onChange={(e) => setUserWord(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="input"
                placeholder={`${gameData.last_letter} ile başlayan kelime...`}
                disabled={loading}
                data-testid="word-input"
                style={{ textAlign: 'center', fontSize: '20px', textTransform: 'uppercase' }}
              />
            </div>

            <button
              onClick={submitWord}
              disabled={!userWord.trim() || loading}
              className="button"
              style={{ width: '100%', background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' }}
              data-testid="submit-button"
            >
              {loading ? '⌛ Kontrol Ediliyor...' : '✓ Gönder'}
            </button>
          </div>

          {gameData.chain.length > 1 && (
            <div className="card">
              <h3 style={{ marginBottom: '15px', color: '#333' }}>🔗 Kelime Zinciri</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                {gameData.chain.map((word, index) => (
                  <React.Fragment key={index}>
                    <div
                      style={{
                        padding: '10px 15px',
                        background: index === gameData.chain.length - 1 ? '#E91E63' : '#f1f1f1',
                        color: index === gameData.chain.length - 1 ? 'white' : '#333',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      {word}
                    </div>
                    {index < gameData.chain.length - 1 && (
                      <span style={{ fontSize: '20px', color: '#999' }}>→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>💡 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Son harfle başlayan kelime bul</li>
          <li>Daha önce kullanılmamış olmalı</li>
          <li>Geçerli Türkçe kelime olmalı</li>
          <li>Her doğru kelime 10 puan kazanır!</li>
        </ul>
      </div>
    </div>
  );
}
