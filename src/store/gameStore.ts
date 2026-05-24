import { create } from 'zustand';
import { GameState, Direction, SkinColor, GAME_CONFIG, EASTER_EGGS, EasterEggMessage } from '@/types/game';
import { getInitialSnake, generateFood, moveSnake, checkCollision, isValidDirectionChange } from '@/utils/gameLogic';

interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  setDirection: (direction: Direction) => void;
  setSkinColor: (color: SkinColor) => void;
  gameTick: () => void;
  clearEasterEgg: () => void;
}

const getHighScore = (): number => {
  const stored = localStorage.getItem('snakeHighScore');
  return stored ? parseInt(stored, 10) : 0;
};

const saveHighScore = (score: number): void => {
  localStorage.setItem('snakeHighScore', score.toString());
};

const createInitialState = (skinColor: SkinColor = 'green'): Omit<GameState, 'skinColor'> & { skinColor: SkinColor } => ({
  snake: getInitialSnake(),
  food: generateFood(getInitialSnake()),
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  highScore: getHighScore(),
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  skinColor,
  easterEgg: null,
});

const checkEasterEgg = (score: number): EasterEggMessage | null => {
  return EASTER_EGGS.find(egg => egg.score === score) || null;
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...createInitialState(),

  startGame: () => {
    const { skinColor } = get();
    set({
      ...createInitialState(skinColor),
      isPlaying: true,
    });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  restartGame: () => {
    const { skinColor } = get();
    set({
      ...createInitialState(skinColor),
      isPlaying: true,
    });
  },

  setDirection: (direction: Direction) => {
    const { direction: currentDirection, isPlaying, isPaused, isGameOver } = get();
    if (!isPlaying || isPaused || isGameOver) return;
    
    if (isValidDirectionChange(currentDirection, direction)) {
      set({ nextDirection: direction });
    }
  },

  setSkinColor: (color: SkinColor) => {
    set({ skinColor: color });
  },

  clearEasterEgg: () => {
    set({ easterEgg: null });
  },

  gameTick: () => {
    const state = get();
    const { snake, food, nextDirection, score, highScore, isPlaying, isPaused, isGameOver } = state;
    
    if (!isPlaying || isPaused || isGameOver) return;
    
    const { newSnake, ateFood } = moveSnake(snake, nextDirection, food);
    
    if (checkCollision(newSnake)) {
      const finalScore = score;
      if (finalScore > highScore) {
        saveHighScore(finalScore);
        set({ 
          isGameOver: true, 
          isPlaying: false,
          highScore: finalScore 
        });
      } else {
        set({ isGameOver: true, isPlaying: false });
      }
      return;
    }
    
    const updates: Partial<GameState> = {
      snake: newSnake,
      direction: nextDirection,
    };
    
    if (ateFood) {
      const newScore = score + GAME_CONFIG.SCORE_PER_FOOD;
      updates.food = generateFood(newSnake);
      updates.score = newScore;
      
      const easterEgg = checkEasterEgg(newScore);
      if (easterEgg) {
        updates.easterEgg = easterEgg;
      }
    }
    
    set(updates);
  },
}));
