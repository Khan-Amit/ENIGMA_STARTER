// content.js - ENIGMA Wallet content script
console.log('🎭 ENIGMA Wallet content script loaded');

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enigma_icon_clicked') {
    console.log('ENIGMA icon clicked on page:', window.location.href);
    
    // Show a small notification on the page
    showPageNotification('🎁 ENIGMA Wallet is active!');
  }
  
  sendResponse({ received: true });
});

// Show notification on web page
function showPageNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(90deg, #0f2027, #203a43);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid #00ffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 18px;">🎁</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Check if page has crypto content
function checkPageForCrypto() {
  const pageText = document.body.innerText.toLowerCase();
  const cryptoTerms = ['bitcoin', 'ethereum', 'crypto', 'wallet', 'blockchain', 'nft'];
  
  const found = cryptoTerms.some(term => pageText.includes(term));
  
  if (found) {
    console.log('ENIGMA: Crypto-related page detected');
    
    // Offer to interact with ENIGMA
    chrome.runtime.sendMessage({
      action: 'crypto_page_detected',
      url: window.location.href
    });
  }
}

// Run check after page loads
window.addEventListener('load', () => {
  setTimeout(checkPageForCrypto, 1000);
});

console.log('ENIGMA content script ready to gift! 🎁');
