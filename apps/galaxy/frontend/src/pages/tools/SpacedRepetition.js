import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpacedRepetition() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [stats, setStats] = useState({ total: 0, learning: 0, reviewing: 0, mastered: 0 });

  useEffect(() => {
    const savedCards = localStorage.getItem('srs_cards');
    if (savedCards) {
      const parsed = JSON.parse(savedCards);
      setCards(parsed);
      updateStats(parsed);
      selectNextCard(parsed);
    }
  }, []);

  const updateStats = (cardList) => {
    const total = cardList.length;
    const learning = cardList.filter(c => c.interval === 0).length;
    const reviewing = cardList.filter(c => c.interval > 0 && c.interval < 30).length;
    const mastered = cardList.filter(c => c.interval >= 30).length;
    setStats({ total, learning, reviewing, mastered });
  };

  const saveCards = (cardList) => {
    localStorage.setItem('srs_cards', JSON.stringify(cardList));
    setCards(cardList);
    updateStats(cardList);
  };

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard = {
      id: Date.now(),
      front: newFront,
      back: newBack,
      interval: 0,
      easeFactor: 2.5,
      nextReview: Date.now(),
      reviews: 0
    };

    const updated = [...cards, newCard];
    saveCards(updated);
    setNewFront('');
    setNewBack('');
    
    if (!currentCard) {
      selectNextCard(updated);
    }
  };

  const selectNextCard = (cardList) => {
    const now = Date.now();
    const dueCards = cardList.filter(c => c.nextReview <= now);
    
    if (dueCards.length > 0) {
      const randomCard = dueCards[Math.floor(Math.random() * dueCards.length)];
      setCurrentCard(randomCard);
      setShowAnswer(false);
    } else {
      setCurrentCard(null);
    }
  };

  const reviewCard = (quality) => {
    if (!currentCard) return;

    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;

    if (quality >= 3) {
      if (currentCard.interval === 0) {
        newInterval = 1;
      } else if (currentCard.interval === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentCard.interval * currentCard.easeFactor);
      }
    } else {
      newInterval = 0;
    }

    newEaseFactor = Math.max(1.3, currentCard.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const nextReview = Date.now() + (newInterval * 24 * 60 * 60 * 1000);

    const updatedCard = {
      ...currentCard,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview: nextReview,
      reviews: currentCard.reviews + 1
    };

    const updatedCards = cards.map(c => c.id === currentCard.id ? updatedCard : c);
    saveCards(updatedCards);
    selectNextCard(updatedCards);
  };

  const deleteCard = (id) => {
    const updated = cards.filter(c => c.id !== id);
    saveCards(updated);
    if (currentCard?.id === id) {
      selectNextCard(updated);
    }
  };

  const dueCardsCount = cards.filter(c => c.nextReview <= Date.now()).length;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🔄 Spaced Repetition</h1>
        <p className="subtitle">SRS algoritması ile akıllı tekrar sistemi</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>📊 İstatistikler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{dueCardsCount}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Bugün</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.learning}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Öğreniliyor</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.mastered}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Öğrenildi</div>
          </div>
        </div>
      </div>

      {currentCard ? (
        <div className="card" style={{ marginBottom: '30px', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Kart {cards.findIndex(c => c.id === currentCard.id) + 1} / {cards.length}
            </div>
            
            <div style={{ 
              background: '#f8f9fa', 
              padding: '60px 40px', 
              borderRadius: '12px', 
              marginBottom: '30px',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {!showAnswer ? currentCard.front : currentCard.back}
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                style={{
                  padding: '20px 40px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔄 Cevabı Göster
              </button>
            ) : (
              <div>
                <h4 style={{ marginBottom: '20px', color: '#666' }}>Ne kadar iyi biliyordunuz?</h4>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => reviewCard(1)} style={{ flex: 1, minWidth: '100px', padding: '15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>❌ Hiç</button>
                  <button onClick={() => reviewCard(2)} style={{ flex: 1, minWidth: '100px', padding: '15px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>😕 Zor</button>
                  <button onClick={() => reviewCard(3)} style={{ flex: 1, minWidth: '100px', padding: '15px', background: '#FFC107', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>😐 İyi</button>
                  <button onClick={() => reviewCard(4)} style={{ flex: 1, minWidth: '100px', padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>😊 Kolay</button>
                  <button onClick={() => reviewCard(5)} style={{ flex: 1, minWidth: '100px', padding: '15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🎯 Çok Kolay</button>
                </div>
                <p style={{ marginTop: '15px', fontSize: '13px', color: '#999' }}>Tekrar: {currentCard.reviews} kez | Aralık: {currentCard.interval} gün</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px', marginBottom: '30px' }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#667eea' }}>Tebrikler!</h2>
          <p style={{ fontSize: '18px', color: '#666' }}>
            {cards.length > 0 ? 'Bugün için tüm kartları tamamladınız!' : 'Henüz kart yok. Aşağıdan ekleyin!'}
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>➕ Yeni Kart Ekle</h3>
        <input
          type="text"
          value={newFront}
          onChange={(e) => setNewFront(e.target.value)}
          placeholder="Soru (ön yüz)"
          style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', marginBottom: '10px', fontSize: '16px' }}
        />
        <textarea
          value={newBack}
          onChange={(e) => setNewBack(e.target.value)}
          placeholder="Cevap (arka yüz)"
          rows="3"
          style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', marginBottom: '10px', fontSize: '16px' }}
        />
        <button
          onClick={addCard}
          disabled={!newFront.trim() || !newBack.trim()}
          style={{
            padding: '12px 24px',
            background: (!newFront.trim() || !newBack.trim()) ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: (!newFront.trim() || !newBack.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          ✅ Kart Ekle
        </button>
      </div>

      {cards.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>📚 Tüm Kartlar ({cards.length})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {cards.map(card => {
              const daysUntilReview = Math.ceil((card.nextReview - Date.now()) / (24 * 60 * 60 * 1000));
              return (
                <div key={card.id} style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '10px', background: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{card.front}</div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{card.back}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        📊 {card.reviews} tekrar • ⏱️ {card.interval === 0 ? 'Yeni' : `${card.interval} gün`} • 
                        {daysUntilReview <= 0 ? ' ✅ Hazır' : ` 📅 ${daysUntilReview} gün sonra`}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Nasıl Çalışır?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li><strong>Spaced Repetition:</strong> Bilimsel olarak kanıtlanmış hafıza tekniği</li>
          <li><strong>SuperMemo SM-2 Algoritması:</strong> Optimal tekrar aralıkları</li>
          <li><strong>Zorluk Değerlendirmesi:</strong> 5 seviye ile kişiselleştirilmiş öğrenme</li>
          <li><strong>Otomatik Planlama:</strong> Her kart için optimum tekrar zamanı</li>
          <li>Kolay kartlar daha uzun aralıklarla, zor kartlar daha sık tekrar edilir</li>
        </ul>
      </div>
    </div>
  );
}
