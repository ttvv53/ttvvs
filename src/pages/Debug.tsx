import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/mysteryStore';
import { Bug, ArrowLeft } from 'lucide-react';

export default function Debug() {
  const navigate = useNavigate();
  const setGameState = useGameStore(state => state.setGameState);
  const connect = useGameStore(state => state.connect);
  const socket = useGameStore(state => state.socket);

  useEffect(() => {
    connect();
  }, [connect]);

  const startDebug = (role: 'A' | 'B') => {
    const mockGameState = {
      players: [
        {
          role: 'A' as const,
          name: '林晓月',
          currentScene: 'study',
          collectedClues: [],
          solvedPuzzles: [],
        },
        {
          role: 'B' as const,
          name: '周明轩',
          currentScene: 'garden',
          collectedClues: [],
          solvedPuzzles: [],
        }
      ],
      allCollectedClues: [],
      chatHistory: [],
      puzzles: [
        { id: 'puzzle1', solved: false },
        { id: 'puzzle2', solved: false },
        { id: 'puzzle3', solved: false },
        { id: 'puzzle4', solved: false },
      ],
      gameStarted: true,
      gameEnded: false,
    };

    useGameStore.setState({
      roomId: 'DEBUG',
      role: role,
      gameState: mockGameState,
      isConnected: true,
    });

    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
        <div className="text-center mb-8">
          <Bug className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-100">单人调试模式</h1>
          <p className="text-slate-400 mt-2 text-sm">无需双人联机，直接进入游戏测试</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => startDebug('A')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">👩‍💼</span>
              <div className="text-left">
                <div>侦探 A - 林晓月</div>
                <div className="text-xs opacity-80">书房 / 主卧室 / 厨房</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => startDebug('B')}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-medium transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">👨‍💼</span>
              <div className="text-left">
                <div>侦探 B - 周明轩</div>
                <div className="text-xs opacity-80">花园 / 地下室</div>
              </div>
            </div>
          </button>

          <div className="pt-4 border-t border-slate-700/50">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回大厅
            </button>
          </div>
        </div>

        <div className="mt-6 p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-300 text-center">
            ⚠️ 调试模式下聊天和多人同步功能不可用
          </p>
        </div>
      </div>
    </div>
  );
}
