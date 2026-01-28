// 🎭 ENIGMA_STARTER - Background Service Worker
// Browser extension background script
// Handles wallet operations, events, and background tasks

console.log('🎁 ENIGMA Background Service Worker initialized');

// Extension lifecycle events
chrome.runtime.onInstalled.addListener((details) => {
    console.log(`ENIGMA extension ${details.reason}`, details);
    
    if (details.reason === 'install') {
        // First install - setup initial state
        chrome.storage.local.set({
            enigma_installed: true,
            install_time: new Date().toISOString(),
            version: '0.1.0',
            demo_mode: true,
            gifts: [],
            security_warnings: 0
        });
        
        // Create welcome notification
        createNotification({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '🎁 ENIGMA Wallet Installed!',
            message: 'Your mysterious gift box wallet is ready. Click the extension icon to begin!',
            priority: 2
        });
    }
    
    if (details.reason === 'update') {
        console.log('ENIGMA extension updated to new version');
    }
});

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.log('ENIGMA extension icon clicked');
    
    // Send message to active tab
    chrome.tabs.sendMessage(tab.id, {
        action: 'enigma_icon_clicked',
        timestamp: new Date().toISOString()
    });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request.action);
    
    switch (request.action) {
        case 'get_wallet_info':
            handleGetWalletInfo(sendResponse);
            return true; // Will respond asynchronously
            
        case 'create_demo_wallet':
            handleCreateDemoWallet(sendResponse);
            return true;
            
        case 'schedule_gift':
            handleScheduleGift(request.data, sendResponse);
            return true;
            
        case 'check_gifts':
            handleCheckGifts(sendResponse);
            return true;
            
        case 'unlock_gift':
            handleUnlockGift(request.giftId, sendResponse);
            return true;
            
        case 'get_security_status':
            handleGetSecurityStatus(sendResponse);
            return true;
            
        case 'simulate_transaction':
            handleSimulateTransaction(request.data, sendResponse);
            return true;
    }
});

// Handle getting wallet info
function handleGetWalletInfo(sendResponse) {
    chrome.storage.local.get(['enigma_wallet', 'demo_mode'], (result) => {
        if (result.enigma_wallet) {
            sendResponse({
                success: true,
                wallet: result.enigma_wallet,
                demo_mode: result.demo_mode
            });
        } else {
            sendResponse({
                success: false,
                message: 'No wallet found. Create one first!',
                demo_mode: true
            });
        }
    });
}

// Handle creating a demo wallet
function handleCreateDemoWallet(sendResponse) {
    const walletData = {
        address: '0x' + generateRandomHex(40),
        publicKey: '0x' + generateRandomHex(130),
        privateKey: 'DO_NOT_USE_THIS_' + generateRandomHex(64),
        mnemonic: generateDemoMnemonic(),
        balance: {
            enigma: (Math.random() * 100).toFixed(4),
            eth: (Math.random() * 0.5).toFixed(4),
            btc: (Math.random() * 0.01).toFixed(4)
        },
        created: new Date().toISOString(),
        transactions: []
    };
    
    chrome.storage.local.set({ enigma_wallet: walletData }, () => {
        console.log('Demo wallet created:', walletData.address);
        
        // Log security warning
        logSecurityEvent('demo_wallet_created', {
            warning: 'DEMO WALLET - NOT FOR REAL USE',
            address: walletData.address.substring(0, 16) + '...'
        });
        
        sendResponse({
            success: true,
            wallet: walletData,
            warning: '⚠️ This is a DEMO wallet only! Never use for real cryptocurrency!'
        });
    });
}

// Handle scheduling a new gift
function handleScheduleGift(giftData, sendResponse) {
    chrome.storage.local.get(['gifts'], (result) => {
        const gifts = result.gifts || [];
        const newGift = {
            id: Date.now(),
            ...giftData,
            status: 'scheduled',
            created: new Date().toISOString(),
            txHash: '0x' + generateRandomHex(64) // Simulated transaction hash
        };
        
        gifts.push(newGift);
        
        chrome.storage.local.set({ gifts: gifts }, () => {
            console.log('Gift scheduled:', newGift);
            
            // Create browser notification for scheduled gift
            if (chrome.notifications) {
                chrome.notifications.create(`gift_${newGift.id}`, {
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: '🎁 Gift Scheduled!',
                    message: `You scheduled ${newGift.amount} for ${giftData.recipientName || 'a friend'}`,
                    priority: 1
                });
            }
            
            // Schedule reminder (in real app would use alarms API)
            scheduleGiftReminder(newGift);
            
            sendResponse({
                success: true,
                gift: newGift,
                message: 'Gift scheduled successfully!'
            });
        });
    });
}

// Handle checking available gifts
function handleCheckGifts(sendResponse) {
    chrome.storage.local.get(['gifts'], (result) => {
        const gifts = result.gifts || [];
        
        // Filter gifts that are unlocked or unlockable
        const now = new Date();
        const checkableGifts = gifts.map(gift => {
            const unlockDate = new Date(gift.unlockDate);
            return {
                ...gift,
                canUnlock: unlockDate <= now && gift.status === 'scheduled',
                daysUntilUnlock: Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24))
            };
        });
        
        sendResponse({
            success: true,
            gifts: checkableGifts,
            total: checkableGifts.length,
            unlocked: checkableGifts.filter(g => g.status === 'unlocked').length
        });
    });
}

// Handle unlocking a gift
function handleUnlockGift(giftId, sendResponse) {
    chrome.storage.local.get(['gifts', 'enigma_wallet'], (result) => {
        const gifts = result.gifts || [];
        const wallet = result.enigma_wallet;
        
        const giftIndex = gifts.findIndex(g => g.id === giftId);
        
        if (giftIndex === -1) {
            sendResponse({
                success: false,
                message: 'Gift not found'
            });
            return;
        }
        
        const gift = gifts[giftIndex];
        const unlockDate = new Date(gift.unlockDate);
        const now = new Date();
        
        if (unlockDate > now) {
            sendResponse({
                success: false,
                message: `Gift is time-locked until ${gift.unlockDate}`,
                daysLeft: Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24))
            });
            return;
        }
        
        // Check puzzle if exists
        if (gift.puzzle && gift.answer) {
            // In real app, would check puzzle answer here
            // For demo, always succeed
            console.log('Puzzle gift unlocked:', gift.puzzle);
        }
        
        // Update gift status
        gifts[giftIndex].status = 'unlocked';
        gifts[giftIndex].unlockedAt = new Date().toISOString();
        
        // Update wallet balance (demo)
        if (wallet) {
            const amount = parseFloat(gift.amount) || 0.001;
            wallet.balance.enigma = (parseFloat(wallet.balance.enigma) + amount).toFixed(4);
            
            // Add transaction record
            wallet.transactions.push({
                type: 'gift_unlocked',
                amount: amount,
                asset: 'ENIGMA',
                from: 'Gift Contract',
                to: wallet.address,
                timestamp: new Date().toISOString(),
                hash: '0x' + generateRandomHex(64)
            });
            
            chrome.storage.local.set({ 
                gifts: gifts,
                enigma_wallet: wallet 
            }, () => {
                // Send notification
                createNotification({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: '🎉 Gift Unlocked!',
                    message: `You unlocked ${gift.amount} ENIGMA!`,
                    priority: 2
                });
                
                sendResponse({
                    success: true,
                    gift: gifts[giftIndex],
                    newBalance: wallet.balance.enigma,
                    message: 'Gift successfully unlocked!'
                });
            });
        } else {
            sendResponse({
                success: false,
                message: 'No wallet found to receive gift'
            });
        }
    });
}

// Handle security status request
function handleGetSecurityStatus(sendResponse) {
    chrome.storage.local.get(['security_warnings', 'demo_mode'], (result) => {
        const warnings = result.security_warnings || 0;
        const demoMode = result.demo_mode !== false;
        
        sendResponse({
            demo_mode: demoMode,
            security_warnings: warnings,
            security_level: warnings > 5 ? 'high' : warnings > 2 ? 'medium' : 'low',
            recommendations: demoMode ? [
                '⚠️ DEMO MODE: Never use for real funds',
                '🔐 Real wallets require hardware security',
                '📝 Always backup recovery phrases',
                '🎯 Use testnets for development'
            ] : [
                '✅ Production mode enabled',
                '🔒 Consider hardware wallet integration',
                '📊 Regular security audits recommended',
                '👥 Multi-sig for large holdings'
            ]
        });
    });
}

// Handle transaction simulation
function handleSimulateTransaction(txData, sendResponse) {
    // Simulate blockchain transaction
    const simulatedTx = {
        hash: '0x' + generateRandomHex(64),
        status: 'pending',
        blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
        timestamp: new Date().toISOString(),
        from: txData.from,
        to: txData.to,
        value: txData.value,
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        confirmations: 0
    };
    
    // Simulate confirmation process
    setTimeout(() => {
        simulatedTx.status = 'confirmed';
        simulatedTx.confirmations = 12;
        
        // Update in storage if it's a gift
        if (txData.type === 'gift') {
            chrome.storage.local.get(['gifts'], (result) => {
                const gifts = result.gifts || [];
                const gift = gifts.find(g => g.txHash === simulatedTx.hash);
                if (gift) {
                    gift.confirmed = true;
                    chrome.storage.local.set({ gifts: gifts });
                }
            });
        }
        
        // Send notification
        createNotification({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '✅ Transaction Confirmed',
            message: `Transaction to ${txData.to.substring(0, 8)}... confirmed`,
            priority: 1
        });
    }, 3000);
    
    sendResponse({
        success: true,
        transaction: simulatedTx,
        message: 'Transaction simulated (demo mode)'
    });
}

// Helper: Generate random hex string
function generateRandomHex(length) {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Helper: Generate demo mnemonic
function generateDemoMnemonic() {
    const words = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
        'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
        'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];
    
    let mnemonic = [];
    for (let i = 0; i < 12; i++) {
        mnemonic.push(words[Math.floor(Math.random() * words.length)]);
    }
    return mnemonic.join(' ');
}

// Helper: Schedule gift reminder
function scheduleGiftReminder(gift) {
    const unlockDate = new Date(gift.unlockDate);
    const now = new Date();
    const timeUntilUnlock = unlockDate - now;
    
    if (timeUntilUnlock > 0) {
        // Schedule reminder 1 hour before unlock
        const reminderTime = timeUntilUnlock - (60 * 60 * 1000);
        
        if (reminderTime > 0) {
            setTimeout(() => {
                createNotification({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: '⏰ Gift Unlocks Soon!',
                    message: `Your gift of ${gift.amount} unlocks in 1 hour!`,
                    priority: 1
                });
            }, reminderTime);
        }
        
        // Schedule unlock notification
        setTimeout(() => {
            createNotification({
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: '🎁 Gift Ready to Unlock!',
                message: `Your gift of ${gift.amount} is now ready!`,
                priority: 2
            });
        }, timeUntilUnlock);
    }
}

// Helper: Create notification
function createNotification(options) {
    if (chrome.notifications) {
        const notificationId = `enigma_${Date.now()}`;
        chrome.notifications.create(notificationId, {
            type: options.type || 'basic',
            iconUrl: options.iconUrl || 'icons/icon128.png',
            title: options.title || 'ENIGMA Wallet',
            message: options.message || 'Notification',
            priority: options.priority || 0,
            requireInteraction: options.priority > 1
        });
        
        // Auto-clear after 10 seconds for low priority
        if (options.priority < 2) {
            setTimeout(() => {
                chrome.notifications.clear(notificationId);
            }, 10000);
        }
    }
}

// Helper: Log security event
function logSecurityEvent(event, data) {
    console.log(`🔒 Security Event: ${event}`, data);
    
    chrome.storage.local.get(['security_warnings'], (result) => {
        const warnings = (result.security_warnings || 0) + 1;
        chrome.storage.local.set({ security_warnings: warnings });
    });
}

// Handle alarms (for scheduled tasks)
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm.name);
    
    if (alarm.name.startsWith('gift_check_')) {
        checkScheduledGifts();
    }
});

// Check for gifts that need attention
function checkScheduledGifts() {
    chrome.storage.local.get(['gifts'], (result) => {
        const gifts = result.gifts || [];
        const now = new Date();
        
        gifts.forEach(gift => {
            if (gift.status === 'scheduled') {
                const unlockDate = new Date(gift.unlockDate);
                if (unlockDate <= now) {
                    createNotification({
                        type: 'basic',
                        iconUrl: 'icons/icon128.png',
                        title: '🎁 Gift Ready!',
                        message: `A scheduled gift is ready to unlock!`,
                        priority: 1
                    });
                }
            }
        });
    });
}

// Periodically check gifts (every hour)
chrome.alarms.create('gift_check_hourly', { periodInMinutes: 60 });

// Keep service worker alive
setInterval(() => {
    console.log('ENIGMA background service worker alive');
}, 30000);

// Initialize
console.log('🎭 ENIGMA Wallet Background Service ready');
console.log('==========================================');
console.log('Features:');
console.log('- Wallet management');
console.log('- Gift scheduling & unlocking');
console.log('- Transaction simulation');
console.log('- Security monitoring');
console.log('- Browser notifications');
console.log('==========================================');
console.log('⚠️ DEMO MODE: Educational purposes only');
console.log('⚠️ NEVER use for real cryptocurrency');
