# 🎲 OkeyPro - Modüler Yapı

## 📁 Klasör Yapısı

```
OkeyPro/
├── index.jsx              # Ana oyun component'i (~320 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   └── gameConfig.js     # Config, Pro renk paleti, API (55 satır)
│
├── utils/                 # Yardımcı fonksiyonlar
│   ├── api.js            # Backend API calls (26 satır)
│   ├── audio.js          # Ses sistemi (52 satır)
│   ├── userManager.js    # Kullanıcı ID yönetimi (16 satır)
│   └── scoreCalculator.js # Puan ve çift hesaplama (27 satır)
│
└── components/            # Alt component'ler
    ├── Tile.jsx          # Pro taş component (95 satır)
    ├── Rack.jsx          # Istaka component (60 satır)
    └── Player.jsx        # Oyuncu gösterimi (45 satır)
```

## ✨ Avantajlar

1. **Okunabilirlik**: 666 satır → 16-320 satır/dosya (9 dosya)
2. **Pro UI**: Gelişmiş renk paleti ve tasarım
3. **Skor Sistemi**: Otomatik puan ve çift hesaplama
4. **Modülerlik**: OkeyGame101'den daha organize
5. **Genişletilebilirlik**: Yeni skorlama kuralları kolayca eklenebilir

## 🎮 Özellikler

- **Pro Tasarım**: Özel renk paleti ve ahşap istaka görünümü
- **Skor Takibi**: Anlık puan ve çift sayısı
- **3 Istaka Sistemi**: 15 taş/istaka
- **AI Oyuncular**: 3 AI rakip
- **Backend Multiplayer**: FastAPI backend
- **Drag & Drop**: Gelişmiş sürükle-bırak
- **Ses Efektleri**: Draw, discard, select sesleri

## 📦 Dosya Detayları

**constants/** - Oyun sabitleri
- `gameConfig.js`: Rack, tile, renk paleti (masa, ahşap, taş, rakam renkleri), API endpoints

**utils/** - Yardımcı fonksiyonlar
- `api.js`: Backend API çağrıları (OkeyGame101 ile aynı)
- `audio.js`: AudioEngine (OkeyGame101 ile aynı)
- `userManager.js`: User ID management (OkeyGame101 ile aynı)
- `scoreCalculator.js`: calculateScoreAndPairs() - puan ve çift hesaplama

**components/** - UI Components
- `Tile.jsx`: Pro tasarım taş component
- `Rack.jsx`: Ahşap istaka component
- `Player.jsx`: Oyuncu bilgisi gösterimi

**index.jsx** - Ana component
- Game state management
- Backend API integration
- Real-time score calculation
- Pro UI rendering

## 📝 Notlar

- Eski dosya: 666 satır (tek dosya, public/Oyunlar-legacy/)
- Yeni yapı: ~74 satır/dosya ortalama (9 dosya)
- %89 daha modüler! 🎉
- OkeyGame101'in pro versiyonu
- Gelişmiş UI ve skor sistemi
- Kod tekrarı olmadan modüler yapı
