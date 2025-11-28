import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Zap, Star, Award, Target } from 'lucide-react';

const SkyJumper = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [height, setHeight] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [mission, setMission] = useState(null);
  const [theme, setTheme] = useState('sky');

  const gameRef = useRef({
    player: {
      x: 400,
      y: 400,
      width: 50,
      height: 50,
      velocityX: 0,
      velocityY: 0,
      gravity: 0.5,
      jumpPower: -15,
      maxVelocityX: 8,
      animFrame: 0,
      rotation: 0,
      trail: []
    },
    platforms: [],
    enemies: [],
    powerUps: [],
    particles: [],
    camera: {
      y: 0,
      targetY: 0
    },
    frame: 0,
    maxHeight: 0,
    lastPlatformY: 500,
    comboTimer: 0,
    shield: false,
    jetpack: false,
    magnet: false,
    slowmo: false,
    starMultiplier: 1,
    animationId: null,
    canvas: null,
    ctx: null,
    keys: {}
  });

  useEffect(() => {
    const saved = localStorage.getItem('skyjumper-best');
    const savedAchievements = localStorage.getItem('skyjumper-achievements');

    if (saved) setBestScore(parseInt(saved));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    generateMission();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('skyjumper-best', score.toString());
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
      { type: 'height', target: 5000, desc: '5000m Yüksel', icon: '🎯', reward: 500 },
      { type: 'platforms', target: 50, desc: '50 Platform', icon: '📦', reward: 300 },
      { type: 'combo', target: 15, desc: '15x Kombo', icon: '🔥', reward: 400 },
      { type: 'enemies', target: 10, desc: '10 Düşman Yok Et', icon: '💥', reward: 350 },
      { type: 'powerups', target: 5, desc: '5 Power-up', icon: '⚡', reward: 250 },
    ];

    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    setMission({ ...randomMission, progress: 0 });
  };

  const initGame = () => {
    const player = gameRef.current.player;
    player.x = 400;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.animFrame = 0;
    player.rotation = 0;
    player.trail = [];

    gameRef.current.platforms = generateInitialPlatforms();
    gameRef.current.enemies = [];
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
    gameRef.current.camera.y = 0;
    gameRef.current.camera.targetY = 0;
    gameRef.current.frame = 0;
    gameRef.current.maxHeight = 0;
    gameRef.current.lastPlatformY = 500;
    gameRef.current.comboTimer = 0;
    gameRef.current.shield = false;
    gameRef.current.jetpack = false;
    gameRef.current.magnet = false;
    gameRef.current.slowmo = false;
    gameRef.current.starMultiplier = 1;
  };

  const generateInitialPlatforms = () => {
    const platforms = [];
    // Starting platform
    platforms.push({
      x: 350,
      y: 500,
      width: 100,
      height: 15,
      type: 'normal',
      moving: false,
      broken: false
    });

    // Generate platforms going up
    for (let i = 0; i < 15; i++) {
      platforms.push(createPlatform(400 - i * 80));
    }

    return platforms;
  };

  const createPlatform = (y) => {
    const types = ['normal', 'normal', 'normal', 'moving', 'breaking', 'spring'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      x: Math.random() * 700 + 50,
      y: y,
      width: type === 'spring' ? 80 : 100,
      height: 15,
      type: type,
      moving: type === 'moving',
      moveSpeed: type === 'moving' ? (Math.random() > 0.5 ? 2 : -2) : 0,
      broken: false,
      compressed: 0
    };
  };

  const createEnemy = (y) => {
    const types = ['flying', 'static'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      x: Math.random() * 700 + 50,
      y: y,
      width: 40,
      height: 40,
      type: type,
      moving: type === 'flying',
      moveSpeed: type === 'flying' ? (Math.random() > 0.5 ? 1.5 : -1.5) : 0,
      alive: true,
      animFrame: 0
    };
  };

  const createPowerUp = (y) => {
    const types = ['jetpack', 'shield', 'magnet', 'slowmo', 'star'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      x: Math.random() * 700 + 50,
      y: y,
      width: 35,
      height: 35,
      type: type,
      collected: false,
      pulse: 0,
      rotation: 0
    };
  };

  const createParticle = (x, y, color, count = 10, size = 3) => {
    for (let i = 0; i < count; i++) {
      gameRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color,
        size: size + Math.random() * 3,
        gravity: 0.2
      });
    }
  };

  const drawBackground = (ctx, canvas) => {
    const cameraY = gameRef.current.camera.y;

    // Sky gradient based on height
    const heightFactor = Math.min(1, Math.abs(cameraY) / 10000);

    let gradient;
    if (theme === 'sky') {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `hsl(${210 - heightFactor * 60}, 70%, ${70 - heightFactor * 20}%)`);
      gradient.addColorStop(0.5, `hsl(${200 - heightFactor * 40}, 65%, ${80 - heightFactor * 30}%)`);
      gradient.addColorStop(1, `hsl(${190 - heightFactor * 20}, 60%, ${90 - heightFactor * 40}%)`);
    } else {
      // Space theme
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1f3a');
      gradient.addColorStop(1, '#2d1b4e');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars/clouds
    if (theme === 'space') {
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 100; i++) {
        const x = (i * 123) % canvas.width;
        const y = ((i * 456 + cameraY * 0.1) % canvas.height);
        const size = (i % 3) + 1;
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
    } else {
      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < 8; i++) {
        const x = ((i * 180 + gameRef.current.frame * 0.2) % (canvas.width + 100)) - 50;
        const y = (150 + i * 100 + cameraY * 0.3) % canvas.height;
        const size = 40 + (i % 3) * 15;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.7, y, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.4, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Grid lines for depth
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSpacing = 100;
    const offsetY = cameraY % gridSpacing;

    for (let i = 0; i < canvas.height / gridSpacing + 1; i++) {
      const y = i * gridSpacing - offsetY;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx, player, cameraY) => {
    const screenY = player.y - cameraY;

    ctx.save();
    ctx.translate(player.x, screenY);

    if (player.rotation) {
      ctx.rotate(player.rotation);
    }

    // Trail effect for special modes
    if (gameRef.current.jetpack || gameRef.current.starMultiplier > 1) {
      player.trail.push({ x: player.x, y: player.y, alpha: 1 });
      if (player.trail.length > 8) player.trail.shift();

      player.trail.forEach((t, i) => {
        t.alpha -= 0.12;
        const trailScreenY = t.y - cameraY;
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = gameRef.current.jetpack ? '#f59e0b' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, trailScreenY - screenY, player.width / 2 - i * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // Shield effect
    if (gameRef.current.shield) {
      const shieldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.width);
      shieldGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      shieldGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = shieldGradient;
      ctx.beginPath();
      ctx.arc(0, 0, player.width, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, player.width * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Jetpack flames
    if (gameRef.current.jetpack) {
      const flameHeight = 20 + Math.sin(player.animFrame * 0.3) * 5;
      const flameGradient = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + flameHeight);
      flameGradient.addColorStop(0, '#f59e0b');
      flameGradient.addColorStop(0.5, '#ef4444');
      flameGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.moveTo(-15, player.height / 2);
      ctx.lineTo(-10, player.height / 2 + flameHeight);
      ctx.lineTo(-5, player.height / 2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(5, player.height / 2);
      ctx.lineTo(10, player.height / 2 + flameHeight);
      ctx.lineTo(15, player.height / 2);
      ctx.closePath();
      ctx.fill();
    }

    // Body - cute character
    const bodyGradient = ctx.createLinearGradient(-20, -player.height / 2, 20, player.height / 2);
    bodyGradient.addColorStop(0, '#10b981');
    bodyGradient.addColorStop(1, '#059669');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    // Head
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 10, 20, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeBounce = Math.abs(Math.sin(player.animFrame * 0.2)) * 2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-8, -player.height / 2 - 12 - eyeBounce, 6, 0, Math.PI * 2);
    ctx.arc(8, -player.height / 2 - 12 - eyeBounce, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-8, -player.height / 2 - 11 - eyeBounce, 3, 0, Math.PI * 2);
    ctx.arc(8, -player.height / 2 - 11 - eyeBounce, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 6, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Antenna (if jetpack)
    if (gameRef.current.jetpack) {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -player.height / 2);
      ctx.lineTo(-10, -player.height / 2 - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -player.height / 2);
      ctx.lineTo(10, -player.height / 2 - 15);
      ctx.stroke();
    }

    // Arms (simple)
    const armSwing = Math.sin(player.animFrame * 0.3) * 10;
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-player.width / 2, -5);
    ctx.lineTo(-player.width / 2 - 10, -5 + armSwing);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(player.width / 2, -5);
    ctx.lineTo(player.width / 2 + 10, -5 - armSwing);
    ctx.stroke();

    ctx.restore();
  };

  const drawPlatform = (ctx, platform, cameraY) => {
    const screenY = platform.y - cameraY;

    ctx.save();
    ctx.translate(platform.x, screenY);

    // Shadow
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000';
    ctx.fillRect(-platform.width / 2 + 3, platform.height, platform.width - 6, 6);
    ctx.globalAlpha = 1;

    // Platform based on type
    let platformColor, platformTopColor;

    switch (platform.type) {
      case 'normal':
        platformColor = '#10b981';
        platformTopColor = '#34d399';
        break;
      case 'moving':
        platformColor = '#3b82f6';
        platformTopColor = '#60a5fa';
        break;
      case 'breaking':
        platformColor = platform.broken ? '#991b1b' : '#b45309';
        platformTopColor = platform.broken ? '#dc2626' : '#f59e0b';
        break;
      case 'spring':
        platformColor = '#dc2626';
        platformTopColor = '#f87171';
        break;
      default:
        platformColor = '#6b7280';
        platformTopColor = '#9ca3af';
    }

    // Platform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, platform.height);
    gradient.addColorStop(0, platformTopColor);
    gradient.addColorStop(1, platformColor);
    ctx.fillStyle = gradient;

    if (platform.type === 'spring') {
      // Spring platform - coil design
      const compression = platform.compressed || 0;
      ctx.fillRect(-platform.width / 2, -5 + compression, platform.width, platform.height + 5 - compression);

      // Spring coil
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-platform.width / 2 + 10, i * 5 - 5 + compression);
        ctx.lineTo(platform.width / 2 - 10, i * 5 - 5 + compression);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.roundRect(-platform.width / 2, 0, platform.width, platform.height, 6);
      ctx.fill();

      // Top highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-platform.width / 2 + 5, 2, platform.width - 10, 4);

      // Breaking platform cracks
      if (platform.type === 'breaking' && platform.broken) {
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-platform.width / 4, 0);
        ctx.lineTo(-platform.width / 4 + 5, platform.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(platform.width / 4, 0);
        ctx.lineTo(platform.width / 4 - 5, platform.height);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  const drawEnemy = (ctx, enemy, cameraY) => {
    const screenY = enemy.y - cameraY;

    ctx.save();
    ctx.translate(enemy.x, screenY);

    enemy.animFrame = (enemy.animFrame || 0) + 1;

    if (enemy.type === 'flying') {
      // Flying enemy - bat-like
      const wingFlap = Math.sin(enemy.animFrame * 0.2) * 10;

      // Body
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.ellipse(0, 0, enemy.width / 2, enemy.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      const wingGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, enemy.width);
      wingGradient.addColorStop(0, '#8b5cf6');
      wingGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = wingGradient;

      ctx.beginPath();
      ctx.ellipse(-enemy.width / 2, -5, enemy.width / 2, 15 + wingFlap, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(enemy.width / 2, -5, enemy.width / 2, 15 + wingFlap, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-8, -5, 4, 0, Math.PI * 2);
      ctx.arc(8, -5, 4, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Static enemy - spiky
      ctx.fillStyle = '#ef4444';

      // Spikes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + enemy.animFrame * 0.05;
        const spikeLength = 12 + Math.sin(enemy.animFrame * 0.1 + i) * 3;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -enemy.height / 2);
        ctx.lineTo(-5, -enemy.height / 2 - spikeLength);
        ctx.lineTo(5, -enemy.height / 2 - spikeLength);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Body
      ctx.beginPath();
      ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Evil eyes
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(-6, -3, 3, 0, Math.PI * 2);
      ctx.arc(6, -3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawPowerUp = (ctx, powerUp, cameraY) => {
    const screenY = powerUp.y - cameraY;

    ctx.save();
    ctx.translate(powerUp.x, screenY);

    powerUp.pulse = Math.sin(gameRef.current.frame * 0.15) * 0.2 + 1;
    powerUp.rotation = (powerUp.rotation || 0) + 0.05;

    ctx.scale(powerUp.pulse, powerUp.pulse);
    ctx.rotate(powerUp.rotation);

    const colors = {
      jetpack: { main: '#f59e0b', glow: '#fbbf24' },
      shield: { main: '#3b82f6', glow: '#60a5fa' },
      magnet: { main: '#8b5cf6', glow: '#a78bfa' },
      slowmo: { main: '#06b6d4', glow: '#22d3ee' },
      star: { main: '#fbbf24', glow: '#fef08a' }
    };

    const icons = {
      jetpack: '🚀',
      shield: '🛡️',
      magnet: '🧲',
      slowmo: '⏱️',
      star: '⭐'
    };

    // Glow
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width * 1.5);
    glowGrad.addColorStop(0, colors[powerUp.type].glow + '66');
    glowGrad.addColorStop(1, colors[powerUp.type].glow + '00');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-powerUp.width, -powerUp.height, powerUp.width * 2, powerUp.height * 2);

    // Box
    ctx.fillStyle = colors[powerUp.type].main;
    ctx.shadowColor = colors[powerUp.type].glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height, 8);
    ctx.fill();

    // Icon
    ctx.shadowBlur = 0;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[powerUp.type], 0, 0);

    ctx.restore();
  };

  const drawParticles = (ctx, cameraY) => {
    gameRef.current.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;

      if (p.life <= 0) {
        gameRef.current.particles.splice(i, 1);
        return;
      }

      const screenY = p.y - cameraY;
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
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
    gameRef.current.comboTimer = 180; // 3 seconds
  };

  const checkAchievement = (type, value) => {
    const newAchievements = [...achievements];
    let unlocked = false;

    const achievementsList = [
      { id: 'height1000', type: 'height', value: 1000, name: '1000m Yükseklik' },
      { id: 'height5000', type: 'height', value: 5000, name: '5000m Yükseklik' },
      { id: 'height10000', type: 'height', value: 10000, name: '10000m Yükseklik' },
      { id: 'combo15', type: 'combo', value: 15, name: '15x Kombo' },
      { id: 'combo25', type: 'combo', value: 25, name: '25x Kombo' },
      { id: 'platforms100', type: 'platforms', value: 100, name: '100 Platform' },
      { id: 'enemies20', type: 'enemies', value: 20, name: '20 Düşman' },
    ];

    achievementsList.forEach(ach => {
      if (ach.type === type && value >= ach.value && !achievements.includes(ach.id)) {
        newAchievements.push(ach.id);
        unlocked = true;
        showNotification(`🏆 ${ach.name}!`);
      }
    });

    if (unlocked) {
      setAchievements(newAchievements);
      localStorage.setItem('skyjumper-achievements', JSON.stringify(newAchievements));
    }
  };

  const showNotification = (text) => {
    console.log(text);
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, platforms, enemies, powerUps, camera, keys, ctx, canvas } = gameRef.current;
    const timeScale = gameRef.current.slowmo ? 0.5 : 1;

    // Clear and draw background
    drawBackground(ctx, canvas);

    // Player horizontal movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      player.velocityX = Math.max(-player.maxVelocityX, player.velocityX - 0.8);
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      player.velocityX = Math.min(player.maxVelocityX, player.velocityX + 0.8);
    } else {
      player.velocityX *= 0.9; // Friction
    }

    player.x += player.velocityX;

    // Screen wrap
    if (player.x < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = 0;

    // Jetpack physics
    if (gameRef.current.jetpack) {
      player.velocityY = -12;
    } else {
      // Normal gravity
      player.velocityY += player.gravity * timeScale;
    }

    player.y += player.velocityY * timeScale;
    player.animFrame++;

    // Rotation based on horizontal velocity
    player.rotation = player.velocityX * 0.02;

    // Camera follow
    if (player.y < camera.targetY + 200) {
      camera.targetY = player.y - 200;
    }
    camera.y += (camera.targetY - camera.y) * 0.1;

    // Update max height
    const currentHeight = Math.max(0, -player.y);
    if (currentHeight > gameRef.current.maxHeight) {
      gameRef.current.maxHeight = currentHeight;
      setHeight(Math.floor(currentHeight));
      setScore(s => s + 1 * gameRef.current.starMultiplier);

      if (Math.floor(currentHeight) % 100 === 0 && currentHeight > 0) {
        checkAchievement('height', Math.floor(currentHeight));
      }

      if (mission?.type === 'height') {
        setMission(m => ({ ...m, progress: Math.floor(currentHeight) }));
      }
    }

    // Combo timer
    if (gameRef.current.comboTimer > 0) {
      gameRef.current.comboTimer--;
      if (gameRef.current.comboTimer === 0) {
        setCombo(0);
      }
    }

    // Platform collision and updates
    for (let i = platforms.length - 1; i >= 0; i--) {
      const platform = platforms[i];

      // Moving platforms
      if (platform.moving) {
        platform.x += platform.moveSpeed * timeScale;
        if (platform.x < 50 || platform.x > canvas.width - 50) {
          platform.moveSpeed *= -1;
        }
      }

      // Spring compression animation
      if (platform.compressed > 0) {
        platform.compressed *= 0.8;
        if (platform.compressed < 0.5) platform.compressed = 0;
      }

      // Platform collision (only when falling)
      if (player.velocityY > 0 &&
          player.y + player.height / 2 >= platform.y &&
          player.y + player.height / 2 <= platform.y + platform.height + 10 &&
          player.x >= platform.x - platform.width / 2 &&
          player.x <= platform.x + platform.width / 2) {

        if (platform.type === 'breaking') {
          if (!platform.broken) {
            platform.broken = true;
            setTimeout(() => {
              const idx = platforms.indexOf(platform);
              if (idx > -1) platforms.splice(idx, 1);
            }, 200);
          } else {
            continue; // Don't bounce on broken platform
          }
        }

        if (platform.type === 'spring') {
          player.velocityY = player.jumpPower * 1.8;
          platform.compressed = 10;
          createParticle(platform.x, platform.y, '#f87171', 20, 4);
        } else {
          player.velocityY = player.jumpPower;
        }

        player.y = platform.y - player.height / 2;
        updateCombo();
        createParticle(platform.x, platform.y, '#10b981', 8, 2);

        if (mission?.type === 'platforms') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      // Remove platforms below screen
      if (platform.y - camera.y > canvas.height + 100) {
        platforms.splice(i, 1);
      }
    }

    // Generate new platforms
    if (player.y < gameRef.current.lastPlatformY) {
      const newPlatform = createPlatform(gameRef.current.lastPlatformY - 80);
      platforms.push(newPlatform);
      gameRef.current.lastPlatformY -= 80;

      // Occasionally spawn enemies
      if (Math.random() < 0.15 && currentHeight > 500) {
        enemies.push(createEnemy(gameRef.current.lastPlatformY - 40));
      }

      // Occasionally spawn power-ups
      if (Math.random() < 0.08 && currentHeight > 200) {
        powerUps.push(createPowerUp(gameRef.current.lastPlatformY));
      }
    }

    // Enemy updates and collision
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      if (enemy.moving) {
        enemy.x += enemy.moveSpeed * timeScale;
        if (enemy.x < 50 || enemy.x > canvas.width - 50) {
          enemy.moveSpeed *= -1;
        }
      }

      // Enemy collision
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (dist < (player.width / 2 + enemy.width / 2)) {
        if (gameRef.current.shield) {
          gameRef.current.shield = false;
          setPowerUp(null);
          createParticle(enemy.x, enemy.y, '#3b82f6', 25, 5);
          enemies.splice(i, 1);
        } else if (player.velocityY > 0 && player.y < enemy.y) {
          // Jump on enemy
          player.velocityY = player.jumpPower * 0.8;
          createParticle(enemy.x, enemy.y, '#a855f7', 30, 4);
          enemies.splice(i, 1);
          setScore(s => s + 50 * gameRef.current.starMultiplier);
          updateCombo();

          if (mission?.type === 'enemies') {
            setMission(m => ({ ...m, progress: m.progress + 1 }));
          }
        } else {
          // Game over
          createParticle(player.x, player.y, '#ef4444', 40, 5);
          setGameState('gameOver');
        }
      }

      // Remove enemies below screen
      if (enemy.y - camera.y > canvas.height + 100) {
        enemies.splice(i, 1);
      }
    }

    // Power-up updates and collection
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];

      // Magnet pull
      if (gameRef.current.magnet) {
        const dx = player.x - powerUp.x;
        const dy = player.y - powerUp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          powerUp.x += (dx / dist) * 5;
          powerUp.y += (dy / dist) * 5;
        }
      }

      // Collection
      const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);
      if (dist < (player.width / 2 + powerUp.width / 2)) {
        const type = powerUp.type;
        const colors = {
          jetpack: '#f59e0b',
          shield: '#3b82f6',
          magnet: '#8b5cf6',
          slowmo: '#06b6d4',
          star: '#fbbf24'
        };

        createParticle(powerUp.x, powerUp.y, colors[type], 30, 5);
        setPowerUp({ type, time: Date.now() });

        if (type === 'jetpack') {
          gameRef.current.jetpack = true;
          setTimeout(() => { gameRef.current.jetpack = false; setPowerUp(null); }, 3000);
        } else if (type === 'shield') {
          gameRef.current.shield = true;
          setTimeout(() => { gameRef.current.shield = false; setPowerUp(null); }, 8000);
        } else if (type === 'magnet') {
          gameRef.current.magnet = true;
          setTimeout(() => { gameRef.current.magnet = false; setPowerUp(null); }, 6000);
        } else if (type === 'slowmo') {
          gameRef.current.slowmo = true;
          setTimeout(() => { gameRef.current.slowmo = false; setPowerUp(null); }, 5000);
        } else if (type === 'star') {
          gameRef.current.starMultiplier = 2;
          setTimeout(() => { gameRef.current.starMultiplier = 1; setPowerUp(null); }, 7000);
        }

        powerUps.splice(i, 1);

        if (mission?.type === 'powerups') {
          setMission(m => ({ ...m, progress: m.progress + 1 }));
        }
      }

      // Remove power-ups below screen
      if (powerUp.y - camera.y > canvas.height + 100) {
        powerUps.splice(i, 1);
      }
    }

    // Fall death
    if (player.y - camera.y > canvas.height) {
      createParticle(player.x, player.y, '#ef4444', 50, 6);
      setGameState('gameOver');
    }

    // Draw everything
    platforms.forEach(p => drawPlatform(ctx, p, camera.y));
    enemies.forEach(e => drawEnemy(ctx, e, camera.y));
    powerUps.forEach(p => drawPowerUp(ctx, p, camera.y));
    drawParticles(ctx, camera.y);
    drawPlayer(ctx, player, camera.y);

    gameRef.current.frame++;
    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, mission, achievements, maxCombo, theme]);

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
      gameRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (mission && mission.progress >= mission.target && gameState === 'playing') {
      setScore(s => s + mission.reward);
      showNotification(`✅ Görev Tamamlandı! +${mission.reward} puan`);
      generateMission();
    }
  }, [mission, gameState]);

  const startGame = () => {
    setScore(0);
    setHeight(0);
    setCombo(0);
    setPowerUp(null);
    initGame();
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setHeight(0);
    setCombo(0);
    setPowerUp(null);
    initGame();
    setGameState('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/games')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur flex items-center gap-2 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" /> Geri
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">🚀 Sky Jumper</h1>
          <button onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-blue-300">
            <div className="text-blue-100 text-xs mb-1 font-semibold">SKOR</div>
            <div className="text-3xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-green-300">
            <div className="text-green-100 text-xs mb-1 font-semibold">YÜKSEKLİK</div>
            <div className="text-3xl font-bold text-white">{height}m</div>
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
                +{mission.reward} 🏆
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
            ⚡ Power-Up: {
              powerUp.type === 'jetpack' ? '🚀 Jetpack' :
              powerUp.type === 'shield' ? '🛡️ Kalkan' :
              powerUp.type === 'magnet' ? '🧲 Mıknatıs' :
              powerUp.type === 'slowmo' ? '⏱️ Yavaşlatma' :
              '⭐ 2x Puan'
            }
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-2xl border-2 border-white/30">
          <canvas ref={canvasRef} width={800} height={600}
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
              <div className="text-7xl mb-4 animate-bounce">💫</div>
              <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Oyun Bitti!</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Skor</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-white/90 text-sm mb-1">Yükseklik</div>
                  <div className="text-3xl font-bold text-white">{height}m</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-purple-300 text-sm mb-1">Max Kombo</div>
                  <div className="text-3xl font-bold text-purple-300">{maxCombo}x</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                  <div className="text-yellow-300 text-sm mb-1">Başarılar</div>
                  <div className="text-3xl font-bold text-yellow-300">{achievements.length}/7</div>
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
                <span>Sağa-sola hareket</span>
              </div>
            </div>
            <div className="mt-4 text-sm bg-cyan-500/20 p-3 rounded-lg">
              💡 <strong>İpucu:</strong> Ekranın kenarından çıkarsan diğer taraftan girersin!
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border-2 border-white/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-300" /> Power-ups
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="bg-orange-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span>Jetpack - Yukarı uç (3sn)</span>
              </div>
              <div className="bg-blue-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Kalkan - Düşman koruması (8sn)</span>
              </div>
              <div className="bg-purple-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">🧲</span>
                <span>Mıknatıs - Power-up çek (6sn)</span>
              </div>
              <div className="bg-cyan-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span>Slow-mo - Yavaşlatma (5sn)</span>
              </div>
              <div className="bg-yellow-500/30 p-2 rounded flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Star - 2x Puan (7sn)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white border-2 border-indigo-300">
          <h3 className="text-xl font-bold mb-3">📊 Platform Tipleri</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🟢</div>
              <div className="text-sm font-bold">Normal</div>
              <div className="text-xs opacity-80">Standart</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🔵</div>
              <div className="text-sm font-bold">Hareketli</div>
              <div className="text-xs opacity-80">Sağa-sola</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🟤</div>
              <div className="text-sm font-bold">Kırılan</div>
              <div className="text-xs opacity-80">1 kullanım</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-3xl mb-1">🔴</div>
              <div className="text-sm font-bold">Yaylı</div>
              <div className="text-xs opacity-80">Süper zıplama</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyJumper;
