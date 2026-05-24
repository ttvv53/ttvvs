import { useGameStore } from '@/store/mysteryStore';
import { getClueById, getCluesForPlayer } from '@/utils/mysteryUtils';
import { Briefcase, Share2, Eye, X } from 'lucide-react';
import { useState } from 'react';

export default function ClueBag() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const shareClue = useGameStore(state => state.shareClue);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);

  if (!role || !gameState) return null;

  const currentPlayer = gameState.players.find(p => p.role === role);
  const availableClues = getCluesForPlayer(role);
  const collectedClues = availableClues.filter(clue =>
    currentPlayer?.collectedClues.includes(clue.id)
  );

  const getThemeColors = () => {
    return role === 'A'
      ? { primary: 'blue', bg: 'bg-blue-900/20', border: 'border-blue-500/30' }
      : { primary: 'emerald', bg: 'bg-emerald-900/20', border: 'border-emerald-500/30' };
  };

  const theme = getThemeColors();

  return (
    <div className={`${theme.bg} rounded-xl p-4 border ${theme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 font-medium">线索背包</span>
        </div>
        <span className="text-sm text-slate-500">{collectedClues.length} / {availableClues.length}</span>
      </div>

      {collectedClues.length === 0 ? (
        <div className="text-sm text-slate-500 italic text-center py-4">
          尚未收集任何线索
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {collectedClues.map(clue => (
            <div
              key={clue.id}
              className="p-2 bg-slate-800/50 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{clue.icon}</span>
                <span className="text-sm text-slate-200">{clue.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.preventDefault(); setSelectedClue(clue.id); }}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); shareClue(clue.id); }}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                  title="分享给队友"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClue && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClue(null)}>
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            {(() => {
              const clue = getClueById(selectedClue);
              if (!clue) return null;
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{clue.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{clue.name}</h3>
                        <div className="text-xs text-slate-500">{clue.type}</div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedClue(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-300 mb-4">{clue.detail}</p>
                  <button
                    onClick={() => { shareClue(clue.id); setSelectedClue(null); }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    分享给队友
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
