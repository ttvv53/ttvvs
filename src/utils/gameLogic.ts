import { Position, Direction, GAME_CONFIG } from '@/types/game';

export function getInitialSnake(): Position[] {
  const snake: Position[] = [];
  const startY = Math.floor(GAME_CONFIG.GRID_SIZE / 2);
  for (let i = 0; i < GAME_CONFIG.INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: GAME_CONFIG.INITIAL_SNAKE_LENGTH - i, y: startY });
  }
  return snake;
}

export function generateFood(snake: Position[]): Position {
  const { GRID_SIZE } = GAME_CONFIG;
  let food: Position;
  let attempts = 0;
  const maxAttempts = GRID_SIZE * GRID_SIZE;
  
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
  } while (isPositionOnSnake(food, snake) && attempts < maxAttempts);
  
  return food;
}

export function isPositionOnSnake(pos: Position, snake: Position[]): boolean {
  return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

export function moveSnake(
  snake: Position[],
  direction: Direction,
  food: Position
): { newSnake: Position[]; ateFood: boolean } {
  const head = snake[0];
  let newHead: Position;
  
  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  const ateFood = newHead.x === food.x && newHead.y === food.y;
  const newSnake = [newHead, ...snake];
  
  if (!ateFood) {
    newSnake.pop();
  }
  
  return { newSnake, ateFood };
}

export function checkCollision(snake: Position[]): boolean {
  const { GRID_SIZE } = GAME_CONFIG;
  const head = snake[0];
  
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }
  
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  
  return false;
}

export function getOppositeDirection(direction: Direction): Direction {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[direction];
}

export function isValidDirectionChange(current: Direction, next: Direction): boolean {
  return next !== getOppositeDirection(current);
}
