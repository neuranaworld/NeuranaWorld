import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function NumberGuessGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [guessHistory, setGuessHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    setGuess('');
    setAttempts(0);
    setFeedback(null);
    setGameOver(false);
    setGuessHistory([]);

    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/math/number-guess/start?user_id=${userId}`);
      setGameId(response.data.game_id);
      setMaxAttempts(response.data.max_attempts);
      setFeedback({ type: 'info', message: response.data.message });
    } catch (error) {
      console.error('Game start error:', error);
      setFeedback({ type: 'error', message: 'Oyun başlatılamadı' });
    } finally {
      setLoading(false);
    }
  };

  const submitGuess = async () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100 || !gameId) {
      setFeedback({ type: 'warning', message: 'Lütfen 1-100 arası geçerli bir sayı girin!' });
      return;
    }

    try {
      const response = await axios.post(`${API}/games/math/number-guess/guess`, {
        game_id: gameId,
        guess: guessNum,
      });

      setAttempts(response.data.attempts_left !== undefined ? maxAttempts - response.data.attempts_left : attempts + 1);
      setGuessHistory([...guessHistory, { guess: guessNum, hint: response.data.hint }]);

      if (response.data.is_correct) {
        setFeedback({ type: 'success', message: response.data.message });
        setGameOver(true);
      } else if (response.data.game_over) {
        setFeedback({ type: 'error', message: response.data.message });
        setGameOver(true);
      } else {
        setFeedback({ type: 'warning', message: response.data.message });
      }

      setGuess('');
    } catch (error) {
      console.error('Guess submission error:', error);
      setFeedback({ type: 'error', message: `Tahmin gönderilemedi: ${error.response?.data?.detail || error.message}` });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && guess && !gameOver) {
      submitGuess();
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient orange">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🎲 Sayı Tahmin Oyunu</h1>
        <p className="subtitle">
          Deneme: {attempts}/{maxAttempts}
        </p>
      </div>

      {feedback && (
        <div className={`alert ${feedback.type}`} data-testid="feedback-message">
          {feedback.message}
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
            Tahmininiz (1-100):
          </label>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input"
            placeholder="Sayı girin"
            disabled={gameOver || loading}
            min="1"
            max="100"
            data-testid="guess-input"
            style={{ textAlign: 'center', fontSize: '24px' }}
          />
        </div>

        <button
          onClick={submitGuess}
          disabled={!guess || gameOver || loading}
          className="button orange"
          style={{ width: '100%', marginBottom: '10px' }}
          data-testid="guess-button"
        >
          🎯 Tahmin Et
        </button>

        {gameOver && (
          <button
            onClick={startNewGame}
            className="button green"
            style={{ width: '100%' }}
            data-testid="restart-button"
          >
            🔄 Yeni Oyun
          </button>
        )}
      </div>

      {guessHistory.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '15px', color: '#333' }}>📝 Tahmin Geçmişi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {guessHistory.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#333' }}>Tahmin: {item.guess}</span>
                {item.hint && (
                  <span
                    style={{
                      color: 'white',
                      background: item.hint === 'büyük' ? '#F44336' : '#2196F3',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Daha {item.hint}!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#E65100' }}>🎯 Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>1 ile 100 arasında bir sayı tutuldu</li>
          <li>7 denemede doğru sayıyı bulmaya çalış</li>
          <li>Her tahminden sonra ipucu alırsın (daha büyük/küçük)</li>
          <li>Doğru bilirsen puan kazan!</li>
        </ul>
      </div>
    </div>
  );
}
