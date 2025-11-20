import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function GrammarTestPage() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'noktalama', name: 'Noktalama', icon: '❗' },
    { id: 'fiilimsa', name: 'Fiilimsa', icon: '🎓' },
  ];

  const loadQuiz = async (category) => {
    setLoading(true);
    setFeedback(null);
    setSelectedAnswer('');

    try {
      const endpoint = category === 'noktalama' ? '/games/turkish/punctuation/quiz' : '/games/turkish/fiilimsa/quiz';
      const response = await axios.get(`${API}${endpoint}`);
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
    } else {
      setFeedback({ type: 'error', message: `❌ Yanlış. Doğru cevap: ${quiz.correct_answer}. ${quiz.explanation}` });
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">📝 Dil Bilgisi Testleri</h1>
        <p className="subtitle">Puan: {score}</p>
      </div>

      {!quiz ? (
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Kategori Seçin:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => loadQuiz(cat.id)}
                  className="button"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                    padding: '20px',
                    fontSize: '18px',
                  }}
                  data-testid={`category-${cat.id}-button`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {feedback && <div className={`alert ${feedback.type}`} data-testid="feedback-message">{feedback.message}</div>}

          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#333' }} data-testid="question-text">{quiz.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {quiz.options && quiz.options.map((option, index) => (
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
              style={{ width: '100%', marginBottom: '10px', background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' }}
              data-testid="check-button"
            >
              ✓ Kontrol Et
            </button>

            <button
              onClick={() => setQuiz(null)}
              className="button orange"
              style={{ width: '100%' }}
              data-testid="back-to-categories-button"
            >
              ← Kategorilere Dön
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>💡 Dil Bilgisi Testi Hakkında</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Noktalama kurallarını öğren</li>
          <li>Fiilimsi türlerini tanı</li>
          <li>Doğru cevap verdiğinde detaylı açıklama al</li>
          <li>Her doğru cevap 10 puan kazanır!</li>
        </ul>
      </div>
    </div>
  );
}
