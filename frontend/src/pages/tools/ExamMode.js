import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExamMode() {
  const navigate = useNavigate();
  const [isExamActive, setIsExamActive] = useState(false);
  const [examConfig, setExamConfig] = useState({
    duration: 60, // dakika
    lockScreen: true,
    disableCopy: true,
    randomizeQuestions: true,
    showTimer: true
  });
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examStartTime, setExamStartTime] = useState(null);
  const [violations, setViolations] = useState([]);
  const timerRef = useRef(null);
  const visibilityRef = useRef(null);

  useEffect(() => {
    if (isExamActive) {
      startExam();
      
      // Tab deitirme kontrol
      const handleVisibilityChange = () => {
        if (document.hidden) {
          logViolation('Sekme deitirme tespit edildi');
        }
      };
      
      // Kopyalama engelleme
      const handleCopy = (e) => {
        if (examConfig.disableCopy) {
          e.preventDefault();
          logViolation('Kopyalama denemesi');
          alert(' Kopyalama snav modunda yasaktr!');
        }
      };
      
      // Sa tk engelleme
      const handleContextMenu = (e) => {
        e.preventDefault();
        logViolation('Sa tk denemesi');
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('contextmenu', handleContextMenu);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isExamActive]);

  const startExam = () => {
    setExamStartTime(Date.now());
    setTimeRemaining(examConfig.duration * 60);
    
    // Timer balat
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Full screen modu
    if (examConfig.lockScreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen baarsz:', err);
      });
    }
  };

  const endExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Full screen'den k
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    setIsExamActive(false);
    calculateScore();
  };

  const logViolation = (type) => {
    setViolations(prev => [...prev, {
      type,
      time: new Date().toLocaleTimeString('tr-TR'),
      timestamp: Date.now()
    }]);
  };

  const calculateScore = () => {
    const correct = Object.entries(answers).filter(([qId, answer]) => {
      const question = questions.find(q => q.id === parseInt(qId));
      return question && question.correctAnswer === answer;
    }).length;
    
    return {
      correct,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    };
  };

  const loadExampleQuestions = () => {
    const exampleQuestions = [
      {
        id: 1,
        question: '2 + 2 ka eder?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        subject: 'Matematik'
      },
      {
        id: 2,
        question: 'Trkiye\'nin bakenti neresidir?',
        options: ['stanbul', 'Ankara', 'zmir', 'Bursa'],
        correctAnswer: 'Ankara',
        subject: 'Corafya'
      },
      {
        id: 3,
        question: 'JavaScript\'te deiken tanmlamak iin kullanlmayan anahtar kelime hangisidir?',
        options: ['var', 'let', 'const', 'define'],
        correctAnswer: 'define',
        subject: 'Programlama'
      },
      {
        id: 4,
        question: 'Ik hz yaklak ka km/s\'dir?',
        options: ['100,000', '200,000', '300,000', '400,000'],
        correctAnswer: '300,000',
        subject: 'Fizik'
      },
      {
        id: 5,
        question: 'HTML\'de paragraf etiketi hangisidir?',
        options: ['<para>', '<p>', '<paragraph>', '<text>'],
        correctAnswer: '<p>',
        subject: 'Web Gelitirme'
      }
    ];
    
    let finalQuestions = [...exampleQuestions];
    if (examConfig.randomizeQuestions) {
      finalQuestions = finalQuestions.sort(() => Math.random() - 0.5);
    }
    
    setQuestions(finalQuestions);
  };

  const startExamMode = () => {
    loadExampleQuestions();
    setIsExamActive(true);
    setAnswers({});
    setCurrentQuestion(0);
    setViolations([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const score = calculateScore();

  if (isExamActive) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f5f5f5',
        padding: '20px',
        userSelect: examConfig.disableCopy ? 'none' : 'auto'
      }}>
        {/* Timer Bar */}
        {examConfig.showTimer && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            background: timeRemaining < 300 ? '#f44336' : '#4CAF50',
            color: 'white',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
               {formatTime(timeRemaining)}
            </div>
            <div style={{ fontSize: '16px' }}>
              Soru {currentQuestion + 1} / {questions.length}
            </div>
            <button
              onClick={endExam}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: '#f44336',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
               Bitir
            </button>
          </div>
        )}

        {/* Question */}
        <div style={{ maxWidth: '800px', margin: '100px auto 20px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {questions[currentQuestion] && (
            <>
              <div style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                 {questions[currentQuestion].subject}
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '30px', color: '#333' }}>
                {questions[currentQuestion].question}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: option }))}
                    style={{
                      padding: '20px',
                      textAlign: 'left',
                      border: answers[questions[currentQuestion].id] === option ? '3px solid #667eea' : '2px solid #e0e0e0',
                      background: answers[questions[currentQuestion].id] === option ? '#f0f0ff' : 'white',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ marginRight: '15px', fontWeight: 'bold', color: '#667eea' }}>
                      {String.fromCharCode(65 + idx)})
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={{ maxWidth: '800px', margin: '20px auto', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            style={{
              padding: '15px 30px',
              background: currentQuestion === 0 ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
             nceki
          </button>
          
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
            style={{
              padding: '15px 30px',
              background: currentQuestion === questions.length - 1 ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: currentQuestion === questions.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Sonraki 
          </button>
        </div>

        {/* Question Grid */}
        <div style={{ maxWidth: '800px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>Soru Haritas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '10px' }}>
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  padding: '15px',
                  border: currentQuestion === idx ? '3px solid #667eea' : '1px solid #ddd',
                  background: answers[q.id] ? '#4CAF50' : '#f5f5f5',
                  color: answers[q.id] ? 'white' : '#333',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">&larr; Ana Men</button>
      
      <div className="header-gradient">
        <h1 className="title"> Snav Modu</h1>
        <p className="subtitle">Offline, kstlamalarla gerek snav deneyimi</p>
      </div>

      {!isExamActive && Object.keys(answers).length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)', color: 'white', marginBottom: '30px', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '96px', marginBottom: '20px' }}></div>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Snav Tamamland!</h2>
          <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '10px' }}>
            {score.percentage}%
          </div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>
            {score.correct} / {score.total} Doru
          </div>
          
          {violations.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}> hlaller ({violations.length})</h3>
              {violations.map((v, idx) => (
                <div key={idx} style={{ fontSize: '14px', opacity: 0.9 }}>
                  {v.time}: {v.type}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}> Snav Ayarlar</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Sre (dakika)</label>
          <input
            type="number"
            value={examConfig.duration}
            onChange={(e) => setExamConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="5"
            max="180"
            style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={examConfig.lockScreen}
              onChange={(e) => setExamConfig(prev => ({ ...prev, lockScreen: e.target.checked }))}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <span style={{ fontSize: '16px' }}> Tam ekran modu (nerilir)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={examConfig.disableCopy}
              onChange={(e) => setExamConfig(prev => ({ ...prev, disableCopy: e.target.checked }))}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <span style={{ fontSize: '16px' }}> Kopyalama engelleme</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={examConfig.randomizeQuestions}
              onChange={(e) => setExamConfig(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <span style={{ fontSize: '16px' }}> Sorular kartr</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={examConfig.showTimer}
              onChange={(e) => setExamConfig(prev => ({ ...prev, showTimer: e.target.checked }))}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <span style={{ fontSize: '16px' }}> Zamanlaycy gster</span>
          </label>
        </div>
      </div>

      <button
        onClick={startExamMode}
        style={{
          width: '100%',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
         Snava Bala
      </button>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}> zellikler</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li> Gerek zamanl geri saym</li>
          <li> Tam ekran kilitleme</li>
          <li> Kopyalama ve sa tk engelleme</li>
          <li> Sekme deitirme tespit</li>
          <li> Otomatik puanlama</li>
          <li> Soru haritas</li>
          <li> hlal kayd</li>
          <li> Rastgele soru sras</li>
        </ul>
      </div>
    </div>
  );
}
