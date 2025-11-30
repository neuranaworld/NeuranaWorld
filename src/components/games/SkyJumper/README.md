# 🚀 SkyJumper - Modüler Yapı

## 📁 Klasör Yapısı

```
SkyJumper/
├── index.jsx              # Ana oyun component'i (~450 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   ├── gameConfig.js     # Oyun ayarları (66 satır)
│   ├── missions.js       # 5 görev tanımı (14 satır)
│   └── themes.js         # 2 tema (sky/space) (20 satır)
│
├── classes/               # Sınıflar
│   └── Player.js         # Oyuncu sınıfı - fizik, hareket (94 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    ├── collision.js      # Çarpışma kontrolü (32 satır)
    ├── scoreCalculator.js # Skor hesaplama (16 satır)
    ├── spawner.js        # Platform/düşman/powerup spawn (96 satır)
    └── renderer.js       # Canvas render fonksiyonları (382 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 1,233 satır → 16-450 satır/dosya (8 dosya)
2. **Bakım Kolaylığı**: Rendering, physics, spawning ayrı dosyalarda
3. **Test Edilebilirlik**: Collision, scoring, spawning ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni platform tipi veya power-up eklemek kolay
5. **Tema Sistemi**: Sky ve Space temaları kolayca değiştirilebilir

## 🎮 Özellikler

- Dikey platforming oyunu
- 4 platform tipi (normal, moving, breaking, spring)
- 5 power-up tipi (jetpack, shield, magnet, slowmo, star)
- Düşman sistemi (flying, static)
- Kamera takibi (smooth scrolling)
- Kombo sistemi
- Görev sistemi (5 farklı görev)
- İki tema (sky/space)
- Particle effects
- Achievement sistemi

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: Canvas, player physics, platform, enemy, powerup, spawn, combo, camera settings
- `missions.js`: 5 mission types (height, platforms, combo, enemies, powerups)
- `themes.js`: Sky and space themes with gradients

**classes/** - Oyun sınıfları
- `Player.js`: Player class with jump(), moveLeft(), moveRight(), update(), physics

**utils/** - Yardımcı fonksiyonlar
- `collision.js`: Collision detection (rect, circle, platform-specific)
- `scoreCalculator.js`: Score, combo, height level calculations
- `spawner.js`: Platform, enemy, powerup, particle generation
- `renderer.js`: All drawing functions (background, player, platforms, enemies, powerups, particles)

**index.jsx** - Ana component
- Game state management
- Game loop (updateGame)
- Event handlers (keyboard)
- Camera system
- Power-up management
- UI rendering (HUD, mission panel, game over screen)

## 📝 Notlar

- Eski dosya: 1,233 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~154 satır/dosya ortalama (8 dosya)
- %87 daha modüler ve okunabilir! 🎉
- Platform logic, rendering, physics tamamen ayrıştırıldı
- Tema sistemi kolayca genişletilebilir
