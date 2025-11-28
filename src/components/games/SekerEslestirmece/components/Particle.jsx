// Partikül Efekti Component'i
export default function Particle({ x, y, color, index, type = 'explosion' }) {
  const angle = (Math.PI * 2 * index) / 12;
  const distance = type === 'explosion' ? 80 : 50;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance - 30;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        animation: `particle-burst-${type} 0.8s ease-out forwards`,
        animationDelay: `${index * 0.02}s`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 100%)`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
        }}
      />
    </div>
  );
}
