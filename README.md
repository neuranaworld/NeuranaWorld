# 🧠 NeuranaWorld

Modern, kapsamlı oyun ve eğitim platformu. 25+ oyun, eğitim modülleri, araçlar ve AI entegrasyonu ile tamamen ücretsiz!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://neuranaworld.github.io/NeuranaWorld/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-Personal-orange)](LICENSE)

## 🌟 Canlı Demo

**🚀 [NeuranaWorld'ü Ziyaret Edin!](https://neuranaworld.github.io/NeuranaWorld/)**

---

## 🎯 Proje Yapısı

NeuranaWorld üç ana bileşenden oluşur:

1. **🎮 Ana Site** - GitHub Pages için React + Vite oyun vitrini
2. **🎓 Frontend** - Kapsamlı eğitim ve araçlar platformu
3. **🐍 Backend** - Python tabanlı AI entegrasyonu ve oyun sunucusu

📖 **Detaylı yapı için:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## ✨ Özellikler

### 🎮 Oyunlar (25+)

#### ⚡ Aksiyon (7)
Snake, Flappy Bird, Pong, Breakout, City Runner, Sky Jumper, Dart

#### 🧩 Bulmaca (10)
2048, Tetris, Mayın Tarlası, Hafıza, Sudoku, Nonogram, Yapboz, Şeker Eşleştirme, Kelime Arama, Çizim Oyunu

#### ♟️ Strateji (7)
Okey, Okey Pro, Batak, Poker, Connect Four, XOX, Kart Oyunları

#### 🌀 Macera
Labirent

### 🎓 Eğitim Platformu

- **Matematik:** DeepThink modu, hızlı pratik, oyunlar (Sudoku, Polinom Arena)
- **Türkçe:** Dilbilgisi testleri, yazım kuralları, oyunlar (Adam Asmaca, Kelime Zinciri)
- **AI Özellikleri:** Multi-AI karşılaştırma, çeviri sistemi

### 🛠️ Araçlar

- Pomodoro Timer
- Hesap Makinesi
- Birim Dönüştürücü
- 2D Grafik Çizimi
- Çalar Saat & Kronometre
- Ses Kaydedici
- Hava Durumu
- Mind Map
- Spaced Repetition

### 🌐 NeuraVerse

Metaverse platformu - 3D dünya keşfi ve sosyal etkileşim

---

## 🚀 Hızlı Başlangıç

### Ana Site (GitHub Pages Vitrini)

```bash
# Repository'yi klonlayın
git clone https://github.com/neuranaworld/NeuranaWorld.git
cd NeuranaWorld

# Dependencies yükleyin
npm install

# Development server
npm run dev

# Production build
npm run build
```

### Frontend Platform (Tam Özellikli)

```bash
cd frontend

# Dependencies yükleyin
npm install

# Development server
npm start

# Production build
npm run build
```

### Backend (Python Server)

```bash
cd backend

# Virtual environment (önerilen)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate  # Windows

# Dependencies yükleyin
pip install -r requirements.txt

# Sunucuyu başlatın
python server.py
```

---

## 🌐 GitHub Pages Deployment

### Otomatik Deployment

GitHub Actions otomatik olarak her push'ta siteyi deploy eder.

Workflow dosyası: `.github/workflows/deploy.yml`

### Manuel Deployment

```bash
# Build
npm run build

# Commit ve push
git add dist
git commit -m "Deploy to GitHub Pages"
git push
```

Site 2-3 dakika içinde hazır:
```
https://neuranaworld.github.io/NeuranaWorld/
```

---

## 🛠️ Teknolojiler

### Ana Site
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Vanilla CSS/JS** - Oyunlar için lightweight approach

### Frontend Platform
- **Create React App** - React boilerplate
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **React Router v6** - Advanced routing
- **Custom Hooks** - State management

### Backend
- **Python 3.x** - Backend language
- **Flask/FastAPI** - Web framework
- **LLM Integration** - AI özellikleri
- **SQLite/PostgreSQL** - Database

---

## 📁 Proje Dizin Yapısı

```
NeuranaWorld/
├── 🎮 Ana Site (Root)
│   ├── src/                # React source
│   │   ├── App.jsx        # Main app + routing
│   │   └── pages/         # Pages
│   ├── Oyunlar/           # Oyun kategorileri
│   │   ├── Aksiyon/       # *.jsx files
│   │   ├── Bulmaca/       # *.jsx files
│   │   ├── Strateji/      # *.jsx files
│   │   └── Macera/        # *.jsx files
│   └── Uygulamalar/       # Uygulama meta verileri
│
├── 🎓 Frontend Platform
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable components
│       └── utils/         # Helper functions
│
└── 🐍 Backend
    ├── server.py          # Main server
    ├── llm_router.py      # AI routing
    └── okey_game.py       # Game server
```

📖 **Tam yapı için:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🎨 Özellikler Detaylı

### Ana Site Özellikleri

- **Modern UI/UX:** Glassmorphism, smooth animations
- **Responsive:** Mobile-first design
- **SEO Optimized:** Meta tags, semantic HTML
- **Fast Loading:** Vite optimizations
- **Akıllı Arama:** Real-time filtering
- **Kategori Filtreleme:** Tek tıkla filtre

### Frontend Platform Özellikleri

- **AI Powered:** Multi-LLM comparison, intelligent routing
- **Educational:** Structured learning paths
- **Gamified:** Eğlenceli öğrenme deneyimi
- **Progress Tracking:** Gelişim takibi
- **Responsive:** Tüm cihazlarda mükemmel
- **Accessibility:** WCAG 2.1 uyumlu

### Backend Özellikleri

- **LLM Router:** Çoklu AI modeli yönetimi
- **Consensus Engine:** AI yanıtlarını birleştirme
- **Game Server:** Multiplayer oyun desteği
- **Question Generator:** Dinamik soru üretimi
- **Word Validator:** Türkçe kelime kontrolü

---

## 🎯 Kullanım Senaryoları

### Öğrenciler için
- Matematik ve Türkçe pratik
- Eğlenceli oyunlarla öğrenme
- Sınav hazırlığı

### Öğretmenler için
- Öğrencilere kaynak önerme
- Sınıf içi aktiviteler
- Ödev kaynağı

### Geliştiriciler için
- Open-source örnek proje
- React + Vite best practices
- AI entegrasyon örnekleri

### Casual Kullanıcılar için
- Eğlenceli oyunlar
- Kullanışlı araçlar
- Zaman geçirme

---

## 📊 İstatistikler

- ✅ **25+ Oyun** (Aksiyon, Bulmaca, Strateji, Macera)
- ✅ **15+ Araç** (Hesap makinesi, zamanlayıcılar, vb.)
- ✅ **2 Eğitim Modülü** (Matematik, Türkçe)
- ✅ **AI Entegrasyonu** (Multi-LLM, çeviri)
- ✅ **100% Ücretsiz** ve open-source
- ✅ **Responsive** tasarım
- ✅ **Modern** teknolojiler

---

## 🔧 Geliştirme

### Ana Site Development

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

### Frontend Development

```bash
cd frontend
npm start          # CRA dev server (http://localhost:3000)
npm run build      # Production build → build/
npm test           # Run tests
```

### Backend Development

```bash
cd backend
python server.py   # Start server (http://localhost:5000)
pytest             # Run tests (eğer varsa)
```

### Full Stack Development

```bash
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && python server.py

# Terminal 3: Ana Site (opsiyonel)
npm run dev
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz!

### Nasıl Katkıda Bulunulur?

1. Fork edin
2. Feature branch oluşturun
   ```bash
   git checkout -b feature/YeniOzellik
   ```
3. Değişikliklerinizi commit edin
   ```bash
   git commit -m '✨ Yeni özellik: ...'
   ```
4. Branch'inizi push edin
   ```bash
   git push origin feature/YeniOzellik
   ```
5. Pull Request açın

### Katkı Alanları

- 🎮 Yeni oyunlar ekleyin
- 🛠️ Yeni araçlar geliştirin
- 📚 Eğitim içeriği ekleyin
- 🐛 Bug fix'ler
- 📝 Dokümantasyon iyileştirmeleri
- 🎨 UI/UX iyileştirmeleri
- ⚡ Performans optimizasyonları

---

## 📈 Roadmap

### Kısa Vadeli
- [ ] 🌙 Dark mode toggle
- [ ] ⭐ Oyun rating sistemi
- [ ] 💾 LocalStorage (favoriler, geçmiş)
- [ ] 🔔 Bildirim sistemi
- [ ] 📱 PWA desteği

### Orta Vadeli
- [ ] 🔐 Kullanıcı sistemi
- [ ] 🏆 Liderlik tablosu
- [ ] 🎵 Ses efektleri
- [ ] 🌍 Multi-language support
- [ ] 📊 Analytics dashboard

### Uzun Vadeli
- [ ] 💬 Forum/Community
- [ ] 📝 Blog bölümü
- [ ] 🤖 Advanced AI features
- [ ] 🎮 Multiplayer games
- [ ] 📱 Native mobile apps

---

## 🐛 Sorun Giderme

### Build Hataları

```bash
# node_modules temizle
rm -rf node_modules package-lock.json
npm install

# Cache temizle
npm cache clean --force
```

### Port Çakışması

```bash
# Ana site (Vite varsayılan: 5173)
npm run dev -- --port 3001

# Frontend (CRA varsayılan: 3000)
PORT=3001 npm start
```

### Backend Hataları

```bash
# Python dependencies yeniden yükle
pip install --upgrade -r requirements.txt

# Virtual environment yeniden oluştur
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📞 İletişim & Destek

### İletişim

- 📧 Email: [email protected]
- 💬 GitHub Issues: [Issues](https://github.com/neuranaworld/NeuranaWorld/issues)
- 📖 Docs: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Bug Bildirme

1. [GitHub Issues](https://github.com/neuranaworld/NeuranaWorld/issues) sayfasına gidin
2. "New Issue" tıklayın
3. Detaylı açıklama ve adımlar yazın
4. Screenshot ekleyin (varsa)

### Feature Request

1. Issues sayfasında "Feature Request" template'i kullanın
2. Özelliği detaylı açıklayın
3. Use case'leri belirtin

---

## 📄 Lisans

Bu proje kişisel ve eğitim amaçlı kullanım içindir.

Ticari kullanım için lütfen iletişime geçin.

---

## 🎉 Teşekkürler

NeuranaWorld'ü kullandığınız için teşekkürler!

### Katkıda Bulunanlar

- 🧠 **Ana Geliştirici:** NeuranaWorld Team
- 🎨 **Tasarım:** Modern UI/UX prensipleri
- 💻 **Teknolojiler:** React, Vite, Python, AI

### İlham Kaynakları

- React ekosistemi
- shadcn/ui component library
- Modern web development best practices

---

<div align="center">

**🧠 NeuranaWorld** - Öğren, Oyna, Keşfet

[![GitHub](https://img.shields.io/github/stars/neuranaworld/NeuranaWorld?style=social)](https://github.com/neuranaworld/NeuranaWorld)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fneuranaworld.github.io%2FNeuranaWorld%2F)](https://neuranaworld.github.io/NeuranaWorld/)

**[🚀 Live Demo](https://neuranaworld.github.io/NeuranaWorld/)** •
**[📖 Documentation](PROJECT_STRUCTURE.md)** •
**[🐛 Report Bug](https://github.com/neuranaworld/NeuranaWorld/issues)** •
**[💡 Request Feature](https://github.com/neuranaworld/NeuranaWorld/issues)**

Made with ❤️ by NeuranaWorld Team

*Son Güncelleme: 2025-11-26*

</div>
