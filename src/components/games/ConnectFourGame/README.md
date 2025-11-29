# 🔴🟡 ConnectFourGame - Modüler Yapı

## 📁 Klasör Yapısı

```
ConnectFourGame/
├── index.jsx              # Ana oyun component'i (~240 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Grid config, players, modes, difficulty (24 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    ├── gameLogic.js      # Win detection, drop logic (87 satır)
    └── aiPlayer.js       # AI opponent (56 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 441 satır → 24-240 satır/dosya (4 dosya)
2. **Bakım Kolaylığı**: Game logic, AI ayrı
3. **Test Edilebilirlik**: Win detection, AI strategy ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni AI strategy veya grid size eklemek kolay
5. **Clean Logic**: Win detection all directions

## 🎮 Özellikler

**Oyun Modları:**
- 👤 vs 👤 PvP (Player vs Player)
- 👤 vs 🤖 AI (Player vs AI)

**3 Zorluk Seviyesi:**
- 🌱 Kolay (random moves)
- 🌿 Orta (win/block detection)
- 🌳 Zor (strategic center play)

**Özellikler:**
- 6×7 grid
- 4'ü birleştir kazanır
- Win detection (4 yön: horizontal, vertical, 2 diagonal)
- AI opponent (3 zorluk)
- Skor takibi (Red, Yellow, Draws)
- Hover preview
- Kazanan animasyonu

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: GAME_CONFIG (6×7 grid), PLAYERS (red/yellow), GAME_MODES, DIFFICULTY_LEVELS, colors

**utils/** - Oyun mantığı
- `gameLogic.js`: createEmptyBoard(), checkWinner() (4 direction), dropPiece(), canDropPiece()
- `aiPlayer.js`: makeAIMove(board, difficulty) - easy/medium/hard strategies

**index.jsx** - Ana component
- Game state management
- Column click handler
- AI move triggering
- Win detection
- Score tracking
- UI rendering (board, cells, game over screen)

## 📝 Notlar

- Eski dosya: 441 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~110 satır/dosya ortalama (4 dosya)
- %75 daha modüler! 🎉
- 3-level AI opponent
- Complete win detection (all 4 directions)
- localStorage score persistence
