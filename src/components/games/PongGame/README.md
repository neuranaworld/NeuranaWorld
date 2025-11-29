# 🏓 PongGame - Modüler Yapı

## 📁 Klasör Yapısı

```
PongGame/
├── index.jsx              # Ana oyun component'i (~200 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Canvas, paddle, ball, AI difficulty (30 satır)
│
├── classes/               # Sınıflar
│   ├── Ball.js           # Top sınıfı - fizik, bounce (54 satır)
│   └── Paddle.js         # Raket sınıfı (38 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    └── collision.js      # Paddle collision, scoring (20 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 344 satır → 20-200 satır/dosya (5 dosya)
2. **Bakım Kolaylığı**: Ball physics, paddle logic ayrı
3. **Test Edilebilirlik**: Collision, AI movement ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni AI difficulty veya power-up eklemek kolay
5. **Class-based**: Ball ve Paddle sınıfları

## 🎮 Özellikler

**Oyun Modları:**
- 👤 vs 👤 PvP (Player vs Player)
- 👤 vs 🤖 AI (Player vs AI)

**3 AI Zorluk Seviyesi:**
- 🌱 Kolay (50% reaction)
- 🌿 Orta (70% reaction)
- 🌳 Zor (90% reaction)

**Özellikler:**
- Klasik Pong mekaniği
- Ball speed increase (her vuruşta hızlanır)
- 11 puana kadar oyun
- AI opponent (3 zorluk)
- Keyboard controls (W/S, Arrow Up/Down)
- Bounce physics
- Score tracking

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: CANVAS size, PADDLE (size, speed), BALL (size, speed, increment), GAME (winning score, AI difficulty), GAME_MODES

**classes/** - Oyun sınıfları
- `Ball.js`: Ball class - reset(), update(), reverseX(), increaseSpeed(), getBounds(); bounce physics
- `Paddle.js`: Paddle class - moveUp(), moveDown(), moveTo(targetY), getBounds()

**utils/** - Yardımcı fonksiyonlar
- `collision.js`: checkPaddleCollision(ball, paddle), checkScore(ball, canvasWidth)

**index.jsx** - Ana component
- Game loop
- Keyboard controls (W/S, Arrow keys)
- AI movement (track ball)
- Collision detection
- Score tracking
- Canvas rendering (paddles, ball, net, scores)

## 📝 Notlar

- Eski dosya: 344 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~69 satır/dosya ortalama (5 dosya)
- %80 daha modüler! 🎉
- Class-based entities (Ball, Paddle)
- 3-level AI opponent
- Progressive ball speed
- Classic pong gameplay
