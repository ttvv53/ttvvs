import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/mysteryStore';
import { Trophy, Users, Copy, Check, BookOpen, Bug } from 'lucide-react';

export default function Lobby() {
  const navigate = useNavigate();
  const connect = useGameStore(state => state.connect);
  const createRoom = useGameStore(state => state.createRoom);
  const joinRoom = useGameStore(state => state.joinRoom);
  const roomId = useGameStore(state => state.roomId);
  const role = useGameStore(state => state.role);
  const isConnected = useGameStore(state => state.isConnected);
  const error = useGameStore(state => state.error);

  const gameState = useGameStore(state => state.gameState);

  const [inputRoomId, setInputRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (gameState && roomId) {
      navigate('/game');
    }
  }, [gameState, roomId, navigate]);

  const handleCreateRoom = async () => {
    const id = await createRoom();
    if (id) {
      setMode('create');
    }
  };

  const handleJoinRoom = async () => {
    if (inputRoomId && !joining) {
      setJoining(true);
      const success = await joinRoom(inputRoomId.toUpperCase());
      if (success) {
        setMode('join');
      } else {
        setJoining(false);
      }
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400">连接服务器中...</div>
      </div>
    );
  }

  if (mode === 'create' && roomId && role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🕵️</div>
            <h1 className="text-2xl font-bold text-slate-100">房间已创建</h1>
            <p className="text-slate-400 mt-2">等待另一位侦探加入...</p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
            <div className="text-sm text-slate-500 mb-2">房间号</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-blue-400">{roomId}</span>
              <button
                onClick={copyRoomId}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg">
                👩‍💼
              </div>
              <div>
                <div className="text-slate-200 font-medium">林晓月 (你)</div>
                <div className="text-xs text-blue-400">侦探 A</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            将房间号发送给队友，等待加入后游戏自动开始
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join' && roomId && role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🕵️</div>
            <h1 className="text-2xl font-bold text-slate-100">已加入房间</h1>
            <p className="text-slate-400 mt-2">等待游戏开始...</p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
            <div className="text-sm text-slate-500 mb-2">房间号</div>
            <span className="text-2xl font-mono font-bold text-emerald-400">{roomId}</span>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-lg">
                👨‍💼
              </div>
              <div>
                <div className="text-slate-200 font-medium">陈默 (你)</div>
                <div className="text-xs text-emerald-400">侦探 B</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            等待房主开始游戏...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md w-full border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            午夜庄园谜案
          </h1>
          <p className="text-slate-400 mt-2">双人联机推理游戏</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-5 h-5" />
              创建房间
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Trophy className="w-5 h-5" />
              加入房间
            </button>
            <button
              onClick={() => navigate('/vocabulary')}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              六级词汇学习
            </button>
            <button
              onClick={() => navigate('/debug')}
              className="w-full py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/30 rounded-xl text-amber-400 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Bug className="w-4 h-4" />
              单人调试
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">输入房间号</label>
              <input
                type="text"
                value={inputRoomId}
                onChange={e => setInputRoomId(e.target.value.toUpperCase())}
                placeholder="例如: ABC123"
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-900/50 rounded-xl text-slate-200 placeholder-slate-500 text-center text-xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={inputRoomId.length !== 6 || joining}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl text-white font-medium transition-all"
            >
              {joining ? '加入中...' : '加入游戏'}
            </button>
            <button
              onClick={() => setMode('menu')}
              className="w-full py-3 text-slate-400 hover:text-slate-200"
            >
              返回
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 text-center">
            两位侦探将分别调查庄园的不同区域<br/>
            通过合作交流拼凑出完整的真相
          </div>
        </div>
      </div>
    </div>
  );
}
