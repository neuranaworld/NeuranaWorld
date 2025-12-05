import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatternGame() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const [pattern, setPattern] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const patterns = {
    easy: [
      { sequence: [2, 4, 6, 8, '?'], answer: '10', rule: 'Her sayı 2 artarak devam ediyor' },
      { sequence: [1, 3, 5, 7, '?'], answer: '9', rule: 'Tek sayılar dizisi' },
      { sequence: [10, 20, 30, 40, '?'], answer: '50', rule: 'Her sayı 10 artarak devam ediyor' },
      { sequence: [5, 10, 15, 20, '?'], answer: '25', rule: '5\'er artarak devam ediyor' },
    ],
    medium: [
      { sequence: [1, 2, 4, 8, '?'], answer: '16', rule: 'Her sayı 2 ile çarpılıyor' },
      { sequence: [1, 4, 9, 16, '?'], answer: '25', rule: 'Kare sayılar (1², 2², 3², 4², 5²)' },
      { sequence: [2, 6, 12, 20, '?'], answer: '30', rule: 'n × (n+1) şeklinde' },
      { sequence: [3, 6, 12, 24, '?'], answer: '48', rule: 'Her sayı 2 ile çarpılıyor' },
    ],
    hard: [
      { sequence: [1, 1, 2, 3, 5, 8, '?'], answer: '13', rule: 'Fibonacci dizisi' },
      { sequence: [1, 8, 27, 64, '?'], answer: '125', rule: 'Küp sayılar (1³, 2³, 3³, 4³, 5³)' },
      { sequence: [2, 3, 5, 7, 11, '?'], answer: '13', rule: 'Asal sayılar dizisi' },
      { sequence: [1, 3, 6, 10, 15, '?'], answer: '21', rule: 'Üçgensel sayılar' },
    ],
  };

  const generatePattern = () => {
    const patternList = patterns[difficulty];
    const randomPattern = patternList[Math.floor(Math.random() * patternList.length)];
    setPattern(randomPattern);
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim() || !pattern) return;

    if (userAnswer.trim() === pattern.answer) {
      setFeedback({ type: 'success', message: `✅ Doğru! ${pattern.rule}` });
      setScore(score + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15));
      setTimeout(() => generatePattern(), 2000);
    } else {
      setFeedback({ type: 'error', message: `❌ Yanlış. Doğru cevap: ${pattern.answer}. ${pattern.rule}` });
      setTimeout(() => generatePattern(), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      checkAnswer();
    }
  };

  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">🎯 Örüntü Bulma</h1>
        <p className="subtitle">Puan: {score}</p>
      </div>

      <div className="card">
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
          Zorluk Seviyesi:
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => {
              setDifficulty('easy');
              setPattern(null);
            }}
            className={`button ${difficulty === 'easy' ? 'green' : ''}`}
            style={{ flex: 1, opacity: difficulty === 'easy' ? 1 : 0.6 }}
            data-testid="easy-button"
          >
            Kolay
          </button>
          <button
            onClick={() => {
              setDifficulty('medium');
              setPattern(null);
            }}
            className={`button ${difficulty === 'medium' ? 'orange' : ''}`}
            style={{ flex: 1, opacity: difficulty === 'medium' ? 1 : 0.6 }}
            data-testid="medium-button"
          >
            Orta
          </button>
          <button
            onClick={() => {
              setDifficulty('hard');
              setPattern(null);
            }}
            className="button"
            style={{ flex: 1, opacity: difficulty === 'hard' ? 1 : 0.6, background: difficulty === 'hard' ? 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)' : undefined }}
            data-testid="hard-button"
          >
            Zor
          </button>
        </div>

        {!pattern ? (
          <button onClick={generatePattern} className="button" style={{ width: '100%' }} data-testid="start-button">
            🎮 Oyunu Başlat
          </button>
        ) : (
          <div>
            {feedback && <div className={`alert ${feedback.type}`} data-testid="feedback-message">{feedback.message}</div>}

            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '30px',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              {pattern.sequence.map((num, index) => (
                <div
                  key={index}
                  style={{
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: num === '?' ? '#FFA726' : 'white',
                    borderRadius: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: num === '?' ? 'white' : '#333',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  data-testid={`pattern-item-${index}`}
                >
                  {num}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                Cevabınız:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input"
                placeholder="Sonraki sayıyı girin"
                data-testid="answer-input"
                style={{ textAlign: 'center', fontSize: '20px' }}
              />
            </div>

            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="button"
              style={{ width: '100%', marginBottom: '10px' }}
              data-testid="check-button"
            >
              ✓ Kontrol Et
            </button>

            <button onClick={generatePattern} className="button orange" style={{ width: '100%' }} data-testid="skip-button">
              ⏩ Atla
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>💡 Örüntü Bulma Nasıl Oynanır?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Sayı dizisini incele</li>
          <li>Sayılar arasındaki ilişkiyi bul</li>
          <li>Soru işareti yerine gelecek sayıyı tahmin et</li>
          <li>Zorluk seviyesi arttıkça puan da artar!</li>
        </ul>
      </div>
    </div>
  );
}
