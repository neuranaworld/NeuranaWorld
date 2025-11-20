import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Zap, Bomb, Star, Heart, Smile, Apple, Carrot, Sun, Lock, Check, ArrowLeft, Crown, Target, Volume2, VolumeX, Trophy, Award, Flame, Crosshair } from 'lucide-react';

const GRID_SIZE = 8;

const CANDY_DATA = {
  'heart-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'heart-pink': { gradient: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899, #db2777, #be185d)', glow: '#ec4899', accent: '#fce7f3', particle: '#f50057' },
  'heart-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'heart-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'heart-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'heart-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
  'heart-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'heart-cyan': { gradient: 'linear-gradient(135deg, #a5f3fc, #67e8f9, #22d3ee, #06b6d4, #0891b2)', glow: '#22d3ee', accent: '#cffafe', particle: '#00e5ff' },
  'butterfly-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
  'butterfly-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'butterfly-cyan': { gradient: 'linear-gradient(135deg, #a5f3fc, #67e8f9, #22d3ee, #06b6d4, #0891b2)', glow: '#22d3ee', accent: '#cffafe', particle: '#00e5ff' },
  'butterfly-pink': { gradient: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899, #db2777, #be185d)', glow: '#ec4899', accent: '#fce7f3', particle: '#f50057' },
  'fruit-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'fruit-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'fruit-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'fruit-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'veggie-orange': { gradient: 'linear-gradient(135deg, #fdba74, #fb923c, #f97316, #ea580c, #c2410c)', glow: '#f97316', accent: '#fed7aa', particle: '#ff6d00' },
  'veggie-green': { gradient: 'linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a, #15803d)', glow: '#22c55e', accent: '#dcfce7', particle: '#00e676' },
  'veggie-red': { gradient: 'linear-gradient(135deg, #ff6b9d, #ff4d6d, #e63946, #c1121f, #9d0208)', glow: '#ff4d6d', accent: '#ffb3c1', particle: '#ff1744' },
  'veggie-yellow': { gradient: 'linear-gradient(135deg, #fef08a, #fde047, #facc15, #eab308, #ca8a04)', glow: '#facc15', accent: '#fef9c3', particle: '#ffd600' },
  'star-gold': { gradient: 'linear-gradient(135deg, #fef9c3, #fef08a, #fde047, #facc15, #eab308)', glow: '#facc15', accent: '#fffbeb', particle: '#ffd700' },
  'star-silver': { gradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0, #cbd5e1, #94a3b8, #64748b)', glow: '#cbd5e1', accent: '#f8fafc', particle: '#c0c0c0' },
  'star-blue': { gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9, #0284c7, #0369a1)', glow: '#0ea5e9', accent: '#e0f2fe', particle: '#00b0ff' },
  'star-purple': { gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea, #7e22ce, #6b21a8)', glow: '#a855f7', accent: '#e9d5ff', particle: '#d500f9' },
};

const WORLDS = {
  heart: {
    id: 'heart',
    name: 'Kalp Dünyası',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-200 via-red-200 to-pink-300',
    candyTypes: ['heart-red', 'heart-pink', 'heart-blue', 'heart-yellow', 'heart-green', 'heart-purple', 'heart-orange', 'heart-cyan'],
    levels: 20,
    startLevel: 1,
  },
  butterfly: {
    id: 'butterfly',
    name: 'Kelebek Dünyası',
    icon: Smile,
    color: 'from-purple-500 to-blue-500',
    bgGradient: 'from-purple-200 via-blue-200 to-purple-300',
    candyTypes: ['butterfly-purple', 'butterfly-blue', 'butterfly-cyan', 'butterfly-pink'],
    levels: 20,
    startLevel: 21,
  },
  fruit: {
    id: 'fruit',
    name: 'Meyve Dünyası',
    icon: Apple,
    color: 'from-green-500 to-yellow-500',
    bgGradient: 'from-green-200 via-yellow-200 to-green-300',
    candyTypes: ['fruit-red', 'fruit-green', 'fruit-yellow', 'fruit-orange'],
    levels: 20,
    startLevel: 41,
  },
  veggie: {
    id: 'veggie',
    name: 'Sebze Dünyası',
    icon: Carrot,
    color: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-200 via-amber-200 to-orange-300',
    candyTypes: ['veggie-orange', 'veggie-green', 'veggie-red', 'veggie-yellow'],
    levels: 20,
    startLevel: 61,
  },
  solar: {
    id: 'solar',
    name: 'Güneş Sistemi',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-200 via-orange-200 to-yellow-300',
    candyTypes: ['star-gold', 'star-silver', 'star-blue', 'star-purple'],
    levels: 20,
    startLevel: 81,
  }
};

class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playMatch(matchLength) {
    const baseFreq = 400 + (matchLength * 100);
    this.playTone(baseFreq, 0.15, 'triangle', 0.2);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.1, 'sine', 0.15), 50);
  }

  playSwap() {
    this.playTone(600, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.1), 60);
  }

  playCombo(comboLevel) {
    const notes = [523, 587, 659, 784, 880];
    const freq = notes[Math.min(comboLevel - 1, notes.length - 1)];
    this.playTone(freq, 0.2, 'square', 0.25);
    setTimeout(() => this.playTone(freq * 2, 0.15, 'sine', 0.2), 80);
  }

  playLevelComplete() {
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.2), i * 150);
    });
  }

  playPowerUp() {
    this.playTone(800, 0.1, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.25), 80);
  }

  playBomb() {
    this.playTone(200, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(100, 0.2, 'square', 0.25), 100);
  }

  playRainbow() {
    [400, 500, 600, 700, 800, 900, 1000].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.15), i * 50);
    });
  }
}

const audioEngine = new AudioEngine();

const AdvancedParticle = ({ x, y, color, index, type = 'explosion' }) => {
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

const EnhancedScorePopup = ({ score, x, y, isCombo = false, isSpecial = false }) => {
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

const ShockWave = ({ x, y, color = 'yellow' }) => {
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

const ComboText = ({ combo, x, y }) => {
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

const StarBurst = ({ x, y }) => {
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

const PowerUpIndicator = ({ type, x, y }) => {
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

const Candy = ({ type, special, isSelected, worldId }) => {
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

const MatchGame = () => {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(500);
  const [moves, setMoves] = useState(30);
  const [stars, setStars] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const [shockWaves, setShockWaves] = useState([]);
  const [comboTexts, setComboTexts] = useState([]);
  const [starBursts, setStarBursts] = useState([]);
  const [powerUpIndicators, setPowerUpIndicators] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [specialsUsed, setSpecialsUsed] = useState(0);
  const boardRef = useRef(null);

  useEffect(() => {
    audioEngine.init();
    audioEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  const createBoard = (candyTypes) => {
    const newBoard = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          type: candyTypes[Math.floor(Math.random() * candyTypes.length)],
          special: null,
          id: `${i}-${j}-${Date.now()}-${Math.random()}`
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  };

  const findAllMatches = (boardToCheck) => {
    const matches = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      let j = 0;
      while (j < GRID_SIZE) {
        let matchLength = 1;
        const currentType = boardToCheck[i][j].type;
        while (j + matchLength < GRID_SIZE && boardToCheck[i][j + matchLength].type === currentType) matchLength++;
        if (matchLength >= 3) {
          for (let k = 0; k < matchLength; k++) matches.push({ row: i, col: j + k, length: matchLength });
        }
        j += matchLength;
      }
    }
    for (let j = 0; j < GRID_SIZE; j++) {
      let i = 0;
      while (i < GRID_SIZE) {
        let matchLength = 1;
        const currentType = boardToCheck[i][j].type;
        while (i + matchLength < GRID_SIZE && boardToCheck[i + matchLength][j].type === currentType) matchLength++;
        if (matchLength >= 3) {
          for (let k = 0; k < matchLength; k++) matches.push({ row: i + k, col: j, length: matchLength });
        }
        i += matchLength;
      }
    }
    const uniqueMatches = [];
    const seen = new Set();
    matches.forEach(match => {
      const key = `${match.row},${match.col}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMatches.push(match);
      }
    });
    return uniqueMatches;
  };

  const createParticles = (row, col, color, count = 12) => {
    const cellSize = 60;
    const x = col * cellSize + cellSize / 2;
    const y = row * cellSize + cellSize / 2;

    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}-${Math.random()}`,
        x, y, color, index: i, type: 'explosion'
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const createScorePopup = (points, row, col, isCombo = false, isSpecial = false) => {
    const cellSize = 60;
    const popup = {
      id: `score-${Date.now()}-${Math.random()}`,
      score: points,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize - 20,
      isCombo,
      isSpecial
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, 1200);
  };

  const createShockWave = (row, col, color = 'yellow') => {
    const cellSize = 60;
    const wave = {
      id: `wave-${Date.now()}`,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
      color
    };
    setShockWaves(prev => [...prev, wave]);
    setTimeout(() => {
      setShockWaves(prev => prev.filter(w => w.id !== wave.id));
    }, 600);
  };

  const createComboText = (comboLevel, row, col) => {
    const cellSize = 60;
    const text = {
      id: `combo-${Date.now()}`,
      combo: comboLevel,
      x: col * cellSize,
      y: row * cellSize - 40
    };
    setComboTexts(prev => [...prev, text]);
    setTimeout(() => {
      setComboTexts(prev => prev.filter(t => t.id !== text.id));
    }, 800);
  };

  const createStarBurst = (row, col) => {
    const cellSize = 60;
    const burst = {
      id: `burst-${Date.now()}`,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    };
    setStarBursts(prev => [...prev, burst]);
    setTimeout(() => {
      setStarBursts(prev => prev.filter(b => b.id !== burst.id));
    }, 800);
  };

  const createPowerUpIndicator = (type, row, col) => {
    const cellSize = 60;
    const indicator = {
      id: `powerup-${Date.now()}`,
      type,
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    };
    setPowerUpIndicators(prev => [...prev, indicator]);
    setTimeout(() => {
      setPowerUpIndicators(prev => prev.filter(i => i.id !== indicator.id));
    }, 1000);
  };

  const createSpecialCandy = (matchLength, row, col) => {
    if (matchLength === 4) return 'striped';
    if (matchLength === 5) return 'wrapped';
    if (matchLength >= 6) return 'rainbow';
    return null;
  };

  const activateSpecial = (special, row, col, board) => {
    const cellsToDestroy = [];

    if (special === 'striped') {
      audioEngine.playPowerUp();
      for (let i = 0; i < GRID_SIZE; i++) {
        cellsToDestroy.push({ row, col: i });
        cellsToDestroy.push({ row: i, col });
      }
      createShockWave(row, col, 'blue');
    } else if (special === 'wrapped') {
      audioEngine.playBomb();
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (row + i >= 0 && row + i < GRID_SIZE && col + j >= 0 && col + j < GRID_SIZE) {
            cellsToDestroy.push({ row: row + i, col: col + j });
          }
        }
      }
      createShockWave(row, col, 'red');
      createStarBurst(row, col);
    } else if (special === 'rainbow') {
      audioEngine.playRainbow();
      const targetType = board[row][col]?.type;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (board[i][j]?.type === targetType) {
            cellsToDestroy.push({ row: i, col: j });
          }
        }
      }
      createShockWave(row, col, 'purple');
    }

    setSpecialsUsed(prev => prev + 1);
    return cellsToDestroy;
  };

  const removeAndFill = (boardToUpdate, matches, candyTypes, specials = []) => {
    if (matches.length === 0 && specials.length === 0) return boardToUpdate;
    const newBoard = boardToUpdate.map(row => row.map(cell => ({...cell})));

    const allCells = [...matches, ...specials];
    const uniqueCells = [];
    const seen = new Set();

    allCells.forEach(cell => {
      const key = `${cell.row},${cell.col}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCells.push(cell);
      }
    });

    uniqueCells.forEach(cell => {
      const candy = newBoard[cell.row][cell.col];
      if (candy) {
        createParticles(cell.row, cell.col, CANDY_DATA[candy.type]?.particle || '#fff', candy.special ? 20 : 12);
        if (cell.length >= 4 || candy.special) {
          createStarBurst(cell.row, cell.col);
        }
      }
      newBoard[cell.row][cell.col] = null;
    });

    if (uniqueCells.length > 0) {
      createShockWave(uniqueCells[0].row, uniqueCells[0].col);
    }

    // Check for special candy creation
    const matchGroups = {};
    matches.forEach(match => {
      const key = `${match.row}-${match.col}`;
      if (!matchGroups[key]) {
        matchGroups[key] = [];
      }
      matchGroups[key].push(match);
    });

    Object.entries(matchGroups).forEach(([key, group]) => {
      if (group.length >= 4) {
        const [row, col] = key.split('-').map(Number);
        const specialType = createSpecialCandy(group.length, row, col);
        if (specialType && newBoard[row][col] === null) {
          const candyType = candyTypes[Math.floor(Math.random() * candyTypes.length)];
          newBoard[row][col] = {
            type: candyType,
            special: specialType,
            id: `special-${Date.now()}-${Math.random()}`
          };
          createPowerUpIndicator(specialType, row, col);
        }
      }
    });

    for (let j = 0; j < GRID_SIZE; j++) {
      const column = [];
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        if (newBoard[i][j] !== null) column.push(newBoard[i][j]);
      }
      while (column.length < GRID_SIZE) {
        column.push({
          type: candyTypes[Math.floor(Math.random() * candyTypes.length)],
          special: null,
          id: `new-${Date.now()}-${Math.random()}`
        });
      }
      for (let i = 0; i < GRID_SIZE; i++) {
        newBoard[GRID_SIZE - 1 - i][j] = column[i];
      }
    }
    return newBoard;
  };

  const processMatches = async (currentBoard, candyTypes) => {
    let workingBoard = currentBoard.map(row => row.map(cell => ({...cell})));
    let totalScore = 0;
    let comboCount = 0;
    let continueProcessing = true;

    while (continueProcessing) {
      const matches = findAllMatches(workingBoard);
      if (matches.length === 0) {
        continueProcessing = false;
      } else {
        comboCount++;
        const matchBonus = matches.length * 10 + (comboCount > 1 ? comboCount * 20 : 0);
        totalScore += matchBonus;

        audioEngine.playMatch(matches.length);

        if (comboCount > 1) {
          audioEngine.playCombo(comboCount);
          createComboText(comboCount, matches[0].row, matches[0].col);
        }

        if (matches.length >= 5) {
          audioEngine.playPowerUp();
        }

        createScorePopup(matchBonus, matches[0].row, matches[0].col, comboCount > 1, matches.length >= 5);

        workingBoard = removeAndFill(workingBoard, matches, candyTypes);
        setBoard(workingBoard);
        setCombo(comboCount);
        if (comboCount > maxCombo) setMaxCombo(comboCount);
        setIsAnimating(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsAnimating(false);
      }
    }
    setTimeout(() => setCombo(0), 2000);
    return { finalBoard: workingBoard, scoreGained: totalScore };
  };

  const handleSwap = async (row1, col1, row2, col2) => {
    if (isAnimating) return;

    audioEngine.playSwap();

    const newBoard = board.map(row => row.map(cell => ({...cell})));

    // Check for special candy activation
    let specialCells = [];
    if (newBoard[row1][col1].special) {
      specialCells = activateSpecial(newBoard[row1][col1].special, row1, col1, newBoard);
    }
    if (newBoard[row2][col2].special) {
      specialCells = [...specialCells, ...activateSpecial(newBoard[row2][col2].special, row2, col2, newBoard)];
    }

    [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
    setBoard(newBoard);
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 250));
    setIsAnimating(false);

    if (specialCells.length > 0) {
      const specialScore = specialCells.length * 50;
      setScore(prev => prev + specialScore);
      createScorePopup(specialScore, row1, col1, false, true);
      const cleanedBoard = removeAndFill(newBoard, [], WORLDS[selectedWorld].candyTypes, specialCells);
      setBoard(cleanedBoard);
      await new Promise(resolve => setTimeout(resolve, 400));
      const { finalBoard, scoreGained } = await processMatches(cleanedBoard, WORLDS[selectedWorld].candyTypes);
      setScore(prev => prev + scoreGained);
      setBoard(finalBoard);
    } else {
      const { finalBoard, scoreGained } = await processMatches(newBoard, WORLDS[selectedWorld].candyTypes);

      if (scoreGained > 0) {
        setScore(prev => prev + scoreGained);
        setBoard(finalBoard);

        if (combo >= 5) {
          addAchievement('🔥 Combo Master! 5x Kombo!');
        }
        if (scoreGained >= 100) {
          addAchievement('💎 Mega Skor! +100 puan!');
        }
        if (specialsUsed >= 3) {
          addAchievement('⚡ Power-Up Pro! 3 özel şeker!');
        }
      } else {
        setBoard(board);
      }
    }

    setMoves(prev => {
      const newMoves = prev - 1;
      if (newMoves <= 0) setTimeout(checkLevelEnd, 500);
      return newMoves;
    });

    setSelected(null);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || levelComplete || isAnimating) return;
    if (selected === null) {
      setSelected({ row, col });
    } else {
      const rowDiff = Math.abs(selected.row - row);
      const colDiff = Math.abs(selected.col - col);
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        handleSwap(selected.row, selected.col, row, col);
      } else {
        setSelected({ row, col });
      }
    }
  };

  const addAchievement = (text) => {
    const achievement = { id: Date.now(), text };
    setAchievements(prev => [...prev, achievement]);
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 3000);
  };

  const checkLevelEnd = () => {
    if (score >= targetScore) {
      const earnedStars = score >= targetScore * 1.5 ? 3 : score >= targetScore * 1.2 ? 2 : 1;
      setStars(earnedStars);
      setLevelComplete(true);
      setTotalScore(prev => prev + score);
      if (currentLevel === unlockedLevels) {
        setUnlockedLevels(prev => prev + 1);
      }
      audioEngine.playLevelComplete();
      addAchievement('🎉 Seviye Tamamlandı!');
      if (maxCombo >= 7) {
        addAchievement('🏆 Efsane Kombo! 7x+');
      }
    } else {
      setGameOver(true);
    }
  };

  const startLevel = (world, level) => {
    setSelectedWorld(world);
    setCurrentLevel(level);
    setScore(0);
    setMoves(30);
    setTargetScore(500 + (level - 1) * 100);
    setStars(0);
    setGameOver(false);
    setLevelComplete(false);
    setCombo(0);
    setMaxCombo(0);
    setSpecialsUsed(0);
    setParticles([]);
    setScorePopups([]);
    setShockWaves([]);
    setComboTexts([]);
    setStarBursts([]);
    setPowerUpIndicators([]);
    setAchievements([]);
    setBoard(createBoard(WORLDS[world].candyTypes));
    setCurrentScreen('game');
  };

  const nextLevel = () => {
    const world = WORLDS[selectedWorld];
    const nextLevelNum = currentLevel + 1;
    if (nextLevelNum <= world.startLevel + world.levels - 1) {
      startLevel(selectedWorld, nextLevelNum);
    } else {
      setCurrentScreen('map');
    }
  };

  useEffect(() => {
    if (board.length > 0 && !isAnimating && !gameOver && !levelComplete) {
      const matches = findAllMatches(board);
      if (matches.length > 0) {
        processMatches(board, WORLDS[selectedWorld]?.candyTypes || []);
      }
    }
  }, [board]);

  if (currentScreen === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
        <style>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            5% { transform: scale(1.05); }
            10% { transform: scale(1); }
            15% { transform: scale(1.08); }
            20% { transform: scale(1); }
          }
          @keyframes particle-burst-explosion {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
          }
          @keyframes score-popup-enhanced {
            0% { transform: translateY(0) scale(0.3); opacity: 0; }
            30% { transform: translateY(-20px) scale(1.3); opacity: 1; }
            70% { transform: translateY(-50px) scale(1.1); opacity: 1; }
            100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
          }
          @keyframes shockwave {
            0% { transform: scale(0.3); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
          }
          @keyframes combo-bounce {
            0% { transform: scale(0) rotate(-10deg); opacity: 0; }
            50% { transform: scale(1.3) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes star-ray {
            0% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 1; }
            50% { transform: rotate(var(--angle, 0deg)) scaleY(1.5); opacity: 0.8; }
            100% { transform: rotate(var(--angle, 0deg)) scaleY(0); opacity: 0; }
          }
          @keyframes candy-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes special-glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3) drop-shadow(0 0 20px currentColor); }
          }
          @keyframes power-up-float {
            0% { transform: translateY(0) scale(0); opacity: 0; }
            50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl w-full">
          <div className="text-center mb-8">
            <Sparkles className="inline-block text-purple-600 mb-4" size={64} style={{ animation: 'spin 4s linear infinite' }} />
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Şeker Eşleştirme Pro
            </h1>
            <p className="text-gray-600 text-lg">Macerana başlamak için bir dünya seç!</p>
            {totalScore > 0 && (
              <div className="mt-4 inline-block bg-yellow-100 px-6 py-2 rounded-xl">
                <Trophy className="inline mr-2 text-yellow-600" size={20} />
                <span className="font-bold text-yellow-800">Toplam Puan: {totalScore}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(WORLDS).map((world) => {
              const WorldIcon = world.icon;
              const isUnlocked = unlockedLevels >= world.startLevel;

              return (
                <button
                  key={world.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedWorld(world.id);
                      setCurrentScreen('map');
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`relative p-6 rounded-2xl transition-all duration-300 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${world.bgGradient} hover:scale-105 hover:shadow-2xl cursor-pointer`
                      : 'bg-gray-200 cursor-not-allowed opacity-50'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="text-gray-500" size={32} />
                    </div>
                  )}

                  <div className={`mb-4 p-4 bg-gradient-to-br ${world.color} rounded-xl inline-block`}>
                    <WorldIcon className="text-white" size={48} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{world.name}</h3>
                  <div className="text-xs text-gray-600 font-semibold">
                    Seviye {world.startLevel} - {world.startLevel + world.levels - 1}
                  </div>

                  {isUnlocked && (
                    <div className="mt-4 flex justify-center gap-1">
                      {[...Array(world.levels)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i + world.startLevel <= unlockedLevels ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center space-y-3">
            <div className="inline-block bg-purple-100 px-6 py-3 rounded-xl">
              <p className="text-purple-800 font-bold">
                <Crown className="inline mr-2" size={20} />
                Açılan Seviye: {unlockedLevels} / 100
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex justify-center gap-4">
                <span>⚡ Özel Şekerler</span>
                <span>🔥 Kombo Sistemi</span>
                <span>🎵 Ses Efektleri</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'map' && selectedWorld) {
    const world = WORLDS[selectedWorld];
    const WorldIcon = world.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} p-4`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentScreen('lobby')}
            className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
            Dünyalara Dön
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 bg-gradient-to-br ${world.color} rounded-2xl`}>
                <WorldIcon className="text-white" size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-800">{world.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {[...Array(world.levels)].map((_, i) => {
                const levelNum = world.startLevel + i;
                const isUnlocked = levelNum <= unlockedLevels;
                const isCompleted = levelNum < unlockedLevels;

                return (
                  <button
                    key={levelNum}
                    onClick={() => isUnlocked && startLevel(world.id, levelNum)}
                    disabled={!isUnlocked}
                    className={`relative aspect-square rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg ${
                      isCompleted
                        ? `bg-gradient-to-br ${world.color} text-white hover:scale-110 shadow-xl`
                        : isUnlocked
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white hover:scale-110 shadow-xl animate-pulse'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-gray-400" size={24} />
                      </div>
                    )}
                    {(isUnlocked || isCompleted) && <span>{levelNum}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'game' && selectedWorld) {
    const world = WORLDS[selectedWorld];
    const WorldIcon = world.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${world.bgGradient} flex items-center justify-center p-4`}>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-4xl w-full relative">
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-lg"
                style={{ animation: 'combo-bounce 0.5s ease-out' }}
              >
                {achievement.text}
              </div>
            ))}
          </div>

          <div className="relative" ref={boardRef}>
            {particles.map(particle => (
              <AdvancedParticle key={particle.id} {...particle} />
            ))}
            {scorePopups.map(popup => (
              <EnhancedScorePopup key={popup.id} {...popup} />
            ))}
            {shockWaves.map(wave => (
              <ShockWave key={wave.id} {...wave} />
            ))}
            {comboTexts.map(text => (
              <ComboText key={text.id} {...text} />
            ))}
            {starBursts.map(burst => (
              <StarBurst key={burst.id} {...burst} />
            ))}
            {powerUpIndicators.map(indicator => (
              <PowerUpIndicator key={indicator.id} {...indicator} />
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentScreen('map')}
              className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              <ArrowLeft size={18} />
              Harita
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-br ${world.color} rounded-lg`}>
                <WorldIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{world.name}</h2>
                <p className="text-xs text-gray-600">Seviye {currentLevel}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition ${soundEnabled ? 'bg-purple-100 hover:bg-purple-200' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {soundEnabled ? <Volume2 size={20} className="text-purple-600" /> : <VolumeX size={20} className="text-gray-600" />}
              </button>
              <button
                onClick={() => startLevel(selectedWorld, currentLevel)}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-3 text-center">
              <div className="text-purple-600 text-xs font-bold">🎯 PUAN</div>
              <div className="text-2xl font-black text-purple-900">{score}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-3 text-center">
              <div className="text-pink-600 text-xs font-bold">🎮 HAMLE</div>
              <div className="text-2xl font-black text-pink-900">{moves}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 text-center">
              <div className="text-orange-600 text-xs font-bold">🔥 KOMBO</div>
              <div className="text-2xl font-black text-orange-900">{combo > 0 ? `x${combo}` : '-'}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 text-center">
              <div className="text-blue-600 text-xs font-bold">⚡ ÖZEL</div>
              <div className="text-2xl font-black text-blue-900">{specialsUsed}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
              <span>Hedef: {targetScore}</span>
              <span>{score} / {targetScore}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${world.color} transition-all duration-500 shadow-lg relative`}
                style={{
                  width: `${Math.min((score / targetScore) * 100, 100)}%`,
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)'
                }}
              >
                {score >= targetScore && (
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {combo > 1 && (
            <div className={`mb-3 bg-gradient-to-r ${world.color} text-white p-4 rounded-xl text-center shadow-2xl`}
                 style={{ animation: 'candy-pulse 0.5s ease-in-out infinite' }}>
              <div className="text-2xl font-black flex items-center justify-center gap-2">
                <Flame className="animate-bounce" size={28} />
                <span>KOMBO x{combo}!</span>
                <Flame className="animate-bounce" size={28} />
              </div>
            </div>
          )}

          {levelComplete && (
            <div className={`mb-4 bg-gradient-to-r ${world.color} text-white p-6 rounded-2xl text-center shadow-2xl`}>
              <div className="text-4xl font-black mb-4">🎉 SEVİYE TAMAMLANDI! 🎉</div>
              <div className="flex justify-center gap-3 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={50} className={i < stars ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400'}
                        style={{ animation: i < stars ? 'spin 1s ease-in-out infinite' : 'none' }} />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-2xl font-bold">Puan: {score}</div>
                <div className="text-lg">Max Kombo: x{maxCombo}</div>
                <div className="text-lg">Özel Şekerler: {specialsUsed}</div>
              </div>
              <button
                onClick={nextLevel}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg"
              >
                Sonraki Seviye →
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mb-4 bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-2xl text-center shadow-2xl">
              <div className="text-4xl font-black mb-4">💔 OYUN BİTTİ! 💔</div>
              <div className="space-y-2 mb-4">
                <div className="text-xl font-bold">Puan: {score} / {targetScore}</div>
                <div className="text-lg">Max Kombo: x{maxCombo}</div>
              </div>
              <button
                onClick={() => startLevel(selectedWorld, currentLevel)}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-3 shadow-2xl overflow-hidden relative">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              {board.map((row, i) =>
                row.map((candy, j) => (
                  <div
                    key={candy.id}
                    onClick={() => handleCellClick(i, j)}
                    className="flex items-center justify-center bg-purple-800/30 rounded-lg cursor-pointer hover:bg-purple-700/50 transition-all aspect-square relative"
                    style={{
                      boxShadow: selected?.row === i && selected?.col === j ? '0 0 20px rgba(255,215,0,0.8)' : 'none'
                    }}
                  >
                    <Candy
                      type={candy.type}
                      special={candy.special}
                      isSelected={selected && selected.row === i && selected.col === j}
                      worldId={selectedWorld}
                    />
                    {candy.special && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
                        {candy.special === 'striped' && <Zap size={12} className="text-white" />}
                        {candy.special === 'wrapped' && <Bomb size={12} className="text-white" />}
                        {candy.special === 'rainbow' && <Star size={12} className="text-white" />}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-blue-50 px-3 py-2 rounded-lg">
              <Zap className="inline text-blue-600 mb-1" size={16} />
              <div className="font-bold text-blue-800">Çizgili (4)</div>
              <div className="text-blue-600">Satır/Sütun</div>
            </div>
            <div className="bg-red-50 px-3 py-2 rounded-lg">
              <Bomb className="inline text-red-600 mb-1" size={16} />
              <div className="font-bold text-red-800">Sarmalı (5)</div>
              <div className="text-red-600">3x3 Patlama</div>
            </div>
            <div className="bg-purple-50 px-3 py-2 rounded-lg">
              <Star className="inline text-purple-600 mb-1" size={16} />
              <div className="font-bold text-purple-800">Gökkuşağı (6+)</div>
              <div className="text-purple-600">Tüm Renkler</div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="inline-block bg-purple-50 px-4 py-2 rounded-xl">
              <p className="text-xs text-purple-800 font-semibold">
                <Target className="inline mr-1" size={14} />
                {score >= targetScore ? '✅ Hedef Ulaşıldı!' : `${targetScore - score} puan daha gerekli`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MatchGame;
