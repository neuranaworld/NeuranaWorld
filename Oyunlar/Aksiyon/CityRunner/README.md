# 🏃‍♂️ City Runner - Modüler Yapı

3D şeritli endless runner oyunu. Şehir içinde koş, engelleri atla, coinleri topla ve power-up'ları kullan!

## 📁 Modüler Yapı

```
CityRunner/
├── core/                          Çekirdek Sistemler
│   ├── Physics.js                 Fizik motoru (yerçekimi, zıplama)
│   └── Collision.js               Çarpışma tespit sistemi
│
├── entities/                      Oyun Varlıkları
│   ├── Player.js                  Oyuncu render ve animasyon
│   ├── Obstacles.js               Engel factory ve render (araba, bariyer, koni, çöp)
│   └── Collectibles.js            Coin ve PowerUp factory/render
│
├── systems/                       Oyun Sistemleri
│   ├── SpawnSystem.js             Engel/coin/powerup spawn yönetimi
│   ├── ScoreSystem.js             Skor, mesafe ve kombo sistemi
│   ├── MissionSystem.js           Görev oluşturma ve takip
│   └── AchievementSystem.js       Başarı kilitleme sistemi
│
├── rendering/                     Görsel Sistemler
│   ├── Background.js              Arka plan render (gökyüzü, binalar, yol)
│   └── ParticleSystem.js          Parçacık efektleri
│
├── utils/                         Yardımcı Modüller
│   ├── Config.js                  Oyun sabitleri ve ayarlar
│   └── Storage.js                 LocalStorage yönetimi
│
├── index.jsx                      Ana React bileşeni
└── README.md                      Bu dosya
```

## 🎮 Özellikler

### Temel Oynanış
- **3 Şeritli Koşu**: Şeritler arası hızlı geçiş
- **Engel Çeşitliliği**: Araba, bariyer, trafik konisi, çöp kutusu
- **Zıplama & Eğilme**: İki yönlü hareket mekaniği
- **Dinamik Hız**: Seviye arttıkça hız artışı

### Toplanabilir Öğeler
- **Coinler**: Tek veya 5'li trail pattern
- **Power-up'lar**:
  - 🛡️ **Kalkan**: Bir çarpışmayı önle (7sn)
  - 🧲 **Mıknatıs**: Coinleri çek (7sn)
  - 💰 **2x Coin**: Çift kazanç (7sn)
  - ⚡ **Hız Boost**: 2x hız (5sn)
  - ✨ **Yenilmez**: Engelleri yok et (6sn)

### Görev Sistemi
- Rastgele görevler (50 coin topla, 500m koş, 10 kombo, vb.)
- Her görev için coin ödülü
- Dinamik ilerleme takibi

### Başarı Sistemi
- 10x Kombo başarısı
- 1000m Koşu başarısı
- 100 Coin toplama başarısı
- LocalStorage ile kalıcı kayıt

### Skor Sistemi
- Engel geçme: +10 puan
- Coin toplama: +5 puan (2x ile +10)
- Engel yok etme (yenilmez): +50 puan
- Kombo zinciri sistemi

## 🎨 Görsel Sistemler

### Arka Plan
- Gradient gökyüzü
- Dönen güneş ışınları
- Animasyonlu bulutlar
- Dinamik binalar (ışıklı pencereler)
- 3 şeritli yol çizgileri
- Hız çizgileri (boost sırasında)

### Parçacık Efektleri
- Coin toplama parçacıkları
- Power-up aktivasyon efektleri
- Çarpışma parçacıkları
- Yere iniş efektleri

### Oyuncu Animasyonu
- Koşma animasyonu (kol ve bacak sallanması)
- Zıplama rotasyonu
- Shield glow efekti
- Invincible gölge efekti
- Boost trail efekti

## ⌨️ Kontroller

| Tuş | Aksiyon |
|-----|---------|
| `←` / `A` | Sola şerit değiştir |
| `→` / `D` | Sağa şerit değiştir |
| `↑` / `W` / `Space` | Zıpla |
| `↓` / `S` | Eğil (0.5sn) |

## 🏗️ Teknik Detaylar

### Fizik Motoru
- Yerçekimi: 0.9
- Zıplama gücü: -16
- Frame-based update loop
- AABB çarpışma tespiti
- Mesafe bazlı coin toplama

### Spawn Sistemi
- Engel: Her 60 frame (seviyeye göre azalır, min 30)
- Coin: Her 50 frame
- Power-up: Her 400 frame
- Otomatik ekran dışı cleanup

### Skor Mekaniği
- Base skor: Engel geçme
- Bonus skor: Coin toplama
- Kombo sistemi: 2 saniye süre
- Mesafe takibi: Her 10 birim = 1m

### Performans
- RequestAnimationFrame oyun döngüsü
- Canvas 2D rendering
- Efficient entity cleanup
- State-based React güncellemeleri

## 📊 Kod İstatistikleri

| Modül | Satır Sayısı | Sorumluluk |
|-------|--------------|------------|
| **Core Modüller** | ~250 | Fizik ve çarpışma |
| Physics.js | ~88 | Fizik hesaplamaları |
| Collision.js | ~99 | Çarpışma tespiti |
| **Entity Modüller** | ~410 | Oyun objeleri |
| Player.js | ~168 | Oyuncu render |
| Obstacles.js | ~184 | Engel sistemi |
| Collectibles.js | ~158 | Toplanabilirler |
| **System Modüller** | ~330 | Oyun mantığı |
| SpawnSystem.js | ~86 | Spawn yönetimi |
| ScoreSystem.js | ~102 | Skor sistemi |
| MissionSystem.js | ~71 | Görev sistemi |
| AchievementSystem.js | ~71 | Başarılar |
| **Rendering** | ~290 | Görsel sistemler |
| Background.js | ~226 | Arka plan |
| ParticleSystem.js | ~74 | Parçacıklar |
| **Utils** | ~235 | Yardımcılar |
| Config.js | ~170 | Konfigürasyon |
| Storage.js | ~65 | Veri yönetimi |
| **Ana Bileşen** | ~550 | React entegrasyonu |
| index.jsx | ~550 | Ana oyun döngüsü |
| **TOPLAM** | **~2065** | 13 modül |

**Orijinal**: 1349 satır tek dosya
**Modüler**: 2065 satır 13 dosya
**Ortalama Dosya**: ~159 satır

## 🔄 State Yönetimi

### React State
- `gameState`: 'ready' | 'playing' | 'paused' | 'gameOver'
- `score`, `coins`, `bestScore`, `totalCoins`
- `powerUp`, `level`, `mission`, `achievements`

### Game Ref
- Player state (position, velocity, animation)
- Game objects (obstacles, coins, powerUps)
- Game settings (speed, frame, boost)
- Power-up flags (shield, magnet, doubleCoins, invincible)

### Systems Ref
- ScoreSystem instance
- DistanceTracker instance
- MissionSystem instance
- AchievementSystem instance
- ParticleSystem instance
- BackgroundRenderer instance

## 💾 Veri Kalıcılığı

LocalStorage'da saklanan veriler:
- `cityrunner-best`: En yüksek skor
- `cityrunner-total-coins`: Toplam toplanan coin
- `cityrunner-achievements`: Açılan başarılar (JSON array)

## 🎯 Geliştirme Notları

### Modül Bağımlılıkları
```
index.jsx
  ├─> Core (Physics, Collision)
  ├─> Entities (Player, Obstacles, Collectibles)
  ├─> Systems (Spawn, Score, Mission, Achievement)
  ├─> Rendering (Background, Particles)
  └─> Utils (Config, Storage)
```

### Test Edilebilirlik
Her modül bağımsız test edilebilir:
- `Config.js`: Sabit değerler, unit test
- `Storage.js`: LocalStorage mock ile test
- `Physics.js`: Matematiksel hesaplamalar, pure functions
- `Collision.js`: AABB algoritması, deterministik
- Render modülleri: Canvas mock ile görsel test

### Genişletme Önerileri
1. **Yeni Engel Tipleri**: `Obstacles.js` içine ekle
2. **Yeni Power-up'lar**: `Config.js` ve `Collectibles.js`'e ekle
3. **Yeni Görevler**: `Config.js` MISSIONS dizisine ekle
4. **Yeni Başarılar**: `Config.js` ACHIEVEMENTS objesine ekle
5. **Yeni Karakterler**: `Player.js` render fonksiyonunu güncelle

## 🏆 Oyun Özellikleri Özeti

- ✅ Modüler mimari (13 dosya)
- ✅ Fizik motoru (yerçekimi, zıplama)
- ✅ Çarpışma tespit sistemi
- ✅ 4 engel tipi
- ✅ 5 power-up tipi
- ✅ Dinamik görev sistemi
- ✅ Başarı sistemi
- ✅ Kombo sistemi
- ✅ Parçacık efektleri
- ✅ Animasyonlu arka plan
- ✅ LocalStorage entegrasyonu
- ✅ Responsive UI
- ✅ Klavye kontrolleri

## 📖 Lisans

Bu proje NeuranaWorld platformunun bir parçasıdır.
