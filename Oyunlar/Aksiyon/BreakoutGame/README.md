# 🧱 Breakout Game - Modüler Yapı

Klasik tuğla kırma oyunu

## 📂 Klasör Yapısı

```
BreakoutGame/
├── constants/
│   └── gameConfig.js   # Oyun sabitleri
├── classes/
│   ├── Ball.js         # Top fizik ve hareket
│   └── Paddle.js       # Raket kontrolü
├── utils/
│   ├── spawner.js      # Tuğla ve power-up oluşturma
│   ├── collision.js    # Çarpışma tespiti
│   └── renderer.js     # Çizim fonksiyonları
└── index.jsx           # Ana oyun bileşeni
```

## 🎮 Özellikler

- **4 Power-up**: Genişleme, Multi-ball, Yavaşlatma, Lazer
- **Seviye Sistemi**: Artan zorluk
- **Parçacık Efektleri**: Tuğla kırma animasyonları
- **Can Sistemi**: 3 can

## 📊 İstatistikler

- **Orijinal:** 523 satır
- **Modüler:** 6 dosya, %83 daha modüler
