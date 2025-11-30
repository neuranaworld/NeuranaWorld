/**
 * CityRunner - Toplanabilir Öğeler
 * Coin ve Power-up oluşturma ve çizimi
 */

import { COIN_CONFIG, POWERUP_CONFIG, GAME_CONFIG } from '../utils/Config.js';

export class CoinFactory {
  /**
   * Coin veya coin dizisi oluşturur
   * @returns {Array} - Coin objesi dizisi
   */
  static create() {
    const lane = Math.floor(Math.random() * 3);
    const pattern = Math.random();

    if (pattern > COIN_CONFIG.TRAIL_PROBABILITY) {
      // Coin trail (5'li)
      const coins = [];
      for (let i = 0; i < COIN_CONFIG.TRAIL_COUNT; i++) {
        coins.push({
          x: GAME_CONFIG.CANVAS_WIDTH + i * COIN_CONFIG.TRAIL_SPACING,
          lane: lane,
          y: GAME_CONFIG.GROUND_Y - 100 - Math.sin(i * 0.5) * 30,
          collected: false,
          radius: COIN_CONFIG.RADIUS,
          glow: 0
        });
      }
      return coins;
    }

    // Tek coin
    return [{
      x: GAME_CONFIG.CANVAS_WIDTH,
      lane: lane,
      y: GAME_CONFIG.GROUND_Y - COIN_CONFIG.BASE_Y_OFFSET - Math.random() * COIN_CONFIG.MAX_Y_VARIANCE,
      collected: false,
      radius: COIN_CONFIG.RADIUS,
      glow: 0
    }];
  }
}

export class CoinRenderer {
  /**
   * Coin çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} coin - Coin objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @param {number} frame - Animasyon frame
   */
  static draw(ctx, coin, lanes, frame) {
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

    // Dollar sign
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);

    ctx.restore();
  }
}

export class PowerUpFactory {
  /**
   * Rastgele power-up oluşturur
   * @returns {Object} - Power-up objesi
   */
  static create() {
    const types = Object.keys(POWERUP_CONFIG.COLORS);
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);

    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      lane: lane,
      y: GAME_CONFIG.GROUND_Y - 110,
      type: type,
      collected: false,
      width: POWERUP_CONFIG.WIDTH,
      height: POWERUP_CONFIG.HEIGHT,
      pulse: 0
    };
  }
}

export class PowerUpRenderer {
  /**
   * Power-up çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} powerUp - Power-up objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @param {number} frame - Animasyon frame
   */
  static draw(ctx, powerUp, lanes, frame) {
    const x = lanes[powerUp.lane];

    ctx.save();
    ctx.translate(x, powerUp.y);

    // Pulse animation
    powerUp.pulse = Math.sin(frame * 0.2) * 0.2 + 1;
    ctx.scale(powerUp.pulse, powerUp.pulse);

    const colors = POWERUP_CONFIG.COLORS[powerUp.type];
    const icon = POWERUP_CONFIG.ICONS[powerUp.type];

    // Glow
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.width);
    glowGrad.addColorStop(0, colors.glow + '88');
    glowGrad.addColorStop(1, colors.glow + '00');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-powerUp.width, -powerUp.height, powerUp.width * 2, powerUp.height * 2);

    // Box
    ctx.fillStyle = colors.main;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height, 6);
    ctx.fill();

    // Icon
    ctx.shadowBlur = 0;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 0, 0);

    ctx.restore();
  }
}
