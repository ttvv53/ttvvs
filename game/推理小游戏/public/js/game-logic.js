class GameLogic {
    constructor(wsHandler, uiController) {
        this.ws = wsHandler;
        this.ui = uiController;
        this.config = null;
        
        this.state = {
            currentLevel: 0,
            cluesFound: [],
            puzzlesSolved: [],
            coopInteractions: [],
            achievements: [],
            startTime: null,
            endTime: null,
            cooperationScore: 100,
            reasoningScore: 0,
            isPlaying: false,
            partner: null,
            myRole: null,
            chatHistory: [],
            notebook: '',
            inventory: [],
            misledClues: []
        };
        
        this.timerInterval = null;
        this.remainingTime = 0;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.ws.on('room_created', (data) => this.handleRoomCreated(data));
        this.ws.on('room_joined', (data) => this.handleRoomJoined(data));
        this.ws.on('player_joined', (data) => this.handlePlayerJoined(data));
        this.ws.on('player_left', (data) => this.handlePlayerLeft(data));
        this.ws.on('player_ready_status', (data) => this.handlePlayerReady(data));
        this.ws.on('game_start', (data) => this.handleGameStart(data));
        this.ws.on('clue_found', (data) => this.handleClueFound(data));
        this.ws.on('puzzle_solved', (data) => this.handlePuzzleSolved(data));
        this.ws.on('coop_request', (data) => this.handleCoopRequest(data));
        this.ws.on('coop_accepted', (data) => this.handleCoopAccepted(data));
        this.ws.on('coop_completed', (data) => this.handleCoopCompleted(data));
        this.ws.on('chat_message', (data) => this.handleChatMessage(data));
        this.ws.on('achievement_unlocked', (data) => this.handleAchievementUnlocked(data));
        this.ws.on('score_updated', (data) => this.handleScoreUpdated(data));
        this.ws.on('level_changed', (data) => this.handleLevelChanged(data));
        this.ws.on('game_completed', (data) => this.handleGameCompleted(data));
        this.ws.on('dynamic_event', (data) => this.handleDynamicEvent(data));
        this.ws.on('connection_lost', () => this.handleConnectionLost());
    }
    
    async initialize() {
        this.config = await GameConfig.load();
        return this.config;
    }
    
    handleRoomCreated(data) {
        this.state.myRole = this.ws.playerRole;
        this.ui.showLobby(data.roomId, {
            id: this.ws.playerId,
            name: this.ws.playerName,
            role: this.state.myRole,
            isHost: true
        });
    }
    
    handleRoomJoined(data) {
        this.state.myRole = this.ws.playerRole;
        const myPlayer = data.players.find(p => p.id === this.ws.playerId);
        const otherPlayer = data.players.find(p => p.id !== this.ws.playerId);
        
        this.ui.showLobby(data.roomId, myPlayer);
        
        if (otherPlayer) {
            this.state.partner = otherPlayer;
            this.ui.updatePartner(otherPlayer);
        }
        
        if (data.gameState) {
            this.syncGameState(data.gameState);
        }
    }
    
    handlePlayerJoined(data) {
        this.state.partner = data.player;
        this.ui.updatePartner(data.player);
        this.ui.showNotification(`${data.player.name} 加入了房间`, 'info');
    }
    
    handlePlayerLeft(data) {
        this.state.partner = null;
        this.ui.removePartner();
        this.ui.showNotification(`${data.playerName} 离开了房间`, 'warning');
    }
    
    handlePlayerReady(data) {
        this.ui.updatePlayerReady(data.playerId, data.ready);
    }
    
    handleGameStart(data) {
        this.state.startTime = data.startTime;
        this.state.isPlaying = true;
        this.startLevel(0);
        this.ui.showGameScreen();
        this.ui.showNotification('游戏开始！', 'success');
    }
    
    startLevel(levelIndex) {
        this.state.currentLevel = levelIndex;
        const level = this.config.levels[levelIndex];
        
        if (!level) {
            this.endGame();
            return;
        }
        
        this.remainingTime = level.timeLimit;
        this.startTimer();
        
        this.ui.renderLevel(level, this.state);
        
        this.checkDynamicEvents('level_start');
    }
    
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.ui.updateTimer(this.remainingTime);
            
            if (this.remainingTime <= 120) {
                this.checkDynamicEvents('time_remaining_120');
            }
            
            if (this.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    timeUp() {
        clearInterval(this.timerInterval);
        this.ui.showNotification('时间到！', 'warning');
        this.endGame();
    }
    
    investigateObject(objectId) {
        const level = this.config.levels[this.state.currentLevel];
        const clue = level?.clues?.find(c => c.id === objectId);
        
        if (!clue) return;
        
        if (this.state.cluesFound.includes(clue.id)) {
            this.ui.showClueDetail(clue);
            return;
        }
        
        const canDiscover = clue.discoverable === 'both' || 
                           clue.discoverable === this.state.myRole;
        
        if (!canDiscover) {
            const otherRole = clue.discoverable === 'detective' ? '侦探' : '鉴定专家';
            this.ui.showNotification(`这个线索需要${otherRole}来发现`, 'info');
            return;
        }
        
        this.ws.findClue(clue.id);
    }
    
    handleClueFound(data) {
        if (this.state.cluesFound.includes(data.clueId)) return;
        
        this.state.cluesFound.push(data.clueId);
        
        const level = this.config.levels[this.state.currentLevel];
        const clue = level?.clues?.find(c => c.id === data.clueId);
        
        if (clue) {
            this.ui.addClueToList(clue, data.playerId === this.ws.playerId);
            this.ui.showNotification(`发现线索：${clue.name}`, 'success');
            
            if (this.state.cluesFound.length === 1) {
                this.unlockAchievement('first_clue');
            }
            
            if (clue.misleading) {
                this.state.misledClues.push(clue.id);
            }
            
            this.updateReasoningScore();
            this.checkPuzzleAvailability();
            this.checkDynamicEvents(`clue_found:${clue.id}`);
        }
    }
    
    checkPuzzleAvailability() {
        const level = this.config.levels[this.state.currentLevel];
        if (!level?.puzzles) return;
        
        level.puzzles.forEach(puzzle => {
            const hasAllClues = puzzle.requiredClues.every(
                clueId => this.state.cluesFound.includes(clueId)
            );
            
            if (hasAllClues && !this.state.puzzlesSolved.includes(puzzle.id)) {
                this.ui.showPuzzleAvailable(puzzle);
            }
        });
    }
    
    attemptPuzzle(puzzleId, solution) {
        const level = this.config.levels[this.state.currentLevel];
        const puzzle = level?.puzzles?.find(p => p.id === puzzleId);
        
        if (!puzzle) return;
        
        if (puzzle.type === 'collaborative' && !this.state.partner) {
            this.ui.showNotification('这个谜题需要双人协作', 'info');
            return;
        }
        
        if (solution.toLowerCase() === puzzle.solution.toLowerCase()) {
            this.ws.solvePuzzle(puzzleId, solution);
        } else {
            this.ui.showNotification('答案不正确，再想想...', 'warning');
        }
    }
    
    handlePuzzleSolved(data) {
        if (this.state.puzzlesSolved.includes(data.puzzleId)) return;
        
        this.state.puzzlesSolved.push(data.puzzleId);
        
        const level = this.config.levels[this.state.currentLevel];
        const puzzle = level?.puzzles?.find(p => p.id === data.puzzleId);
        
        if (puzzle) {
            this.ui.markPuzzleSolved(puzzle);
            this.ui.showNotification(`谜题解开：${puzzle.name}`, 'success');
            
            if (puzzle.rewardClue) {
                this.ws.findClue(puzzle.rewardClue);
            }
            
            this.updateReasoningScore();
        }
        
        this.checkLevelComplete();
    }
    
    requestCoopInteraction(interactionId) {
        const level = this.config.levels[this.state.currentLevel];
        const interaction = level?.coopInteractions?.find(i => i.id === interactionId);
        
        if (!interaction) return;
        
        this.ws.requestCoop(interactionId, interaction.name);
        this.ui.showNotification('已发送协作请求', 'info');
    }
    
    handleCoopRequest(data) {
        this.ui.showCoopRequest(data);
    }
    
    acceptCoopRequest(data) {
        this.ws.acceptCoop(data.interactionId, data.from);
    }
    
    handleCoopAccepted(data) {
        const level = this.config.levels[this.state.currentLevel];
        const interaction = level?.coopInteractions?.find(i => i.id === data.interactionId);
        
        if (interaction) {
            this.ws.completeCoop(data.interactionId, data.participants);
        }
    }
    
    handleCoopCompleted(data) {
        this.state.coopInteractions.push(data.interactionId);
        
        const level = this.config.levels[this.state.currentLevel];
        const interaction = level?.coopInteractions?.find(i => i.id === data.interactionId);
        
        if (interaction) {
            this.ui.showNotification(`协作完成：${interaction.name}`, 'success');
            this.state.cooperationScore = Math.min(100, this.state.cooperationScore + 5);
            this.ui.updateCooperationScore(this.state.cooperationScore);
            
            if (this.state.coopInteractions.length >= 10) {
                this.unlockAchievement('perfect_coop');
            }
        }
    }
    
    sendChatMessage(content) {
        if (content.trim()) {
            this.ws.sendChat(content.trim());
        }
    }
    
    handleChatMessage(data) {
        this.state.chatHistory.push(data);
        this.ui.addChatMessage(data);
        
        if (data.playerId !== this.ws.playerId) {
            this.ui.incrementChatBadge();
        }
    }
    
    unlockAchievement(achievementId) {
        if (this.state.achievements.includes(achievementId)) return;
        
        this.state.achievements.push(achievementId);
        this.ws.unlockAchievement(achievementId);
        
        const achievement = this.config.achievements?.find(a => a.id === achievementId);
        if (achievement) {
            this.ui.showAchievementPopup(achievement);
            this.ui.addAchievementToList(achievement);
        }
    }
    
    handleAchievementUnlocked(data) {
        if (data.playerId === this.ws.playerId) return;
        
        const achievement = this.config.achievements?.find(a => a.id === data.achievementId);
        if (achievement && !this.state.achievements.includes(data.achievementId)) {
            this.state.achievements.push(data.achievementId);
            this.ui.addAchievementToList(achievement);
        }
    }
    
    updateReasoningScore() {
        const totalClues = this.config.levels.reduce((sum, level) => 
            sum + (level.clues?.length || 0), 0);
        const totalPuzzles = this.config.levels.reduce((sum, level) => 
            sum + (level.puzzles?.length || 0), 0);
        
        const clueScore = (this.state.cluesFound.length / totalClues) * 70;
        const puzzleScore = (this.state.puzzlesSolved.length / totalPuzzles) * 30;
        
        this.state.reasoningScore = Math.round(clueScore + puzzleScore);
        this.ws.updateScore(this.state.cooperationScore, this.state.reasoningScore);
    }
    
    handleScoreUpdated(data) {
        this.state.cooperationScore = data.cooperationScore;
        this.state.reasoningScore = data.reasoningScore;
        this.ui.updateCooperationScore(data.cooperationScore);
    }
    
    checkLevelComplete() {
        const level = this.config.levels[this.state.currentLevel];
        if (!level) return;
        
        const allPuzzlesSolved = level.puzzles?.every(
            p => this.state.puzzlesSolved.includes(p.id)
        );
        
        if (allPuzzlesSolved) {
            setTimeout(() => {
                this.progressToNextLevel();
            }, 2000);
        }
    }
    
    progressToNextLevel() {
        const nextLevel = this.state.currentLevel + 1;
        
        if (nextLevel >= this.config.levels.length) {
            this.endGame();
        } else {
            this.ws.nextLevel(nextLevel);
        }
    }
    
    handleLevelChanged(data) {
        this.startLevel(data.levelIndex);
    }
    
    checkDynamicEvents(trigger) {
        const events = this.config.dynamicEvents || [];
        const matchingEvent = events.find(e => e.trigger === trigger);
        
        if (matchingEvent && !this.state.dynamicEvents.includes(matchingEvent.id)) {
            this.state.dynamicEvents.push(matchingEvent.id);
            this.ws.triggerEvent(matchingEvent.id, matchingEvent);
        }
    }
    
    handleDynamicEvent(data) {
        this.ui.showDynamicEvent(data.eventData);
    }
    
    endGame() {
        this.state.isPlaying = false;
        this.state.endTime = Date.now();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const ending = this.calculateEnding();
        this.ws.completeGame(ending);
    }
    
    calculateEnding() {
        const coopScore = this.state.cooperationScore;
        const reasonScore = this.state.reasoningScore;
        
        if (coopScore >= 90 && reasonScore >= 95) {
            return 'perfect';
        } else if (coopScore >= 70 && reasonScore >= 80) {
            return 'good';
        } else if (coopScore >= 50 && reasonScore >= 60) {
            return 'normal';
        } else {
            return 'bad';
        }
    }
    
    handleGameCompleted(data) {
        this.ui.showEndingScreen({
            ending: data.ending,
            scores: data.finalScores,
            duration: this.state.endTime - this.state.startTime,
            cluesFound: this.state.cluesFound,
            puzzlesSolved: this.state.puzzlesSolved,
            achievements: this.state.achievements,
            misledClues: this.state.misledClues
        });
    }
    
    handleConnectionLost() {
        this.ui.showNotification('连接已断开，请刷新页面重试', 'error');
    }
    
    syncGameState(gameState) {
        this.state.cluesFound = gameState.cluesFound || [];
        this.state.puzzlesSolved = gameState.puzzlesSolved || [];
        this.state.coopInteractions = gameState.coopInteractions || [];
        this.state.achievements = gameState.achievements || [];
        this.state.cooperationScore = gameState.cooperationScore || 100;
        this.state.chatHistory = gameState.chatHistory || [];
    }
    
    saveNotebook(content) {
        this.state.notebook = content;
        localStorage.setItem('game_notebook', content);
    }
    
    loadNotebook() {
        return localStorage.getItem('game_notebook') || '';
    }
    
    setReady() {
        this.ws.setReady();
    }
}

window.GameLogic = GameLogic;
