export type WordCategory = 'memorize' | 'spell';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type WordStatus = 'new' | 'learning' | 'mastered' | 'reviewing';

export interface Word {
  id: string;
  word: string;
  phonetic: {
    uk: string;
    us: string;
  };
  partOfSpeech: PartOfSpeech[];
  meanings: string[];
  examples: Example[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  category: WordCategory;
  difficulty: DifficultyLevel;
  frequency: number;
  status: WordStatus;
  lastReviewed?: number;
  nextReview?: number;
  correctCount: number;
  wrongCount: number;
}

export interface PartOfSpeech {
  type: 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'conj' | 'int' | 'pron';
  meaning: string;
}

export interface Example {
  sentence: string;
  translation: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  wordIds: string[];
  requiredScore: number;
  reward: Reward;
  unlocked: boolean;
  completed: boolean;
}

export interface Reward {
  badge: string;
  badgeIcon: string;
  points: number;
  title: string;
}

export interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  totalPoints: number;
  badges: string[];
  dailyGoal: number;
  dailyLearned: number;
  streakDays: number;
  lastStudyDate: string;
  totalStudyTime: number;
  wordsLearned: number;
  wordsMastered: number;
}

export interface SpellingExercise {
  id: string;
  wordId: string;
  type: SpellingType;
  hint: string;
  answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timestamp?: number;
}

export type SpellingType = 'listen' | 'meaning' | 'complete';

export interface TranslationExercise {
  id: string;
  english: string;
  chinese: string;
  keywords: string[];
  grammarPoints: string[];
  difficulty: DifficultyLevel;
  userTranslation?: string;
  score?: number;
  feedback?: string;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  wordsStudied: string[];
  exercises: (SpellingExercise | TranslationExercise)[];
  score: number;
  type: 'level' | 'spelling' | 'translation' | 'review';
}

export interface StudyStats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  averageAccuracy: number;
  studyTimeToday: number;
  studyTimeTotal: number;
  weeklyProgress: DailyProgress[];
  categoryProgress: {
    memorize: number;
    spell: number;
  };
}

export interface DailyProgress {
  date: string;
  wordsLearned: number;
  accuracy: number;
  studyTime: number;
}

export interface WordFilter {
  category?: WordCategory;
  difficulty?: DifficultyLevel;
  status?: WordStatus;
  search?: string;
  sortBy?: 'frequency' | 'difficulty' | 'alphabetical' | 'progress';
  sortOrder?: 'asc' | 'desc';
}

export const PART_OF_SPEECH_MAP: Record<PartOfSpeech['type'], string> = {
  n: '名词',
  v: '动词',
  adj: '形容词',
  adv: '副词',
  prep: '介词',
  conj: '连词',
  int: '感叹词',
  pron: '代词',
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: '简单',
  2: '较易',
  3: '中等',
  4: '较难',
  5: '困难',
};

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  memorize: '仅需记忆',
  spell: '需要拼写',
};

export const STATUS_LABELS: Record<WordStatus, string> = {
  new: '未学习',
  learning: '学习中',
  mastered: '已掌握',
  reviewing: '复习中',
};
