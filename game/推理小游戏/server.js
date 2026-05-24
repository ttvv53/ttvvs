const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3002;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/game-data', express.static(path.join(__dirname, 'game-data')));

const gameRooms = new Map();
const waitingPlayers = new Map();

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createRoom(playerId, playerName, role) {
    const roomId = generateRoomId();
    const room = {
        id: roomId,
        players: new Map(),
        gameState: {
            currentLevel: 0,
            cluesFound: [],
            puzzlesSolved: [],
            coopInteractions: [],
            achievements: [],
            chatHistory: [],
            startTime: null,
            cooperationScore: 100,
            reasoningScore: 0,
            dynamicEvents: []
        },
        createdAt: Date.now()
    };
    
    room.players.set(playerId, {
        id: playerId,
        name: playerName,
        role: role,
        ready: false,
        isHost: true
    });
    
    gameRooms.set(roomId, room);
    return room;
}

function joinRoom(roomId, playerId, playerName, role) {
    const room = gameRooms.get(roomId);
    if (!room) return null;
    
    if (room.players.size >= 2) return null;
    
    const existingRoles = Array.from(room.players.values()).map(p => p.role);
    if (existingRoles.includes(role)) return null;
    
    room.players.set(playerId, {
        id: playerId,
        name: playerName,
        role: role,
        ready: false,
        isHost: false
    });
    
    return room;
}

function broadcastToRoom(roomId, message, excludePlayerId = null) {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    room.players.forEach((player, playerId) => {
        if (playerId !== excludePlayerId && player.ws && player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}

function updatePlayerSocket(roomId, playerId, ws) {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    const player = room.players.get(playerId);
    if (player) {
        player.ws = ws;
    }
}

wss.on('connection', (ws) => {
    let currentPlayer = null;
    let currentRoom = null;
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'create_room':
                    const newRoom = createRoom(message.playerId, message.playerName, message.role);
                    currentPlayer = { id: message.playerId, name: message.playerName, role: message.role };
                    currentRoom = newRoom.id;
                    updatePlayerSocket(newRoom.id, message.playerId, ws);
                    
                    ws.send(JSON.stringify({
                        type: 'room_created',
                        roomId: newRoom.id,
                        player: newRoom.players.get(message.playerId),
                        gameState: newRoom.gameState
                    }));
                    break;
                    
                case 'join_room':
                    const room = joinRoom(message.roomId, message.playerId, message.playerName, message.role);
                    if (room) {
                        currentPlayer = { id: message.playerId, name: message.playerName, role: message.role };
                        currentRoom = room.id;
                        updatePlayerSocket(room.id, message.playerId, ws);
                        
                        ws.send(JSON.stringify({
                            type: 'room_joined',
                            roomId: room.id,
                            players: Array.from(room.players.values()).map(p => ({ ...p, ws: undefined })),
                            gameState: room.gameState
                        }));
                        
                        broadcastToRoom(room.id, {
                            type: 'player_joined',
                            player: { ...room.players.get(message.playerId), ws: undefined }
                        }, message.playerId);
                    } else {
                        ws.send(JSON.stringify({
                            type: 'join_failed',
                            reason: '房间不存在、已满或角色已被选择'
                        }));
                    }
                    break;
                    
                case 'find_clue':
                    const clueRoom = gameRooms.get(message.roomId);
                    if (clueRoom) {
                        if (!clueRoom.gameState.cluesFound.includes(message.clueId)) {
                            clueRoom.gameState.cluesFound.push(message.clueId);
                            
                            broadcastToRoom(message.roomId, {
                                type: 'clue_found',
                                clueId: message.clueId,
                                playerId: message.playerId,
                                timestamp: Date.now()
                            });
                        }
                    }
                    break;
                    
                case 'solve_puzzle':
                    const puzzleRoom = gameRooms.get(message.roomId);
                    if (puzzleRoom) {
                        if (!puzzleRoom.gameState.puzzlesSolved.includes(message.puzzleId)) {
                            puzzleRoom.gameState.puzzlesSolved.push(message.puzzleId);
                            
                            broadcastToRoom(message.roomId, {
                                type: 'puzzle_solved',
                                puzzleId: message.puzzleId,
                                solution: message.solution,
                                playerId: message.playerId,
                                timestamp: Date.now()
                            });
                        }
                    }
                    break;
                    
                case 'coop_interaction':
                    const coopRoom = gameRooms.get(message.roomId);
                    if (coopRoom) {
                        coopRoom.gameState.coopInteractions.push({
                            interactionId: message.interactionId,
                            players: message.participants,
                            timestamp: Date.now()
                        });
                        
                        coopRoom.gameState.cooperationScore = Math.min(100, coopRoom.gameState.cooperationScore + 5);
                        
                        broadcastToRoom(message.roomId, {
                            type: 'coop_completed',
                            interactionId: message.interactionId,
                            participants: message.participants,
                            timestamp: Date.now()
                        });
                    }
                    break;
                    
                case 'chat':
                    const chatRoom = gameRooms.get(message.roomId);
                    if (chatRoom) {
                        const chatMessage = {
                            playerId: message.playerId,
                            playerName: message.playerName,
                            content: message.content,
                            timestamp: Date.now()
                        };
                        chatRoom.gameState.chatHistory.push(chatMessage);
                        
                        broadcastToRoom(message.roomId, {
                            type: 'chat_message',
                            ...chatMessage
                        });
                    }
                    break;
                    
                case 'request_coop':
                    broadcastToRoom(message.roomId, {
                        type: 'coop_request',
                        from: message.playerId,
                        fromName: message.playerName,
                        interactionId: message.interactionId,
                        interactionName: message.interactionName
                    }, message.playerId);
                    break;
                    
                case 'accept_coop':
                    broadcastToRoom(message.roomId, {
                        type: 'coop_accepted',
                        interactionId: message.interactionId,
                        participants: [message.fromPlayer, message.playerId]
                    });
                    break;
                    
                case 'player_ready':
                    const readyRoom = gameRooms.get(message.roomId);
                    if (readyRoom) {
                        const player = readyRoom.players.get(message.playerId);
                        if (player) {
                            player.ready = true;
                            
                            broadcastToRoom(message.roomId, {
                                type: 'player_ready_status',
                                playerId: message.playerId,
                                ready: true
                            });
                            
                            const allReady = Array.from(readyRoom.players.values()).every(p => p.ready);
                            if (allReady && readyRoom.players.size === 2) {
                                readyRoom.gameState.startTime = Date.now();
                                broadcastToRoom(message.roomId, {
                                    type: 'game_start',
                                    startTime: readyRoom.gameState.startTime
                                });
                            }
                        }
                    }
                    break;
                    
                case 'trigger_event':
                    broadcastToRoom(message.roomId, {
                        type: 'dynamic_event',
                        eventId: message.eventId,
                        eventData: message.eventData
                    });
                    break;
                    
                case 'achievement_unlock':
                    const achieveRoom = gameRooms.get(message.roomId);
                    if (achieveRoom) {
                        if (!achieveRoom.gameState.achievements.includes(message.achievementId)) {
                            achieveRoom.gameState.achievements.push(message.achievementId);
                            
                            broadcastToRoom(message.roomId, {
                                type: 'achievement_unlocked',
                                achievementId: message.achievementId,
                                playerId: message.playerId
                            });
                        }
                    }
                    break;
                    
                case 'update_score':
                    const scoreRoom = gameRooms.get(message.roomId);
                    if (scoreRoom) {
                        if (message.cooperationScore !== undefined) {
                            scoreRoom.gameState.cooperationScore = message.cooperationScore;
                        }
                        if (message.reasoningScore !== undefined) {
                            scoreRoom.gameState.reasoningScore = message.reasoningScore;
                        }
                        
                        broadcastToRoom(message.roomId, {
                            type: 'score_updated',
                            cooperationScore: scoreRoom.gameState.cooperationScore,
                            reasoningScore: scoreRoom.gameState.reasoningScore
                        });
                    }
                    break;
                    
                case 'next_level':
                    const levelRoom = gameRooms.get(message.roomId);
                    if (levelRoom) {
                        levelRoom.gameState.currentLevel = message.levelIndex;
                        
                        broadcastToRoom(message.roomId, {
                            type: 'level_changed',
                            levelIndex: message.levelIndex
                        });
                    }
                    break;
                    
                case 'game_complete':
                    const completeRoom = gameRooms.get(message.roomId);
                    if (completeRoom) {
                        broadcastToRoom(message.roomId, {
                            type: 'game_completed',
                            ending: message.ending,
                            finalScores: {
                                cooperation: completeRoom.gameState.cooperationScore,
                                reasoning: completeRoom.gameState.reasoningScore,
                                cluesFound: completeRoom.gameState.cluesFound.length,
                                achievements: completeRoom.gameState.achievements
                            }
                        });
                    }
                    break;
                    
                case 'get_room_info':
                    const infoRoom = gameRooms.get(message.roomId);
                    if (infoRoom) {
                        ws.send(JSON.stringify({
                            type: 'room_info',
                            roomId: infoRoom.id,
                            players: Array.from(infoRoom.players.values()).map(p => ({ ...p, ws: undefined })),
                            gameState: infoRoom.gameState
                        }));
                    }
                    break;
            }
        } catch (error) {
            console.error('消息处理错误:', error);
        }
    });
    
    ws.on('close', () => {
        if (currentRoom && currentPlayer) {
            const room = gameRooms.get(currentRoom);
            if (room) {
                room.players.delete(currentPlayer.id);
                
                broadcastToRoom(currentRoom, {
                    type: 'player_left',
                    playerId: currentPlayer.id,
                    playerName: currentPlayer.name
                });
                
                if (room.players.size === 0) {
                    gameRooms.delete(currentRoom);
                }
            }
        }
    });
});

app.get('/api/rooms', (req, res) => {
    const rooms = Array.from(gameRooms.values())
        .filter(room => room.players.size < 2)
        .map(room => ({
            id: room.id,
            playerCount: room.players.size,
            roles: Array.from(room.players.values()).map(p => p.role)
        }));
    res.json(rooms);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔍 博物馆午夜谜案 - 双人联机推理游戏                     ║
║                                                           ║
║   服务器已启动！                                          ║
║   本地访问: http://localhost:${PORT}                        ║
║                                                           ║
║   游戏说明:                                               ║
║   1. 一位玩家创建房间                                     ║
║   2. 另一位玩家输入房间号加入                             ║
║   3. 选择不同角色开始游戏                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
