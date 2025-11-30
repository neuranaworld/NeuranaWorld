# 🏃 City Runner - Modüler Yapı

## 📁 Klasör Yapısı

```
CityRunner/
├── index.jsx              # Ana oyun component'i (485 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   ├── gameConfig.js     # Oyun ayarları (39 satır)
│   ├── missions.js       # Görev tanımları (28 satır)
│   └── characters.js     # 4 oynanabilir karakter (38 satır)
│
├── classes/               # Sınıflar
│   └── Player.js         # Oyuncu sınıfı (103 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    ├── collision.js      # Çarpışma kontrolü (25 satır)
    ├── scoreCalculator.js # Skor hesaplama (26 satır)
    ├── spawner.js        # Engel/coin/powerup spawn (109 satır)
    └── renderer.js       # Canvas render fonksiyonları (476 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 1,349 satır → 25-485 satır/dosya (8 dosya)
2. **Bakım Kolaylığı**: Her özellik ayrı dosyada
3. **Test Edilebilirlik**: Player, collision, score, spawner ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni karakter/power-up eklemek kolay
5. **Modülerlik**: Render, game logic, physics ayrı

## 🎮 Özellikler

- 3 şerit sistem
- 4 oynanabilir karakter (runner, athlete, ninja, robot)
- Power-up sistemi (Shield, Magnet, 2x Coins, Boost, Invincible)
- Kombo sistemi (120 frame window)
- Görev sistemi (5 farklı görev tipi)
- Achievement sistemi
- Canvas-based rendering
- Particle effects

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: Lanes, speeds, player physics, combo settings
- `missions.js`: 5 mission types (coins, distance, combo, jump, powerups)
- `characters.js`: Character definitions with different stats

**classes/** - Oyun sınıfları
- `Player.js`: Player class with jump(), duck(), moveLeft(), moveRight(), update()

**utils/** - Yardımcı fonksiyonlar
- `collision.js`: Collision detection (rect, circle, offscreen)
- `scoreCalculator.js`: Score, combo, level calculations
- `spawner.js`: Obstacle, coin, powerup, particle spawning + background init
- `renderer.js`: All drawing functions (player, obstacles, coins, powerups, particles, background)

**index.jsx** - Ana component
- Game state management
- Game loop (updateGame)
- Event handlers (keyboard)
- UI rendering (HUD, mission panel, game over screen)

## 📝 Notlar

- Eski dosya: 1,349 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~150 satır/dosya ortalama (8 dosya)
- %64 daha okunabilir ve modüler! 🎉
- Tüm game logic ve rendering ayrıştırıldı
