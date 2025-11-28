import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const oyunlar = [
  // Aksiyon
  { id: 'breakout', name: 'Breakout', icon: '🧱', category: 'Aksiyon', route: '/oyunlar/breakout', shortDesc: 'Klasik tuğla kırma' },
  { id: 'cityrunner', name: 'City Runner', icon: '🏃', category: 'Aksiyon', route: '/oyunlar/cityrunner', shortDesc: 'Şehir koşusu' },
  { id: 'dart', name: 'Dart', icon: '🎯', category: 'Aksiyon', route: '/oyunlar/dart', shortDesc: 'Dart atma' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦', category: 'Aksiyon', route: '/oyunlar/flappybird', shortDesc: 'Uçan kuş' },
  { id: 'pong', name: 'Pong', icon: '🏓', category: 'Aksiyon', route: '/oyunlar/pong', shortDesc: 'Klasik pong' },
  { id: 'skyjumper', name: 'Sky Jumper', icon: '☁️', category: 'Aksiyon', route: '/oyunlar/skyjumper', shortDesc: 'Gökyüzü' },
  { id: 'snake', name: 'Snake', icon: '🐍', category: 'Aksiyon', route: '/oyunlar/snake', shortDesc: 'Yılan oyunu' },

  // Bulmaca
  { id: 'cizim', name: 'Çizim Oyunu', icon: '🎨', category: 'Bulmaca', route: '/oyunlar/cizim', shortDesc: 'Çizim tahmin' },
  { id: '2048', name: '2048', icon: '🔢', category: 'Bulmaca', route: '/oyunlar/2048', shortDesc: 'Sayı birleştir' },
  { id: 'jigsaw', name: 'Yapboz', icon: '🧩', category: 'Bulmaca', route: '/oyunlar/jigsaw', shortDesc: 'Puzzle' },
  { id: 'memory', name: 'Hafıza', icon: '🃏', category: 'Bulmaca', route: '/oyunlar/memory', shortDesc: 'Hafıza kartları' },
  { id: 'minesweeper', name: 'Mayın Tarlası', icon: '💣', category: 'Bulmaca', route: '/oyunlar/minesweeper', shortDesc: 'Mayın' },
  { id: 'nonogram', name: 'Nonogram', icon: '📊', category: 'Bulmaca', route: '/oyunlar/nonogram', shortDesc: 'Mantık' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩', category: 'Bulmaca', route: '/oyunlar/puzzle', shortDesc: 'Kaydırmalı' },
  { id: 'seker', name: 'Şeker Eşleştirme', icon: '🍬', category: 'Bulmaca', route: '/oyunlar/seker', shortDesc: 'Eşleştir' },
  { id: 'tetris', name: 'Tetris', icon: '🟦', category: 'Bulmaca', route: '/oyunlar/tetris', shortDesc: 'Klasik Tetris' },
  { id: 'wordsearch', name: 'Kelime Arama', icon: '🔤', category: 'Bulmaca', route: '/oyunlar/wordsearch', shortDesc: 'Kelime bul' },

  // Strateji
  { id: 'batak', name: 'Batak', icon: '🃏', category: 'Strateji', route: '/oyunlar/batak', shortDesc: 'Türk kartı' },
  { id: 'cards', name: 'Kart Oyunları', icon: '🎴', category: 'Strateji', route: '/oyunlar/cards', shortDesc: 'Kartlar' },
  { id: 'connect4', name: 'Connect Four', icon: '🔴', category: 'Strateji', route: '/oyunlar/connect4', shortDesc: 'Dörtlü' },
  { id: 'okey101', name: 'Okey 101', icon: '🎲', category: 'Strateji', route: '/oyunlar/okey101', shortDesc: 'Okey 101' },
  { id: 'okeypro', name: 'Okey Pro', icon: '🎲', category: 'Strateji', route: '/oyunlar/okeypro', shortDesc: 'Okey Pro' },
  { id: 'poker', name: 'Poker', icon: '♠️', category: 'Strateji', route: '/oyunlar/poker', shortDesc: 'Poker' },
  { id: 'tictactoe', name: 'XOX', icon: '❌', category: 'Strateji', route: '/oyunlar/tictactoe', shortDesc: 'XOX' },

  // Macera
  { id: 'maze', name: 'Labirent', icon: '🌀', category: 'Macera', route: '/oyunlar/maze', shortDesc: 'Labirent' },
  { id: 'survival', name: 'Survival Game', icon: '⛺', category: 'Macera', route: '/oyunlar/survival', shortDesc: 'Hayatta kalma' },

  // Simülasyon
  { id: 'farmdominion', name: 'Farm Dominion', icon: '🚜', category: 'Simülasyon', route: '/oyunlar/farmdominion', shortDesc: '3D Çiftlik simülasyonu (6.8M m²)' },

  // 3D & Multiplayer
  { id: 'galaxy', name: 'NeuranaWorld Galaxy', icon: '🌌', category: '3D Oyunlar', route: '/oyunlar/galaxy', shortDesc: '3D Multiplayer evren' }
]

const uygulamalar = [
  { id: 'calculator', name: 'Hesap Makinesi', icon: '🧮', category: 'Araçlar', shortDesc: 'Gelişmiş hesap makinesi', comingSoon: true },
  { id: 'converter', name: 'Birim Dönüştürücü', icon: '🔄', category: 'Araçlar', shortDesc: 'Birim çevirici', comingSoon: true },
  { id: 'math', name: 'Dört İşlem', icon: '➕', category: 'Eğitim', shortDesc: 'Matematik pratiği', comingSoon: true },
  { id: 'piano', name: 'Müzik Klavyesi', icon: '🎹', category: 'Müzik', shortDesc: 'Sanal piyano', comingSoon: true },
  { id: 'alarm', name: 'Çalar Saat', icon: '⏰', category: 'Zaman', shortDesc: 'Alarm', comingSoon: true },
  { id: 'stopwatch', name: 'Kronometre', icon: '⏱️', category: 'Zaman', shortDesc: 'Zaman ölçücü', comingSoon: true },
  { id: 'recorder', name: 'Ses Kayıt', icon: '🎙️', category: 'Zaman', shortDesc: 'Ses kaydedici', comingSoon: true },
  { id: 'draw', name: '2D Grafik Çizimi', icon: '✏️', category: 'Çizim', shortDesc: 'Çizim uygulaması', comingSoon: true },
  { id: 'neuranaverse', name: 'Neuranaverse', icon: '🌐', category: 'Sosyal', shortDesc: 'Metaverse', comingSoon: true }
]

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOyunlar = oyunlar.filter(game => {
    const matchFilter = filter === 'all' || game.category.toLowerCase() === filter.toLowerCase()
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <span className="nav-logo">🧠</span>
            <span className="nav-title">NeuranaWorld</span>
          </div>
          <div className="nav-links">
            <a href="#oyunlar" className="nav-link">🎮 Oyunlar</a>
            <a href="#uygulamalar" className="nav-link">💻 Uygulamalar</a>
            <a href="#hakkimizda" className="nav-link">ℹ️ Hakkımızda</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-emoji">🧠</span>
              Hoş Geldiniz!
              <span className="hero-subtitle">NeuranaWorld</span>
            </h1>
            <p className="hero-description">
              🎮 31 Oyun ve 💻 9 Uygulama ile dolu eğlence dünyası!
            </p>
            <div className="hero-buttons">
              <a href="#oyunlar" className="btn btn-primary">🎮 Oyunlara Başla</a>
              <a href="#uygulamalar" className="btn btn-secondary">💻 Uygulamaları Keşfet</a>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Oyun ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-container">
            <button className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('all')}>✨ Tümü</button>
            <button className={filter === 'aksiyon' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('aksiyon')}>⚡ Aksiyon</button>
            <button className={filter === 'bulmaca' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('bulmaca')}>🧩 Bulmaca</button>
            <button className={filter === 'strateji' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('strateji')}>♟️ Strateji</button>
            <button className={filter === 'macera' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('macera')}>🌀 Macera</button>
            <button className={filter === 'simülasyon' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('simülasyon')}>🚜 Simülasyon</button>
            <button className={filter === '3d oyunlar' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('3d oyunlar')}>🌌 3D</button>
          </div>
        </div>
      </div>

      <main className="container">
        {/* Oyunlar */}
        <section id="oyunlar" className="section">
          <h2>🎮 Oyunlar</h2>
          <div className="grid">
            {filteredOyunlar.map(game => (
              <Link key={game.id} to={game.route} className="card game-card">
                <div className="card-icon">{game.icon}</div>
                <h3>{game.name}</h3>
                <p className="card-category">{game.category}</p>
                <p className="card-desc">{game.shortDesc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Uygulamalar */}
        <section id="uygulamalar" className="section">
          <h2>💻 Uygulamalar</h2>
          <div className="grid">
            {uygulamalar.map(app => (
              <div key={app.id} className="card game-card">
                <div className="card-icon">{app.icon}</div>
                <h3>{app.name}</h3>
                <p className="card-category">{app.category}</p>
                <p className="card-desc">{app.shortDesc}</p>
                {app.comingSoon && <span className="badge coming-soon">🚧 Yakında</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Hakkımızda */}
        <section id="hakkimizda" className="section section-about">
          <h2>ℹ️ Hakkımızda</h2>
          <p><strong>NeuranaWorld</strong>, eğlenceli oyunlar ve kullanışlı uygulamalar sunan tamamen ücretsiz bir platformdur.</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 NeuranaWorld. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
