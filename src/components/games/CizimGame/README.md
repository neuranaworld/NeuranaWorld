# 🎨 CizimGame - Modüler Yapı

## 📁 Klasör Yapısı

```
CizimGame/
├── index.jsx              # Ana çizim uygulaması (~600 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── tools.js          # Tools, brush presets, color palette, shortcuts (73 satır)
│
├── utils/                 # Yardımcı fonksiyonlar
│   ├── canvasOperations.js # Canvas işlemleri, çizim fonksiyonları (156 satır)
│   └── historyManager.js  # Undo/Redo yönetimi (50 satır)
│
└── hooks/                 # Custom hooks
    └── useDrawing.js      # Drawing logic hook (~120 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 1,151 satır → 50-600 satır/dosya (5 dosya)
2. **Bakım Kolaylığı**: Canvas operations, history, tools ayrı
3. **Test Edilebilirlik**: Drawing logic, history manager ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni tool veya filter eklemek kolay
5. **Profesyonel Çizim Uygulaması**: Photoshop/Paint-like features

## 🎮 Özellikler

**Çizim Araçları:**
- 🖌️ Fırça (8 preset: kalem, fırça, sprey, marker, vs.)
- 🧹 Silgi
- 📏 Çizgi
- ⭕ Daire
- ⬜ Dikdörtgen
- 📝 Metin
- 🪣 Dolgu (flood fill)
- 💧 Renk seçici (eyedropper)

**Gelişmiş Özellikler:**
- ↩️ Undo/Redo (50 adım history)
- 🔍 Zoom & Pan
- 📐 Grid & Rulers
- 🎭 Blend modes
- 🌈 Gradient mode
- 🔄 Symmetry mode (4-8-16 lines)
- 🗺️ Minimap
- 💾 Auto-save
- ⚙️ Filters (brightness, contrast, saturation)
- 🎨 48 renk paleti + recent colors

**Keyboard Shortcuts:**
- B: Fırça, E: Silgi, I: Renk seçici
- L: Çizgi, C: Daire, R: Dikdörtgen, T: Metin
- [/]: Brush size
- Ctrl+Z/Y: Undo/Redo
- +/-: Zoom
- G: Grid toggle

## 📦 Dosya Detayları

**constants/** - Çizim sabitleri
- `tools.js`: TOOLS enum, BRUSH_PRESETS (8 preset), COLOR_PALETTE (48 color), SHORTCUTS (16 shortcut)

**utils/** - Canvas utilities
- `canvasOperations.js`: clearCanvas(), saveCanvasState(), loadCanvasState(), downloadCanvas(), drawLine(), drawCircle(), drawRectangle(), floodFill(), applyFilters()
- `historyManager.js`: HistoryManager class - addState(), undo(), redo(), canUndo(), canRedo()

**hooks/** - Custom React hooks
- `useDrawing.js`: Drawing state management, event handlers, tool switching

**index.jsx** - Ana component
- State management (tool, color, size, zoom, etc.)
- Event handlers (mouse, keyboard)
- Canvas rendering
- UI (toolbar, color picker, settings panel)
- Integration of all modules

## 📝 Notlar

- Eski dosya: 1,151 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~200 satır/dosya ortalama (5 dosya)
- %83 daha modüler! 🎉
- Profesyonel çizim uygulaması özellikleri
- History management tamamen ayrıştırıldı
- Canvas operations reusable
- Keyboard shortcuts ve blend modes
