// 📝 Farm Dominion v2 - Quest System
import { SETTINGS } from './settings.js';

export class QuestSystem {
    constructor() {
        this.quests = [];
        this.activeQuests = [];
        this.completedQuests = [];
        this.questUI = null;
        this.initializeQuests();
        this.createQuestUI();
    }

    // Initialize default quests
    initializeQuests() {
        this.quests = [
            {
                id: 1,
                title: "Çiftliğe Hoşgeldin",
                description: "Çiftliği keşfet ve tüm binaları ziyaret et",
                type: "exploration",
                objectives: [
                    { text: "5 bina ziyaret et", current: 0, target: 5, complete: false }
                ],
                rewards: {
                    xp: 100,
                    coins: 50
                },
                completed: false
            },
            {
                id: 2,
                title: "Hayvan Dostları",
                description: "Çiftlikteki hayvanlarla tanış",
                type: "interaction",
                objectives: [
                    { text: "10 hayvana yaklaş", current: 0, target: 10, complete: false }
                ],
                rewards: {
                    xp: 150,
                    coins: 75
                },
                completed: false
            },
            {
                id: 3,
                title: "Gün Batımı",
                description: "Gün batımını izle",
                type: "time",
                objectives: [
                    { text: "Akşam 18:00'i bekle", current: 0, target: 1, complete: false }
                ],
                rewards: {
                    xp: 50,
                    coins: 25
                },
                completed: false
            },
            {
                id: 4,
                title: "Keşif Gezisi",
                description: "Çiftliğin her köşesini keşfet",
                type: "exploration",
                objectives: [
                    { text: "500 metre yürü", current: 0, target: 500, complete: false }
                ],
                rewards: {
                    xp: 200,
                    coins: 100
                },
                completed: false
            },
            {
                id: 5,
                title: "Hava Durumu Gözlemcisi",
                description: "Farklı hava durumlarını deneyimle",
                type: "weather",
                objectives: [
                    { text: "3 farklı hava durumu gör", current: 0, target: 3, complete: false }
                ],
                rewards: {
                    xp: 250,
                    coins: 150
                },
                completed: false
            }
        ];

        console.log('📝 Quests initialized:', this.quests.length);
    }

    // Create quest UI
    createQuestUI() {
        this.questUI = document.createElement('div');
        this.questUI.id = 'quest-panel';
        this.questUI.style.cssText = `
            position: fixed;
            top: 100px;
            right: 15px;
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            padding: 15px;
            border-radius: 12px;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 100;
        `;

        const title = document.createElement('h3');
        title.textContent = '📝 Görevler';
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: #4ade80;
            font-size: 16px;
        `;
        this.questUI.appendChild(title);

        this.questList = document.createElement('div');
        this.questList.id = 'quest-list';
        this.questUI.appendChild(this.questList);

        document.body.appendChild(this.questUI);

        // Start first quest
        this.startQuest(1);
    }

    // Update quest UI
    updateQuestUI() {
        this.questList.innerHTML = '';

        this.activeQuests.forEach(quest => {
            const questEl = document.createElement('div');
            questEl.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 8px;
                border-left: 3px solid #4ade80;
            `;

            const questTitle = document.createElement('div');
            questTitle.textContent = quest.title;
            questTitle.style.cssText = `
                font-weight: bold;
                margin-bottom: 5px;
                color: #4ade80;
            `;
            questEl.appendChild(questTitle);

            const questDesc = document.createElement('div');
            questDesc.textContent = quest.description;
            questDesc.style.cssText = `
                font-size: 11px;
                margin-bottom: 8px;
                opacity: 0.8;
            `;
            questEl.appendChild(questDesc);

            quest.objectives.forEach(obj => {
                const objEl = document.createElement('div');
                const progress = Math.min(100, (obj.current / obj.target) * 100);
                objEl.style.cssText = `
                    font-size: 11px;
                    margin: 4px 0;
                `;

                const checkbox = obj.complete ? '✅' : '⬜';
                objEl.innerHTML = `
                    ${checkbox} ${obj.text}
                    <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 2px;">
                        <div style="background: #4ade80; height: 100%; width: ${progress}%; border-radius: 2px; transition: width 0.3s;"></div>
                    </div>
                `;
                questEl.appendChild(objEl);
            });

            const rewardEl = document.createElement('div');
            rewardEl.style.cssText = `
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(255,255,255,0.2);
                font-size: 11px;
                opacity: 0.9;
            `;
            rewardEl.innerHTML = `
                <span style="color: #fbbf24;">🏆 ${quest.rewards.xp} XP</span>
                <span style="margin-left: 10px; color: #fbbf24;">💰 ${quest.rewards.coins} Altın</span>
            `;
            questEl.appendChild(rewardEl);

            this.questList.appendChild(questEl);
        });

        // Scrollbar styling
        this.questUI.style.cssText += `
            scrollbar-width: thin;
            scrollbar-color: #4ade80 rgba(255,255,255,0.1);
        `;
    }

    // Start a quest
    startQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed && !this.activeQuests.find(q => q.id === questId)) {
            this.activeQuests.push(quest);
            this.updateQuestUI();
            this.showNotification(`📝 Yeni Görev: ${quest.title}`, 'quest');
            console.log('📝 Quest started:', quest.title);
        }
    }

    // Update quest progress
    updateQuest(questId, objectiveIndex, amount = 1) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest) return;

        const objective = quest.objectives[objectiveIndex];
        if (!objective || objective.complete) return;

        objective.current = Math.min(objective.current + amount, objective.target);

        if (objective.current >= objective.target) {
            objective.complete = true;
        }

        // Check if all objectives are complete
        const allComplete = quest.objectives.every(obj => obj.complete);
        if (allComplete && !quest.completed) {
            this.completeQuest(questId);
        } else {
            this.updateQuestUI();
        }
    }

    // Complete a quest
    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;

        const quest = this.activeQuests[questIndex];
        quest.completed = true;

        // Remove from active and add to completed
        this.activeQuests.splice(questIndex, 1);
        this.completedQuests.push(quest);

        // Award rewards
        this.awardRewards(quest.rewards);

        // Show completion notification
        this.showNotification(
            `✅ Görev Tamamlandı: ${quest.title}\n🏆 ${quest.rewards.xp} XP | 💰 ${quest.rewards.coins} Altın`,
            'complete'
        );

        this.updateQuestUI();

        // Start next quest if available
        const nextQuest = this.quests.find(q => !q.completed && q.id === questId + 1);
        if (nextQuest) {
            setTimeout(() => this.startQuest(nextQuest.id), 2000);
        }

        console.log('✅ Quest completed:', quest.title);
    }

    // Award rewards
    awardRewards(rewards) {
        // Store in localStorage
        const saved = JSON.parse(localStorage.getItem('farmDominionPlayer') || '{}');
        saved.xp = (saved.xp || 0) + rewards.xp;
        saved.coins = (saved.coins || 0) + rewards.coins;
        saved.level = Math.floor(saved.xp / 1000) + 1;
        localStorage.setItem('farmDominionPlayer', JSON.stringify(saved));
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'complete' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(0, 0, 0, 0.9)'};
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease-out;
            white-space: pre-line;
            text-align: center;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translate(-50%, -60%); opacity: 0; }
                to { transform: translate(-50%, -50%); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Track building visits
    visitBuilding(buildingType) {
        // Quest 1: Visit buildings
        this.updateQuest(1, 0, 1);
    }

    // Track animal interactions
    interactWithAnimal() {
        // Quest 2: Interact with animals
        this.updateQuest(2, 0, 1);
    }

    // Track distance traveled
    updateDistance(distance) {
        // Quest 4: Travel distance
        this.updateQuest(4, 0, distance);
    }

    // Track time of day
    updateTime(hours) {
        // Quest 3: Wait for sunset (18:00)
        if (hours >= 18 && hours < 19) {
            this.updateQuest(3, 0, 1);
        }
    }

    // Track weather changes
    observeWeather(weatherType) {
        // Quest 5: Experience different weather
        const saved = JSON.parse(localStorage.getItem('weathersSeen') || '[]');
        if (!saved.includes(weatherType)) {
            saved.push(weatherType);
            localStorage.setItem('weathersSeen', JSON.stringify(saved));
            this.updateQuest(5, 0, 1);
        }
    }

    // Get all active quests
    getActiveQuests() {
        return this.activeQuests;
    }

    // Get completed quests
    getCompletedQuests() {
        return this.completedQuests;
    }

    // Save progress
    saveProgress() {
        const data = {
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests
        };
        localStorage.setItem('farmDominionQuests', JSON.stringify(data));
    }

    // Load progress
    loadProgress() {
        const saved = localStorage.getItem('farmDominionQuests');
        if (saved) {
            const data = JSON.parse(saved);
            this.activeQuests = data.activeQuests || [];
            this.completedQuests = data.completedQuests || [];
            this.updateQuestUI();
        }
    }
}

console.log('📝 Quest system loaded');
