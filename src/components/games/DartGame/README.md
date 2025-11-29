# 🎯 DartGame - Modüler Yapı

## 📁 Klasör Yapısı

```
DartGame/
├── index.jsx              # Ana oyun component'i (~220 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Board, zones, sectors, game modes (26 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    └── scoreCalculator.js # Score calculation, zone detection (56 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 396 satır → 26-220 satır/dosya (3 dosya)
2. **Bakım Kolaylığı**: Score calculation ayrı
3. **Test Edilebilirlik**: Zone detection, scoring ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni game mode veya scoring zone eklemek kolay

## 🎮 Özellikler

**Dart Tahtası:**
- 🎯 Bullseye (50 puan)
- 🟡 İç Boğa (25 puan)
- 🟢 Triple Ring (3x çarpan)
- 🔵 Double Ring (2x çarpan)
- 20 Sektör (1-20 arası değerler)

**3 Oyun Modu:**
- 🎮 Klasik (3 dart × 10 round)
- 🏆 Meydan Okuma (5 dart × 5 round)
- 🎯 Pratik (10 dart × 1 round)

**Özellikler:**
- Click to throw
- Realistic dart physics
- Zone detection (bullseye, rings, sectors)
- Score calculation (sector value × multiplier)
- Total score tracking
- Best score saving
- Visual feedback (hit zones)

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: BOARD (radius, center), DART config, ZONES (bullseye, rings), SECTORS (20 values), GAME_MODES (3 modes)

**utils/** - Skor hesaplama
- `scoreCalculator.js`: calculateDartScore(x, y) - zone detection & scoring, calculateTotalScore(darts)

**index.jsx** - Ana component
- Game state management
- Click handler (dart throw)
- Canvas rendering (board, zones, sectors, darts)
- Score tracking
- UI (HUD, game modes, results)

## 📝 Notlar

- Eski dosya: 396 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~132 satır/dosya ortalama (3 dosya)
- %67 daha modüler! 🎉
- Realistic dart board (20 sectors, 4 zones)
- 3 game modes
- Physics-based throwing
