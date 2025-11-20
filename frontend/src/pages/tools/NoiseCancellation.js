import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoiseCancellation() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [reducedLevel, setReducedLevel] = useState(0);
  const [mode, setMode] = useState('balanced');
  const [outputMode, setOutputMode] = useState('headphones'); // 'headphones' veya 'speaker'
  const [error, setError] = useState('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const reducedAnalyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const gainNodeRef = useRef(null);
  const animationRef = useRef(null);
  const gainIntervalRef = useRef(null);
  const feedbackHistoryRef = useRef([]);

  const modes = {
    gentle: { 
      threshold: 0.1, 
      ratio: 0.3, 
      name: 'Hafif', 
      emoji: '🌿',
      attack: 0.01,
      release: 0.1
    },
    balanced: { 
      threshold: 0.05, 
      ratio: 0.6, 
      name: 'Dengeli', 
      emoji: '⚖️',
      attack: 0.005,
      release: 0.05
    },
    aggressive: { 
      threshold: 0.02, 
      ratio: 0.85, 
      name: 'Agresif', 
      emoji: '💪',
      attack: 0.001,
      release: 0.03
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (gainIntervalRef.current) {
      clearInterval(gainIntervalRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const requestMicrophonePermission = async () => {
    setError('');
    try {
      console.log('Mikrofon izni isteniyor...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: outputMode === 'speaker', // Hoparlör modunda echo cancellation aktif
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      streamRef.current = stream;
      setHasPermission(true);
      console.log('Mikrofon izni verildi');
      return true;
    } catch (error) {
      console.error('Mikrofon erişimi hatası:', error);
      setError(`Mikrofon erişimi reddedildi: ${error.message}`);
      setHasPermission(false);
      alert('⚠️ Mikrofon izni gerekli!\n\nTarayıcı ayarlarından mikrofon erişimine izin verin.');
      return false;
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      console.log('Mikrofon izin durumu:', result.state);
      
      if (result.state === 'granted') {
        return await requestMicrophonePermission();
      } else if (result.state === 'prompt') {
        return await requestMicrophonePermission();
      } else {
        setError('Mikrofon izni reddedilmiş. Tarayıcı ayarlarından izin verin.');
        setHasPermission(false);
        return false;
      }
    } catch (error) {
      console.log('Permission API desteklenmiyor, doğrudan izin isteniyor');
      return await requestMicrophonePermission();
    }
  };

  const startNoiseCancellation = async () => {
    setError('');
    
    if (hasPermission !== true) {
      const granted = await checkMicrophonePermission();
      if (!granted) return;
    }

    try {
      console.log(`Noise cancellation başlatılıyor - ${outputMode} modu...`);
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext({ sampleRate: 48000 });
      const audioContext = audioContextRef.current;

      sourceRef.current = audioContext.createMediaStreamSource(streamRef.current);
      
      // Input analyser
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.3;
      
      // Output analyser
      reducedAnalyserRef.current = audioContext.createAnalyser();
      reducedAnalyserRef.current.fftSize = 2048;
      reducedAnalyserRef.current.smoothingTimeConstant = 0.3;

      // Gain node
      gainNodeRef.current = audioContext.createGain();
      
      if (outputMode === 'speaker') {
        // HOPARLÖR MODU: ÇOK AGRESİF
        gainNodeRef.current.gain.value = 0.05; // %95 azaltma başlangıç
      } else {
        // KULAKLIK MODU
        gainNodeRef.current.gain.value = 1.0;
      }

      // Dynamics Compressor
      const compressor = audioContext.createDynamicsCompressor();
      if (outputMode === 'speaker') {
        // Hoparlör için çok agresif
        compressor.threshold.value = -60;
        compressor.knee.value = 30;
        compressor.ratio.value = 20; // Çok yüksek ratio
        compressor.attack.value = 0.001;
        compressor.release.value = 0.1;
      } else {
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
      }

      // HOPARLÖR MODU: Çoklu Feedback Önleme Filtreleri
      const filters = [];
      
      if (outputMode === 'speaker') {
        // 1. Çok agresif low-pass (hoparlör için)
        const lowpass1 = audioContext.createBiquadFilter();
        lowpass1.type = 'lowpass';
        lowpass1.frequency.value = 2000; // Çok düşük
        lowpass1.Q.value = 0.5;
        filters.push(lowpass1);

        // 2. High-pass
        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 200;
        highpass.Q.value = 0.7;
        filters.push(highpass);

        // 3. Notch filter - feedback frekanslarını kes
        const notchFrequencies = [500, 1000, 1500, 2000, 2500];
        notchFrequencies.forEach(freq => {
          const notch = audioContext.createBiquadFilter();
          notch.type = 'notch';
          notch.frequency.value = freq;
          notch.Q.value = 10; // Dar kesim
          filters.push(notch);
        });

        // 4. İkinci low-pass (ekstra güvenlik)
        const lowpass2 = audioContext.createBiquadFilter();
        lowpass2.type = 'lowpass';
        lowpass2.frequency.value = 1500;
        lowpass2.Q.value = 1;
        filters.push(lowpass2);

      } else {
        // Kulaklık modu: Normal filtreler
        const lowpass = audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 3000;
        lowpass.Q.value = 1;
        filters.push(lowpass);

        const highpass = audioContext.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 100;
        highpass.Q.value = 1;
        filters.push(highpass);
      }

      // Bağlantılar
      sourceRef.current.connect(analyserRef.current);
      
      let chain = sourceRef.current;
      filters.forEach(filter => {
        chain.connect(filter);
        chain = filter;
      });
      
      chain.connect(compressor);
      compressor.connect(gainNodeRef.current);
      gainNodeRef.current.connect(reducedAnalyserRef.current);
      gainNodeRef.current.connect(audioContext.destination);

      setIsActive(true);
      console.log('Noise cancellation aktif');
      
      if (outputMode === 'speaker') {
        startAggressiveFeedbackPrevention();
      } else {
        startDynamicGainControl(modes[mode]);
      }
      
      monitorAudioLevels();

    } catch (error) {
      console.error('Noise cancellation başlatılamadı:', error);
      setError(`Ses işleme hatası: ${error.message}`);
      alert('❌ Ses işleme başlatılamadı!');
    }
  };

  const startAggressiveFeedbackPrevention = () => {
    // Hoparlör modu: Çok agresif feedback önleme
    gainIntervalRef.current = setInterval(() => {
      if (!isActive || !analyserRef.current || !gainNodeRef.current) {
        if (gainIntervalRef.current) {
          clearInterval(gainIntervalRef.current);
        }
        return;
      }

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // RMS hesaplama
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length) / 255;

      // Feedback tespiti
      feedbackHistoryRef.current.push(rms);
      if (feedbackHistoryRef.current.length > 10) {
        feedbackHistoryRef.current.shift();
      }

      // Ani artış kontrolü (feedback'i yakala)
      let isIncreasing = true;
      for (let i = 1; i < feedbackHistoryRef.current.length; i++) {
        if (feedbackHistoryRef.current[i] <= feedbackHistoryRef.current[i-1]) {
          isIncreasing = false;
          break;
        }
      }

      if (isIncreasing && feedbackHistoryRef.current.length >= 5) {
        // FEEDBACK TESPİT EDİLDİ! Sesi acilen kes
        console.warn('FEEDBACK TESPİT EDİLDİ! Ses kesiliyor...');
        gainNodeRef.current.gain.setValueAtTime(
          gainNodeRef.current.gain.value,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.001,
          audioContextRef.current.currentTime + 0.001
        );
        feedbackHistoryRef.current = [];
        
        // 100ms sonra normale dön
        setTimeout(() => {
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.setValueAtTime(
              0.001,
              audioContextRef.current.currentTime
            );
            gainNodeRef.current.gain.exponentialRampToValueAtTime(
              0.05,
              audioContextRef.current.currentTime + 0.5
            );
          }
        }, 100);
      } else {
        // Normal işlem: Çok düşük seviyede tut
        const targetGain = rms < 0.02 ? 0.02 : 0.05; // %95-98 azaltma
        
        gainNodeRef.current.gain.setValueAtTime(
          gainNodeRef.current.gain.value,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.linearRampToValueAtTime(
          targetGain,
          audioContextRef.current.currentTime + 0.05
        );
      }
    }, 30); // 30ms - çok hızlı kontrol
  };

  const startDynamicGainControl = (modeConfig) => {
    // Kulaklık modu: Normal gain kontrol
    gainIntervalRef.current = setInterval(() => {
      if (!isActive || !analyserRef.current || !gainNodeRef.current) {
        if (gainIntervalRef.current) {
          clearInterval(gainIntervalRef.current);
        }
        return;
      }

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length) / 255;

      if (rms < modeConfig.threshold) {
        const targetGain = modeConfig.ratio;
        const currentGain = gainNodeRef.current.gain.value;
        gainNodeRef.current.gain.setValueAtTime(
          currentGain,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.linearRampToValueAtTime(
          targetGain,
          audioContextRef.current.currentTime + modeConfig.attack
        );
      } else {
        const currentGain = gainNodeRef.current.gain.value;
        gainNodeRef.current.gain.setValueAtTime(
          currentGain,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.linearRampToValueAtTime(
          1.0,
          audioContextRef.current.currentTime + modeConfig.release
        );
      }
    }, 50);
  };

  const stopNoiseCancellation = () => {
    console.log('Noise cancellation durduruluyor...');
    setIsActive(false);
    cleanup();
    setNoiseLevel(0);
    setReducedLevel(0);
    feedbackHistoryRef.current = [];
  };

  const monitorAudioLevels = () => {
    if (!analyserRef.current || !reducedAnalyserRef.current) return;

    const inputData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const outputData = new Uint8Array(reducedAnalyserRef.current.frequencyBinCount);
    
    const monitor = () => {
      if (!isActive || !analyserRef.current || !reducedAnalyserRef.current) {
        return;
      }
      
      analyserRef.current.getByteFrequencyData(inputData);
      const inputAverage = inputData.reduce((a, b) => a + b) / inputData.length;
      setNoiseLevel(Math.round(inputAverage));
      
      reducedAnalyserRef.current.getByteFrequencyData(outputData);
      const outputAverage = outputData.reduce((a, b) => a + b) / outputData.length;
      setReducedLevel(Math.round(outputAverage));
      
      animationRef.current = requestAnimationFrame(monitor);
    };
    
    monitor();
  };

  const reductionPercentage = noiseLevel > 0 
    ? Math.round(((noiseLevel - reducedLevel) / noiseLevel) * 100) 
    : 0;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🎧 Aktif Gürültü Engelleme</h1>
        <p className="subtitle">Gerçek zamanlı ses filtreleme - Kulaklık & Hoparlör</p>
      </div>

      {error && (
        <div className="card" style={{ background: '#ffebee', border: '2px solid #f44336', marginBottom: '20px' }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>❌ Hata</h3>
          <p style={{ color: '#c62828' }}>{error}</p>
          <button
            onClick={checkMicrophonePermission}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {hasPermission === false && (
        <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
          <h3 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Mikrofon İzni Gerekli</h3>
          <p style={{ color: '#856404', lineHeight: '1.6' }}>
            Bu özellik mikrofonunuza erişim izni gerektirir.
          </p>
          <button
            onClick={checkMicrophonePermission}
            style={{
              marginTop: '15px',
              padding: '12px 24px',
              background: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            🎤 Mikrofon İzni İste
          </button>
        </div>
      )}

      {/* Çıkış Modu Seçimi */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>🔊 Ses Çıkışı</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setOutputMode('headphones')}
            disabled={isActive}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '25px',
              borderRadius: '12px',
              border: outputMode === 'headphones' ? '3px solid #4CAF50' : '2px solid #e0e0e0',
              background: outputMode === 'headphones' ? '#4CAF50' : 'white',
              color: outputMode === 'headphones' ? 'white' : '#333',
              cursor: isActive ? 'not-allowed' : 'pointer',
              opacity: isActive ? 0.5 : 1,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎧</div>
            Kulaklık
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
              Önerilen • En iyi kalite
            </div>
          </button>

          <button
            onClick={() => setOutputMode('speaker')}
            disabled={isActive}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '25px',
              borderRadius: '12px',
              border: outputMode === 'speaker' ? '3px solid #FF9800' : '2px solid #e0e0e0',
              background: outputMode === 'speaker' ? '#FF9800' : 'white',
              color: outputMode === 'speaker' ? 'white' : '#333',
              cursor: isActive ? 'not-allowed' : 'pointer',
              opacity: isActive ? 0.5 : 1,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔊</div>
            Hoparlör
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
              Deneysel • %95 azaltma
            </div>
          </button>
        </div>
      </div>

      {outputMode === 'speaker' && (
        <div className="card" style={{ background: '#ffebee', border: '2px solid #f44336', marginBottom: '20px' }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>⚠️ HOPARLÖR MODU UYARISI</h3>
          <ul style={{ lineHeight: '1.8', paddingLeft: '20px', color: '#c62828', fontWeight: 'bold' }}>
            <li>Ses %95-98 oranında azaltılacak</li>
            <li>Feedback önleme aktif (30ms kontrol)</li>
            <li>Hoparlör ses seviyesini DÜŞÜK tutun</li>
            <li>Mikrofon ve hoparlörü mümkün olduğunca UZAK tutun</li>
            <li>İlk 5 saniye dikkatli dinleyin</li>
            <li>Feedback olursa otomatik kapanır</li>
          </ul>
        </div>
      )}

      <div className="card" style={{ 
        background: isActive ? 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '96px', marginBottom: '20px' }}>
          {isActive ? (outputMode === 'speaker' ? '🔊' : '🎧') : '🎤'}
        </div>
        <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
          {isActive ? 'Aktif ✅' : 'İnaktif'}
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          {isActive 
            ? (outputMode === 'speaker' ? 'Hoparlör modu - Agresif filtreleme aktif' : 'Kulaklık modu - Normal filtreleme aktif')
            : hasPermission === true ? 'Başlatmak için butona basın' : 'Mikrofon izni verin'}
        </p>
        
        {isActive && reductionPercentage > 0 && (
          <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
            🎯 %{reductionPercentage} Azaltma
          </div>
        )}
      </div>

      {isActive && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#f44336' }}>📥 Orijinal</h3>
            <div style={{ 
              height: '80px', 
              background: '#f0f0f0', 
              borderRadius: '12px', 
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(noiseLevel / 255) * 100}%`,
                background: '#f44336',
                transition: 'width 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>
                {noiseLevel > 20 && `${Math.round((noiseLevel / 255) * 100)}%`}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#4CAF50' }}>📤 Filtrelenmiş</h3>
            <div style={{ 
              height: '80px', 
              background: '#f0f0f0', 
              borderRadius: '12px', 
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(reducedLevel / 255) * 100}%`,
                background: '#4CAF50',
                transition: 'width 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>
                {reducedLevel > 20 && `${Math.round((reducedLevel / 255) * 100)}%`}
              </div>
            </div>
          </div>
        </div>
      )}

      {outputMode === 'headphones' && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Filtreleme Modu</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(modes).map(([key, modeData]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                disabled={isActive}
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '20px',
                  borderRadius: '12px',
                  border: mode === key ? '3px solid #667eea' : '2px solid #e0e0e0',
                  background: mode === key ? '#667eea' : 'white',
                  color: mode === key ? 'white' : '#333',
                  cursor: isActive ? 'not-allowed' : 'pointer',
                  opacity: isActive ? 0.5 : 1,
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{modeData.emoji}</div>
                {modeData.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={isActive ? stopNoiseCancellation : startNoiseCancellation}
        disabled={hasPermission === false}
        style={{
          width: '100%',
          padding: '24px',
          fontSize: '24px',
          fontWeight: 'bold',
          background: isActive ? '#f44336' : (hasPermission === false ? '#ccc' : (outputMode === 'speaker' ? '#FF9800' : '#4CAF50')),
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: hasPermission === false ? 'not-allowed' : 'pointer',
          marginBottom: '30px',
          opacity: hasPermission === false ? 0.5 : 1
        }}
      >
        {isActive ? '⏹️ Durdur' : (hasPermission === false ? '🔒 İzin Gerekli' : '▶️ Başlat')}
      </button>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>💡 Hoparlör Modu Nasıl Çalışır?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li><strong>%95-98 Ses Azaltma:</strong> Başlangıçta 0.02-0.05 gain (çok düşük)</li>
          <li><strong>5 Notch Filter:</strong> 500-2500Hz feedback frekanslarını keser</li>
          <li><strong>Çift Low-pass:</strong> 1500Hz ve 2000Hz kesim noktaları</li>
          <li><strong>Feedback Algılama:</strong> 30ms'de bir kontrol, ani artışları tespit eder</li>
          <li><strong>Otomatik Kesme:</strong> Feedback tespit edilirse 1ms'de sesi keser</li>
          <li><strong>Echo Cancellation:</strong> Tarayıcı düzeyinde echo önleme aktif</li>
          <li><strong>Agresif Compressor:</strong> 20:1 ratio ile seviye kontrolü</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>📊 Karşılaştırma</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Özellik</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>🎧 Kulaklık</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>🔊 Hoparlör</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Ses Azaltma</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>%60-85</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>%95-98</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Feedback Riski</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>✅ Yok</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>⚠️ Var (önleniyor)</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Kontrol Hızı</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>50ms</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>30ms</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Ses Kalitesi</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>⭐⭐⭐⭐⭐</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>⭐⭐⭐</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Tavsiye</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>✅ Önerilen</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>⚠️ Deneysel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
