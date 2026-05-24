import { useGameStore } from '@/store/mysteryStore';
import { PUZZLES } from '@/types/gameData';
import { canSolvePuzzle } from '@/utils/mysteryUtils';
import { Puzzle, CheckCircle, Lock } from 'lucide-react';

export default function PuzzlePanel() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const solvePuzzle = useGameStore(state => state.solvePuzzle);

  if (!role || !gameState) return null;

  const currentPlayer = gameState.players.find(p => p.role === role);

  const getThemeColors = () => {
    return role === 'A'
      ? { primary: 'blue', accent: 'indigo' }
      : { primary: 'emerald', accent: 'teal' };
  };

  const theme = getThemeColors();

  const handleSolvePuzzle = (puzzleId: string) => {
    const puzzle = PUZZLES.find(p => p.id === puzzleId);
    if (puzzle && canSolvePuzzle(puzzleId, gameState.allCollectedClues)) {
      solvePuzzle(puzzleId, puzzle.solution);
    }
  };

  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Puzzle className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-medium">谜题进度</span>
      </div>

      <div className="space-y-3">
        {PUZZLES.map(puzzle => {
          const isSolved = gameState.puzzles.find(p => p.id === puzzle.id)?.solved;
          const canSolve = canSolvePuzzle(puzzle.id, gameState.allCollectedClues);
          const hasRequiredClues = puzzle.requiredClues.every(c => gameState.allCollectedClues.includes(c));

          return (
            <div
              key={puzzle.id}
              className={`p-3 rounded-lg ${
                isSolved 
                  ? 'bg-green-900/30 border border-green-500/30' 
                  : canSolve 
                    ? `bg-${theme.primary}-900/30 border border-${theme.primary}-500/30`
                    : 'bg-slate-900/30 border border-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSolved ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : canSolve ? (
                    <Puzzle className={`w-5 h-5 text-${theme.primary}-400`} />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                  <div>
                    <div className={`text-sm font-medium ${isSolved ? 'text-green-400' : 'text-slate-200'}`}>
                      {puzzle.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      难度: {'★'.repeat(puzzle.difficulty)}
                    </div>
                  </div>
                </div>
                {canSolve && !isSolved && (
                  <button
                    onClick={() => handleSolvePuzzle(puzzle.id)}
                    className={`px-3 py-1 bg-${theme.primary}-600 hover:bg-${theme.primary}-500 rounded text-xs text-white`}
                  >
                    解开
                  </button>
                )}
              </div>
              {!isSolved && !canSolve && (
                <div className="mt-2 text-xs text-slate-500">
                  需要线索: {puzzle.requiredClues.filter(c => !gameState.allCollectedClues.includes(c)).join(', ')}
                </div>
              )}
              {isSolved && (
                <div className="mt-2 text-xs text-green-400/80">
                  ✓ {puzzle.reward}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
