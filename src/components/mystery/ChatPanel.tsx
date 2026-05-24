import { useGameStore } from '@/store/mysteryStore';
import { Send, Share2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ChatPanel() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const sendMessage = useGameStore(state => state.sendMessage);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.chatHistory]);

  if (!role || !gameState) return null;

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const getRoleColor = (sender: 'A' | 'B') => {
    return sender === 'A' ? 'text-blue-400' : 'text-emerald-400';
  };

  const getRoleName = (sender: 'A' | 'B') => {
    return sender === 'A' ? '林晓月' : '周明轩';
  };

  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 flex flex-col h-80">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-slate-300 font-medium">通讯频道</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {gameState.chatHistory.length === 0 ? (
          <div className="text-sm text-slate-500 italic text-center py-4">
            与队友分享你发现的线索...
          </div>
        ) : (
          gameState.chatHistory.map(msg => (
            <div key={msg.id} className={`text-sm ${msg.sender === role ? 'text-right' : 'text-left'}`}>
              {msg.type === 'system' ? (
                <div className="text-center text-slate-500 italic">{msg.content}</div>
              ) : msg.type === 'clue_share' ? (
                <div className={`inline-block p-2 rounded-lg ${msg.sender === role ? 'bg-slate-700/50' : 'bg-slate-900/50'}`}>
                  <div className={`text-xs ${getRoleColor(msg.sender)} mb-1`}>
                    {getRoleName(msg.sender)} 分享了线索
                  </div>
                  <div className="text-slate-200 flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {msg.sharedClue}
                  </div>
                </div>
              ) : (
                <div className={`inline-block p-2 rounded-lg max-w-[80%] ${msg.sender === role ? 'bg-slate-700/50' : 'bg-slate-900/50'}`}>
                  <div className={`text-xs ${getRoleColor(msg.sender)} mb-1`}>
                    {getRoleName(msg.sender)}
                  </div>
                  <div className="text-slate-200">{msg.content}</div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-slate-600"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
