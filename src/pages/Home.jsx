import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import GameCard from '../components/GameCard'
import AppCard from '../components/AppCard'
import { oyunlar, uygulamalar } from '../constants/games'

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOyunlar = oyunlar.filter((game) => {
    const matchFilter = filter === 'all' || game.category.toLowerCase() === filter.toLowerCase()
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.shortDesc.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.grid .card').forEach((card) => {
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [filteredOyunlar])

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
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
              🎮 {oyunlar.length} Oyun ve 💻 {uygulamalar.length} Uygulama ile dolu eğlence dünyası!
            </p>
            <div className="hero-buttons">
              <a href="#oyunlar" className="btn btn-primary btn-lg">
                🎮 Oyunlara Başla
              </a>
              <a href="#uygulamalar" className="btn btn-secondary btn-lg">
                💻 Uygulamaları Keşfet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Oyun veya uygulama ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="filter-container">
            <button
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              ✨ Tümü
            </button>
            <button
              className={filter === 'aksiyon' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('aksiyon')}
            >
              ⚡ Aksiyon
            </button>
            <button
              className={filter === 'bulmaca' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('bulmaca')}
            >
              🧩 Bulmaca
            </button>
            <button
              className={filter === 'strateji' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('strateji')}
            >
              ♟️ Strateji
            </button>
            <button
              className={filter === 'macera' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('macera')}
            >
              🌀 Macera
            </button>
          </div>
        </div>
      </div>

      <main className="container">
        {/* Oyunlar Section */}
        <section id="oyunlar" className="section">
          <h2>🎮 Oyunlar</h2>
          {filteredOyunlar.length > 0 ? (
            <div className="grid">
              {filteredOyunlar.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
              <p>Aradığınız kriterlere uygun oyun bulunamadı.</p>
            </div>
          )}
        </section>

        {/* Uygulamalar Section */}
        <section id="uygulamalar" className="section">
          <h2>💻 Uygulamalar</h2>
          <div className="grid">
            {uygulamalar.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        {/* Hakkımızda Section */}
        <section id="hakkimizda" className="section section-about">
          <h2>ℹ️ Hakkımızda</h2>
          <div
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(10px)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>NeuranaWorld</strong>, modern web teknolojileri ile geliştirilmiş, eğlenceli
              oyunlar ve kullanışlı uygulamalar sunan tamamen ücretsiz bir platformdur.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '0' }}>
              🎯 Misyonumuz, kullanıcılarımıza kaliteli ve eğlenceli bir dijital deneyim sunmaktır.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 NeuranaWorld. Tüm hakları saklıdır.</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>
            Made with ❤️ by NeuranaWorld Team
          </p>
        </div>
      </footer>
    </div>
  )
}
