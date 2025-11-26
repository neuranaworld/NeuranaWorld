import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function BatakGame() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [currentTrick, setCurrentTrick] = useState([]);
  const [bids, setBids] = useState([0, 0, 0, 0]);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [trumpSuit, setTrumpSuit] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [biddingPhase, setBiddingPhase] = useState(true);
  const [playerBid, setPlayerBid] = useState(0);

  const createDeck = () => {
    const deck = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        deck.push({ suit, rank, id: `${suit}-${rank}` });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const deck = createDeck();
    const hand = deck.slice(0, 13).sort((a, b) => {
      if (a.suit === b.suit) {
        return RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
      }
      return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    });
    
    setPlayerHand(hand);
    setGameStarted(true);
    setBiddingPhase(true);
    setCurrentTrick([]);
    setCurrentPlayer(0);
  };

  const placeBid = (bid) => {
    const newBids = [...bids];
    newBids[0] = bid;
    // AI botlar rastgele ihale yapar
    newBids[1] = Math.floor(Math.random() * 7) + 1;
    newBids[2] = Math.floor(Math.random() * 7) + 1;
    newBids[3] = Math.floor(Math.random() * 7) + 1;
    
    setBids(newBids);
    setPlayerBid(bid);
    setBiddingPhase(false);
    
    // En yüksek ihale koz belirler
    const maxBid = Math.max(...newBids);
    const suitIndex = newBids.indexOf(maxBid) % 4;
    setTrumpSuit(SUITS[suitIndex]);
  };

  const playCard = (card) => {
    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setCurrentTrick([...currentTrick, { card, player: 0 }]);
    
    // El bitince
    if (newHand.length === 0) {
      const tricksWon = Math.floor(Math.random() * 8) + playerBid; // Basitleştirilmiş
      const newScores = [...scores];
      if (tricksWon >= playerBid) {
        newScores[0] += playerBid * 10;
      } else {
        newScores[0] -= (playerBid - tricksWon) * 10;
      }
      setScores(newScores);
      setGameStarted(false);
    }
  };

  const getCardColor = (suit) => {
    return (suit === '♥' || suit === '♦') ? '#f44336' : '#000';
  };

  return (
    <div className="page-container">
      <div className="header-gradient" style={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' }}>
        <button className="back-button" onClick={() => navigate('/games')} data-testid="back-button">← Geri</button>
        <h1 className="title">🃏 Batak</h1>
        <p className="subtitle">Puanınız: {scores[0]}</p>
      </div>

      {!gameStarted ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}>🃏</div>
          {scores[0] !== 0 && (
            <div className="alert success" style={{ marginBottom: '20px' }}>
              Son el: {scores[0]} puan
            </div>
          )}
          <button onClick={startGame} className="button" style={{ fontSize: '20px', padding: '20px 40px' }}>
            🎮 Yeni El
          </button>
        </div>
      ) : biddingPhase ? (
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📢 İhale Yapın</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '16px', color: '#666' }}>
            Kaç el alacağınızı tahmin edin (1-13)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map(bid => (
              <button
                key={bid}
                onClick={() => placeBid(bid)}
                className="button"
                style={{ padding: '20px', fontSize: '20px' }}
              >
                {bid}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {trumpSuit && (
            <div className="alert info" style={{ marginBottom: '20px' }}>
              Koz: <span style={{ fontSize: '32px', color: getCardColor(trumpSuit) }}>{trumpSuit}</span> | İhaleniz: {playerBid} el
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '15px' }}>🤚 Kartlarınız ({playerHand.length})</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
              {playerHand.map((card) => (
                <div
                  key={card.id}
                  onClick={() => playCard(card)}
                  style={{
                    width: '70px',
                    height: '100px',
                    background: 'white',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ fontSize: '32px', color: getCardColor(card.suit) }}>{card.suit}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getCardColor(card.suit) }}>{card.rank}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#c62828' }}>🃏 Batak Kuralları</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>13 kart dağıtılır</li>
          <li>İhale yap: Kaç el alacağını söyle</li>
          <li>En yüksek ihale koz belirler</li>
          <li>İhaleni tuttursan puan kazan, tutturamasan kaybet!</li>
        </ul>
      </div>
    </div>
  );
}
