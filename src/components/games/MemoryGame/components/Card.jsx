// Kart Component
import React from 'react';

export function Card({ card, isFlipped, isMatched, onClick }) {
  const cardClasses = `
    relative w-20 h-24 rounded-xl cursor-pointer transition-all duration-300 transform
    ${isFlipped || isMatched ? 'rotate-y-180' : ''}
    ${isMatched ? 'opacity-50 scale-95' : 'hover:scale-105'}
  `;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Back of card */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center backface-hidden border-4 border-white shadow-lg"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)'
        }}
      >
        <div className="text-4xl">❓</div>
      </div>

      {/* Front of card */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center backface-hidden border-4 border-yellow-400 shadow-lg"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        <div className="text-5xl">{card.value}</div>
      </div>
    </div>
  );
}
