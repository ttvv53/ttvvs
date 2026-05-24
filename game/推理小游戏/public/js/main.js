class Game {
    constructor() {
        this.ws = new WebSocketHandler();
        this.ui = new UIController();
        this.logic = null;
    }
    
    async init() {
        this.ui.init();
        
        this.logic = new GameLogic(this.ws, this.ui);
        window.game = this;
        
        await this.logic.initialize();
        
        this.setupUICallbacks();
        
        await this.connectToServer();
        
        setTimeout(() => {
            this.ui.showScreen('menu');
        }, 2000);
    }
    
    async connectToServer() {
        try {
            await this.ws.connect();
            console.log('已连接到服务器');
        } catch (error) {
            console.error('连接服务器失败:', error);
            this.ui.showNotification('无法连接到服务器，请确保服务器正在运行', 'error');
        }
    }
    
    setupUICallbacks() {
        this.ui.onSelectRole = async (role, playerName) => {
            try {
                if (this.ui.isCreatingRoom) {
                    const data = await this.ws.createRoom(playerName, role);
                    console.log('房间创建成功:', data);
                } else {
                    const roomId = document.getElementById('room-code')?.value?.toUpperCase();
                    if (!roomId || roomId.length !== 6) {
                        this.ui.showNotification('请输入有效的6位房间代码', 'warning');
                        return;
                    }
                    const data = await this.ws.joinRoom(roomId, playerName, role);
                    console.log('加入房间成功:', data);
                    this.ui.elements.joinModal?.classList.add('hidden');
                }
            } catch (error) {
                this.ui.showNotification(error.message, 'error');
            }
        };
        
        this.ui.onReady = () => {
            this.logic.setReady();
            this.ui.elements.btnReady.disabled = true;
            this.ui.elements.btnReady.textContent = '等待对方准备...';
        };
        
        this.ui.onLeaveLobby = () => {
            this.ws.disconnect();
            this.ui.showScreen('menu');
        };
        
        this.ui.onInvestigate = (objectId) => {
            this.logic.investigateObject(objectId);
        };
        
        this.ui.onSendChat = (content) => {
            this.logic.sendChatMessage(content);
        };
        
        this.ui.onSaveNotebook = (content) => {
            this.logic.saveNotebook(content);
        };
        
        this.ui.onShowCoop = () => {
            const level = GameConfig.getLevel(this.logic.state.currentLevel);
            if (level?.coopInteractions) {
                this.ui.showCoopOptions(level.coopInteractions);
            }
        };
        
        this.ui.onRequestCoop = (interactionId) => {
            this.logic.requestCoopInteraction(interactionId);
        };
        
        this.ui.onAcceptCoop = (data) => {
            this.logic.acceptCoopRequest(data);
        };
        
        this.ui.elements.btnJoinConfirm?.addEventListener('click', async () => {
            const roomId = this.ui.elements.roomCodeInput?.value?.toUpperCase();
            if (!roomId || roomId.length !== 6) {
                this.ui.showNotification('请输入有效的6位房间代码', 'warning');
                return;
            }
            
            this.ui.isCreatingRoom = false;
            this.ui.showScreen('roleSelect');
            this.ui.elements.joinModal?.classList.add('hidden');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
