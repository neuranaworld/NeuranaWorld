# 📁 NeuranaWorld - Proje Yapısı

## 🎯 Genel Bakış

NeuranaWorld üç ana bileşenden oluşur:

1. **Ana Site (Root)** - GitHub Pages için React + Vite oyun vitrini
2. **Frontend** - Kapsamlı eğitim ve araçlar platformu (React)
3. **Backend** - Python tabanlı AI entegrasyonu ve oyun sunucusu

---

## 📂 Klasör Yapısı

```
NeuranaWorld/
│
├── 🎮 Ana Site (GitHub Pages)
│   ├── index.html              # Vite entry point
│   ├── package.json            # Root dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── src/
│   │   ├── main.jsx           # React app giriş noktası
│   │   ├── App.jsx            # React Router ve oyun route'ları
│   │   └── pages/
│   │       └── Home.jsx       # Ana sayfa
│   │
│   ├── Oyunlar/               # Oyun kategorileri
│   │   ├── Aksiyon/          # 7 aksiyon oyunu (*.jsx)
│   │   ├── Bulmaca/          # 10 bulmaca oyunu (*.jsx)
│   │   ├── Strateji/         # 7 strateji oyunu (*.jsx)
│   │   ├── Macera/           # 1 macera oyunu (*.jsx)
│   │   ├── Kelime/           # Kelime oyunları
│   │   └── Spor/             # Spor oyunları
│   │
│   └── Uygulamalar/           # Uygulama meta verileri
│       ├── Araçlar/          # Hesap makinesi, birim dönüştürücü
│       ├── Egitim/           # Dört işlem
│       ├── Ses Müzik/        # Müzik klavyesi
│       ├── Zaman/            # Çalar saat, kronometre, ses kayıt
│       ├── Çizim Tasarım/    # 2D grafik çizimi
│       └── Sosyal/           # Neuranaverse
│
├── 🎓 Frontend (Kapsamlı Platform)
│   ├── package.json           # Create React App dependencies
│   ├── src/
│   │   ├── App.js            # Ana routing ve navigasyon
│   │   ├── pages/
│   │   │   ├── HomePage.js           # Ana sayfa
│   │   │   ├── MultiAIComparePage.js # AI karşılaştırma
│   │   │   ├── GamesPage.js          # Oyunlar sayfası
│   │   │   ├── MathPage.js           # Matematik eğitimi
│   │   │   ├── TurkishPage.js        # Türkçe eğitimi
│   │   │   ├── TranslatePage.js      # Çeviri
│   │   │   ├── math/                 # Matematik alt sayfaları
│   │   │   ├── turkish/              # Türkçe alt sayfaları
│   │   │   ├── tools/                # Araçlar
│   │   │   ├── games/                # Oyun implementasyonları
│   │   │   └── NeuraVerse/           # Metaverse platformu
│   │   │
│   │   ├── components/
│   │   │   └── ui/           # shadcn/ui bileşenleri
│   │   │
│   │   ├── contexts/         # React Context (örn: FatigueContext)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Yardımcı fonksiyonlar
│   │   │   ├── okeyEngine.js # Okey oyun motoru
│   │   │   └── okeyAI.js     # Okey AI
│   │   └── lib/              # Kütüphane yapılandırmaları
│   │
│   └── public/               # Statik dosyalar
│
└── 🐍 Backend (Python Server)
    ├── server.py             # Ana Flask/FastAPI sunucusu
    ├── llm_router.py         # LLM yönlendirme (AI entegrasyonu)
    ├── consensus_engine.py   # AI konsensüs motoru
    ├── okey_game.py          # Okey oyun sunucusu
    ├── turkish_games.py      # Türkçe oyunlar
    ├── turkish_question_generator.py  # Soru üretici
    ├── word_validator.py     # Kelime doğrulayıcı
    ├── models.py             # Veri modelleri
    ├── database.py           # Veritabanı
    └── requirements.txt      # Python bağımlılıkları
```

---

## 🔍 Detaylı Açıklamalar

### 1. Ana Site (Root) - GitHub Pages Vitrini

**Amaç:** Hafif, hızlı yüklenen oyun vitrini

**Teknolojiler:**
- React 18
- Vite (build tool)
- React Router
- Vanilla CSS/JS oyunlar

**Özellikler:**
- 25+ oyun (JSX componentleri)
- Kategori bazlı organizasyon
- Responsive tasarım
- GitHub Pages için optimize

**Build:**
```bash
npm install
npm run build
# dist/ klasörü GitHub Pages'e deploy edilir
```

### 2. Frontend - Eğitim Platformu

**Amaç:** Kapsamlı eğitim, araç ve oyun platformu

**Teknolojiler:**
- Create React App
- shadcn/ui component library
- Tailwind CSS
- React Router v6
- Custom hooks ve contexts

**Özellikler:**
- **AI Özellikleri:**
  - Multi-AI karşılaştırma
  - Çeviri sistemi

- **Eğitim Modülleri:**
  - Matematik (DeepThink, Quick Practice, oyunlar)
  - Türkçe (Dilbilgisi, yazım kuralları, oyunlar)

- **Oyunlar:**
  - Matematik: Sudoku, Polinom Arena, Sayı Tahmin
  - Türkçe: Adam Asmaca, Kelime Zinciri, İsim-Şehir-Hayvan
  - Klasik: Tetris, Mayın Tarlası, Okey, Poker, Batak

- **Araçlar:**
  - Pomodoro Timer
  - Birim Dönüştürücü
  - 2D Grafik Çizimi
  - Çalar Saat & Kronometre
  - Ses Kaydedici
  - Hava Durumu
  - Mind Map
  - Spaced Repetition

- **NeuraVerse:**
  - Metaverse platformu (Minecraft benzeri)

**Build:**
```bash
cd frontend
npm install
npm start  # Development
npm run build  # Production
```

### 3. Backend - Python Sunucusu

**Amaç:** AI entegrasyonu, oyun sunucusu, API

**Teknolojiler:**
- Python 3.x
- Flask/FastAPI (muhtemelen)
- LLM entegrasyonu
- Veritabanı

**Özellikler:**
- LLM routing ve konsensüs
- Okey oyun sunucusu
- Türkçe oyun mantığı
- Soru üretimi
- Kelime doğrulama
- API endpoints

**Çalıştırma:**
```bash
cd backend
pip install -r requirements.txt
python server.py
```

---

## 🚀 Development Workflow

### Ana Site Geliştirme
```bash
# Root'ta çalış
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Build preview
```

### Frontend Platform Geliştirme
```bash
cd frontend
npm start         # CRA dev server
npm run build     # Production build
```

### Backend Geliştirme
```bash
cd backend
python server.py  # Sunucuyu başlat
```

### Full Stack Geliştirme
```bash
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && python server.py

# Terminal 3: Ana site (opsiyonel)
npm run dev
```

---

## 📦 Deployment

### GitHub Pages (Ana Site)
- Otomatik: `.github/workflows/deploy.yml`
- Manuel: `npm run build && git push`
- URL: `https://neuranaworld.github.io/NeuranaWorld/`

### Frontend Platform
- Vercel, Netlify veya benzeri servislere deploy edilebilir
- `frontend` klasörünü root olarak ayarla

### Backend
- Heroku, Railway, Render veya VPS
- `requirements.txt` kullanarak dependencies kur

---

## 🔧 Konfigürasyon Dosyaları

| Dosya | Amaç |
|-------|------|
| `vite.config.js` | Vite build ayarları |
| `package.json` (root) | Ana site dependencies |
| `frontend/package.json` | Frontend platform dependencies |
| `backend/requirements.txt` | Python dependencies |
| `.github/workflows/` | GitHub Actions CI/CD |
| `.gitignore` | Git ignore kuralları |
| `.nojekyll` | GitHub Pages Jekyll bypass |

---

## 📝 Notlar

### Neden İki Ayrı React App?

1. **Ana Site (Vite):**
   - Hafif, hızlı
   - Sadece oyun vitrini
   - GitHub Pages için optimize
   - Minimal dependencies

2. **Frontend (CRA):**
   - Kapsamlı platform
   - Çok sayıda özellik
   - shadcn/ui ve Tailwind
   - Daha kompleks state management

### Gelecek İyileştirmeler

- [ ] Monorepo yapısına geçiş (Turborepo, Nx)
- [ ] Shared components library
- [ ] Unified styling system
- [ ] Single deployment pipeline
- [ ] Docker containerization

---

## 🤝 Katkıda Bulunma

Her üç component için de ayrı ayrı katkıda bulunabilirsiniz:

- Ana site: Oyun ekleyin veya iyileştirin
- Frontend: Eğitim modülleri veya araçlar ekleyin
- Backend: API endpoints veya AI özellikleri geliştirin

---

## 📞 İletişim

Sorularınız için:
- GitHub Issues
- Email: [email protected]

---

**Son Güncelleme:** 2025-11-26
**Versiyon:** 2.0 (Temizlik sonrası)
