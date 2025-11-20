import React from 'react';

const NeuraVerseSimple = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#87CEEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '48px', color: 'white' }}>⛏️ NeuraVerse Skyblock</h1>
      <p style={{ fontSize: '24px', color: 'white' }}>3D Dünya geliştiriliyor...</p>
      <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.9)', borderRadius: '10px' }}>
        <h3>Backend API Test:</h3>
        <p>✅ Ada sistemi hazır</p>
        <p>✅ Blok sistemi hazır</p>
        <p>⏳ 3D render geliştiriliyor</p>
      </div>
    </div>
  );
};

export default NeuraVerseSimple;
