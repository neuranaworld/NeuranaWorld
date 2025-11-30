/**
 * CityRunner - Parçacık Sistemi
 * Görsel efektler için parçacık oluşturma ve güncelleme
 */

import { PARTICLE_CONFIG } from '../utils/Config.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  /**
   * Yeni parçacıklar oluşturur
   * @param {number} x - X koordinatı
   * @param {number} y - Y koordinatı
   * @param {string} color - Parçacık rengi
   * @param {number} count - Parçacık sayısı
   */
  create(x, y, color, count = PARTICLE_CONFIG.DEFAULT_COUNT) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: PARTICLE_CONFIG.MIN_LIFE + Math.random() * PARTICLE_CONFIG.MAX_LIFE_BONUS,
        maxLife: 50,
        color,
        size: PARTICLE_CONFIG.MIN_SIZE + Math.random() * PARTICLE_CONFIG.MAX_SIZE_BONUS,
        gravity: PARTICLE_CONFIG.GRAVITY
      });
    }
  }

  /**
   * Tüm parçacıkları günceller ve çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  update(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Fizik güncellemesi
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;

      // Ölü parçacıkları temizle
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Çizim
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Tüm parçacıkları temizler
   */
  clear() {
    this.particles = [];
  }

  /**
   * Aktif parçacık sayısını döndürür
   * @returns {number} - Parçacık sayısı
   */
  getCount() {
    return this.particles.length;
  }
}
