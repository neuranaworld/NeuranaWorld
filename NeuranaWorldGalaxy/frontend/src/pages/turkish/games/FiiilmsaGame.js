import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function FiiilmsaGame() {
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
      const response = await axios.get(`${API}/games/turkish/fiilimsa/quiz`);
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
      setScore(score + 15);
      setTimeout(() => loadQuiz(), 2000);
    } else {
      setFeedback({ type: 'error', message: `❌ Yanlış. Doğru cevap: ${quiz.correct_answer}. ${quiz.explanation}` });
      setTimeout(() => loadQuiz(), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🎓 Fiilimsa Tanıma</h1>
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
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>💡 Fiilimsa Türleri</h3>
        <div style={{ lineHeight: '2', color: '#333' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Sıfat-fiil:</strong>
            <p style={{ marginLeft: '20px', marginTop: '5px' }}>Fiilden türeyerek ismi niteler. Örn: "koşan çocuk"</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Zarf-fiil:</strong>
            <p style={{ marginLeft: '20px', marginTop: '5px' }}>Fiilden türeyerek eylemi niteler. Örn: "okuyarak öğrenir"</p>
          </div>
          <div>
            <strong>İsim-fiil:</strong>
            <p style={{ marginLeft: '20px', marginTop: '5px' }}>Fiilden türeyerek isim gibi kullanılır. Örn: "yürümek sağlıklıdır"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
