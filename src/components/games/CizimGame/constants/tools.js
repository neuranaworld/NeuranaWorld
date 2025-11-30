// Çizim Araçları ve Ayarları
export const TOOLS = {
  BRUSH: 'brush',
  ERASER: 'eraser',
  LINE: 'line',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TEXT: 'text',
  FILL: 'fill',
  EYEDROPPER: 'eyedropper',
  PAN: 'pan',
};

export const BRUSH_PRESETS = [
  { name: '✏️ Kalem', size: 2, opacity: 1, blur: 0 },
  { name: '🖊️ İnce', size: 4, opacity: 0.9, blur: 0 },
  { name: '🖌️ Fırça', size: 8, opacity: 0.8, blur: 1 },
  { name: '🎨 Boya', size: 15, opacity: 0.7, blur: 2 },
  { name: '✨ Yumuşak', size: 25, opacity: 0.4, blur: 8 },
  { name: '💨 Sprey', size: 35, opacity: 0.2, blur: 15 },
  { name: '📏 Marker', size: 10, opacity: 1, blur: 0 },
  { name: '🌟 Işık', size: 30, opacity: 0.3, blur: 25 }
];

export const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#808080', '#C0C0C0',
  '#FF0000', '#DC143C', '#8B0000', '#FF6B6B', '#FFB6C1', '#FFC0CB',
  '#FF8C00', '#FFA500', '#FF7F50', '#FF6347', '#FFD700',
  '#FFFF00', '#FFD700', '#FFFF99', '#FFFACD', '#F0E68C',
  '#00FF00', '#00FF7F', '#90EE90', '#98FB98', '#3CB371', '#2E8B57',
  '#00FFFF', '#00CED1', '#40E0D0', '#48D1CC', '#20B2AA',
  '#0000FF', '#4169E1', '#1E90FF', '#87CEEB', '#ADD8E6',
  '#800080', '#9370DB', '#8A2BE2', '#9932CC', '#DA70D6',
  '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB',
  '#8B4513', '#A0522D', '#CD853F', '#DEB887'
];

export const SHORTCUTS = [
  { key: 'B', desc: 'Fırça' },
  { key: 'E', desc: 'Silgi' },
  { key: 'I', desc: 'Renk Seçici' },
  { key: 'H', desc: 'Taşı' },
  { key: 'L', desc: 'Çizgi' },
  { key: 'C', desc: 'Daire' },
  { key: 'R', desc: 'Dikdörtgen' },
  { key: 'T', desc: 'Metin' },
  { key: '[', desc: 'Boyut -' },
  { key: ']', desc: 'Boyut +' },
  { key: 'Ctrl+Z', desc: 'Geri Al' },
  { key: 'Ctrl+Y', desc: 'İleri Al' },
  { key: 'Ctrl+S', desc: 'Kaydet' },
  { key: '+/-', desc: 'Zoom' },
  { key: 'G', desc: 'Izgara' },
  { key: 'Delete', desc: 'Temizle' }
];

export const DEFAULT_CANVAS_SIZE = { width: 1200, height: 800 };
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_ZOOM = 1;
