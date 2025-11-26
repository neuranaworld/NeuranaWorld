# 🏗️ NeuranaWorld React Build Rehberi

## ⚠️ DURUM
- ✅ package.json oluşturuldu
- ✅ vite.config.js oluşturuldu
- ✅ npm install yapıldı
- ✅ src/ klasörleri oluşturuldu
- 🔄 React component'leri oluşturulacak

## 📝 KALAN ADIMLAR

### 1. Oyunları src/games/ altına taşı
```bash
mv Oyunlar/Aksiyon/*.js src/games/
mv Oyunlar/Bulmaca/*.js src/games/
mv Oyunlar/Strateji/*.js src/games/
mv Oyunlar/Macera/*.js src/games/
```

### 2. src/App.jsx oluştur
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
// Tüm oyunları import et
import SnakeGame from './games/SnakeGame'
// ... diğer 27 oyun

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/snake" element={<SnakeGame />} />
        {/* ... diğer oyun route'ları */}
      </Routes>
    </BrowserRouter>
  )
}
```

### 3. src/pages/Home.jsx oluştur
Mevcut index.html'i React component'e çevir

### 4. index.html'i Vite için düzenle
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuranaWorld</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 5. Build yap
```bash
npm run build
```

### 6. .gitignore güncelle
```
node_modules/
dist/
.env
```

### 7. GitHub Actions workflow güncelle
`.github/workflows/static.yml`:
- Build step ekle: `npm install && npm run build`
- Upload path'i değiştir: `path: 'dist'`

### 8. GitHub'a push et
```bash
git add .
git commit -m "React build setup with Vite"
git push origin main
```

## ⏱️ TAHMINI SÜRE: 1-2 saat

## 🚨 SORUN ÇIKARSA
1. `npm run dev` ile local'de test et
2. Console error'ları kontrol et
3. Build error'larını oku ve düzelt

## 📞 YARDIM
Bu rehberi takip edin veya yeni bir Claude session başlatın.
