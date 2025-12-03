# 🌌 NeuranaWorld Galaxy

**3D Metaverse Platform** - React + Babylon.js

## 📋 Genel Bakış

NeuranaWorld Galaxy, Babylon.js 3D engine kullanılarak geliştirilmiş bir metaverse/galaxy platformudur. Kullanıcıların 3D ortamda etkileşime girebileceği, oyunlar oynayabileceği ve sosyalleşebileceği bir dijital evren.

## 🎯 Özellikler

- 🎮 **3D Oyunlar**: Babylon.js ile geliştirilmiş interaktif oyunlar
- 🌐 **Metaverse**: 3D sosyal ortam
- 🎨 **Rich UI**: Radix UI ve Tailwind CSS ile modern arayüz
- 🔧 **React 19**: En güncel React özellikleri
- 🎭 **Multiple Tools**: Matematik, oyunlar, çeviri ve daha fazlası

## 🛠️ Teknolojiler

### Frontend
- **React 19.0.0** - UI library
- **Babylon.js 8.33.2** - 3D engine
- **Radix UI** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS
- **React Router 7.5.1** - Routing
- **Axios** - HTTP client
- **Colyseus.js** - Multiplayer networking

### Backend
- Node.js backend servisleri
- Multiplayer server desteği

## 📁 Proje Yapısı

```
galaxy/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── AllToolsPage.js
│   │   │   ├── GamesPage.js
│   │   │   ├── MathPage.js
│   │   │   ├── MultiAIComparePage.js
│   │   │   ├── TranslatePage.js
│   │   │   ├── TurkishPage.js
│   │   │   ├── NeuraVerse/        # 3D Metaverse
│   │   │   ├── games/             # Oyunlar (Okey, vb.)
│   │   │   ├── math/              # Matematik araçları
│   │   │   ├── tools/             # Çeşitli araçlar
│   │   │   └── turkish/           # Türkçe eğitim
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   ├── plugins/
│   ├── package.json
│   ├── craco.config.js
│   └── tailwind.config.js
│
└── backend/
    └── [Backend servisleri]
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 16+
- npm veya yarn

### Frontend

```bash
# Frontend klasörüne girin
cd apps/galaxy/frontend

# Bağımlılıkları yükleyin
npm install
# veya
yarn install

# Geliştirme sunucusunu başlatın
npm start
# veya
yarn start

# Build oluşturun
npm run build
# veya
yarn build
```

Frontend varsayılan olarak http://localhost:3000 adresinde çalışır.

### Backend

```bash
# Backend klasörüne girin
cd apps/galaxy/backend

# Backend'i başlatın
# (Backend kurulum talimatları burada olacak)
```

## 🎮 Özellik Listesi

### 🧮 Matematik
- Hesap Makinesi
- Derin Düşünme Modu
- Hızlı Pratik
- Polinom Arena
- Sudoku
- Temel İşlemler Oyunu
- Sayı Tahmin Oyunu
- Örüntü Oyunu

### 🎯 Oyunlar
- Okey Oyunu
- NeuraVerse (3D Minecraft-benzeri)
- Ve daha fazlası...

### 🛠️ Araçlar
- Alarm Sistemi
- Birim Dönüştürme
- Renk Seçici
- Günlük Söz
- Sınav Modu
- Yorgunluk Dedektörü
- Fokus Sesleri
- Geometri Hesaplayıcı
- 2D Grafik
- El Yazısı OCR
- İsim Şehir Hayvan
- JSON Görselleştirici
- Markdown Editör
- Matris Hesaplayıcı
- Mind Map (Normal ve Gelişmiş)
- Gürültü İptali
- Şifre Oluşturucu
- Pomodoro Timer
- QR Kod Oluşturucu
- Aralıklı Tekrar
- İstatistik Hesaplayıcı
- Adım Sayacı
- Kronometre
- Metin Karşılaştırma
- Ses Kaydedici
- Su Hatırlatıcı
- Hava Durumu

### 📚 Türkçe Eğitim
- Gramer Testi
- Yazım Kuralları
- Fiilimsi Oyunu
- Adam Asmaca
- Noktalama Oyunu
- Kelime Zinciri

### 🌐 Diğer
- Multi AI Karşılaştırma
- Çeviri Aracı

## 🎨 UI Bileşenleri

Proje, Radix UI kütüphanesini kullanarak erişilebilir ve modern UI bileşenleri sağlar:

- Accordion, Alert Dialog, Avatar
- Checkbox, Collapsible, Context Menu
- Dialog, Dropdown Menu, Hover Card
- Navigation Menu, Popover, Progress
- Radio Group, Scroll Area, Select
- Slider, Switch, Tabs, Toast, Toggle
- Tooltip, ve daha fazlası

## 🔧 Yapılandırma

### CRACO (Create React App Configuration Override)

Proje, webpack yapılandırmasını özelleştirmek için CRACO kullanır:
- Health check plugin'leri
- Visual edits plugin'leri
- Babel yapılandırması

### Tailwind CSS

Özelleştirilmiş Tailwind yapılandırması ile modern, responsive tasarım.

## 📦 Bağımlılıklar

### Öne Çıkanlar
- `@babylonjs/core`, `@babylonjs/loaders`, `@babylonjs/materials` - 3D engine
- `@radix-ui/*` - UI bileşenleri (30+ paket)
- `react-router-dom` - Routing
- `axios` - HTTP istekleri
- `colyseus.js` - Multiplayer
- `lucide-react` - İkonlar
- `tailwindcss` - Styling
- `zod` - Schema validation

## 🤝 Katkıda Bulunma

Ana projenin katkı rehberini takip edin: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 Lisans

Bu proje ana NeuranaWorld projesi ile aynı lisansa sahiptir.

## 🔗 Bağlantılar

- [Ana Proje](../../README.md)
- [NeuranaWorld GitHub](https://github.com/neuranaworld/NeuranaWorld)

---

**© 2024 NeuranaWorld Team**
