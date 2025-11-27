# 🪟 NeuranaWorld - Windows Masaüstü Kurulum Rehberi

Bu rehber, NeuranaWorld'ü Windows masaüstünde çalıştırmak için hazırlanmıştır.

## 📍 Proje Konumu

Proje masaüstünüzde: `C:\Users\[KullanıcıAdı]\Desktop\NeuranaWorld`

## 🚀 En Hızlı Başlatma (ÖNERİLEN)

1. **Masaüstünde** `NeuranaWorld` klasörüne çift tıklayın
2. `start_neuranaworld.bat` dosyasına **çift tıklayın**
3. İki pencere açılacak:
   - ✅ Frontend (React): `http://localhost:5173`
   - ✅ Backend (FastAPI): `http://localhost:8000`

**Hepsi bu kadar!** 🎉

## 📝 Manuel Başlatma

### Seçenek 1: Komut İstemi (CMD)

#### Frontend:
```cmd
cd %USERPROFILE%\Desktop\NeuranaWorld
npm run dev
```

#### Backend (Yeni CMD penceresi):
```cmd
cd %USERPROFILE%\Desktop\NeuranaWorld\backend
start_server.bat
```

### Seçenek 2: PowerShell

#### Frontend:
```powershell
cd $env:USERPROFILE\Desktop\NeuranaWorld
npm run dev
```

#### Backend (Yeni PowerShell penceresi):
```powershell
cd $env:USERPROFILE\Desktop\NeuranaWorld\backend
.\start_server.bat
```

## 🔧 İlk Kurulum (Sadece Bir Kez)

### 1. Node.js Kontrolü
```cmd
node --version
npm --version
```

**Eğer yüklü değilse:** [Node.js İndir](https://nodejs.org/)

### 2. Python Kontrolü (Backend için)
```cmd
python --version
```

**Eğer yüklü değilse:** [Python İndir](https://www.python.org/downloads/)

### 3. Bağımlılıkları Yükle

#### Frontend:
```cmd
cd %USERPROFILE%\Desktop\NeuranaWorld
npm install
```

#### Backend:
```cmd
cd %USERPROFILE%\Desktop\NeuranaWorld\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 🌐 Tarayıcıda Açma

Başlatma sonrası:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Dokümantasyonu**: http://localhost:8000/docs

## 🎮 Özellikler

- 🌙 **Dark Theme Toggle**: Sağ üstteki ay/güneş ikonuna tıklayın
- 🔍 **Arama**: Oyun veya uygulama adını yazın
- 📱 **Responsive**: Tarayıcı penceresini küçültün, mobil görünümü görün
- 🎨 **Filtreler**: Aksiyon, Bulmaca, Strateji, Macera

## 🛑 Durdurma

### Kolay Yol:
- CMD pencerelerini kapatın (❌)

### Klavye ile:
- Her pencerede `Ctrl + C` tuşlarına basın
- "Toplu işlemi sonlandırmak istiyor musunuz?" → `E` (Evet)

## ❗ Sorun Giderme

### "npm bulunamadı" hatası:
1. Node.js'i yükleyin: https://nodejs.org/
2. Bilgisayarı yeniden başlatın
3. Tekrar deneyin

### "python bulunamadı" hatası:
1. Python'u yükleyin: https://www.python.org/downloads/
2. Kurulumda **"Add Python to PATH"** kutucuğunu işaretleyin
3. Bilgisayarı yeniden başlatın

### Port 5173 veya 8000 kullanımda:
```cmd
# Çalışan işlemi bul ve kapat
netstat -ano | findstr :5173
netstat -ano | findstr :8000
```

### Backend .env dosyası:
```cmd
cd %USERPROFILE%\Desktop\NeuranaWorld\backend
notepad .env
```

API anahtarlarınızı buraya girin (opsiyonel).

## 📁 Klasör Yapısı

```
NeuranaWorld/
├── 📄 start_neuranaworld.bat    # 🚀 Hızlı başlatma scripti
├── 📁 src/                       # Frontend kaynak kodları
│   ├── components/              # UI bileşenleri
│   ├── pages/                   # Sayfalar
│   └── styles/                  # CSS dosyaları
├── 📁 backend/                   # Backend servisi
│   ├── server.py               # Ana server
│   ├── start_server.bat        # Backend başlatıcı
│   └── .env                    # Yapılandırma
├── 📁 Oyunlar/                   # Oyun dosyaları (25 oyun)
└── 📁 docs/                      # Dokümantasyon
```

## 🔗 Linkler

- 🌐 **Live Demo**: https://neuranaworld.github.io/NeuranaWorld/
- 📚 **Dokümantasyon**: [docs/README.md](docs/README.md)
- 🐛 **Bug Bildirimi**: [GitHub Issues](https://github.com/neuranaworld/NeuranaWorld/issues)

## 💡 İpuçları

### Masaüstü Kısayolu Oluşturma:

1. `start_neuranaworld.bat` dosyasına **sağ tıklayın**
2. **"Kısayol oluştur"** seçin
3. Kısayolu masaüstüne taşıyın
4. İkona sağ tıklayıp **"Özellikleri"** açın
5. **"Simgeyi Değiştir"** → 🧠 emojisine en yakın ikonu seçin

### Otomatik Tarayıcıda Açma:

`start_neuranaworld.bat` dosyasına şunu ekleyin:
```batch
timeout /t 5 /nobreak > nul
start http://localhost:5173
```

## 📞 Yardım

Sorun mu yaşıyorsunuz?

1. ✅ Node.js ve Python yüklü mü kontrol edin
2. ✅ `npm install` çalıştırdınız mı?
3. ✅ Doğru klasörde misiniz?
4. ✅ Port'lar boş mu?

Hala sorun varsa: [Issue açın](https://github.com/neuranaworld/NeuranaWorld/issues)

---

<div align="center">

**🧠 NeuranaWorld** - Made with ❤️ for Windows

Keyifli oyunlar! 🎮

</div>
