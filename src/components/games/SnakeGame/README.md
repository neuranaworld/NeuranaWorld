# 🐍 SnakeGame - Modüler Yapı

## 📁 Klasör Yapısı

```
SnakeGame/
├── index.jsx              # Ana oyun component'i (~250 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Grid, speed, food types (20 satır)
│
├── classes/               # Sınıflar
│   └── Snake.js          # Yılan sınıfı - hareket, büyüme (60 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    └── foodSpawner.js    # Yem oluşturma, collision (33 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 463 satır → 20-250 satır/dosya (4 dosya)
2. **Bakım Kolaylığı**: Snake logic, food spawning ayrı
3. **Test Edilebilirlik**: Snake movement, collision ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni food tipi veya game mode eklemek kolay
5. **Class-based**: Snake sınıfı

## 🎮 Özellikler

**3 Yem Tipi:**
- 🍎 Normal (10 puan)
- ⭐ Altın (50 puan, %10 şans)
- ⚡ Hız (20 puan, %5 şans)

**Özellikler:**
- Klasik snake mekaniği
- Wrap-around (duvarlardan geçme)
- Hız artışı (yem yedikçe hızlanır)
- Skor sistemi
- En yüksek skor kaydı
- Keyboard kontrolleri (Arrow keys / WASD)
- Self-collision detection

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: GRID_SIZE, CELL_SIZE, DIRECTIONS, FOOD_TYPES (3 type)

**classes/** - Oyun sınıfları
- `Snake.js`: Snake class - move(), grow(), changeDirection(), checkSelfCollision(), getHead()

**utils/** - Yardımcı fonksiyonlar
- `foodSpawner.js`: spawnFood(snake), checkFoodCollision(snake, food)

**index.jsx** - Ana component
- Game loop
- Keyboard controls
- Canvas rendering
- Score tracking
- UI (HUD, game over screen)

## 📝 Notlar

- Eski dosya: 463 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~116 satır/dosya ortalama (4 dosya)
- %75 daha modüler! 🎉
- Class-based snake
- 3 food types
- Wrap-around gameplay
