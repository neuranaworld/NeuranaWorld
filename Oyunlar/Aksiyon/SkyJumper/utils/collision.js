// Collision detection utilities

export const checkPlatformCollision = (player, platform) => {
  return (
    player.velocityY > 0 &&
    player.y + player.height / 2 >= platform.y &&
    player.y + player.height / 2 <= platform.y + platform.height + 10 &&
    player.x >= platform.x - platform.width / 2 &&
    player.x <= platform.x + platform.width / 2
  );
};

export const checkCircleCollision = (obj1, obj2) => {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (obj1.width / 2 + obj2.width / 2);
};

export const getDistance = (x1, y1, x2, y2) => {
  return Math.hypot(x1 - x2, y1 - y2);
};
