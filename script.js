// ENIGMA STARTER - SIMPLE VERSION (No Manifest Needed)

class EnigmaWallet {
  constructor() {
    this.connected = false;
    this.balance = "0.0000";
    this.address = "";
  }

  async connectWallet() {
    const box = document.querySelector('.gift-box');
    const status = document.getElementById('status');
    
    // Animate box
    box.style.transform = 'scale(0.9) rotate(10deg)';
    status.innerHTML = '🔮 Summoning the Enigma...';
    
    // Check if MetaMask exists
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        this.address = accounts[0];
        this.connected = true;
        
        // Get balance
        await this.getBalance();
        
        // Success!
        status.innerHTML = '🎉 Enigma Unlocked!';
        box.style.transform = 'scale(1.1)';
        box.style.filter = 'drop-shadow(0 0 25px gold)';
        
        // Show treasure after delay
        setTimeout(() => this.showTreasure(), 1000);
        
      } catch (error) {
        // User denied connection
        status.innerHTML = '🔒 The treasure remains sealed...';
        box.style.animation = 'shake 0.5s';
        setTimeout(() => {
          box.style.transform = 'scale(1)';
          box.style.animation = '';
        }, 500);
      }
    } else {
      // No MetaMask - Use demo mode
      this.demoMode();
    }
  }
  
  async getBalance() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(this.address);
      this.balance = ethers.utils.formatEther(balance).substring(0, 6);
    } catch (err) {
      this.balance = "1.2345"; // Fallback
    }
  }
  
  demoMode() {
    const box = document.querySelector('.gift-box');
    const status = document.getElementById('status');
    
    status.innerHTML = '👁️ Using Enigma Vision (Demo)...';
    
    // Simulate connection
    setTimeout(() => {
      this.address = "0xENIGMA" + Date.now().toString().slice(-8);
      this.balance = "3.1415";
      this.connected = true;
      
      status.innerHTML = '✨ Enigma Vision Activated!';
      box.style.transform = 'scale(1.15)';
      box.style.filter = 'drop-shadow(0 0 20px #8a2be2)';
      
      setTimeout(() => this.showTreasure(), 800);
    }, 1500);
  }
  
  showTreasure() {
    const box = document.querySelector('.gift-box');
    const display = document.getElementById('treasure');
    
    // Open box animation
    box.style.transform = 'rotateY(180deg) scale(1.3)';
    box.style.opacity = '0.6';
    
    // Create treasure display
    display.innerHTML = `
      <div class="treasure-card">
        <div class="treasure-header">
          <span class="treasure-icon">💎</span>
          <h3>ENIGMA TREASURE</h3>
        </div>
        
        <div class="treasure-balance">
          <span class="amount">${this.balance}</span>
          <span class="currency">ETH</span>
        </div>
        
        <div class="treasure-address">
          <small>Sigil:</small>
          <code>${this.formatAddress(this.address)}</code>
        </div>
        
        <div class="treasure-quote">
          <em>"Not all treasure is silver and gold, mate."</em>
          <br>
          <small>- Captain Jack Sparrow</small>
        </div>
        
        <button class="action-btn" onclick="enigma.sendGift()">
          🎁 Wrap a Gift
        </button>
        
        <button class="action-btn secondary" onclick="enigma.disconnect()">
          🔒 Seal Enigma
        </button>
      </div>
    `;
    
    display.style.display = 'block';
    setTimeout(() => {
      display.style.opacity = '1';
    }, 50);
  }
  
  formatAddress(addr) {
    if (!addr) return "ENIGMA•••ZONE";
    return addr.slice(0, 8) + '...' + addr.slice(-6);
  }
  
  sendGift() {
    alert('🎁 Gift Wrapping Protocol: Coming in Next Update!\n\nYou can now connect to real wallet!');
  }
  
  disconnect() {
    location.reload(); // Simple refresh
  }
}

// Initialize when page loads
let enigma;
document.addEventListener('DOMContentLoaded', () => {
  enigma = new EnigmaWallet();
  
  // Make it global for button clicks
  window.enigma = enigma;
  
  // Gift box click
  document.querySelector('.gift-box').addEventListener('click', () => {
    if (!enigma.connected) {
      enigma.connectWallet();
    } else {
      enigma.showTreasure();
    }
  });
});
