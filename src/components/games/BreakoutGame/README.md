# 🧱 BreakoutGame - Modüler Yapı

## 📁 Klasör Yapısı

```
BreakoutGame/
├── index.jsx              # Ana oyun component'i (~280 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Game config, brick colors, powerup types (66 satır)
│
├── classes/               # Sınıflar
│   ├── Ball.js           # Top sınıfı - fizik, hareket (48 satır)
│   └── Paddle.js         # Raket sınıfı (39 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    ├── collision.js      # Ball collision detection (27 satır)
    └── spawner.js        # Brick & powerup spawning (62 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 523 satır → 27-280 satır/dosya (6 dosya)
2. **Bakım Kolaylığı**: Ball, Paddle, collision logic ayrı
3. **Test Edilebilirlik**: Physics ve collision ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni power-up veya brick tipi eklemek kolay
5. **Class-based**: Ball ve Paddle sınıfları

## 🎮 Özellikler

- **Klasik Breakout**: Top, raket, tuğlalar
- **Seviye Sistemi**: Her seviyede daha fazla tuğla
- **Power-ups**:
  - ⬌ Expand (genişletilmiş raket)
  - ●● Multi Ball (çoklu top)
  - 🐌 Slow (yavaş top)
  - 🔥 Fire (ateş topu)
- **Can Sistemi**: 3 can ile başlangıç
- **Skor Takibi**: En yüksek skor kaydı
- **Particle Effects**: Tuğla kırılma efektleri
- **Multi-hit Bricks**: Seviye arttıkça dayanıklı tuğlalar

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: Canvas, ball, paddle, brick configs; brick colors; powerup types/colors/icons

**classes/** - Oyun sınıfları
- `Ball.js`: Ball class - update(), bounceX(), bounceY(), setSpeed(), reset(), getBounds()
- `Paddle.js`: Paddle class - moveLeft(), moveRight(), expand(), resetWidth(), getBounds()

**utils/** - Yardımcı fonksiyonlar
- `collision.js`: checkBallPaddleCollision(), checkBallBrickCollision(), checkBallWallCollision()
- `spawner.js`: createBricks(level), createPowerUp(x, y), createParticles()

**index.jsx** - Ana component
- Game state management
- Game loop (updateGame)
- Event handlers (keyboard/mouse)
- Canvas rendering (ball, paddle, bricks, powerups, particles)
- Power-up logic
- Level progression

## 📝 Notlar

- Eski dosya: 523 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~87 satır/dosya ortalama (6 dosya)
- %83 daha modüler! 🎉
- Class-based game entities (Ball, Paddle)
- Collision detection tamamen ayrıştırıldı
- Power-up sistemi kolayca genişletilebilir
