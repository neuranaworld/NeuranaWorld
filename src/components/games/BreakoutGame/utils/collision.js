// Çarpışma Kontrolü
export function checkBallPaddleCollision(ball, paddle) {
  return (
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width
  );
}

export function checkBallBrickCollision(ball, brick) {
  if (!brick.visible) return false;

  return (
    ball.x + ball.radius > brick.x &&
    ball.x - ball.radius < brick.x + brick.width &&
    ball.y + ball.radius > brick.y &&
    ball.y - ball.radius < brick.y + brick.height
  );
}

export function checkBallWallCollision(ball, canvasWidth, canvasHeight) {
  const collisions = {
    left: ball.x - ball.radius < 0,
    right: ball.x + ball.radius > canvasWidth,
    top: ball.y - ball.radius < 0,
    bottom: ball.y - ball.radius > canvasHeight,
  };

  return collisions;
}
