// Particle Effects
export function createParticles(position, count = 10) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: Math.random(),
      x: position.x || 0,
      y: position.y || 0,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 5,
      life: 1,
      decay: 0.02,
      size: Math.random() * 6 + 2,
      color: ['#FFD700', '#FFA500', '#FF6347', '#FF1493'][Math.floor(Math.random() * 4)]
    });
  }
  return particles;
}

export function updateParticles(particles) {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.5, // gravity
      life: p.life - p.decay
    }))
    .filter(p => p.life > 0);
}
