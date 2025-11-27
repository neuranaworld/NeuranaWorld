/**
 * CityRunner - Oyuncu Çizimi ve Renderi
 * Oyuncunun görsel temsilini oluşturur
 */

export class PlayerRenderer {
  /**
   * Oyuncuyu canvas'a çizer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} player - Oyuncu objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @param {Object} powerUps - Aktif power-up'lar
   * @param {Array} trail - Trail efekti için koordinatlar
   * @param {number} groundY - Zemin Y pozisyonu
   * @param {string} character - Karakter tipi
   */
  static draw(ctx, player, lanes, powerUps, trail, groundY, character = 'runner') {
    const x = lanes[player.lane];
    const y = player.y - player.height;

    ctx.save();
    ctx.translate(x, y + player.height / 2);

    if (player.rotation) {
      ctx.rotate(player.rotation);
    }

    // Trail effect
    if (powerUps.boost > 1 || powerUps.invincible) {
      trail.forEach((t) => {
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = powerUps.invincible ? '#a855f7' : '#f59e0b';
        ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      });
      ctx.globalAlpha = 1;
    }

    // Shadow
    this._drawShadow(ctx, player, groundY);

    // Shield glow
    if (powerUps.shield) {
      this._drawShield(ctx, player);
    }

    // Invincible effect
    if (powerUps.invincible) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 20;
    }

    // Body
    this._drawBody(ctx, player, character);

    // Head
    this._drawHead(ctx, player, character);

    // Eyes and smile
    this._drawFace(ctx, player);

    // Arms and legs (running animation)
    this._drawLimbs(ctx, player, character);

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  static _drawShadow(ctx, player, groundY) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, player.height / 2 + (groundY - player.y),
                player.width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  static _drawShield(ctx, player) {
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

  static _drawBody(ctx, player, character) {
    const bodyGradient = ctx.createLinearGradient(-20, -player.height / 2, 20, player.height / 2);
    bodyGradient.addColorStop(0, character === 'runner' ? '#f59e0b' : '#3b82f6');
    bodyGradient.addColorStop(1, character === 'runner' ? '#d97706' : '#1d4ed8');

    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  }

  static _drawHead(ctx, player, character) {
    ctx.fillStyle = character === 'runner' ? '#fbbf24' : '#60a5fa';
    ctx.beginPath();
    ctx.arc(0, -player.height / 2 - 8, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  static _drawFace(ctx, player) {
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
  }

  static _drawLimbs(ctx, player, character) {
    const armSwing = Math.sin(player.animFrame * 0.4) * 15;
    const legSwing = Math.sin(player.animFrame * 0.4) * 20;

    ctx.strokeStyle = character === 'runner' ? '#d97706' : '#1d4ed8';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    // Arms
    ctx.beginPath();
    ctx.moveTo(-player.width / 2, -player.height / 2 + 20);
    ctx.lineTo(-player.width / 2 - 12, -player.height / 2 + 20 + armSwing);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(player.width / 2, -player.height / 2 + 20);
    ctx.lineTo(player.width / 2 + 12, -player.height / 2 + 20 - armSwing);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(-12, player.height / 2);
    ctx.lineTo(-12 + legSwing, player.height / 2 + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, player.height / 2);
    ctx.lineTo(12 - legSwing, player.height / 2 + 20);
    ctx.stroke();
  }

  /**
   * Trail güncellemesi için yeni pozisyon ekler
   * @param {Array} trail - Trail dizisi
   * @param {number} x - X koordinatı
   * @param {number} y - Y koordinatı
   * @param {number} maxLength - Maksimum trail uzunluğu
   */
  static updateTrail(trail, x, y, maxLength = 10) {
    trail.push({ x, y, alpha: 1 });
    if (trail.length > maxLength) trail.shift();

    trail.forEach(t => {
      t.alpha -= 0.1;
    });
  }
}
