import { useState, useEffect } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [theme, setTheme] = useState('light')
  const [menuOpen, setMenuOpen] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Close menu when clicking a link
  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <span className="nav-logo">🧠</span>
          <span className="nav-title">NeuranaWorld</span>
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#oyunlar" className="nav-link" onClick={closeMenu}>
            🎮 Oyunlar
          </a>
          <a href="#uygulamalar" className="nav-link" onClick={closeMenu}>
            💻 Uygulamalar
          </a>
          <a href="#hakkimizda" className="nav-link" onClick={closeMenu}>
            ℹ️ Hakkımızda
          </a>

          <button
            className="btn btn-sm btn-secondary"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Karanlık' : 'Aydınlık'}
          </button>
        </div>
      </div>
    </nav>
  )
}
