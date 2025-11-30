// Skor Pop-up Component'i
export default function ScorePopup({ score, x, y, isCombo = false, isSpecial = false }) {
  return (
    <div
      className="absolute pointer-events-none z-50 font-black"
      style={{
        left: x,
        top: y,
        animation: 'score-popup-enhanced 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        fontSize: isSpecial ? '4rem' : isCombo ? '3rem' : '2rem',
        textShadow: '0 0 10px rgba(255,215,0,1), 0 0 20px rgba(255,215,0,0.8), 3px 3px 6px rgba(0,0,0,0.8)',
        color: isSpecial ? '#FFD700' : '#FFD700',
        background: isSpecial
          ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)'
          : 'linear-gradient(135deg, #FFD700, #FFA500)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      +{score}
      {isCombo && <span className="text-2xl ml-2">🔥</span>}
      {isSpecial && <span className="text-3xl ml-2">✨</span>}
    </div>
  );
}
