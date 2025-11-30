// Çarpışma Kontrolü Fonksiyonları
export function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function checkCircleCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

export function checkPlatformCollision(player, platform) {
  // Player is falling down (velocityY > 0)
  if (player.velocityY <= 0) return false;

  const playerBottom = player.y + player.height / 2;
  const platformTop = platform.y;

  // Check if player is above platform and falling onto it
  return (
    player.x + player.width / 2 > platform.x &&
    player.x - player.width / 2 < platform.x + platform.width &&
    playerBottom > platformTop - 10 &&
    playerBottom < platformTop + platform.height
  );
}
