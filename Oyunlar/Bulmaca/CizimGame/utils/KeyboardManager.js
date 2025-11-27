/**
 * Klavye Yöneticisi
 * Keyboard shortcut handling
 */

export class KeyboardManager {
  constructor() {
    this.handlers = new Map();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Event handler'ı ekle
  addHandler(key, callback) {
    this.handlers.set(key.toLowerCase(), callback);
  }

  // Event handler'ı kaldır
  removeHandler(key) {
    this.handlers.delete(key.toLowerCase());
  }

  // Tüm handler'ları temizle
  clearHandlers() {
    this.handlers.clear();
  }

  // Klavye eventi işle
  handleKeyDown(e) {
    const key = e.key.toLowerCase();

    // Ctrl kombinasyonları
    if (e.ctrlKey) {
      const ctrlKey = `ctrl+${key}`;
      const handler = this.handlers.get(ctrlKey);
      if (handler) {
        e.preventDefault();
        handler(e);
        return;
      }
    }

    // Tekil tuşlar
    const handler = this.handlers.get(key);
    if (handler) {
      handler(e);
    }
  }

  // Listener'ı başlat
  start() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  // Listener'ı durdur
  stop() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // Varsayılan kısayolları ayarla
  setupDefaultShortcuts(callbacks) {
    // Araç kısayolları
    this.addHandler('b', () => callbacks.setTool?.('brush'));
    this.addHandler('e', () => callbacks.setTool?.('eraser'));
    this.addHandler('i', () => callbacks.setTool?.('eyedropper'));
    this.addHandler('h', () => callbacks.setTool?.('pan'));
    this.addHandler('t', () => callbacks.setTool?.('text'));
    this.addHandler('l', () => callbacks.setTool?.('line'));
    this.addHandler('c', () => callbacks.setTool?.('circle'));
    this.addHandler('r', () => callbacks.setTool?.('rectangle'));

    // Boyut ayarları
    this.addHandler('[', () => callbacks.adjustBrushSize?.(-2));
    this.addHandler(']', () => callbacks.adjustBrushSize?.(2));

    // Zoom
    this.addHandler('+', () => callbacks.adjustZoom?.(0.25));
    this.addHandler('-', () => callbacks.adjustZoom?.(-0.25));

    // Izgara
    this.addHandler('g', () => callbacks.toggleGrid?.());

    // Temizle
    this.addHandler('delete', () => callbacks.clearCanvas?.());

    // Ctrl kombinasyonları
    this.addHandler('ctrl+z', () => callbacks.undo?.());
    this.addHandler('ctrl+y', () => callbacks.redo?.());
    this.addHandler('ctrl+s', () => callbacks.save?.());
  }
}
