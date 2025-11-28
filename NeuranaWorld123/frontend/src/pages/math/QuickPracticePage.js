import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickPracticePage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="header-gradient orange">
        <button className="back-button" onClick={() => navigate('/math')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">⚡ Hızlı Pratik</h1>
        <p className="subtitle">Zamana karşı yarış!</p>
      </div>

      <div className="grid">
        <div className="card" onClick={() => navigate('/math/games/basic-ops')} data-testid="basic-ops-card">
          <div className="card-icon">🔢</div>
          <h2 className="card-title">Dört İşlem</h2>
          <p className="card-description">Toplama, çıkarma, çarpma, bölme</p>
        </div>

        <div className="card" onClick={() => navigate('/math/games/number-guess')} data-testid="number-guess-card">
          <div className="card-icon">🎲</div>
          <h2 className="card-title">Sayı Tahmin</h2>
          <p className="card-description">1-100 arası sayıyı bul</p>
        </div>

        <div className="card" onClick={() => navigate('/math/games/pattern')} data-testid="pattern-card">
          <div className="card-icon">🎯</div>
          <h2 className="card-title">Örüntü Bulma</h2>
          <p className="card-description">Sayı dizilerindeki örüntüleri keşfet</p>
        </div>
      </div>
    </div>
  );
}
