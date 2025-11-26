import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComingSoonGame({ title, description, icon }) {
  const navigate = useNavigate();
  
  return (
    <div className="page-container">
      <div className="header-gradient">
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">{icon} {title}</h1>
        <p className="subtitle">Yakında...</p>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '96px', marginBottom: '20px' }}>🚧</div>
        <h2 style={{ fontSize: '32px', color: '#667eea', marginBottom: '20px' }}>Çok Yakında!</h2>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto' }}>
          {description}
        </p>
        <p style={{ fontSize: '16px', color: '#999', marginTop: '30px' }}>
          Bu oyun şu anda geliştirme aşamasında. Yakında sizlerle!
        </p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '15px', color: '#3F51B5' }}>💡 Planlanan Özellikler</h3>
        <ul style={{ lineHeight: '2.2', color: '#333', paddingLeft: '20px' }}>
          <li>Gerçekçi oyun mekaniği</li>
          <li>AI botlar ile oynama</li>
          <li>Çevrimiçi çok oyunculu mod</li>
          <li>Liderlik tablosu</li>
          <li>Detaylı istatistikler</li>
        </ul>
      </div>
    </div>
  );
}

// Okey oyunu için wrapper
export function OkeyGame() {
  return (
    <ComingSoonGame
      title="Okey 101"
      description="Türk klasiklerinden Okey 101, yakında 4 oyunculu ve AI botları ile birlikte sizlerle olacak. Stratejinizi belirleyin, taşlarınızı düzenleyin ve rakiplerinizi yenin!"
      icon="🎴"
    />
  );
}

// Batak oyunu için wrapper
export function BatakGame() {
  return (
    <ComingSoonGame
      title="Batak"
      description="Strateji ve şansın birleştiği Batak oyunu yakında! İhale yapın, koz belirleyin ve rakiplerinizi alt edin. Gerçekçi kart dağıtımı ve akıllı AI botları ile eğlence sizi bekliyor!"
      icon="🎴"
    />
  );
}

// Poker oyunu için wrapper
export function PokerGame() {
  return (
    <ComingSoonGame
      title="Poker Texas Hold'em"
      description="Dünyaca ünlü Poker Texas Hold'em oyunu yakında platformumuzda! Bluff yapın, stratejinizi kurgulayan ve büyük potlar kazanın. Çok oyunculu turnuvalar ve sıralama sistemi ile rekabet edin!"
      icon="♠️"
    />
  );
}
