import { useGameStore } from '@/store/mysteryStore';
import { useState } from 'react';
import { FileText, Send } from 'lucide-react';

export default function FinalAnswerPanel() {
  const role = useGameStore(state => state.role);
  const gameState = useGameStore(state => state.gameState);
  const submitFinalAnswer = useGameStore(state => state.submitFinalAnswer);
  const [answers, setAnswers] = useState({
    murderer: '',
    motive: '',
    method: '',
    time: '',
    evidence: '',
  });
  const [showPanel, setShowPanel] = useState(false);

  if (!role || !gameState) return null;

  const allPuzzlesSolved = gameState.puzzles.every(p => p.solved);
  const hasEnoughClues = gameState.allCollectedClues.length >= 10;

  const handleSubmit = () => {
    submitFinalAnswer(answers);
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        disabled={!allPuzzlesSolved || !hasEnoughClues}
        className={`w-full p-4 rounded-xl transition-all ${
          allPuzzlesSolved && hasEnoughClues
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
            : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="font-medium">
            {allPuzzlesSolved && hasEnoughClues ? '提交最终答案' : '需要解开所有谜题后才能提交'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" />
          案件最终报告
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">凶手是谁？</label>
            <input
              type="text"
              value={answers.murderer}
              onChange={e => setAnswers({ ...answers, murderer: e.target.value })}
              placeholder="输入凶手姓名"
              className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">作案动机？</label>
            <input
              type="text"
              value={answers.motive}
              onChange={e => setAnswers({ ...answers, motive: e.target.value })}
              placeholder="输入作案动机"
              className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">作案手法？</label>
            <input
              type="text"
              value={answers.method}
              onChange={e => setAnswers({ ...answers, method: e.target.value })}
              placeholder="输入作案手法"
              className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">作案时间？</label>
            <input
              type="text"
              value={answers.time}
              onChange={e => setAnswers({ ...answers, time: e.target.value })}
              placeholder="输入作案时间"
              className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">关键证据？</label>
            <input
              type="text"
              value={answers.evidence}
              onChange={e => setAnswers({ ...answers, evidence: e.target.value })}
              placeholder="输入关键证据"
              className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowPanel(false)}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200"
          >
            继续调查
          </button>
          <button
            onClick={handleSubmit}
            disabled={!answers.murderer || !answers.motive || !answers.method}
            className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            提交答案
          </button>
        </div>
      </div>
    </div>
  );
}
