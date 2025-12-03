# 🎮 FARM DOMINION v2.1 - DETAYLI KURULUM REHBERİ

## 📋 İÇİNDEKİLER
1. Sistem Gereksinimleri
2. Adım Adım Kurulum
3. Web Sunucusu Kurulumu (3 Yöntem)
4. Oyunu Başlatma
5. Sorun Giderme
6. Video Anlatım (Adımlar)

---

## 💻 SİSTEM GEREKSİNİMLERİ

### Minimum:
- İşletim Sistemi: Windows 7/8/10/11, macOS, Linux
- RAM: 4 GB
- Ekran Kartı: Intel HD Graphics 4000 veya üzeri
- Tarayıcı: Chrome 90+, Firefox 88+, Edge 90+
- Depolama: 500 MB boş alan

### Önerilen:
- RAM: 8 GB
- Ekran Kartı: NVIDIA GTX 1050 veya AMD RX 560
- Tarayıcı: Chrome (en güncel)
- İnternet: Sadece ilk yükleme için

---

## 🚀 ADIM ADIM KURULUM

### ADIM 1: DOSYALARI İNDİR

1. farm-dominion-v2.1-ULTIMATE.zip dosyasını indir
2. Masaüstünde yeni bir klasör oluştur:
   - Klasör adı: FarmDominion
   - Konum: C:\Users\[KullanıcıAdın]\Desktop\FarmDominion

3. ZIP dosyasını bu klasöre çıkart
   - ZIP'e sağ tıkla
   - "Tümünü ayıkla" veya "Extract all"
   - Hedef: C:\Users\[KullanıcıAdın]\Desktop\FarmDominion

### ADIM 2: DOSYA YAPISI KONTROLÜ

Klasör içinde şunlar olmalı:
```
FarmDominion/
├── index.html          ✅ Ana oyun dosyası
├── js/                 ✅ JavaScript dosyaları (20 adet)
├── assets/             ✅ Texture ve ses dosyaları
├── biomlar/            ✅ Biom verileri (13 dosya)
├── README.md           ✅ Dokümantasyon
└── ... (diğer dosyalar)
```

Eğer tüm dosyalar başka bir klasörün içindeyse:
- O klasördeki tüm dosyaları kes (Ctrl+X)
- Bir üst klasöre yapıştır (Ctrl+V)

---

## 🌐 WEB SUNUCUSU KURULUMU

Oyun web teknolojileri kullandığı için bir web sunucusuna ihtiyaç var.
3 kolay yöntem sunuyorum:

---

### YÖNTEM 1: PYTHON (EN KOLAY - ÖNERİLEN) ⭐

#### Python Kurulu mu Kontrol Et:

1. **Windows Tuşu + R** bas
2. `cmd` yaz ve Enter
3. Açılan siyah pencerede şunu yaz:
```cmd
python --version
```

#### Eğer Python VARSA:
- "Python 3.x.x" gibi bir şey görürsün ✅
- ADIM 2.1'e geç

#### Eğer Python YOKSA:
- "python is not recognized" hatası görürsün ❌
- Python'u yükle (aşağıda)

---

#### Python Kurulumu (Eğer Yoksa):

1. https://www.python.org/downloads/ adresine git
2. Sarı **"Download Python"** butonuna tıkla
3. İndirilen dosyayı çalıştır
4. **ÇOK ÖNEMLİ**: ✅ "Add Python to PATH" kutucuğunu işaretle!
5. **"Install Now"** tıkla
6. Kurulum bitince **"Close"** tıkla

7. Kurulum tamamlandı mı kontrol et:
   - Yeni bir CMD aç (öncekini kapat)
   - `python --version` yaz
   - Versiyon görmeli sin

---

#### ADIM 2.1: Oyun Klasörüne Git

1. **Windows Tuşu + R** bas
2. `cmd` yaz, Enter
3. Şu komutları SIRAYLA yaz:

```cmd
cd Desktop\FarmDominion
```

Eğer hata verirse, tam yolu kullan:
```cmd
cd C:\Users\[KullanıcıAdın]\Desktop\FarmDominion
```

NOT: [KullanıcıAdın] yerine kendi kullanıcı adını yaz!
Örnek: `cd C:\Users\Ahmet\Desktop\FarmDominion`

#### ADIM 2.2: Sunucuyu Başlat

```cmd
python -m http.server 8000
```

Şunu görmelisin:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

✅ BAŞARILI! Sunucu çalışıyor!

#### ADIM 2.3: Oyunu Aç

1. Chrome veya Firefox tarayıcısını aç
2. Adres çubuğuna yaz:
```
http://localhost:8000
```
3. Enter bas
4. Oyun yükleniyor... 🎮

---

### YÖNTEM 2: NODE.JS (HIZLI)

#### Node.js Kurulu mu Kontrol:

CMD'de:
```cmd
node --version
```

#### Eğer Node YOKSA:

1. https://nodejs.org/ adresine git
2. **LTS** versiyonunu indir (yeşil buton)
3. Kurulumu yap (varsayılan ayarlar tamam)
4. Yeni CMD aç

#### ADIM 2.1: Sunucuyu Kur

```cmd
cd Desktop\FarmDominion
npm install -g http-server
```

#### ADIM 2.2: Sunucuyu Başlat

```cmd
http-server -p 8000
```

#### ADIM 2.3: Oyunu Aç

```
http://localhost:8000
```

---

### YÖNTEM 3: XAMPP (TAM SUNUCU)

#### XAMPP Kurulumu:

1. https://www.apachefriends.org/ adresine git
2. Windows için indir
3. Kurulumu yap (C:\xampp önerilen)

#### ADIM 2.1: Dosyaları Kopyala

1. FarmDominion klasörünü kes
2. Şuraya yapıştır: `C:\xampp\htdocs\`
3. Yol olmalı: `C:\xampp\htdocs\FarmDominion\`

#### ADIM 2.2: XAMPP'ı Başlat

1. XAMPP Control Panel'i aç (Başlat menüsünden)
2. **Apache** yanındaki **Start** butonuna tıkla
3. Yeşil olmalı

#### ADIM 2.3: Oyunu Aç

```
http://localhost/FarmDominion/
```

---

## 🎮 OYUNU BAŞLATMA

### İlk Açılış:

1. Tarayıcıda `http://localhost:8000` aç

2. **YÜ KLEME EKRANI** görünür:
   ```
   🌾 Farm Dominion v2.1
   Massive World Edition - 6.8 Milyon m²
   
   🔄 Harita Oluşturuluyor...
   [Progress Bar: 0%]
   ```

3. **BEKLEYİN**:
   - İlk yükleme 10-30 saniye sürebilir
   - Progress bar %100 olana kadar BEKLE!
   - Sayfa donmuş gibi görünebilir (NORMAL!)

4. **YÜKLEME TAMAMLANDI**:
   ```
   ✅ Tamamlandı!
   Oyun hazır
   ```

5. **ANA MENÜ**:
   ```
   🌾 FARM DOMINION v2.1
   [Oyuna Başla] butonu görünür
   ```

6. **"OYUNA BAŞLA"** tıkla

7. **EKRANA TIKLA**:
   - Oyun ekranının ortasına tıkla
   - Fare kilidi aktif olur
   - Oyun başlar! 🎮

---

## 🕹️ İLK OYUN KONTROL

### İlk Saniyeler:
```
1. Ekranın ortasına tıkla
2. Fareyi hareket ettir → Kamera döner
3. W tuşuna bas → İlerle
4. Oyun başladı! 🎉
```

### Kontroller:
```
W A S D     → Hareket
Shift       → Koş (2x hız)
Space       → Zıpla
Fare        → Kamera
ESC         → ⚙️ AYARLAR MENÜSÜ
G           → Gölge aç/kapat
M           → Ses aç/kapat
P           → Performans
Tab         → Mini harita
1-5         → Hava durumu
```

### İlk Yapılacaklar:
```
1. ESC → Ayarlar menüsünü aç
2. Grafik → Kaliteyi PC'ne göre ayarla
3. Ses → Seviyeyi ayarla
4. UI → İstediğin elemanları aç/kapat
5. ESC → Menüyü kapat
6. Keşfe çık! 🌍
```

---

## 🔧 SORUN GİDERME

### ❌ Problem: "Bu site açılamıyor" / "Bağlantı reddedildi"

**Çözüm:**
1. Sunucu çalışıyor mu kontrol et:
   - CMD penceresi açık olmalı
   - "Serving..." yazısı görünmeli
   
2. Doğru adresi yazdın mı:
   ```
   ✅ http://localhost:8000
   ❌ www.localhost:8000 (YANLIŞ!)
   ❌ https://localhost:8000 (YANLIŞ!)
   ❌ localhost:8000 (YANLIŞ!)
   ```

3. Port kullanımda mı:
   - Başka bir şey 8000 portunu kullanıyor olabilir
   - Farklı port dene:
   ```cmd
   python -m http.server 8080
   ```
   - Tarayıcıda: `http://localhost:8080`

---

### ❌ Problem: Siyah ekran / Beyaz sayfa

**Çözüm:**
1. F12 bas (Geliştirici Konsolu)
2. "Console" sekmesine bak
3. Kırmızı hatalar varsa ekran görüntüsü al
4. Hataları oku

Muhtemel sebepler:
- Dosyalar eksik
- Yanlış klasördesin
- Tarayıcı eski

**Tarayıcı Kontrolü:**
- Chrome: Ayarlar → Hakkında → Güncelle
- Firefox: Menü → Yardım → Firefox Hakkında

---

### ❌ Problem: Çok yavaş / Donuyor

**Çözüm:**
1. ESC → Ayarlar
2. Grafik Ayarları:
   - Kalite → **Düşük**
   - Gölgeleri **KAPAT** (G tuşu)
3. UI Ayarları:
   - Performans monitörünü **AÇ** (P tuşu)
   - Gereksiz UI'ları kapat

4. Tarayıcı ayarları:
   - Chrome: chrome://flags
   - "Hardware acceleration" AÇIK olmalı

5. PC Ayarları:
   - Diğer programları kapat
   - Windows Güç Seçenekleri → Yüksek Performans

---

### ❌ Problem: Yükleme %50'de takılı kalıyor

**Çözüm:**
1. **BEKLE**: İlk yükleme 30-60 saniye sürebilir
2. Konsolu kontrol et (F12 → Console)
3. Ağ bağlantısı varsa:
   - F5 ile sayfayı yenile
4. Tarayıcı önbelleğini temizle:
   - Chrome: Ctrl+Shift+Delete
   - Son 1 saat verileri temizle
   - Sayfayı yenile

---

### ❌ Problem: CMD'de "python is not recognized"

**Çözüm:**
1. Python'u tekrar kur
2. **"Add to PATH"** kutucuğunu işaretle!
3. Bilgisayarı yeniden başlat
4. Yeni CMD aç ve tekrar dene

---

### ❌ Problem: Ses çalışmıyor

**Çözüm:**
1. M tuşuna bas (ses açık olmalı)
2. ESC → Ses Ayarları
   - Ana Ses → Açık
   - Seviyeyi yükselt
3. Tarayıcı ses ayarları:
   - Sağ üst köşe → Site ayarları
   - Ses → İzin ver
4. Windows ses:
   - Ses simgesi → Karışık uygulamalar
   - Chrome → Sessize alınmış olabilir

---

### ❌ Problem: Fareyle kamera dönmüyor

**Çözüm:**
1. Ekrana tıkladın mı?
   - Ortaya tıkla
   - "Pointer lock" aktif olmalı
2. ESC ile kilidi kaldır
3. Tekrar ekrana tıkla

---

## 📹 VİDEO GİBİ ADIMLAR

### 1️⃣ HAZIRLIK (1 dakika)
```
1. ZIP'i masaüstüne çıkart
2. FarmDominion klasörü oluştur
3. Python kurulu mu kontrol et
```

### 2️⃣ SUNUCU (30 saniye)
```
1. CMD aç (Win+R → cmd)
2. cd Desktop\FarmDominion
3. python -m http.server 8000
4. "Serving..." görmelisin
```

### 3️⃣ OYUN (10 saniye)
```
1. Chrome aç
2. localhost:8000 yaz
3. Yüklenmesini bekle
4. Oyuna Başla!
```

### 4️⃣ İLK OTURUM (1 dakika)
```
1. Ekrana tıkla
2. ESC → Ayarları düzenle
3. W ile yürü
4. Dünyayı keşfet! 🌍
```

---

## 💡 İPUÇLARI

### Performans için:
- ✅ Oyun açıkken diğer programları kapat
- ✅ Chrome'u kullan (en iyi performans)
- ✅ İlk açılışta sabırlı ol (chunk yükleniyor)
- ✅ Grafik kalitesini ayarla

### İlk oyunda:
- ✅ ESC menüsünü keşfet
- ✅ Kontrolleri öğren
- ✅ Mini haritayı kullan (Tab)
- ✅ Farklı biomlara git

### Sunucu için:
- ✅ CMD penceresini KAPATMA (sunucu durur)
- ✅ Oyun bittikten sonra Ctrl+C ile kapat
- ✅ Her oynayışta sunucuyu başlat

---

## 🆘 HIZLI YARDIM

### En Hızlı Başlangıç (1-2-3):
```
1. ZIP çıkart
2. CMD → cd Desktop\FarmDominion → python -m http.server 8000
3. Chrome → localhost:8000
```

### CMD Komutları Özet:
```cmd
# Klasöre git
cd Desktop\FarmDominion

# Sunucu başlat
python -m http.server 8000

# Sunucu durdur
Ctrl + C

# CMD'yi kapat
exit
```

### Tarayıcı Kısayolları:
```
F5              → Sayfayı yenile
F11             → Tam ekran
F12             → Konsol (hata kontrolü)
Ctrl+Shift+Del  → Önbelleği temizle
```

---

## 📞 DESTEK

### Hata Alıyorsan:
1. F12 bas → Console sekmesi
2. Kırmızı hataların ekran görüntüsünü al
3. CMD penceresinin ekran görüntüsünü al
4. Hangi adımda takıldığını not et

### Sık Sorulan:
- **S: Python kurulu ama bulamıyor?**
  - C: PATH'e eklenmemiş, tekrar kur

- **S: 8000 portu kullanımda?**
  - C: 8080 veya 3000 portunu dene

- **S: Yükleme çok uzun sürüyor?**
  - C: İlk yükleme 30-60 sn, BEKLE

- **S: Oyun çok yavaş?**
  - C: ESC → Grafik → Düşük kalite

---

## ✅ KONTROL LİSTESİ

Son kontrollar:
- [ ] ZIP çıkartıldı
- [ ] Dosya yapısı doğru
- [ ] Python kurulu ve PATH'de
- [ ] CMD ile klasöre gidildi
- [ ] Sunucu başlatıldı
- [ ] "Serving..." yazısı görünüyor
- [ ] Tarayıcıda localhost:8000 açık
- [ ] Yükleme %100 tamamlandı
- [ ] Oyuna Başla butonuna tıklandı
- [ ] Ekrana tıklandı
- [ ] Kontroller çalışıyor

Hepsi ✅ ise → OYUN ÇALIŞIYOR! 🎉

---

**🎮 İyi Oyunlar! Herhangi bir sorun olursa bu rehbere tekrar bak!**

Son güncelleme: v2.1 Ultimate
