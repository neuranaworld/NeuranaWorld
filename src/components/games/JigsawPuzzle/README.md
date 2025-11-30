# 🧩 JigsawPuzzle - Modüler Yapı

## 📁 Klasör Yapısı

```
JigsawPuzzle/
├── index.jsx              # Ana oyun component'i (~240 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Puzzle sizes, images (18 satır)
│
└── utils/                 # Yardımcı fonksiyonlar
    └── puzzleLogic.js    # Piece creation, shuffle, swap, completion check (60 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 414 satır → 18-240 satır/dosya (3 dosya)
2. **Bakım Kolaylığı**: Puzzle logic ayrı
3. **Test Edilebilirlik**: Shuffle, swap, completion check ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni puzzle size veya image category eklemek kolay

## 🎮 Özellikler

**4 Zorluk Seviyesi:**
- 🌱 Kolay (3×3 = 9 parça)
- 🌿 Orta (4×4 = 16 parça)
- 🌳 Zor (5×5 = 25 parça)
- 👑 Uzman (6×6 = 36 parça)

**5 Resim Kategorisi:**
- 🌲 Doğa
- 🏙️ Şehir
- 🐾 Hayvan
- 🏛️ Mimari
- 🎨 Soyut

**Özellikler:**
- Drag & drop veya click-to-swap
- Karıştırma algoritması
- Tamamlanma kontrolü
- Skor sistemi (moves, time, size multiplier)
- Preview image
- Timer
- Move counter

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: PUZZLE_SIZES (4 levels), PUZZLE_IMAGES (5 categories), PIECE_SIZE

**utils/** - Puzzle mantığı
- `puzzleLogic.js`: createPuzzlePieces(), shufflePieces(), swapPieces(), checkPuzzleComplete(), calculateScore()

**index.jsx** - Ana component
- Puzzle state management
- Drag & drop handlers
- Piece swap logic
- Completion detection
- Timer & move tracking
- UI rendering (grid, pieces, preview)

## 📝 Notlar

- Eski dosya: 414 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~139 satır/dosya ortalama (3 dosya)
- %66 daha modüler! 🎉
- 4 zorluk × 5 resim = 20 farklı puzzle
- Drag & drop + click-to-swap support
- Score calculation with size multiplier
