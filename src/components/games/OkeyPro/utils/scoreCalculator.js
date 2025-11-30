// Skor Hesaplama
export function calculateScoreAndPairs(userRacks) {
  let score = 0;
  let pairs = 0;

  userRacks.forEach(rack => {
    rack.forEach(tile => {
      if (!tile.is_fake) {
        score += tile.number;
      }
    });

    // Çift sayma (basit versiyon)
    const numbers = {};
    rack.forEach(tile => {
      numbers[tile.number] = (numbers[tile.number] || 0) + 1;
    });
    Object.values(numbers).forEach(count => {
      if (count >= 2) pairs++;
    });
  });

  return { score, pairs };
}
