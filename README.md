# NeuranaWorld

Eğlenceli oyunlar ve kullanışlı uygulamalar sunan bir platform.

## Proje Yapısı

```
NeuranaWorld/
├── src/               # React uygulaması (Vite)
│   ├── App.jsx       # Ana uygulama ve route tanımları
│   ├── main.jsx      # Giriş noktası
│   ├── index.css     # Global stiller
│   └── pages/        # Sayfa bileşenleri
├── Oyunlar/          # Oyun bileşenleri (JSX)
│   ├── Aksiyon/     # Aksiyon oyunları
│   ├── Bulmaca/     # Bulmaca oyunları
│   ├── Strateji/    # Strateji oyunları
│   ├── Kelime/      # Kelime oyunları
│   ├── Macera/      # Macera oyunları
│   └── Spor/        # Spor oyunları
├── Uygulamalar/      # Uygulama meta dosyaları
│   ├── Araçlar/     # Araç uygulamaları
│   ├── Eğitim/      # Eğitim uygulamaları
│   ├── Ses Müzik/   # Ses ve müzik uygulamaları
│   ├── Zaman/       # Zaman yönetimi uygulamaları
│   └── Çizim Tasarım/ # Çizim ve tasarım uygulamaları
├── backend/          # Python backend servisleri
├── docs/             # Dokümantasyon dosyaları
├── scripts/          # Yardımcı scriptler
└── archive/          # Eski/kullanılmayan dosyalar
```

## Kurulum ve Çalıştırma

<<<<<<< HEAD
### Vite ile Modern Geliştirme (Önerilen)

```bash
# Repository'yi klonlayın
git clone https://github.com/neuranaworld/NeuranaWorld.git

# Klasöre girin
cd NeuranaWorld

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın (Hot reload ile)
npm run dev

# Production build oluşturun
npm run build

# Build'i önizleyin
npm run preview

# Kodu lint'leyin
npm run lint

# Lint hatalarını otomatik düzeltin
npm run lint:fix
```

### Klasik Geliştirme
=======
### Geliştirme Ortamı
>>>>>>> 8e685d7d21f7da3347bd444e7cb4003aba738366

```bash
npm install
npm run dev
```

<<<<<<< HEAD
### Live Server ile (VS Code)

1. VS Code'da projeyi açın
2. Live Server extension'ı yükleyin
3. `index.html`'e sağ tıklayın → "Open with Live Server"

## 🛠️ Geliştirme Ortamı Kurulumu

### Önkoşullar
- Node.js 16+ ve npm/yarn/pnpm
- Git
- Modern bir code editor (VS Code önerilir)

### Ortam Değişkenleri
```bash
# .env.example dosyasını kopyalayın
cp .env.example .env

# .env dosyasını düzenleyerek kendi değerlerinizi ekleyin
```

### Kod Kalitesi Araçları

#### ESLint Yapılandırması
Proje ESLint ile kod kalitesi kontrolü yapmaktadır:
- React hooks kuralları
- Kod stili kontrolleri
- Olası hataların tespiti
- Console statement uyarıları

#### Path Aliases
Vite yapılandırması ile temiz import yolları:
```javascript
// Önceki:
import Component from '../../../components/Component'

// Yeni:
import Component from '@components/Component'
```

Kullanılabilir alias'lar:
- `@` → `./src`
- `@components` → `./src/components`
- `@utils` → `./src/utils`
- `@assets` → `./src/assets`
- `@pages` → `./src/pages`

#### Hata Yönetimi
- **ErrorBoundary**: React hata sınırları ile graceful error handling
- **Logger Utility**: Yapılandırılabilir loglama sistemi
- **useErrorHandler Hook**: Fonksiyonel componentler için hata yönetimi

## 🌐 GitHub Pages ile Yayınlama

### Seçenek 1: Mevcut Branch'ten Yayınlama

1. **GitHub Repository'ye gidin**:
   ```
   https://github.com/neuranaworld/NeuranaWorld
   ```

2. **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `claude/github-integration-setup-01BLMxTmwKLkHhyxtiDGxGty`
   - Folder: `/ (root)`
   - **Save**

3. **5-10 dakika bekleyin**, siteniz hazır:
   ```
   https://neuranaworld.github.io/NeuranaWorld/
   ```

### Seçenek 2: Main Branch'e Merge Ederek
=======
### Production Build
>>>>>>> 8e685d7d21f7da3347bd444e7cb4003aba738366

```bash
npm run build
npm run preview
```

### Backend (Opsiyonel)

```bash
cd backend
pip install -r requirements.txt
python server.py
```

## Dokümantasyon

Detaylı dokümantasyon için `docs/` klasörüne bakınız:
- [README](docs/README.md)
- [React Build Guide](docs/REACT_BUILD_GUIDE.md)
- [CMD Komutları](docs/CMD_KOMUTLARI.txt)

## Özellikler

- 🎮 Çeşitli oyunlar (Macera, Bulmaca, Kelime, Aksiyon, Spor, Strateji)
- 🛠️ Kullanışlı uygulamalar (Araçlar, Eğitim, Ses & Müzik, Çizim & Tasarım, Zaman)
- ⚛️ React tabanlı modern arayüz
- 🐍 Python backend desteği

## Lisans

<<<<<<< HEAD
/* Footer Gradient */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
```

## 🛠️ Teknolojiler

### Frontend
- **React 18**: Modern UI library
- **Vite 5**: Lightning-fast build tool
- **React Router v6**: Client-side routing
- **HTML5**: Semantic markup
- **CSS3**:
  - Flexbox & Grid
  - CSS Variables
  - Animations & Transitions
  - Media Queries
  - Modern responsive design
- **JavaScript (ES6+)**:
  - React Hooks
  - Async/Await
  - ES Modules
  - Intersection Observer API
  - Event Delegation
  - State Management

### Geliştirme Araçları
- **ESLint**: Kod kalitesi ve stil kontrolü
- **Vite Dev Server**: Hot Module Replacement (HMR)
- **Path Aliases**: Temiz ve okunabilir import yolları
- **Error Boundaries**: Hata yakalama ve graceful degradation
- **Custom Hooks**: Tekrar kullanılabilir React mantığı
- **Logger Utility**: Yapılandırılabilir loglama sistemi

### Build Optimizasyonları
- **Code Splitting**: Vendor ve app bundle'ları ayrımı
- **Tree Shaking**: Kullanılmayan kodun temizlenmesi
- **Minification**: Production için optimizasyon
- **Source Maps**: Geliştirme için hata ayıklama (opsiyonel)

### Animations
- **CSS Keyframes**: float, bounce, pulse, shimmer, fadeInUp, spin
- **JS Animations**: Counter animations, Intersection Observer
- **Transitions**: Smooth hover effects, color transitions

## 🎮 Oyun Listesi

### ⚡ Aksiyon (7 oyun)
- Breakout, City Runner, Dart, Flappy Bird, Pong, Sky Jumper, Snake

### 🧩 Bulmaca (12 oyun)
- Çizim Oyunu, 2048, Yapboz, Hafıza, Mayın Tarlası, Nonogram, Puzzle, Şeker Eşleştirme, Tetris, Kelime Arama

### ♟️ Strateji (7 oyun)
- Batak, Kart Oyunları, Connect Four, Okey 101, Okey Pro, Poker, XOX

### 🌀 Macera (1 oyun)
- Labirent

## 💻 Uygulamalar

### 🛠️ Araçlar
- Hesap Makinesi, Birim Dönüştürücü

### 📚 Eğitim
- Dört İşlem

### 🎹 Müzik
- Müzik Klavyesi

### ⏰ Zaman
- Çalar Saat, Kronometre, Ses Kayıt

### ✏️ Çizim
- 2D Grafik Çizimi

### 🌐 Sosyal
- Neuranaverse (Metaverse platformu)

## 🔧 Özelleştirme

### Yeni Oyun Ekleme

1. **Oyun dosyasını oluşturun**:
   ```
   Oyunlar/Kategori/YeniOyun.js
   Oyunlar/Kategori/index_YeniOyun.html
   ```

2. **app.js'e ekleyin**:
   ```javascript
   {
       id: 'yenioyun',
       name: 'Yeni Oyun',
       icon: '🎮',
       category: 'Kategori',
       path: 'Oyunlar/Kategori/index_YeniOyun.html',
       shortDesc: 'Oyun açıklaması'
   }
   ```

### Renk Teması Değiştirme

`style.css` dosyasında `:root` değişkenlerini değiştirin:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Animasyon Hızını Ayarlama

```css
/* Daha hızlı animasyon */
.hero-shape {
    animation: float 10s infinite ease-in-out;
}

/* Daha yavaş animasyon */
.hero-shape {
    animation: float 30s infinite ease-in-out;
}
```

## 📱 Tarayıcı Desteği

| Tarayıcı | Desteklenen Versiyon |
|----------|---------------------|
| Chrome   | ✅ 90+             |
| Firefox  | ✅ 88+             |
| Safari   | ✅ 14+             |
| Edge     | ✅ 90+             |
| Opera    | ✅ 76+             |

## 🚀 Performans

### Lighthouse Scores (Hedef)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimizasyonlar
- ✅ Minified CSS/JS (production için)
- ✅ Lazy loading images
- ✅ Hardware-accelerated animations
- ✅ Debounced search
- ✅ Efficient event listeners

## 📈 Roadmap

### Yakında Gelecek Özellikler
- [ ] 🌙 Dark Mode toggle
- [ ] ⭐ Oyun rating sistemi
- [ ] 💾 LocalStorage (favoriler, geçmiş)
- [ ] 🔔 Bildirim sistemi
- [ ] 🎵 Ses efektleri
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🔐 Kullanıcı sistemi
- [ ] 🏆 Liderlik tablosu

### Planlanıyor
- [ ] Blog bölümü
- [ ] Forum/Community
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Game recommendations

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz!

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📞 İletişim & Destek

### Sorular
- 📧 Email: [email protected]
- 💬 GitHub Issues: [Issues](https://github.com/neuranaworld/NeuranaWorld/issues)
- 📖 Docs: Bu README

### Bug Bildirme
1. GitHub Issues'a gidin
2. "New Issue" tıklayın
3. Bug detaylarını yazın
4. Screenshot ekleyin (varsa)

## 📄 Lisans

Bu proje kişisel kullanım içindir. Ticari kullanım için izin alınması gerekmektedir.

## 🎉 Teşekkürler

NeuranaWorld'ü kullandığınız için teşekkürler!

### Katkıda Bulunanlar
- 🧠 Ana Geliştirici: [NeuranaWorld Team]
- 🎨 Tasarım: Modern UI/UX prensipleri
- 💻 Kod: Vanilla JavaScript & CSS3

---

<div align="center">

**🧠 NeuranaWorld** - Oyunlar ve Uygulamalar Dünyası

[![GitHub](https://img.shields.io/github/stars/neuranaworld/NeuranaWorld?style=social)](https://github.com/neuranaworld/NeuranaWorld)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fneuranaworld.github.io%2FNeuranaWorld%2F)](https://neuranaworld.github.io/NeuranaWorld/)

**[Live Demo](https://neuranaworld.github.io/NeuranaWorld/)** •
**[Documentation](#)** •
**[Report Bug](https://github.com/neuranaworld/NeuranaWorld/issues)** •
**[Request Feature](https://github.com/neuranaworld/NeuranaWorld/issues)**

Made with ❤️ by NeuranaWorld Team

</div>
=======
Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.
>>>>>>> 8e685d7d21f7da3347bd444e7cb4003aba738366
