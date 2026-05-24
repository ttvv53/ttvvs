import { useState, useEffect } from 'react';
import { useVocabularyStore } from '@/store/vocabularyStore';
import { Word, WordCategory, DifficultyLevel, WordStatus } from '@/types/vocabulary';
import { 
  BookOpen, Trophy, PenTool, Languages, BarChart3, Settings, 
  ChevronRight, Volume2, Star, Check, X, Award, Target,
  Filter, Search, ArrowLeft, ArrowRight, RotateCcw, Zap
} from 'lucide-react';
import { PART_OF_SPEECH_MAP, DIFFICULTY_LABELS, CATEGORY_LABELS, STATUS_LABELS } from '@/types/vocabulary';

type TabType = 'library' | 'levels' | 'spelling' | 'translation' | 'stats';

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const { initializeStore, progress } = useVocabularyStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const tabs = [
    { id: 'library' as TabType, label: '单词库', icon: BookOpen },
    { id: 'levels' as TabType, label: '闯关学习', icon: Trophy },
    { id: 'spelling' as TabType, label: '拼写训练', icon: PenTool },
    { id: 'translation' as TabType, label: '翻译练习', icon: Languages },
    { id: 'stats' as TabType, label: '学习统计', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-400" />
                六级词汇学习系统
              </h1>
              <p className="text-slate-400 mt-2">高效记忆，轻松过级</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-900/50 px-4 py-2 rounded-lg border border-indigo-700/50">
                <span className="text-indigo-300 text-sm">今日学习</span>
                <span className="text-white font-bold ml-2">{progress.dailyLearned}/{progress.dailyGoal}</span>
              </div>
              <div className="bg-amber-900/50 px-4 py-2 rounded-lg border border-amber-700/50">
                <span className="text-amber-300 text-sm">连续</span>
                <span className="text-white font-bold ml-2">{progress.streakDays}天</span>
              </div>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <main>
          {activeTab === 'library' && <WordLibrary />}
          {activeTab === 'levels' && <LevelLearning />}
          {activeTab === 'spelling' && <SpellingTraining />}
          {activeTab === 'translation' && <TranslationPractice />}
          {activeTab === 'stats' && <StudyStats />}
        </main>
      </div>
    </div>
  );
}

function WordLibrary() {
  const { words } = useVocabularyStore();
  const [filter, setFilter] = useState<{
    category?: WordCategory;
    difficulty?: DifficultyLevel;
    status?: WordStatus;
    search: string;
  }>({ search: '' });
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const filteredWords = words.filter(word => {
    if (filter.category && word.category !== filter.category) return false;
    if (filter.difficulty && word.difficulty !== filter.difficulty) return false;
    if (filter.status && word.status !== filter.status) return false;
    if (filter.search && !word.word.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索单词..."
                value={filter.search}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={filter.category || ''}
              onChange={e => setFilter({ ...filter, category: e.target.value as WordCategory || undefined })}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">全部分类</option>
              <option value="memorize">仅需记忆</option>
              <option value="spell">需要拼写</option>
            </select>
            <select
              value={filter.difficulty || ''}
              onChange={e => setFilter({ ...filter, difficulty: Number(e.target.value) as DifficultyLevel || undefined })}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">全部难度</option>
              {[1, 2, 3, 4, 5].map(d => (
                <option key={d} value={d}>{DIFFICULTY_LABELS[d as DifficultyLevel]}</option>
              ))}
            </select>
            <select
              value={filter.status || ''}
              onChange={e => setFilter({ ...filter, status: e.target.value as WordStatus || undefined })}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">全部状态</option>
              <option value="new">未学习</option>
              <option value="learning">学习中</option>
              <option value="mastered">已掌握</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">单词</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">释义</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">分类</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">难度</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map(word => (
                  <tr
                    key={word.id}
                    onClick={() => setSelectedWord(word)}
                    className={`border-t border-slate-700/30 cursor-pointer transition-colors ${
                      selectedWord?.id === word.id ? 'bg-indigo-900/30' : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{word.word}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); playAudio(word.word); }}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-slate-500 text-sm">{word.phonetic.us}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm max-w-[200px] truncate">
                      {word.partOfSpeech.map(p => p.meaning).join('; ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        word.category === 'spell' ? 'bg-amber-900/50 text-amber-300' : 'bg-emerald-900/50 text-emerald-300'
                      }`}>
                        {CATEGORY_LABELS[word.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= word.difficulty ? 'bg-indigo-500' : 'bg-slate-600'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        word.status === 'mastered' ? 'bg-emerald-900/50 text-emerald-300' :
                        word.status === 'learning' ? 'bg-amber-900/50 text-amber-300' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        {STATUS_LABELS[word.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedWord ? (
          <WordDetail word={selectedWord} onClose={() => setSelectedWord(null)} playAudio={playAudio} />
        ) : (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">选择一个单词查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WordDetail({ word, onClose, playAudio }: { word: Word; onClose: () => void; playAudio: (w: string) => void }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">{word.word}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-slate-400">英 {word.phonetic.uk}</span>
              <span className="text-slate-400">美 {word.phonetic.us}</span>
              <button
                onClick={() => playAudio(word.word)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                <Volume2 className="w-4 h-4" />
                发音
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-indigo-400 font-medium mb-2">词性与释义</h4>
          <div className="space-y-1">
            {word.partOfSpeech.map((p, i) => (
              <div key={i} className="text-slate-300">
                <span className="text-indigo-400 mr-2">{PART_OF_SPEECH_MAP[p.type]}</span>
                {p.meaning}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-indigo-400 font-medium mb-2">例句</h4>
          <div className="space-y-2">
            {word.examples.map((ex, i) => (
              <div key={i} className="bg-slate-900/30 rounded-lg p-3">
                <p className="text-slate-200">{ex.sentence}</p>
                <p className="text-slate-500 text-sm mt-1">{ex.translation}</p>
              </div>
            ))}
          </div>
        </div>

        {word.collocations.length > 0 && (
          <div>
            <h4 className="text-indigo-400 font-medium mb-2">常用搭配</h4>
            <div className="flex flex-wrap gap-2">
              {word.collocations.map((col, i) => (
                <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-sm">
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <div className="flex-1 bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{word.correctCount}</div>
            <div className="text-slate-500 text-sm">正确次数</div>
          </div>
          <div className="flex-1 bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-rose-400">{word.wrongCount}</div>
            <div className="text-slate-500 text-sm">错误次数</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelLearning() {
  const { levels, progress, setCurrentLevel, currentLevelId, getNextWord, markWordCorrect, markWordWrong, completeLevel, currentWordIndex } = useVocabularyStore();
  const [showingResult, setShowingResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);

  const currentLevel = levels.find(l => l.id === currentLevelId);
  const currentWord = getNextWord();

  const handleAnswer = (correct: boolean) => {
    if (!currentWord) return;
    
    setIsCorrect(correct);
    setShowingResult(true);
    
    if (correct) {
      markWordCorrect(currentWord.id);
      setLevelCorrect(prev => prev + 1);
      setLevelScore(prev => prev + 10);
    } else {
      markWordWrong(currentWord.id);
    }

    setTimeout(() => {
      setShowingResult(false);
      
      if (currentLevel && currentWordIndex >= currentLevel.wordIds.length) {
        const accuracy = Math.round((levelCorrect / currentLevel.wordIds.length) * 100);
        completeLevel(currentLevel.id, accuracy);
        setLevelScore(0);
        setLevelCorrect(0);
      }
    }, 1500);
  };

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  if (currentLevelId && currentWord) {
    const progressPercent = Math.round((currentWordIndex / currentLevel.wordIds.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{currentLevel.name}</h3>
            <button
              onClick={() => { setCurrentLevel(0 as unknown as number); setLevelScore(0); setLevelCorrect(0); }}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>进度 {currentWordIndex + 1}/{currentLevel.wordIds.length}</span>
              <span>得分 {levelScore}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center transition-all ${
          showingResult ? (isCorrect ? 'ring-2 ring-emerald-500' : 'ring-2 ring-rose-500') : ''
        }`}>
          {showingResult ? (
            <div className={`text-6xl mb-4 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? <Check className="w-20 h-20 mx-auto" /> : <X className="w-20 h-20 mx-auto" />}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => playAudio(currentWord.word)}
                  className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center mx-auto mb-4 transition-colors"
                >
                  <Volume2 className="w-10 h-10 text-white" />
                </button>
                <p className="text-slate-400">点击播放发音</p>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">{currentWord.word}</h2>
              <p className="text-slate-400 mb-4">{currentWord.phonetic.us}</p>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                {currentWord.partOfSpeech.map((p, i) => (
                  <p key={i} className="text-slate-300">
                    <span className="text-indigo-400">{PART_OF_SPEECH_MAP[p.type]}</span> {p.meaning}
                  </p>
                ))}
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <p className="text-slate-200">{currentWord.examples[0]?.sentence}</p>
                <p className="text-slate-500 text-sm mt-2">{currentWord.examples[0]?.translation}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleAnswer(false)}
                  className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  不认识
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  认识
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {levels.map(level => (
        <div
          key={level.id}
          className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 ${
            !level.unlocked ? 'opacity-60' : 'hover:border-indigo-500/50 cursor-pointer transition-colors'
          }`}
          onClick={() => level.unlocked && setCurrentLevel(level.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {level.reward.badgeIcon}
                {level.name}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{level.description}</p>
            </div>
            {!level.unlocked && (
              <div className="bg-slate-700/50 px-3 py-1 rounded-lg text-slate-400 text-sm">
                未解锁
              </div>
            )}
            {level.completed && (
              <div className="bg-emerald-900/50 px-3 py-1 rounded-lg text-emerald-400 text-sm flex items-center gap-1">
                <Check className="w-4 h-4" />
                已完成
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-sm">单词数量</div>
              <div className="text-white font-bold text-lg">{level.wordIds.length}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-sm">达标分数</div>
              <div className="text-white font-bold text-lg">{level.requiredScore}%</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-3 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-amber-400 font-medium">{level.reward.badge}</div>
              <div className="text-slate-400 text-sm">+{level.reward.points} 积分</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SpellingTraining() {
  const { words, createSpellingExercise, submitSpellingAnswer, spellingExercises } = useVocabularyStore();
  const [selectedType, setSelectedType] = useState<'listen' | 'meaning' | 'complete'>('meaning');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<{ show: boolean; correct: boolean }>({ show: false, correct: false });
  const [currentExercise, setCurrentExercise] = useState<string>('');

  const spellWords = words.filter(w => w.category === 'spell');
  
  const startExercise = () => {
    const randomWord = spellWords[Math.floor(Math.random() * spellWords.length)];
    if (randomWord) {
      setCurrentWord(randomWord);
      const exercise = createSpellingExercise(randomWord.id, selectedType);
      setCurrentExercise(exercise.id);
      setUserInput('');
      setResult({ show: false, correct: false });
    }
  };

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (!currentExercise || !userInput.trim()) return;
    
    const correct = submitSpellingAnswer(currentExercise, userInput.trim());
    setResult({ show: true, correct });
    
    setTimeout(() => {
      startExercise();
    }, 2000);
  };

  useEffect(() => {
    if (spellWords.length > 0) {
      startExercise();
    }
  }, []);

  const typeLabels = {
    listen: '听力拼写',
    meaning: '释义拼写',
    complete: '补全拼写'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">选择练习模式</h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(typeLabels) as Array<'listen' | 'meaning' | 'complete'>).map(type => (
            <button
              key={type}
              onClick={() => { setSelectedType(type); startExercise(); }}
              className={`p-4 rounded-lg border transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {currentWord && (
        <div className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 ${
          result.show ? (result.correct ? 'ring-2 ring-emerald-500' : 'ring-2 ring-rose-500') : ''
        }`}>
          {result.show ? (
            <div className="text-center">
              <div className={`text-6xl mb-4 ${result.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.correct ? <Check className="w-20 h-20 mx-auto" /> : <X className="w-20 h-20 mx-auto" />}
              </div>
              <p className="text-xl text-white">{result.correct ? '正确！' : '错误'}</p>
              {!result.correct && (
                <p className="text-slate-400 mt-2">正确答案: {currentWord.word}</p>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {selectedType === 'listen' && (
                  <div>
                    <button
                      onClick={() => playAudio(currentWord.word)}
                      className="w-24 h-24 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center mx-auto mb-4 transition-colors"
                    >
                      <Volume2 className="w-12 h-12 text-white" />
                    </button>
                    <p className="text-slate-400">听发音拼写单词</p>
                  </div>
                )}
                {selectedType === 'meaning' && (
                  <div className="bg-slate-900/50 rounded-lg p-6">
                    <p className="text-xl text-white">{currentWord.meanings.join('; ')}</p>
                    <p className="text-slate-400 mt-2">根据释义拼写单词</p>
                  </div>
                )}
                {selectedType === 'complete' && (
                  <div className="bg-slate-900/50 rounded-lg p-6">
                    <p className="text-3xl text-white font-mono tracking-wider">
                      {currentWord.word.slice(0, Math.floor(currentWord.word.length / 2))}
                      <span className="text-indigo-400">_</span>
                      <span className="text-indigo-400">_</span>
                      <span className="text-indigo-400">_</span>
                    </p>
                    <p className="text-slate-400 mt-2">补全单词</p>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  placeholder="输入单词..."
                  className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xl text-center placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="w-full mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium transition-colors"
                >
                  确认
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TranslationPractice() {
  const { translationExercises, submitTranslation } = useVocabularyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTranslation, setUserTranslation] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const currentExercise = translationExercises[currentIndex];

  const handleSubmit = () => {
    if (!userTranslation.trim()) return;
    
    const res = submitTranslation(currentExercise.id, userTranslation.trim());
    setResult(res);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % translationExercises.length);
    setUserTranslation('');
    setResult(null);
  };

  if (!currentExercise) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-medium">翻译练习</span>
          </div>
          <div className="text-slate-400">
            {currentIndex + 1} / {translationExercises.length}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-indigo-900/50 text-indigo-400 rounded text-sm">英文</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= currentExercise.difficulty ? 'bg-amber-500' : 'bg-slate-600'}`} />
              ))}
            </div>
          </div>
          <p className="text-2xl text-white leading-relaxed">{currentExercise.english}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 rounded text-sm">关键词</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentExercise.keywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 mb-2">请翻译为中文：</label>
          <textarea
            value={userTranslation}
            onChange={e => setUserTranslation(e.target.value)}
            placeholder="输入你的翻译..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
            disabled={!!result}
          />
        </div>

        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!userTranslation.trim()}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium transition-colors"
          >
            提交翻译
          </button>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              result.score >= 80 ? 'bg-emerald-900/30 border border-emerald-700/50' :
              result.score >= 60 ? 'bg-amber-900/30 border border-amber-700/50' :
              'bg-rose-900/30 border border-rose-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">得分</span>
                <span className={`text-2xl font-bold ${
                  result.score >= 80 ? 'text-emerald-400' :
                  result.score >= 60 ? 'text-amber-400' :
                  'text-rose-400'
                }`}>{result.score}</span>
              </div>
              <p className="text-slate-300">{result.feedback}</p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">参考译文</p>
              <p className="text-white">{currentExercise.chinese}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              下一题
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StudyStats() {
  const { progress, words, getStats } = useVocabularyStore();
  const stats = getStats();

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}小时${minutes}分钟`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-8 h-8 text-indigo-400" />
            <span className="text-indigo-300">总积分</span>
          </div>
          <div className="text-3xl font-bold text-white">{progress.totalPoints}</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-6 border border-amber-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8 text-amber-400" />
            <span className="text-amber-300">连续学习</span>
          </div>
          <div className="text-3xl font-bold text-white">{progress.streakDays} 天</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border border-emerald-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Check className="w-8 h-8 text-emerald-400" />
            <span className="text-emerald-300">已掌握</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.masteredWords}</div>
        </div>
        
        <div className="bg-gradient-to-br from-rose-900/50 to-pink-900/50 rounded-xl p-6 border border-rose-700/50">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-8 h-8 text-rose-400" />
            <span className="text-rose-300">正确率</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.averageAccuracy}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-xl font-bold text-white mb-4">学习进度</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">记忆类单词</span>
                <span className="text-white">{stats.categoryProgress.memorize}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${stats.categoryProgress.memorize}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">拼写类单词</span>
                <span className="text-white">{stats.categoryProgress.spell}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${stats.categoryProgress.spell}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-xl font-bold text-white mb-4">单词状态分布</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-400">{stats.newWords}</div>
              <div className="text-slate-500 text-sm">未学习</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{stats.learningWords}</div>
              <div className="text-slate-500 text-sm">学习中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{stats.masteredWords}</div>
              <div className="text-slate-500 text-sm">已掌握</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-xl font-bold text-white mb-4">成就徽章</h3>
        {progress.badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {progress.badges.map((badge, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-lg p-4 flex items-center gap-3 border border-amber-700/30">
                <Award className="w-8 h-8 text-amber-400" />
                <span className="text-amber-300 font-medium">{badge}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">还没有获得徽章，继续加油！</p>
        )}
      </div>
    </div>
  );
}
