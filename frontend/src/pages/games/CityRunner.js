import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Coins, Star, Target, Zap, Award } from 'lucide-react';

const CityRunner = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [mission, setMission] = useState(null);
  const [character, setCharacter] = useState('runner');

  const gameRef = useRef({
    player: {
      lane: 1,
      y: 0,
      velocityY: 0,
      width: 45,
      height: 70,
      isJumping: false,
      isDucking: false,
      gravity: 0.9,
      jumpStrength: -16,
      animFrame: 0,
      rotation: 0
    },
    lanes: [120, 300, 480],
    obstacles: [],
    coins: [],
    powerUps: [],
    particles: [],
    buildings: [],
    clouds: [],
    cars: [],
    speed: 6,
    baseSpeed: 6,
    frame: 0,
    groundY: 380,
    comboTimer: 0,
    shake: 0,
    boost: 1,
    trail: [],
    animationId: null,
    shield: false,
    magnet: false,
    doubleCoins: false,
    invincible: false,
    canvas: null,
    ctx: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('cityrunner-best');
    const savedCoins = localStorage.getItem('cityrunner-total-coins');
    const savedAchievements = localStorage.getItem('cityrunner-achievements');

    if (saved) setBestScore(parseInt(saved));
    if (savedCoins) setTotalCoins(parseInt(savedCoins));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    generateMission();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('cityrunner-best', score.toString());
    }
  }, [score, bestScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    gameRef.current.canvas = canvas;
    gameRef.current.ctx = ctx;

    initGame();

    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, []);

  const generateMission = () => {
    const missions = [
      { type: 'coins', target: 50, desc: '50 Coin Topla', icon: '💰', reward: 100 },
      { type: 'distance', target: 500, desc: '500m Koş', icon: '🏃', reward: 150 },
      { type: 'combo', target: 10, desc: '10 Kombo Yap', icon: '🔥', reward: 200 },
      { type: 'jump', target: 20, desc: '20 Kez Zıpla', icon: '⬆️', reward: 80 },
      { type: 'powerups', target: 5, desc: '5 Power-up Topla', icon: '⚡', reward: 120 },
    ];

    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    setMission({ ...randomMission, progress: 0 });
  };

  const initGame = () => {
    gameRef.current.player = {
      lane: 1,
      y: gameRef.current.groundY,
      velocityY: 0,
      width: 45,
      height: 70,
      isJumping: false,
      isDucking: false,
      gravity: 0.9,
      jumpStrength: -16,
      animFrame: 0,
      rotation: 0
    };
    gameRef.current.obstacles = [];
    gameRef.current.coins = [];
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
    gameRef.current.buildings = initBuildings();
    gameRef.current.clouds = initClouds();
    gameRef.current.cars = [];
    gameRef.current.speed = 6;
    gameRef.current.baseSpeed = 6;
    gameRef.current.frame = 0;
    gameRef.current.comboTimer = 0;
    gameRef.current.shake = 0;
    gameRef.current.boost = 1;
    gameRef.current.trail = [];
    gameRef.current.shield = false;
    gameRef.current.magnet = false;
    gameRef.current.doubleCoins = false;
    gameRef.current.invincible = false;
  };

  const initBuildings = () => {
    const buildings = [];
    for (let i = 0; i < 10; i++) {
      buildings.push({
        x: i * 180,
        height: 120 + Math.random() * 180,
        width: 90 + Math.random() * 50,
        color: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'][Math.floor(Math.random() * 4)],
        windows: Math.floor(Math.random() * 3) + 2
      });
    }
    return buildings;
  };

  const initClouds = () => {
    const clouds = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * 800,
        y: 40 + Math.random() * 100,
        size: 30 + Math.random() * 30,
        speed: 0.2 + Math.random() * 0.3
      });
    }
    return clouds;
  };

  const createParticle = (x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      gameRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color,
        size: 3 + Math.random() * 4,
        gravity: 0.3
      });
    }
  };

  const createObstacle = () => {
    const types = ['car', 'barrier', 'cone', 'trash'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);

    return {
      x: 900,
      lane: lane,
      type: type,
      width: type === 'car' ? 70 : 45,
      height: type === 'car' ? 45 : type === 'trash' ? 35 : 55,
      passed: false,
      color: type === 'car' ? ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)] : null
    };
  };

  const createCoin = () => {
    const lane = Math.floor(Math.random() * 3);
    const pattern = Math.random();

    if (pattern > 0.7) {
      // Coin trail
      const coins = [];
      for (let i = 0; i < 5; i++) {
        coins.push({
          x: 900 + i * 40,
          lane: lane,
          y: gameRef.current.groundY - 100 - Math.sin(i * 0.5) * 30,
          collected: false,
          radius: 14,
          glow: 0
        });
      }
      return coins;
    }

    return [{
      x: 900,
      lane: lane,
      y: gameRef.current.groundY - 90 - Math.random() * 110,
      collected: false,
      radius: 14,
      glow: 0
    }];
  };

  const createPowerUp = () => {
    const types = ['shield', 'magnet', 'doubleCoins', 'boost', 'invincible'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);

    return {
      x: 900,
      lane: lane,
      y: gameRef.current.groundY - 110,
      type: type,
      collected: false,
      width: 35,
      height: 35,
      pulse: 0
    };
  };

  const drawPlayer = (ctx, player, lanes) => {
    const x = lanes[player.lane];
    const y = player.y - player.height;

    ctx.save();
    ctx.translate(x, y + player.height / 2);

    if (player.rotation) {
      ctx.rotate(player.rotation);
    }

    // Trail effect
    if (gameRef.current.boost > 1 || gameRef.current.invincible) {
      gameRef.current.trail.push({ x, y: y + player.height / 2, alpha: 1 });
      if (gameRef.current.trail.length > 10) gameRef.current.trail.shift();

      gameRef.current.trail.forEach((t, i) => {
        t.alpha -= 0.1;
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = gameRef.current.invincible ? '#a855f7' : '#f59e0b';
        ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      });
      ctx.globalAlpha = 1;
    }

    // Shadow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, player.height / 2 + (gameRef.current.groundY - player.y),
                player.width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Shield glow
    if (gameRef.current.shield) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.width);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, player.width + 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 5;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, player.width / 2 + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Invincible effect
    if (gameRef.current.invincible) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 20;
    }

    // Body
    const bodyGradient = ctx.createLinearGradient(-20, -player.height / 2, 20, player.height / 2);
    bodyGradient.addColorStop(0, character === 'runner' ? '#f59e0b' : '#3b82f6');
    bodyGradient.addColorStop(1, character === 'runner' ? '#d97706' : '#1d4ed8');

    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    // Head
    ctx.fillStyle = character === 'runner' ? '#fbbf24' : '#60a5fa';
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 8, 18, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    const eyeOffset = Math.sin(player.animFrame * 0.3) * 2;
    ctx.fillRect(-10 + eyeOffset, -player.height / 2 - 13, 5, 5);
    ctx.fillRect(5 + eyeOffset, -player.height / 2 - 13, 5, 5);

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 5, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Running animation - arms
    const armSwing = Math.sin(player.animFrame * 0.4) * 15;
    ctx.strokeStyle = character === 'runner' ? '#d97706' : '#1d4ed8';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-player.width / 2, -player.height / 2 + 20);
    ctx.lineTo(-player.width / 2 - 12, -player.height / 2 + 20 + armSwing);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(player.width / 2, -player.height / 2 + 20);
    ctx.lineTo(player.width / 2 + 12, -player.height / 2 + 20 - armSwing);
    ctx.stroke();

    // Running animation - legs
    const legSwing = Math.sin(player.animFrame * 0.4) * 20;
    ctx.beginPath();
    ctx.moveTo(-12, player.height / 2);
    ctx.lineTo(-12 + legSwing, player.height / 2 + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, player.height / 2);
    ctx.lineTo(12 - legSwing, player.height / 2 + 20);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawObstacle = (ctx, obstacle, lanes) => {
    const x = obstacle.x;
    const laneX = lanes[obstacle.lane];
    const y = gameRef.current.groundY - obstacle.height;

    ctx.save();
    ctx.translate(laneX, y);

    if (obstacle.type === 'car') {
      // Modern car design
      const carGradient = ctx.createLinearGradient(-obstacle.width / 2, 0, obstacle.width / 2, obstacle.height);
      carGradient.addColorStop(0, obstacle.color);
      carGradient.addColorStop(1, obstacle.color.replace(')', ', 0.7)').replace('rgb', 'rgba'));

      // Car body
      ctx.fillStyle = carGradient;
      ctx.beginPath();
      ctx.roundRect(-obstacle.width / 2, 12, obstacle.width, obstacle.height - 20, 8);
      ctx.fill();

      // Car top (roof)
      ctx.fillStyle = obstacle.color.replace(')', ', 0.5)').replace('rgb', 'rgba').replace('#', '');
      ctx.beginPath();
      ctx.roundRect(-25, 0, 50, 18, 6);
      ctx.fill();

      // Windows with reflection
      const windowGradient = ctx.createLinearGradient(-20, 2, 20, 15);
      windowGradient.addColorStop(0, 'rgba(96, 165, 250, 0.9)');
      windowGradient.addColorStop(1, 'rgba(59, 130, 246, 0.6)');
      ctx.fillStyle = windowGradient;
      ctx.fillRect(-18, 4, 15, 12);
      ctx.fillRect(3, 4, 15, 12);

      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-obstacle.width / 2 + 5, obstacle.height - 12, 4, 0, Math.PI * 2);
      ctx.arc(-obstacle.width / 2 + 5, obstacle.height - 25, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wheels with rotation
      ctx.fillStyle = '#1f2937';
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      [-20, 20].forEach(offsetX => {
        ctx.beginPath();
        ctx.arc(offsetX, obstacle.height - 8, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wheel rim
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(offsetX, obstacle.height - 8);
          ctx.rotate((gameRef.current.frame * 0.2) + (i * Math.PI / 2));
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 6);
          ctx.stroke();
          ctx.restore();
        }
      });

    } else if (obstacle.type === 'barrier') {
      // Construction barrier
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, obstacle.height);

      ctx.fillStyle = '#fff';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-obstacle.width / 2 + 6, i * 15, obstacle.width - 12, 10);
      }

      // Reflective stripes
      ctx.fillStyle = 'rgba(254, 240, 138, 0.8)';
      ctx.fillRect(-obstacle.width / 2, 8, obstacle.width, 3);
      ctx.fillRect(-obstacle.width / 2, 38, obstacle.width, 3);

    } else if (obstacle.type === 'cone') {
      // Traffic cone with stripes
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-obstacle.width / 2, obstacle.height - 10);
      ctx.lineTo(obstacle.width / 2, obstacle.height - 10);
      ctx.closePath();
      ctx.fill();

      // White stripes
      ctx.fillStyle = '#fff';
      ctx.fillRect(-obstacle.width / 2 + 8, 18, obstacle.width - 16, 6);
      ctx.fillRect(-obstacle.width / 2 + 6, 35, obstacle.width - 12, 6);

      // Base
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(-obstacle.width / 2 - 5, obstacle.height - 10, obstacle.width + 10, 10);

    } else {
      // Trash can
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, obstacle.height);

      ctx.fillStyle = '#4b5563';
      ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, 8);

      // Lid handle
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 4, 8, Math.PI, 0);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawCoin = (ctx, coin, lanes) => {
    const x = lanes[coin.lane];

    ctx.save();
    ctx.translate(x, coin.y);

    // Glow effect
    coin.glow = (Math.sin(gameRef.current.frame * 0.15) + 1) * 0.5;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.radius + 10);
    glowGradient.addColorStop(0, `rgba(251, 191, 36, ${coin.glow * 0.6})`);
    glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius + 10, 0, Math.PI * 2);
    ctx.fill();

    // Rotation
    ctx.rotate(gameRef.current.frame * 0.12);

    // Outer ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Coin body
    const coinGradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, coin.radius);
    coinGradient.addColorStop(0, '#fef08a');
    coinGradient.addColorStop(0.5, '#fbbf24');
    coinGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = coinGradient;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius - 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner detail
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);

    ctx.restore();
  };

  const drawPowerUp = (ctx, powerUp, lanes) => {
    const x = lanes[powerUp.lane];

    ctx.save();
    ctx.translate(x, powerUp.y);

    // Pulse animation
    powerUp.pulse = Math.sin(gameRef.current.frame * 0.2) * 0.2 + 1;
    ctx.scale(powerUp.pulse, powerUp.pulse);

    const colors = {
      shield: { main: '#3b82f6', glow: '#60a5fa' },
      magnet: { main: '#8b5cf6', glow: '#a78bfa' },
      doubleCoins: { main: '#10b981', glow: '#34d399' },
      boost: { main: '#f59e0b', glow: '#fbbf24' },
      invincible: { main: '#a855f7', glow: '#c084fc' }
    };

    const icons = {
      shield: '🛡️',
      magnet: '🧲',
      doubleCoins: '💰',
      boost: '⚡',
      invincible: '✨'
    };

    // Glow
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width);
    glowGrad.addColorStop(0, colors[powerUp.type].glow + '88');
    glowGrad.addColorStop(1, colors[powerUp.type].glow + '00');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-powerUp.width, -powerUp.height, powerUp.width * 2, powerUp.height * 2);

    // Box
    ctx.fillStyle = colors[powerUp.type].main;
    ctx.shadowColor = colors[powerUp.type].glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height, 6);
    ctx.fill();

    // Icon
    ctx.shadowBlur = 0;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[powerUp.type], 0, 0);

    ctx.restore();
  };

  const drawParticles = (ctx) => {
    gameRef.current.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;

      if (p.life <= 0) {
        gameRef.current.particles.splice(i, 1);
        return;
      }

      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  const drawBackground = (ctx, canvas) => {
    // Sky with gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.6, '#B0E0E6');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun with rays
    ctx.save();
    ctx.translate(700, 90);

    // Sun rays
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI / 6) + gameRef.current.frame * 0.01);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -60);
      ctx.stroke();
      ctx.restore();
    }

    // Sun body
    const sunGradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 45);
    sunGradient.addColorStop(0, '#fef08a');
    sunGradient.addColorStop(1, '#fbbf24');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Clouds with animation
    gameRef.current.clouds.forEach(cloud => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 1.6, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fill();

      cloud.x -= cloud.speed;
      if (cloud.x + cloud.size * 2 < 0) {
        cloud.x = canvas.width + cloud.size;
      }
    });

    // Buildings with improved details
    gameRef.current.buildings.forEach(building => {
      // Building shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(building.x + 5, canvas.height - building.height - 95, building.width, building.height);

      // Building body
      const buildingGrad = ctx.createLinearGradient(building.x, 0, building.x + building.width, 0);
      buildingGrad.addColorStop(0, building.color);
      buildingGrad.addColorStop(1, building.color.replace(')', ', 0.8)').replace('rgb', 'rgba'));
      ctx.fillStyle = buildingGrad;
      ctx.fillRect(building.x, canvas.height - building.height - 100, building.width, building.height);

      // Windows pattern
      const windowRows = Math.floor(building.height / 35);
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < building.windows; col++) {
          const windowX = building.x + 12 + col * 25;
          const windowY = canvas.height - building.height - 85 + row * 35;

          // Window glow
          const isLit = Math.random() > 0.3;
          ctx.fillStyle = isLit ? '#fef08a' : '#4b5563';
          ctx.fillRect(windowX, windowY, 18, 22);

          if (isLit) {
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(windowX + 2, windowY + 2, 14, 18);
            ctx.shadowBlur = 0;
          }
        }
      }

      // Rooftop details
      ctx.fillStyle = building.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
      ctx.fillRect(building.x + building.width / 4, canvas.height - building.height - 115, building.width / 2, 15);

      building.x -= gameRef.current.speed * 0.4;
      if (building.x + building.width < 0) {
        building.x = canvas.width;
        building.height = 120 + Math.random() * 180;
        building.color = ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'][Math.floor(Math.random() * 4)];
      }
    });

    // Road
    const roadGradient = ctx.createLinearGradient(0, gameRef.current.groundY, 0, canvas.height);
    roadGradient.addColorStop(0, '#4b5563');
    roadGradient.addColorStop(1, '#374151');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, gameRef.current.groundY, canvas.width, canvas.height - gameRef.current.groundY);

    // Road markings
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 5;
    ctx.setLineDash([30, 20]);
    ctx.lineCap = 'round';

    const dashOffset = (gameRef.current.frame * gameRef.current.speed) % 50;
    ctx.lineDashOffset = -dashOffset;

    [gameRef.current.lanes[0] - 60, gameRef.current.lanes[2] + 60].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, gameRef.current.groundY + 30);
      ctx.lineTo(x, canvas.height - 20);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Sidewalk
    const sidewalkGrad = ctx.createLinearGradient(0, gameRef.current.groundY, 0, gameRef.current.groundY + 15);
    sidewalkGrad.addColorStop(0, '#9ca3af');
    sidewalkGrad.addColorStop(1, '#6b7280');
    ctx.fillStyle = sidewalkGrad;
    ctx.fillRect(0, gameRef.current.groundY, canvas.width, 15);

    // Speed lines when boosted
    if (gameRef.current.boost > 1) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const y = gameRef.current.groundY - 50 - i * 40;
        const offset = (gameRef.current.frame * gameRef.current.boost * 2) % canvas.width;
        ctx.beginPath();
        ctx.moveTo(offset - canvas.width, y);
        ctx.lineTo(offset - canvas.width + 100, y);
        ctx.stroke();
      }
    }
  };

  const checkCollision = (player, obstacle, lanes) => {
    if (player.lane !== obstacle.lane) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y;
    const obstacleX = lanes[obstacle.lane];
    const obstacleY = gameRef.current.groundY;

    const playerLeft = playerX - player.width / 2;
    const playerRight = playerX + player.width / 2;
    const playerTop = playerY - player.height;
    const playerBottom = playerY;

    const obstacleLeft = obstacleX - obstacle.width / 2;
    const obstacleRight = obstacleX + obstacle.width / 2;
    const obstacleTop = obstacleY - obstacle.height;
    const obstacleBottom = obstacleY;

    return (
      playerRight > obstacleLeft &&
      playerLeft < obstacleRight &&
      playerBottom > obstacleTop &&
      playerTop < obstacleBottom
    );
  };

  const checkCoinCollection = (player, coin, lanes) => {
    if (Math.abs(player.lane - coin.lane) > 0.5) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y - player.height / 2;
    const dist = Math.hypot(playerX - lanes[coin.lane], playerY - coin.y);

    return dist < player.width / 2 + coin.radius + 20;
  };

  const updateCombo = () => {
    setCombo(c => {
      const newCombo = c + 1;
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
        checkAchievement('combo', newCombo);
      }
      return newCombo;
    });
    gameRef.current.comboTimer = 120; // 2 seconds to maintain combo
  };

  const checkAchievement = (type, value) => {
    const newAchievements = [...achievements];
    let unlocked = false;

    if (type === 'combo' && value >= 10 && !achievements.includes('combo10')) {
      newAchievements.push('combo10');
      unlocked = true;
      showNotification('🏆 Başarı: 10x Kombo!');
    }
    if (type === 'distance' && value >= 1000 && !achievements.includes('distance1000')) {
      newAchievements.push('distance1000');
      unlocked = true;
      showNotification('🏆 Başarı: 1000m Koşu!');
    }
    if (type === 'coins' && value >= 100 && !achievements.includes('coins100')) {
      newAchievements.push('coins100');
      unlocked = true;
      showNotification('🏆 Başarı: 100 Coin!');
    }

    if (unlocked) {
      setAchievements(newAchievements);
      localStorage.setItem('cityrunner-achievements', JSON.stringify(newAchievements));
    }
  };

  const showNotification = (text) => {
    // Could implement a toast notification system here
    console.log(text);
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, obstacles, coins, powerUps, lanes, canvas, ctx, frame, speed } = gameRef.current;

    // Screen shake
    if (gameRef.current.shake > 0) {
      ctx.save();
      ctx.translate(
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2,
        Math.random() * gameRef.current.shake - gameRef.current.shake / 2
      );
      gameRef.current.shake *= 0.9;
    }

    drawBackground(ctx, canvas);

    // Update player physics
    if (player.isJumping) {
      player.velocityY += player.gravity;
      player.y += player.velocityY;
      player.rotation = player.velocityY * 0.02;

      if (player.y >= gameRef.current.groundY) {
        player.y = gameRef.current.groundY;
        player.velocityY = 0;
        player.isJumping = false;
        player.rotation = 0;
        createParticle(lanes[player.lane], player.y, '#9ca3af', 5);
      }
    } else {
      player.rotation = 0;
    }

    // Animation frame for running
    player.animFrame++;

    // Combo timer
    if (gameRef.current.comboTimer > 0) {
      gameRef.current.comboTimer--;
      if (gameRef.current.comboTimer === 0) {
        setCombo(0);
      }
    }

    // Spawn obstacles
    if (frame % Math.max(60 - level * 5, 30) === 0) {
      obstacles.push(createObstacle());
    }

    // Spawn coins
    if (frame % 50 === 0) {
      const newCoins = createCoin();
      coins.push(...newCoins);
    }

    // Spawn power-ups
    if (frame % 400 === 0) {
      powerUps.push(createPowerUp());
    }

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed * gameRef.current.boost;
      drawObstacle(ctx, obstacles[i], lanes);

      if (checkCollision(player, obstacles[i], lanes)) {
        if (gameRef.current.shield) {
          gameRef.current.shield = false;
          setPowerUp(null);
          createParticle(lanes[obstacles[i].lane], gameRef.current.groundY - 30, '#3b82f6', 20);
          obstacles.splice(i, 1);
        } else if (gameRef.current.invincible) {
          createParticle(lanes[obstacles[i].lane], gameRef.current.groundY - 30, '#a855f7', 20);
          obstacles.splice(i, 1);
          setScore(s => s + 50);
        } else {
          gameRef.current.shake = 10;
          createParticle(lanes[player.lane], player.y - player.height / 2, '#ef4444', 30);
          setGameState('gameOver');
        }
      }

      if (!obstacles[i]?.passed && obstacles[i]?.x < lanes[player.lane] - 50) {
        obstacles[i].passed = true;
        setScore(s => s + 10);
        updateCombo();
      }

      if (obstacles[i] && obstacles[i].x < -100) {
        obstacles.splice(i, 1);
      }
    }

    // Update and draw coins
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].x -= speed * gameRef.current.boost;

      if (gameRef.current.magnet) {
        const playerX = lanes[player.lane];
        const dx = playerX - lanes[coins[i].lane];
        const dy = (player.y - player.height / 2) - coins[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          coins[i].lane = player.lane;
          const speed = 8;
          coins[i].y += dy / dist * speed;
        }
      }

      drawCoin(ctx, coins[i], lanes);

      if (checkCoinCollection(player, coins[i], lanes)) {
        const coinValue = gameRef.current.doubleCoins ? 2 : 1;
        setCoins(c => c + coinValue);
        setTotalCoins(tc => tc + coinValue);
        setScore(s => s + 5 * coinValue);
        updateCombo();
        createParticle(lanes[coins[i].lane], coins[i].y, '#fbbf24', 15);
        coins.splice(i, 1);

        if (mission?.type === 'coins') {
          setMission(m => ({ ...m, progress: m.progress + coinValue }));
        }
      }

      if (coins[i] && coins[i].x < -50) {
        coins.splice(i, 1);
      }
    }

    // Update and draw power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].x -= speed * gameRef.current.boost;
      drawPowerUp(ctx, powerUps[i], lanes);

      if (player.lane === powerUps[i].lane &&
          Math.abs(lanes[player.lane] - powerUps[i].x) < 60 &&
          Math.abs(player.y - player.height / 2 - powerUps[i].y) < 60) {

        const type = powerUps[i].type;
        const colors = {
          shield: '#3b82f6',
          magnet: '#8b5cf6',
          doubleCoins: '#10b981',
          boost: '#f59e0b',
          invincible: '#a855f7'
        };

        createParticle(lanes[powerUps[i].lane], powerUps[i].y, colors[type], 25);
        setPowerUp({ type, time: Date.now() });

        if (type === 'shield') {
          gameRef.current.shield = true;
          setTimeout(() => { gameRef.current.shield = false; setPowerUp(null); }, 7000);
        } else if (type === 'magnet') {
          gameRef.current.magnet = true;
          setTimeout(() => { gameRef.current.magnet = false; setPowerUp(null); }, 7000);
        } else if (type === 'doubleCoins') {
          gameRef.current.doubleCoins = true;
          setTimeout(() => { gameRef.current.doubleCoins = false; setPowerUp(null); }, 7000);
        } else if (type === 'boost') {
          gameRef.current.boost = 2;
          setTimeout(() => { gameRef.current.boost = 1; setPowerUp(null); }, 5000);
        } else if (type === 'invincible') {
          gameRef.current.invincible = true;
          setTimeout(() => { gameRef.current.invincible = false; setPowerUp(null); }, 6000);
        }

        powerUps.splice(i, 1);

        if (mission?.type === 'powerups') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      if (powerUps[i] && powerUps[i].x < -50) {
        powerUps.splice(i, 1);
      }
    }

    drawParticles(ctx);
    drawPlayer(ctx, player, lanes);

    // Increase speed gradually
    if (frame % 500 === 0) {
      gameRef.current.speed = Math.min(14, gameRef.current.baseSpeed + Math.floor(frame / 500) * 0.8);
      setLevel(l => l + 1);
    }

    setDistance(d => {
      const newDist = d + 1;
      if (newDist % 100 === 0) {
        checkAchievement('distance', Math.floor(newDist / 10));
      }
      if (mission?.type === 'distance' && newDist % 10 === 0) {
        setMission(m => ({ ...m, progress: Math.floor(newDist / 10) }));
      }
      return newDist;
    });

    if (gameRef.current.shake > 0) {
      ctx.restore();
    }

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, level, mission, achievements, maxCombo]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.animationId = requestAnimationFrame(updateGame);
    }
    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState, updateGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      const player = gameRef.current.player;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        player.lane = Math.max(0, player.lane - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        player.lane = Math.min(2, player.lane + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        if (!player.isJumping && !player.isDucking) {
          player.isJumping = true;
          player.velocityY = player.jumpStrength;

          if (mission?.type === 'jump') {
            setMission(m => ({ ...m, progress: m.progress + 1 }));
          }
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (!player.isJumping) {
          player.isDucking = true;
          player.height = 35;
          setTimeout(() => {
            player.isDucking = false;
            player.height = 70;
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, mission]);

  const startGame = () => {
    setScore(0);
    setDistance(0);
    setCoins(0);
    setPowerUp(null);
    setCombo(0);
    setLevel(1);
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setDistance(0);
    setCoins(0);
    setPowerUp(null);
    setCombo(0);
    setLevel(1);
    initGame();
    setGameState('ready');
  };

  useEffect(() => {
    if (mission && mission.progress >= mission.target && gameState === 'playing') {
      setScore(s => s + mission.reward);
      setTotalCoins(tc => tc + mission.reward);
      showNotification(`✅ Görev Tamamlandı! +${mission.reward} coin`);
      generateMission();
    }
  }, [mission, gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">🏃‍♂️ City Runner</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-blue-300">
            <div className="text-blue-100 text-xs mb-1 font-semibold">SKOR</div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-green-300">
            <div className="text-green-100 text-xs mb-1 font-semibold">MESAFE</div>
            <div className="text-3xl font-bold text-white">{Math.floor(distance / 10)}m</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-yellow-300">
            <div className="text-yellow-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Coins className="w-4 h-4" /> COIN
            </div>
            <div className="text-3xl font-bold text-white">{coins}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-purple-300">
            <div className="text-purple-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Zap className="w-4 h-4" /> KOMBO
            </div>
            <div className="text-3xl font-bold text-white">{combo}x</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-pink-300">
            <div className="text-pink-100 text-xs mb-1 font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> EN İYİ
            </div>
            <div className="text-3xl font-bold text-white">{bestScore}</div>
          </div>
        </div>

        {mission && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl mb-4 shadow-lg border-2 border-orange-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <div className="font-bold">{mission.icon} {mission.desc}</div>
                  <div className="text-sm opacity-90">
                    İlerleme: {mission.progress} / {mission.target}
                  </div>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg font-bold">
                +{mission.reward} 💰
              </div>
            </div>
            <div className="mt-2 bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {powerUp && (
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-xl mb-4 text-center font-bold shadow-lg animate-pulse border-2 border-purple-300">
            ⚡ Power-Up Aktif: {
              powerUp.type === 'shield' ? '🛡️ Kalkan' :
              powerUp.type === 'magnet' ? '🧲 Mıknatıs' :
              powerUp.type === 'doubleCoins' ? '💰 2x Coin' :
              powerUp.type === 'boost' ? '⚡ Hız Boost' :
              '✨ Yenilmez'
            }
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl border-2 border-white/30">
          <canvas ref={canvasRef} width={900} height={550}
            className="w-full rounded-xl shadow-inner" />
        </div>

        <div className="flex gap-4 mt-6">
          {gameState === 'ready' && (
            <button onClick={startGame}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all">
              <Play className="w-6 h-6" /> Başlat
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused') && (
            <button onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all">
              {gameState === 'playing' ? <><Pause className="w-6 h-6" /> Duraklat</> : <><Play className="w-6 h-6" /> Devam</>}
            </button>
          )}
        </div>

        {gameState === 'gameOver' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 max-w-lg text-center shadow-2xl border-4 border-white/50 animate-[slideIn_0.3s_ease-out]">
              <div className="text-7xl mb-4 animate-bounce">💥</div>
              <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Oyun Bitti!</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Skor</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Mesafe</div>
                  <div className="text-3xl font-bold text-white">{Math.floor(distance / 10)}m</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-yellow-300 text-sm mb-1">Coin</div>
                  <div className="text-3xl font-bold text-yellow-300">{coins}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-purple-300 text-sm mb-1">Max Kombo</div>
                  <div className="text-3xl font-bold text-purple-300">{maxCombo}x</div>
                </div>
              </div>

              {score === bestScore && score > 0 && (
                <div className="bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-xl mb-6 text-xl animate-pulse">
                  🏆 YENİ REKOR!
                </div>
              )}

              <button onClick={startGame}
                className="w-full bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-all">
                🔄 Tekrar Oyna
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" /> Kontroller
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">← →</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">A D</kbd>
                <span>Şerit değiştir</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">↑</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">W Space</kbd>
                <span>Zıpla</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">↓</kbd>
                <span>veya</span>
                <kbd className="bg-white/20 px-3 py-1 rounded font-mono">S</kbd>
                <span>Eğil</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-300" /> Power-ups
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="bg-blue-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Kalkan - Bir çarpışmayı önle (7sn)</span>
              </div>
              <div className="bg-purple-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🧲</span>
                <span>Mıknatıs - Coinleri çek (7sn)</span>
              </div>
              <div className="bg-green-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span>2x Coin - Çift kazanç (7sn)</span>
              </div>
              <div className="bg-orange-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Boost - 2x Hız (5sn)</span>
              </div>
              <div className="bg-pink-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Yenilmez - Engelleri yok et (6sn)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white border-2 border-indigo-300">
          <h3 className="text-xl font-bold mb-3">📊 İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Toplam Coin</div>
              <div className="text-2xl font-bold">{totalCoins}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Seviye</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Max Kombo</div>
              <div className="text-2xl font-bold">{maxCombo}x</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-80">Başarılar</div>
              <div className="text-2xl font-bold">{achievements.length}/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityRunner;
