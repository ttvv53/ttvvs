import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { PlayerRole, ChatMessage, GameState, FinalAnswer } from '@/types/mystery';

interface GameStore {
  socket: Socket | null;
  roomId: string | null;
  role: PlayerRole | null;
  gameState: GameState | null;
  isConnected: boolean;
  error: string | null;
  victory: boolean;

  connect: () => void;
  createRoom: () => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  moveToScene: (sceneId: string) => void;
  collectClue: (clueId: string) => void;
  sendMessage: (content: string) => void;
  shareClue: (clueId: string) => void;
  solvePuzzle: (puzzleId: string, answer: string) => void;
  submitFinalAnswer: (answer: FinalAnswer) => void;
  setGameState: (state: GameState) => void;
}

const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  return 'http://localhost:3001';
};

export const useGameStore = create<GameStore>((set, get) => ({
  socket: null,
  roomId: null,
  role: null,
  gameState: null,
  isConnected: false,
  error: null,
  victory: false,

  connect: () => {
    const socketUrl = getSocketUrl();
    const socket = io(socketUrl);
    
    socket.on('connect', () => {
      set({ isConnected: true, socket });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('game_start', (gameState: GameState) => {
      set({ gameState });
    });

    socket.on('player_moved', (data: { role: PlayerRole; sceneId: string }) => {
      const { gameState } = get();
      if (gameState) {
        const playerIndex = gameState.players.findIndex(p => p.role === data.role);
        if (playerIndex !== -1) {
          const newPlayers = [...gameState.players];
          newPlayers[playerIndex] = { ...newPlayers[playerIndex], currentScene: data.sceneId };
          set({ gameState: { ...gameState, players: newPlayers } });
        }
      }
    });

    socket.on('clue_collected', (data: { role: PlayerRole; clueId: string; gameState: GameState }) => {
      set({ gameState: data.gameState });
    });

    socket.on('new_message', (message: ChatMessage) => {
      const { gameState } = get();
      if (gameState) {
        set({ 
          gameState: { 
            ...gameState, 
            chatHistory: [...gameState.chatHistory, message] 
          } 
        });
      }
    });

    socket.on('puzzle_solved', (data: { puzzleId: string; gameState: GameState }) => {
      set({ gameState: data.gameState });
    });

    socket.on('game_victory', () => {
      const { gameState } = get();
      if (gameState) {
        set({ gameState: { ...gameState, gameEnded: true }, victory: true });
      }
    });

    socket.on('answer_incorrect', (data: { message: string }) => {
      set({ error: data.message });
      setTimeout(() => set({ error: null }), 3000);
    });

    socket.on('player_left', () => {
      set({ error: '队友已离开游戏' });
    });

    set({ socket });
  },

  createRoom: async () => {
    const { socket } = get();
    if (!socket) return null;

    return new Promise((resolve) => {
      socket.emit('create_room', (response: { roomId: string; role: PlayerRole }) => {
        set({ roomId: response.roomId, role: response.role });
        resolve(response.roomId);
      });
    });
  },

  joinRoom: async (roomId: string) => {
    const { socket } = get();
    if (!socket) return false;

    return new Promise((resolve) => {
      socket.emit('join_room', roomId, (response: { roomId?: string; role?: PlayerRole; error?: string }) => {
        if (response.error) {
          set({ error: response.error });
          resolve(false);
        } else {
          set({ roomId: response.roomId!, role: response.role! });
          resolve(true);
        }
      });
    });
  },

  moveToScene: (sceneId: string) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('move_to_scene', { roomId, sceneId });
    }
  },

  collectClue: (clueId: string) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('collect_clue', { roomId, clueId });
    }
  },

  sendMessage: (content: string) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('send_message', { roomId, content });
    }
  },

  shareClue: (clueId: string) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('share_clue', { roomId, clueId });
    }
  },

  solvePuzzle: (puzzleId: string, answer: string) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('solve_puzzle', { roomId, puzzleId, answer });
    }
  },

  submitFinalAnswer: (answer: FinalAnswer) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('submit_final_answer', { roomId, answer });
    }
  },

  setGameState: (state: GameState) => {
    set({ gameState: state });
  },
}));
