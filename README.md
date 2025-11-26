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

### Geliştirme Ortamı

```bash
npm install
npm run dev
```

### Production Build

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

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.
