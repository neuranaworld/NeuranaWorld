// Istaka Component
import React from 'react';
import { Tile } from './Tile';

export function Rack({
  rack,
  rackIndex,
  isSelected = false,
  onDrop,
  onDragOver
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver(e);
      }}
      onDrop={() => onDrop && onDrop(rackIndex)}
      style={{
        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        borderRadius: '8px',
        padding: '10px',
        minHeight: '90px',
        border: isSelected ? '3px solid #D4AF37' : '2px solid #6B3410',
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
          rack.map((tile, idx) => (
            <Tile
              key={tile.id || idx}
              tile={tile}
              index={idx}
              isInRack={true}
              isSelectable={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
