/**
 * Parçacık Sistemi ve Görsel Efektler
 * Patlamalar, skor popupları, şok dalgaları ve diğer görsel efektler
 */

import React from 'react';
import { Zap, Bomb, Star } from 'lucide-react';

export const AdvancedParticle = ({ x, y, color, index, type = 'explosion' }) => {
  const angle = (Math.PI * 2 * index) / 12;
  const distance = type === 'explosion' ? 80 : 50;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance - 30;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        animation: `particle-burst-${type} 0.8s ease-out forwards`,
        animationDelay: `${index * 0.02}s`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 100%)`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
        }}
      />
    </div>
  );
};

export const EnhancedScorePopup = ({ score, x, y, isCombo = false, isSpecial = false }) => {
  return (
    <div
      className="absolute pointer-events-none z-50 font-black"
      style={{
        left: x,
        top: y,
        animation: 'score-popup-enhanced 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        fontSize: isSpecial ? '4rem' : isCombo ? '3rem' : '2rem',
        textShadow: '0 0 10px rgba(255,215,0,1), 0 0 20px rgba(255,215,0,0.8), 3px 3px 6px rgba(0,0,0,0.8)',
        color: isSpecial ? '#FFD700' : '#FFD700',
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 blur-sm" style={{ color: isSpecial ? '#FF1493' : '#FFA500' }}>+{score}</div>
        <div>+{score}</div>
        {isCombo && <div className="text-xl mt-1">🔥 COMBO! 🔥</div>}
        {isSpecial && <div className="text-2xl mt-1">⚡ POWER-UP! ⚡</div>}
      </div>
    </div>
  );
};

export const ShockWave = ({ x, y, color = 'yellow' }) => {
  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        animation: 'shockwave 0.6s ease-out forwards',
      }}
    >
      <div className={`w-full h-full rounded-full border-4 border-${color}-400`}
           style={{ boxShadow: `0 0 30px rgba(255,215,0,0.8)` }} />
    </div>
  );
};

export const ComboText = ({ combo, x, y }) => {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        animation: 'combo-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      }}
    >
      <div className="text-6xl font-black" style={{
        background: 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 20px rgba(255,0,128,0.8))',
      }}>
        x{combo}
      </div>
    </div>
  );
};

export const StarBurst = ({ x, y }) => {
  return (
    <div className="absolute pointer-events-none z-40" style={{ left: x - 30, top: y - 30 }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-12 bg-gradient-to-t from-yellow-400 via-yellow-200 to-transparent"
          style={{
            left: 30,
            top: 30,
            transformOrigin: 'bottom',
            transform: `rotate(${i * 45}deg)`,
            animation: 'star-ray 0.6s ease-out forwards',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

export const PowerUpIndicator = ({ type, x, y }) => {
  const icons = {
    'striped': <Zap className="text-yellow-300" size={40} />,
    'wrapped': <Bomb className="text-red-400" size={40} />,
    'rainbow': <Star className="text-purple-400" size={40} />
  };

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: x - 20,
        top: y - 60,
        animation: 'power-up-float 1s ease-out forwards',
      }}
    >
      <div className="bg-white rounded-full p-2 shadow-2xl" style={{ animation: 'spin 1s linear infinite' }}>
        {icons[type]}
      </div>
    </div>
  );
};
