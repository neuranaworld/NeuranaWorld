/**
 * Export Sistemi
 * Canvas'ı farklı formatlarda dışa aktarma
 */

export class ExportSystem {
  constructor(canvasRef) {
    this.canvasRef = canvasRef;
  }

  // PNG olarak indir
  exportPNG(filename = null) {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename || `cizim-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // JPG olarak indir
  exportJPG(filename = null) {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename || `cizim-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  }

  // WebP olarak indir
  exportWebP(filename = null) {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename || `cizim-${Date.now()}.webp`;
    link.href = canvas.toDataURL('image/webp', 0.95);
    link.click();
  }

  // Belirli formatta indir
  export(format = 'png', filename = null) {
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return this.exportJPG(filename);
      case 'webp':
        return this.exportWebP(filename);
      default:
        return this.exportPNG(filename);
    }
  }

  // Canvas'ı base64 olarak al
  toDataURL(format = 'png') {
    const canvas = this.canvasRef.current;
    if (!canvas) return null;

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return canvas.toDataURL('image/jpeg', 0.95);
      case 'webp':
        return canvas.toDataURL('image/webp', 0.95);
      default:
        return canvas.toDataURL('image/png');
    }
  }
}
