import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;

app.use(cors());

if (isProduction) {
  app.use(express.static(path.join(__dirname, '../dist')));
}

interface Room {
  id: string;
  players: { id: string; role: 'A' | 'B' }[];
  gameState: GameState;
}

interface GameState {
  players: {
    role: 'A' | 'B';
    name: string;
    currentScene: string;
    collectedClues: string[];
    solvedPuzzles: string[];
  }[];
  allCollectedClues: string[];
  chatHistory: ChatMessage[];
  puzzles: { id: string; solved: boolean }[];
  gameStarted: boolean;
  gameEnded: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'A' | 'B';
  content: string;
  timestamp: number;
  type: 'text' | 'clue_share' | 'system';
  sharedClue?: string;
}

const rooms: Map<string, Room> = new Map();

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createInitialGameState(): GameState {
  return {
    players: [],
    allCollectedClues: [],
    chatHistory: [],
    puzzles: [
      { id: 'puzzle1', solved: false },
      { id: 'puzzle2', solved: false },
      { id: 'puzzle3', solved: false },
      { id: 'puzzle4', solved: false },
    ],
    gameStarted: false,
    gameEnded: false,
  };
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: isProduction ? '*' : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  socket.on('create_room', (callback) => {
    const roomId = generateRoomId();
    const room: Room = {
      id: roomId,
      players: [{ id: socket.id, role: 'A' }],
      gameState: createInitialGameState(),
    };
    room.gameState.players.push({
      role: 'A',
      name: '林晓月',
      currentScene: 'study',
      collectedClues: [],
      solvedPuzzles: [],
    });
    rooms.set(roomId, room);
    socket.join(roomId);
    callback({ roomId, role: 'A' });
  });

  socket.on('join_room', (roomId: string, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      callback({ error: '房间不存在' });
      return;
    }
    if (room.players.length >= 2) {
      callback({ error: '房间已满' });
      return;
    }

    room.players.push({ id: socket.id, role: 'B' });
    room.gameState.players.push({
      role: 'B',
      name: '周明轩',
      currentScene: 'study',
      collectedClues: [],
      solvedPuzzles: [],
    });
    socket.join(roomId);
    callback({ roomId, role: 'B' });
    
    room.gameState.gameStarted = true;
    io.to(roomId).emit('game_start', room.gameState);
  });

  socket.on('get_game_state', (roomId: string, callback) => {
    const room = rooms.get(roomId);
    if (room) {
      callback(room.gameState);
    } else {
      callback(null);
    }
  });

  socket.on('move_to_scene', (data: { roomId: string; sceneId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const playerState = room.gameState.players.find(p => p.role === player.role);
    if (playerState) {
      playerState.currentScene = data.sceneId;
      io.to(data.roomId).emit('player_moved', {
        role: player.role,
        sceneId: data.sceneId,
      });
    }
  });

  socket.on('collect_clue', (data: { roomId: string; clueId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const playerState = room.gameState.players.find(p => p.role === player.role);
    if (playerState && !playerState.collectedClues.includes(data.clueId)) {
      playerState.collectedClues.push(data.clueId);
      if (!room.gameState.allCollectedClues.includes(data.clueId)) {
        room.gameState.allCollectedClues.push(data.clueId);
      }
      io.to(data.roomId).emit('clue_collected', {
        role: player.role,
        clueId: data.clueId,
        gameState: room.gameState,
      });
    }
  });

  socket.on('send_message', (data: { roomId: string; content: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: player.role,
      content: data.content,
      timestamp: Date.now(),
      type: 'text',
    };
    room.gameState.chatHistory.push(message);
    io.to(data.roomId).emit('new_message', message);
  });

  socket.on('share_clue', (data: { roomId: string; clueId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: player.role,
      content: `分享了线索: ${data.clueId}`,
      timestamp: Date.now(),
      type: 'clue_share',
      sharedClue: data.clueId,
    };
    room.gameState.chatHistory.push(message);
    io.to(data.roomId).emit('new_message', message);
  });

  socket.on('solve_puzzle', (data: { roomId: string; puzzleId: string; answer: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const puzzle = room.gameState.puzzles.find(p => p.id === data.puzzleId);
    if (puzzle && !puzzle.solved) {
      puzzle.solved = true;
      const playerState = room.gameState.players.find(p => p.role === player.role);
      if (playerState) {
        playerState.solvedPuzzles.push(data.puzzleId);
      }
      io.to(data.roomId).emit('puzzle_solved', {
        puzzleId: data.puzzleId,
        gameState: room.gameState,
      });
    }
  });

  socket.on('submit_final_answer', (data: { roomId: string; answer: Record<string, string> }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;

    const correctAnswer = {
      murderer: '陈志明',
      motive: '遗产争夺',
      method: '下毒谋杀',
    };

    const isCorrect = 
      data.answer.murderer === correctAnswer.murderer &&
      data.answer.motive === correctAnswer.motive &&
      data.answer.method === correctAnswer.method;

    if (isCorrect) {
      room.gameState.gameEnded = true;
      io.to(data.roomId).emit('game_victory', { answer: data.answer });
    } else {
      socket.emit('answer_incorrect', { message: '答案不正确，请继续调查' });
    }
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('player_left', { playerId: socket.id });
        if (room.players.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

if (isProduction) {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`环境: ${isProduction ? '生产' : '开发'}`);
});
