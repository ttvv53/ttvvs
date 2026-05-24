export type PlayerRole = 'A' | 'B';
export type ClueType = 'evidence' | 'document' | 'environment' | 'testimony';

export interface Clue {
  id: string;
  name: string;
  type: ClueType;
  scene: string;
  description: string;
  detail: string;
  visibleTo: PlayerRole | 'both';
  icon: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  image: string;
  visibleTo: PlayerRole | 'both';
  clues: string[];
  connections: string[];
}

export interface Puzzle {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  requiredClues: string[];
  solution: string;
  reward: string;
  solved: boolean;
}

export interface ChatMessage {
  id: string;
  sender: PlayerRole;
  content: string;
  timestamp: number;
  type: 'text' | 'clue_share' | 'system';
  sharedClue?: string;
}

export interface PlayerState {
  role: PlayerRole;
  name: string;
  currentScene: string;
  collectedClues: string[];
  solvedPuzzles: string[];
}

export interface GameState {
  roomId: string;
  players: PlayerState[];
  allCollectedClues: string[];
  chatHistory: ChatMessage[];
  puzzles: Puzzle[];
  gameStarted: boolean;
  gameEnded: boolean;
  winner: PlayerRole | null;
}

export interface FinalAnswer {
  murderer: string;
  motive: string;
  method: string;
  time: string;
  evidence: string;
}
