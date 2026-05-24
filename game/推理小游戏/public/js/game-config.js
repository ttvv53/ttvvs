const GameConfig = {
    data: null,
    
    async load() {
        try {
            const response = await fetch('/game-data/game-config.json');
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('加载游戏配置失败:', error);
            return this.getDefaultConfig();
        }
    },
    
    getDefaultConfig() {
        return {
            title: "博物馆午夜谜案",
            subtitle: "消失的「星辰之泪」",
            roles: {
                detective: {
                    name: "侦探",
                    title: "首席侦探",
                    avatar: "🔍",
                    color: "#3498db",
                    description: "敏锐的观察力，善于发现隐藏的线索和痕迹"
                },
                analyst: {
                    name: "鉴定专家",
                    title: "物证鉴定专家",
                    avatar: "🔬",
                    color: "#e74c3c",
                    description: "专业的鉴定技术，善于分析物品和解读密码"
                }
            },
            levels: [],
            endings: [],
            achievements: [],
            dynamicEvents: []
        };
    },
    
    getRole(roleId) {
        return this.data?.roles?.[roleId] || null;
    },
    
    getLevel(levelIndex) {
        return this.data?.levels?.[levelIndex] || null;
    },
    
    getClue(levelIndex, clueId) {
        const level = this.getLevel(levelIndex);
        return level?.clues?.find(c => c.id === clueId) || null;
    },
    
    getPuzzle(levelIndex, puzzleId) {
        const level = this.getLevel(levelIndex);
        return level?.puzzles?.find(p => p.id === puzzleId) || null;
    },
    
    getAchievement(achievementId) {
        return this.data?.achievements?.find(a => a.id === achievementId) || null;
    },
    
    getEnding(endingId) {
        return this.data?.endings?.find(e => e.id === endingId) || null;
    },
    
    getDynamicEvent(eventId) {
        return this.data?.dynamicEvents?.find(e => e.id === eventId) || null;
    },
    
    getClueIcon(type) {
        const icons = {
            item: "📦",
            trace: "👣",
            sample: "🧪",
            document: "📄",
            digital: "💾",
            environment: "🏛️"
        };
        return icons[type] || "❓";
    }
};

window.GameConfig = GameConfig;
