# 🍬 Şeker Eşleştirme - Modüler Yapı

## 📁 Klasör Yapısı

```
SekerEslestirmece/
├── index.jsx              # Ana oyun component'i (~150 satır)
├── README.md              # Bu dosya
│
├── constants/             # Sabitler
│   ├── config.js         # Oyun ayarları (GRID_SIZE, hızlar)
│   ├── candyData.js      # Şeker tipleri ve renkleri
│   └── worlds.js         # 5 dünya tanımı
│
├── classes/               # Sınıflar
│   └── AudioEngine.js    # Ses motoru
│
├── hooks/                 # Custom React Hooks
│   ├── useGameState.js   # Oyun durumu yönetimi
│   ├── useMatching.js    # Eşleşme mantığı
│   └── useAnimation.js   # Animasyon kontrolü
│
├── utils/                 # Yardımcı fonksiyonlar
│   ├── gridHelpers.js    # Grid işlemleri
│   └── scoreCalculator.js # Skor hesaplama
│
└── components/            # Alt component'ler
    ├── Particle.jsx      # Partikül efekti
    ├── ScorePopup.jsx    # Skor gösterimi
    ├── GameBoard.jsx     # Oyun tahtası
    ├── Candy.jsx         # Şeker component'i
    └── LevelSelect.jsx   # Seviye seçimi
```

## ✨ Avantajlar

1. **Okunabilirlik**: Her dosya 50-150 satır
2. **Bakım Kolaylığı**: Hata ayıklama kolay
3. **Yeniden Kullanılabilirlik**: Component'ler başka projelerde kullanılabilir
4. **Test Edilebilirlik**: Her modül ayrı test edilebilir
5. **Geliştirme Hızı**: Yeni özellik eklemek çok kolay

## 🔧 Kullanım

```jsx
import SekerEslestirmece from './components/games/SekerEslestirmece';

function App() {
  return <SekerEslestirmece />;
}
```

## 📝 Notlar

- Eski dosya: 1,366 satır (tek dosya)
- Yeni yapı: ~150 satır/dosya (10+ dosya)
- %90 daha okunabilir! 🎉
