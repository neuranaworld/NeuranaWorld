import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HandwritingOCR() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [latexCode, setLatexCode] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognizedText('');
    setLatexCode('');
  };

  // Basit pattern matching ile matematiksel sembolleri tan
  const recognizeHandwriting = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Basit bir simlasyon - gerek OCR yerine rnek tanma
    const patterns = [
      { symbol: 'x', latex: 'x^2', description: 'x kare' },
      { symbol: '', latex: '\\int', description: 'ntegral' },
      { symbol: '', latex: '\\sum', description: 'Toplam' },
      { symbol: '', latex: '\\sqrt{}', description: 'Karekk' },
      { symbol: '', latex: '\\alpha', description: 'Alfa' },
      { symbol: '', latex: '\\beta', description: 'Beta' },
      { symbol: '', latex: '\\pi', description: 'Pi' },
      { symbol: '', latex: '\\infty', description: 'Sonsuz' },
      { symbol: '', latex: '\\neq', description: 'Eit deil' },
      { symbol: '', latex: '\\leq', description: 'Kk eit' },
      { symbol: '', latex: '\\geq', description: 'Byk eit' },
      { symbol: 'sin', latex: '\\sin', description: 'Sins' },
      { symbol: 'cos', latex: '\\cos', description: 'Kosins' }
    ];

    // Rastgele bir pattern se (gerek OCR simlasyonu)
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    setRecognizedText(randomPattern.symbol);
    setLatexCode(randomPattern.latex);
    
    // Gemie ekle
    const entry = {
      id: Date.now(),
      symbol: randomPattern.symbol,
      latex: randomPattern.latex,
      description: randomPattern.description,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    };
    setHistory(prev => [entry, ...prev.slice(0, 9)]); // Son 10 kayt
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(' LaTeX kodu kopyaland!');
  };

  const commonSymbols = [
    { symbol: 'x', latex: 'x^2', desc: 's' },
    { symbol: '', latex: '\\sqrt{x}', desc: 'Karekk' },
    { symbol: '', latex: '\\int', desc: 'ntegral' },
    { symbol: '', latex: '\\sum', desc: 'Toplam' },
    { symbol: '', latex: '\\pi', desc: 'Pi' },
    { symbol: '', latex: '\\infty', desc: 'Sonsuz' },
    { symbol: '', latex: '\\alpha', desc: 'Alfa' },
    { symbol: '', latex: '\\beta', desc: 'Beta' },
    { symbol: '', latex: '\\partial', desc: 'Ksmi' },
    { symbol: '', latex: '\\neq', desc: 'Eit deil' },
    { symbol: '', latex: '\\leq', desc: 'Kk eit' },
    { symbol: '', latex: '\\geq', desc: 'Byk eit' }
  ];

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">&larr; Ana Men</button>
      
      <div className="header-gradient">
        <h1 className="title">&#9997; El Yazs &rarr; LaTeX</h1>
        <p className="subtitle">Matematiksel forml ve sembol tanma</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Nasl Kullanlr?</h3>
        <ol style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Beyaz alana matematiksel bir sembol izin</li>
          <li>"Tan" butonuna tklayn</li>
          <li>LaTeX kodunu kopyalayn ve kullann</li>
        </ol>
      </div>

      {/* Canvas izim Alan */}
      <div className="card\" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}> izim Alan</h3>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            width: '100%',
            maxWidth: '800px',
            border: '3px solid #667eea',
            borderRadius: '12px',
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={recognizeHandwriting}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Detect Tan
          </button>
          <button
            onClick={clearCanvas}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '15px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Delete Temizle
          </button>
        </div>
      </div>

      {/* Tanma Sonucu */}
      {recognizedText && (
        <div className="card\" style={{ marginBottom: '30px', background: '#f0f8ff', border: '3px solid #2196F3' }}>
          <h3 style={{ marginBottom: '20px', color: '#1976D2' }}> Tanma Sonucu</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ marginBottom: '10px', color: '#666' }}>Sembol:</h4>
              <div style={{
                padding: '30px',
                background: 'white',
                borderRadius: '8px',
                fontSize: '64px',
                textAlign: 'center',
                border: '2px solid #e0e0e0'
              }}>
                {recognizedText}
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '10px', color: '#666' }}>LaTeX Kodu:</h4>
              <div style={{
                padding: '20px',
                background: '#263238',
                color: '#4CAF50',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '24px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                wordBreak: 'break-all'
              }}>
                {latexCode}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => copyToClipboard(latexCode)}
            style={{
              width: '100%',
              padding: '15px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
             LaTeX Kodunu Kopyala
          </button>
        </div>
      )}

      {/* Hzl Eriim */}
      <div className="card\" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}> Sk Kullanlan Semboller</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {commonSymbols.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRecognizedText(item.symbol);
                setLatexCode(item.latex);
              }}
              style={{
                padding: '20px 10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '32px' }}>{item.symbol}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Gemi */}
      {history.length > 0 && (
        <div className="card\" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}> Gemi (Son 10)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map(entry => (
              <div
                key={entry.id}
                style={{
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8f9fa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '32px' }}>{entry.symbol}</div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{entry.description}</div>
                    <div style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>{entry.latex}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{entry.timestamp}</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(entry.latex)}
                  style={{
                    padding: '10px 20px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                   Kopyala
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bilgi */}
      <div className="card\">
        <h3 style={{ marginBottom: '15px' }}> zellikler</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li> Mouse veya dokunmatik ekran ile izim</li>
          <li>Detect Matematiksel sembol tanma (simlasyon)</li>
          <li> LaTeX kod retimi</li>
          <li> Tek tkla kopyalama</li>
          <li> Hzl eriim sembol paleti</li>
          <li> Son 10 tanma gemii</li>
          <li> Temiz izim arayz</li>
        </ul>
      </div>

      <div className="card\" style={{ marginTop: '20px', background: '#fff3cd', border: '2px solid #ffc107' }}>
        <h3 style={{ marginBottom: '10px', color: '#856404' }}> Not</h3>
        <p style={{ color: '#856404', lineHeight: '1.8' }}>
          Bu zellik demo amaldr. Gerek OCR entegrasyonu iin Google Cloud Vision API, Mathpix API veya 
          Microsoft Azure Computer Vision gibi servisler kullanlabilir. u anda rastgele sembol tanma simlasyonu yaplmaktadr.
        </p>
      </div>
    </div>
  );
}
