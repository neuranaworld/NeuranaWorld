# 🚀 Sky Jumper - Modüler Yapı

Sonsuz yükseliş platformer oyunu - Modüler mimariye dönüştürülmüş versiyon

## 📂 Klasör Yapısı

```
SkyJumper/
├── constants/
│   ├── gameConfig.js      # Oyun sabitleri (fizik, canvas, platform config)
│   ├── missions.js        # Görev ve başarı tanımları
│   └── themes.js          # Tema, renk ve ikon konfigürasyonları
├── classes/
│   └── Player.js          # Player sınıfı (fizik, hareket, animasyon)
├── utils/
│   ├── spawner.js         # Platform, düşman, power-up spawn sistemi
│   ├── collision.js       # Çarpışma tespiti
│   ├── scoreCalculator.js # Skor hesaplama ve başarı kontrolü
│   ├── missionManager.js  # Görev yönetimi
│   └── renderer.js        # Çizim fonksiyonları (background, entities, particles)
├── index.jsx              # Ana React bileşeni ve oyun döngüsü
└── README.md              # Bu dosya
```

## 🎮 Özellikler

### Platform Tipleri
- **Normal** (Yeşil): Standart platform
- **Hareketli** (Mavi): Sağa-sola hareket eder
- **Kırılan** (Kahverengi): Tek kullanımlık, üzerinde durulunca kırılır
- **Yaylı** (Kırmızı): Süper zıplama sağlar (1.8x)

### Power-ups
- **🚀 Jetpack** (3sn): Yukarı uç
- **🛡️ Kalkan** (8sn): Düşman koruması
- **🧲 Mıknatıs** (6sn): Power-up'ları çek
- **⏱️ Slow-mo** (5sn): Zamanı yavaşlat
- **⭐ Star** (7sn): 2x puan çarpanı

### Düşmanlar
- **Uçan Düşman** (Mor): Sağa-sola uçar
- **Statik Düşman** (Kırmızı): Dikenliyetle bekler

### Görev Sistemi
- Yükseklik görevleri (5000m)
- Platform sayısı (50 platform)
- Kombo görevleri (15x)
- Düşman yok etme (10 düşman)
- Power-up toplama (5 adet)

### Başarı Sistemi
7 farklı başarı:
- Yükseklik başarıları (1000m, 5000m, 10000m)
- Kombo başarıları (15x, 25x)
- Platform başarısı (100 platform)
- Düşman başarısı (20 düşman)

## 📊 İstatistikler

- **Orijinal:** 1,233 satır (tek dosya)
- **Modüler:** 9 dosya
  - gameConfig.js: 84 satır
  - missions.js: 38 satır
  - themes.js: 46 satır
  - Player.js: 63 satır
  - spawner.js: 78 satır
  - collision.js: 17 satır
  - scoreCalculator.js: 34 satır
  - missionManager.js: 28 satır
  - renderer.js: 445 satır
  - index.jsx: 523 satır (React component)

**İyileşme:** %87 daha modüler! 🎯

## 🎨 Temalar

- **Sky (Gökyüzü):** Bulutlu gökyüzü teması
- **Space (Uzay):** Yıldızlı uzay teması

## 🕹️ Kontroller

- **← → veya A D:** Sağa-sola hareket
- **Otomatik Zıplama:** Platformlara değince
- **Ekran Sarma:** Kenardan çıkınca diğer taraftan gir

## 🏆 Skor Sistemi

- Yükseliş: Her metre için +1 puan (× star çarpanı)
- Düşman Yok Etme: +50 puan (× star çarpanı)
- Görev Tamamlama: +250-500 puan
- Kombo Sistemi: Ardarda zıplamalar
- Başarı Bildirimleri: LocalStorage'da saklanır

## 🔧 Teknik Detaylar

- **Canvas Rendering:** 800x600px
- **FPS Target:** 60 FPS
- **Fizik:** Özel yerçekimi motoru
- **Kamera:** Smooth follow sistemi
- **Parçacık Sistemi:** Dinamik efektler
- **LocalStorage:** Best score ve achievements
