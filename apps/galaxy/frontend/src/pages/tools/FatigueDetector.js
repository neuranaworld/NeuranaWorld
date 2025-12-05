import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FatigueDetector() {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [fatigueLevel, setFatigueLevel] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    avgResponseTime: 0,
    errorRate: 0
  });
  const sessionRef = useRef(null);
  const lastAnswerTime = useRef(Date.now());

  useEffect(() => {
    if (isTracking && sessionData.length > 0) {
      analyzeFatigue();
    }
  }, [sessionData, isTracking]);

  const analyzeFatigue = () => {
    if (sessionData.length < 5) return;

    const recentData = sessionData.slice(-10);
    const oldData = sessionData.slice(0, Math.min(10, sessionData.length - 10));

    // Hata oran art
    const recentErrors = recentData.filter(d => !d.correct).length / recentData.length;
    const oldErrors = oldData.length > 0 ? oldData.filter(d => !d.correct).length / oldData.length : 0;
    const errorIncrease = recentErrors - oldErrors;

    // Yant sresi art
    const recentAvgTime = recentData.reduce((sum, d) => sum + d.responseTime, 0) / recentData.length;
    const oldAvgTime = oldData.length > 0 ? oldData.reduce((sum, d) => sum + d.responseTime, 0) / oldData.length : recentAvgTime;
    const timeIncrease = (recentAvgTime - oldAvgTime) / oldAvgTime;

    // Yorgunluk skoru (0-100)
    let fatigue = 0;
    
    // Hata art etkisi (%50 arlk)
    if (errorIncrease > 0.3) fatigue += 50;
    else if (errorIncrease > 0.2) fatigue += 35;
    else if (errorIncrease > 0.1) fatigue += 20;

    // Yant sresi art etkisi (%30 arlk)
    if (timeIncrease > 0.5) fatigue += 30;
    else if (timeIncrease > 0.3) fatigue += 20;
    else if (timeIncrease > 0.15) fatigue += 10;

    // Srekli hata serisi (%20 arlk)
    const consecutiveErrors = getConsecutiveErrors(recentData);
    if (consecutiveErrors >= 5) fatigue += 20;
    else if (consecutiveErrors >= 3) fatigue += 10;

    setFatigueLevel(Math.min(100, fatigue));

    // Uyarlar
    if (fatigue >= 70 && !alerts.find(a => a.level === 'critical')) {
      addAlert('critical', 'Kritik yorgunluk seviyesi! Mola vermeniz iddetle nerilir.');
      sendNotification(' Mola Zaman!', 'Yorgunluk seviyeniz ok yksek. Ltfen dinlenin.');
    } else if (fatigue >= 50 && !alerts.find(a => a.level === 'warning')) {
      addAlert('warning', 'Yorgunluk artyor. Ksa bir mola dnebilirsiniz.');
    } else if (fatigue >= 30 && !alerts.find(a => a.level === 'info')) {
      addAlert('info', 'Hafif yorgunluk belirtileri. Dikkatli olun.');
    }
  };

  const getConsecutiveErrors = (data) => {
    let max = 0;
    let current = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (!data[i].correct) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    }
    return max;
  };

  const addAlert = (level, message) => {
    const newAlert = {
      id: Date.now(),
      level,
      message,
      time: new Date().toLocaleTimeString('tr-TR')
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '' });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setSessionData([]);
    setAlerts([]);
    setFatigueLevel(0);
    setCurrentSession({
      startTime: Date.now(),
      type: 'practice'
    });
    sessionRef.current = Date.now();
    requestNotificationPermission();
  };

  const stopTracking = () => {
    setIsTracking(false);
    setCurrentSession(null);
    calculateStats();
  };

  const logAnswer = (correct) => {
    const now = Date.now();
    const responseTime = now - lastAnswerTime.current;
    
    const entry = {
      id: Date.now(),
      correct,
      responseTime: Math.min(responseTime, 60000), // Max 60 saniye
      timestamp: now
    };
    
    setSessionData(prev => [...prev, entry]);
    lastAnswerTime.current = now;
  };

  const calculateStats = () => {
    if (sessionData.length === 0) return;

    const correct = sessionData.filter(d => d.correct).length;
    const incorrect = sessionData.length - correct;
    const avgTime = sessionData.reduce((sum, d) => sum + d.responseTime, 0) / sessionData.length;
    const errorRate = (incorrect / sessionData.length) * 100;

    setStats({
      totalAttempts: sessionData.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      avgResponseTime: Math.round(avgTime / 1000),
      errorRate: Math.round(errorRate)
    });
  };

  const getFatigueColor = () => {
    if (fatigueLevel >= 70) return '#f44336';
    if (fatigueLevel >= 50) return '#FF9800';
    if (fatigueLevel >= 30) return '#FFC107';
    return '#4CAF50';
  };

  const getFatigueText = () => {
    if (fatigueLevel >= 70) return 'Kritik';
    if (fatigueLevel >= 50) return 'Yksek';
    if (fatigueLevel >= 30) return 'Orta';
    return 'Normal';
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">&larr; Ana Men</button>
      
      <div className="header-gradient">
        <h1 className="title">&#128564; Yorgunluk Alglama</h1>
        <p className="subtitle">Hata art analizi ile akll uyar sistemi</p>
      </div>

      {/* Yorgunluk Gstergesi */}
      {isTracking && (
        <div className="card\" style={{ 
          background: `linear-gradient(135deg, ${getFatigueColor()} 0%, ${getFatigueColor()}dd 100%)`,
          color: 'white',
          marginBottom: '30px',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}>
            {fatigueLevel >= 70 ? '' : fatigueLevel >= 50 ? '' : fatigueLevel >= 30 ? '' : ''}
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
            Yorgunluk Seviyesi: {getFatigueText()}
          </h2>
          <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '20px' }}>
            {fatigueLevel}%
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.3)', height: '30px', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${fatigueLevel}%`,
              background: 'white',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}

      {/* Test Alan */}
      {isTracking && (
        <div className="card\" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}> Test Alan</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Aadaki butonlara tklayarak cevaplarnz simle edin. Sistem hata orannz ve yant srelerinizi analiz edecek.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => logAnswer(true)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '30px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
               Doru Cevap
            </button>
            <button
              onClick={() => logAnswer(false)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '30px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
               Yanl Cevap
            </button>
          </div>

          <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#999' }}>
            Toplam cevap: {sessionData.length} | Son 10: {sessionData.slice(-10).filter(d => !d.correct).length} hata
          </p>
        </div>
      )}

      {/* statistikler */}
      {isTracking && sessionData.length > 0 && (
        <div className="grid\" style={{ marginBottom: '30px' }}>
          <div className="card\" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{sessionData.length}</div>
            <div style={{ color: '#666' }}>Toplam Cevap</div>
          </div>
          <div className="card\" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
              {sessionData.filter(d => d.correct).length}
            </div>
            <div style={{ color: '#666' }}>Doru</div>
          </div>
          <div className="card\" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>
              {sessionData.filter(d => !d.correct).length}
            </div>
            <div style={{ color: '#666' }}>Yanl</div>
          </div>
          <div className="card\" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>
              {(sessionData.reduce((sum, d) => sum + d.responseTime, 0) / sessionData.length / 1000).toFixed(1)}s
            </div>
            <div style={{ color: '#666' }}>Ort. Sre</div>
          </div>
        </div>
      )}

      {/* Uyarlar */}
      {alerts.length > 0 && (
        <div className="card\" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}> Uyarlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  background: alert.level === 'critical' ? '#ffebee' : alert.level === 'warning' ? '#fff3e0' : '#e3f2fd',
                  border: `2px solid ${alert.level === 'critical' ? '#f44336' : alert.level === 'warning' ? '#FF9800' : '#2196F3'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{alert.message}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{alert.time}</div>
                </div>
                <div style={{ fontSize: '32px' }}>
                  {alert.level === 'critical' ? '' : alert.level === 'warning' ? '' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kontrol */}
      <div className="card\" style={{ marginBottom: '30px' }}>
        <button
          onClick={isTracking ? stopTracking : startTracking}
          style={{
            width: '100%',
            padding: '20px',
            background: isTracking ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isTracking ? ' Takibi Durdur' : ' Takibi Balat'}
        </button>
      </div>

      {/* Nasl alr */}
      <div className="card\">
        <h3 style={{ marginBottom: '15px' }}> Nasl alr?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li><strong>Hata Oran Analizi:</strong> Son 10 cevabnz ilk 10 ile karlatrr</li>
          <li><strong>Yant Sresi:</strong> Cevap verme hznzdaki yavalamay tespit eder</li>
          <li><strong>Srekli Hata Serisi:</strong> Art arda yaplan hatalar sayar</li>
          <li><strong>3 Seviyeli Uyar:</strong> Info (30%), Warning (50%), Critical (70%)</li>
          <li><strong>Otomatik Bildirim:</strong> Kritik seviyede tarayc bildirimi gnderir</li>
          <li><strong>Gerek Zamanl:</strong> Her cevap sonras analiz yaplr</li>
        </ul>
      </div>

      <div className="card\" style={{ marginTop: '20px', background: '#e3f2fd', border: '2px solid #2196F3' }}>
        <h3 style={{ marginBottom: '10px', color: '#1976D2' }}> Yorgunluk Belirtileri</h3>
        <ul style={{ lineHeight: '1.8', paddingLeft: '20px', color: '#1565C0' }}>
          <li>Hata orannda %20+ art  Hafif yorgunluk</li>
          <li>Hata orannda %30+ art  Orta yorgunluk</li>
          <li>Yant sresinde %30+ art  Konsantrasyon kayb</li>
          <li>5+ art arda hata  Dinlenme gerekiyor</li>
          <li>Kritik seviye  Mutlaka mola verin!</li>
        </ul>
      </div>
    </div>
  );
}
