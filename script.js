// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navMenu.classList.remove('active');
        }
    });
});

// Matrix rain animation
function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters to use (numbers and some letters)
    const chars = '0123456789MEM114514💎🚀🔥🌙';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
    }
    
    function draw() {
        // Semi-transparent background for trail effect
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // Fade effect
            const opacity = Math.min(1, (y / canvas.height) * 2);
            ctx.globalAlpha = opacity;
            
            ctx.fillText(text, x, y);
            
            // Reset drop to top randomly
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    
    draw();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}



// Update mint address from URL parameter or localStorage
function updateMintAddress() {
    const urlParams = new URLSearchParams(window.location.search);
    const mintAddress = urlParams.get('mint') || localStorage.getItem('tokenMintAddress');
    const isLocked = localStorage.getItem('tokenAddressLocked') === 'true';
    
    const mintAddressInput = document.getElementById('mintAddress');
    const tokenAddressInput = document.getElementById('tokenAddress');
    
    if (mintAddress) {
        if (mintAddressInput) {
            mintAddressInput.value = mintAddress;
            mintAddressInput.title = mintAddress;
            
            // Lock if already saved
            if (isLocked) {
                mintAddressInput.readOnly = true;
                mintAddressInput.style.cursor = 'not-allowed';
                mintAddressInput.style.opacity = '0.8';
            }
        }
        if (tokenAddressInput) {
            tokenAddressInput.value = mintAddress;
            
            // Lock if already saved
            if (isLocked) {
                tokenAddressInput.readOnly = true;
                tokenAddressInput.style.cursor = 'not-allowed';
                tokenAddressInput.style.opacity = '0.8';
            }
        }
        localStorage.setItem('tokenMintAddress', mintAddress);
    } else {
        if (mintAddressInput) {
            mintAddressInput.value = '';
            mintAddressInput.title = '';
        }
    }
}

// Save token address from mint address input
const mintAddressInput = document.getElementById('mintAddress');
if (mintAddressInput) {
    mintAddressInput.addEventListener('input', (e) => {
        const address = e.target.value.trim();
        if (address && address.length > 20) {
            localStorage.setItem('tokenMintAddress', address);
            updateLinksWithToken();
            
            // Update swap widget input
            const tokenAddressInput = document.getElementById('tokenAddress');
            if (tokenAddressInput) {
                tokenAddressInput.value = address;
            }
        }
    });
    
    // Lock on blur only if address is valid and was saved before
    mintAddressInput.addEventListener('blur', (e) => {
        const address = e.target.value.trim();
        const wasLocked = localStorage.getItem('tokenAddressLocked') === 'true';
        
        if (address && address.length > 20 && wasLocked) {
            // Lock if it was locked before
            mintAddressInput.readOnly = true;
            mintAddressInput.style.cursor = 'not-allowed';
            mintAddressInput.style.opacity = '0.8';
        } else if (address && address.length > 20) {
            // First time save - lock it
            localStorage.setItem('tokenAddressLocked', 'true');
            mintAddressInput.readOnly = true;
            mintAddressInput.style.cursor = 'not-allowed';
            mintAddressInput.style.opacity = '0.8';
            
            const tokenAddressInput = document.getElementById('tokenAddress');
            if (tokenAddressInput) {
                tokenAddressInput.readOnly = true;
                tokenAddressInput.style.cursor = 'not-allowed';
                tokenAddressInput.style.opacity = '0.8';
            }
        }
    });
    
    // Double click to unlock (for admin)
    mintAddressInput.addEventListener('dblclick', (e) => {
        if (mintAddressInput.readOnly) {
            mintAddressInput.readOnly = false;
            mintAddressInput.style.cursor = 'text';
            mintAddressInput.style.opacity = '1';
            mintAddressInput.focus();
            localStorage.removeItem('tokenAddressLocked');
        }
    });
}

// Save token address from swap widget input
const tokenAddressInput = document.getElementById('tokenAddress');
if (tokenAddressInput) {
    tokenAddressInput.addEventListener('input', (e) => {
        const address = e.target.value.trim();
        if (address && address.length > 20) {
            localStorage.setItem('tokenMintAddress', address);
            updateMintAddress();
            updateLinksWithToken();
        }
    });
    
    // Lock on blur only if address is valid and was saved before
    tokenAddressInput.addEventListener('blur', (e) => {
        const address = e.target.value.trim();
        const wasLocked = localStorage.getItem('tokenAddressLocked') === 'true';
        
        if (address && address.length > 20 && wasLocked) {
            // Lock if it was locked before
            tokenAddressInput.readOnly = true;
            tokenAddressInput.style.cursor = 'not-allowed';
            tokenAddressInput.style.opacity = '0.8';
        } else if (address && address.length > 20) {
            // First time save - lock it
            localStorage.setItem('tokenAddressLocked', 'true');
            tokenAddressInput.readOnly = true;
            tokenAddressInput.style.cursor = 'not-allowed';
            tokenAddressInput.style.opacity = '0.8';
            
            const mintAddressInput = document.getElementById('mintAddress');
            if (mintAddressInput) {
                mintAddressInput.readOnly = true;
                mintAddressInput.style.cursor = 'not-allowed';
                mintAddressInput.style.opacity = '0.8';
            }
        }
    });
    
    // Double click to unlock (for admin)
    tokenAddressInput.addEventListener('dblclick', (e) => {
        if (tokenAddressInput.readOnly) {
            tokenAddressInput.readOnly = false;
            tokenAddressInput.style.cursor = 'text';
            tokenAddressInput.style.opacity = '1';
            tokenAddressInput.focus();
            localStorage.removeItem('tokenAddressLocked');
            
            const mintAddressInput = document.getElementById('mintAddress');
            if (mintAddressInput) {
                mintAddressInput.readOnly = false;
                mintAddressInput.style.cursor = 'text';
                mintAddressInput.style.opacity = '1';
            }
        }
    });
}

// Solana wallet connection
async function connectWallet() {
    try {
        // Check if Phantom wallet is installed
        if (!window.solana || !window.solana.isPhantom) {
            alert('Please install Phantom wallet: https://phantom.app/');
            window.open('https://phantom.app/', '_blank');
            return;
        }

        const walletBtn = document.getElementById('walletBtn');
        
        // Request connection
        const response = await window.solana.connect();
        console.log('Connected to wallet:', response.publicKey.toString());
        
        walletBtn.textContent = `Connected: ${response.publicKey.toString().substring(0, 6)}...`;
        walletBtn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
        
        // Redirect to Jupiter with token address
        const tokenAddress = document.getElementById('tokenAddress').value || localStorage.getItem('tokenMintAddress');
        if (tokenAddress) {
            const jupiterUrl = `https://jup.ag/swap/SOL-${tokenAddress}`;
            window.open(jupiterUrl, '_blank');
        }
    } catch (err) {
        console.error('Error connecting wallet:', err);
        alert('Error connecting wallet. Make sure Phantom is installed and unlocked.');
    }
}

// Check if wallet is already connected
if (window.solana && window.solana.isPhantom) {
    window.solana.on('connect', () => {
        const walletBtn = document.getElementById('walletBtn');
        if (walletBtn) {
            walletBtn.textContent = 'Wallet connected';
            walletBtn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    updateMintAddress();
    initMatrix(); // Initialize matrix animation
    
    // Observe elements for animation
    document.querySelectorAll('.concept-card, .mission-item, .news-card').forEach(el => {
        observer.observe(el);
    });
    
});

// Update button links with token address
function updateLinksWithToken() {
    const tokenAddress = localStorage.getItem('tokenMintAddress');
    if (tokenAddress) {
        // Update Jupiter link
        const jupiterLinks = document.querySelectorAll('a[href*="jup.ag"]');
        jupiterLinks.forEach(link => {
            link.href = `https://jup.ag/swap/SOL-${tokenAddress}`;
        });
        
        // Update DexScreener link
        const dexScreenerLinks = document.querySelectorAll('a[href*="dexscreener.com"]');
        dexScreenerLinks.forEach(link => {
            link.href = `https://dexscreener.com/solana/${tokenAddress}`;
        });
        
        // Update Pump.fun link (if needed)
        const pumpLinks = document.querySelectorAll('a[href*="pump.fun"]');
        pumpLinks.forEach(link => {
            // Pump.fun uses different URL structure
            link.href = `https://pump.fun/${tokenAddress}`;
        });
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateLinksWithToken);

// Add click handler for swap input to update links
if (tokenAddressInput) {
    tokenAddressInput.addEventListener('blur', () => {
        updateLinksWithToken();
    });
}
