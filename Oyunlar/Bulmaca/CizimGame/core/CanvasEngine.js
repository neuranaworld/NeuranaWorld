/**
 * Canvas Motoru
 * Canvas temel işlemleri ve transformasyonlar
 */

export class CanvasEngine {
  constructor(canvasRef, backgroundColor = '#FFFFFF') {
    this.canvasRef = canvasRef;
    this.backgroundColor = backgroundColor;
  }

  getContext() {
    return this.canvasRef.current?.getContext('2d');
  }

  getCanvas() {
    return this.canvasRef.current;
  }

  // Canvas'ı temizle
  clear() {
    const ctx = this.getContext();
    const canvas = this.getCanvas();
    if (!ctx || !canvas) return;

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Canvas boyutunu değiştir
  resize(width, height, preserveContent = true) {
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    if (!canvas || !ctx) return;

    let tempData = null;
    if (preserveContent) {
      tempData = canvas.toDataURL();
    }

    canvas.width = width;
    canvas.height = height;

    // Arka planı ayarla
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Önceki içeriği geri yükle
    if (tempData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = tempData;
    }
  }

  // Canvas'ı döndür
  rotate(angle) {
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    if (!canvas || !ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
  }

  // Canvas'ı çevir (flip)
  flip(horizontal = true) {
    const canvas = this.getCanvas();
    const ctx = this.getContext();
    if (!canvas || !ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    if (horizontal) {
      ctx.scale(-1, 1);
      ctx.drawImage(tempCanvas, -canvas.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.drawImage(tempCanvas, 0, -canvas.height);
    }

    ctx.restore();
  }

  // Filtre uygula
  applyFilters(brightness = 100, contrast = 100, saturation = 100) {
    const ctx = this.getContext();
    const canvas = this.getCanvas();
    if (!ctx || !canvas) return;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.putImageData(imageData, 0, 0);
  }

  // Renk seç (eyedropper)
  pickColor(x, y) {
    const ctx = this.getContext();
    if (!ctx) return null;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = '#' + [pixel[0], pixel[1], pixel[2]]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');

    return hexColor;
  }

  // Metin ekle
  addText(text, x, y, fontSize, color) {
    const ctx = this.getContext();
    if (!ctx) return;

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // Arka plan rengini değiştir
  setBackgroundColor(color) {
    this.backgroundColor = color;
  }
}
