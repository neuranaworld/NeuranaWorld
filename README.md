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

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.