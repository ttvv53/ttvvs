class UIController {
    constructor() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            menu: document.getElementById('menu-screen'),
            roleSelect: document.getElementById('role-select-screen'),
            lobby: document.getElementById('lobby-screen'),
            game: document.getElementById('game-screen'),
            ending: document.getElementById('ending-screen')
        };
        
        this.elements = {};
        this.chatBadgeCount = 0;
        this.selectedRole = null;
        this.currentCoopRequest = null;
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements() {
        this.elements = {
            btnCreate: document.getElementById('btn-create'),
            btnJoin: document.getElementById('btn-join'),
            btnHowToPlay: document.getElementById('btn-how-to-play'),
            joinModal: document.getElementById('join-modal'),
            roomCodeInput: document.getElementById('room-code'),
            btnJoinConfirm: document.getElementById('btn-join-confirm'),
            btnJoinCancel: document.getElementById('btn-join-cancel'),
            roleCards: document.querySelectorAll('.role-card'),
            btnRoleSelect: document.querySelectorAll('.btn-role-select'),
            playerNameInput: document.getElementById('player-name'),
            displayRoomCode: document.getElementById('display-room-code'),
            btnCopyCode: document.getElementById('btn-copy-code'),
            playersContainer: document.getElementById('players-container'),
            btnReady: document.getElementById('btn-ready'),
            btnLeaveLobby: document.getElementById('btn-leave-lobby'),
            currentLevelName: document.getElementById('current-level-name'),
            gameTimer: document.getElementById('game-timer'),
            coopScoreBar: document.getElementById('coop-score-bar'),
            coopScoreValue: document.getElementById('coop-score-value'),
            sceneDesc: document.getElementById('scene-desc'),
            sceneBg: document.getElementById('scene-bg'),
            interactiveObjects: document.getElementById('interactive-objects'),
            cluesList: document.getElementById('clues-list'),
            puzzlesList: document.getElementById('puzzles-list'),
            achievementsList: document.getElementById('achievements-list'),
            partnerAvatar: document.getElementById('partner-avatar'),
            partnerName: document.getElementById('partner-name'),
            partnerRole: document.getElementById('partner-role'),
            btnInventory: document.getElementById('btn-inventory'),
            btnCoop: document.getElementById('btn-coop'),
            btnNotebook: document.getElementById('btn-notebook'),
            btnToggleChat: document.getElementById('btn-toggle-chat'),
            chatBadge: document.getElementById('chat-badge'),
            chatPanel: document.getElementById('chat-panel'),
            chatMessages: document.getElementById('chat-messages'),
            chatInput: document.getElementById('chat-input'),
            btnSendChat: document.getElementById('btn-send-chat'),
            btnCloseChat: document.getElementById('btn-close-chat'),
            clueDetailModal: document.getElementById('clue-detail-modal'),
            puzzleModal: document.getElementById('puzzle-modal'),
            coopPanel: document.getElementById('coop-panel'),
            coopRequestModal: document.getElementById('coop-request-modal'),
            inventoryModal: document.getElementById('inventory-modal'),
            notebookModal: document.getElementById('notebook-modal'),
            eventModal: document.getElementById('event-modal'),
            achievementPopup: document.getElementById('achievement-popup'),
            howToPlayModal: document.getElementById('how-to-play-modal'),
            notificationContainer: document.getElementById('notification-container')
        };
    }
    
    bindEvents() {
        this.elements.btnCreate?.addEventListener('click', () => {
            this.showScreen('roleSelect');
            this.isCreatingRoom = true;
        });
        
        this.elements.btnJoin?.addEventListener('click', () => {
            this.elements.joinModal?.classList.remove('hidden');
        });
        
        this.elements.btnJoinCancel?.addEventListener('click', () => {
            this.elements.joinModal?.classList.add('hidden');
        });
        
        this.elements.btnHowToPlay?.addEventListener('click', () => {
            this.elements.howToPlayModal?.classList.remove('hidden');
        });
        
        document.getElementById('btn-close-help')?.addEventListener('click', () => {
            this.elements.howToPlayModal?.classList.add('hidden');
        });
        
        this.elements.roleCards.forEach(card => {
            card.addEventListener('click', () => {
                this.elements.roleCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedRole = card.dataset.role;
            });
        });
        
        this.elements.btnRoleSelect.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const role = btn.dataset.role;
                this.selectRole(role);
            });
        });
        
        this.elements.btnCopyCode?.addEventListener('click', () => {
            const code = this.elements.displayRoomCode?.textContent;
            navigator.clipboard.writeText(code).then(() => {
                this.showNotification('房间代码已复制', 'success');
            });
        });
        
        this.elements.btnReady?.addEventListener('click', () => {
            if (this.onReady) this.onReady();
        });
        
        this.elements.btnLeaveLobby?.addEventListener('click', () => {
            if (this.onLeaveLobby) this.onLeaveLobby();
        });
        
        this.elements.btnToggleChat?.addEventListener('click', () => {
            this.elements.chatPanel?.classList.toggle('hidden');
            this.resetChatBadge();
        });
        
        this.elements.btnCloseChat?.addEventListener('click', () => {
            this.elements.chatPanel?.classList.add('hidden');
        });
        
        this.elements.btnSendChat?.addEventListener('click', () => {
            const content = this.elements.chatInput?.value;
            if (content && this.onSendChat) {
                this.onSendChat(content);
                this.elements.chatInput.value = '';
            }
        });
        
        this.elements.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.btnSendChat?.click();
            }
        });
        
        this.elements.btnInventory?.addEventListener('click', () => {
            this.elements.inventoryModal?.classList.remove('hidden');
        });
        
        document.getElementById('btn-close-inventory')?.addEventListener('click', () => {
            this.elements.inventoryModal?.classList.add('hidden');
        });
        
        this.elements.btnNotebook?.addEventListener('click', () => {
            this.elements.notebookModal?.classList.remove('hidden');
        });
        
        document.getElementById('btn-close-notebook')?.addEventListener('click', () => {
            this.elements.notebookModal?.classList.add('hidden');
        });
        
        document.getElementById('btn-save-note')?.addEventListener('click', () => {
            const content = document.getElementById('notebook-text')?.value;
            if (this.onSaveNotebook) this.onSaveNotebook(content);
            this.showNotification('笔记已保存', 'success');
        });
        
        this.elements.btnCoop?.addEventListener('click', () => {
            if (this.onShowCoop) this.onShowCoop();
        });
        
        document.getElementById('btn-close-coop-panel')?.addEventListener('click', () => {
            this.elements.coopPanel?.classList.add('hidden');
        });
        
        document.getElementById('btn-close-clue')?.addEventListener('click', () => {
            this.elements.clueDetailModal?.classList.add('hidden');
        });
        
        document.getElementById('btn-close-puzzle')?.addEventListener('click', () => {
            this.elements.puzzleModal?.classList.add('hidden');
        });
        
        document.getElementById('btn-accept-coop')?.addEventListener('click', () => {
            if (this.currentCoopRequest && this.onAcceptCoop) {
                this.onAcceptCoop(this.currentCoopRequest);
                this.elements.coopRequestModal?.classList.add('hidden');
            }
        });
        
        document.getElementById('btn-decline-coop')?.addEventListener('click', () => {
            this.elements.coopRequestModal?.classList.add('hidden');
            this.currentCoopRequest = null;
        });
        
        document.getElementById('btn-play-again')?.addEventListener('click', () => {
            location.reload();
        });
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen?.classList.remove('active');
        });
        this.screens[screenName]?.classList.add('active');
    }
    
    selectRole(role) {
        this.selectedRole = role;
        const playerName = this.elements.playerNameInput?.value || '玩家';
        
        if (this.onSelectRole) {
            this.onSelectRole(role, playerName);
        }
    }
    
    showLobby(roomId, player) {
        this.showScreen('lobby');
        
        if (this.elements.displayRoomCode) {
            this.elements.displayRoomCode.textContent = roomId;
        }
        
        this.updatePlayersList([player]);
        
        const waitingAnim = document.querySelector('.waiting-animation');
        if (waitingAnim) {
            waitingAnim.style.display = player.isHost ? 'block' : 'none';
        }
    }
    
    updatePlayersList(players) {
        if (!this.elements.playersContainer) return;
        
        const slots = [];
        for (let i = 0; i < 2; i++) {
            const player = players[i];
            if (player) {
                const role = GameConfig.getRole(player.role);
                slots.push(`
                    <div class="player-slot filled">
                        <div class="slot-icon">${role?.avatar || '👤'}</div>
                        <p class="player-name">${player.name}</p>
                        <p class="player-role">${role?.name || player.role}</p>
                        <p class="player-status ${player.ready ? 'ready' : ''}">${player.ready ? '已准备' : '等待中'}</p>
                    </div>
                `);
            } else {
                slots.push(`
                    <div class="player-slot empty">
                        <div class="slot-icon">?</div>
                        <p>等待玩家加入...</p>
                    </div>
                `);
            }
        }
        
        this.elements.playersContainer.innerHTML = slots.join('');
    }
    
    updatePartner(player) {
        const role = GameConfig.getRole(player.role);
        
        if (this.elements.partnerAvatar) {
            this.elements.partnerAvatar.textContent = role?.avatar || '👤';
        }
        if (this.elements.partnerName) {
            this.elements.partnerName.textContent = player.name;
        }
        if (this.elements.partnerRole) {
            this.elements.partnerRole.textContent = role?.name || player.role;
        }
        
        const waitingAnim = document.querySelector('.waiting-animation');
        if (waitingAnim) {
            waitingAnim.style.display = 'none';
        }
        
        if (this.elements.btnReady) {
            this.elements.btnReady.disabled = false;
            this.elements.btnReady.textContent = '准备开始';
        }
        
        const players = [{ id: window.game?.ws?.playerId, name: window.game?.ws?.playerName, role: window.game?.state?.myRole }, player];
        this.updatePlayersList(players);
    }
    
    removePartner() {
        if (this.elements.partnerAvatar) this.elements.partnerAvatar.textContent = '👤';
        if (this.elements.partnerName) this.elements.partnerName.textContent = '等待中...';
        if (this.elements.partnerRole) this.elements.partnerRole.textContent = '';
        
        if (this.elements.btnReady) {
            this.elements.btnReady.disabled = true;
            this.elements.btnReady.textContent = '等待另一位玩家...';
        }
    }
    
    updatePlayerReady(playerId, ready) {
        const statusEl = document.querySelector(`.player-slot[data-player="${playerId}"] .player-status`);
        if (statusEl) {
            statusEl.textContent = ready ? '已准备' : '等待中';
            statusEl.classList.toggle('ready', ready);
        }
    }
    
    showGameScreen() {
        this.showScreen('game');
    }
    
    renderLevel(level, state) {
        if (this.elements.currentLevelName) {
            this.elements.currentLevelName.textContent = level.name;
        }
        
        if (this.elements.sceneDesc) {
            this.elements.sceneDesc.textContent = level.description;
        }
        
        this.renderScene(level);
        this.renderCluesList(state.cluesFound, level);
        this.renderPuzzlesList(level.puzzles || [], state.puzzlesSolved);
    }
    
    renderScene(level) {
        const backgrounds = {
            exhibition_hall: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            monitoring_room: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d2d2d 100%)',
            director_office: 'linear-gradient(135deg, #2c1810 0%, #3d2314 50%, #4a2c1a 100%)'
        };
        
        if (this.elements.sceneBg) {
            this.elements.sceneBg.style.background = backgrounds[level.id] || backgrounds.exhibition_hall;
        }
        
        this.renderInteractiveObjects(level);
    }
    
    renderInteractiveObjects(level) {
        if (!this.elements.interactiveObjects) return;
        
        const positions = [
            { x: 15, y: 20 }, { x: 35, y: 35 }, { x: 55, y: 25 },
            { x: 75, y: 40 }, { x: 25, y: 55 }, { x: 65, y: 60 },
            { x: 45, y: 70 }, { x: 85, y: 25 }
        ];
        
        const objects = level.clues?.map((clue, index) => {
            const pos = positions[index % positions.length];
            const icon = GameConfig.getClueIcon(clue.type);
            const discovered = this.state?.cluesFound?.includes(clue.id);
            
            return `
                <div class="interactive-object ${discovered ? 'discovered' : ''}" 
                     data-clue-id="${clue.id}"
                     style="left: ${pos.x}%; top: ${pos.y}%;">
                    <div class="object-glow"></div>
                    <span class="object-icon">${icon}</span>
                </div>
            `;
        }).join('') || '';
        
        this.elements.interactiveObjects.innerHTML = objects;
        
        this.elements.interactiveObjects.querySelectorAll('.interactive-object').forEach(obj => {
            obj.addEventListener('click', () => {
                const clueId = obj.dataset.clueId;
                if (this.onInvestigate) this.onInvestigate(clueId);
            });
        });
    }
    
    renderCluesList(foundClueIds, level) {
        if (!this.elements.cluesList) return;
        
        if (!foundClueIds || foundClueIds.length === 0) {
            this.elements.cluesList.innerHTML = '<p class="empty-hint">尚未发现任何线索</p>';
            return;
        }
        
        const clues = foundClueIds.map(id => level.clues?.find(c => c.id === id)).filter(Boolean);
        
        this.elements.cluesList.innerHTML = clues.map(clue => `
            <div class="clue-item" data-clue-id="${clue.id}">
                <span class="clue-item-icon">${GameConfig.getClueIcon(clue.type)}</span>
                <span class="clue-item-name">${clue.name}</span>
            </div>
        `).join('');
        
        this.elements.cluesList.querySelectorAll('.clue-item').forEach(item => {
            item.addEventListener('click', () => {
                const clueId = item.dataset.clueId;
                const clue = level.clues?.find(c => c.id === clueId);
                if (clue) this.showClueDetail(clue);
            });
        });
    }
    
    renderPuzzlesList(puzzles, solvedIds) {
        if (!this.elements.puzzlesList) return;
        
        if (!puzzles || puzzles.length === 0) {
            this.elements.puzzlesList.innerHTML = '<p class="empty-hint">暂无谜题</p>';
            return;
        }
        
        this.elements.puzzlesList.innerHTML = puzzles.map(puzzle => {
            const solved = solvedIds?.includes(puzzle.id);
            return `
                <div class="puzzle-item ${solved ? 'solved' : ''}" data-puzzle-id="${puzzle.id}">
                    <p class="puzzle-item-name">${puzzle.name}</p>
                    <p class="puzzle-item-status">${solved ? '已解开' : '未解开'}</p>
                </div>
            `;
        }).join('');
    }
    
    addClueToList(clue, isMine) {
        const clueItem = document.createElement('div');
        clueItem.className = `clue-item ${isMine ? 'new' : ''}`;
        clueItem.dataset.clueId = clue.id;
        clueItem.innerHTML = `
            <span class="clue-item-icon">${GameConfig.getClueIcon(clue.type)}</span>
            <span class="clue-item-name">${clue.name}</span>
        `;
        
        clueItem.addEventListener('click', () => {
            const level = GameConfig.getLevel(window.game?.state?.currentLevel);
            const fullClue = level?.clues?.find(c => c.id === clue.id);
            if (fullClue) this.showClueDetail(fullClue);
        });
        
        if (this.elements.cluesList) {
            const emptyHint = this.elements.cluesList.querySelector('.empty-hint');
            if (emptyHint) emptyHint.remove();
            this.elements.cluesList.appendChild(clueItem);
        }
        
        const obj = this.elements.interactiveObjects?.querySelector(`[data-clue-id="${clue.id}"]`);
        if (obj) obj.classList.add('discovered');
    }
    
    showClueDetail(clue) {
        const modal = this.elements.clueDetailModal;
        if (!modal) return;
        
        document.getElementById('clue-icon').textContent = GameConfig.getClueIcon(clue.type);
        document.getElementById('clue-title').textContent = clue.name;
        document.getElementById('clue-description').textContent = clue.description;
        document.getElementById('clue-location').textContent = clue.location;
        document.getElementById('clue-discoverer').textContent = 
            clue.discoverable === 'both' ? '双方均可' : 
            (clue.discoverable === 'detective' ? '侦探' : '鉴定专家');
        
        const relatedSection = document.getElementById('clue-related');
        if (clue.relatedClues && clue.relatedClues.length > 0) {
            relatedSection?.classList.remove('hidden');
            document.getElementById('related-clues-list').innerHTML = 
                clue.relatedClues.map(id => `<span class="related-clue">${id}</span>`).join(', ');
        } else {
            relatedSection?.classList.add('hidden');
        }
        
        modal.classList.remove('hidden');
    }
    
    showPuzzleAvailable(puzzle) {
        this.showNotification(`新谜题可用：${puzzle.name}`, 'info');
    }
    
    markPuzzleSolved(puzzle) {
        const item = this.elements.puzzlesList?.querySelector(`[data-puzzle-id="${puzzle.id}"]`);
        if (item) {
            item.classList.add('solved');
            item.querySelector('.puzzle-item-status').textContent = '已解开';
        }
    }
    
    showCoopRequest(data) {
        this.currentCoopRequest = data;
        document.getElementById('coop-request-text').textContent = 
            `${data.fromName} 请求协助完成：${data.interactionName}`;
        this.elements.coopRequestModal?.classList.remove('hidden');
    }
    
    showCoopOptions(interactions) {
        if (!this.elements.coopPanel) return;
        
        const options = document.getElementById('coop-options');
        if (options) {
            options.innerHTML = interactions.map(interaction => `
                <div class="coop-option" data-interaction-id="${interaction.id}">
                    <p class="coop-option-name">${interaction.name}</p>
                    <p class="coop-option-desc">${interaction.description}</p>
                </div>
            `).join('');
            
            options.querySelectorAll('.coop-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    const interactionId = opt.dataset.interactionId;
                    if (this.onRequestCoop) this.onRequestCoop(interactionId);
                    this.elements.coopPanel?.classList.add('hidden');
                });
            });
        }
        
        this.elements.coopPanel?.classList.remove('hidden');
    }
    
    addChatMessage(data) {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message ${data.playerId === window.game?.ws?.playerId ? 'sent' : 'received'}`;
        msgEl.innerHTML = `
            <div class="sender">${data.playerName}</div>
            <div class="content">${this.escapeHtml(data.content)}</div>
        `;
        
        this.elements.chatMessages?.appendChild(msgEl);
        this.elements.chatMessages?.scrollTo(0, this.elements.chatMessages.scrollHeight);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    incrementChatBadge() {
        this.chatBadgeCount++;
        if (this.elements.chatBadge) {
            this.elements.chatBadge.textContent = this.chatBadgeCount;
            this.elements.chatBadge.classList.remove('hidden');
        }
    }
    
    resetChatBadge() {
        this.chatBadgeCount = 0;
        this.elements.chatBadge?.classList.add('hidden');
    }
    
    updateTimer(seconds) {
        if (!this.elements.gameTimer) return;
        
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.elements.gameTimer.textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        this.elements.gameTimer.classList.remove('warning', 'danger');
        if (seconds <= 60) {
            this.elements.gameTimer.classList.add('danger');
        } else if (seconds <= 120) {
            this.elements.gameTimer.classList.add('warning');
        }
    }
    
    updateCooperationScore(score) {
        if (this.elements.coopScoreBar) {
            this.elements.coopScoreBar.style.width = `${score}%`;
        }
        if (this.elements.coopScoreValue) {
            this.elements.coopScoreValue.textContent = `${score}%`;
        }
    }
    
    showAchievementPopup(achievement) {
        document.getElementById('achievement-icon').textContent = achievement.icon;
        document.getElementById('achievement-name').textContent = achievement.name;
        
        this.elements.achievementPopup?.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.achievementPopup?.classList.add('hidden');
        }, 3000);
    }
    
    addAchievementToList(achievement) {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.innerHTML = `
            <span class="achievement-item-icon">${achievement.icon}</span>
            <span class="achievement-item-name">${achievement.name}</span>
        `;
        
        const emptyHint = this.elements.achievementsList?.querySelector('.empty-hint');
        if (emptyHint) emptyHint.remove();
        this.elements.achievementsList?.appendChild(item);
    }
    
    showDynamicEvent(event) {
        document.getElementById('event-icon').textContent = '⚡';
        document.getElementById('event-title').textContent = event.name;
        document.getElementById('event-description').textContent = event.description;
        
        const choices = document.getElementById('event-choices');
        choices.innerHTML = `
            <button class="btn btn-primary" onclick="document.getElementById('event-modal').classList.add('hidden')">
                确认
            </button>
        `;
        
        this.elements.eventModal?.classList.remove('hidden');
    }
    
    showEndingScreen(data) {
        this.showScreen('ending');
        
        const ending = GameConfig.getEnding(data.ending);
        
        if (ending) {
            document.getElementById('ending-badge').textContent = ending.score;
            document.getElementById('ending-title').textContent = ending.name;
            document.getElementById('ending-description').textContent = ending.description;
        }
        
        document.getElementById('stat-clues').textContent = data.scores?.cluesFound || data.cluesFound?.length || 0;
        document.getElementById('stat-puzzles').textContent = data.puzzlesSolved?.length || 0;
        document.getElementById('stat-coop').textContent = `${data.scores?.cooperation || 100}%`;
        
        const duration = Math.floor((data.duration || 0) / 1000);
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        document.getElementById('stat-time').textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        this.renderEndingAchievements(data.achievements);
        this.renderCaseReview(data);
    }
    
    renderEndingAchievements(achievementIds) {
        const container = document.getElementById('ending-achievements-list');
        if (!container) return;
        
        const achievements = achievementIds?.map(id => GameConfig.getAchievement(id)).filter(Boolean) || [];
        
        container.innerHTML = achievements.map(a => `
            <div class="ending-achievement-item">
                <span>${a.icon}</span>
                <span>${a.name}</span>
            </div>
        `).join('');
    }
    
    renderCaseReview(data) {
        const container = document.getElementById('case-review');
        if (!container) return;
        
        const review = [];
        
        if (data.cluesFound?.length > 0) {
            review.push({
                title: '发现的线索',
                content: `共发现 ${data.cluesFound.length} 条线索`
            });
        }
        
        if (data.puzzlesSolved?.length > 0) {
            review.push({
                title: '解开的谜题',
                content: `共解开 ${data.puzzlesSolved.length} 个谜题`
            });
        }
        
        if (data.misledClues?.length > 0) {
            review.push({
                title: '误导线索',
                content: `受到 ${data.misledClues.length} 条误导线索影响`
            });
        }
        
        container.innerHTML = review.map(item => `
            <div class="review-item">
                <p class="review-item-title">${item.title}</p>
                <p class="review-item-content">${item.content}</p>
            </div>
        `).join('');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        this.elements.notificationContainer?.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

window.UIController = UIController;
