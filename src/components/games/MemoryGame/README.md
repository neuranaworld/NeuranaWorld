# 🧠 MemoryGame - Modüler Yapı

## 📁 Klasör Yapısı

```
MemoryGame/
├── index.jsx              # Ana oyun component'i (~280 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── themes.js         # 5 tema, 4 zorluk seviyesi (27 satır)
│
├── utils/                 # Yardımcı fonksiyonlar
│   ├── gameLogic.js      # Oyun mantığı, skor hesaplama (56 satır)
│   └── particles.js      # Particle effects (27 satır)
│
└── components/            # Alt component'ler
    └── Card.jsx          # Kart component (45 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 489 satır → 27-280 satır/dosya (5 dosya)
2. **Bakım Kolaylığı**: Game logic, themes, particles ayrı
3. **Test Edilebilirlik**: Shuffle, score calculation, achievements ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni tema veya zorluk seviyesi eklemek kolay
5. **Component-based**: Card component reusable

## 🎮 Özellikler

**5 Tema:**
- 😊 Emojiler
- 🐾 Hayvanlar
- 🍕 Yemekler
- 🚀 Uzay
- ⚽ Spor

**4 Zorluk Seviyesi:**
- 🌱 Kolay (6 çift)
- 🌿 Orta (10 çift)
- 🌳 Zor (15 çift)
- 👑 Uzman (18 çift)

**Özellikler:**
- 🏆 Skor sistemi (moves, time, combo)
- 🔥 Kombo sistemi
- 💡 İpucu sistemi (3 ipucu)
- ✨ Particle effects
- 🎯 Achievement sistemi
- 📊 En iyi skor kaydı
- ⏱️ Zamanlayıcı
- 🎨 3D kart animasyonları

**Achievements:**
- 🏆 Mükemmel (hatasız bitir)
- ⚡ Hızlı (30 saniyede bitir)
- 🔥 Kombo Kralı (5x kombo)
- 👑 Uzman (expert seviyesini bitir)

## 📦 Dosya Detayları

**constants/** - Tema ve zorluk
- `themes.js`: THEMES (5 theme with 20 cards each), DIFFICULTY_LEVELS (4 levels)

**utils/** - Oyun mantığı
- `gameLogic.js`: shuffleArray(), createCardDeck(), calculateScore(), checkAchievement(), formatTime()
- `particles.js`: createParticles(), updateParticles() - match animation

**components/** - UI Components
- `Card.jsx`: 3D flip animation, front/back sides, matched state

**index.jsx** - Ana component
- Game state management
- Card flip logic
- Match detection
- Timer & score tracking
- Achievement unlocking
- UI rendering (menu, game board, stats)

## 📝 Notlar

- Eski dosya: 489 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~97 satır/dosya ortalama (5 dosya)
- %80 daha modüler! 🎉
- 5 tema × 4 zorluk = 20 farklı oyun modu
- localStorage ile best score tracking
- 3D CSS animations
- Particle effects on match
