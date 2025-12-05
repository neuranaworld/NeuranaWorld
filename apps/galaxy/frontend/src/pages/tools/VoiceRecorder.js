import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoiceRecorder() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('high');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  const qualities = {
    low: { bitrate: 64000, label: 'Düşük (64 kbps)' },
    medium: { bitrate: 128000, label: 'Orta (128 kbps)' },
    high: { bitrate: 192000, label: 'Yüksek (192 kbps)' },
    ultra: { bitrate: 320000, label: 'Ultra (320 kbps)' }
  };

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      if (result.state === 'granted') {
        setHasPermission(true);
      } else if (result.state === 'denied') {
        setHasPermission(false);
      }
    } catch (error) {
      console.log('Permission API desteklenmiyor');
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      streamRef.current = stream;
      setHasPermission(true);
      setupAudioAnalyser(stream);
      return true;
    } catch (error) {
      console.error('Mikrofon erişimi reddedildi:', error);
      setHasPermission(false);
      alert('⚠️ Mikrofon izni gerekli!\n\nTarayıcı ayarlarından mikrofon erişimine izin verin.');
      return false;
    }
  };

  const setupAudioAnalyser = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    monitorAudioLevel();
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const monitor = () => {
      if (!isRecording || isPaused) {
        animationRef.current = requestAnimationFrame(monitor);
        return;
      }
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.round(average));
      
      animationRef.current = requestAnimationFrame(monitor);
    };
    
    monitor();
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }

    try {
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: qualities[selectedQuality].bitrate
      };

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRecording = {
          id: Date.now(),
          url: audioUrl,
          blob: audioBlob,
          duration: recordingTime,
          date: new Date().toLocaleString('tr-TR'),
          quality: selectedQuality,
          size: (audioBlob.size / 1024).toFixed(2) + ' KB'
        };
        setRecordings(prev => [newRecording, ...prev]);
        setRecordingTime(0);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Kayıt başlatılamadı:', error);
      alert('❌ Kayıt başlatılamadı!');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
      setAudioLevel(0);
    }
  };

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  };

  const downloadRecording = (recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `kayit_${recording.id}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🎙️ Ses Kaydedici</h1>
        <p className="subtitle">Profesyonel kalitede ses kayıt sistemi</p>
      </div>

      {hasPermission === false && (
        <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginBottom: '20px' }}>
          <h3 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Mikrofon İzni Gerekli</h3>
          <p style={{ color: '#856404', lineHeight: '1.6' }}>
            Ses kaydı için mikrofon erişim izni gereklidir. Tarayıcınızın adres çubuğundaki mikrofon simgesine tıklayın.
          </p>
          <button
            onClick={requestMicrophoneAccess}
            style={{
              marginTop: '15px',
              padding: '12px 24px',
              background: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎤 Mikrofon İzni İste
          </button>
        </div>
      )}

      {/* Kayıt Kontrolleri */}
      <div className="card" style={{ 
        background: isRecording ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '96px', marginBottom: '20px' }}>
          {isRecording ? (isPaused ? '⏸️' : '🔴') : '🎙️'}
        </div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '10px' }}>
          {formatTime(recordingTime)}
        </div>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          {isRecording ? (isPaused ? 'Kayıt Duraklatıldı' : 'Kayıt Ediliyor...') : 'Kayıt Hazır'}
        </p>

        {isRecording && !isPaused && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              height: '60px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '30px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px'
            }}>
              <div style={{
                height: '40px',
                width: `${(audioLevel / 255) * 100}%`,
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '20px',
                transition: 'width 0.1s ease'
              }} />
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>Ses Seviyesi</p>
          </div>
        )}
      </div>

      {/* Kalite Seçimi */}
      {!isRecording && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>🎚️ Kayıt Kalitesi</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(qualities).map(([key, quality]) => (
              <button
                key={key}
                onClick={() => setSelectedQuality(key)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '15px',
                  borderRadius: '8px',
                  border: selectedQuality === key ? '3px solid #667eea' : '2px solid #e0e0e0',
                  background: selectedQuality === key ? '#667eea' : 'white',
                  color: selectedQuality === key ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {quality.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kontrol Butonları */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={hasPermission === false}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: hasPermission === false ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: hasPermission === false ? 'not-allowed' : 'pointer',
              opacity: hasPermission === false ? 0.5 : 1
            }}
          >
            🔴 Kaydı Başlat
          </button>
        ) : (
          <>
            <button
              onClick={pauseRecording}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '20px',
                fontSize: '20px',
                fontWeight: 'bold',
                background: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              {isPaused ? '▶️ Devam' : '⏸️ Duraklat'}
            </button>
            <button
              onClick={stopRecording}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '20px',
                fontSize: '20px',
                fontWeight: 'bold',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              ⏹️ Durdur
            </button>
          </>
        )}
      </div>

      {/* Kayıtlar Listesi */}
      {recordings.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>📼 Kayıtlarım ({recordings.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recordings.map(recording => (
              <div key={recording.id} style={{
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                      {formatTime(recording.duration)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {recording.date} • {recording.size} • {qualities[recording.quality].label}
                    </div>
                  </div>
                </div>
                
                <audio 
                  controls 
                  src={recording.url} 
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => downloadRecording(recording)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    💾 İndir
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Özellikler</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>Yüksek kaliteli ses kaydı (48kHz sample rate)</li>
          <li>4 farklı kalite seviyesi (64-320 kbps)</li>
          <li>Duraklat/Devam özelliği</li>
          <li>Canlı ses seviyesi göstergesi</li>
          <li>Otomatik gürültü önleme ve echo cancellation</li>
          <li>Kayıtları indirme ve silme</li>
          <li>Tarayıcı içinde çalışır, sunucu gerektirmez</li>
        </ul>
      </div>
    </div>
  );
}
