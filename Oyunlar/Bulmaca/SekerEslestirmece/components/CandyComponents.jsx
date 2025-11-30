/**
 * Şeker Görsel Bileşenleri
 * Pixel art şeker tasarımları ve görselleştirmeleri
 */

import React from 'react';
import { Zap, Bomb, Star } from 'lucide-react';
import { CANDY_DATA } from '../core/LevelConfig';

const HeartPixelArt = ({ color }) => {
  const heartColors = {
    'heart-red': { base: '#9d0208', main: '#c1121f', mid: '#e63946', bright: '#ff4d6d', glow: '#ff6b9d' },
    'heart-pink': { base: '#be185d', main: '#db2777', mid: '#ec4899', bright: '#f472b6', glow: '#f9a8d4' },
    'heart-blue': { base: '#0369a1', main: '#0284c7', mid: '#0ea5e9', bright: '#38bdf8', glow: '#7dd3fc' },
    'heart-yellow': { base: '#ca8a04', main: '#eab308', mid: '#facc15', bright: '#fde047', glow: '#fef08a' },
    'heart-green': { base: '#15803d', main: '#16a34a', mid: '#22c55e', bright: '#4ade80', glow: '#86efac' },
    'heart-purple': { base: '#6b21a8', main: '#7e22ce', mid: '#9333ea', bright: '#a855f7', glow: '#c084fc' },
    'heart-orange': { base: '#c2410c', main: '#ea580c', mid: '#f97316', bright: '#fb923c', glow: '#fdba74' },
    'heart-cyan': { base: '#0891b2', main: '#06b6d4', mid: '#22d3ee', bright: '#67e8f9', glow: '#a5f3fc' },
  };

  const c = heartColors[color] || heartColors['heart-red'];

  return (
    <svg viewBox="0 0 28 26" className="w-12 h-12" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
      <ellipse cx="14" cy="14" rx="11" ry="10" fill={c.glow} opacity="0.3"/>
      <rect x="6" y="5" width="1" height="1" fill={c.base}/>
      <rect x="5" y="6" width="2" height="1" fill={c.base}/>
      <rect x="21" y="5" width="1" height="1" fill={c.base}/>
      <rect x="21" y="6" width="2" height="1" fill={c.base}/>
      <rect x="10" y="7" width="8" height="1" fill={c.bright}/>
      <rect x="4" y="9" width="20" height="1" fill={c.bright}/>
      <rect x="4" y="10" width="20" height="1" fill={c.glow}/>
      <rect x="8" y="9" width="2" height="1" fill="white" opacity="0.9"/>
      <rect x="5" y="12" width="18" height="1" fill={c.main}/>
      <rect x="9" y="16" width="10" height="1" fill={c.base}/>
      <rect x="13" y="20" width="2" height="1" fill={c.base}/>
    </svg>
  );
};

const ButterflyPixelArt = ({ color }) => {
  const c = CANDY_DATA[color];
  return (
    <svg viewBox="0 0 24 24" className="w-11 h-11">
      <rect x="11" y="4" width="2" height="14" fill={c?.glow || '#9333ea'}/>
      <rect x="5" y="7" width="6" height="6" fill={c?.glow || '#9333ea'} opacity="0.9"/>
      <rect x="13" y="7" width="6" height="6" fill={c?.glow || '#9333ea'} opacity="0.9"/>
      <circle cx="8" cy="10" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="16" cy="10" r="1.5" fill="white" opacity="0.7"/>
    </svg>
  );
};

const FruitPixelArt = ({ type }) => {
  const c = CANDY_DATA[type];
  return (
    <svg viewBox="0 0 20 20" className="w-10 h-10">
      <circle cx="10" cy="11" r="6" fill={c?.glow || '#22c55e'}/>
      <ellipse cx="8" cy="9" rx="3" ry="3.5" fill="white" opacity="0.5"/>
      <rect x="9" y="3" width="2" height="3" fill="#15803d"/>
    </svg>
  );
};

const VeggiePixelArt = ({ type }) => {
  const c = CANDY_DATA[type];
  return (
    <svg viewBox="0 0 20 24" className="w-10 h-10">
      <rect x="7" y="6" width="6" height="14" rx="3" fill={c?.glow || '#22c55e'}/>
      <circle cx="10" cy="10" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="10" cy="15" r="1.2" fill="white" opacity="0.6"/>
    </svg>
  );
};

const StarPixelArt = ({ type }) => {
  const c = CANDY_DATA[type];
  return (
    <svg viewBox="0 0 24 24" className="w-11 h-11">
      <path d="M 12 3 L 14 9 L 20 9 L 15 13 L 17 19 L 12 15 L 7 19 L 9 13 L 4 9 L 10 9 Z" fill={c?.glow || '#facc15'}/>
      <circle cx="12" cy="11" r="4" fill="white" opacity="0.6"/>
    </svg>
  );
};

export const Candy = ({ type, special, isSelected, worldId }) => {
  const candy = CANDY_DATA[type];
  if (!candy) return null;

  const shouldHeartbeat = worldId === 'heart' && type?.startsWith('heart-');

  return (
    <div
      className={`relative w-14 h-14 transition-all ${isSelected ? 'scale-125 z-20' : 'hover:scale-110'}`}
      style={{
        filter: isSelected
          ? `brightness(1.5) drop-shadow(0 0 25px ${candy.glow}) drop-shadow(0 0 40px ${candy.glow})`
          : 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="absolute bottom-0 left-1/2 w-10 h-2 rounded-full"
           style={{
             background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
             filter: 'blur(5px)',
             transform: 'translateX(-50%) translateY(10px)'
           }} />

      <div className="absolute inset-0.5 rounded-full overflow-hidden flex items-center justify-center"
           style={{
             background: candy.gradient,
             boxShadow: `0 10px 20px rgba(0,0,0,0.3), inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 3px 12px rgba(255,255,255,0.4)`,
             animation: isSelected ? 'candy-pulse 0.5s ease-in-out infinite' : special ? 'special-glow 1.5s ease-in-out infinite' : 'none',
           }}>
        <div className="absolute inset-0 rounded-full"
             style={{ background: `radial-gradient(circle at 35% 35%, ${candy.accent}cc 0%, transparent 60%)` }} />
        <div className="absolute"
             style={{
               top: '8%', left: '12%', width: '55%', height: '50%', borderRadius: '50%',
               background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 35%, transparent 65%)',
               transform: 'rotate(-30deg)', filter: 'blur(3px)'
             }} />

        {special && (
          <div className="absolute inset-0 m-auto flex items-center justify-center">
            {special === 'striped' && <Zap className="text-yellow-300 drop-shadow-lg" size={32} strokeWidth={4} style={{ animation: 'pulse 1s infinite' }} />}
            {special === 'wrapped' && <Bomb className="text-red-300 drop-shadow-lg" size={32} strokeWidth={4} style={{ animation: 'bounce 1s infinite' }} />}
            {special === 'rainbow' && <Star className="text-white drop-shadow-lg" size={36} strokeWidth={4} style={{ animation: 'spin 2s linear infinite' }} />}
          </div>
        )}

        {!special && (
          <div className="relative z-10" style={{
            animation: shouldHeartbeat && !isSelected ? 'heartbeat 2.5s ease-in-out infinite' : 'none'
          }}>
            {type.startsWith('heart-') ? <HeartPixelArt color={type} /> :
             type.startsWith('butterfly-') ? <ButterflyPixelArt color={type} /> :
             type.startsWith('fruit-') ? <FruitPixelArt type={type} /> :
             type.startsWith('veggie-') ? <VeggiePixelArt type={type} /> :
             type.startsWith('star-') ? <StarPixelArt type={type} /> : null}
          </div>
        )}
      </div>

      {isSelected && (
        <>
          <div className="absolute inset-[-8px] rounded-full border-4 border-yellow-300 animate-ping"
               style={{ boxShadow: '0 0 30px rgba(255,215,0,1), inset 0 0 20px rgba(255,215,0,0.5)' }} />
          <div className="absolute inset-[-6px] rounded-full border-4 border-yellow-400"
               style={{ boxShadow: '0 0 25px rgba(255,215,0,0.8)' }} />
        </>
      )}
    </div>
  );
};
