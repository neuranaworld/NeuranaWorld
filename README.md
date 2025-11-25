# 🧠 NeuranaWorld - Oyunlar ve Uygulamalar Platformu

Modern, responsive ve kullanıcı dostu oyun/uygulama vitrin sitesi.

## 📁 Proje Yapısı

```
NeuranaWorld123/
├── index.html          # Ana sayfa
├── style.css           # Tasarım dosyası
├── app.js              # JavaScript dosyası
├── README.md           # Bu dosya
├── setup.bat           # Windows kurulum scripti
│
├── Oyunlar/
│   ├── Aksiyon/
│   │   └── kartoyunlari.txt
│   ├── Bulmaca/
│   │   └── zihingelistirme.txt
│   ├── Strateji/
│   │   ├── neuranamatch.txt
│   │   └── farming.txt
│   └── Macera/
│       └── mineworld.txt
│
└── Uygulamalar/
    ├── Egitim/
    │   └── turkce.txt
    └── Sosyal/
        └── neuranaverse.txt
```

## 🚀 Hızlı Başlangıç

### Windows Kullanıcıları için:
1. `setup.bat` dosyasını çift tıklayın
2. Klasör yapısı otomatik oluşacak
3. `index.html` dosyasını tarayıcıda açın

### Manuel Kurulum:
```bash
# Projeyi indirin
git clone <repo-url>

# Klasöre girin
cd NeuranaWorld123

# index.html'i tarayıcıda açın
```

## 🌐 GitHub Pages'te Yayınlama

1. GitHub'da yeni repository oluşturun
2. Dosyaları yükleyin:
```bash
git init
git add .
git commit -m "İlk commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

3. Repository Settings → Pages:
   - Source: `main` branch seçin
   - Folder: `/ (root)` seçin
   - Save'e tıklayın

4. Siteniz hazır! URL: `https://<kullaniciadi>.github.io/<repo-adi>/`

## ✨ Özellikler

- ✅ Responsive tasarım (Mobil, Tablet, Desktop)
- ✅ Modern ve renkli arayüz
- ✅ Dinamik içerik yükleme
- ✅ Modal popup sistemi
- ✅ Smooth scroll animasyonları
- ✅ TXT dosyalarından içerik okuma
- ✅ GitHub Pages hazır

## 🎮 Oyunlar

1. **Kart Oyunları** (Aksiyon) - Klasik ve modern kart oyunları
2. **Zihin Geliştirme** (Bulmaca) - Beyin jimnastiği oyunları
3. **NeuranaMatch+** (Strateji) - Eşleştirme ve strateji
4. **Mineworld** (Macera) - Sandbox inşaat oyunu
5. **Farming** (Strateji) - Çiftlik yönetimi

## 💻 Uygulamalar

1. **Türkçe** (Eğitim) - Türkçe öğrenme platformu
2. **Neuranaverse** (Sosyal) - Metaverse sosyal platform

## 📝 İçerik Güncelleme

TXT dosyalarını düzenleyerek içerikleri kolayca güncelleyebilirsiniz:

```
Oyunlar/Aksiyon/kartoyunlari.txt
```

Değişiklikler otomatik olarak sitede görünecektir!

## 🎨 Renk Paleti

- Primary: `#667eea` (Mor)
- Secondary: `#764ba2` (Koyu Mor)
- Background: Gradient (Mor → Koyu Mor)
- Cards: Gradient (Açık Gri → Mavi Gri)

## 🛠️ Teknolojiler

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Font: Segoe UI

## 📱 Tarayıcı Desteği

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Opera ✅

## 🔧 Özelleştirme

### Yeni Oyun/Uygulama Ekleme:

1. İlgili klasöre `.txt` dosyası ekleyin
2. `app.js` içinde `oyunlar` veya `uygulamalar` dizisine ekleyin:

```javascript
{
    id: 'oyunid',
    name: 'Oyun Adı',
    icon: '🎮',
    category: 'Kategori',
    path: 'Oyunlar/Kategori/dosya.txt',
    shortDesc: 'Kısa açıklama'
}
```

### Renkleri Değiştirme:

`style.css` dosyasında gradient renklerini değiştirin:

```css
background: linear-gradient(135deg, #RENK1 0%, #RENK2 100%);
```

## 📞 Destek

Sorularınız için:
- GitHub Issues açın
- README'yi kontrol edin

## 📄 Lisans

Bu proje kişisel kullanım içindir.

## 🎉 Teşekkürler!

NeuranaWorld'ü kullandığınız için teşekkürler!

---

**NeuranaWorld** - Oyunlar ve Uygulamalar Dünyası 🧠
