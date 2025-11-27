# 🧠 NeuranaWorld

Modern, responsive ve kullanıcı dostu oyun/uygulama platformu.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://neuranaworld.github.io/NeuranaWorld/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green)](CHANGELOG.md)

## ✨ Özellikler

- 🎮 **25 Oyun**: Aksiyon, Bulmaca, Strateji, Macera kategorilerinde
- 💻 **9 Uygulama**: Araçlar, Eğitim, Müzik ve daha fazlası
- 🌙 **Dark Theme**: Göz dostu karanlık mod desteği
- 🎨 **Modern UI**: Glassmorphism ve smooth animations
- 📱 **Responsive**: Mobile-first tasarım
- 🤖 **AI Backend**: Multi-LLM consensus sistemi

## 🚀 Hızlı Başlangıç

### Frontend

```bash
# Bağımlılıkları yükle
npm install

# Development modunda çalıştır
npm run dev

# Production build
npm run build
```

Frontend: `http://localhost:5173`

### Backend (Opsiyonel)

```bash
# Linux/Mac
cd backend
./start_server.sh

# Windows
cd backend
start_server.bat
```

Backend: `http://localhost:8000` | API Docs: `http://localhost:8000/docs`

## 📁 Proje Yapısı

```
NeuranaWorld/
├── src/                    # React uygulaması (Vite)
│   ├── components/         # Reusable UI components
│   ├── constants/          # Oyun/uygulama verileri
│   ├── services/           # API client
│   ├── styles/             # CSS modülleri
│   └── pages/              # Sayfa componentleri
├── Oyunlar/               # Oyun bileşenleri (25 oyun)
├── backend/               # Python FastAPI backend
├── docs/                  # Dokümantasyon
└── scripts/               # Yardımcı scriptler
```

## 🎨 Yeni Özellikler (v2.0)

- ✅ **Glassmorphism Design**: Modern blur effects
- ✅ **Dark Theme Toggle**: Kalıcı tema tercihi
- ✅ **Component-Based**: Modüler ve reusable yapı
- ✅ **API Client**: Axios ile merkezi API yönetimi
- ✅ **Smooth Animations**: Fade-in, float, pulse efektleri

## 📚 Dokümantasyon

- [Detaylı Dokümantasyon](docs/README.md) - Kapsamlı özellik listesi
- [İyileştirmeler](docs/IMPROVEMENTS.md) - v2.0 yenilikleri
- [Katkı Rehberi](CONTRIBUTING.md) - Nasıl katkıda bulunulur

## 🎮 Oyunlar

**Aksiyon (7)**: Breakout, City Runner, Dart, Flappy Bird, Pong, Sky Jumper, Snake

**Bulmaca (10)**: 2048, Çizim, Hafıza, Mayın, Nonogram, Puzzle, Şeker, Tetris, Yapboz, Kelime

**Strateji (7)**: Batak, Connect Four, Kart Oyunları, Okey 101, Okey Pro, Poker, XOX

**Macera (1)**: Labirent

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Commit edin (`git commit -m '✨ feat: Add feature'`)
4. Push edin
5. Pull Request açın

## 📄 Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

---

<div align="center">

**🧠 NeuranaWorld** - Made with ❤️ by NeuranaWorld Team

[Live Demo](https://neuranaworld.github.io/NeuranaWorld/) • [Docs](docs/README.md) • [Report Bug](https://github.com/neuranaworld/NeuranaWorld/issues)

</div>
