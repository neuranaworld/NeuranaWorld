/**
 * Şekil Çizim Araçları
 * Circle, Rectangle, Line, Star gibi şekiller
 */

export class ShapeTools {
  constructor(canvasRef) {
    this.canvasRef = canvasRef;
    this.tempImageData = null;
  }

  getContext() {
    return this.canvasRef.current?.getContext('2d');
  }

  getCanvas() {
    return this.canvasRef.current;
  }

  // Şekil çizimine başlamadan önce mevcut durumu kaydet
  startShape() {
    const ctx = this.getContext();
    const canvas = this.getCanvas();
    if (!ctx || !canvas) return;

    this.tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Şekil çizimini iptal et ve önceki duruma dön
  restoreBeforeShape() {
    const ctx = this.getContext();
    if (!ctx || !this.tempImageData) return;

    ctx.putImageData(this.tempImageData, 0, 0);
  }

  // Çizgi çiz
  drawLine(startPos, endPos, settings) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.restoreBeforeShape();

    ctx.lineWidth = settings.brushSize;
    ctx.strokeStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
    ctx.shadowBlur = settings.shadowBlur || 0;
    ctx.shadowColor = settings.color;

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  // Daire çiz
  drawCircle(startPos, endPos, settings, fillMode = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.restoreBeforeShape();

    const radius = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) +
      Math.pow(endPos.y - startPos.y, 2)
    );

    ctx.lineWidth = settings.brushSize;
    ctx.strokeStyle = settings.color;
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
    ctx.shadowBlur = settings.shadowBlur || 0;
    ctx.shadowColor = settings.color;

    ctx.beginPath();
    ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);

    if (fillMode) ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  // Dikdörtgen çiz
  drawRectangle(startPos, endPos, settings, fillMode = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.restoreBeforeShape();

    const width = endPos.x - startPos.x;
    const height = endPos.y - startPos.y;

    ctx.lineWidth = settings.brushSize;
    ctx.strokeStyle = settings.color;
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
    ctx.shadowBlur = settings.shadowBlur || 0;
    ctx.shadowColor = settings.color;

    ctx.beginPath();
    ctx.rect(startPos.x, startPos.y, width, height);

    if (fillMode) ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  // Yıldız çiz
  drawStar(startPos, endPos, settings, fillMode = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.restoreBeforeShape();

    const radius = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) +
      Math.pow(endPos.y - startPos.y, 2)
    );

    const spikes = 5;
    const step = Math.PI / spikes;

    ctx.lineWidth = settings.brushSize;
    ctx.strokeStyle = settings.color;
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
    ctx.shadowBlur = settings.shadowBlur || 0;
    ctx.shadowColor = settings.color;

    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const angle = i * step - Math.PI / 2;
      const x = startPos.x + r * Math.cos(angle);
      const y = startPos.y + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    if (fillMode) ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  // Temizle
  clearTemp() {
    this.tempImageData = null;
  }
}
