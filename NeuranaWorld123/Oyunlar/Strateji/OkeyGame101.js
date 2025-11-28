import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sadece rakam renkleri
const NUMBER_COLORS = {
  red: '#DC2626',
  blue: '#2563EB',
  black: '#1F2937',
  yellow: '#EAB308',
};

export default function OkeyGame101() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [userTiles, setUserTiles] = useState([]);
  const [userRacks, setUserRacks] = useState([[], [], []]);
  const [okeyTile, setOkeyTile] = useState(null);
  const [indicator, setIndicator] = useState(null);
  const [discardPileTop, setDiscardPileTop] = useState(null);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [selectedRack, setSelectedRack] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [draggedTile, setDraggedTile] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const playSound = (type) => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'draw': oscillator.frequency.value = 300; gainNode.gain.value = 0.1; break;
      case 'discard': oscillator.frequency.value = 200; gainNode.gain.value = 0.15; break;
      case 'select': oscillator.frequency.value = 400; gainNode.gain.value = 0.05; break;
      default: oscillator.frequency.value = 250; gainNode.gain.value = 0.1;
    }
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const startNewGame = async () => {
    if (!userId) return;
    setLoading(true);
    setMessage('Oyun başlatılıyor...');

    try {
      const response = await axios.post(`${API}/games/okey/start?user_id=${userId}`);
      setGameId(response.data.game_id);
      setUserTiles(response.data.user_tiles || []);
      setOkeyTile(response.data.okey);
      setIndicator(response.data.indicator);
      setDiscardPileTop(response.data.discard_pile_top);
      setGameState(response.data.game_state);
      setUserRacks(response.data.game_state?.user_racks || [[], [], []]);
      setMessage('Oyun başladı! 21 taşınız var. Istakalarınıza dizin.');
    } catch (error) {
      console.error('Game start error:', error);
      setMessage('Oyun başlatılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const drawTile = async (fromDiscard = false) => {
    if (!gameId || loading) return;
    setLoading(true);
    playSound('draw');

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/draw?from_discard=${fromDiscard}`);
      setUserTiles(response.data.game_state.user_tiles);
      setUserRacks(response.data.game_state.user_racks);
      setGameState(response.data.game_state);
      
      if (fromDiscard) {
        setMessage('⚠️ Yandan taş aldınız! Elinizi AÇMALISINIZ!');
      } else {
        setMessage('Taş çekildi. Bir taş atın.');
      }
    } catch (error) {
      console.error('Draw error:', error);
      setMessage('Taş çekilemedi.');
    } finally {
      setLoading(false);
    }
  };

  const discardTile = async (tile) => {
    if (!gameId || loading) return;
    setLoading(true);
    playSound('discard');

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/discard?tile_id=${tile.id}`);
      setUserTiles(response.data.game_state.user_tiles);
      setUserRacks(response.data.game_state.user_racks);
      setDiscardPileTop(response.data.game_state.discard_pile_top);
      setGameState(response.data.game_state);
      setSelectedTiles([]);
      setMessage('AI oyuncular oynadı. Sıra sizde!');
    } catch (error) {
      console.error('Discard error:', error);
      setMessage('Taş atılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const openHand = async () => {
    if (!gameId || loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/open`);
      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setGameState(response.data.game_state);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Open error:', error);
      setMessage('Açma işlemi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTileSelection = (tile) => {
    playSound('select');
    const isSelected = selectedTiles.find(t => t.id === tile.id);
    if (isSelected) {
      setSelectedTiles(selectedTiles.filter(t => t.id !== tile.id));
    } else {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const moveToRack = async (rackIndex) => {
    if (selectedTiles.length === 0) return;
    setLoading(true);

    try {
      const tileIds = selectedTiles.map(t => t.id);
      const response = await axios.post(`${API}/games/okey/${gameId}/rack/add?rack_index=${rackIndex}`, tileIds);
      
      setUserTiles(response.data.game_state.user_tiles);
      setUserRacks(response.data.game_state.user_racks);
      setSelectedTiles([]);
      setMessage(`${selectedTiles.length} taş Istaka ${rackIndex + 1}'e eklendi`);
    } catch (error) {
      console.error('Rack add error:', error);
      setMessage('Istakaya eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const renderTile = (tile, index, isInRack = false, isSelectable = true) => {
    if (!tile) return null;

    const numberColor = NUMBER_COLORS[tile.color] || NUMBER_COLORS.black;
    const isSelected = selectedTiles.find(t => t.id === tile.id);

    return (
      <div
        key={tile.id || index}
        draggable={isSelectable}
        onDragStart={() => setDraggedTile(tile)}
        onDragEnd={() => setDraggedTile(null)}
        onClick={() => isSelectable && toggleTileSelection(tile)}
        style={{
          width: '50px',
          height: '70px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
          border: isSelected ? '3px solid #D4AF37' : '2px solid #E5E7EB',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isSelectable ? 'pointer' : 'default',
          boxShadow: isSelected 
            ? '0 4px 8px rgba(212, 175, 55, 0.4), 0 0 12px rgba(212, 175, 55, 0.2)' 
            : '0 2px 4px rgba(0,0,0,0.1)',
          transform: isSelected ? 'translateY(-5px) scale(1.05)' : 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        {/* 3D Beyaz Efekt */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
          borderRadius: '6px 6px 0 0',
        }} />
        
        {/* Renkli Sayı */}
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: numberColor,
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          zIndex: 1,
        }}>
          {tile.number}
        </div>
        
        {/* Renk Göstergesi (küçük) */}
        <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: numberColor,
          borderRadius: '50%',
          marginTop: '3px',
          border: '1px solid rgba(0,0,0,0.1)',
        }} />
        
        {/* Sahte Okey */}
        {tile.is_fake && (
          <div style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            fontSize: '8px',
            backgroundColor: '#D4AF37',
            color: '#1E3A8A',
            padding: '1px 3px',
            borderRadius: '3px',
            fontWeight: 'bold',
          }}>
            F
          </div>
        )}
      </div>
    );
  };

  const renderRack = (rack, rackIndex) => {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedTile) {
            moveToRack(rackIndex);
          }
        }}
        style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
          borderRadius: '8px',
          padding: '10px',
          minHeight: '90px',
          border: selectedRack === rackIndex ? '3px solid #D4AF37' : '2px solid #6B3410',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ 
          fontSize: '11px', 
          color: '#FEF3C7', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Istaka {rackIndex + 1} ({rack.length}/15)
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '5px', 
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {rack.length === 0 ? (
            <div style={{ 
              color: 'rgba(254, 243, 199, 0.5)', 
              fontSize: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              Buraya taş sürükleyin
            </div>
          ) : (
            rack.map((tile, idx) => renderTile(tile, idx, true, false))
          )}
        </div>
      </div>
    );
  };

  const renderPlayer = (playerKey, playerData) => {
    const positions = {
      bottom: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
      top: { top: 20, left: '50%', transform: 'translateX(-50%)' },
      left: { left: 20, top: '50%', transform: 'translateY(-50%)' },
      right: { right: 20, top: '50%', transform: 'translateY(-50%)' }
    };

    const pos = positions[playerData.position];

    return (
      <div
        key={playerKey}
        style={{
          position: 'absolute',
          ...pos,
          background: playerKey === 'user' ? 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)' : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
          padding: '8px 15px',
          borderRadius: '20px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }}
      >
        <div>{playerKey === 'user' ? '👤' : '🤖'}</div>
        <div>
          <div>{playerData.name}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {playerData.tile_count} taş {playerData.has_opened && '✓'}
          </div>
        </div>
      </div>
    );
  };

  if (!userId) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Yükleniyor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      minHeight: '100vh',
      padding: '10px',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
        borderRadius: '12px',
        padding: '15px 20px',
        marginBottom: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button onClick={() => navigate('/games')} style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
        }}>
          ← Geri
        </button>
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ margin: 0, color: '#D4AF37', fontSize: '24px' }}>🎴 101 Okey</h1>
          <p style={{ margin: '5px 0 0 0', color: '#FEF3C7', fontSize: '12px' }}>21 Taş - 3 Istaka</p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            background: soundEnabled ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.1)',
            border: `2px solid ${soundEnabled ? '#D4AF37' : '#fff'}`,
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {!gameId ? (
        /* Başlangıç Ekranı */
        <div style={{ 
          textAlign: 'center', 
          background: 'white',
          maxWidth: '500px',
          margin: '50px auto',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎴</div>
          <h2 style={{ marginBottom: '15px', color: '#1E3A8A' }}>101 Okey'e Hoş Geldiniz!</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
            Gerçek 101 Okey kuralları ile oyna!
          </p>
          
          <div style={{ 
            background: '#E0E7FF', 
            borderRadius: '12px', 
            padding: '15px', 
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#1E40AF' }}>
              📋 Gerçek Kurallar:
            </h3>
            <ul style={{ fontSize: '12px', color: '#374151', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
              <li>Her oyuncuya 21 taş dağıtılır</li>
              <li>3 ıstakaya taşları dizin</li>
              <li>101+ puan ile aç VEYA 5+ çift ile aç</li>
              <li>Yandan taş alırsan açmak zorundasın!</li>
              <li>Perler: 3-4 taşlık seri veya grup</li>
            </ul>
          </div>

          <button
            onClick={startNewGame}
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
              color: '#1E3A8A',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {loading ? '🎲 Başlatılıyor...' : '🎲 Oyunu Başlat'}
          </button>
        </div>
      ) : (
        /* Oyun Ekranı */
        <div style={{ position: 'relative', height: 'calc(100vh - 100px)' }}>
          {/* Oyuncular */}
          {gameState && Object.entries(gameState.players).map(([key, player]) => 
            renderPlayer(key, player)
          )}

          {/* Merkez Alan - Gösterge, Okey, Deste */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
          }}>
            {/* Gösterge */}
            {indicator && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '3px' }}>Gösterge</div>
                {renderTile(indicator, 0, false, false)}
              </div>
            )}

            {/* Okey */}
            {okeyTile && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '3px' }}>⭐ Okey</div>
                {renderTile(okeyTile, 0, false, false)}
              </div>
            )}

            {/* Yığın */}
            {discardPileTop && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '3px' }}>Yığın</div>
                {renderTile(discardPileTop, 0, false, false)}
                <button
                  onClick={() => drawTile(true)}
                  disabled={loading}
                  style={{
                    marginTop: '5px',
                    fontSize: '10px',
                    padding: '4px 8px',
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Al
                </button>
              </div>
            )}

            {/* Deste */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '3px' }}>
                Deste ({gameState?.deck_count || 0})
              </div>
              <div style={{
                width: '50px',
                height: '70px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}>
                🎴
              </div>
              <button
                onClick={() => drawTile(false)}
                disabled={loading}
                style={{
                  marginTop: '5px',
                  fontSize: '10px',
                  padding: '4px 8px',
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Çek
              </button>
            </div>
          </div>

          {/* Alt Panel - Kullanıcının Alanı */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '16px 16px 0 0',
            padding: '15px',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
            maxHeight: '50vh',
            overflowY: 'auto',
          }}>
            {/* Durum Mesajı */}
            {message && (
              <div style={{
                background: message.includes('⚠️') ? '#FEF3C7' : '#E0E7FF',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: message.includes('⚠️') ? '#92400E' : '#1E40AF',
                textAlign: 'center',
              }}>
                {message}
              </div>
            )}

            {/* Aksiyon Butonları */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={openHand}
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ✅ Eli Aç
              </button>
              
              {selectedTiles.length > 0 && (
                <>
                  <button
                    onClick={() => moveToRack(0)}
                    style={{
                      flex: 1,
                      background: '#8B4513',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    → Istaka 1
                  </button>
                  <button
                    onClick={() => moveToRack(1)}
                    style={{
                      flex: 1,
                      background: '#8B4513',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    → Istaka 2
                  </button>
                  <button
                    onClick={() => moveToRack(2)}
                    style={{
                      flex: 1,
                      background: '#8B4513',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    → Istaka 3
                  </button>
                  
                  {userTiles.length > 21 && (
                    <button
                      onClick={() => selectedTiles.length === 1 && discardTile(selectedTiles[0])}
                      disabled={selectedTiles.length !== 1}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        opacity: selectedTiles.length === 1 ? 1 : 0.5,
                      }}
                    >
                      🗑 At
                    </button>
                  )}
                </>
              )}
            </div>

            {/* 3 Istaka */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '10px',
              marginBottom: '10px',
            }}>
              {userRacks.map((rack, idx) => (
                <div key={idx}>
                  {renderRack(rack, idx)}
                </div>
              ))}
            </div>

            {/* Eldeki Taşlar */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#1E3A8A'
              }}>
                🤚 Elinizdeki Taşlar ({userTiles.length})
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '5px', 
                flexWrap: 'wrap',
                background: '#F3F4F6',
                padding: '10px',
                borderRadius: '8px',
                minHeight: '90px',
              }}>
                {userTiles.length === 0 ? (
                  <div style={{ 
                    color: '#9CA3AF', 
                    fontSize: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    Tüm taşlar ıstakalarda
                  </div>
                ) : (
                  userTiles.map((tile, idx) => renderTile(tile, idx, false, true))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
