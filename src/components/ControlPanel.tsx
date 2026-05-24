import { Play, Pause, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface ControlPanelProps {
  onCanvasClick: () => void;
}

export default function ControlPanel({ onCanvasClick }: ControlPanelProps) {
  const isPlaying = useGameStore(state => state.isPlaying);
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const startGame = useGameStore(state => state.startGame);
  const pauseGame = useGameStore(state => state.pauseGame);
  const resumeGame = useGameStore(state => state.resumeGame);
  const restartGame = useGameStore(state => state.restartGame);

  const handleMainButton = () => {
    if (isGameOver) {
      restartGame();
    } else if (!isPlaying) {
      startGame();
    } else if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const handleCanvasClick = () => {
    if (isGameOver) {
      restartGame();
    } else if (!isPlaying) {
      startGame();
    }
    onCanvasClick();
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <button
        onClick={handleMainButton}
        className={`
          px-8 py-3 rounded-xl font-bold text-lg
          transition-all duration-300 transform hover:scale-105
          flex items-center gap-2
          ${isGameOver 
            ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white' 
            : !isPlaying 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white'
              : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white'
          }
          shadow-lg hover:shadow-xl
        `}
      >
        {isGameOver ? (
          <>
            <RotateCcw size={20} />
            重新开始
          </>
        ) : !isPlaying ? (
          <>
            <Play size={20} />
            开始游戏
          </>
        ) : isPaused ? (
          <>
            <Play size={20} />
            继续游戏
          </>
        ) : (
          <>
            <Pause size={20} />
            暂停游戏
          </>
        )}
      </button>

      {isPlaying && !isGameOver && (
        <button
          onClick={restartGame}
          className="
            px-6 py-3 rounded-xl font-medium
            bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white
            transition-all duration-300 transform hover:scale-105
            flex items-center gap-2
            border border-slate-600 hover:border-slate-500
          "
        >
          <RotateCcw size={18} />
          重新开始
        </button>
      )}
    </div>
  );
}
