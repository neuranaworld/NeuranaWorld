// Oyuncu Gösterimi Component
import React from 'react';

const PLAYER_POSITIONS = {
  bottom: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  top: { top: 20, left: '50%', transform: 'translateX(-50%)' },
  left: { left: 20, top: '50%', transform: 'translateY(-50%)' },
  right: { right: 20, top: '50%', transform: 'translateY(-50%)' }
};

export function Player({ playerKey, playerData }) {
  const pos = PLAYER_POSITIONS[playerData.position];

  return (
    <div
      key={playerKey}
      style={{
        position: 'absolute',
        ...pos,
        background: playerKey === 'user'
          ? 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)'
          : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
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
}
