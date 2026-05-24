import { CLUES, SCENES, PLAYER_INFO, PUZZLES } from '@/types/gameData';
import { PlayerRole } from '@/types/mystery';

export function getCluesForPlayer(role: PlayerRole) {
  return CLUES.filter(clue => clue.visibleTo === role || clue.visibleTo === 'both');
}

export function getScenesForPlayer(role: PlayerRole) {
  return SCENES.filter(scene => scene.visibleTo === role || scene.visibleTo === 'both');
}

export function getClueById(id: string) {
  return CLUES.find(clue => clue.id === id);
}

export function getSceneById(id: string) {
  return SCENES.find(scene => scene.id === id);
}

export function getPlayerInfo(role: PlayerRole) {
  return PLAYER_INFO[role];
}

export function getPuzzleById(id: string) {
  return PUZZLES.find(puzzle => puzzle.id === id);
}

export function canSolvePuzzle(puzzleId: string, collectedClues: string[]) {
  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) return false;
  return puzzle.requiredClues.every(clue => collectedClues.includes(clue));
}

export function getProgress(collectedClues: string[], solvedPuzzles: string[]) {
  const totalClues = CLUES.length;
  const totalPuzzles = PUZZLES.length;
  return {
    cluesProgress: (collectedClues.length / totalClues) * 100,
    puzzlesProgress: (solvedPuzzles.length / totalPuzzles) * 100,
  };
}
