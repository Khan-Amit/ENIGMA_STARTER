// 🎁 ENIGMA_STARTER - The Gift Box Wallet
// Main JavaScript functionality
// WARNING: FOR EDUCATIONAL PURPOSES ONLY

class EnigmaWallet {
    constructor() {
        this.demoMode = true;
        this.version = "0.1.0";
        this.gifts = [];
        this.init();
    }

    init() {
        console.log(`🎭 ENIGMA Wallet v${this.version} initialized`);
        this.loadDemoData();
        this.setupEventListeners();
        this.displayWalletInfo();
    }

    loadDemoData() {
        // Demo data for testing
        this.gifts = [
            {
                id: 1,
                name: "Welcome Gift",
                amount: "0.001 ENIGMA",
                unlockDate: "2024-12-25",
                status: "locked",
                puzzle: "What has keys but can't open locks?",
                answer: "piano"
            },
            {
                id: 2,
                name: "Birthday Surprise",
                amount: "0.005 ENIGMA",
                unlockDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                status: "locked",
                puzzle: "I speak without a mouth and hear without ears. What am I?",
                answer: "echo"
            }
        ];
    }

    setupEventListeners() {
        // Gift box interaction
        const giftBox = document.getElementById('giftBox');
        if (giftBox) {
            giftBox.addEventListener('click', this.toggleGiftBox.bind(this));
        }

        // Create wallet button
        const createWalletBtn = document.getElementById('createWalletBtn');
        if (createWalletBtn) {
            createWalletBtn.addEventListener('click', this.createDemoWallet.bind(this));
        }

        // Schedule gift button
        const scheduleBtn = document.getElementById('scheduleGiftBtn');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', this.scheduleGift.bind(this));
        }

        // Puzzle submission
        const puzzleForm = document.getElementById('puzzleForm');
        if (puzzleForm) {
            puzzleForm.addEventListener('submit', this.submitPuzzleAnswer.bind(this));
        }
    }

    toggleGiftBox() {
        const giftBox = document.getElementById('giftBox');
        const message = document.getElementById('surpriseMessage');
        
        if (giftBox.classList.contains('open')) {
            giftBox.classList.remove('open');
            message.style.display = 'none';
        } else {
            giftBox.classList.add('open');
            message.style.display = 'block';
            this.createConfetti();
            
            // Play unlock sound if available
            this.playUnlockSound();
        }
    }

    createDemoWallet() {
        if (!this.demoMode) {
            alert("⚠️ Real wallet generation is disabled in demo mode");
            return;
        }

        // Generate fake wallet data (NOT for real use!)
        const walletData = {
            address: '0x' + this.generateRandomHex(40),
            privateKey: '0x' + this.generateRandomHex(64),
            mnemonic: this.generateFakeMnemonic(),
            balance: (Math.random() * 100).toFixed(4) + ' ENIGMA'
        };

        // Display the wallet
        this.displayWallet(walletData);
        
        // Show security warning
        this.showSecurityWarning();
        
        return walletData;
    }

    generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    generateFakeMnemonic() {
        const words = [
            'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
            'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act'
        ];
        
        let mnemonic = [];
        for (let i = 0; i < 12; i++) {
            mnemonic.push(words[Math.floor(Math.random() * words.length)]);
        }
        return mnemonic.join(' ');
    }

    displayWallet(walletData) {
        const display = document.getElementById('walletDisplay');
        const addressElement = document.getElementById('walletAddress');
        const balanceElement = document.getElementById('walletBalance');
        
        if (addressElement) addressElement.textContent = walletData.address;
        if (balanceElement) balanceElement.textContent = walletData.balance;
        if (display) display.style.display = 'block';
        
        console.log('🎉 Demo wallet created:', {
            address: walletData.address,
            balance: walletData.balance
        });
    }

    scheduleGift() {
        const dateInput = prompt('Enter unlock date (YYYY-MM-DD):', 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        
        if (!dateInput) return;
        
        const amount = prompt('Enter gift amount (in ENIGMA):', '0.001');
        const recipient = prompt('Enter recipient address (demo format: 0x...):', '0x' + this.generateRandomHex(40));
        const puzzle = prompt('Enter a puzzle or riddle for the recipient:', 'What has to be broken before you can use it?');
        const answer = prompt('Enter the answer to the puzzle:', 'egg');
        
        const newGift = {
            id: this.gifts.length + 1,
            name: `Scheduled Gift #${this.gifts.length + 1}`,
            amount: amount + ' ENIGMA',
            unlockDate: dateInput,
            recipient: recipient,
            puzzle: puzzle,
            answer: answer,
            status: 'scheduled',
            timestamp: new Date().toISOString()
        };
        
        this.gifts.push(newGift);
        this.displayGifts();
        
        alert(`🎁 Gift scheduled successfully!\n\nDetails:\n- Amount: ${amount} ENIGMA\n- Unlock Date: ${dateInput}\n- Recipient: ${recipient.substring(0, 16)}...\n\n⚠️ Remember: This is a demo simulation!`);
    }

    displayGifts() {
        const container = document.getElementById('giftsContainer');
        if (!container) return;
        
        container.innerHTML = '<h3><i class="fas fa-gifts"></i> Your Scheduled Gifts</h3>';
        
        if (this.gifts.length === 0) {
            container.innerHTML += '<p>No gifts scheduled yet.</p>';
            return;
        }
        
        this.gifts.forEach(gift => {
            const giftCard = document.createElement('div');
            giftCard.className = 'gift-card';
            giftCard.innerHTML = `
                <div class="gift-header">
                    <h4>${gift.name}</h4>
                    <span class="gift-status ${gift.status}">${gift.status}</span>
                </div>
                <div class="gift-details">
                    <p><i class="fas fa-coins"></i> Amount: ${gift.amount}</p>
                    <p><i class="fas fa-calendar"></i> Unlocks: ${gift.unlockDate}</p>
                    ${gift.puzzle ? `<p><i class="fas fa-question-circle"></i> Puzzle: "${gift.puzzle}"</p>` : ''}
                </div>
                ${gift.status === 'locked' ? 
                    `<button onclick="window.enigmaWallet.attemptUnlock(${gift.id})" class="unlock-btn">
                        <i class="fas fa-unlock"></i> Attempt Unlock
                    </button>` : ''}
            `;
            container.appendChild(giftCard);
        });
    }

    attemptUnlock(giftId) {
        const gift = this.gifts.find(g => g.id === giftId);
        if (!gift) return;
        
        const today = new Date().toISOString().split('T')[0];
        if (today < gift.unlockDate) {
            alert(`⏳ This gift is time-locked until ${gift.unlockDate}!`);
            return;
        }
        
        if (gift.puzzle) {
            const answer = prompt(`🧩 Puzzle: ${gift.puzzle}\n\nEnter your answer:`);
            if (answer && answer.toLowerCase() === gift.answer.toLowerCase()) {
                gift.status = 'unlocked';
                alert(`🎉 Correct! You've unlocked ${gift.amount}!`);
                this.displayGifts();
                this.createConfetti();
            } else {
                alert('❌ Incorrect answer. Try again!');
            }
        } else {
            gift.status = 'unlocked';
            alert(`🎉 Gift unlocked! ${gift.amount} is now available.`);
            this.displayGifts();
        }
    }

    submitPuzzleAnswer(event) {
        event.preventDefault();
        const input = document.getElementById('puzzleAnswer');
        const feedback = document.getElementById('puzzleFeedback');
        
        if (!input || !feedback) return;
        
        const answer = input.value.toLowerCase();
        
        // Check against known puzzles
        const puzzles = [
            { question: "What has keys but can't open locks?", answer: "piano" },
            { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "m" }
        ];
        
        const match = puzzles.find(p => p.answer === answer);
        
        if (match) {
            feedback.innerHTML = `<span style="color: #4CAF50;">✅ Correct! The answer to "${match.question}" is indeed "${answer}"!</span>`;
            this.createConfetti();
        } else {
            feedback.innerHTML = `<span style="color: #FF6B6B;">❌ Not quite right. Try another puzzle!</span>`;
        }
        
        input.value = '';
    }

    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.innerHTML = ['🎁', '🎉', '✨', '🎊', '🥳', '💎'][Math.floor(Math.random() * 6)];
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-50px';
                confetti.style.fontSize = (Math.random() * 20 + 15) + 'px';
                confetti.style.zIndex = '9999';
                confetti.style.opacity = '0.9';
                confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 30);
        }
    }

    playUnlockSound() {
        // Create a simple unlock sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log("Audio not supported in this environment");
        }
    }

    showSecurityWarning() {
        console.warn(`
⚠️ ⚠️ ⚠️  SECURITY WARNING ⚠️ ⚠️ ⚠️
===================================
THIS IS A DEMONSTRATION WALLET ONLY!

DO NOT USE FOR REAL CRYPTOCURRENCY!

Features:
- All keys are randomly generated
- No real blockchain connection
- No real funds are involved
- For educational purposes only

Never share private keys or mnemonics!
===================================
        `);
        
        // Show visual warning every 5th wallet creation
        if (Math.random() < 0.2) {
            alert(`⚠️ SECURITY REMINDER ⚠️\n\nThis is a demonstration wallet. Never use demo wallets for real cryptocurrency!\n\nReal wallets require:\n1. Secure key storage\n2. Hardware security modules\n3. Professional audits\n4. Backup procedures`);
        }
    }

    displayWalletInfo() {
        const info = `
🎭 ENIGMA Wallet Info:
-----------------------
Version: ${this.version}
Mode: ${this.demoMode ? 'Demo (Educational)' : 'Production'}
Status: Ready
Gifts in memory: ${this.gifts.length}
-----------------------
        `;
        console.log(info);
    }

    // Utility function to export demo data (for debugging)
    exportDemoData() {
        return {
            version: this.version,
            demoMode: this.demoMode,
            gifts: this.gifts,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize ENIGMA Wallet when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.enigmaWallet = new EnigmaWallet();
    
    // Add confetti animation to CSS if not present
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            
            .gift-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin: 10px 0;
                transition: all 0.3s;
            }
            
            .gift-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 255, 255, 0.1);
            }
            
            .gift-status {
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: bold;
            }
            
            .gift-status.locked {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
            }
            
            .gift-status.unlocked {
                background: rgba(78, 205, 196, 0.2);
                color: #4ecdc4;
            }
            
            .gift-status.scheduled {
                background: rgba(254, 202, 87, 0.2);
                color: #feca57;
            }
            
            .unlock-btn {
                background: linear-gradient(90deg, #4ecdc4, #44a08d);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            }
            
            .unlock-btn:hover {
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Display initial gifts after a delay
    setTimeout(() => {
        if (window.enigmaWallet) {
            window.enigmaWallet.displayGifts();
        }
    }, 1000);
});

// Make wallet accessible globally for debugging
console.log(`
✨ ENIGMA_STARTER Loaded ✨
============================
Try these in the console:
1. enigmaWallet.createDemoWallet()
2. enigmaWallet.scheduleGift()
3. enigmaWallet.exportDemoData()
4. enigmaWallet.displayGifts()

Remember: This is for education only!
============================
`);
