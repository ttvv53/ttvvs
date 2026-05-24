import { useGameStore } from '@/store/mysteryStore';
import { getSceneById, getClueById, getCluesForPlayer } from '@/utils/mysteryUtils';
import { Search, Eye, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function SceneView() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const collectClue = useGameStore(state => state.collectClue);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [investigating, setInvestigating] = useState<string | null>(null);

  if (!role || !gameState) return null;

  const currentPlayer = gameState.players.find(p => p.role === role);
  const otherPlayer = gameState.players.find(p => p.role !== role);
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

  const theme = role === 'A' 
    ? { primary: 'blue', gradient: 'from-blue-600 to-indigo-600' }
    : { primary: 'emerald', gradient: 'from-emerald-600 to-teal-600' };

  const handleInvestigate = (clueId: string) => {
    setInvestigating(clueId);
    setTimeout(() => {
      collectClue(clueId);
      setInvestigating(null);
    }, 800);
  };

  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-100">{currentScene.name}</h2>
        <p className="text-sm text-slate-400 mt-1">{currentScene.description}</p>
      </div>

      <div className="mb-4 p-3 bg-slate-900/40 rounded-lg border border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">合作进度</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-400">你: {currentPlayer?.collectedClues.length || 0}条</span>
            <span className="text-emerald-400">队友: {otherPlayer?.collectedClues.length || 0}条</span>
          </div>
        </div>
        <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
            style={{ width: `${(gameState.allCollectedClues.length / 15) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">共同收集 {gameState.allCollectedClues.length} / 15 条线索</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className={`w-4 h-4 text-${theme.primary}-400`} />
          <span className="text-sm text-slate-300">可疑之处</span>
          <span className="text-xs text-slate-500">({sceneClues.length})</span>
        </div>
        
        {sceneClues.length === 0 ? (
          <div className="text-sm text-slate-500 italic p-4 bg-slate-900/30 rounded-lg text-center">
            <Eye className="w-6 h-6 mx-auto mb-2 opacity-50" />
            该区域已调查完毕
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sceneClues.map((clue, index) => (
              <button
                key={clue.id}
                onClick={(e) => { e.preventDefault(); handleInvestigate(clue.id); }}
                disabled={investigating === clue.id}
                className="relative p-4 bg-slate-900/50 hover:bg-slate-800/80 rounded-xl text-left transition-all group overflow-hidden border border-slate-700/30 hover:border-slate-600/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                      ?
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200">
                      可疑点 {index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{clue.description}</p>
                  
                  {investigating === clue.id && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        调查中...
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {collectedSceneClues.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className={`w-4 h-4 text-${theme.primary}-400`} />
            <span className="text-sm text-slate-300">已发现线索</span>
            <span className="text-xs text-slate-500">({collectedSceneClues.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {collectedSceneClues.map(clue => (
              <button
                key={clue.id}
                onClick={(e) => { e.preventDefault(); setSelectedClue(clue.id); }}
                className={`p-3 bg-${theme.primary}-900/20 border border-${theme.primary}-500/20 hover:border-${theme.primary}-500/40 rounded-xl text-left transition-all group`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">{clue.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{clue.name}</div>
                    <div className="text-xs text-slate-500">{clue.type === 'document' ? '文件' : clue.type === 'evidence' ? '物证' : clue.type === 'testimony' ? '证词' : '痕迹'}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedClue && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClue(null)}>
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl" onClick={e => e.stopPropagation()}>
            {(() => {
              const clue = getClueById(selectedClue);
              if (!clue) return null;
              return (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center text-3xl">
                      {clue.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{clue.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          clue.type === 'document' ? 'bg-blue-900/50 text-blue-300' :
                          clue.type === 'evidence' ? 'bg-amber-900/50 text-amber-300' :
                          clue.type === 'testimony' ? 'bg-purple-900/50 text-purple-300' :
                          'bg-slate-700/50 text-slate-300'
                        }`}>
                          {clue.type === 'document' ? '文件' : clue.type === 'evidence' ? '物证' : clue.type === 'testimony' ? '证词' : '痕迹'}
                        </span>
                        <span className="text-xs text-slate-500">仅你可见</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 leading-relaxed">{clue.detail}</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>提示：可以通过聊天分享给队友</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClue(null)}
                    className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
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
