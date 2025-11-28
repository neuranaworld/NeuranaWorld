import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function PokerGame() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [playerChips, setPlayerChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [gamePhase, setGamePhase] = useState('preflop'); // preflop, flop, turn, river, showdown
  const [playerAction, setPlayerAction] = useState(null);
  const [handRank, setHandRank] = useState('');

  const createDeck = () => {
    const deck = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        deck.push({ suit, rank, value: RANKS.indexOf(rank), id: `${suit}-${rank}` });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const deck = createDeck();
    const hand = deck.slice(0, 2);
    const community = deck.slice(2, 7);
    
    setPlayerHand(hand);
    setCommunityCards([]);
    setGameStarted(true);
    setGamePhase('preflop');
    setPot(30); // Blinds
    setCurrentBet(20);
    setPlayerChips(1000 - 10); // Small blind
  };

  const playerCall = () => {
    setPlayerChips(playerChips - currentBet);
    setPot(pot + currentBet);
    nextPhase();
  };

  const playerRaise = () => {
    const raiseAmount = currentBet * 2;
    setPlayerChips(playerChips - raiseAmount);
    setPot(pot + raiseAmount);
    setCurrentBet(raiseAmount);
    nextPhase();
  };

  const playerFold = () => {
    setGameStarted(false);
    setPlayerAction('Fold - Oyundan çekildiniz');
  };

  const nextPhase = () => {
    const deck = createDeck();
    
    if (gamePhase === 'preflop') {
      setCommunityCards(deck.slice(2, 5)); // Flop (3 cards)
      setGamePhase('flop');
    } else if (gamePhase === 'flop') {
      setCommunityCards([...communityCards, deck[5]]); // Turn (1 card)
      setGamePhase('turn');
    } else if (gamePhase === 'turn') {
      setCommunityCards([...communityCards, deck[6]]); // River (1 card)
      setGamePhase('river');
    } else if (gamePhase === 'river') {
      // Showdown
      const rank = evaluateHand([...playerHand, ...communityCards]);
      setHandRank(rank);
      setGamePhase('showdown');
      
      // Basit kazanma (rastgele)
      const won = Math.random() > 0.5;
      if (won) {
        setPlayerChips(playerChips + pot);
        setPlayerAction(`Kazandınız! ${rank}`);
      } else {
        setPlayerAction(`Kaybettiniz. Rakip daha iyi el yaptı.`);
      }
      setGameStarted(false);
    }
  };

  const evaluateHand = (cards) => {
    // Basit el değerlendirmesi
    const ranks = {};
    const suits = {};
    
    cards.forEach(card => {
      ranks[card.rank] = (ranks[card.rank] || 0) + 1;
      suits[card.suit] = (suits[card.suit] || 0) + 1;
    });
    
    const rankCounts = Object.values(ranks).sort((a, b) => b - a);
    const isFlush = Object.values(suits).some(count => count >= 5);
    
    if (rankCounts[0] === 4) return 'Dörtlü (Four of a Kind)';
    if (rankCounts[0] === 3 && rankCounts[1] === 2) return 'Full House';
    if (isFlush) return 'Flush';
    if (rankCounts[0] === 3) return 'Üçlü (Three of a Kind)';
    if (rankCounts[0] === 2 && rankCounts[1] === 2) return 'İki Çift (Two Pair)';
    if (rankCounts[0] === 2) return 'Bir Çift (One Pair)';
    return 'Yüksek Kart (High Card)';
  };

  const getCardColor = (suit) => {
    return (suit === '♥' || suit === '♦') ? '#f44336' : '#000';
  };

  const getPhaseText = () => {
    const phases = {
      'preflop': 'Pre-Flop',
      'flop': 'Flop (3 kart)',
      'turn': 'Turn (4. kart)',
      'river': 'River (5. kart)',
      'showdown': 'Showdown'
    };
    return phases[gamePhase] || '';
  };

  return (
    <div className="page-container">
      <div className="header-gradient" style={{ background: 'linear-gradient(135deg, #000000 0%, #434343 100%)' }}>
        <button className="back-button" onClick={() => navigate('/games')} data-testid="back-button">← Geri</button>
        <h1 className="title">♠️ Poker Texas Hold'em</h1>
        <p className="subtitle">Chip: ${playerChips} | Pot: ${pot}</p>
      </div>

      {!gameStarted ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}>♠️</div>
          {playerAction && (
            <div className={`alert ${playerAction.includes('Kazandınız') ? 'success' : 'error'}`} style={{ marginBottom: '20px' }}>
              {playerAction}
            </div>
          )}
          <button onClick={startGame} className="button" style={{ fontSize: '20px', padding: '20px 40px', background: 'linear-gradient(135deg, #000 0%, #434343 100%)' }}>
            🎮 Yeni El
          </button>
        </div>
      ) : (
        <div>
          <div className="alert info" style={{ marginBottom: '20px' }}>
            Faz: {getPhaseText()} | Bahis: ${currentBet}
          </div>

          {/* Community Cards */}
          {communityCards.length > 0 && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>🏛 Masa Kartları</h3>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', padding: '20px', background: '#2e7d32', borderRadius: '12px' }}>
                {communityCards.map((card, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '80px',
                      height: '120px',
                      background: 'white',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontSize: '48px', color: getCardColor(card.suit) }}>{card.suit}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getCardColor(card.suit) }}>{card.rank}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Hand */}
          <div className="card">
            <h3 style={{ marginBottom: '15px' }}>🤚 Eliniz</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
              {playerHand.map((card) => (
                <div
                  key={card.id}
                  style={{
                    width: '80px',
                    height: '120px',
                    background: 'white',
                    border: '3px solid #4CAF50',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', color: getCardColor(card.suit) }}>{card.suit}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: getCardColor(card.suit) }}>{card.rank}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button onClick={playerFold} className="button" style={{ background: '#f44336', padding: '15px' }}>
                ❌ Fold
              </button>
              <button onClick={playerCall} className="button green" style={{ padding: '15px' }}>
                ✓ Call ${currentBet}
              </button>
              <button onClick={playerRaise} className="button orange" style={{ padding: '15px' }}>
                ⬆ Raise ${currentBet * 2}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>♠️ Texas Hold'em El Sıralaması</h3>
        <ol style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Royal Flush (En güçlü)</li>
          <li>Straight Flush</li>
          <li>Four of a Kind (Dörtlü)</li>
          <li>Full House</li>
          <li>Flush</li>
          <li>Straight</li>
          <li>Three of a Kind (Üçlü)</li>
          <li>Two Pair (İki Çift)</li>
          <li>One Pair (Bir Çift)</li>
          <li>High Card (En zayıf)</li>
        </ol>
      </div>
    </div>
  );
}
