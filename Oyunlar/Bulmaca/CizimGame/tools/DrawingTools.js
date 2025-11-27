/**
 * Çizim Araçları
 * Brush, Eraser, Line, Shape vb. tüm çizim işlevleri
 */

export class DrawingTools {
  constructor(canvasRef) {
    this.canvasRef = canvasRef;
  }

  getContext() {
    return this.canvasRef.current?.getContext('2d');
  }

  // Fırça çizimi
  drawBrush(coords, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.lineWidth = settings.brushSize;
    ctx.lineCap = settings.brushStyle || 'round';
    ctx.lineJoin = settings.brushStyle || 'round';
    ctx.globalAlpha = settings.opacity;
    ctx.globalCompositeOperation = settings.blendMode || 'source-over';
    ctx.shadowBlur = settings.shadowBlur || 0;
    ctx.shadowColor = settings.color;
    ctx.strokeStyle = settings.color;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  // Silgi
  drawEraser(coords, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.lineWidth = settings.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = settings.opacity;
    ctx.strokeStyle = settings.backgroundColor || '#FFFFFF';

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  // Sprey boya
  drawSpray(coords, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    const brushSize = settings.brushSize;
    for (let i = 0; i < 30; i++) {
      const offsetX = (Math.random() - 0.5) * brushSize;
      const offsetY = (Math.random() - 0.5) * brushSize;
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

      if (distance < brushSize / 2) {
        ctx.fillStyle = settings.color;
        ctx.globalAlpha = settings.opacity * (1 - distance / (brushSize / 2)) * 0.5;
        ctx.fillRect(coords.x + offsetX, coords.y + offsetY, 1, 1);
      }
    }
  }

  // Simetrik çizim
  drawSymmetry(coords, centerX, centerY, symmetryLines, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    for (let i = 0; i < symmetryLines; i++) {
      const angle = (Math.PI * 2 * i) / symmetryLines;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.translate(-centerX, -centerY);

      const dx = coords.x - centerX;
      const dy = coords.y - centerY;
      ctx.lineTo(centerX + dx, centerY + dy);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Gradyan çizim
  drawGradient(coords, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(
      coords.x - settings.brushSize,
      coords.y - settings.brushSize,
      coords.x + settings.brushSize,
      coords.y + settings.brushSize
    );
    gradient.addColorStop(0, settings.color);
    gradient.addColorStop(1, settings.gradientColor2 || '#FF0000');

    ctx.strokeStyle = gradient;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  // Yeni çizim başlat
  beginPath(coords) {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }

  // Çizimi sonlandır ve temizle
  endPath() {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
  }
}
