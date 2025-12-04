// Skor Hesaplama
import { GAME_CONFIG } from '../constants/gameConfig';

export function calculateDartScore(x, y) {
  const { CENTER_X, CENTER_Y } = GAME_CONFIG.BOARD;
  const { BULLSEYE, INNER_BULL, TRIPLE_RING, DOUBLE_RING } = GAME_CONFIG.ZONES;

  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360;

  // Bullseye
  if (distance <= BULLSEYE.radius) {
    return { points: BULLSEYE.points, zone: 'Bullseye!', color: BULLSEYE.color };
  }

  // Inner bull
  if (distance <= INNER_BULL.radius) {
    return { points: INNER_BULL.points, zone: 'İç Boğa', color: INNER_BULL.color };
  }

  // Miss (outside board)
  if (distance > GAME_CONFIG.BOARD.RADIUS) {
    return { points: 0, zone: 'Kaçtı', color: '#6b7280' };
  }

  // Determine sector
  const sectorIndex = Math.floor(angle / 18);
  const sectorValue = GAME_CONFIG.SECTORS[sectorIndex];

  // Triple ring
  if (distance >= TRIPLE_RING.innerRadius && distance <= TRIPLE_RING.outerRadius) {
    return {
      points: sectorValue * TRIPLE_RING.multiplier,
      zone: `Triple ${sectorValue}`,
      color: TRIPLE_RING.color
    };
  }

  // Double ring
  if (distance >= DOUBLE_RING.innerRadius && distance <= DOUBLE_RING.outerRadius) {
    return {
      points: sectorValue * DOUBLE_RING.multiplier,
      zone: `Double ${sectorValue}`,
      color: DOUBLE_RING.color
    };
  }

  // Regular sector
  return {
    points: sectorValue,
    zone: `Sector ${sectorValue}`,
    color: sectorIndex % 2 === 0 ? '#1f2937' : '#f3f4f6'
  };
}

export function calculateTotalScore(darts) {
  return darts.reduce((sum, dart) => sum + dart.points, 0);
}
