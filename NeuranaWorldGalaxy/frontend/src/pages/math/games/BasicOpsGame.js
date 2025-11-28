import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BasicOpsGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [question, setQuestion] = useState('');
  const [operation, setOperation] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    startNewQuestion();
  }, []);

  const startNewQuestion = async () => {
    setLoading(true);
    setUserAnswer('');
    setFeedback(null);
    try {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        const userResp = await axios.post(`${API}/auth/anonymous`);
        userId = userResp.data.user_id;
        localStorage.setItem('user_id', userId);
      }

      const response = await axios.post(`${API}/games/math/basic-ops/start?user_id=${userId}&operation=all`);
      setGameId(response.data.game_id);
      setQuestion(response.data.question);
      setOperation(response.data.operation);
    } catch (error) {
      console.error('Question generation error:', error);
      setFeedback({ type: 'error', message: 'Soru üretilemedi. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !gameId) {
      setFeedback({ type: 'warning', message: 'Lütfen bir cevap girin!' });
      return;
    }

    try {
      const response = await axios.post(`${API}/games/math/basic-ops/answer`, {
        game_id: gameId,
        user_answer: userAnswer,
      });

      if (response.data.is_correct) {
        setScore(score + 10);
        setStreak(streak + 1);
        setFeedback({ type: 'success', message: response.data.message });
        setTimeout(() => startNewQuestion(), 1500);
      } else {
        setStreak(0);
        setFeedback({ type: 'error', message: response.data.message });
        setTimeout(() => startNewQuestion(), 2000);
      }
    } catch (error) {
      console.error('Answer submission error:', error);
      setFeedback({ type: 'error', message: `Cevap gönderilemedi: ${error.response?.data?.detail || error.message}` });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer.trim() && !loading) {
      submitAnswer();
    }
  };

  const getOperationEmoji = (op) => {
    switch (op) {
      case '+':
        return '➕';
      case '-':
        return '➖';
      case '×':
        return '✖️';
      case '÷':
        return '➗';
      default:
        return '🔢';
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient green">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">
          {getOperationEmoji(operation)} Dört İşlem
        </h1>
        <p className="subtitle">
          Puan: {score} | Seri: {streak}
        </p>
      </div>

      {feedback && (
        <div className={`alert ${feedback.type}`} data-testid="feedback-message">
          {feedback.message}
        </div>
      )}

      <div className="card" style={{ borderLeft: '4px solid #4CAF50' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>Soru:</div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              padding: '20px',
            }}
            data-testid="question-text"
          >
            {question || 'Yükleniyor...'}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
            Cevabınız:
          </label>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input"
            placeholder="Cevabı girin"
            disabled={loading}
            data-testid="answer-input"
            style={{ textAlign: 'center', fontSize: '24px' }}
          />
        </div>

        <button
          onClick={submitAnswer}
          disabled={loading || !userAnswer.trim()}
          className="button green"
          style={{ width: '100%', marginBottom: '10px' }}
          data-testid="submit-button"
        >
          {loading ? '⌛ Kontrol Ediliyor...' : '✓ Cevapla'}
        </button>

        <button
          onClick={startNewQuestion}
          className="button orange"
          style={{ width: '100%' }}
          data-testid="skip-button"
        >
          ⏩ Atla
        </button>
      </div>

      <div className="grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}>
            {score}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Toplam Puan</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFA726', marginBottom: '8px' }}>
            {streak}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Seri</div>
        </div>
      </div>
    </div>
  );
}
