import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PolynomialArena() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [polynomial, setPolynomial] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(null);

  useEffect(() => {
    startNewQuestion();
  }, [difficulty]);

  const startNewQuestion = async () => {
    setLoading(true);
    setUserAnswer('');
    setFeedback(null);
    setHint(null);

    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/math/polynomial/start?user_id=${userId}&degree=${difficulty}`);
      setGameId(response.data.game_id);
      setPolynomial(response.data.polynomial);
    } catch (error) {
      console.error('Polynomial generation error:', error);
      setFeedback({ type: 'error', message: 'Polinom oluşturulamadı' });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !gameId) return;

    try {
      const response = await axios.post(`${API}/games/math/polynomial/answer`, {
        game_id: gameId,
        user_answer: userAnswer,
      });

      if (response.data.is_correct) {
        const points = difficulty === 2 ? 10 : difficulty === 3 ? 15 : 20;
        setScore(score + points);
        setStreak(streak + 1);
        setFeedback({ type: 'success', message: response.data.message });
        setTimeout(() => startNewQuestion(), 2000);
      } else {
        setStreak(0);
        setFeedback({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      console.error('Answer submission error:', error);
      setFeedback({ type: 'error', message: 'Cevap gönderilemedi' });
    }
  };

  const getHint = async () => {
    if (!gameId) return;
    try {
      const response = await axios.get(`${API}/games/math/polynomial/hint?game_id=${gameId}`);
      setHint(response.data.hint);
    } catch (error) {
      console.error('Hint error:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">📐 Polinom Arena</h1>
        <p className="subtitle">
          Puan: {score} | Seri: {streak}
        </p>
      </div>

      {feedback && <div className={`alert ${feedback.type}`}>{feedback.message}</div>}

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Zorluk:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setDifficulty(2)}
              className={`button ${difficulty === 2 ? 'green' : ''}`}
              style={{ flex: 1, opacity: difficulty === 2 ? 1 : 0.6 }}
            >
              Kolay (2. derece)
            </button>
            <button
              onClick={() => setDifficulty(3)}
              className={`button orange`}
              style={{ flex: 1, opacity: difficulty === 3 ? 1 : 0.6 }}
            >
              Orta (3. derece)
            </button>
            <button
              onClick={() => setDifficulty(4)}
              className="button"
              style={{ flex: 1, opacity: difficulty === 4 ? 1 : 0.6 }}
            >
              Zor (4. derece)
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>Polinomu çarpanlarına ayır:</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '12px',
            }}
          >
            {polynomial || 'Yükleniyor...'}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Cevabınız:</label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="input"
            placeholder="Örn: (x+2)(x+3)"
            disabled={loading}
            data-testid="answer-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={submitAnswer}
            disabled={loading || !userAnswer.trim()}
            className="button green"
            style={{ flex: 1 }}
            data-testid="submit-button"
          >
            ✓ Cevapla
          </button>

          <button
            onClick={getHint}
            className="button orange"
            style={{ flex: 1 }}
            data-testid="hint-button"
          >
            💡 İpucu
          </button>

          <button
            onClick={startNewQuestion}
            className="button"
            style={{ flex: 1 }}
            data-testid="skip-button"
          >
            ⏭ Atla
          </button>
        </div>

        {hint && (
          <div className="alert info" style={{ marginTop: '15px' }}>
            💡 İpucu: {hint}
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{score}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Toplam Puan</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{streak}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Seri</div>
        </div>
      </div>
    </div>
  );
}
