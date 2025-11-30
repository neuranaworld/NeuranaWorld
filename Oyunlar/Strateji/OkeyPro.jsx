import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API = `${BACKEND_URL}/api`;

// Renk Paleti - Tam tasarım dökümanına göre
const COLORS = {
  // Masa
  tableTop: '#12508A',
  tableBottom: '#0B2A4A',
  tableMid: '#0E3A67',
  
  // Ahşap Istaka
  woodBase: '#8E6C48',
  woodDark: '#6D533B',
  woodDarker: '#5B402B',
  
  // Taş (Beyaz)
  tileBase: '#FAF7F2',
  
  // Rakam Renkleri
  numberRed: '#D43C3C',
  numberBlue: '#2D7BE0',
  numberBlack: '#1E1E1E',
  numberYellow: '#D6A431',
  
  // Vurgu
  highlightBlue: '#4DA3FF',
  highlightGreen: '#39D98A',
  
  // Metin
  textLight: '#EAF2FF',
  textSecondary: '#BFD7FF',
};

export default function OkeyGame101Pro() {
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [pairCount, setPairCount] = useState(0);

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

  // Puan ve çift hesaplama
  useEffect(() => {
    if (userRacks.length > 0) {
      calculateScoreAndPairs();
    }
  }, [userRacks]);

  const calculateScoreAndPairs = () => {
    let score = 0;
    let pairs = 0;
    
    userRacks.forEach(rack => {
      rack.forEach(tile => {
        if (!tile.is_fake) {
          score += tile.number;
        }
      });
      
      // Çift sayma (basit versiyon)
      const numbers = {};
      rack.forEach(tile => {
        numbers[tile.number] = (numbers[tile.number] || 0) + 1;
      });
      Object.values(numbers).forEach(count => {
        if (count >= 2) pairs++;
      });
    });
    
    setTotalScore(score);
    setPairCount(pairs);
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const sounds = { draw: 300, discard: 200, select: 400, snap: 500 };
    osc.frequency.value = sounds[type] || 250;
    gain.gain.value = 0.1;
    osc.type = 'sine';
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  const startNewGame = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API}/games/okey/start?user_id=${userId}`);
      setGameId(response.data.game_id);
      setUserTiles(response.data.user_tiles || []);
      setOkeyTile(response.data.okey);
      setIndicator(response.data.indicator);
      setDiscardPileTop(response.data.discard_pile_top);
      setGameState(response.data.game_state);
      setUserRacks(response.data.game_state?.user_racks || [[], [], []]);
      setMessage('Oyun başladı! Taşlarınızı ıstakalara dizin.');
    } catch (error) {
      console.error('Start error:', error);
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
        setMessage('⚠️ Yandan aldınız! ELİNİZİ AÇMALISINIZ!');
      } else {
        setMessage('Taş çekildi.');
      }
    } catch (error) {
      setMessage('Hata!');
    } finally {
      setLoading(false);
    }
  };

  const openHand = async () => {
    if (!gameId || loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API}/games/okey/${gameId}/open`);
      setMessage(response.data.success ? `✅ ${response.data.message}` : `❌ ${response.data.message}`);
      if (response.data.success) {
        setGameState(response.data.game_state);
      }
    } catch (error) {
      setMessage('Açma başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTileSelection = (tile) => {
    playSound('select');
    const idx = selectedTiles.findIndex(t => t.id === tile.id);
    if (idx >= 0) {
      setSelectedTiles(selectedTiles.filter(t => t.id !== tile.id));
    } else {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const moveToRack = async (rackIndex) => {
    if (selectedTiles.length === 0) return;
    setLoading(true);
    playSound('snap');

    try {
      const tileIds = selectedTiles.map(t => t.id);
      const response = await axios.post(`${API}/games/okey/${gameId}/rack/add?rack_index=${rackIndex}`, tileIds);
      setUserTiles(response.data.game_state.user_tiles);
      setUserRacks(response.data.game_state.user_racks);
      setSelectedTiles([]);
      setMessage(`Istaka ${rackIndex + 1}'e eklendi`);
    } catch (error) {
      setMessage('Eklenemedi.');
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
      setMessage('AI oynadı. Sıra sizde!');
    } catch (error) {
      setMessage('Atılamadı.');
    } finally {
      setLoading(false);
    }
  };

  // TAŞ RENDER - Beyaz taş, renkli rakam, 3D efekt
  const renderTile = (tile, index, isSelected = false, onClick = null) => {
    if (!tile) return null;

    const numberColors = {
      red: COLORS.numberRed,
      blue: COLORS.numberBlue,
      black: COLORS.numberBlack,
      yellow: COLORS.numberYellow,
    };

    return (
      <div
        key={tile.id || index}
        onClick={onClick}
        style={{
          width: '48px',
          height: '68px',
          background: `linear-gradient(135deg, ${COLORS.tileBase} 0%, #F0EDE8 100%)`,
          border: isSelected ? `3px solid ${COLORS.highlightBlue}` : '1px solid #D1CCC6',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: isSelected 
            ? `0 4px 8px rgba(77, 163, 255, 0.4), 0 0 12px rgba(77, 163, 255, 0.3)` 
            : '0 6px 8px rgba(0,0,0,0.15)',
          transform: isSelected ? 'translateY(-4px) scale(1.03)' : 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        {/* Üst parlaklık - 2px beyaz çizgi */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '8px',
          right: '8px',
          height: '2px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '1px',
        }} />
        
        {/* Renkli sayı */}
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: numberColors[tile.color] || COLORS.numberBlack,
          textShadow: '0 1px 2px rgba(0,0,0,0.15)',
          fontFamily: 'Inter, sans-serif',
        }}>
          {tile.number}
        </div>
        
        {/* Joker yıldız */}
        {tile.is_fake && (
          <div style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            fontSize: '10px',
            opacity: 0.7,
          }}>
            ⭐
          </div>
        )}
      </div>
    );
  };

  // ÇIFT ŞERİTLİ ISTAKA - ÜST 1-8, ALT 9-15
  const renderDoubleRack = (rack, rackIndex) => {
    const upperRow = rack.slice(0, 8);
    const lowerRow = rack.slice(8, 15);

    return (
      <div
        onClick={() => selectedTiles.length > 0 && moveToRack(rackIndex)}
        style={{
          background: `linear-gradient(135deg, ${COLORS.woodBase} 0%, ${COLORS.woodDark} 50%, ${COLORS.woodDarker} 100%)`,
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '2px solid #5B402B',
          cursor: selectedTiles.length > 0 ? 'pointer' : 'default',
        }}
      >
        {/* Başlık */}
        <div style={{
          fontSize: '11px',
          color: COLORS.textLight,
          marginBottom: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: 0.9,
        }}>
          Istaka {rackIndex + 1} ({rack.length}/15)
        </div>

        {/* ÜST ŞERİT - Slot 1-8 */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '8px',
          minHeight: '70px',
          background: 'rgba(107, 52, 16, 0.3)',
          borderRadius: '8px',
          padding: '6px',
          position: 'relative',
        }}>
          {/* Slot çizgileri (kesikli) */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`upper-slot-${i}`}
              style={{
                width: '48px',
                height: '68px',
                border: '1px dashed rgba(254, 243, 199, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {upperRow[i] && renderTile(upperRow[i], i, false, null)}
            </div>
          ))}
        </div>

        {/* ALT ŞERİT - Slot 9-15 */}
        <div style={{
          display: 'flex',
          gap: '6px',
          minHeight: '70px',
          background: 'rgba(107, 52, 16, 0.3)',
          borderRadius: '8px',
          padding: '6px',
        }}>
          {[...Array(7)].map((_, i) => (
            <div
              key={`lower-slot-${i}`}
              style={{
                width: '48px',
                height: '68px',
                border: '1px dashed rgba(254, 243, 199, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {lowerRow[i] && renderTile(lowerRow[i], i + 8, false, null)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!userId) {
    return <div style={{ padding: '20px', color: 'white' }}>Yükleniyor...</div>;
  }

  return (
    <div style={{
      // MASA - Lacivert kadife gradient + noise
      background: `linear-gradient(135deg, ${COLORS.tableTop} 0%, ${COLORS.tableMid} 50%, ${COLORS.tableBottom} 100%)`,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Köşe vinjeti */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 100,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(11, 42, 74, 0.8)',
        backdropFilter: 'blur(10px)',
      }}>
        <button
          onClick={() => navigate('/games')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: COLORS.textLight,
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ← Geri
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, color: '#D6A431', fontSize: '28px', fontWeight: 'bold' }}>
            🎴 101 Okey
          </h1>
          <p style={{ margin: '4px 0 0 0', color: COLORS.textSecondary, fontSize: '12px' }}>
            Profesyonel Masa - 21 Taş - Çift Şerit
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            background: soundEnabled ? 'rgba(214, 164, 49, 0.2)' : 'rgba(255,255,255,0.1)',
            border: `2px solid ${soundEnabled ? '#D6A431' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {!gameId ? (
        /* Başlangıç */
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎴</div>
          <h2 style={{ color: COLORS.tableMid, marginBottom: '16px' }}>101 Okey Pro</h2>
          <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
            Çift şeritli ıstaka • Snap sistemi • Seri/çift tanıma
          </p>
          <button
            onClick={startNewGame}
            disabled={loading}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${COLORS.woodBase} 0%, ${COLORS.woodDark} 100%)`,
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {loading ? 'Başlatılıyor...' : '🎲 Oyunu Başlat'}
          </button>
        </div>
      ) : (
        /* Oyun Ekranı */
        <div style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
          {/* Üst bilgi barı */}
          {message && (
            <div style={{
              background: message.includes('⚠️') ? '#D6A431' : COLORS.highlightBlue,
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              {message}
            </div>
          )}

          {/* Puan ve Çift Göstergesi */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            justifyContent: 'center',
          }}>
            <div style={{
              background: totalScore >= 101 ? COLORS.highlightGreen : 'rgba(255,255,255,0.1)',
              padding: '12px 24px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
            }}>
              Puan: {totalScore}/101
            </div>
            <div style={{
              background: pairCount >= 6 ? COLORS.highlightGreen : 'rgba(255,255,255,0.1)',
              padding: '12px 24px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
            }}>
              Çift: {pairCount}/6
            </div>
          </div>

          {/* Merkez - Gösterge, Okey, Deste */}
          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            {indicator && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '4px' }}>
                  Gösterge
                </div>
                {renderTile(indicator, 0, false, null)}
              </div>
            )}
            {okeyTile && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '4px' }}>
                  ⭐ Okey
                </div>
                {renderTile(okeyTile, 0, false, null)}
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '4px' }}>
                Deste ({gameState?.deck_count || 0})
              </div>
              <button
                onClick={() => drawTile(false)}
                disabled={loading}
                style={{
                  width: '48px',
                  height: '68px',
                  background: `linear-gradient(135deg, ${COLORS.tableTop} 0%, ${COLORS.tableBottom} 100%)`,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                🎴
              </button>
            </div>
          </div>

          {/* 3 ÇIFT ŞERİTLİ ISTAKA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {userRacks.map((rack, idx) => (
              <div key={idx}>{renderDoubleRack(rack, idx)}</div>
            ))}
          </div>

          {/* Aksiyon Butonları */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            justifyContent: 'center',
          }}>
            <button
              onClick={openHand}
              disabled={loading || (totalScore < 101 && pairCount < 6)}
              style={{
                background: (totalScore >= 101 || pairCount >= 6)
                  ? `linear-gradient(135deg, ${COLORS.highlightGreen} 0%, #2DB87A 100%)`
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '12px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (totalScore >= 101 || pairCount >= 6) ? 'pointer' : 'not-allowed',
                opacity: (totalScore >= 101 || pairCount >= 6) ? 1 : 0.5,
              }}
            >
              {totalScore >= 101 ? `AÇ (${totalScore})` : pairCount >= 6 ? `${pairCount} ÇİFT AÇ` : 'AÇ (Pasif)'}
            </button>
          </div>

          {/* Eldeki Taşlar */}
          <div style={{
            background: 'rgba(142, 108, 72, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{
              fontSize: '14px',
              color: COLORS.textLight,
              marginBottom: '12px',
              fontWeight: 'bold',
            }}>
              🤚 Elinizdeki Taşlar ({userTiles.length})
              {selectedTiles.length > 0 && ` - ${selectedTiles.length} seçili`}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              minHeight: '80px',
            }}>
              {userTiles.map((tile, idx) => (
                <div key={tile.id}>
                  {renderTile(
                    tile,
                    idx,
                    selectedTiles.find(t => t.id === tile.id),
                    () => toggleTileSelection(tile)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
