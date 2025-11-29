// Yem Oluşturma
import { GAME_CONFIG, FOOD_TYPES } from '../constants/gameConfig';

export function spawnFood(snake) {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE)
    };
  } while (isPositionOnSnake(position, snake));

  // 10% chance for golden, 5% for speed
  const rand = Math.random();
  let type = 'NORMAL';
  if (rand < 0.05) type = 'SPEED';
  else if (rand < 0.15) type = 'GOLDEN';

  return {
    ...position,
    type: type,
    ...FOOD_TYPES[type]
  };
}

function isPositionOnSnake(position, snake) {
  return snake.body.some(segment =>
    segment.x === position.x && segment.y === position.y
  );
}

export function checkFoodCollision(snake, food) {
  const head = snake.getHead();
  return head.x === food.x && head.y === food.y;
}
