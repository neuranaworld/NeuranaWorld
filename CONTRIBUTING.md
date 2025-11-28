# 🤝 Katkıda Bulunma Rehberi

NeuranaWorld projesine katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, katkı sürecini kolaylaştırmak için hazırlanmıştır.

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Geliştirme Süreci](#geliştirme-süreci)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Kod Standartları](#kod-standartları)

## 🤗 Davranış Kuralları

Bu proje katılımcıların saygılı ve kapsayıcı bir ortamda çalışmasını sağlamayı amaçlar. Lütfen:
- Saygılı ve yapıcı olun
- Farklı bakış açılarına açık olun
- Geri bildirimleri nazikçe kabul edin ve verin

## 🎯 Nasıl Katkıda Bulunabilirim?

### Bug Bildirme
1. [Issues](https://github.com/neuranaworld/NeuranaWorld/issues) sayfasını kontrol edin
2. Benzer bir issue yoksa yeni bir issue açın
3. Aşağıdaki bilgileri ekleyin:
   - Bug açıklaması
   - Nasıl tekrar oluşturulur
   - Beklenen davranış
   - Ekran görüntüleri (varsa)
   - Tarayıcı/OS bilgisi

### Özellik Önerme
1. Issues sayfasında "Feature Request" etiketi ile yeni bir issue açın
2. Özelliği detaylı açıklayın
3. Varsa mockup/örnek ekleyin
4. Neden gerekli olduğunu açıklayın

### Kod Katkısı
1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi yapın
4. Test edin
5. Commit edin
6. Push edin
7. Pull Request açın

## 🔧 Geliştirme Süreci

### 1. Repository'yi Fork ve Clone Edin
```bash
git clone https://github.com/YOUR_USERNAME/NeuranaWorld.git
cd NeuranaWorld
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

### 4. Yeni Branch Oluşturun
```bash
git checkout -b feature/your-feature-name
# veya
git checkout -b fix/your-bug-fix
```

### 5. Değişikliklerinizi Yapın
- Kod yazarken stil rehberine uyun
- Yorum ekleyin (gerektiğinde)
- Değişikliklerinizi test edin

### 6. Build Kontrolü
```bash
npm run build
```

## 📝 Commit Mesajları

İyi commit mesajları yazmak için:

### Format
```
<emoji> <tip>: <kısa açıklama>

<detaylı açıklama (opsiyonel)>

<footer (opsiyonel)>
```

### Commit Tipleri
- `✨ feat`: Yeni özellik
- `🐛 fix`: Bug fix
- `📝 docs`: Dokümantasyon değişiklikleri
- `🎨 style`: Kod stilini etkileyen değişiklikler
- `♻️ refactor`: Ne bug fix ne de özellik eklemeyen kod değişikliği
- `⚡ perf`: Performans iyileştirmesi
- `✅ test`: Test ekleme veya düzeltme
- `🔧 chore`: Build, CI/CD ve diğer değişiklikler

### Örnekler
```bash
✨ feat: Yeni dark mode özelliği eklendi

Dark mode toggle butonu eklendi ve tüm bileşenler
dark mode'u destekleyecek şekilde güncellendi.

Closes #123
```

```bash
🐛 fix: Snake oyununda skor sayma hatası düzeltildi

Oyun bittiğinde skorun sıfırlanmaması sorunu çözüldü.
```

## 🔄 Pull Request Süreci

### 1. PR Oluşturmadan Önce
- [ ] Kodunuz çalışıyor mu?
- [ ] Build başarılı mı? (`npm run build`)
- [ ] Gereksiz console.log'lar kaldırıldı mı?
- [ ] Yeni özellikler için README güncellendi mi?
- [ ] Commit mesajları anlamlı mı?

### 2. PR Açıklaması
PR açıklamanız şunları içermeli:
- **Ne değişti?** - Yaptığınız değişikliklerin özeti
- **Neden?** - Bu değişikliğin amacı
- **Nasıl test edildi?** - Test senaryoları
- **Ekran görüntüleri** - UI değişiklikleri varsa

### 3. PR Şablonu
```markdown
## 📋 Değişiklik Özeti
<!-- Yaptığınız değişiklikleri kısaca açıklayın -->

## 🎯 Motivasyon ve Bağlam
<!-- Bu değişiklik neden gerekli? Hangi problemi çözüyor? -->
<!-- İlgili issue varsa: Closes #123 -->

## 🧪 Test Nasıl Yapıldı?
<!-- Test senaryolarınızı açıklayın -->
- [ ] Test 1
- [ ] Test 2

## 📸 Ekran Görüntüleri (varsa)
<!-- UI değişiklikleri varsa ekleyin -->

## ✅ Checklist
- [ ] Kod çalışıyor
- [ ] Build başarılı
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları anlamlı
```

## 💻 Kod Standartları

### JavaScript/React
```javascript
// ✅ İyi
const handleClick = () => {
  console.log('Clicked');
};

// ❌ Kötü
function handleClick(){
console.log('Clicked')
}
```

### Bileşen Yapısı
```jsx
// ✅ İyi
import React from 'react';

const MyComponent = ({ title, onClick }) => {
  return (
    <div className="my-component">
      <h1>{title}</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

export default MyComponent;
```

### Dosya İsimlendirme
- Component dosyaları: `PascalCase.jsx` (örn: `GameCard.jsx`)
- Utility dosyaları: `camelCase.js` (örn: `gameUtils.js`)
- Stil dosyaları: `kebab-case.css` (örn: `game-card.css`)

### CSS
```css
/* ✅ İyi */
.game-card {
  display: flex;
  padding: 1rem;
}

.game-card__title {
  font-size: 1.5rem;
}

/* ❌ Kötü */
.GameCard {
  display:flex;
  padding:1rem
}
```

## 🎮 Yeni Oyun Ekleme

### 1. Oyun Dosyasını Oluşturun
```
Oyunlar/[Kategori]/[OyunAdı].jsx
```

### 2. Oyun Bileşenini Yazın
```jsx
import React, { useState } from 'react';

const MyNewGame = () => {
  const [score, setScore] = useState(0);

  return (
    <div className="game-container">
      <h1>Oyun Adı</h1>
      <div className="score">Skor: {score}</div>
      {/* Oyun içeriği */}
    </div>
  );
};

export default MyNewGame;
```

### 3. App.jsx'e Ekleyin
Route ve navigasyon ekleyin.

### 4. Metadata Dosyası Oluşturun
```
Uygulamalar/[Kategori]/[OyunAdı].json
```

## 📚 Ek Kaynaklar

- [React Dokümantasyonu](https://react.dev)
- [Vite Dokümantasyonu](https://vitejs.dev)
- [JavaScript Style Guide](https://standardjs.com/)

## ❓ Sorularınız mı Var?

- 📧 Email: [email protected]
- 💬 GitHub Issues: [Soru sorun](https://github.com/neuranaworld/NeuranaWorld/issues)

## 🙏 Teşekkürler!

Katkılarınız için çok teşekkürler! Her katkı, NeuranaWorld'ü daha iyi hale getiriyor.

---

Made with ❤️ by NeuranaWorld Community
