# 🎯 Survival Game

**Multiplayer Game Platform** - Python Backend + React Frontend

## 📋 Genel Bakış

Survival Game, oyun backend servisleri ve LLM entegrasyonları içeren bir platform projesidir. Backend'de çeşitli oyun mekanikleri, AI router'lar ve Türkçe eğitim oyunları bulunmaktadır.

## 🎮 Özellikler

### Backend Servisleri
- 🎲 **Okey Oyunu** - Multiplayer Okey game logic
- 🇹🇷 **Türkçe Oyunlar** - Turkish educational games
- 🤖 **LLM Router** - AI model routing and consensus
- 📊 **Database** - Game state management
- 🎯 **Consensus Engine** - Multi-AI consensus system
- 📝 **Word Validator** - Turkish word validation
- 🧪 **Question Generator** - Turkish question generation

### Frontend
- React-based UI
- Tailwind CSS styling
- CRACO configuration
- Component library integration

## 🛠️ Teknolojiler

### Backend
- **Python** - Core backend language
- **Web Framework** - FastAPI/Flask
- **SQLAlchemy** - ORM
- **AI/LLM Integration** - Multi-provider support
- **Game Logic** - Custom game engines

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **CRACO** - Configuration override
- **shadcn/ui** - Component library

## 📁 Proje Yapısı

```
survival/
├── backend/
│   ├── server.py                       # Ana server
│   ├── okey_game.py                    # Okey oyun mantığı
│   ├── turkish_games.py                # Türkçe oyunlar
│   ├── llm_router.py                   # AI model router
│   ├── consensus_engine.py             # Multi-AI consensus
│   ├── turkish_question_generator.py   # Soru üretici
│   ├── word_validator.py               # Kelime doğrulayıcı
│   ├── models.py                       # Database models
│   ├── database.py                     # DB configuration
│   └── requirements.txt                # Python dependencies
│
├── frontend/
│   ├── README.md                       # Frontend guide
│   ├── package.json                    # Dependencies
│   ├── craco.config.js                 # CRACO config
│   ├── tailwind.config.js              # Tailwind config
│   └── components.json                 # Component config
│
└── test_result.md                      # Testing protocol
```

## 🚀 Kurulum ve Çalıştırma

### Backend

```bash
# Backend klasörüne girin
cd apps/survival/backend

# Virtual environment oluşturun (önerilen)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate     # Windows

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Server'ı başlatın
python server.py
```

### Frontend

```bash
# Frontend klasörüne girin
cd apps/survival/frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start

# Build oluşturun
npm run build
```

## 🎮 Oyun Modülleri

### Okey Oyunu
- Multiplayer destekli
- Türk Okey kuralları
- Gerçek zamanlı oyun durumu
- Skor hesaplama

### Türkçe Eğitim Oyunları
- Kelime oyunları
- Gramer testleri
- Soru-cevap sistemi
- Kelime doğrulama

### LLM Router
- Çoklu AI model desteği
- Akıllı model seçimi
- Consensus engine
- Yanıt optimizasyonu

## 📦 Backend Bağımlılıkları

Backend `requirements.txt` dosyasından yüklenebilir. Temel bağımlılıklar:
- Web framework (FastAPI/Flask)
- SQLAlchemy - ORM
- AI SDK'ları (OpenAI, Anthropic, vb.)
- Game logic libraries
- Database drivers

## 🧪 Test Protokolü

Proje, `test_result.md` dosyasını kullanarak sistematik test yönetimi sağlar:
- Task tracking
- Test sonuçları
- Agent iletişimi
- Stuck task yönetimi

Detaylı test protokolü için `test_result.md` dosyasına bakın.

## 🔧 Yapılandırma

### Environment Variables
Backend için gerekli environment variable'ları `.env` dosyasında:
```bash
DATABASE_URL=...
OPENAI_API_KEY=...
# Diğer API keys
```

### Frontend Config
- `craco.config.js` - Webpack override
- `tailwind.config.js` - Tailwind özelleştirme
- `components.json` - shadcn/ui config

## 🎯 Geliştirme Durumu

Bu proje aktif geliştirme aşamasındadır. Test sonuçları ve görev durumları `test_result.md` dosyasında takip edilmektedir.

## 🤝 Katkıda Bulunma

Ana projenin katkı rehberini takip edin: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 Lisans

Bu proje ana NeuranaWorld projesi ile aynı lisansa sahiptir.

## 🔗 Bağlantılar

- [Ana Proje](../../README.md)
- [NeuranaWorld GitHub](https://github.com/neuranaworld/NeuranaWorld)
- [Frontend README](frontend/README.md)

---

**© 2024 NeuranaWorld Team**
