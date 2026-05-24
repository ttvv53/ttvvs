import { useGameStore } from '@/store/mysteryStore';
import { getScenesForPlayer, getSceneById, getPlayerInfo } from '@/utils/mysteryUtils';
import { MapPin, Users, ArrowRight } from 'lucide-react';

export default function SceneMap() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const moveToScene = useGameStore(state => state.moveToScene);

  if (!role || !gameState) return null;

  const playerInfo = getPlayerInfo(role);
  const availableScenes = getScenesForPlayer(role);
  const currentPlayer = gameState.players.find(p => p.role === role);
  const otherPlayer = gameState.players.find(p => p.role !== role);

  const getThemeColors = () => {
    return role === 'A' 
      ? { primary: 'from-blue-500 to-indigo-600', bg: 'bg-blue-900/20', border: 'border-blue-500/30' }
      : { primary: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-900/20', border: 'border-emerald-500/30' };
  };

  const theme = getThemeColors();

  return (
    <div className={`${theme.bg} rounded-xl p-4 border ${theme.border}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-medium">场景地图</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableScenes.map(scene => {
          const isCurrentScene = currentPlayer?.currentScene === scene.id;
          const isOtherPlayerHere = otherPlayer?.currentScene === scene.id;

          return (
            <button
              key={scene.id}
              onClick={() => moveToScene(scene.id)}
              disabled={isCurrentScene}
              className={`
                relative p-3 rounded-lg text-left transition-all
                ${isCurrentScene 
                  ? `bg-gradient-to-br ${theme.primary} text-white` 
                  : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                }
                ${isCurrentScene ? 'ring-2 ring-white/30' : ''}
              `}
            >
              <div className="font-medium text-sm">{scene.name}</div>
              {isCurrentScene && (
                <div className="text-xs opacity-80 mt-1">当前位置</div>
              )}
              {isOtherPlayerHere && (
                <div className="absolute top-2 right-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {currentPlayer && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{playerInfo.avatar}</span>
            <div>
              <div className="font-medium text-slate-200">{playerInfo.name}</div>
              <div className="text-xs text-slate-400">{playerInfo.title}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
