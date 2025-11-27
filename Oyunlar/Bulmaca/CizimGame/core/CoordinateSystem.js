/**
 * Koordinat Sistemi
 * Canvas koordinat dönüşümleri (zoom, pan, grid snap)
 */

export class CoordinateSystem {
  constructor(canvasRef) {
    this.canvasRef = canvasRef;
    this.zoom = 1;
    this.offset = { x: 0, y: 0 };
    this.gridSize = 50;
    this.snapToGrid = false;
  }

  // Mouse pozisyonunu canvas koordinatlarına çevir
  getCanvasCoordinates(e) {
    const canvas = this.canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left - this.offset.x) / this.zoom;
    let y = (e.clientY - rect.top - this.offset.y) / this.zoom;

    // Izgaraya yapıştır
    if (this.snapToGrid) {
      x = Math.round(x / this.gridSize) * this.gridSize;
      y = Math.round(y / this.gridSize) * this.gridSize;
    }

    return { x, y };
  }

  // Zoom ayarla
  setZoom(newZoom) {
    this.zoom = Math.max(0.1, Math.min(10, newZoom));
    return this.zoom;
  }

  // Zoom artır/azalt
  adjustZoom(delta) {
    return this.setZoom(this.zoom + delta);
  }

  // Zoom sıfırla
  resetZoom() {
    this.zoom = 1;
    this.offset = { x: 0, y: 0 };
    return { zoom: this.zoom, offset: this.offset };
  }

  // Pan offset ayarla
  setOffset(x, y) {
    this.offset = { x, y };
    return this.offset;
  }

  // Grid ayarları
  setGridSize(size) {
    this.gridSize = Math.max(10, Math.min(200, size));
    return this.gridSize;
  }

  setSnapToGrid(enabled) {
    this.snapToGrid = enabled;
    return this.snapToGrid;
  }

  // Durum bilgisi
  getState() {
    return {
      zoom: this.zoom,
      offset: this.offset,
      gridSize: this.gridSize,
      snapToGrid: this.snapToGrid
    };
  }

  // Durumu yükle
  loadState(state) {
    this.zoom = state.zoom || 1;
    this.offset = state.offset || { x: 0, y: 0 };
    this.gridSize = state.gridSize || 50;
    this.snapToGrid = state.snapToGrid || false;
  }
}
