# 🔍 Dosya Kontrol Scriptleri

Bu klasörde 2 adet dosya kontrol scripti bulunur:

## 📁 check_files.bat (Windows)

### Kullanım:
```cmd
check_files.bat
```

Veya dosyaya çift tıklayın.

## 📁 check_files.sh (Linux/Mac)

### Kullanım:
```bash
chmod +x check_files.sh
./check_files.sh
```

## ✅ Ne Yapar?

Bu scriptler şunları kontrol eder:

1. ✅ **Ana HTML dosyası** (index.html)
2. ✅ **Dokümantasyon** (README.md, QUICKSTART.txt)
3. ✅ **JavaScript dosyaları** (9 adet)
4. ✅ **Texture dosyaları** (5 adet .jpg)
5. ✅ **Ses dosyaları** (3 adet .mp3)
6. ✅ **Konfigürasyon dosyaları** (4 adet .txt)

## 📊 Örnek Çıktı:

```
========================================
🔍 FARM DOMINION v2 - DOSYA KONTROLÜ
========================================

📁 ANA DOSYALAR
----------------
✅ index.html
✅ README.md
✅ QUICKSTART.txt

📁 JS KLASÖRÜ
-------------
✅ js/main.js
✅ js/world.js
✅ js/terrain.js
...

========================================
📊 SONUÇ
========================================
Toplam Dosya: 25
Eksik Dosya: 0

✅ TÜM DOSYALAR MEVCUT!
🎮 Oyunu başlatabilirsiniz!
```

## ❌ Eksik Dosya Varsa:

```
❌ js/main.js - EKSİK!
❌ assets/textures/grass.jpg - EKSİK!

========================================
📊 SONUÇ
========================================
Toplam Dosya: 25
Eksik Dosya: 2

❌ 2 DOSYA EKSİK!
⚠️  Lütfen eksik dosyaları tamamlayın.
```

## 🎯 Ne Zaman Kullanılır?

- ✅ Projeyi ilk indirdiğinizde
- ✅ Dosyaları kopyaladıktan sonra
- ✅ Git clone yaptıktan sonra
- ✅ Hata aldığınızda
- ✅ Oyun açılmadığında

## 💡 İpucu:

Eksik dosyalar varsa, farm-dominion-v2.zip dosyasını tekrar çıkartın veya eksik dosyaları manuel olarak kopyalayın.
