// Canvas Render Fonksiyonları
export function drawPlayer(ctx, player, lanes, character, gameRef) {
  const x = lanes[player.lane];
  const y = player.y - player.height;

  ctx.save();
  ctx.translate(x, y + player.height / 2);

  if (player.rotation) {
    ctx.rotate(player.rotation);
  }

  // Trail effect
  if (gameRef.boost > 1 || gameRef.invincible) {
    gameRef.trail.push({ x, y: y + player.height / 2, alpha: 1 });
    if (gameRef.trail.length > 10) gameRef.trail.shift();

    gameRef.trail.forEach((t) => {
      t.alpha -= 0.1;
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = gameRef.invincible ? '#a855f7' : '#f59e0b';
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    });
    ctx.globalAlpha = 1;
  }

  // Shadow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, player.height / 2 + (gameRef.groundY - player.y),
              player.width / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Shield glow
  if (gameRef.shield) {
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
  if (gameRef.invincible) {
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
}

export function drawObstacle(ctx, obstacle, lanes, gameRef) {
  const laneX = lanes[obstacle.lane];
  const y = gameRef.groundY - obstacle.height;

  ctx.save();
  ctx.translate(laneX, y);

  if (obstacle.type === 'car') {
    // Modern car design
    const carGradient = ctx.createLinearGradient(-obstacle.width / 2, 0, obstacle.width / 2, obstacle.height);
    carGradient.addColorStop(0, obstacle.color);
    carGradient.addColorStop(1, obstacle.color.replace(')', ', 0.7)').replace('rgb', 'rgba'));

    ctx.fillStyle = carGradient;
    ctx.beginPath();
    ctx.roundRect(-obstacle.width / 2, 12, obstacle.width, obstacle.height - 20, 8);
    ctx.fill();

    // Car top
    ctx.fillStyle = obstacle.color.replace(')', ', 0.5)').replace('rgb', 'rgba').replace('#', '');
    ctx.beginPath();
    ctx.roundRect(-25, 0, 50, 18, 6);
    ctx.fill();

    // Windows
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

    // Wheels
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
        ctx.rotate((gameRef.frame * 0.2) + (i * Math.PI / 2));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 6);
        ctx.stroke();
        ctx.restore();
      }
    });

  } else if (obstacle.type === 'barrier') {
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, obstacle.height);

    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(-obstacle.width / 2 + 6, i * 15, obstacle.width - 12, 10);
    }

    ctx.fillStyle = 'rgba(254, 240, 138, 0.8)';
    ctx.fillRect(-obstacle.width / 2, 8, obstacle.width, 3);
    ctx.fillRect(-obstacle.width / 2, 38, obstacle.width, 3);

  } else if (obstacle.type === 'cone') {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-obstacle.width / 2, obstacle.height - 10);
    ctx.lineTo(obstacle.width / 2, obstacle.height - 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.fillRect(-obstacle.width / 2 + 8, 18, obstacle.width - 16, 6);
    ctx.fillRect(-obstacle.width / 2 + 6, 35, obstacle.width - 12, 6);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-obstacle.width / 2 - 5, obstacle.height - 10, obstacle.width + 10, 10);

  } else {
    // Trash can
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, obstacle.height);

    ctx.fillStyle = '#4b5563';
    ctx.fillRect(-obstacle.width / 2, 0, obstacle.width, 8);

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 4, 8, Math.PI, 0);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawCoin(ctx, coin, lanes, frame) {
  const x = lanes[coin.lane];

  ctx.save();
  ctx.translate(x, coin.y);

  // Glow effect
  coin.glow = (Math.sin(frame * 0.15) + 1) * 0.5;
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.radius + 10);
  glowGradient.addColorStop(0, `rgba(251, 191, 36, ${coin.glow * 0.6})`);
  glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius + 10, 0, Math.PI * 2);
  ctx.fill();

  // Rotation
  ctx.rotate(frame * 0.12);

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
}

export function drawPowerUp(ctx, powerUp, lanes, frame) {
  const x = lanes[powerUp.lane];

  ctx.save();
  ctx.translate(x, powerUp.y);

  // Pulse animation
  powerUp.pulse = Math.sin(frame * 0.2) * 0.2 + 1;
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
}

export function drawParticles(ctx, particles) {
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
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
}

export function drawBackground(ctx, canvas, gameRef) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(0.6, '#B0E0E6');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sun
  ctx.save();
  ctx.translate(700, 90);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI / 6) + gameRef.frame * 0.01);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -60);
    ctx.stroke();
    ctx.restore();
  }

  const sunGradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 45);
  sunGradient.addColorStop(0, '#fef08a');
  sunGradient.addColorStop(1, '#fbbf24');
  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Clouds
  gameRef.clouds.forEach(cloud => {
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

  // Buildings
  gameRef.buildings.forEach(building => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(building.x + 5, canvas.height - building.height - 95, building.width, building.height);

    const buildingGrad = ctx.createLinearGradient(building.x, 0, building.x + building.width, 0);
    buildingGrad.addColorStop(0, building.color);
    buildingGrad.addColorStop(1, building.color.replace(')', ', 0.8)').replace('rgb', 'rgba'));
    ctx.fillStyle = buildingGrad;
    ctx.fillRect(building.x, canvas.height - building.height - 100, building.width, building.height);

    // Windows
    const windowRows = Math.floor(building.height / 35);
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < building.windows; col++) {
        const windowX = building.x + 12 + col * 25;
        const windowY = canvas.height - building.height - 85 + row * 35;

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

    ctx.fillStyle = building.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
    ctx.fillRect(building.x + building.width / 4, canvas.height - building.height - 115, building.width / 2, 15);

    building.x -= gameRef.speed * 0.4;
    if (building.x + building.width < 0) {
      building.x = canvas.width;
      building.height = 120 + Math.random() * 180;
      building.color = ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'][Math.floor(Math.random() * 4)];
    }
  });

  // Road
  const roadGradient = ctx.createLinearGradient(0, gameRef.groundY, 0, canvas.height);
  roadGradient.addColorStop(0, '#4b5563');
  roadGradient.addColorStop(1, '#374151');
  ctx.fillStyle = roadGradient;
  ctx.fillRect(0, gameRef.groundY, canvas.width, canvas.height - gameRef.groundY);

  // Road markings
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 5;
  ctx.setLineDash([30, 20]);
  ctx.lineCap = 'round';

  const dashOffset = (gameRef.frame * gameRef.speed) % 50;
  ctx.lineDashOffset = -dashOffset;

  [gameRef.lanes[0] - 60, gameRef.lanes[2] + 60].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, gameRef.groundY + 30);
    ctx.lineTo(x, canvas.height - 20);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Sidewalk
  const sidewalkGrad = ctx.createLinearGradient(0, gameRef.groundY, 0, gameRef.groundY + 15);
  sidewalkGrad.addColorStop(0, '#9ca3af');
  sidewalkGrad.addColorStop(1, '#6b7280');
  ctx.fillStyle = sidewalkGrad;
  ctx.fillRect(0, gameRef.groundY, canvas.width, 15);

  // Speed lines
  if (gameRef.boost > 1) {
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const y = gameRef.groundY - 50 - i * 40;
      const offset = (gameRef.frame * gameRef.boost * 2) % canvas.width;
      ctx.beginPath();
      ctx.moveTo(offset - canvas.width, y);
      ctx.lineTo(offset - canvas.width + 100, y);
      ctx.stroke();
    }
  }
}
