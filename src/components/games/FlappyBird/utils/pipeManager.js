// Boru Yönetimi
import { GAME_CONFIG } from '../constants/gameConfig';

export function createPipe() {
  const minHeight = 50;
  const maxHeight = GAME_CONFIG.CANVAS.HEIGHT - GAME_CONFIG.PIPE.GAP - 50;
  const height = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

  return {
    x: GAME_CONFIG.CANVAS.WIDTH,
    topHeight: height,
    bottomY: height + GAME_CONFIG.PIPE.GAP,
    width: GAME_CONFIG.PIPE.WIDTH,
    passed: false,
  };
}

export function updatePipes(pipes) {
  return pipes
    .map(pipe => ({
      ...pipe,
      x: pipe.x - GAME_CONFIG.PIPE.SPEED
    }))
    .filter(pipe => pipe.x + pipe.width > 0);
}

export function checkPipeCollision(bird, pipes) {
  const birdBounds = bird.getBounds();

  for (const pipe of pipes) {
    // Check if bird is in pipe's x range
    if (birdBounds.x + birdBounds.width > pipe.x &&
        birdBounds.x < pipe.x + pipe.width) {
      // Check collision with top or bottom pipe
      if (birdBounds.y < pipe.topHeight ||
          birdBounds.y + birdBounds.height > pipe.bottomY) {
        return true;
      }
    }
  }

  return false;
}

export function checkPipePassed(bird, pipes, onPass) {
  pipes.forEach(pipe => {
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pipe.passed = true;
      onPass();
    }
  });
}
