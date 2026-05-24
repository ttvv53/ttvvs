import { useEffect } from 'react';
import { useGameStore } from '@/store/mysteryStore';
import { getPlayerInfo, getProgress } from '@/utils/mysteryUtils';
import SceneMap from '@/components/mystery/SceneMap';
import SceneView from '@/components/mystery/SceneView';
import ClueBag from '@/components/mystery/ClueBag';
import ChatPanel from '@/components/mystery/ChatPanel';
import PuzzlePanel from '@/components/mystery/PuzzlePanel';
import FinalAnswerPanel from '@/components/mystery/FinalAnswerPanel';
import { Trophy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameRoom() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const roomId = useGameStore(state => state.roomId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!role || !gameState) {
      navigate('/');
    }
  }, [role, gameState, navigate]);

  if (!role || !gameState) return null;

  const playerInfo = getPlayerInfo(role);
  const currentPlayer = gameState.players.find(p => p.role === role);
  const progress = getProgress(gameState.allCollectedClues, currentPlayer?.solvedPuzzles || []);

  const getThemeColors = () => {
    return role === 'A'
      ? { 
          primary: 'from-blue-600 to-indigo-700',
          secondary: 'from-blue-500/20 to-indigo-500/20',
          accent: 'blue',
          bg: 'bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900'
        }
      : { 
          primary: 'from-emerald-600 to-teal-700',
          secondary: 'from-emerald-500/20 to-teal-500/20',
          accent: 'emerald',
          bg: 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900'
        };
  };

  const theme = getThemeColors();

  if (gameState.gameEnded) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-4`}>
        <div className="text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-4">
            案件告破！
          </h1>
          <p className="text-slate-300 text-lg mb-2">恭喜两位侦探成功还原真相</p>
          <p className="text-slate-500">凶手：陈志明 | 动机：遗产争夺 | 手法：下毒谋杀</p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 flex items-center gap-2 mx-auto"
          >
            <LogOut className="w-5 h-5" />
            返回大厅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} p-4`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center text-2xl`}>
              {playerInfo.avatar}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">{playerInfo.name}</div>
              <div className="text-sm text-slate-400">侦探 {role} · 房间 {roomId}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500">线索收集</div>
              <div className="text-sm font-medium text-slate-300">{Math.round(progress.cluesProgress)}%</div>
            </div>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${theme.primary} transition-all`}
                style={{ width: `${progress.cluesProgress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-4">
            <SceneMap />
            <ClueBag />
          </div>

          <div className="col-span-6 space-y-4">
            <SceneView />
            <PuzzlePanel />
            <FinalAnswerPanel />
          </div>

          <div className="col-span-3">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
