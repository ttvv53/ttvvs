import { useGameStore } from '@/store/gameStore';

export default function ScorePanel() {
  const score = useGameStore(state => state.score);
  const highScore = useGameStore(state => state.highScore);

  return (
    <div className="flex gap-8 items-center justify-center">
      <div className="text-center">
        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">当前分数</div>
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 font-mono">
          {score}
        </div>
      </div>
      <div className="w-px h-16 bg-slate-700"></div>
      <div className="text-center">
        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">最高分</div>
        <div className="text-3xl font-bold text-amber-400 font-mono">
          {highScore}
        </div>
      </div>
    </div>
  );
}
