import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['Kırmızı', 'Sarı', 'Mavi', 'Siyah'];
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function OkeyGame() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState([[], [], []]);
  const [middleTiles, setMiddleTiles] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [okeyTile, setOkeyTile] = useState(null);
  const [canDraw, setCanDraw] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState('Oyunu başlatın!');
  const [score, setScore] = useState([0, 0, 0, 0]);
  const [roundOver, setRoundOver] = useState(false);

  const createDeck = () => {
    const deck = [];
    COLORS.forEach(color => {
      NUMBERS.forEach(num => {
        deck.push({ color, number: num, id: `${color}-${num}-1` });
        deck.push({ color, number: num, id: `${color}-${num}-2` });
      });
    });
    // 2 Sahte Okey (Joker)
    deck.push({ color: 'Joker', number: 0, id: 'joker-1' });
    deck.push({ color: 'Joker', number: 0, id: 'joker-2' });
    return deck.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const deck = createDeck();
    
    // Okey taşını belirle (gösterge taşı)
    const indicatorTile = deck[0];
    const okeyNumber = indicatorTile.number === 13 ? 1 : indicatorTile.number + 1;
    setOkeyTile({ color: indicatorTile.color, number: okeyNumber });
    
    // 14 taş dağıt
    const hands = [
      deck.slice(1, 15),
      deck.slice(15, 29),
      deck.slice(29, 43),
      deck.slice(43, 57)
    ];
    
    setPlayerHand(sortHand(hands[0]));
    setBotHands([sortHand(hands[1]), sortHand(hands[2]), sortHand(hands[3])]);
    setMiddleTiles(deck.slice(57));
    setDiscardPile([]);
    setGameStarted(true);
    setCanDraw(true);
    setCurrentPlayer(0);
    setSelectedTiles([]);
    setRoundOver(false);
    setMessage('Ortadan taş çekin!');
  };

  const sortHand = (hand) => {
    return hand.sort((a, b) => {
      if (a.color === b.color) return a.number - b.number;
      return COLORS.indexOf(a.color) - COLORS.indexOf(b.color);
    });
  };

  const drawFromMiddle = () => {
    if (!canDraw || currentPlayer !== 0 || middleTiles.length === 0) return;
    
    const drawnTile = middleTiles[middleTiles.length - 1];
    setPlayerHand(sortHand([...playerHand, drawnTile]));
    setMiddleTiles(middleTiles.slice(0, -1));
    setCanDraw(false);
    setMessage('Bir taş atın!');
  };

  const drawFromDiscard = () => {
    if (!canDraw || currentPlayer !== 0 || discardPile.length === 0) return;
    
    const drawnTile = discardPile[discardPile.length - 1];
    setPlayerHand(sortHand([...playerHand, drawnTile]));
    setDiscardPile(discardPile.slice(0, -1));
    setCanDraw(false);
    setMessage('Bir taş atın!');
  };

  const toggleTileSelection = (tile) => {
    if (canDraw) return;
    
    if (selectedTiles.find(t => t.id === tile.id)) {
      setSelectedTiles(selectedTiles.filter(t => t.id !== tile.id));
    } else {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const discardTile = () => {
    if (canDraw || selectedTiles.length !== 1 || currentPlayer !== 0) {
      setMessage('Sadece 1 taş seçip atabilirsiniz!');
      return;
    }
    
    const tileToDiscard = selectedTiles[0];
    const newHand = playerHand.filter(t => t.id !== tileToDiscard.id);
    
    setPlayerHand(newHand);
    setDiscardPile([...discardPile, tileToDiscard]);
    setSelectedTiles([]);
    setCanDraw(true);
    
    // El kontrolü
    if (checkWin(newHand)) {
      setMessage('🎉 Okey! Eli bitirdiniz!');
      const newScore = [...score];
      newScore[0] += 100;
      setScore(newScore);
      setRoundOver(true);
      return;
    }
    
    setMessage('Ortadan taş çekin!');
    
    // Bot sırası
    setTimeout(() => playBotTurn(), 1000);
  };

  const playBotTurn = () => {
    if (currentPlayer === 0) {
      setCurrentPlayer(1);
      setTimeout(() => botMove(1), 500);
    }
  };

  const botMove = (botIndex) => {
    if (middleTiles.length === 0) return;
    
    const newBotHands = [...botHands];
    const drawnTile = middleTiles[middleTiles.length - 1];
    newBotHands[botIndex - 1].push(drawnTile);
    
    setMiddleTiles(middleTiles.slice(0, -1));
    
    // Bot bir taş atar
    setTimeout(() => {
      const randomTile = newBotHands[botIndex - 1][Math.floor(Math.random() * newBotHands[botIndex - 1].length)];
      newBotHands[botIndex - 1] = newBotHands[botIndex - 1].filter(t => t.id !== randomTile.id);
      
      setBotHands(newBotHands);
      setDiscardPile([...discardPile, randomTile]);
      
      if (botIndex < 3) {
        setCurrentPlayer(botIndex + 1);
        setTimeout(() => botMove(botIndex + 1), 500);
      } else {
        setCurrentPlayer(0);
        setMessage('Sizin sıranız! Taş çekin.');
      }
    }, 500);
  };

  const checkWin = (hand) => {
    // Basit kazanma kontrolü: El 1 taş veya daha az
    return hand.length <= 1;
  };

  const finishHand = () => {
    if (canDraw || selectedTiles.length === 0) {
      setMessage('El bitirmek için taşları gruplandırın!');
      return;
    }
    
    // Grupları kontrol et (basitleştirilmiş)
    const remainingTiles = playerHand.filter(t => !selectedTiles.find(st => st.id === t.id));
    
    if (remainingTiles.length <= 1) {
      setMessage('🎉 Okey! Eli bitirdiniz!');
      const newScore = [...score];
      newScore[0] += 100;
      setScore(newScore);
      setRoundOver(true);
    } else {
      setMessage('❌ Geçersiz grup! Tüm taşları gruplandırmalısınız.');
    }
  };

  const getTileColor = (color) => {
    const colors = {
      'Kırmızı': '#f44336',
      'Sarı': '#fbc02d',
      'Mavi': '#2196f3',
      'Siyah': '#424242',
      'Joker': '#9c27b0'
    };
    return colors[color] || '#999';
  };

  const isOkeyTile = (tile) => {
    return okeyTile && tile.color === okeyTile.color && tile.number === okeyTile.number;
  };

  return (
    <div className="page-container">
      <div className="header-gradient" style={{ background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)' }}>
        <button className="back-button" onClick={() => navigate('/games')} data-testid="back-button">← Geri</button>
        <h1 className="title">🎴 Okey 101</h1>
        <p className="subtitle">Puanınız: {score[0]} | Sıra: {currentPlayer === 0 ? 'Siz' : `Bot ${currentPlayer}`}</p>
      </div>

      {!gameStarted || roundOver ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}>🎴</div>
          {roundOver && (
            <div className="alert success" style={{ marginBottom: '20px' }}>
              🎉 El bitti! Puanınız: {score[0]}
            </div>
          )}
          <button onClick={startGame} className="button" style={{ fontSize: '20px', padding: '20px 40px', background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)' }}>
            {roundOver ? '🔄 Yeni El' : '🎮 Oyunu Başlat'}
          </button>
        </div>
      ) : (
        <div>
          {/* Mesaj */}
          <div className="alert info" style={{ marginBottom: '20px' }}>
            {message}
          </div>

          {/* Okey Göstergesi */}
          {okeyTile && (
            <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>🎯 Okey Taşı:</span>
                <div style={{
                  width: '60px',
                  height: '80px',
                  background: 'white',
                  border: `4px solid ${getTileColor(okeyTile.color)}`,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ fontSize: '10px', color: getTileColor(okeyTile.color) }}>{okeyTile.color}</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: getTileColor(okeyTile.color) }}>
                    {okeyTile.number}
                  </div>
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>(Joker olarak kullanılır)</span>
              </div>
            </div>
          )}

          {/* Botlar */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>🤖 Rakipler</h3>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-around' }}>
              {botHands.map((hand, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: currentPlayer === idx + 1 ? '#4CAF50' : '#666' }}>
                    Bot {idx + 1} {currentPlayer === idx + 1 && '⏳'}
                  </div>
                  <div style={{ fontSize: '36px' }}>🎴</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{hand.length} taş</div>
                </div>
              ))}
            </div>
          </div>

          {/* Orta & Atılanlar */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '15px' }}>📚 Orta ({middleTiles.length})</h3>
                <button 
                  onClick={drawFromMiddle} 
                  disabled={!canDraw || currentPlayer !== 0}
                  className="button" 
                  style={{ width: '100%', padding: '20px' }}
                >
                  ⬅ Ortadan Çek
                </button>
              </div>
              <div>
                <h3 style={{ marginBottom: '15px' }}>🗑 Atılanlar ({discardPile.length})</h3>
                <div style={{ minHeight: '80px', padding: '10px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {discardPile.slice(-3).map((tile, idx) => (
                    <div key={idx} style={{
                      width: '40px',
                      height: '60px',
                      background: 'white',
                      border: `2px solid ${getTileColor(tile.color)}`,
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: getTileColor(tile.color)
                    }}>
                      {tile.number}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={drawFromDiscard} 
                  disabled={!canDraw || currentPlayer !== 0 || discardPile.length === 0}
                  className="button orange" 
                  style={{ width: '100%', padding: '15px', marginTop: '10px' }}
                >
                  ⬅ Atılandan Çek
                </button>
              </div>
            </div>
          </div>

          {/* Oyuncu Eli */}
          <div className="card">
            <h3 style={{ marginBottom: '15px' }}>🖐 Eliniz ({playerHand.length} taş)</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '20px', background: '#e8f5e9', borderRadius: '12px', minHeight: '120px' }}>
              {playerHand.map((tile) => {
                const isSelected = selectedTiles.find(t => t.id === tile.id);
                const isOkey = isOkeyTile(tile);
                
                return (
                  <div
                    key={tile.id}
                    onClick={() => toggleTileSelection(tile)}
                    style={{
                      width: '60px',
                      height: '85px',
                      background: isSelected ? '#FFE082' : 'white',
                      border: `3px solid ${isOkey ? '#9C27B0' : getTileColor(tile.color)}`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: !canDraw ? 'pointer' : 'not-allowed',
                      opacity: canDraw ? 0.7 : 1,
                      transition: 'all 0.2s',
                      transform: isSelected ? 'translateY(-10px)' : 'translateY(0)',
                      boxShadow: isSelected ? '0 6px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ fontSize: '9px', color: getTileColor(tile.color), marginBottom: '2px' }}>
                      {tile.color.slice(0, 3)}
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: getTileColor(tile.color) }}>
                      {tile.color === 'Joker' ? '🃏' : tile.number}
                    </div>
                    {isOkey && <div style={{ fontSize: '8px', color: '#9C27B0', marginTop: '2px' }}>★ OKEY</div>}
                  </div>
                );
              })}
            </div>

            {/* Aksiyonlar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={discardTile} 
                disabled={canDraw || selectedTiles.length !== 1 || currentPlayer !== 0}
                className="button orange" 
                style={{ padding: '15px', fontSize: '16px' }}
              >
                🗑 Seçili Taşı At
              </button>
              <button 
                onClick={finishHand} 
                disabled={canDraw || selectedTiles.length === 0 || currentPlayer !== 0}
                className="button green" 
                style={{ padding: '15px', fontSize: '16px' }}
              >
                ✓ Eli Bitir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#E65100' }}>🎴 Okey 101 Kuralları</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px', fontSize: '14px' }}>
          <li>14 taş ile başlanır, her turda 1 çek 1 at</li>
          <li>Okey taşı (gösterilen taş) joker gibi kullanılır</li>
          <li>Aynı renk ardışık (3,4,5) veya farklı renk aynı sayı (7,7,7) gruplar yapın</li>
          <li>Tüm taşları gruplandırıp 1 taş atarak bitirin!</li>
          <li>Eli bitiren 100 puan kazanır</li>
        </ul>
      </div>
    </div>
  );
}