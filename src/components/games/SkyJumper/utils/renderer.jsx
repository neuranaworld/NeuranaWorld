// Canvas Render Fonksiyonları
import { THEMES } from '../constants/themes';
import { GAME_CONFIG } from '../constants/gameConfig';

export function drawBackground(ctx, canvas, cameraY, theme, frame) {
  const heightFactor = Math.min(1, Math.abs(cameraY) / 10000);
  const currentTheme = THEMES[theme];

  // Sky/Space gradient
  const gradientColors = currentTheme.gradient(heightFactor);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(0.5, gradientColors[1]);
  gradient.addColorStop(1, gradientColors[2]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars or clouds
  if (currentTheme.hasStars) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 123) % canvas.width;
      const y = ((i * 456 + cameraY * 0.1) % canvas.height);
      const size = (i % 3) + 1;
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
  } else if (currentTheme.hasClouds) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 8; i++) {
      const x = ((i * 180 + frame * 0.2) % (canvas.width + 100)) - 50;
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
}

export function drawPlayer(ctx, player, cameraY, gameRef) {
  const screenY = player.y - cameraY;

  ctx.save();
  ctx.translate(player.x, screenY);

  if (player.rotation) {
    ctx.rotate(player.rotation);
  }

  // Trail effect
  if (gameRef.jetpack || gameRef.starMultiplier > 1) {
    player.trail.push({ x: player.x, y: player.y, alpha: 1 });
    if (player.trail.length > 8) player.trail.shift();

    player.trail.forEach((t, i) => {
      t.alpha -= 0.12;
      const trailScreenY = t.y - cameraY;
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = gameRef.jetpack ? '#f59e0b' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, trailScreenY - screenY, player.width / 2 - i * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // Shield effect
  if (gameRef.shield) {
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
  if (gameRef.jetpack) {
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

  // Body
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

  // Jetpack antenna
  if (gameRef.jetpack) {
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

  ctx.restore();
}

export function drawPlatform(ctx, platform, cameraY) {
  const screenY = platform.y - cameraY;

  ctx.save();
  ctx.translate(platform.x, screenY);

  if (platform.type === 'spring') {
    // Spring platform - trampoline style
    const springCompress = platform.compressed || 0;

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-platform.width / 2, -platform.height + springCompress, platform.width, platform.height - springCompress);

    // Spring coils
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-platform.width / 2 + 10 + i * 20, -platform.height + springCompress);
      ctx.lineTo(-platform.width / 2 + 10 + i * 20, 0);
      ctx.stroke();
    }
  } else if (platform.type === 'breaking') {
    // Breaking platform - cracked appearance
    const alpha = platform.broken ? 0.5 : 1;
    ctx.globalAlpha = alpha;

    const gradient = ctx.createLinearGradient(-platform.width / 2, -platform.height, platform.width / 2, 0);
    gradient.addColorStop(0, '#78716c');
    gradient.addColorStop(1, '#57534e');
    ctx.fillStyle = gradient;
    ctx.fillRect(-platform.width / 2, -platform.height, platform.width, platform.height);

    if (platform.broken) {
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-platform.width / 2 + 20, -platform.height / 2);
      ctx.lineTo(platform.width / 2 - 20, -platform.height / 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  } else if (platform.type === 'moving') {
    // Moving platform - glowing edges
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(-platform.width / 2, -platform.height, platform.width, platform.height);

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.strokeRect(-platform.width / 2, -platform.height, platform.width, platform.height);
  } else {
    // Normal platform
    const gradient = ctx.createLinearGradient(-platform.width / 2, -platform.height, platform.width / 2, 0);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#059669');
    ctx.fillStyle = gradient;
    ctx.fillRect(-platform.width / 2, -platform.height, platform.width, platform.height);
  }

  ctx.restore();
}

export function drawEnemy(ctx, enemy, cameraY) {
  const screenY = enemy.y - cameraY;

  ctx.save();
  ctx.translate(enemy.x, screenY);

  // Angry cloud/enemy
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(-10, 0, 15, 0, Math.PI * 2);
  ctx.arc(0, -8, 18, 0, Math.PI * 2);
  ctx.arc(10, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-8, -8, 5, 0, Math.PI * 2);
  ctx.arc(8, -8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000';
  const eyeShift = Math.sin(enemy.animFrame * 0.1) * 2;
  ctx.beginPath();
  ctx.arc(-8 + eyeShift, -7, 3, 0, Math.PI * 2);
  ctx.arc(8 + eyeShift, -7, 3, 0, Math.PI * 2);
  ctx.fill();

  // Angry mouth
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -2, 8, 0.8, Math.PI - 0.8, true);
  ctx.stroke();

  ctx.restore();
}

export function drawPowerUp(ctx, powerUp, cameraY) {
  const screenY = powerUp.y - cameraY;

  ctx.save();
  ctx.translate(powerUp.x, screenY);

  powerUp.pulse = Math.sin(powerUp.rotation) * 0.2 + 1;
  powerUp.rotation += 0.1;
  ctx.scale(powerUp.pulse, powerUp.pulse);
  ctx.rotate(powerUp.rotation * 0.5);

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
  const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width);
  glowGrad.addColorStop(0, colors[powerUp.type].glow + 'aa');
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
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icons[powerUp.type], 0, 0);

  ctx.restore();
}

export function drawParticles(ctx, particles, cameraY) {
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
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
}
