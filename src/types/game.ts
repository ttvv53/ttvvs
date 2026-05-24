export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type SkinColor = 'green' | 'blue' | 'red';

export interface SkinColors {
  head: string;
  body: string;
  glow: string;
}

export interface EasterEggMessage {
  score: number;
  title: string;
  subtitle: string;
  emoji: string;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  skinColor: SkinColor;
  easterEgg: EasterEggMessage | null;
}

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  CELL_SIZE: 30,
  CANVAS_SIZE: 600,
  GAME_SPEED: 100,
  INITIAL_SNAKE_LENGTH: 3,
  SCORE_PER_FOOD: 10,
} as const;

export const SKIN_COLORS: Record<SkinColor, SkinColors> = {
  green: {
    head: '#00ff88',
    body: '#00d26a',
    glow: 'rgba(0, 210, 106, 0.5)',
  },
  blue: {
    head: '#00d4ff',
    body: '#00b4d8',
    glow: 'rgba(0, 180, 216, 0.5)',
  },
  red: {
    head: '#ff6b7a',
    body: '#ff4757',
    glow: 'rgba(255, 71, 87, 0.5)',
  },
};

export const EASTER_EGGS: EasterEggMessage[] = [
  {
    score: 100,
    title: '哎呀不错哦~',
    subtitle: '周星驰看了都点赞',
    emoji: '😎',
  },
  {
    score: 300,
    title: '蛇王之路，势不可挡！',
    subtitle: '这操作，我愿称之为绝活',
    emoji: '🐍',
  },
  {
    score: 500,
    title: '这蛇是开了挂吧？',
    subtitle: '反手就是一个举报（开玩笑的）',
    emoji: '🚀',
  },
  {
    score: 1000,
    title: '传说中的千分大神！',
    subtitle: '请受我一拜，膜拜大佬',
    emoji: '🙇',
  },
];
