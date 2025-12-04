import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

export default function PunctuationGame() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedAnswer('');

    try {
      const response = await axios.get(`${API}/games/turkish/punctuation/quiz`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Quiz load error:', error);
      setFeedback({ type: 'error', message: 'Soru yüklenemedi' });
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !quiz) return;

    if (selectedAnswer === quiz.correct_answer) {
      setFeedback({ type: 'success', message: `✅ Doğru! ${quiz.explanation}` });
      setScore(score + 10);
      setTimeout(() => loadQuiz(), 2000);
    } else {
      setFeedback({ type: 'error', message: `❌ Yanlış. Doğru cevap: "${quiz.correct_answer}". ${quiz.explanation}` });
      setTimeout(() => loadQuiz(), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">❓ Noktalama Oyunu</h1>
        <p className="subtitle">Puan: {score}</p>
      </div>

      {feedback && <div className={`alert ${feedback.type}`} data-testid="feedback-message">{feedback.message}</div>}

      {quiz ? (
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }} data-testid="question-text">
            {quiz.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {quiz.options.map((option, index) => (
              <div
                key={index}
                onClick={() => setSelectedAnswer(option)}
                style={{
                  padding: '15px 20px',
                  background: selectedAnswer === option ? '#E91E63' : 'white',
                  color: selectedAnswer === option ? 'white' : '#333',
                  border: '2px solid',
                  borderColor: selectedAnswer === option ? '#E91E63' : '#ddd',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '16px',
                }}
                data-testid={`option-${index}`}
              >
                {option}
              </div>
            ))}
          </div>

          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            className="button"
            style={{ width: '100%', background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' }}
            data-testid="check-button"
          >
            ✓ Kontrol Et
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <span>Soru yükleniyor...</span>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>💡 Noktalama İşaretleri</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Virgül (,): Sıralama, hitap, bağlaç gibi durumlarda</li>
          <li>Nokta (.): Cümle sonunda</li>
          <li>Ünlem (!): Şaşkınlık, sevinç, üzüntü</li>
          <li>Soru (?): Soru cümlelerinde</li>
          <li>Noktalı virgül (;): Birbirine bağlı cümleler arasında</li>
        </ul>
      </div>
    </div>
  );
}
