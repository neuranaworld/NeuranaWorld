# 🌾 Farm Dominion v2

**Advanced 3D Farm Simulator** - Gelişmiş Çiftlik Simülatörü

## 📋 Özellikler

### 🎮 Oynanış
- **First-person controller** - WASD + Fare kontrolü
- **Geniş açık dünya** - 4000x4000 birimlik prosedürel arazi
- **Gün-gece döngüsü** - Dinamik ışıklandırma ve gökyüzü
- **Gerçekçi fizik** - Arazi yükseklik takibi

### 🏗️ Binalar
- 🏠 **Evler** - Yaşam alanları
- 🏚️ **Ahırlar** - Hayvan barınakları
- 🌾 **Yel değirmenleri** - Animasyonlu kanatlar
- 💧 **Kuyular** - Su kaynakları
- 🏗️ **Silolar** - Depolama yapıları
- 🌿 **Seralar** - Bitki yetiştirme alanları
- 🔧 **Kulübeler** - Alet depoları
- 🚧 **Çitler** - Sınır belirleyiciler

### 🐄 NPC Sistemi
- **Otomatik hareket** - Yapay zeka ile gezinme
- **Arazi takibi** - Yüzey üzerinde doğal hareket
- **Çeşitli hayvanlar** - İnekler, koyunlar, atlar

### 🎨 Grafikler
- **Gelişmiş ışıklandırma** - Directional + Ambient + Hemisphere
- **Dinamik gölgeler** - Gerçek zamanlı gölge haritaları
- **Prosedürel arazi** - Perlin noise bazlı oluşturma
- **Çoklu texture** - Grass, rock, water, wood
- **Sis efekti** - Derinlik algısı için
- **Su yüzeyi** - Yansıtmalı materyal

### 🔊 Ses Sistemi
- **3D spatial audio** - Pozisyonel ses efektleri
- **Ortam sesleri** - Kuş sesleri, rüzgar
- **Zaman bazlı ses** - Gün/gece ses değişimi
- **Açma/kapama** - Tam ses kontrolü

### ⚙️ Ayarlar
- **Gölge kontrolü** - Performans optimizasyonu
- **Ses kontrolü** - Volume ayarları
- **Grafik kalitesi** - Low/Medium/High/Ultra
- **Kayıt sistemi** - LocalStorage ile ayar saklama

## 🎮 Kontroller

| Tuş | Aksiyon |
|-----|---------|
| **W A S D** | Hareket |
| **Shift** | Koş |
| **Fare** | Etrafına bak |
| **G** | Gölgeleri aç/kapat |
| **M** | Sesleri aç/kapat |
| **Esc** | İmleci serbest bırak |
| **Fare tıklama** | İmleci kilitle |

## 📁 Dosya Yapısı

```
farm-dominion-v2/
├── index.html              # Ana HTML dosyası
├── js/
│   ├── main.js            # Ana başlangıç noktası
│   ├── world.js           # Dünya yönetim sistemi
│   ├── terrain.js         # Arazi oluşturma
│   ├── buildings.js       # Bina sistemi
│   ├── audio.js           # Ses yönetimi
│   ├── settings.js        # Ayarlar
│   ├── utils.js           # Yardımcı fonksiyonlar
│   ├── three.module.js    # Three.js kütüphanesi
│   └── PointerLockControls.js  # Kamera kontrolü
├── assets/
│   ├── textures/
│   │   ├── grass.jpg      # Çimen texture
│   │   ├── rock.jpg       # Kaya texture
│   │   ├── water.jpg      # Su texture
│   │   ├── dirt.jpg       # Toprak texture
│   │   └── wood.jpg       # Ahşap texture
│   ├── audio/
│   │   ├── ambient.mp3    # Ortam sesi
│   │   ├── birds.mp3      # Kuş sesleri
│   │   └── wind.mp3       # Rüzgar sesi
│   ├── buildings.txt      # Bina konfigürasyonu
│   ├── npcs.txt          # NPC konfigürasyonu
│   ├── terrain.txt       # Arazi konfigürasyonu
│   └── weather.txt       # Hava durumu konfigürasyonu
└── README.md             # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcı (Chrome, Firefox, Edge, Safari)
- WebGL desteği
- JavaScript ES6+ desteği

### Adımlar

1. **Dosyaları indirin**
```bash
git clone [repository-url]
cd farm-dominion-v2
```

2. **Local sunucu başlatın**

Python ile:
```bash
python -m http.server 8000
```

Node.js ile:
```bash
npx http-server -p 8000
```

3. **Tarayıcıda açın**
```
http://localhost:8000
```

## 🎯 Performans İpuçları

### Düşük FPS alıyorsanız:
1. **G tuşuna basarak gölgeleri kapatın**
2. **Tarayıcı konsolunda şunu yazın:**
   ```javascript
   setGraphicsQuality('low')
   ```
3. **Diğer tarayıcı sekmelerini kapatın**
4. **Tam ekran moduna geçin (F11)**

### Önerilen Ayarlar:

**Yüksek Performanslı PC:**
```javascript
setGraphicsQuality('ultra')
```

**Orta Performanslı PC:**
```javascript
setGraphicsQuality('medium')
```

**Düşük Performanslı PC:**
```javascript
setGraphicsQuality('low')
```

## 🔧 Gelişmiş Özelleştirme

### settings.js dosyasından özelleştirilebilir:

```javascript
// Dünya boyutu
world.size = 4000

// Ağaç sayısı
world.treeCount = 800

// Hayvan sayısı
world.animalCount = 15

// Oyuncu hızı
player.moveSpeed = 40

// Gün uzunluğu (saniye)
time.dayLength = 300
```

## 🐛 Sorun Giderme

### Oyun yüklenmiyor
- **Konsolu kontrol edin** (F12)
- **Tüm dosyaların yerinde olduğundan emin olun**
- **WebGL desteğini kontrol edin:** http://webglreport.com

### Ses çalışmıyor
- **Tarayıcı ses izinlerini kontrol edin**
- **M tuşuna basarak sesi açın**
- **Ses dosyalarının assets/audio/ klasöründe olduğundan emin olun**

### Texture'lar görünmüyor
- **Dosya yollarını kontrol edin**
- **Konsol hatalarına bakın**
- **Tarayıcı önbelleğini temizleyin (Ctrl+F5)**

## 📊 Teknik Detaylar

### Kullanılan Teknolojiler
- **Three.js** r161 - 3D grafik motoru
- **JavaScript ES6+** - Modern JavaScript
- **HTML5 Canvas** - Render yüzeyi
- **Web Audio API** - 3D ses sistemi
- **LocalStorage** - Ayar kaydetme

### Performans
- **Target FPS:** 60
- **Render distance:** 6000 units
- **Polygon count:** ~500K (yüksek ayarlarda)
- **Shadow map:** 2048x2048

### Tarayıcı Desteği
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

## 🎨 Asset Kredileri

- **Textures:** Generated/Free sources
- **Audio:** Free ambient sounds
- **Code:** Original implementation

## 📝 Lisans

Bu proje eğitim amaçlıdır. Ticari kullanım için izin gerekmektedir.

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açın.

## 📧 İletişim

Sorular ve öneriler için:
- GitHub Issues
- Discord: [community-link]

## 🎮 Gelecek Özellikler

- [ ] Ekim/hasat sistemi
- [ ] Envanter sistemi
- [ ] Kaydetme/yükleme
- [ ] Multiplayer
- [ ] İşçi NPC'leri
- [ ] Ekonomi sistemi
- [ ] Araç sistemi (traktör, vb.)
- [ ] Mevsimler
- [ ] Daha fazla bina çeşidi
- [ ] Quest sistemi

## 🏆 Özellikler

### v2.0 (Mevcut)
- ✅ 3D dünya ve arazi
- ✅ Birinci şahıs kontrol
- ✅ Bina sistemi
- ✅ NPC sistemi
- ✅ Gün-gece döngüsü
- ✅ Ses sistemi
- ✅ Ayarlar sistemi

### v1.0
- İlk sürüm
- Basit arazi
- Temel kontroller

---

**Yapım:** 2024
**Versiyon:** 2.0
**Durum:** Active Development

🌾 İyi oyunlar! 🎮
