class WebSocketHandler {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.roomId = null;
        this.playerId = null;
        this.playerName = null;
        this.playerRole = null;
        this.eventHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    
    connect(serverUrl) {
        return new Promise((resolve, reject) => {
            try {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const host = serverUrl || `${protocol}//${window.location.host}`;
                
                this.ws = new WebSocket(host);
                
                this.ws.onopen = () => {
                    this.connected = true;
                    this.reconnectAttempts = 0;
                    console.log('WebSocket 连接成功');
                    resolve();
                };
                
                this.ws.onclose = () => {
                    this.connected = false;
                    console.log('WebSocket 连接关闭');
                    this.handleDisconnect();
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket 错误:', error);
                    reject(error);
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };
            } catch (error) {
                reject(error);
            }
        });
    }
    
    handleDisconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect().catch(console.error);
            }, 2000 * this.reconnectAttempts);
        } else {
            this.emit('connection_lost', {});
        }
    }
    
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            console.log('收到消息:', message.type, message);
            this.emit(message.type, message);
        } catch (error) {
            console.error('解析消息失败:', error);
        }
    }
    
    send(type, data = {}) {
        if (!this.connected || !this.ws) {
            console.error('WebSocket 未连接');
            return false;
        }
        
        const message = {
            type,
            playerId: this.playerId,
            playerName: this.playerName,
            roomId: this.roomId,
            ...data
        };
        
        try {
            this.ws.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('发送消息失败:', error);
            return false;
        }
    }
    
    createRoom(playerName, role) {
        this.playerId = this.generateId();
        this.playerName = playerName;
        this.playerRole = role;
        
        return new Promise((resolve, reject) => {
            const handler = (data) => {
                this.off('room_created', handler);
                this.off('create_failed', errorHandler);
                
                if (data.type === 'room_created') {
                    this.roomId = data.roomId;
                    resolve(data);
                }
            };
            
            const errorHandler = (data) => {
                this.off('room_created', handler);
                this.off('create_failed', errorHandler);
                reject(new Error(data.reason || '创建房间失败'));
            };
            
            this.on('room_created', handler);
            this.on('create_failed', errorHandler);
            
            this.send('create_room', { playerName, role });
        });
    }
    
    joinRoom(roomId, playerName, role) {
        this.playerId = this.generateId();
        this.playerName = playerName;
        this.playerRole = role;
        
        return new Promise((resolve, reject) => {
            const handler = (data) => {
                this.off('room_joined', handler);
                this.off('join_failed', errorHandler);
                
                if (data.type === 'room_joined') {
                    this.roomId = roomId;
                    resolve(data);
                }
            };
            
            const errorHandler = (data) => {
                this.off('room_joined', handler);
                this.off('join_failed', errorHandler);
                reject(new Error(data.reason || '加入房间失败'));
            };
            
            this.on('room_joined', handler);
            this.on('join_failed', errorHandler);
            
            this.send('join_room', { roomId, playerName, role });
        });
    }
    
    findClue(clueId) {
        this.send('find_clue', { clueId });
    }
    
    solvePuzzle(puzzleId, solution) {
        this.send('solve_puzzle', { puzzleId, solution });
    }
    
    requestCoop(interactionId, interactionName) {
        this.send('request_coop', { interactionId, interactionName });
    }
    
    acceptCoop(interactionId, fromPlayer) {
        this.send('accept_coop', { interactionId, fromPlayer });
    }
    
    completeCoop(interactionId, participants) {
        this.send('coop_interaction', { interactionId, participants });
    }
    
    sendChat(content) {
        this.send('chat', { content });
    }
    
    setReady() {
        this.send('player_ready');
    }
    
    unlockAchievement(achievementId) {
        this.send('achievement_unlock', { achievementId });
    }
    
    updateScore(cooperationScore, reasoningScore) {
        this.send('update_score', { cooperationScore, reasoningScore });
    }
    
    nextLevel(levelIndex) {
        this.send('next_level', { levelIndex });
    }
    
    completeGame(ending) {
        this.send('game_complete', { ending });
    }
    
    triggerEvent(eventId, eventData) {
        this.send('trigger_event', { eventId, eventData });
    }
    
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
    }
    
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).delete(handler);
        }
    }
    
    emit(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`事件处理器错误 [${event}]:`, error);
                }
            });
        }
    }
    
    generateId() {
        return 'player_' + Math.random().toString(36).substring(2, 10);
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.connected = false;
        }
    }
}

window.WebSocketHandler = WebSocketHandler;
