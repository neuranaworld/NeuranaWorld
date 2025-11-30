// Collision detection utilities

export const checkBallPaddleCollision = (ball, paddle) => {
  return (
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  );
};

export const checkBallBrickCollision = (ball, brick) => {
  if (!brick.visible) return false;

  return (
    ball.x + ball.radius > brick.x &&
    ball.x - ball.radius < brick.x + brick.width &&
    ball.y + ball.radius > brick.y &&
    ball.y - ball.radius < brick.y + brick.height
  );
};

export const checkPowerUpPaddleCollision = (powerUp, paddle) => {
  return (
    powerUp.y + 8 > paddle.y &&
    powerUp.y - 8 < paddle.y + paddle.height &&
    powerUp.x > paddle.x &&
    powerUp.x < paddle.x + paddle.width
  );
};
