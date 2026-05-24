import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word, Level, UserProgress, SpellingExercise, TranslationExercise, WordStatus } from '@/types/vocabulary';
import { cet6Words, levels, translationExercises, getWordById } from '@/data/vocabulary';

interface VocabularyState {
  words: Word[];
  levels: Level[];
  progress: UserProgress;
  currentLevelId: number | null;
  currentWordIndex: number;
  spellingExercises: SpellingExercise[];
  translationExercises: TranslationExercise[];
  studySessionStart: number | null;
  
  initializeStore: () => void;
  setCurrentLevel: (levelId: number) => void;
  getNextWord: () => Word | null;
  markWordCorrect: (wordId: string) => void;
  markWordWrong: (wordId: string) => void;
  updateWordStatus: (wordId: string, status: WordStatus) => void;
  completeLevel: (levelId: number, score: number) => void;
  unlockNextLevel: () => void;
  
  createSpellingExercise: (wordId: string, type: 'listen' | 'meaning' | 'complete') => SpellingExercise;
  submitSpellingAnswer: (exerciseId: string, answer: string) => boolean;
  
  submitTranslation: (exerciseId: string, translation: string) => { score: number; feedback: string };
  
  startStudySession: () => void;
  endStudySession: () => void;
  
  setDailyGoal: (goal: number) => void;
  getStats: () => {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    newWords: number;
    averageAccuracy: number;
    categoryProgress: { memorize: number; spell: number };
  };
}

const initialProgress: UserProgress = {
  currentLevel: 1,
  completedLevels: [],
  totalPoints: 0,
  badges: [],
  dailyGoal: 20,
  dailyLearned: 0,
  streakDays: 0,
  lastStudyDate: '',
  totalStudyTime: 0,
  wordsLearned: 0,
  wordsMastered: 0
};

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      words: cet6Words,
      levels: levels,
      progress: initialProgress,
      currentLevelId: null,
      currentWordIndex: 0,
      spellingExercises: [],
      translationExercises: translationExercises,
      studySessionStart: null,

      initializeStore: () => {
        const today = new Date().toDateString();
        set(state => {
          const lastDate = state.progress.lastStudyDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          let streakDays = state.progress.streakDays;
          if (lastDate === yesterday.toDateString()) {
            streakDays += 1;
          } else if (lastDate !== today) {
            streakDays = 0;
          }
          
          return {
            progress: {
              ...state.progress,
              lastStudyDate: today,
              streakDays: lastDate === today ? streakDays : (lastDate === yesterday.toDateString() ? streakDays + 1 : 1),
              dailyLearned: lastDate === today ? state.progress.dailyLearned : 0
            }
          };
        });
      },

      setCurrentLevel: (levelId: number) => {
        set({ currentLevelId: levelId, currentWordIndex: 0 });
      },

      getNextWord: () => {
        const state = get();
        if (!state.currentLevelId) return null;
        
        const level = state.levels.find(l => l.id === state.currentLevelId);
        if (!level) return null;
        
        const wordId = level.wordIds[state.currentWordIndex];
        if (!wordId) return null;
        
        return getWordById(wordId) || null;
      },

      markWordCorrect: (wordId: string) => {
        set(state => {
          const wordIndex = state.words.findIndex(w => w.id === wordId);
          if (wordIndex === -1) return state;
          
          const word = state.words[wordIndex];
          const newCorrectCount = word.correctCount + 1;
          const newStatus = newCorrectCount >= 3 ? 'mastered' as WordStatus : 'learning' as WordStatus;
          
          const newWords = [...state.words];
          newWords[wordIndex] = {
            ...word,
            correctCount: newCorrectCount,
            status: newStatus,
            lastReviewed: Date.now()
          };
          
          return {
            words: newWords,
            currentWordIndex: state.currentWordIndex + 1,
            progress: {
              ...state.progress,
              totalPoints: state.progress.totalPoints + 10,
              dailyLearned: state.progress.dailyLearned + 1,
              wordsLearned: newStatus === 'learning' ? state.progress.wordsLearned + 1 : state.progress.wordsLearned,
              wordsMastered: newStatus === 'mastered' ? state.progress.wordsMastered + 1 : state.progress.wordsMastered
            }
          };
        });
      },

      markWordWrong: (wordId: string) => {
        set(state => {
          const wordIndex = state.words.findIndex(w => w.id === wordId);
          if (wordIndex === -1) return state;
          
          const word = state.words[wordIndex];
          const newWords = [...state.words];
          newWords[wordIndex] = {
            ...word,
            wrongCount: word.wrongCount + 1,
            status: 'learning' as WordStatus,
            lastReviewed: Date.now()
          };
          
          return {
            words: newWords,
            currentWordIndex: state.currentWordIndex + 1
          };
        });
      },

      updateWordStatus: (wordId: string, status: WordStatus) => {
        set(state => {
          const wordIndex = state.words.findIndex(w => w.id === wordId);
          if (wordIndex === -1) return state;
          
          const newWords = [...state.words];
          newWords[wordIndex] = { ...newWords[wordIndex], status };
          
          return { words: newWords };
        });
      },

      completeLevel: (levelId: number, score: number) => {
        set(state => {
          const levelIndex = state.levels.findIndex(l => l.id === levelId);
          if (levelIndex === -1) return state;
          
          const level = state.levels[levelIndex];
          if (score < level.requiredScore) return state;
          
          const newLevels = [...state.levels];
          newLevels[levelIndex] = { ...level, completed: true };
          
          if (levelIndex + 1 < newLevels.length) {
            newLevels[levelIndex + 1] = { ...newLevels[levelIndex + 1], unlocked: true };
          }
          
          return {
            levels: newLevels,
            currentLevelId: null,
            progress: {
              ...state.progress,
              completedLevels: [...state.progress.completedLevels, levelId],
              totalPoints: state.progress.totalPoints + level.reward.points,
              badges: [...state.progress.badges, level.reward.badge]
            }
          };
        });
      },

      unlockNextLevel: () => {
        set(state => {
          const currentLevelIndex = state.levels.findIndex(l => l.id === state.progress.currentLevel);
          if (currentLevelIndex === -1 || currentLevelIndex + 1 >= state.levels.length) return state;
          
          const newLevels = [...state.levels];
          newLevels[currentLevelIndex + 1] = { ...newLevels[currentLevelIndex + 1], unlocked: true };
          
          return {
            levels: newLevels,
            progress: { ...state.progress, currentLevel: state.progress.currentLevel + 1 }
          };
        });
      },

      createSpellingExercise: (wordId: string, type: 'listen' | 'meaning' | 'complete') => {
        const word = getWordById(wordId);
        if (!word) throw new Error('Word not found');
        
        let hint = '';
        let answer = word.word;
        
        switch (type) {
          case 'listen':
            hint = `听发音拼写单词`;
            break;
          case 'meaning':
            hint = word.meanings.join('; ');
            break;
          case 'complete':
            const mid = Math.floor(word.word.length / 2);
            hint = word.word.slice(0, mid) + '_'.repeat(word.word.length - mid);
            break;
        }
        
        const exercise: SpellingExercise = {
          id: `sp_${Date.now()}_${wordId}`,
          wordId,
          type,
          hint,
          answer
        };
        
        set(state => ({
          spellingExercises: [...state.spellingExercises, exercise]
        }));
        
        return exercise;
      },

      submitSpellingAnswer: (exerciseId: string, answer: string) => {
        const state = get();
        const exerciseIndex = state.spellingExercises.findIndex(e => e.id === exerciseId);
        if (exerciseIndex === -1) return false;
        
        const exercise = state.spellingExercises[exerciseIndex];
        const isCorrect = answer.toLowerCase().trim() === exercise.answer.toLowerCase().trim();
        
        set(state => {
          const newExercises = [...state.spellingExercises];
          newExercises[exerciseIndex] = {
            ...exercise,
            userAnswer: answer,
            isCorrect,
            timestamp: Date.now()
          };
          return { spellingExercises: newExercises };
        });
        
        if (isCorrect) {
          get().markWordCorrect(exercise.wordId);
        } else {
          get().markWordWrong(exercise.wordId);
        }
        
        return isCorrect;
      },

      submitTranslation: (exerciseId: string, translation: string) => {
        const state = get();
        const exerciseIndex = state.translationExercises.findIndex(e => e.id === exerciseId);
        if (exerciseIndex === -1) return { score: 0, feedback: '练习不存在' };
        
        const exercise = state.translationExercises[exerciseIndex];
        const referenceWords = exercise.chinese.split(/[，。、！？；：]/);
        const userWords = translation.split(/[，。、！？；：,.\s]+/);
        
        let matchCount = 0;
        referenceWords.forEach(ref => {
          if (userWords.some(user => ref.includes(user) || user.includes(ref))) {
            matchCount++;
          }
        });
        
        const keywordMatch = exercise.keywords.filter(kw => 
          translation.toLowerCase().includes(kw.toLowerCase()) ||
          exercise.chinese.includes(kw)
        ).length;
        
        const score = Math.min(100, Math.round((matchCount / referenceWords.length) * 60 + (keywordMatch / exercise.keywords.length) * 40));
        
        let feedback = '';
        if (score >= 90) {
          feedback = '优秀！翻译准确，表达流畅。';
        } else if (score >= 70) {
          feedback = '良好！基本意思正确，可以进一步优化表达。';
        } else if (score >= 50) {
          feedback = '及格。建议注意关键词的翻译和语法结构。';
        } else {
          feedback = `需要改进。参考译文：${exercise.chinese}`;
        }
        
        set(state => {
          const newExercises = [...state.translationExercises];
          newExercises[exerciseIndex] = {
            ...exercise,
            userTranslation: translation,
            score,
            feedback
          };
          return { translationExercises: newExercises };
        });
        
        return { score, feedback };
      },

      startStudySession: () => {
        set({ studySessionStart: Date.now() });
      },

      endStudySession: () => {
        set(state => {
          if (!state.studySessionStart) return state;
          
          const sessionTime = Date.now() - state.studySessionStart;
          return {
            studySessionStart: null,
            progress: {
              ...state.progress,
              totalStudyTime: state.progress.totalStudyTime + sessionTime
            }
          };
        });
      },

      setDailyGoal: (goal: number) => {
        set(state => ({
          progress: { ...state.progress, dailyGoal: goal }
        }));
      },

      getStats: () => {
        const state = get();
        const totalWords = state.words.length;
        const masteredWords = state.words.filter(w => w.status === 'mastered').length;
        const learningWords = state.words.filter(w => w.status === 'learning').length;
        const newWords = state.words.filter(w => w.status === 'new').length;
        
        const totalAttempts = state.words.reduce((acc, w) => acc + w.correctCount + w.wrongCount, 0);
        const totalCorrect = state.words.reduce((acc, w) => acc + w.correctCount, 0);
        const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
        
        const memorizeWords = state.words.filter(w => w.category === 'memorize');
        const spellWords = state.words.filter(w => w.category === 'spell');
        
        const memorizeProgress = memorizeWords.length > 0 
          ? Math.round((memorizeWords.filter(w => w.status === 'mastered').length / memorizeWords.length) * 100)
          : 0;
        const spellProgress = spellWords.length > 0
          ? Math.round((spellWords.filter(w => w.status === 'mastered').length / spellWords.length) * 100)
          : 0;
        
        return {
          totalWords,
          masteredWords,
          learningWords,
          newWords,
          averageAccuracy,
          categoryProgress: { memorize: memorizeProgress, spell: spellProgress }
        };
      }
    }),
    {
      name: 'vocabulary-storage',
      partialize: (state) => ({
        words: state.words,
        levels: state.levels,
        progress: state.progress
      })
    }
  )
);
