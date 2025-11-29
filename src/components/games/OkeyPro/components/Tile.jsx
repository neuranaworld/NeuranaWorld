// Okey Taşı Component
import React from 'react';
import { NUMBER_COLORS } from '../constants/gameConfig';

export function Tile({
  tile,
  index,
  isInRack = false,
  isSelectable = true,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragEnd
}) {
  if (!tile) return null;

  const numberColor = NUMBER_COLORS[tile.color] || NUMBER_COLORS.black;

  return (
    <div
      key={tile.id || index}
      draggable={isSelectable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => isSelectable && onSelect && onSelect(tile)}
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

      {/* Renk Göstergesi */}
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
}
