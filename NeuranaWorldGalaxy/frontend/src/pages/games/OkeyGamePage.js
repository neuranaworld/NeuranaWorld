import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Renk mapping
const TILE_COLORS = {
  red: { bg: '#DC2626', border: '#991B1B', text: '#FEE2E2' },
  blue: { bg: '#2563EB', border: '#1E40AF', text: '#DBEAFE' },
  black: { bg: '#1F2937', border: '#111827', text: '#F3F4F6' },
  yellow: { bg: '#EAB308', border: '#A16207', text: '#FEF3C7' },
};

export default function OkeyGamePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [userTiles, setUserTiles] = useState([]);
  const [okeyTile, setOkeyTile] = useState(null);
  const [indicator, setIndicator] = useState(null);
  const [discardPileTop, setDiscardPileTop] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animatingTile, setAnimatingTile] = useState(null);

  // Ses efektleri (Web Audio API)
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Farklı ses tipleri
    switch(type) {
      case 'draw':
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.1;
        break;
      case 'discard':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        break;
      case 'select':
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.05;
        break;
      case 'win':
        oscillator.frequency.value = 500;
        gainNode.gain.value = 0.2;
        break;
      default:
        oscillator.frequency.value = 250;
        gainNode.gain.value = 0.1;
    }
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const startNewGame = async () => {
    if (!userId) return;

    setLoading(true);
    setMessage('Oyun başlatılıyor...');

    try {
      const response = await axios.post(`${API}/games/okey/start?user_id=${userId}`);
      
      setGameId(response.data.game_id);
      setUserTiles(response.data.user_tiles);
      setOkeyTile(response.data.okey);
      setIndicator(response.data.indicator);
      setDiscardPileTop(response.data.discard_pile_top);
      setGameState(response.data.game_state);
      setMessage('Oyun başladı! Sıra sizde.');
    } catch (error) {
      console.error('Game start error:', error);
      setMessage('Oyun başlatılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const drawTile = async (fromDiscard = false) => {
    if (!gameId || loading) return;

    setLoading(true);
    setMessage(fromDiscard ? 'Yığından taş çekiliyor...' : 'Desteden taş çekiliyor...');
    
    // Ses efekti
    playSound('draw');

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/draw?from_discard=${fromDiscard}`);
      
      // Animasyon: Yeni taşı vurgula
      const newTile = response.data.tile;
      setAnimatingTile(newTile.id);
      setTimeout(() => setAnimatingTile(null), 1000);
      
      setUserTiles(response.data.game_state.user_tiles);
      setGameState(response.data.game_state);
      setMessage('Taş çekildi! Şimdi bir taş atın.');
    } catch (error) {
      console.error('Draw tile error:', error);
      setMessage('Taş çekilemedi.');
    } finally {
      setLoading(false);
    }
  };

  const discardTile = async () => {
    if (!gameId || !selectedTile || loading) return;

    setLoading(true);
    setMessage('Taş atılıyor...');
    
    // Ses efekti
    playSound('discard');

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/discard?tile_id=${selectedTile.id}`);
      
      setUserTiles(response.data.game_state.user_tiles);
      setDiscardPileTop(response.data.game_state.discard_pile_top);
      setGameState(response.data.game_state);
      setSelectedTile(null);
      
      // AI'ların hamleleri
      if (response.data.ai_actions.length > 0) {
        setMessage(`AI oyuncular oynadı. Sıra tekrar sizde!`);
      } else {
        setMessage('Sıra sizde!');
      }
    } catch (error) {
      console.error('Discard tile error:', error);
      setMessage('Taş atılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const renderTile = (tile, index, isSelectable = false) => {
    if (!tile) return null;

    const colors = TILE_COLORS[tile.color] || TILE_COLORS.red;
    const isSelected = selectedTile && selectedTile.id === tile.id;
    const isAnimating = animatingTile === tile.id;

    return (
      <div
        key={tile.id || index}
        onClick={() => {
          if (isSelectable) {
            playSound('select');
            setSelectedTile(isSelected ? null : tile);
          }
        }}
        style={{
          width: '60px',
          height: '80px',
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.border} 100%)`,
          border: `3px solid ${isSelected ? '#D4AF37' : colors.border}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isSelectable ? 'pointer' : 'default',
          boxShadow: isSelected 
            ? '0 8px 16px rgba(212, 175, 55, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)' 
            : '0 4px 6px rgba(0,0,0,0.3)',
          transform: isSelected ? 'translateY(-10px) scale(1.05)' : isAnimating ? 'scale(1.2)' : 'none',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          animation: isAnimating ? 'tileDrawAnimation 0.5s ease-out' : 'none',
        }}
        className="tile"
      >
        {/* 3D Efekt */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          borderRadius: '8px 8px 0 0',
        }} />
        
        {/* Sayı */}
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: colors.text,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 1,
        }}>
          {tile.number}
        </div>
        
        {/* Renk göstergesi */}
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: colors.bg,
          borderRadius: '50%',
          marginTop: '4px',
          border: '1px solid rgba(255,255,255,0.5)',
        }} />
        
        {/* Sahte Okey */}
        {tile.is_fake && (
          <div style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            fontSize: '10px',
            backgroundColor: '#D4AF37',
            color: '#1E3A8A',
            padding: '2px 4px',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}>
            F
          </div>
        )}
      </div>
    );
  };

  if (!userId) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Lütfen önce giriş yapın</h2>
          <button onClick={() => navigate('/')} className="button">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ 
      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <button 
            className="back-button" 
            onClick={() => navigate('/games')}
          >
            ← Geri
          </button>
          
          {/* Ses Kontrolü */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('select');
            }}
            style={{
              background: soundEnabled ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${soundEnabled ? '#D4AF37' : '#fff'}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#D4AF37',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif',
        }}>
          🎴 101 Okey
        </h1>
        <p style={{ textAlign: 'center', color: '#FEF3C7', fontSize: '14px' }}>
          Premium Türk Okey Oyunu
        </p>
      </div>

      {!gameId ? (
        /* Başlangıç Ekranı */
        <div className="card" style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
          maxWidth: '500px',
          margin: '0 auto',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎴</div>
          <h2 style={{ marginBottom: '15px', color: '#1E3A8A' }}>101 Okey'e Hoş Geldiniz!</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
            4 oyunculu klasik Türk okey oyunu. 3 AI rakibe karşı oynayın!
          </p>
          
          <div style={{ 
            background: '#E0E7FF', 
            borderRadius: '12px', 
            padding: '15px', 
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#1E40AF' }}>
              📋 Oyun Kuralları:
            </h3>
            <ul style={{ fontSize: '14px', color: '#374151', lineHeight: '2', paddingLeft: '20px' }}>
              <li>Her oyuncuya 14 taş dağıtılır</li>
              <li>Gösterge taşı okey'i belirler</li>
              <li>Taş çek, taş at mantığıyla oynanır</li>
              <li>İlk 14 taşı gruplandıran kazanır</li>
            </ul>
          </div>

          <button
            onClick={startNewGame}
            disabled={loading}
            className="button"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
              color: '#1E3A8A',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '15px',
            }}
          >
            {loading ? '🎲 Başlatılıyor...' : '🎲 Oyunu Başlat'}
          </button>
        </div>
      ) : (
        /* Oyun Ekranı */
        <div>
          {/* Durum Mesajı */}
          {message && (
            <div style={{
              background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#1E40AF',
              fontWeight: 'bold',
              border: '2px solid #818CF8',
            }}>
              {message}
            </div>
          )}

          {/* Üst Panel - Okey ve Gösterge */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Gösterge Taşı */}
            {indicator && (
              <div className="card" style={{ flex: '0 0 auto', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                  📌 Gösterge Taşı
                </h3>
                {renderTile(indicator)}
              </div>
            )}

            {/* Okey Taşı */}
            {okeyTile && (
              <div className="card" style={{ flex: '0 0 auto', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                  ⭐ Okey
                </h3>
                {renderTile(okeyTile)}
              </div>
            )}

            {/* Yığın */}
            {discardPileTop && (
              <div className="card" style={{ flex: '0 0 auto', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                  🗑 Atılmış Taşlar
                </h3>
                {renderTile(discardPileTop)}
                <button
                  onClick={() => drawTile(true)}
                  disabled={loading || userTiles.length >= 15}
                  className="button"
                  style={{ marginTop: '10px', fontSize: '12px', padding: '8px' }}
                >
                  Yığından Çek
                </button>
              </div>
            )}

            {/* Deste */}
            <div className="card" style={{ flex: '0 0 auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                🎴 Deste ({gameState?.deck_count || 0})
              </h3>
              <div style={{
                width: '60px',
                height: '80px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              }}>
                🎴
              </div>
              <button
                onClick={() => drawTile(false)}
                disabled={loading || userTiles.length >= 15}
                className="button"
                style={{ marginTop: '10px', fontSize: '12px', padding: '8px' }}
              >
                Desteden Çek
              </button>
            </div>
          </div>

          {/* Kullanıcının Taşları */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)' }}>
            <h3 style={{ marginBottom: '15px', color: '#1E3A8A' }}>
              🤚 Eliniz ({userTiles.length} taş)
            </h3>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: '20px',
              background: '#F3F4F6',
              borderRadius: '12px',
            }}>
              {userTiles.map((tile, index) => renderTile(tile, index, true))}
            </div>

            {/* Taş At Butonu */}
            {selectedTile && userTiles.length === 15 && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={discardTile}
                  disabled={loading}
                  className="button"
                  style={{
                    background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '12px 24px',
                  }}
                >
                  {loading ? '⏳ Atılıyor...' : '🗑 Seçili Taşı At'}
                </button>
              </div>
            )}
          </div>

          {/* Oyuncu Bilgileri */}
          {gameState && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginTop: '20px',
            }}>
              {Object.entries(gameState.players).map(([key, player]) => (
                <div 
                  key={key}
                  className="card" 
                  style={{ 
                    textAlign: 'center',
                    background: key === 'user' ? 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)' : '#FFFFFF',
                    color: key === 'user' ? '#1E3A8A' : '#374151',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {key === 'user' ? '👤' : '🤖'}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{player.name}</div>
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {player.tile_count} taş
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alt Bilgi */}
      <div className="card" style={{ 
        marginTop: '20px', 
        background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', color: '#3F51B5', margin: 0 }}>
          💡 <strong>İpucu:</strong> Bir taş seçin ve "Taşı At" butonuna tıklayın. AI oyuncular otomatik oynayacak.
        </p>
      </div>
    </div>
  );
}
