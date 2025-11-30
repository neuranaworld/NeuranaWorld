// Rendering utilities for SkyJumper

import { THEMES, PLATFORM_COLORS, POWERUP_COLORS, POWERUP_ICONS } from '../constants/themes';

export const drawBackground = (ctx, canvas, cameraY, theme, frame) => {
  const heightFactor = Math.min(1, Math.abs(cameraY) / 10000);
  const themeConfig = THEMES[theme.toUpperCase()];

  // Sky/Space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, themeConfig.gradient.start(heightFactor));
  gradient.addColorStop(0.5, themeConfig.gradient.middle(heightFactor));
  gradient.addColorStop(1, themeConfig.gradient.end(heightFactor));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorations (stars or clouds)
  if (themeConfig.decoration === 'stars') {
    drawStars(ctx, canvas, cameraY);
  } else {
    drawClouds(ctx, canvas, cameraY, frame);
  }

  // Grid lines for depth
  drawGrid(ctx, canvas, cameraY);
};

const drawStars = (ctx, canvas, cameraY) => {
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 100; i++) {
    const x = (i * 123) % canvas.width;
    const y = ((i * 456 + cameraY * 0.1) % canvas.height);
    const size = (i % 3) + 1;
    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
};

const drawClouds = (ctx, canvas, cameraY, frame) => {
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
};

const drawGrid = (ctx, canvas, cameraY) => {
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

export const drawPlayer = (ctx, player, cameraY, jetpack, shield, starMultiplier) => {
  const screenY = player.y - cameraY;

  ctx.save();
  ctx.translate(player.x, screenY);

  if (player.rotation) {
    ctx.rotate(player.rotation);
  }

  // Trail effect
  if (jetpack || starMultiplier > 1) {
    drawTrail(ctx, player, cameraY, jetpack, screenY);
  }

  // Shield effect
  if (shield) {
    drawShield(ctx, player);
  }

  // Jetpack flames
  if (jetpack) {
    drawJetpackFlames(ctx, player);
  }

  // Character body
  drawCharacter(ctx, player);

  ctx.restore();
};

const drawTrail = (ctx, player, cameraY, jetpack, screenY) => {
  player.trail.push({ x: player.x, y: player.y, alpha: 1 });
  if (player.trail.length > 8) player.trail.shift();

  player.trail.forEach((t, i) => {
    t.alpha -= 0.12;
    const trailScreenY = t.y - cameraY;
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = jetpack ? '#f59e0b' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, trailScreenY - screenY, player.width / 2 - i * 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
};

const drawShield = (ctx, player) => {
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
};

const drawJetpackFlames = (ctx, player) => {
  const flameHeight = 20 + Math.sin(player.animFrame * 0.3) * 5;
  const flameGradient = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + flameHeight);
  flameGradient.addColorStop(0, '#f59e0b');
  flameGradient.addColorStop(0.5, '#ef4444');
  flameGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

  ctx.fillStyle = flameGradient;

  // Left flame
  ctx.beginPath();
  ctx.moveTo(-15, player.height / 2);
  ctx.lineTo(-10, player.height / 2 + flameHeight);
  ctx.lineTo(-5, player.height / 2);
  ctx.closePath();
  ctx.fill();

  // Right flame
  ctx.beginPath();
  ctx.moveTo(5, player.height / 2);
  ctx.lineTo(10, player.height / 2 + flameHeight);
  ctx.lineTo(15, player.height / 2);
  ctx.closePath();
  ctx.fill();
};

const drawCharacter = (ctx, player) => {
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

  // Arms
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
};

export const drawPlatform = (ctx, platform, cameraY) => {
  const screenY = platform.y - cameraY;

  ctx.save();
  ctx.translate(platform.x, screenY);

  // Shadow
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000';
  ctx.fillRect(-platform.width / 2 + 3, platform.height, platform.width - 6, 6);
  ctx.globalAlpha = 1;

  const colors = getPlatformColors(platform);
  const gradient = ctx.createLinearGradient(0, 0, 0, platform.height);
  gradient.addColorStop(0, colors.top);
  gradient.addColorStop(1, colors.base);
  ctx.fillStyle = gradient;

  if (platform.type === 'spring') {
    drawSpringPlatform(ctx, platform);
  } else {
    drawNormalPlatform(ctx, platform, colors);
  }

  ctx.restore();
};

const getPlatformColors = (platform) => {
  const type = platform.type.toUpperCase();
  if (type === 'BREAKING' && platform.broken) {
    return PLATFORM_COLORS.BREAKING.broken;
  }
  return PLATFORM_COLORS[type];
};

const drawSpringPlatform = (ctx, platform) => {
  const compression = platform.compressed || 0;
  ctx.fillRect(-platform.width / 2, -5 + compression, platform.width, platform.height + 5 - compression);

  // Spring coil
  ctx.strokeStyle = PLATFORM_COLORS.SPRING.accent;
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-platform.width / 2 + 10, i * 5 - 5 + compression);
    ctx.lineTo(platform.width / 2 - 10, i * 5 - 5 + compression);
    ctx.stroke();
  }
};

const drawNormalPlatform = (ctx, platform, colors) => {
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
};

export const drawEnemy = (ctx, enemy, cameraY) => {
  const screenY = enemy.y - cameraY;

  ctx.save();
  ctx.translate(enemy.x, screenY);

  enemy.animFrame = (enemy.animFrame || 0) + 1;

  if (enemy.type === 'flying') {
    drawFlyingEnemy(ctx, enemy);
  } else {
    drawStaticEnemy(ctx, enemy);
  }

  ctx.restore();
};

const drawFlyingEnemy = (ctx, enemy) => {
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
};

const drawStaticEnemy = (ctx, enemy) => {
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
};

export const drawPowerUp = (ctx, powerUp, cameraY, frame) => {
  const screenY = powerUp.y - cameraY;

  ctx.save();
  ctx.translate(powerUp.x, screenY);

  powerUp.pulse = Math.sin(frame * 0.15) * 0.2 + 1;
  powerUp.rotation = (powerUp.rotation || 0) + 0.05;

  ctx.scale(powerUp.pulse, powerUp.pulse);
  ctx.rotate(powerUp.rotation);

  const colors = POWERUP_COLORS[powerUp.type];

  // Glow
  const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width * 1.5);
  glowGrad.addColorStop(0, colors.glow + '66');
  glowGrad.addColorStop(1, colors.glow + '00');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(-powerUp.width, -powerUp.height, powerUp.width * 2, powerUp.height * 2);

  // Box
  ctx.fillStyle = colors.main;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.roundRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height, 8);
  ctx.fill();

  // Icon
  ctx.shadowBlur = 0;
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(POWERUP_ICONS[powerUp.type], 0, 0);

  ctx.restore();
};

export const drawParticles = (ctx, particles, cameraY) => {
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
};
