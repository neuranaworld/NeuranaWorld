# 🧠 NeuranaWorld - Oyunlar ve Uygulamalar Platformu

Modern, responsive ve kullanıcı dostu oyun/uygulama platformu. 100+ animasyon ve özellik ile tamamen ücretsiz!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://neuranaworld.github.io/NeuranaWorld/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-Personal-orange)](LICENSE)

## 🌟 Canlı Demo

**🚀 [NeuranaWorld'ü Ziyaret Edin!](https://neuranaworld.github.io/NeuranaWorld/)**

## ✨ Öne Çıkan Özellikler

### 🎨 Modern UI/UX
- **Hero Section**: Çarpıcı karşılama ekranı, floating shapes animasyonları
- **Category Showcase**: İnteraktif kategori kartları
- **Smooth Animations**: 100+ CSS ve JavaScript animasyonu
- **Glassmorphism**: Modern blur efektleri

### 🎮 İçerik
- **28 Oyun**: Aksiyon, Bulmaca, Strateji, Macera kategorilerinde
- **9 Uygulama**: Eğitim, Araçlar, Müzik, Çizim ve daha fazlası
- **Dinamik Yükleme**: Hızlı ve optimize edilmiş içerik gösterimi

### 🔍 Özellikler
- **Akıllı Arama**: Gerçek zamanlı arama ve filtreleme
- **Kategori Filtreleme**: Tek tıkla kategori bazlı filtreleme
- **Responsive Design**: Mobile-first yaklaşım
- **Dark Gradient**: Modern renk paleti
- **SEO Optimized**: Arama motorları için optimize

### 📱 Mobile-First
- **Hamburger Menu**: Yan açılır mobil menü
- **Touch Optimized**: Dokunmatik ekranlar için optimize
- **Responsive Grid**: Tüm cihazlarda mükemmel görünüm
- **Fast Loading**: Hızlı yükleme süreleri

## 📁 Proje Yapısı

```
NeuranaWorld/
├── index.html              # Ana sayfa (Hero + Showcase)
├── app.js                  # JavaScript (444 satır)
├── style.css               # Modern CSS (1217 satır)
├── README.md               # Bu dosya
│
├── Oyunlar/
│   ├── Aksiyon/           # 7 oyun (Snake, Flappy Bird, Pong...)
│   ├── Bulmaca/           # 12 oyun (2048, Tetris, Sudoku...)
│   ├── Strateji/          # 7 oyun (Okey, Batak, Poker...)
│   ├── Kelime/            # 3 oyun (Adam Asmaca...)
│   ├── Macera/            # 1 oyun (Labirent)
│   └── Spor/              # 1 oyun (Mini Golf)
│
├── Uygulamalar/
│   ├── Araçlar/           # Hesap Makinesi, Birim Dönüştürücü
│   ├── Eğitim/            # Dört İşlem
│   ├── Müzik/             # Müzik Klavyesi
│   ├── Zaman/             # Çalar Saat, Kronometre, Ses Kayıt
│   ├── Çizim/             # 2D Grafik Çizimi
│   └── Sosyal/            # Neuranaverse
│
├── backend/               # Python Backend
└── frontend/              # React Frontend (opsiyonel)
```

## 🚀 Hızlı Başlangıç

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

```bash
# Repository'yi klonlayın
git clone https://github.com/neuranaworld/NeuranaWorld.git

# Klasöre girin
cd NeuranaWorld

# index.html'i tarayıcıda açın
# veya
python -m http.server 8000
# Tarayıcıda: http://localhost:8000
```

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

```bash
# Main branch'e geçin
git checkout main

# Mevcut branch'i merge edin
git merge claude/github-integration-setup-01BLMxTmwKLkHhyxtiDGxGty

# GitHub'a push edin
git push origin main
```

Sonra Settings → Pages → Branch: `main` seçin.

### Custom Domain (Opsiyonel)

1. Repository Settings → Pages → Custom domain
2. Domain adınızı girin: `www.neuranaworld.com`
3. DNS ayarlarınızı yapın:
   ```
   CNAME www neuranaworld.github.io
   ```

## 🎨 Özellikler Detaylı

### 🎯 Hero Section
```
🧠 Hoş Geldiniz!
   NeuranaWorld
```
- Floating shapes animasyonları (20s loop)
- Pulse emoji animasyonu
- Shimmer gradient text efekti
- 2 CTA butonu (Call-to-Action)
- Canlı istatistikler
- Bounce scroll indicator

### 🎴 Card Sistemi
- Gradient overlay hover efekti
- 20px rounded corners
- Box shadow transitions
- "Yakında" badge animasyonları
- Z-index layer management

### 🔍 Arama & Filtreleme
- Debounced search input
- Real-time filtering
- Category-based filters
- Clear search button
- Empty state messages

### 📊 İstatistikler
- Animated counters
- Progress bars
- Hover elevation effects
- Icon wrappers with gradients

### 📱 Responsive Breakpoints
```css
Desktop:  > 768px  (3-4 columns)
Tablet:   768px    (2 columns)
Mobile:   < 480px  (1 column)
```

## 🎨 Renk Paleti

### CSS Variables
```css
--primary-color: #667eea      /* Mor */
--secondary-color: #764ba2    /* Koyu Mor */
--accent-color: #f093fb       /* Pembe */
--success-color: #4ade80      /* Yeşil */
--danger-color: #f87171       /* Kırmızı */

/* Gray Scale */
--gray-100: #f5f7fa
--gray-200: #e8ecf3
--gray-300: #c3cfe2
--gray-400: #999
--gray-600: #666
--gray-900: #333
```

### Gradients
```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Card Gradient */
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

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
