/**
 * CityRunner - Engel Sistemi
 * Engel oluşturma ve çizimi
 */

import { OBSTACLE_TYPES, CAR_COLORS, GAME_CONFIG } from '../utils/Config.js';

export class ObstacleFactory {
  /**
   * Rastgele engel oluşturur
   * @returns {Object} - Engel objesi
   */
  static create() {
    const types = Object.values(OBSTACLE_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);

    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      lane: lane,
      type: type.name,
      width: type.width,
      height: type.height,
      passed: false,
      color: type.name === 'car' ?
        CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)] : null
    };
  }
}

export class ObstacleRenderer {
  /**
   * Engeli canvas'a çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} obstacle - Engel objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @param {number} groundY - Zemin Y pozisyonu
   * @param {number} frame - Animasyon frame sayısı
   */
  static draw(ctx, obstacle, lanes, groundY, frame) {
    const laneX = lanes[obstacle.lane];
    const y = groundY - obstacle.height;

    ctx.save();
    ctx.translate(laneX, y);

    switch (obstacle.type) {
      case 'car':
        this._drawCar(ctx, obstacle, frame);
        break;
      case 'barrier':
        this._drawBarrier(ctx, obstacle);
        break;
      case 'cone':
        this._drawCone(ctx, obstacle);
        break;
      case 'trash':
        this._drawTrash(ctx, obstacle);
        break;
    }

    ctx.restore();
  }

  static _drawCar(ctx, obstacle, frame) {
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
        ctx.rotate((frame * 0.2) + (i * Math.PI / 2));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 6);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  static _drawBarrier(ctx, obstacle) {
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
  }

  static _drawCone(ctx, obstacle) {
    // Traffic cone
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
  }

  static _drawTrash(ctx, obstacle) {
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
}
