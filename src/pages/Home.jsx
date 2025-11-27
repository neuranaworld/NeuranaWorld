import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { oyunlar, uygulamalar } from '../constants/games'

export default function Home() {
  const [activeTab, setActiveTab] = useState('oyunlar')
  const [search, setSearch] = useState('')

  // Arama filtresi
  const filteredOyunlar = search
    ? oyunlar.filter((game) => game.name.toLowerCase().includes(search.toLowerCase()))
    : oyunlar

  const filteredUygulamalar = search
    ? uygulamalar.filter((app) => app.name.toLowerCase().includes(search.toLowerCase()))
    : uygulamalar

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Basit Hero */}
      <section style={{
        padding: '60px 0 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
          }}>
            🧠 NeuranaWorld
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0',
          }}>
            {oyunlar.length} Oyun • {uygulamalar.length} Uygulama
          </p>
        </div>
      </section>

      <main className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Basit Arama */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          <input
            type="text"
            placeholder="🔍 Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '16px',
              border: '2px solid var(--border-color)',
              borderRadius: '50px',
              outline: 'none',
              transition: 'all 0.3s',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)'
              e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Basit Tablar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveTab('oyunlar')}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              background: activeTab === 'oyunlar' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--bg-secondary)',
              color: activeTab === 'oyunlar' ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.3s',
            }}
          >
            🎮 Oyunlar ({filteredOyunlar.length})
          </button>
          <button
            onClick={() => setActiveTab('uygulamalar')}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              background: activeTab === 'uygulamalar' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--bg-secondary)',
              color: activeTab === 'uygulamalar' ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.3s',
            }}
          >
            💻 Uygulamalar ({filteredUygulamalar.length})
          </button>
        </div>

        {/* Oyunlar Grid */}
        {activeTab === 'oyunlar' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
            animation: 'fadeIn 0.5s',
          }}>
            {filteredOyunlar.map((game) => (
              <Link
                key={game.id}
                to={game.route}
                style={{
                  textDecoration: 'none',
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = game.color || 'var(--primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{game.icon}</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}>
                  {game.name}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  fontWeight: '500',
                  marginBottom: '0',
                }}>
                  {game.category}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Uygulamalar Grid */}
        {activeTab === 'uygulamalar' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
            animation: 'fadeIn 0.5s',
          }}>
            {filteredUygulamalar.map((app) => (
              <div
                key={app.id}
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  position: 'relative',
                  opacity: app.comingSoon ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{app.icon}</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}>
                  {app.name}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  fontWeight: '500',
                  marginBottom: '0',
                }}>
                  {app.category}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Sonuç yok mesajı */}
        {((activeTab === 'oyunlar' && filteredOyunlar.length === 0) ||
          (activeTab === 'uygulamalar' && filteredUygulamalar.length === 0)) && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-tertiary)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px' }}>Aradığınız bulunamadı.</p>
          </div>
        )}
      </main>

      {/* Basit Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        padding: '24px 0',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
      }}>
        <div className="container">
          <p style={{ color: 'var(--text-tertiary)', margin: '0', fontSize: '14px' }}>
            © 2024 NeuranaWorld • Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}
