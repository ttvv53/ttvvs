import { useEffect, useCallback } from 'react';
import { Direction } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import GameCanvas from '@/components/GameCanvas';
import ScorePanel from '@/components/ScorePanel';
import SkinSelector from '@/components/SkinSelector';
import ControlPanel from '@/components/ControlPanel';
import EasterEggToast from '@/components/EasterEggToast';

export default function Game() {
  const setDirection = useGameStore(state => state.setDirection);
  const startGame = useGameStore(state => state.startGame);
  const restartGame = useGameStore(state => state.restartGame);
  const isPlaying = useGameStore(state => state.isPlaying);
  const isGameOver = useGameStore(state => state.isGameOver);
  const easterEgg = useGameStore(state => state.easterEgg);
  const clearEasterEgg = useGameStore(state => state.clearEasterEgg);

  useGameLoop();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      W: 'UP',
      s: 'DOWN',
      S: 'DOWN',
      a: 'LEFT',
      A: 'LEFT',
      d: 'RIGHT',
      D: 'RIGHT',
    };

    const direction = keyDirectionMap[e.key];
    if (direction) {
      e.preventDefault();
      setDirection(direction);
    }
  }, [setDirection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCanvasClick = () => {
    if (isGameOver) {
      restartGame();
    } else if (!isPlaying) {
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/30 to-slate-900 flex flex-col items-center justify-center p-4">
      {easterEgg && (
        <EasterEggToast message={easterEgg} onComplete={clearEasterEgg} />
      )}

      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 tracking-tight">
          贪吃蛇
        </h1>
        <p className="text-slate-400 mt-2 text-sm">使用方向键或 WASD 控制移动</p>
      </div>

      <div className="mb-6">
        <ScorePanel />
      </div>

      <div className="mb-6 relative">
        <div onClick={handleCanvasClick} className="cursor-pointer">
          <GameCanvas />
        </div>
      </div>

      <div className="mb-6">
        <SkinSelector />
      </div>

      <div className="mb-4">
        <ControlPanel onCanvasClick={handleCanvasClick} />
      </div>

      <div className="text-center text-slate-500 text-xs mt-4">
        <p>按空格键暂停/继续游戏</p>
      </div>
    </div>
  );
}
