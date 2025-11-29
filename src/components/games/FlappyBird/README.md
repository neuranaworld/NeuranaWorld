# 🐦 FlappyBird - Modüler Yapı

## 📁 Klasör Yapısı

```
FlappyBird/
├── index.jsx              # Ana oyun component'i (~220 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Canvas, bird, pipe configs (27 satır)
│
├── classes/               # Sınıflar
│   └── Bird.js           # Kuş sınıfı - fizik, hareket (50 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    └── pipeManager.js    # Boru oluşturma, collision (46 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 368 satır → 27-220 satır/dosya (4 dosya)
2. **Bakım Kolaylığı**: Bird physics, pipe management ayrı
3. **Test Edilebilirlik**: Jump, collision, pipe spawning ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni bird color veya pipe style eklemek kolay
5. **Class-based**: Bird sınıfı

## 🎮 Özellikler

**Gameplay:**
- Klasik Flappy Bird mekaniği
- Tek tuş kontrolü (Space / Click)
- Otomatik boru spawn
- Skor sistemi (her boru +10 puan)
- En yüksek skor kaydı

**Physics:**
- Gerçekçi gravity
- Jump strength
- Bird rotation (velocity-based)
- Collision detection

**Visual:**
- 4 kuş rengi (yellow, blue, red, green)
- Smooth animations
- Canvas-based rendering

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: CANVAS size, BIRD (gravity, jump), PIPE (gap, speed, spawn interval), BIRD_COLORS

**classes/** - Oyun sınıfları
- `Bird.js`: Bird class - jump(), update(), getBounds(), reset(); physics simulation

**utils/** - Yardımcı fonksiyonlar
- `pipeManager.js`: createPipe(), updatePipes(), checkPipeCollision(), checkPipePassed()

**index.jsx** - Ana component
- Game loop
- Event handlers (click, space)
- Canvas rendering (bird, pipes, background)
- Score tracking
- UI (start screen, game over screen)

## 📝 Notlar

- Eski dosya: 368 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~92 satır/dosya ortalama (4 dosya)
- %75 daha modüler! 🎉
- Class-based bird with realistic physics
- Automatic pipe generation
- Single-tap gameplay
