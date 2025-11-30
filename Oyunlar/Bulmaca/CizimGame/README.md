# Çizim Tahtası Pro - Modüler Yapı

Profesyonel çizim uygulaması modüler yapıya dönüştürüldü.

## 📁 Klasör Yapısı

```
CizimGame/
├── core/                         # Çekirdek motorlar
│   ├── CanvasEngine.js          # Canvas temel işlemleri (clear, resize, rotate, flip, filters)
│   ├── HistoryManager.js        # Undo/Redo sistemi
│   └── CoordinateSystem.js      # Zoom, pan, grid snap
│
├── tools/                        # Çizim araçları
│   ├── DrawingTools.js          # Brush, eraser, spray, symmetry, gradient
│   └── ShapeTools.js            # Line, circle, rectangle, star
│
├── utils/                        # Yardımcı araçlar
│   ├── ExportSystem.js          # PNG, JPG, WebP export
│   ├── FileManager.js           # Save/Load (.cdp format)
│   ├── KeyboardManager.js       # Klavye kısayolları
│   └── Presets.js               # Fırça presetleri, renk paleti, kısayol listesi
│
└── index.jsx                     # Ana React bileşeni
```

## 🎨 Özellikler

### Çizim Araçları
- ✏️ **Fırça** - 8 farklı preset (Kalem, İnce, Fırça, Boya, Yumuşak, Sprey, Marker, Işık)
- 🧹 **Silgi** - Ayarlanabilir boyut
- 📏 **Şekiller** - Çizgi, Daire, Dikdörtgen, Yıldız
- 🔤 **Metin** - Font boyutu ayarlanabilir
- 💧 **Renk Seçici** - Eyedropper tool

### Özel Modlar
- 💨 **Sprey Boya** - Gerçekçi sprey efekti
- 🔄 **Simetri Modu** - 2-24 eksen simetrik çizim
- 🌈 **Gradyan Modu** - 2 renk gradyan
- 📐 **Izgara Sistemi** - Snap to grid desteği

### Canvas İşlemleri
- ↩️ **Undo/Redo** - Sınırsız geçmiş
- 🔍 **Zoom & Pan** - 0.1x - 10x zoom
- 🔄 **Rotate & Flip** - 90° döndürme, yatay/dikey çevirme
- 📏 **Cetveller** - Pixel hassasiyeti
- 🗺️ **Mini Harita** - Canvas önizleme

### Filtreler & Efektler
- ☀️ Parlaklık ayarı
- 🌓 Kontrast ayarı
- 🎨 Doygunluk ayarı
- 💫 Gölge efekti
- 🎭 Blend modları (8 farklı)

### Dosya Yönetimi
- 💾 **Kaydet** - Proje formatı (.cdp)
- 📂 **Aç** - Proje yükleme
- 📥 **Export** - PNG, JPG, WebP
- 🔄 **Otomatik Kayıt** - 30 saniyede bir

### Canvas Boyutları
**Standart**: SVGA, XGA, Full HD, 4K
**Sosyal Medya**: Instagram, Story, Facebook, Pinterest
**Baskı (300 DPI)**: A4, A3, Letter

## ⌨️ Klavye Kısayolları

| Tuş | İşlev |
|-----|-------|
| `B` | Fırça |
| `E` | Silgi |
| `I` | Renk Seçici |
| `H` | Taşı (Pan) |
| `L` | Çizgi |
| `C` | Daire |
| `R` | Dikdörtgen |
| `T` | Metin |
| `[` / `]` | Boyut -/+ |
| `+` / `-` | Zoom |
| `G` | Izgara |
| `Ctrl+Z` | Geri Al |
| `Ctrl+Y` | İleri Al |
| `Ctrl+S` | Kaydet |
| `Delete` | Temizle |

## 🚀 Kullanım

```javascript
import CizimTahtasi from './Oyunlar/Bulmaca/CizimGame';

<Route path="/oyunlar/cizim" element={<CizimTahtasi />} />
```

## 📊 Kod İstatistikleri

**Öncesi**: 1 dosya, 1151 satır
**Sonrası**: 9 dosya, ~1200 satır (modüler)

### Dosya Dağılımı:
- `index.jsx`: ~550 satır (UI ve entegrasyon)
- `CanvasEngine.js`: ~100 satır (canvas işlemleri)
- `HistoryManager.js`: ~70 satır (undo/redo)
- `CoordinateSystem.js`: ~70 satır (koordinat sistemi)
- `DrawingTools.js`: ~90 satır (çizim araçları)
- `ShapeTools.js`: ~130 satır (şekil çizimi)
- `ExportSystem.js`: ~50 satır (export)
- `FileManager.js`: ~90 satır (save/load)
- `KeyboardManager.js`: ~80 satır (klavye)
- `Presets.js`: ~70 satır (sabitler)

## 🧪 Modüler Avantajlar

1. **Test Edilebilirlik**: Her modül bağımsız test edilebilir
2. **Bakım Kolaylığı**: Her özellik kendi dosyasında
3. **Yeniden Kullanılabilirlik**: Modüller başka projelerde kullanılabilir
4. **Okunabilirlik**: Her dosya tek bir sorumluluğa odaklanmış
5. **Genişletilebilirlik**: Yeni özellik eklemek kolay

## 🔧 Geliştirme

Yeni özellik eklerken:
- Çizim işlevi → `tools/` klasörü
- Canvas işlemi → `core/CanvasEngine.js`
- Export formatı → `utils/ExportSystem.js`
- Klavye kısayolu → `utils/KeyboardManager.js`
- UI bileşeni → `index.jsx`

## 💡 Önerilen İyileştirmeler

1. **Katman Sistemi** - Photoshop tarzı layers
2. **Vektör Çizim** - SVG desteği
3. **Fırça Editörü** - Özel fırça oluşturma
4. **Animasyon** - Frame-by-frame animasyon
5. **Plugin Sistemi** - Genişletilebilir mimari
