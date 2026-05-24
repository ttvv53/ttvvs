import { useEffect, useRef } from 'react';
import { GAME_CONFIG } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

export function useGameLoop() {
  const gameTick = useGameStore(state => state.gameTick);
  const isPlaying = useGameStore(state => state.isPlaying);
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && !isPaused && !isGameOver) {
      intervalRef.current = window.setInterval(() => {
        gameTick();
      }, GAME_CONFIG.GAME_SPEED);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused, isGameOver, gameTick]);

  return {
    isPlaying,
    isPaused,
    isGameOver,
  };
}
