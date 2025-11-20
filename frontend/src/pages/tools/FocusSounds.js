import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FocusSounds() {
  const navigate = useNavigate();
  const audioContextsRef = useRef({});
  const [playing, setPlaying] = useState({});
  const [volumes, setVolumes] = useState({
    rain: 60,
    ocean: 60,
    white: 40,
    pink: 50,
    forest: 55,
    cafe: 50
  });

  const sounds = [
    { id: 'rain', name: '🌧️ Yağmur Sesi', type: 'rain', description: 'Rahatlatıcı yağmur sesi' },
    { id: 'ocean', name: '🌊 Okyanus Dalgaları', type: 'ocean', description: 'Yumuşak dalga sesleri' },
    { id: 'white', name: '⚪ Beyaz Gürültü', type: 'white', description: 'Odaklanma için ideal' },
    { id: 'pink', name: '💞 Pembe Gürültü', type: 'pink', description: 'Derin konsantrasyon' },
    { id: 'forest', name: '🌳 Orman Sesleri', type: 'forest', description: 'Kuş cıvıltıları ve yaprak hışırtısı' },
    { id: 'cafe', name: '☕ Kafe Ortamı', type: 'cafe', description: 'Arka plan muhabbet sesleri' },
  ];

  // Gelişmiş ve gerçekçi ses motoru
  const createRealisticSound = (type, volume) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 8; // 8 saniye loop
      const bufferSize = sampleRate * duration;
      
      const masterGain = audioContext.createGain();
      masterGain.gain.value = volume / 100;
      masterGain.connect(audioContext.destination);

      if (type === 'rain') {
        // YAĞMUR - Çok daha gerçekçi
        // 1. Temel pink noise (arka plan)
        const rainBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const leftChannel = rainBuffer.getChannelData(0);
        const rightChannel = rainBuffer.getChannelData(1);
        
        let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
        let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;
        
        for (let i = 0; i < bufferSize; i++) {
          // Sol kanal
          const whiteL = Math.random() * 2 - 1;
          b0L = 0.99886 * b0L + whiteL * 0.0555179;
          b1L = 0.99332 * b1L + whiteL * 0.0750759;
          b2L = 0.96900 * b2L + whiteL * 0.1538520;
          b3L = 0.86650 * b3L + whiteL * 0.3104856;
          b4L = 0.55000 * b4L + whiteL * 0.5329522;
          b5L = -0.7616 * b5L - whiteL * 0.0168980;
          leftChannel[i] = (b0L + b1L + b2L + b3L + b4L + b5L + b6L + whiteL * 0.5362) * 0.08;
          b6L = whiteL * 0.115926;
          
          // Sağ kanal (stereo)
          const whiteR = Math.random() * 2 - 1;
          b0R = 0.99886 * b0R + whiteR * 0.0555179;
          b1R = 0.99332 * b1R + whiteR * 0.0750759;
          b2R = 0.96900 * b2R + whiteR * 0.1538520;
          b3R = 0.86650 * b3R + whiteR * 0.3104856;
          b4R = 0.55000 * b4R + whiteR * 0.5329522;
          b5R = -0.7616 * b5R - whiteR * 0.0168980;
          rightChannel[i] = (b0R + b1R + b2R + b3R + b4R + b5R + b6R + whiteR * 0.5362) * 0.08;
          b6R = whiteR * 0.115926;
          
          // Yağmur damlası efektleri
          if (Math.random() < 0.002) {
            const dropLength = Math.floor(Math.random() * 200 + 100);
            for (let j = 0; j < dropLength && i + j < bufferSize; j++) {
              const envelope = Math.exp(-j / 50);
              const freq = 1000 + Math.random() * 2000;
              const sample = Math.sin(2 * Math.PI * freq * j / sampleRate) * envelope * 0.15;
              leftChannel[i + j] += sample;
              rightChannel[i + j] += sample * (0.8 + Math.random() * 0.4);
            }
          }
        }
        
        // Low-pass filter ekle (daha yumuşak)
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;
        
        const source = audioContext.createBufferSource();
        source.buffer = rainBuffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
        
      } else if (type === 'ocean') {
        // OKYANUS - Çok daha gerçekçi dalga sesleri
        const oceanBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const leftChannel = oceanBuffer.getChannelData(0);
        const rightChannel = oceanBuffer.getChannelData(1);
        
        // Dalga modülasyonu
        for (let i = 0; i < bufferSize; i++) {
          const time = i / sampleRate;
          
          // Yavaş dalga hareketi (0.15 Hz)
          const wave1 = Math.sin(2 * Math.PI * 0.15 * time) * 0.5;
          const wave2 = Math.sin(2 * Math.PI * 0.08 * time + Math.PI / 3) * 0.3;
          const wave3 = Math.sin(2 * Math.PI * 0.22 * time + Math.PI / 2) * 0.2;
          
          // Bass frekanslarda kombinasyon
          const bass = Math.sin(2 * Math.PI * 60 * time * (1 + wave1)) * 0.3;
          const mid = Math.sin(2 * Math.PI * 120 * time * (1 + wave2)) * 0.2;
          
          // Köpük sesi (pink noise modülasyonu)
          const foam = (Math.random() * 2 - 1) * 0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * time));
          
          const sample = bass + mid + foam + wave3 * 0.1;
          leftChannel[i] = sample;
          rightChannel[i] = sample * (0.9 + Math.random() * 0.2); // Stereo variation
        }
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;
        
        const source = audioContext.createBufferSource();
        source.buffer = oceanBuffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
        
      } else if (type === 'white') {
        // BEYAZ GÜRÜLTÜ - Temiz ve yumuşak
        const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
          left[i] = (Math.random() * 2 - 1) * 0.5;
          right[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 8000;
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
        
      } else if (type === 'pink') {
        // PEMBE GÜRÜLTÜ - Rahatlatıcı
        const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
        let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;
        
        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          b0L = 0.99886 * b0L + whiteL * 0.0555179;
          b1L = 0.99332 * b1L + whiteL * 0.0750759;
          b2L = 0.96900 * b2L + whiteL * 0.1538520;
          b3L = 0.86650 * b3L + whiteL * 0.3104856;
          b4L = 0.55000 * b4L + whiteL * 0.5329522;
          b5L = -0.7616 * b5L - whiteL * 0.0168980;
          left[i] = (b0L + b1L + b2L + b3L + b4L + b5L + b6L + whiteL * 0.5362) * 0.11;
          b6L = whiteL * 0.115926;
          
          const whiteR = Math.random() * 2 - 1;
          b0R = 0.99886 * b0R + whiteR * 0.0555179;
          b1R = 0.99332 * b1R + whiteR * 0.0750759;
          b2R = 0.96900 * b2R + whiteR * 0.1538520;
          b3R = 0.86650 * b3R + whiteR * 0.3104856;
          b4R = 0.55000 * b4R + whiteR * 0.5329522;
          b5R = -0.7616 * b5R - whiteR * 0.0168980;
          right[i] = (b0R + b1R + b2R + b3R + b4R + b5R + b6R + whiteR * 0.5362) * 0.11;
          b6R = whiteR * 0.115926;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
        
      } else if (type === 'forest') {
        // ORMAN - Kuş cıvıltıları ve yaprak hışırtısı
        const forestBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const left = forestBuffer.getChannelData(0);
        const right = forestBuffer.getChannelData(1);
        
        // Arka plan: Yaprak hışırtısı (yumuşak pink noise)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
          b6 = white * 0.115926;
          
          left[i] = sample;
          right[i] = sample;
          
          // Kuş sesi ekle (rastgele)
          if (Math.random() < 0.0003) {
            const birdDuration = Math.floor(Math.random() * 2000 + 1000);
            const baseFreq = 2000 + Math.random() * 2000;
            for (let j = 0; j < birdDuration && i + j < bufferSize; j++) {
              const t = j / sampleRate;
              const envelope = Math.sin(Math.PI * j / birdDuration) * Math.exp(-t * 2);
              const freqMod = baseFreq * (1 + 0.3 * Math.sin(2 * Math.PI * 8 * t));
              const bird = Math.sin(2 * Math.PI * freqMod * t) * envelope * 0.08;
              
              // Stereo positioning
              const pan = Math.random();
              left[i + j] += bird * (1 - pan);
              right[i + j] += bird * pan;
            }
          }
        }
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 200;
        
        const source = audioContext.createBufferSource();
        source.buffer = forestBuffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
        
      } else if (type === 'cafe') {
        // KAFE - Muhabbet sesleri ve fincan tıkırtıları
        const cafeBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
        const left = cafeBuffer.getChannelData(0);
        const right = cafeBuffer.getChannelData(1);
        
        // Arka plan murmur (düşük frekanslı pink noise)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          
          const murmur = (b0 + b1 + b2 + b3) * 0.05;
          left[i] = murmur;
          right[i] = murmur;
          
          // Fincan/kaşık sesleri
          if (Math.random() < 0.0005) {
            const clickDuration = 50;
            for (let j = 0; j < clickDuration && i + j < bufferSize; j++) {
              const envelope = Math.exp(-j / 10);
              const freq = 3000 + Math.random() * 2000;
              const click = Math.sin(2 * Math.PI * freq * j / sampleRate) * envelope * 0.1;
              const pan = Math.random();
              left[i + j] += click * (1 - pan);
              right[i + j] += click * pan;
            }
          }
          
          // Konuşma sesleri (düşük frekanslı burst)
          if (Math.random() < 0.0002) {
            const talkDuration = Math.floor(Math.random() * 500 + 300);
            const baseFreq = 200 + Math.random() * 300;
            for (let j = 0; j < talkDuration && i + j < bufferSize; j++) {
              const t = j / sampleRate;
              const envelope = Math.sin(Math.PI * j / talkDuration) * 0.5;
              const talk = Math.sin(2 * Math.PI * baseFreq * t) * envelope * 0.06;
              const pan = Math.random();
              left[i + j] += talk * (1 - pan);
              right[i + j] += talk * pan;
            }
          }
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = cafeBuffer;
        source.loop = true;
        source.connect(masterGain);
        source.start(0);
        
        return { audioContext, source, masterGain };
      }
      
    } catch (error) {
      console.error('Ses oluşturulamadı:', error);
      return null;
    }
  };

  const toggleSound = (soundId, type) => {
    if (playing[soundId]) {
      const engine = audioContextsRef.current[soundId];
      if (engine) {
        if (engine.source) engine.source.stop();
        if (engine.audioContext) engine.audioContext.close();
        audioContextsRef.current[soundId] = null;
      }
      setPlaying(prev => ({ ...prev, [soundId]: false }));
    } else {
      const engine = createRealisticSound(type, volumes[soundId] || 50);
      if (engine) {
        audioContextsRef.current[soundId] = engine;
        setPlaying(prev => ({ ...prev, [soundId]: true }));
      }
    }
  };

  const changeVolume = (soundId, volume) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
    const engine = audioContextsRef.current[soundId];
    if (engine?.masterGain) {
      engine.masterGain.gain.value = volume / 100;
    }
  };

  useEffect(() => {
    return () => {
      Object.values(audioContextsRef.current).forEach(engine => {
        if (engine) {
          try {
            if (engine.source) engine.source.stop();
            if (engine.audioContext) engine.audioContext.close();
          } catch (e) {}
        }
      });
    };
  }, []);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🌧️ Odak Sesleri</h1>
        <p className="subtitle">Gerçekçi, rahatlatıcı sesler</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>🎧 Yüksek Kalite Ses Sentezleme</h3>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Tüm sesler Web Audio API ile gerçek zamanlı olarak sentezlenir. Birden fazla sesi karıştırabilir, kendi atmosferinizi yaratabilirsiniz.
        </p>
      </div>

      <div className="grid">
        {sounds.map(sound => (
          <div key={sound.id} className="card" style={{
            background: playing[sound.id] ? 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' : 'white',
            color: playing[sound.id] ? 'white' : '#333',
            border: playing[sound.id] ? '3px solid #4CAF50' : '2px solid #e0e0e0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>
              {sound.name.split(' ')[0]}
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '18px' }}>
              {sound.name.split(' ').slice(1).join(' ')}
            </h3>
            <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.8, marginBottom: '15px' }}>
              {sound.description}
            </p>
            
            <button
              onClick={() => toggleSound(sound.id, sound.type)}
              style={{
                width: '100%',
                padding: '15px',
                background: playing[sound.id] ? '#f44336' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              {playing[sound.id] ? '⏸️ Durdur' : '▶️ Çal'}
            </button>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                Ses: {volumes[sound.id] || 50}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[sound.id] || 50}
                onChange={(e) => changeVolume(sound.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: playing[sound.id] ? '#4CAF50' : '#667eea' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 İpuçları</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>🌧️ <strong>Yağmur:</strong> Rahatlatıcı, uyku ve dinlenme için</li>
          <li>🌊 <strong>Okyanus:</strong> Meditasyon ve derin rahatlamak için</li>
          <li>⚪ <strong>Beyaz Gürültü:</strong> Maksimum odaklanma, dikkat dağılmasını engeller</li>
          <li>💞 <strong>Pembe Gürültü:</strong> Derin çalışma ve konsantrasyon</li>
          <li>🌳 <strong>Orman:</strong> Doğal ortam, stres azaltma</li>
          <li>☕ <strong>Kafe:</strong> Sosyal ortam hissi, yaratıcılık</li>
        </ul>
      </div>
    </div>
  );
}
