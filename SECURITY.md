# 🔐 Güvenlik Politikası (Security Policy)

## 🛡️ Güvenlik Taahhüdümüz

NeuranaWorld projesi olarak kullanıcılarımızın ve katkıda bulunanların güvenliğini ciddiye alıyoruz. Bu belge, güvenlik açıklarını bildirme ve ele alma sürecimizi açıklamaktadır.

## 📋 Desteklenen Versiyonlar

Şu anda aşağıdaki versiyonlar güvenlik güncellemeleri almaktadır:

| Versiyon | Destekleniyor |
| ------- | ------------- |
| 1.0.x   | ✅            |
| < 1.0   | ❌            |

## 🔍 Güvenlik Açığı Bildirme

### Acil Güvenlik Sorunları

Eğer kritik bir güvenlik açığı keşfettiyseniz, lütfen **HEMEN** aşağıdaki adımları takip edin:

1. **🚨 ASLA public issue AÇMAYIN** - Bu, kötü niyetli kullanıcıların açığı istismar etmesine neden olabilir
2. **📧 E-posta gönderin**: [email protected]
3. **🔒 Şifreleme**: Hassas bilgiler için PGP kullanabilirsiniz (isteğe bağlı)

### Bildirinizde Yer Alması Gerekenler

Güvenlik açığını anlamızda ve düzeltmemizde bize yardımcı olmak için lütfen aşağıdaki bilgileri ekleyin:

* **Açıklama**: Güvenlik açığının detaylı açıklaması
* **Etki**: Olası etkisi ve risk seviyesi
* **Konum**: Etkilenen dosya/kod konumu
* **Yeniden Üretme**: Adım adım nasıl yeniden üretileceği
* **Çözüm Önerisi**: Varsa önerilen çözüm
* **PoC (Proof of Concept)**: Güvenli bir demonstrasyon (isteğe bağlı)

### Bildirim Örneği

```markdown
## Güvenlik Açığı Raporu

**Özet**: XSS açığı oyun arama fonksiyonunda

**Detay**: Kullanıcı girişi sanitize edilmeden DOM'a ekleniyor

**Konum**: src/components/SearchBar.jsx, satır 42

**Yeniden Üretme**:
1. Arama kutusuna `<script>alert('XSS')</script>` girin
2. Script çalışır

**Etki**: Yüksek - Kullanıcı bilgileri çalınabilir

**Önerilen Çözüm**: DOMPurify veya benzer bir library kullanın
```

## ⏱️ Yanıt Süreci ve Zaman Çizelgesi

Güvenlik açığınızı bildirdiğinizde, aşağıdaki süreci takip ediyoruz:

| Adım | Süre | Açıklama |
|------|------|----------|
| **İlk Yanıt** | 48 saat | Bildiriminizi aldığımızı teyit ederiz |
| **İlk Değerlendirme** | 5 gün | Güvenlik açığını değerlendirir ve öncelik belirleriz |
| **Düzeltme Planı** | 7 gün | Düzeltme planı ve tahmini süre paylaşırız |
| **Düzeltme** | 30 gün | Kritik açıklar için (ciddiyet bağlı olarak değişir) |
| **Açıklama** | +7 gün | Düzeltme yayınlandıktan sonra detaylar paylaşılır |

### Öncelik Seviyeleri

* 🔴 **Kritik**: 7 gün içinde düzeltilir
* 🟠 **Yüksek**: 14 gün içinde düzeltilir
* 🟡 **Orta**: 30 gün içinde düzeltilir
* 🟢 **Düşük**: 60 gün içinde düzeltilir

## 🎯 Güvenlik Açığı Kapsamı

### Kapsam İçinde ✅

Aşağıdaki güvenlik açıkları bildirilebilir:

* **XSS (Cross-Site Scripting)**: Stored, Reflected, DOM-based
* **CSRF (Cross-Site Request Forgery)**: Yetkisiz işlemler
* **Authentication Bypass**: Kimlik doğrulama atlatma
* **Authorization Issues**: Yetkilendirme sorunları
* **SQL Injection**: Veritabanı enjeksiyonları
* **Code Injection**: Kod enjeksiyonu açıkları
* **Path Traversal**: Dosya sistemi erişim sorunları
* **Sensitive Data Exposure**: Hassas veri sızıntıları
* **Broken Access Control**: Erişim kontrolü sorunları
* **Security Misconfiguration**: Güvenlik yapılandırma hataları
* **Cryptographic Failures**: Şifreleme sorunları
* **SSRF (Server-Side Request Forgery)**: Sunucu taraflı istek sahteciliği

### Kapsam Dışında ❌

Aşağıdaki durumlar güvenlik açığı olarak kabul edilmez:

* **Social Engineering**: Sosyal mühendislik saldırıları
* **DoS/DDoS**: Hizmet reddi saldırıları (rate limiting hariç)
* **Spam**: Spam veya içerik sorunları
* **Physical Access**: Fiziksel erişim gerektiren saldırılar
* **Outdated Browser Issues**: Eski tarayıcı sorunları
* **Self-XSS**: Kullanıcının kendi kendine XSS yapması
* **Missing Best Practices**: Güvenlik açığı oluşturmayan eksik pratikler
* **Theoretical Vulnerabilities**: Pratik etkisi olmayan teorik açıklar
* **3rd Party Issues**: Üçüncü taraf library sorunları (onlara bildirin)

## 🏆 Güvenlik Hall of Fame

Güvenlik açığı bildiren ve projeyi daha güvenli hale getiren katkıda bulunanlara teşekkür ederiz:

<!-- Güvenlik açığı bildirenler burada listelenecek -->
* *İlk güvenlik açığı bildireni siz olun!*

## 🔧 Güvenlik En İyi Pratikleri

### Geliştiriciler İçin

Kod katkısında bulunurken aşağıdaki güvenlik pratiklerini takip edin:

#### Input Validation
```javascript
// ❌ Kötü
const userInput = req.body.name;
db.query(`SELECT * FROM users WHERE name = '${userInput}'`);

// ✅ İyi
const userInput = sanitize(req.body.name);
const query = db.prepare('SELECT * FROM users WHERE name = ?');
query.execute([userInput]);
```

#### XSS Koruması
```javascript
// ❌ Kötü
element.innerHTML = userInput;

// ✅ İyi
element.textContent = userInput;
// veya
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### Authentication
```javascript
// ❌ Kötü
if (password === storedPassword) {
  // login
}

// ✅ İyi
if (await bcrypt.compare(password, hashedPassword)) {
  // login
}
```

### Kullanıcılar İçin

* 🔐 Güçlü ve benzersiz şifreler kullanın
* 🔄 Düzenli olarak şifrenizi değiştirin
* 🚫 Şüpheli linklere tıklamayın
* 📱 İki faktörlü kimlik doğrulama kullanın (mevcut olduğunda)
* 🔒 HTTPS kullandığınızdan emin olun
* 💻 Yazılımınızı güncel tutun

## 📚 Güvenlik Kaynakları

### Öğrenme Kaynakları

* [OWASP Top 10](https://owasp.org/www-project-top-ten/)
* [Web Security Academy](https://portswigger.net/web-security)
* [Security Headers](https://securityheaders.com/)
* [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)

### Araçlar

* [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Bağımlılık güvenlik taraması
* [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security) - Kod güvenlik analizi
* [OWASP ZAP](https://www.zaproxy.org/) - Güvenlik testi aracı
* [Snyk](https://snyk.io/) - Güvenlik açığı yönetimi

## 🔐 Güvenlik Güncellemeleri

Güvenlik güncellemelerinden haberdar olmak için:

* ⭐ Bu repository'yi yıldızlayın
* 👁️ "Watch" > "Custom" > "Security alerts" seçin
* 📧 [email protected] adresine abone olun
* 📰 [CHANGELOG.md](CHANGELOG.md) dosyasını takip edin

## 📞 İletişim

### Güvenlik Ekibi

* **Email**: [email protected]
* **Response Time**: 48 saat
* **PGP Key**: Talep üzerine sağlanır

### Acil Durumlar

Kritik güvenlik sorunları için:

1. Email: [email protected] (Konu: URGENT SECURITY)
2. Detaylı açıklama ve etki analizi ekleyin
3. 24 saat içinde yanıt bekleyin

## 🙏 Sorumlu Açıklama

Güvenlik açığını kamuoyuna açıklamadan önce:

1. ✅ Bize bildirin ve yanıt bekleyin
2. ✅ Düzeltme için makul bir süre tanıyın (genellikle 90 gün)
3. ✅ Düzeltme yayınlanana kadar gizli tutun
4. ✅ Koordineli açıklama yapın

Sorumlu açıklama yapan araştırmacılar:

* 🏆 Hall of Fame'de yer alır
* 📜 İsim credit alır (isterseniz)
* 🙏 Topluluktan teşekkür alır

## ⚖️ Yasal Koruma

Sorumlu güvenlik açığı araştırması yapan kişiler:

* ✅ Yasal takibat yapılmayacaktır
* ✅ Hizmet şartları ihlali sayılmayacaktır
* ✅ İyi niyet varsayılacaktır

**Şartlar**:
* Sadece test hesaplarınızı kullanın
* Kullanıcı verilerine erişmeyin/değiştirmeyin
* Hizmeti bozmayın
* Bulguları gizli tutun
* Sorumlu bir şekilde bildirin

## 📝 Değişiklik Geçmişi

* **v1.0** (Aralık 2024): İlk güvenlik politikası oluşturuldu

## 🌟 Teşekkürler

Güvenliğimizi artırmaya yardımcı olduğunuz için teşekkür ederiz! Birlikte daha güvenli bir NeuranaWorld oluşturuyoruz.

---

**Son Güncelleme**: Aralık 2024
**Versiyon**: 1.0
**İletişim**: [email protected]
