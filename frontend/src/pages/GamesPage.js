import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GamesPage() {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: 'Adam Asmaca',
      icon: '🎯',
      description: 'İpuçlarıyla kelime tahmin et',
      path: '/turkish/games/hangman',
      color: '#E91E63'
    },
    {
      id: 2,
      name: 'İsim-Şehir-Hayvan',
      icon: '🎯',
      description: 'Klasik kelime oyunu - 5 kategori',
      path: '/tools/isim-sehir-hayvan',
      color: '#4CAF50'
    },
    {
      id: 3,
      name: 'Kelime Türetme',
      icon: '🔗',
      description: 'Son harfle başlayan kelime bul',
      path: '/turkish/games/word-chain',
      color: '#E91E63'
    },
    {
      id: 5,
      name: 'Mayın Tarlası',
      icon: '💣',
      description: 'Mayınları bul ve işaretle',
      path: '/games/minesweeper',
      color: '#FF5722'
    },
    {
      id: 6,
      name: 'Labirent',
      icon: '🌀',
      description: 'Labirentten çıkış yolunu bul',
      path: '/games/maze',
      color: '#4CAF50'
    },
    {
      id: 8,
      name: 'Okey 101',
      icon: '🎴',
      description: '4 oyunculu klasik Okey oyunu',
      path: '/games/okey',
      color: '#795548'
    },
    {
      id: 12,
      name: 'City Runner',
      icon: '🏃‍♂️',
      description: 'Şehirde sonsuz koşu - Engelleri aş, coin topla!',
      path: '/games/city-runner',
      color: '#10b981'
    },
    {
      id: 13,
      name: 'Sky Jumper',
      icon: '🚀',
      description: 'Platformlara zıpla, gökyüzüne yüksel!',
      path: '/games/sky-jumper',
      color: '#06b6d4'
    },
    // Engellenen oyunlar - en altta
    {
      id: 4,
      name: 'Tetris',
      icon: '🧱',
      description: 'Klasik blok düşürme oyunu',
      path: '/games/tetris',
      color: '#9C27B0',
      blocked: true
    },
    {
      id: 7,
      name: 'Nonogram',
      icon: '🎨',
      description: 'Sayıları takip ederek resim oluştur',
      path: '/games/nonogram',
      color: '#2196F3',
      blocked: true
    },
    {
      id: 9,
      name: 'Batak',
      icon: '🃏',
      description: 'İhale yap, koz belirle, puan kazan',
      path: '/games/batak',
      color: '#F44336',
      blocked: true
    },
    {
      id: 10,
      name: 'Poker Texas Hold\'em',
      icon: '♠️',
      description: 'Dünyaca ünlü poker oyunu',
      path: '/games/poker',
      color: '#000000',
      blocked: true
    },
    {
      id: 11,
      name: '101 Okey',
      icon: '🎴',
      description: 'Premium Türk Okey Oyunu - 3 AI rakibe karşı oyna!',
      path: '/games/101-okey',
      color: '#1E3A8A',
      blocked: true
    },
  ];

  return (
    <div className="page-container">
      <div className="header-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <button className="back-button" onClick={() => navigate('/')} data-testid="back-button">← Geri</button>
        <h1 className="title">🎮 Oyunlar</h1>
        <p className="subtitle">Tüm oyunlar bir arada</p>
      </div>

      <div className="grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="card"
            onClick={() => !game.blocked && navigate(game.path)}
            data-testid={`game-card-${game.id}`}
            style={{ 
              cursor: game.blocked ? 'not-allowed' : 'pointer',
              background: 'white',
              borderLeft: `4px solid ${game.color}`,
              transition: 'all 0.3s',
              position: 'relative',
              opacity: game.blocked ? 0.7 : 1
            }}
          >
            {game.blocked && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                zIndex: 10
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🚫</div>
                <h3 style={{ color: '#FF6B6B', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>
                  İçerik Engellendi
                </h3>
                <p style={{ color: '#FFF', fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>
                  Bu oyun şu anda kullanılamıyor
                </p>
              </div>
            )}
            <div className="card-icon" style={{ fontSize: '48px' }}>
              {game.icon}
            </div>
            <h2 className="card-title">
              {game.name}
            </h2>
            <p className="card-description">
              {game.description}
            </p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px', background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#3F51B5' }}>🎮 Oyun Kategorileri</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '8px' }}>📝 Kelime Oyunları</h4>
            <ul style={{ lineHeight: '1.8', color: '#333', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Adam Asmaca</li>
              <li>İsim-Şehir-Hayvan</li>
              <li>Kelime Türetme</li>
            </ul>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '8px' }}>🧩 Bulmaca Oyunları</h4>
            <ul style={{ lineHeight: '1.8', color: '#333', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Tetris</li>
              <li>Mayın Tarlası</li>
              <li>Labirent</li>
              <li>Nonogram</li>
            </ul>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '8px' }}>🎮 Aksiyon Oyunları</h4>
            <ul style={{ lineHeight: '1.8', color: '#333', paddingLeft: '20px', fontSize: '14px' }}>
              <li>City Runner</li>
              <li>Sky Jumper</li>
            </ul>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '8px' }}>🎴 Kart Oyunları</h4>
            <ul style={{ lineHeight: '1.8', color: '#333', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Okey 101 (Yakında)</li>
              <li>Batak (Yakında)</li>
              <li>Poker (Yakında)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
