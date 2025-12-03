<div align="center">

# 🧠 NeuranaWorld

### Eğlenceli Oyunlar ve Kullanışlı Uygulamalar Platformu

[![GitHub Stars](https://img.shields.io/github/stars/neuranaworld/NeuranaWorld?style=for-the-badge&logo=github)](https://github.com/neuranaworld/NeuranaWorld/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/neuranaworld/NeuranaWorld?style=for-the-badge&logo=github)](https://github.com/neuranaworld/NeuranaWorld/network)
[![GitHub Issues](https://img.shields.io/github/issues/neuranaworld/NeuranaWorld?style=for-the-badge&logo=github)](https://github.com/neuranaworld/NeuranaWorld/issues)
[![GitHub License](https://img.shields.io/github/license/neuranaworld/NeuranaWorld?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-8.55.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

[🎮 Canlı Demo](https://neuranaworld.github.io/NeuranaWorld/) • [📖 Dokümantasyon](docs/) • [🐛 Hata Bildir](https://github.com/neuranaworld/NeuranaWorld/issues) • [💡 Özellik İste](https://github.com/neuranaworld/NeuranaWorld/issues)

</div>

---

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [🎮 Oyunlar](#-oyun-listesi)
- [💻 Uygulamalar](#-uygulamalar)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [🔧 Özelleştirme](#-özelleştirme)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

## ✨ Özellikler

<div align="center">

| 🎮 **Oyunlar** | 💻 **Uygulamalar** | 🛠️ **Araçlar** |
|:-------------:|:-----------------:|:--------------:|
| 27+ Oyun | 9+ Uygulama | Modern Stack |
| 6 Kategori | Eğitim & Araçlar | Hot Reload |
| Responsive | Müzik & Çizim | ESLint |

</div>

### 🌟 Neden NeuranaWorld?

- ⚡ **Hızlı ve Modern**: Vite ile lightning-fast build ve HMR
- 🎨 **Responsive Tasarım**: Tüm cihazlarda mükemmel deneyim
- 🔧 **Kolay Geliştirme**: Path aliases, error boundaries, custom hooks
- 📦 **Modüler Yapı**: Temiz ve organize kod yapısı
- 🎯 **SEO Optimized**: Arama motorları için optimize
- 🔒 **Güvenli**: Modern güvenlik standartları
- 🌐 **Açık Kaynak**: MIT lisansı ile ücretsiz

## 📁 Proje Yapısı
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

### Backend (Opsiyonel)
```bash
cd backend
pip install -r requirements.txt
python server.py
```

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

Production build oluşturun ve main branch'e merge edin.

## Dokümantasyon

Detaylı dokümantasyon için `docs/` klasörüne bakınız:
- [README](docs/README.md)
- [React Build Guide](docs/REACT_BUILD_GUIDE.md)
- [CMD Komutları](docs/CMD_KOMUTLARI.txt)

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

## Özellikler

- 🎮 Çeşitli oyunlar (Macera, Bulmaca, Kelime, Aksiyon, Spor, Strateji)
- 🛠️ Kullanışlı uygulamalar (Araçlar, Eğitim, Ses & Müzik, Çizim & Tasarım, Zaman)
- ⚛️ React tabanlı modern arayüz
- 🐍 Python backend desteği

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

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 🎉

### Nasıl Katkıda Bulunabilirsiniz?

1. 🍴 **Fork** edin
2. 🔨 **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** edin (`git commit -m '✨ feat: Add amazing feature'`)
4. 📤 **Push** edin (`git push origin feature/amazing-feature`)
5. 🔄 **Pull Request** açın

Detaylı bilgi için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

### 📜 Davranış Kuralları

Lütfen [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) dosyasını okuyun. Saygılı ve kapsayıcı bir topluluk oluşturmak için çalışıyoruz.

### 🔐 Güvenlik

Güvenlik açığı bildirmek için [SECURITY.md](SECURITY.md) dosyasını okuyun.

## 📞 İletişim

- 📧 **Email**: [email protected]
- 💬 **GitHub Issues**: [Issues](https://github.com/neuranaworld/NeuranaWorld/issues)
- 📖 **Docs**: [Dokümantasyon](docs/)

## 📄 Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

```
MIT License - Özgürce kullanın, değiştirin ve paylaşın!
```

## 🙏 Teşekkürler

### Katkıda Bulunanlar

Bu projeye katkıda bulunan herkese teşekkür ederiz!

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Katkıda bulunanlar burada listelenecek -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

### Kullanılan Teknolojiler ve Kütüphaneler

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Routing
- [Lucide React](https://lucide.dev/) - Icons
- [Axios](https://axios-http.com/) - HTTP client
- Ve daha fazlası...

---

<div align="center">

### 🌟 NeuranaWorld'ü Beğendiyseniz Yıldız Vermeyi Unutmayın! 🌟

[![GitHub Stars](https://img.shields.io/github/stars/neuranaworld/NeuranaWorld?style=social)](https://github.com/neuranaworld/NeuranaWorld/stargazers)

**Made with ❤️ by [NeuranaWorld Team](https://github.com/neuranaworld)**

[🏠 Ana Sayfa](https://neuranaworld.github.io/NeuranaWorld/) •
[📚 Dokümantasyon](docs/) •
[🐛 Issue Tracker](https://github.com/neuranaworld/NeuranaWorld/issues) •
[💡 Feature Requests](https://github.com/neuranaworld/NeuranaWorld/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

**© 2024 NeuranaWorld. Tüm hakları saklıdır.**

</div>