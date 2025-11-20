import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DailyQuote() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);

  const quotes = [
    { text: "Başarı, küçük çabaların tekrarının toplamıdır.", author: "Robert Collier" },
    { text: "Eğitim geleceğin pasaportudur, yarın bugün ona hazırlanan insanlara aittir.", author: "Malcolm X" },
    { text: "Öğrenme hiçbir zaman zihin yorulmaz; sadece merak eder, açılır ve canlanır.", author: "Leonardo da Vinci" },
    { text: "Bilgi güçtür. Bilgi paylaşıldığında güç çoğalır.", author: "Robert Noyce" },
    { text: "Hayatta en önemli şey düştüğünde durmak değil, her düştüğünde kalkarak devam etmektir.", author: "Vince Lombardi" },
    { text: "Başarılı olmak için, başarı arzunuzun başarısızlık korkunuzdan daha büyük olması gerekir.", author: "Bill Cosby" },
    { text: "Geleceğin en iyi yöntemini tahmin etmek, onu yaratındır.", author: "Peter Drucker" },
    { text: "Eğitim, bir kovayı doldurmak değil, bir ateşi tutuşturmaktır.", author: "William Butler Yeats" },
    { text: "Bugün yapabileceğinizi yarına bırakma, yarın hiç gelmeyebilir.", author: "Benjamin Franklin" },
    { text: "Hata yapmaktan korkma. Hata yapmayı denemekten vazgeçmekten daha iyidir.", author: "William J. H. Boetcker" },
  ];

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">💭 Günlük Alıntı</h1>
        <p className="subtitle">Motivasyonel günlük alıntılar</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 40px', textAlign: 'center' }}>
        {quote && (
          <>
            <div style={{ fontSize: '32px', fontStyle: 'italic', marginBottom: '30px', lineHeight: '1.6' }}>
              “{quote.text}”
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', opacity: 0.9 }}>
              — {quote.author}
            </div>
          </>
        )}
      </div>

      <button
        onClick={getNewQuote}
        style={{
          width: '100%',
          padding: '20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        🔄 Yeni Alıntı
      </button>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Günlük Motivasyon</h3>
        <p style={{ lineHeight: '1.8', color: '#666' }}>
          Her gün yeni bir alıntı ile güne başlayın. Büyük düşünürlerin sözlerinden ilham alın ve hedefinize ulaşmak için motive olun.
        </p>
      </div>
    </div>
  );
}
