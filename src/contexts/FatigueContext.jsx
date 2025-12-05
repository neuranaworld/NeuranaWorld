import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const FatigueContext = createContext();

export const useFatigue = () => {
  const context = useContext(FatigueContext);
  if (!context) {
    throw new Error('useFatigue must be used within FatigueProvider');
  }
  return context;
};

export const FatigueProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [fatigueLevel, setFatigueLevel] = useState(0);
  const [sessionData, setSessionData] = useState([]);
  const [stats, setStats] = useState({
    totalActions: 0,
    errors: 0,
    avgResponseTime: 0,
    sessionDuration: 0
  });
  const [notifications, setNotifications] = useState([]);
  
  const sessionStartRef = useRef(null);
  const lastActionRef = useRef(Date.now());
  const activityHistoryRef = useRef([]);
  const analysisIntervalRef = useRef(null);

  // Arka plan analizi
  useEffect(() => {
    if (isTracking) {
      analysisIntervalRef.current = setInterval(() => {
        analyzeFatigueInBackground();
      }, 30000); // 30 saniyede bir analiz

      return () => {
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
        }
      };
    }
  }, [isTracking, sessionData]);

  // LocalStorage'dan veriyi yükle
  useEffect(() => {
    const saved = localStorage.getItem('fatigue_tracking');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.isTracking && Date.now() - data.sessionStart < 24 * 60 * 60 * 1000) {
        setIsTracking(true);
        setSessionData(data.sessionData || []);
        sessionStartRef.current = data.sessionStart;
      }
    }
  }, []);

  // Veriyi kaydet
  useEffect(() => {
    if (isTracking) {
      localStorage.setItem('fatigue_tracking', JSON.stringify({
        isTracking,
        sessionStart: sessionStartRef.current,
        sessionData: sessionData.slice(-100) // Son 100 kayıt
      }));
    }
  }, [isTracking, sessionData]);

  const startTracking = () => {
    setIsTracking(true);
    sessionStartRef.current = Date.now();
    setSessionData([]);
    setNotifications([]);
    activityHistoryRef.current = [];
    
    // Notification izni iste
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
  };

  const logAction = (type, success = true, metadata = {}) => {
    if (!isTracking) return;

    const now = Date.now();
    const responseTime = now - lastActionRef.current;

    const action = {
      id: now,
      type, // 'answer', 'click', 'navigation', 'input', etc.
      success,
      responseTime: Math.min(responseTime, 60000),
      timestamp: now,
      metadata
    };

    setSessionData(prev => [...prev, action]);
    lastActionRef.current = now;

    // Her 10 aksiyonda bir mini analiz
    if (sessionData.length % 10 === 0) {
      quickAnalysis();
    }
  };

  const quickAnalysis = () => {
    if (sessionData.length < 10) return;

    const recent = sessionData.slice(-10);
    const errorRate = recent.filter(a => !a.success).length / recent.length;

    if (errorRate > 0.5) {
      addNotification('warning', 'Hata oranı yükseliyor. Dikkatli olun.');
    }
  };

  const analyzeFatigueInBackground = () => {
    if (sessionData.length < 20) return;

    const recentData = sessionData.slice(-20);
    const olderData = sessionData.slice(Math.max(0, sessionData.length - 40), -20);

    if (olderData.length === 0) return;

    // Hata oranı karşılaştırması
    const recentErrors = recentData.filter(d => !d.success).length / recentData.length;
    const olderErrors = olderData.filter(d => !d.success).length / olderData.length;
    const errorIncrease = recentErrors - olderErrors;

    // Yanıt süresi karşılaştırması
    const recentAvgTime = recentData.reduce((sum, d) => sum + d.responseTime, 0) / recentData.length;
    const olderAvgTime = olderData.reduce((sum, d) => sum + d.responseTime, 0) / olderData.length;
    const timeIncrease = olderAvgTime > 0 ? (recentAvgTime - olderAvgTime) / olderAvgTime : 0;

    // Yorgunluk skoru hesapla
    let fatigue = 0;

    if (errorIncrease > 0.3) fatigue += 40;
    else if (errorIncrease > 0.2) fatigue += 25;
    else if (errorIncrease > 0.1) fatigue += 15;

    if (timeIncrease > 0.5) fatigue += 30;
    else if (timeIncrease > 0.3) fatigue += 20;
    else if (timeIncrease > 0.15) fatigue += 10;

    // Sürekli hata serisi
    let consecutiveErrors = 0;
    for (let i = recentData.length - 1; i >= 0; i--) {
      if (!recentData[i].success) consecutiveErrors++;
      else break;
    }
    if (consecutiveErrors >= 5) fatigue += 20;
    else if (consecutiveErrors >= 3) fatigue += 10;

    // Oturum süresi etkisi
    const sessionDuration = (Date.now() - sessionStartRef.current) / (60 * 60 * 1000); // saat
    if (sessionDuration > 3) fatigue += 10;
    if (sessionDuration > 2) fatigue += 5;

    const finalFatigue = Math.min(100, Math.max(0, fatigue));
    setFatigueLevel(finalFatigue);

    // İstatistikler güncelle
    updateStats();

    // Uyarılar
    if (finalFatigue >= 70 && !notifications.find(n => n.level === 'critical')) {
      addNotification('critical', 'Kritik yorgunluk seviyesi! Lütfen mola verin.');
      sendBrowserNotification('Mola Zamanı!', 'Yorgunluk seviyeniz çok yüksek.');
    } else if (finalFatigue >= 50 && !notifications.find(n => n.level === 'warning')) {
      addNotification('warning', 'Yorgunluk artıyor. 10 dakika mola önerilir.');
    }
  };

  const updateStats = () => {
    const totalActions = sessionData.length;
    const errors = sessionData.filter(d => !d.success).length;
    const avgTime = sessionData.length > 0 
      ? sessionData.reduce((sum, d) => sum + d.responseTime, 0) / sessionData.length 
      : 0;
    const duration = sessionStartRef.current 
      ? (Date.now() - sessionStartRef.current) / 1000 
      : 0;

    setStats({
      totalActions,
      errors,
      avgResponseTime: Math.round(avgTime / 1000),
      sessionDuration: Math.round(duration / 60)
    });
  };

  const addNotification = (level, message) => {
    const notification = {
      id: Date.now(),
      level,
      message,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const sendBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { 
        body, 
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const getFatigueStatus = () => {
    if (fatigueLevel >= 70) return { level: 'critical', text: 'Kritik', color: '#f44336' };
    if (fatigueLevel >= 50) return { level: 'high', text: 'Yüksek', color: '#FF9800' };
    if (fatigueLevel >= 30) return { level: 'medium', text: 'Orta', color: '#FFC107' };
    return { level: 'normal', text: 'Normal', color: '#4CAF50' };
  };

  const value = {
    isTracking,
    fatigueLevel,
    sessionData,
    stats,
    notifications,
    startTracking,
    stopTracking,
    logAction,
    getFatigueStatus
  };

  return (
    <FatigueContext.Provider value={value}>
      {children}
    </FatigueContext.Provider>
  );
};
