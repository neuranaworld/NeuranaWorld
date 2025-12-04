import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WritingRulesPage() {
  const navigate = useNavigate();
  const [selectedRule, setSelectedRule] = useState(null);

  const writingRules = [
    {
      id: 1,
      title: 'Büyük Harf Kullanımı',
      icon: '🅰️',
      rules: [
        'Cümle başlarında ilk harf büyük yazılır.',
        'Özel isimler büyük harfle başlar (Ali, İstanbul, Atatürk).',
        'Unvan ve makam isimleri özel isimle kullanıldığında büyük yazılır (Cumhurbaşkanı Atatürk).',
        'Millet, devlet, dil ve din adları büyük harfle başlar (Türk Milleti, İslam).',
      ],
      examples: [
        '✅ Ahmet okula gitti.',
        '✅ Ankara Türkiye\'nin başkentidir.',
        '❌ ankara türkiye\'nin başkentidir.',
      ],
    },
    {
      id: 2,
      title: 'Kısaltmalar',
      icon: '🔤',
      rules: [
        'Kısaltmalar tamamı büyük harfle yazılır (TRT, TBMM, TÜRKİYE).',
        'Kısaltmalarda nokta kullanılmaz.',
        'Kısaltmaların okunması harf harf ise ek alırken kesme işareti kullanılır (TRT\'de).',
        'Kısaltmanın okunması kelime gibi ise kesme kullanılmaz (NATO\'da değil, NATO’da).',
      ],
      examples: [
        '✅ TRT\'de haber izledim.',
        '✅ TBMM\'ye gittik.',
        '❌ T.R.T.\'de haber izledim.',
      ],
    },
    {
      id: 3,
      title: 'Rakamlar ve Tarihler',
      icon: '📅',
      rules: [
        'Tarihler rakamla yazıldığında ek alırken kesme işareti kullanılır (1923\'te).',
        'Rakamlar kelime ile yazıldığında kesme kullanılmaz (bin dokuz yüz yirmi üçte).',
        'Yüzyıllar Romalı rakamla yazılır (XXI. yüzyıl).',
      ],
      examples: [
        '✅ 1923\'te Cumhuriyet ilan edildi.',
        '✅ XXI. yüzyılda teknoloji gelişti.',
        '❌ 1923te Cumhuriyet ilan edildi.',
      ],
    },
    {
      id: 4,
      title: 'Kesme İşareti',
      icon: '\'',
      rules: [
        'Özel isimlere ek getirilirken kesme işareti kullanılır (Ahmet\'in, İstanbul\'da).',
        'Kısaltmalara ek getirilirken kesme kullanılır (TRT\'de).',
        'Rakamlara ek getirilirken kesme kullanılır (5\'te, 100\'de).',
        'Yabancı özel isimlere ek getirilirken kesme kullanılır (Paris\'te, London\'da).',
      ],
      examples: [
        '✅ Ahmet\'in kitabı',
        '✅ İstanbul\'da yaşıyorum.',
        '❌ Ahmetin kitabı',
      ],
    },
  ];

  return (
    <div className="page-container">
      <div className="header-gradient pink">
        <button className="back-button" onClick={() => navigate('/turkish')} data-testid="back-button">
          ← Geri
        </button>
        <h1 className="title">✍️ Yazım Kuralları</h1>
        <p className="subtitle">Doğru yazmanın ölçülü</p>
      </div>

      {!selectedRule ? (
        <div className="grid">
          {writingRules.map((rule) => (
            <div
              key={rule.id}
              className="card"
              onClick={() => setSelectedRule(rule)}
              data-testid={`rule-card-${rule.id}`}
            >
              <div className="card-icon">{rule.icon}</div>
              <h2 className="card-title">{rule.title}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="card">
            <button
              onClick={() => setSelectedRule(null)}
              className="button orange"
              style={{ marginBottom: '20px' }}
              data-testid="back-button-rules"
            >
              ← Kurallar Listesine Dön
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px' }}>{selectedRule.icon}</div>
              <h2 style={{ fontSize: '28px', color: '#E91E63', margin: 0 }}>{selectedRule.title}</h2>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>📜 Kurallar:</h3>
              <ul style={{ lineHeight: '2.2', color: '#333', paddingLeft: '25px', fontSize: '16px' }}>
                {selectedRule.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>💡 Örnekler:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedRule.examples.map((example, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px 15px',
                      background: example.startsWith('✅') ? '#d4edda' : '#f8d7da',
                      borderRadius: '8px',
                      fontSize: '15px',
                      color: '#333',
                    }}
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' }}>
        <h3 style={{ marginBottom: '10px', color: '#C2185B' }}>📝 Yazım Kuralları Neden Önemli?</h3>
        <ul style={{ lineHeight: '2', color: '#333', paddingLeft: '20px' }}>
          <li>Doğru ve anlaşılır yazı için gerekli</li>
          <li>Resmi yazışmalarda zorunlu</li>
          <li>Akademik başarıyı etkiler</li>
          <li>Profesyonel imaj oluşturur</li>
        </ul>
      </div>
    </div>
  );
}
