import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Heart, Zap, Star, Award } from 'lucide-react';
import { Ball } from './classes/Ball';
import { Paddle } from './classes/Paddle';
import { CANVAS, BALL, PADDLE, SCORING, STORAGE_KEY, POWERUP_DURATION } from './constants/gameConfig';
import { createBricks, createPowerUp, createParticles } from './utils/spawner';
import { checkBallPaddleCollision, checkBallBrickCollision, checkPowerUpPaddleCollision } from './utils/collision';
import { drawBackground, drawBall, drawPaddle, drawBricks, drawPowerUps, drawParticles } from './utils/renderer';

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const gameRef = useRef({
    ball: null,
    paddle: null,
    bricks: [],
    powerUps: [],
    particles: [],
    animationId: null,
    canvas: null,
    ctx: null,
    keys: {},
    lastHitTime: 0,
    comboCount: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [score, bestScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    gameRef.current.canvas = canvas;
    gameRef.current.ctx = ctx;

    initGame();

    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [level]);

  const initGame = () => {
    const canvas = gameRef.current.canvas;
    if (!canvas) return;

    gameRef.current.paddle = new Paddle(
      canvas.width / 2 - PADDLE.WIDTH / 2,
      canvas.height - PADDLE.Y_OFFSET
    );

    gameRef.current.ball = new Ball(
      canvas.width / 2,
      canvas.height - BALL.INIT_Y_OFFSET
    );

    gameRef.current.bricks = createBricks(level);
    gameRef.current.powerUps = [];
    gameRef.current.particles = [];
    gameRef.current.comboCount = 0;
    setCombo(0);
  };

  const updateCombo = () => {
    const now = Date.now();
    const timeSinceLastHit = now - gameRef.current.lastHitTime;

    if (timeSinceLastHit < 1000) {
      gameRef.current.comboCount++;
      setCombo(gameRef.current.comboCount);
      if (gameRef.current.comboCount > maxCombo) {
        setMaxCombo(gameRef.current.comboCount);
      }
    } else {
      gameRef.current.comboCount = 1;
      setCombo(1);
    }

    gameRef.current.lastHitTime = now;
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { ball, paddle, bricks, powerUps, particles, canvas, ctx, keys } = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);

    // Update particles
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
    });
    gameRef.current.particles = particles.filter(p => p.life > 0);
    drawParticles(ctx, particles);

    // Paddle movement
    if (keys['ArrowLeft'] || keys['a']) paddle.moveLeft();
    if (keys['ArrowRight'] || keys['d']) paddle.moveRight(canvas.width);

    // Ball update
    ball.update();

    // Wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.reverseX();
      createParticles(ball.x, ball.y, '#fbbf24', particles);
    }
    if (ball.y - ball.radius < 0) {
      ball.reverseY();
      createParticles(ball.x, ball.y, '#fbbf24', particles);
    }

    // Paddle collision
    if (checkBallPaddleCollision(ball, paddle)) {
      ball.bounceOffPaddle(paddle);
      createParticles(ball.x, paddle.y, '#3b82f6', particles);
    }

    // Brick collision
    bricks.forEach(brick => {
      if (checkBallBrickCollision(ball, brick)) {
        ball.reverseY();
        brick.hits--;

        if (brick.hits <= 0) {
          brick.visible = false;
          updateCombo();
          const comboBonus = gameRef.current.comboCount > 1 ? gameRef.current.comboCount * 10 : 0;
          setScore(s => s + SCORING.BRICK_BASE * level + comboBonus);
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, particles);

          if (brick.hasPowerUp) {
            powerUps.push(createPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2));
          }
        } else {
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, particles);
        }
      }
    });

    // Power-ups update
    powerUps.forEach(pu => {
      pu.y += pu.dy;

      if (checkPowerUpPaddleCollision(pu, paddle)) {
        pu.collected = true;
        if (pu.type === 'expand') {
          paddle.expand();
          setPowerUp({ type: 'expand', time: Date.now() });
          setTimeout(() => {
            paddle.reset();
            setPowerUp(null);
          }, POWERUP_DURATION);
        }
      }
    });
    gameRef.current.powerUps = powerUps.filter(pu => !pu.collected && pu.y < canvas.height);

    // Ball out of bounds
    if (ball.y - ball.radius > canvas.height) {
      gameRef.current.comboCount = 0;
      setCombo(0);
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        } else {
          ball.reset(canvas.width / 2, canvas.height - BALL.INIT_Y_OFFSET);
        }
        return newLives;
      });
    }

    // Level complete
    if (bricks.every(b => !b.visible)) {
      setLevel(l => l + 1);
      setGameState('ready');
    }

    // Draw everything
    drawBricks(ctx, bricks);
    drawPowerUps(ctx, powerUps);
    drawPaddle(ctx, paddle);
    drawBall(ctx, ball);

    gameRef.current.animationId = requestAnimationFrame(updateGame);
  }, [gameState, level, maxCombo]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.animationId = requestAnimationFrame(updateGame);
    }
    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState, updateGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' && gameState === 'ready') {
        startGame();
      }
      gameRef.current.keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setPowerUp(null);
    setCombo(0);
    setMaxCombo(0);
    initGame();
    setGameState('ready');
  };

  return (
    <div className="game-container" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          top: '-150px',
          left: '-150px',
          animation: 'float-up-down 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          bottom: '-100px',
          right: '-100px',
          animation: 'float-up-down 15s ease-in-out infinite 5s'
        }} />
      </div>

      <div className="game-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="game-header">
          <Link to="/" className="game-back-btn">
            <ArrowLeft size={20} />
            Ana Menü
          </Link>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              🧱 Breakout Pro
            </h1>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              marginTop: '0.25rem',
              fontWeight: 600
            }}>
              Tuğlaları kır, güç topla!
            </p>
          </div>

          <button onClick={resetGame} className="game-btn game-btn-secondary">
            <RotateCcw size={18} />
            Yeni Oyun
          </button>
        </div>

        {/* Stats Grid */}
        <div className="game-stats" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            transform: gameState === 'playing' ? 'scale(1)' : 'scale(0.95)',
            transition: 'transform 0.3s ease'
          }}>
            <Star size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.9 }} />
            <span className="stat-value">{score}</span>
            <span className="stat-label" style={{ color: '#bfdbfe' }}>Skor</span>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white'
          }}>
            <Heart size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.9 }} />
            <span className="stat-value">{lives}</span>
            <span className="stat-label" style={{ color: '#fecaca' }}>Can</span>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white'
          }}>
            <Trophy size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.9 }} />
            <span className="stat-value">{level}</span>
            <span className="stat-label" style={{ color: '#ddd6fe' }}>Seviye</span>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <Award size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.9 }} />
            <span className="stat-value">{maxCombo}</span>
            <span className="stat-label" style={{ color: '#fef3c7' }}>Maks Kombo</span>
          </div>
        </div>

        {/* Combo indicator */}
        {combo > 1 && gameState === 'playing' && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            marginTop: '1rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            animation: 'glow-pulse 1s ease-in-out infinite'
          }}>
            🔥 {combo}x KOMBO! 🔥
          </div>
        )}

        {/* Power-up indicator */}
        {powerUp && (
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            marginTop: '1rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            animation: 'scale-in 0.3s ease-out'
          }}>
            <Zap size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            {powerUp.type === 'expand' ? '↔️ Genişleme Aktif!' : '● Multi-ball Aktif!'}
          </div>
        )}

        {/* Canvas */}
        <div className="game-canvas-wrapper" style={{ marginTop: '1.5rem' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS.WIDTH}
            height={CANVAS.HEIGHT}
            className="game-canvas"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.05)'
            }}
          />
        </div>

        {/* Controls hint */}
        {gameState === 'ready' && (
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{
              color: '#cbd5e1',
              fontSize: '0.9rem',
              margin: 0,
              fontWeight: 600
            }}>
              ⌨️ Hareket: ← → veya A D | 🎮 Başlat: Space
            </p>
          </div>
        )}

        {/* Game Controls */}
        <div className="game-controls" style={{ marginTop: '1.5rem' }}>
          {gameState === 'ready' && (
            <button onClick={startGame} className="game-btn game-btn-primary" style={{
              flex: 1,
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 700
            }}>
              <Play size={24} />
              Oyunu Başlat
            </button>
          )}

          {(gameState === 'playing' || gameState === 'paused') && (
            <button onClick={togglePause} className="game-btn game-btn-primary" style={{
              flex: 1,
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 700
            }}>
              {gameState === 'playing' ? (
                <><Pause size={24} /> Duraklat</>
              ) : (
                <><Play size={24} /> Devam Et</>
              )}
            </button>
          )}
        </div>

        {/* Best Score */}
        {bestScore > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{
              color: '#fbbf24',
              fontSize: '0.9rem',
              margin: 0,
              fontWeight: 700
            }}>
              🏆 En Yüksek Skor: {bestScore}
            </p>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameState === 'gameOver' && (
        <div className="game-modal" style={{ animation: 'fade-in 0.3s ease-out' }}>
          <div className="game-modal-content celebration-burst" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #fbbf24 100%)',
            color: 'white',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💔</div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              marginBottom: '1rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              Oyun Bitti!
            </h2>

            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Final Skoru
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 900 }}>
                {score}
              </div>
              {maxCombo > 1 && (
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  🔥 Maksimum Kombo: {maxCombo}x
                </div>
              )}
            </div>

            {score === bestScore && score > 0 && (
              <div style={{
                background: 'rgba(251, 191, 36, 1)',
                color: '#78350f',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
                🏆 YENİ REKOR! 🏆
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <Link
                to="/"
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                🏠 Ana Menü
              </Link>
              <button
                onClick={resetGame}
                style={{
                  flex: 1,
                  background: 'white',
                  color: '#ef4444',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🔄 Tekrar Oyna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakoutGame;
