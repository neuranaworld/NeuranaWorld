/**
 * CityRunner - Arka Plan Render Sistemi
 * Gökyüzü, binalar, bulutlar ve yol çizimi
 */

import { BUILDING_CONFIG, CLOUD_CONFIG, GAME_CONFIG } from '../utils/Config.js';

export class BackgroundRenderer {
  constructor() {
    this.buildings = this.initBuildings();
    this.clouds = this.initClouds();
  }

  /**
   * Binaları başlatır
   * @returns {Array} - Bina objeleri
   */
  initBuildings() {
    const buildings = [];
    for (let i = 0; i < BUILDING_CONFIG.COUNT; i++) {
      buildings.push({
        x: i * BUILDING_CONFIG.SPACING,
        height: BUILDING_CONFIG.MIN_HEIGHT + Math.random() * BUILDING_CONFIG.MAX_HEIGHT_BONUS,
        width: BUILDING_CONFIG.MIN_WIDTH + Math.random() * BUILDING_CONFIG.MAX_WIDTH_BONUS,
        color: BUILDING_CONFIG.COLORS[Math.floor(Math.random() * BUILDING_CONFIG.COLORS.length)],
        windows: Math.floor(Math.random() * (BUILDING_CONFIG.MAX_WINDOWS - BUILDING_CONFIG.MIN_WINDOWS + 1)) + BUILDING_CONFIG.MIN_WINDOWS
      });
    }
    return buildings;
  }

  /**
   * Bulutları başlatır
   * @returns {Array} - Bulut objeleri
   */
  initClouds() {
    const clouds = [];
    for (let i = 0; i < CLOUD_CONFIG.COUNT; i++) {
      clouds.push({
        x: Math.random() * 800,
        y: CLOUD_CONFIG.MIN_Y + Math.random() * (CLOUD_CONFIG.MAX_Y - CLOUD_CONFIG.MIN_Y),
        size: CLOUD_CONFIG.MIN_SIZE + Math.random() * (CLOUD_CONFIG.MAX_SIZE - CLOUD_CONFIG.MIN_SIZE),
        speed: CLOUD_CONFIG.MIN_SPEED + Math.random() * (CLOUD_CONFIG.MAX_SPEED - CLOUD_CONFIG.MIN_SPEED)
      });
    }
    return clouds;
  }

  /**
   * Tam arka planı çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLCanvasElement} canvas - Canvas elementi
   * @param {number} frame - Animasyon frame
   * @param {number} speed - Oyun hızı
   * @param {number} boost - Hız boost katsayısı
   */
  draw(ctx, canvas, frame, speed, boost) {
    this.drawSky(ctx, canvas);
    this.drawSun(ctx, frame);
    this.drawClouds(ctx, canvas);
    this.drawBuildings(ctx, canvas, speed);
    this.drawRoad(ctx, canvas, frame, speed);
    this.drawSpeedLines(ctx, canvas, frame, boost);
  }

  /**
   * Gökyüzünü çizer (gradient)
   */
  drawSky(ctx, canvas) {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.6, '#B0E0E6');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Güneşi çizer
   */
  drawSun(ctx, frame) {
    ctx.save();
    ctx.translate(700, 90);

    // Sun rays
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI / 6) + frame * 0.01);
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
  }

  /**
   * Bulutları çizer ve günceller
   */
  drawClouds(ctx, canvas) {
    this.clouds.forEach(cloud => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 1.6, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fill();

      // Update position
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.size * 2 < 0) {
        cloud.x = canvas.width + cloud.size;
      }
    });
  }

  /**
   * Binaları çizer ve günceller
   */
  drawBuildings(ctx, canvas, speed) {
    this.buildings.forEach(building => {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(building.x + 5, canvas.height - building.height - 95, building.width, building.height);

      // Building body
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

      // Rooftop
      ctx.fillStyle = building.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
      ctx.fillRect(building.x + building.width / 4, canvas.height - building.height - 115, building.width / 2, 15);

      // Update position
      building.x -= speed * BUILDING_CONFIG.SPEED_MULTIPLIER;
      if (building.x + building.width < 0) {
        building.x = canvas.width;
        building.height = BUILDING_CONFIG.MIN_HEIGHT + Math.random() * BUILDING_CONFIG.MAX_HEIGHT_BONUS;
        building.color = BUILDING_CONFIG.COLORS[Math.floor(Math.random() * BUILDING_CONFIG.COLORS.length)];
      }
    });
  }

  /**
   * Yolu çizer
   */
  drawRoad(ctx, canvas, frame, speed) {
    // Road surface
    const roadGradient = ctx.createLinearGradient(0, GAME_CONFIG.GROUND_Y, 0, canvas.height);
    roadGradient.addColorStop(0, '#4b5563');
    roadGradient.addColorStop(1, '#374151');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, GAME_CONFIG.GROUND_Y, canvas.width, canvas.height - GAME_CONFIG.GROUND_Y);

    // Lane markings
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 5;
    ctx.setLineDash([30, 20]);
    ctx.lineCap = 'round';

    const dashOffset = (frame * speed) % 50;
    ctx.lineDashOffset = -dashOffset;

    [GAME_CONFIG.LANES[0] - 60, GAME_CONFIG.LANES[2] + 60].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, GAME_CONFIG.GROUND_Y + 30);
      ctx.lineTo(x, canvas.height - 20);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Sidewalk
    const sidewalkGrad = ctx.createLinearGradient(0, GAME_CONFIG.GROUND_Y, 0, GAME_CONFIG.GROUND_Y + 15);
    sidewalkGrad.addColorStop(0, '#9ca3af');
    sidewalkGrad.addColorStop(1, '#6b7280');
    ctx.fillStyle = sidewalkGrad;
    ctx.fillRect(0, GAME_CONFIG.GROUND_Y, canvas.width, 15);
  }

  /**
   * Hız boost sırasında hız çizgileri çizer
   */
  drawSpeedLines(ctx, canvas, frame, boost) {
    if (boost > 1) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const y = GAME_CONFIG.GROUND_Y - 50 - i * 40;
        const offset = (frame * boost * 2) % canvas.width;
        ctx.beginPath();
        ctx.moveTo(offset - canvas.width, y);
        ctx.lineTo(offset - canvas.width + 100, y);
        ctx.stroke();
      }
    }
  }

  /**
   * Arka planı sıfırlar (yeni oyun için)
   */
  reset() {
    this.buildings = this.initBuildings();
    this.clouds = this.initClouds();
  }
}
