// Çarpışma Kontrolü
export function checkPaddleCollision(ball, paddle) {
  const ballBounds = ball.getBounds();
  const paddleBounds = paddle.getBounds();

  return (
    ballBounds.x < paddleBounds.x + paddleBounds.width &&
    ballBounds.x + ballBounds.width > paddleBounds.x &&
    ballBounds.y < paddleBounds.y + paddleBounds.height &&
    ballBounds.y + ballBounds.height > paddleBounds.y
  );
}

export function checkScore(ball, canvasWidth) {
  if (ball.x - ball.size / 2 <= 0) {
    return 'right'; // Right player scores
  }
  if (ball.x + ball.size / 2 >= canvasWidth) {
    return 'left'; // Left player scores
  }
  return null;
}
