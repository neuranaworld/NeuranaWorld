// Rendering utilities for Breakout

import { COLORS } from '../constants/gameConfig';

export const drawBackground = (ctx, canvas) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawBall = (ctx, ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.BALL;
  ctx.fill();
  ctx.strokeStyle = COLORS.BALL_GLOW;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
};

export const drawPaddle = (ctx, paddle) => {
  const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
  gradient.addColorStop(0, COLORS.PADDLE.start);
  gradient.addColorStop(0.5, COLORS.PADDLE.mid);
  gradient.addColorStop(1, COLORS.PADDLE.end);

  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

export const drawBricks = (ctx, bricks) => {
  bricks.forEach(brick => {
    if (!brick.visible) return;

    const opacity = brick.hits / brick.maxHits;
    ctx.fillStyle = brick.color;
    ctx.globalAlpha = 0.3 + opacity * 0.7;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

    if (brick.hasPowerUp) {
      ctx.fillStyle = COLORS.POWERUP;
      ctx.font = 'bold 14px Arial';
      ctx.fillText('⚡', brick.x + brick.width / 2 - 7, brick.y + brick.height / 2 + 5);
    }
  });
};

export const drawPowerUps = (ctx, powerUps) => {
  powerUps.forEach(pu => {
    ctx.fillStyle = pu.color;
    ctx.beginPath();
    ctx.arc(pu.x, pu.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(pu.icon, pu.x - 6, pu.y + 4);
  });
};

export const drawParticles = (ctx, particles) => {
  particles.forEach(p => {
    if (p.life <= 0) return;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 30;
    ctx.fillRect(p.x, p.y, 3, 3);
    ctx.globalAlpha = 1;
  });
};
