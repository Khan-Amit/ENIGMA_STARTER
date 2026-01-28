// ENIGMA STARTER - Complete Wallet System
// No MetaMask Required - Pure Enigma Magic!

class EnigmaWallet {
    constructor() {
        this.balance = 3.1415; // Starting with π ETH (sacred math!)
        this.address = "0xENIGMA" + Date.now().toString().slice(-8);
        this.connected = true;
        this.sacredNumbers = [7, 13, 22, 34, 41, 50];
        this.conversionRates = null;
        this.lastUpdate = null;
        
        // Apply sacred settings
        this.applySacredSettings();
        
        console.log("🌊 ENIGMA WALLET INITIALIZED 🌊");
        console.log("Sacred Numbers:", this.sacredNumbers);
        console.log("Starting Balance:", this.balance, "ETH");
    }
    
    applySacredSettings() {
        // Apply your 7-13-22-34-41-50 numbers
        this.settings = {
            minBalance: this.sacredNumbers[0] / 100, // 0.07 ETH
            confirmationBlocks: this.sacredNumbers[1], // 13 blocks
            transactionLimit: this.sacredNumbers[2], // 22 ETH
            encryptionKey: this.sacredNumbers[3], // Key 34
            demoTimeout: this.sacredNumbers[4], // 41 seconds
            maxGift: this.sacredNumbers[5] / 10 // 5.0 ETH
        };
        
        console.log("🔢 Sacred Settings Applied:", this.settings);
    }
    
    showWelcome() {
        const statusText = document.getElementById('statusText');
        const messages = [
            "⭐ Enigma Vision Activated",
            "🌀 Tapping into Sacred Numbers",
            "💫 Channeling Ancient Wisdom",
            "✨ Ready for Digital Alchemy"
        ];
        
        let index = 0;
        setInterval(() => {
            statusText.textContent = messages[index];
            index = (index + 1) % messages.length;
        }, 3000);
    }
    
    revealTreasure() {
        const chamberContent = document.getElementById('chamberContent');
        const giftBox = document.getElementById('giftBox');
        
        // Animate gift opening
        giftBox.style.transform = 'rotateY(180deg) scale(1.2)';
        giftBox.style.opacity = '0.5';
        
        // Create treasure display
        chamberContent.innerHTML = `
            <div class="treasure-display">
                <h2 class="treasure-title">
                    <i class="fas fa-crown"></i>
                    ENIGMA TREASURE
                </h2>
                
                <div class="treasure-amount-display">
                    <span class="treasure-amount">${this.balance}</span>
                    <span class="treasure-unit">ETH</span>
                </div>
                
                <div class="treasure-info">
                    <div class="info-item">
                        <i class="fas fa-fingerprint"></i>
                        <span>Sigil: ${this.formatAddress(this.address)}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-water"></i>
                        <span>Source: Sacred Fountain</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-anchor"></i>
                        <span>Anchor: 7-13-22-34-41-50</span>
                    </div>
                </div>
                
                <div class="treasure-quote">
                    <p>"The number π flows through all creation,<br>connecting circles, cycles, and digital treasures."</p>
                </div>
                
                <div class="treasure-stats">
                    <div class="stat">
                        <div class="stat-label">Sacred Energy</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(this.balance / 10 * 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Trigger conversion if not already loaded
        if (!this.conversionRates) {
            setTimeout(() => this.loadConversionRates(), 1500);
        }
        
        // Reset gift box after animation
        setTimeout(() => {
            giftBox.style.opacity = '1';
        }, 1000);
    }
    
    async getFaucet() {
        const statusText = document.getElementById('statusText');
        const oldBalance = this.balance;
        
        // Check cooldown (using number 41 from sequence)
        const now = Date.now();
        if (this.lastFaucet && (now - this.lastFaucet) < this.settings.demoTimeout * 1000) {
            const remaining = Math.ceil((this.settings.demoTimeout * 1000 - (now - this.lastFaucet)) / 1000);
            statusText.textContent = `⏳ Fountain cools for ${remaining}s (${this.sacredNumbers[4]} rule)`;
            return;
        }
        
        statusText.textContent = "🌀 Drawing from Sacred Fountain...";
        
        // Animate with mystical effect
        document.querySelectorAll('.number').forEach(num => {
            num.style.transform = 'scale(1.2)';
            setTimeout(() => num.style.transform = '', 300);
        });
        
        // Wait with animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add ETH based on sacred number 7
        const addedAmount = this.sacredNumbers[0] / 100; // 0.07 ETH
        this.balance = (parseFloat(this.balance) + addedAmount).toFixed(4);
        this.lastFaucet = Date.now();
        
        // Update display
        statusText.textContent = `💧 +${addedAmount} ETH from Sacred Fountain!`;
        
        // Show notification
        this.showNotification(`Fountain granted ${addedAmount} ETH`, 'success');
        
        // Update treasure display if open
        this.updateBalanceDisplay(oldBalance, this.balance);
        
        console.log(`💧 Fountain used: ${addedAmount} ETH added. New balance: ${this.balance} ETH`);
    }
    
    async loadConversionRates() {
        try {
            const statusText = document.getElementById('statusText');
            statusText.textContent = "🔮 Consulting Alchemy Tables...";
            
            // Use CoinGecko API (free, no key needed for basic use)
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,gbp,jpy,inr'
            );
            
            this.conversionRates = response.data.ethereum;
            this.lastUpdate = new Date();
            
            // Show conversions
            this.showConversions();
            
            statusText.textContent = "✨ Alchemy Complete - Values Converted";
            
            console.log("💰 Conversion rates loaded:", this.conversionRates);
            
        } catch (error) {
            console.warn("Could not fetch live rates, using defaults");
            
            // Fallback rates
            this.conversionRates = {
                usd: 3200,
                eur: 2950,
                gbp: 2550,
                jpy: 480000,
                inr: 265000
            };
            
            this.showConversions();
            
            const statusText = document.getElementById('statusText');
            statusText.textContent = "📜 Using Ancient Alchemy Tables";
        }
    }
    
    showConversions() {
        const chamberContent = document.getElementById('chamberContent');
        if (!chamberContent.innerHTML.includes('treasure-display')) return;
        
        const conversions = this.calculateConversions();
        
        const conversionHTML = `
            <div class="conversion-grid">
                ${Object.entries(conversions).map(([currency, value]) => `
                    <div class="conversion-item">
                        <div class="conversion-currency">${currency.toUpperCase()}</div>
                        <div class="conversion-value">${value}</div>
                    </div>
                `).join('')}
            </div>
            <p style="color:#8a8aff; font-size:0.9rem; margin-top:10px;">
                <i class="fas fa-clock"></i> Updated: ${this.lastUpdate ? this.lastUpdate.toLocaleTimeString() : 'Now'}
            </p>
        `;
        
        // Insert after treasure amount
        const display = chamberContent.querySelector('.treasure-display');
        const amountDisplay = display.querySelector('.treasure-amount-display');
        amountDisplay.insertAdjacentHTML('afterend', conversionHTML);
    }
    
    calculateConversions() {
        if (!this.conversionRates) return {};
        
        const conversions = {};
        for (const [currency, rate] of Object.entries(this.conversionRates)) {
            const value = (this.balance * rate).toFixed(2);
            
            // Format based on currency
            if (currency === 'jpy' || currency === 'inr') {
                conversions[currency] = Math.floor(this.balance * rate).toLocaleString();
            } else {
                conversions[currency] = parseFloat(value).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }
        
        return conversions;
    }
    
    showConversion() {
        const chamberContent = document.getElementById('chamberContent');
        
        chamberContent.innerHTML = `
            <div class="treasure-display">
                <h2 class="treasure-title">
                    <i class="fas fa-exchange-alt"></i>
                    ALCHEMY TABLE
                </h2>
                
                <div class="treasure-amount-display">
                    <span class="treasure-amount">${this.balance}</span>
                    <span class="treasure-unit">ETH</span>
                </div>
                
                <p style="color:#f5f3c1; margin:20px 0;">Current value in various currencies:</p>
                
                ${this.conversionRates ? this.createConversionTable() : `
                    <div style="text-align:center; padding:30px;">
                        <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:#8a8aff;"></i>
                        <p style="margin-top:15px;">Consulting the alchemy tables...</p>
                        <button onclick="enigmaWallet.loadConversionRates()" style="margin-top:15px; padding:10px 20px; background:#8a8aff; color:white; border:none; border-radius:10px; cursor:pointer;">
                            Summon Rates
                        </button>
                    </div>
                `}
                
                <div style="margin-top:30px;">
                    <button class="control-btn fountain" onclick="enigmaWallet.revealTreasure()" style="width:100%;">
                        <i class="fas fa-chevron-left"></i> Back to Treasure
                    </button>
                </div>
            </div>
        `;
        
        // If we have rates but haven't shown them yet
        if (this.conversionRates && !chamberContent.innerHTML.includes('conversion-item')) {
            setTimeout(() => this.showConversions(), 100);
        }
    }
    
    createConversionTable() {
        const conversions = this.calculateConversions();
        const symbols = {
            usd: '$',
            eur: '€',
            gbp: '£',
            jpy: '¥',
            inr: '₹'
        };
        
        return `
            <div class="conversion-grid">
                ${Object.entries(conversions).map(([currency, value]) => `
                    <div class="conversion-item">
                        <div class="conversion-currency">
                            <span style="font-size:1.2rem;">${symbols[currency] || ''}</span>
                            ${currency.toUpperCase()}
                        </div>
                        <div class="conversion-value">${value}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="background:rgba(212,175,55,0.1); padding:15px; border-radius:10px; margin-top:20px; border:1px solid rgba(212,175,55,0.3);">
                <p style="color:#f5f3c1; margin-bottom:10px;">
                    <i class="fas fa-lightbulb"></i> <strong>Alchemy Insight:</strong>
                </p>
                <p style="color:#8a8aff; font-size:0.9rem;">
                    Each ETH is backed by the sacred number π (3.1415...). 
                    The conversion uses ${this.sacredNumbers[2]} as the base multiplier.
                </p>
            </div>
        `;
    }
    
    wrapGift() {
        const chamberContent = document.getElementById('chamberContent');
        
        chamberContent.innerHTML = `
            <div class="treasure-display">
                <h2 class="treasure-title">
                    <i class="fas fa-gift"></i>
                    GIFT ALTAR
                </h2>
                
                <p style="color:#f5f3c1; text-align:center; margin:20px 0;">
                    Prepare a digital gift using your Enigma treasure
                </p>
                
                <div class="gift-form">
                    <div class="form-group">
                        <label><i class="fas fa-coins"></i> Amount to Gift</label>
                        <div class="input-with-unit">
                            <input type="number" id="giftAmount" value="0.01" step="0.001" min="0.001" max="${this.balance}" style="width:100%; padding:12px; border-radius:8px; border:1px solid rgba(212,175,55,0.3); background:rgba(0,0,0,0.3); color:white; font-size:1.1rem;">
                            <span class="input-unit">ETH</span>
                        </div>
                        <small style="color:#8a8aff;">Max: ${this.balance} ETH (Sacred rule: ${this.settings.maxGift} ETH)</small>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Recipient's Sigil</label>
                        <input type="text" id="giftAddress" placeholder="0x... or friend's name" style="width:100%; padding:12px; border-radius:8px; border:1px solid rgba(212,175,55,0.3); background:rgba(0,0,0,0.3); color:white; font-size:1.1rem;">
                        <small style="color:#8a8aff;">Or leave blank for mystery gift</small>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-scroll"></i> Secret Message</label>
                        <textarea id="giftMessage" placeholder="Write a hidden message for the recipient..." rows="3" style="width:100%; padding:12px; border-radius:8px; border:1px solid rgba(212,175,55,0.3); background:rgba(0,0,0,0.3); color:white; font-size:1.1rem;"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-lock"></i> Encryption Level</label>
                        <select id="giftEncryption" style="width:100%; padding:12px; border-radius:8px; border:1px solid rgba(212,175,55,0.3); background:rgba(0,0,0,0.3); color:white; font-size:1.1rem;">
                            <option value="7">Level 7 (Basic)</option>
                            <option value="13">Level 13 (Standard)</option>
                            <option value="22">Level 22 (Sacred)</option>
                            <option value="34">Level 34 (Divine)</option>
                            <option value="41">Level 41 (Mystical)</option>
                            <option value="50">Level 50 (Enigma)</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-top:30px; display:flex; gap:15px;">
                    <button class="control-btn gift" onclick="enigmaWallet.sendGift()" style="flex:2;">
                        <i class="fas fa-paper-plane"></i> Send Gift
                    </button>
                    <button class="control-btn seal" onclick="enigmaWallet.revealTreasure()" style="flex:1;">
                        Cancel
                    </button>
                </div>
                
                <div style="margin-top:25px; padding:15px; background:rgba(231, 76, 60, 0.1); border-radius:10px; border:1px solid rgba(231, 76, 60, 0.3);">
                    <p style="color:#f5f3c1; font-size:0.9rem;">
                        <i class="fas fa-info-circle"></i> 
                        <strong>Note:</strong> This is a demonstration. In a real implementation, 
                        this would create an on-chain transaction or a shareable encrypted link.
                    </p>
                </div>
            </div>
        `;
    }
    
    sendGift() {
        const amount = parseFloat(document.getElementById('giftAmount').value);
        const address = document.getElementById('giftAddress').value || "Mystery Recipient";
        const message = document.getElementById('giftMessage').value || "No message";
        const encryption = document.getElementById('giftEncryption').value;
        
        // Validate
        if (amount > this.balance) {
            this.showNotification("Insufficient Enigma treasure!", "error");
            return;
        }
        
        if (amount > this.settings.maxGift) {
            this.showNotification(`Exceeds sacred limit of ${this.settings.maxGift} ETH!`, "error");
            return;
        }
        
        // Update balance
        const oldBalance = this.balance;
        this.balance = (parseFloat(this.balance) - amount).toFixed(4);
        
        // Show success
        const chamberContent = document.getElementById('chamberContent');
        chamberContent.innerHTML = `
            <div class="treasure-display">
                <h2 class="treasure-title">
                    <i class="fas fa-gift"></i>
                    GIFT PREPARED!
                </h2>
                
                <div style="text-align:center; padding:30px;">
                    <div style="font-size:5rem; color:#e74c3c; margin-bottom:20px;">
                        🎁
                    </div>
                    
                    <div style="background:rgba(46, 204, 113, 0.1); padding:20px; border-radius:15px; border:1px solid rgba(46, 204, 113, 0.3); margin:20px 0;">
                        <p style="color:#f5f3c1; font-size:1.2rem; margin-bottom:10px;">
                            <strong>${amount} ETH</strong> gift prepared!
                        </p>
                        <p style="color:#8a8aff;">
                            To: ${address}<br>
                            Encryption: Level ${encryption}
                        </p>
                    </div>
                    
                    <div style="background:rgba(212,175,55,0.1); padding:15px; border-radius:10px; margin:20px 0; border:1px solid rgba(212,175,55,0.3);">
                        <p style="color:#f5f3c1; margin-bottom:10px;">
                            <i class="fas fa-scroll"></i> <strong>Secret Message:</strong>
                        </p>
                        <p style="color:#f5f3c1; font-style:italic;">
                            "${message}"
                        </p>
                    </div>
                    
                    <div style="color:#8a8aff; font-size:0.9rem; margin-top:20px;">
                        <p>Gift ID: ENIGMA-${Date.now().toString().slice(-8)}</p>
                        <p>Sacred Confirmation: ${this.sacredNumbers[1]} blocks</p>
                    </div>
                </div>
                
                <div style="margin-top:30px; display:flex; gap:15px;">
                    <button class="control-btn gift" onclick="enigmaWallet.shareGift()" style="flex:1;">
                        <i class="fas fa-share-alt"></i> Share Link
                    </button>
                    <button class="control-btn fountain" onclick="enigmaWallet.revealTreasure()" style="flex:1;">
                        <i class="fas fa-home"></i> Back Home
                    </button>
                </div>
                
                <div style="margin-top:25px; color:#2ecc71; text-align:center;">
                    <p><i class="fas fa-check-circle"></i> Balance updated: ${oldBalance} → ${this.balance} ETH</p>
                </div>
            </div>
        `;
        
        this.updateBalanceDisplay(oldBalance, this.balance);
        this.showNotification(`Gift of ${amount} ETH prepared!`, "success");
        
        console.log(`🎁 Gift sent: ${amount} ETH to ${address}. New balance: ${this.balance}`);
    }
    
    shareGift() {
        // Create a shareable link (simulated)
        const shareLink = `https://khan-amit.github.io/ENIGMA_STARTER/?gift=${btoa("enigma_gift_" + Date.now())}`;
        
        navigator.clipboard.writeText(shareLink).then(() => {
            this.showNotification("Gift link copied to clipboard!", "success");
            
            // Show share options
            const chamberContent = document.getElementById('chamberContent');
            const existing = chamberContent.innerHTML;
            
            chamberContent.innerHTML = existing + `
                <div style="margin-top:25px; padding:20px; background:rgba(52, 152, 219, 0.1); border-radius:10px; border:1px solid rgba(52, 152, 219, 0.3);">
                    <p style="color:#f5f3c1; margin-bottom:15px;">
                        <i class="fas fa-share-alt"></i> <strong>Share Options:</strong>
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button style="flex:1; padding:10px; background:#3498db; color:white; border:none; border-radius:8px; cursor:pointer;">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button style="flex:1; padding:10px; background:#1877f2; color:white; border:none; border-radius:8px; cursor:pointer;">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                        <button style="flex:1; padding:10px; background:#25d366; color:white; border:none; border-radius:8px; cursor:pointer;">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                    </div>
                    <p style="color:#8a8aff; font-size:0.9rem; margin-top:15px;">
                        Link copied! Share it with your friend to let them unwrap their gift.
                    </p>
                </div>
            `;
        });
    }
    
    sealEnigma() {
        const statusText = document.getElementById('statusText');
        statusText.textContent = "🔒 Sealing the Enigma Chamber...";
        
        // Animation
        document.querySelectorAll('.number').forEach(num => {
            num.style.background = '#2c3e50';
            num.style.color = '#7f8c8d';
        });
        
        setTimeout(() => {
            // Reset to welcome state
            const chamberContent = document.getElementById('chamberContent');
            chamberContent.innerHTML = `
                <div style="text-align:center; padding:50px 20px;">
                    <div style="font-size:4rem; color:#8a8aff; margin-bottom:20px;">
                        🕉️
                    </div>
                    <h3 style="color:#f5f3c1; margin-bottom:15px;">Enigma Chamber Sealed</h3>
                    <p style="color:#8a8aff;">Touch the gift box to begin anew</p>
                </div>
            `;
            
            // Reset gift box
            const giftBox = document.getElementById('giftBox');
            giftBox.style.transform = '';
            giftBox.style.opacity = '1';
            
            statusText.textContent = "⭐ Enigma Vision Ready";
            
            // Reset numbers
            setTimeout(() => {
                document.querySelectorAll('.number').forEach(num => {
                    num.style.background = '';
                    num.style.color = '';
                });
            }, 1000);
            
        }, 1500);
    }
    
    updateBalanceDisplay(oldBalance, newBalance) {
        // Animate balance change
        const balanceElements = document.querySelectorAll('.treasure-amount');
        balanceElements.forEach(element => {
            if (element.textContent === oldBalance.toString()) {
                element.textContent = newBalance;
                element.style.color = '#2ecc71';
                setTimeout(() => element.style.color = '', 1000);
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `enigma-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        // Style it
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(46, 204, 113, 0.9)' : type === 'error' ? 'rgba(231, 76, 60, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid ${type === 'success' ? 'rgba(46, 204, 113, 0.5)' : type === 'error' ? 'rgba(231, 76, 60, 0.5)' : 'rgba(52, 152, 219, 0.5)'};
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add CSS animations if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    formatAddress(address) {
        if (!address) return "ENIGMA•••ZONE";
        if (address.length <= 12) return address;
        return address.slice(0, 8) + '...' + address.slice(-6);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.enigmaWallet = new EnigmaWallet();
    
    // Add click handlers for sacred numbers
    document.querySelectorAll('.number').forEach((num, index) => {
        num.addEventListener('click', () => {
            const meanings = [
                "Foundation in the Deep",
                "Transformative Cunning",
                "Codes of Civilization",
                "Hidden Potent Structures",
                "Human Experience Anchored",
                "Liberation & Understanding"
            ];
            
            enigmaWallet.showNotification(
                `Sacred Number ${enigmaWallet.sacredNumbers[index]}: ${meanings[index]}`,
                'info'
            );
        });
    });
});

console.log("🎁 ENIGMA STARTER - Ready for Adventure!");
console.log("Built by Khan-Amit with ENKI's wisdom");
console.log("Remember: Not all treasure is silver and gold, mate!");
