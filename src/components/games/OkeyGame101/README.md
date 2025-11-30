# 🎲 OkeyGame101 - Modüler Yapı

## 📁 Klasör Yapısı

```
OkeyGame101/
├── index.jsx              # Ana oyun component'i (~350 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Game config, colors, API endpoints (48 satır)
│
├── utils/                 # Yardımcı fonksiyonlar
│   ├── api.js            # Backend API calls (26 satır)
│   ├── audio.js          # Ses sistemi (52 satır)
│   └── userManager.js    # Kullanıcı ID yönetimi (16 satır)
│
└── components/            # Alt component'ler
    ├── Tile.jsx          # Okey taşı component (93 satır)
    ├── Rack.jsx          # Istaka component (59 satır)
    └── Player.jsx        # Oyuncu gösterimi (44 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 741 satır → 16-350 satır/dosya (8 dosya)
2. **Bakım Kolaylığı**: API, UI, sound ayrı dosyalarda
3. **Test Edilebilirlik**: API calls, audio, components ayrı test edilebilir
4. **Genişletilebilirlik**: Yeni API endpoint veya component eklemek kolay
5. **Backend Integration**: Axios-based API modülü

## 🎮 Özellikler

- **Backend Multiplayer**: FastAPI backend ile bağlantılı
- **3 Istaka Sistemi**: 15 taş/istaka kapasitesi
- **AI Oyuncular**: 3 AI oyuncu (sol, üst, sağ)
- **Drag & Drop**: Taşları istakaya sürükleyebilme
- **Ses Sistemi**: Draw, discard, select sesleri
- **Okey Kuralları**:
  - 21 taş başlangıç
  - Okey ve gösterge taşı
  - Yan atma kuralı (el açma zorunluluğu)
  - Istaka sistemi

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: Rack config, tile settings, number colors, API endpoints

**utils/** - Yardımcı fonksiyonlar
- `api.js`: startGame(), drawTile(), discardTile(), openHand(), addToRack()
- `audio.js`: AudioEngine class with playDraw(), playDiscard(), playSelect()
- `userManager.js`: getUserId(), setUserId() for localStorage management

**components/** - UI Components
- `Tile.jsx`: Okey tile with color, number, fake okey indicator, 3D effect
- `Rack.jsx`: Rack (Istaka) container with drag & drop support
- `Player.jsx`: Player info display with position, tile count, opened status

**index.jsx** - Ana component
- Game state management
- Backend API integration
- Tile selection logic
- Drag & drop handlers
- UI rendering (hands, racks, discard pile, okey indicator)

## 📝 Notlar

- Eski dosya: 741 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~93 satır/dosya ortalama (8 dosya)
- %87 daha modüler ve okunabilir! 🎉
- Backend API çağrıları tamamen ayrıştırıldı
- Component-based UI yapısı
- Axios dependency (backend communication)
