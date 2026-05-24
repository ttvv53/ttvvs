import { useGameStore } from '@/store/mysteryStore';
import { getSceneById, getClueById, getCluesForPlayer } from '@/utils/mysteryUtils';
import { Search, Lock, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SceneView() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const collectClue = useGameStore(state => state.collectClue);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);

  if (!role || !gameState) return null;

  const currentPlayer = gameState.players.find(p => p.role === role);
  const currentScene = getSceneById(currentPlayer?.currentScene || 'study');
  const availableClues = getCluesForPlayer(role);

  if (!currentScene) return null;

  const sceneClues = availableClues.filter(clue => 
    currentScene.clues.includes(clue.id) && 
    !currentPlayer?.collectedClues.includes(clue.id)
  );

  const collectedSceneClues = availableClues.filter(clue =>
    currentScene.clues.includes(clue.id) &&
    currentPlayer?.collectedClues.includes(clue.id)
  );

  const getThemeColors = () => {
    return role === 'A'
      ? { primary: 'blue', accent: 'indigo' }
      : { primary: 'emerald', accent: 'teal' };
  };

  const theme = getThemeColors();

  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-100">{currentScene.name}</h2>
        <p className="text-sm text-slate-400 mt-1">{currentScene.description}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Search className={`w-4 h-4 text-${theme.primary}-400`} />
          <span className="text-sm text-slate-300">可调查的线索</span>
        </div>
        
        {sceneClues.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-3 bg-slate-900/30 rounded-lg">
            该区域所有线索已收集完毕
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sceneClues.map(clue => (
              <button
                key={clue.id}
                onClick={() => collectClue(clue.id)}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{clue.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {clue.name}
                    </div>
                    <div className="text-xs text-slate-500">{clue.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {collectedSceneClues.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className={`w-4 h-4 text-${theme.primary}-400`} />
            <span className="text-sm text-slate-300">已收集的线索</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {collectedSceneClues.map(clue => (
              <button
                key={clue.id}
                onClick={() => setSelectedClue(clue.id)}
                className={`p-3 bg-${theme.primary}-900/30 border border-${theme.primary}-500/30 rounded-lg text-left transition-all`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{clue.icon}</span>
                  <div className="text-sm font-medium text-slate-200">{clue.name}</div>
                </div>
              </button>
            ))}
          </div>
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
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{clue.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{clue.name}</h3>
                      <div className="text-xs text-slate-500">{clue.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{clue.detail}</p>
                  <button
                    onClick={() => setSelectedClue(null)}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
                  >
                    关闭
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
