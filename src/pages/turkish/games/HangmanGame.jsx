import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function HangmanGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const turkishAlphabet = 'ABCDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async (difficulty = 'kolay') => {
    setLoading(true);
    setFeedback(null);

    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/turkish/hangman/start?user_id=${userId}&difficulty=${difficulty}`);
      setGameId(response.data.game_id);
      setGameData({
        hint: response.data.hint,
        display_word: response.data.display_word,
        remaining_attempts: response.data.remaining_attempts,
        guessed_letters: [],
        game_status: 'active',
      });
    } catch (error) {
      console.error('Game start error:', error);
      setFeedback({ type: 'error', message: 'Oyun başlatılamadı' });
    } finally {
      setLoading(false);
    }
  };

  const getHangmanDrawing = (attemptsLeft) => {
    const parts = [
      '┃',           // 0 attempts left - sol bacak
      '┃',           // 1 attempt left - sağ bacak  
      '╱',           // 2 attempts left - sol kol
      '╲',           // 3 attempts left - sağ kol
      '●',           // 4 attempts left - gövde
      '◯',           // 5 attempts left - kafa
    ];
    
    const wrongAttempts = 6 - attemptsLeft;
    return parts.slice(0, wrongAttempts);
  };

  const guessLetter = async (letter) => {
    if (!gameId || !gameData || gameData.game_status !== 'active') return;
    if (gameData.guessed_letters.includes(letter)) {
      setFeedback({ type: 'warning', message: 'Bu harfi zaten denedin!' });
      return;
    }

    try {
      const response = await axios.post(`${API}/games/turkish/hangman/guess`, {
        game_id: gameId,
        letter,
      });

      setGameData({
        display_word: response.data.display_word,
        remaining_attempts: response.data.remaining_attempts,
        guessed_letters: response.data.guessed_letters,
        game_status: response.data.game_status,
        hint: gameData.hint,
      });

      if (response.data.is_correct) {
        setFeedback({ type: 'success', message: response.data.message });
      } else {
        setFeedback({ type: 'error', message: response.data.message });
      }

      if (response.data.game_status === 'won') {
        setFeedback({ type: 'success', message: '🎉 Tebrikler! Kelimeyi buldun!' });
      } else if (response.data.game_status === 'lost') {
        setFeedback({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      console.error('Guess error:', error);
      setFeedback({ type: 'error', message: 'Harf seçme hatası! Lütfen tekrar deneyin.' });
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🎯 Adam Asmaca</h1>
        {gameData && (
          <p className="subtitle">Kalan Hak: {gameData.remaining_attempts}</p>
        )}
      </div>

      {feedback && <div className={`alert ${feedback.type}`} data-testid="feedback-message">{feedback.message}</div>}

      {gameData && (
        <div>
          <div className="card">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>💡 İpucu:</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#E91E63' }} data-testid="hint-text">{gameData.hint}</div>
            </div>

            {/* Adam Asmaca Görseli - Çubuk Adam */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '30px',
            }}>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '40px', 
                lineHeight: '1.3',
                textAlign: 'left',
                whiteSpace: 'pre',
                color: '#333'
              }}>
                {`   ┌─────┐
   │     ${gameData.remaining_attempts <= 5 ? '😵' : '  '}
   │     ${gameData.remaining_attempts <= 4 ? '│' : ' '}
   │    ${gameData.remaining_attempts <= 3 ? '/' : ' '}${gameData.remaining_attempts <= 4 ? '│' : ' '}${gameData.remaining_attempts <= 2 ? '\\' : ' '}
   │    ${gameData.remaining_attempts <= 1 ? '/' : ' '} ${gameData.remaining_attempts <= 0 ? '\\' : ' '}
   │
───┴───`}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                padding: '30px 20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              {gameData.display_word.map((char, index) => (
                <div
                  key={index}
                  style={{
                    width: char === ' ' ? '20px' : '45px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: char === '_' ? 'white' : char === ' ' ? 'transparent' : '#E91E63',
                    borderRadius: '8px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: char === '_' ? '#ccc' : 'white',
                    border: char === '_' ? '2px solid #ddd' : 'none',
                  }}
                  data-testid={`word-char-${index}`}
                >
                  {char === '_' ? '' : char}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Denenen Harfler:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {gameData.guessed_letters.length === 0 ? (
                  <span style={{ color: '#999' }}>Henüz harf denemediniz</span>
                ) : (
                  gameData.guessed_letters.map((letter, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '6px 12px',
                        background: '#f1f1f1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {letter}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {gameData.game_status === 'active' ? (
            <div className="card">
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Harf Seçin:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '8px' }}>
                {turkishAlphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={gameData.guessed_letters.includes(letter)}
                    style={{
                      padding: '12px',
                      background: gameData.guessed_letters.includes(letter) ? '#ddd' : 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                      color: gameData.guessed_letters.includes(letter) ? '#999' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: gameData.guessed_letters.includes(letter) ? 'not-allowed' : 'pointer',
                      opacity: gameData.guessed_letters.includes(letter) ? 0.5 : 1,
                    }}
                    data-testid={`letter-${letter}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => startNewGame()}
              className="button green"
              style={{ width: '100%' }}
              data-testid="restart-button"
            >
              🔄 Yeni Oyun
            </button>
          )}
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>🎯 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>İpuçlarına göre kelimeyi tahmin et</li>
          <li>Her seferinde bir harf seç</li>
          <li>6 yanlış hakkın var</li>
          <li>Kelimeyi tamamlarsan kazan!</li>
        </ul>
      </div>
    </div>
  );
}
