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



// Load token address from JSON file (global storage) - ONLY source
async function loadGlobalTokenAddress() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/trv666trv-creator/automatic-engine/main/token-address.json');
        const data = await response.json();
        return data.mintAddress || '';
    } catch (error) {
        console.log('Could not load global address from GitHub');
        return '';
    }
}

// Update mint address from global JSON file ONLY
async function updateMintAddress() {
    // Only read from JSON file (global storage)
    const mintAddress = await loadGlobalTokenAddress();
    
    const mintAddressInput = document.getElementById('mintAddress');
    const tokenAddressInput = document.getElementById('tokenAddress');
    
    if (mintAddress) {
        if (mintAddressInput) {
            mintAddressInput.value = mintAddress;
            mintAddressInput.title = mintAddress;
            mintAddressInput.readOnly = true;
            mintAddressInput.style.cursor = 'default';
        }
        if (tokenAddressInput) {
            tokenAddressInput.value = mintAddress;
            tokenAddressInput.readOnly = true;
            tokenAddressInput.style.cursor = 'default';
        }
        // Update links immediately
        updateLinksWithToken(mintAddress);
    } else {
        if (mintAddressInput) {
            mintAddressInput.value = '';
            mintAddressInput.title = '';
            mintAddressInput.readOnly = true;
            mintAddressInput.placeholder = 'Token address will appear here...';
        }
        if (tokenAddressInput) {
            tokenAddressInput.value = '';
            tokenAddressInput.readOnly = true;
            tokenAddressInput.placeholder = 'Token address will appear here...';
        }
    }
}

// Address can ONLY be changed via token-address.json file on GitHub
// Input fields are read-only

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
        const tokenAddressInput = document.getElementById('tokenAddress');
        const tokenAddress = tokenAddressInput ? tokenAddressInput.value.trim() : '';
        if (tokenAddress && tokenAddress.length > 20) {
            const jupiterUrl = `https://jup.ag/swap/SOL-${tokenAddress}`;
            window.open(jupiterUrl, '_blank');
        } else {
            alert('Token address is not set. Please wait for the address to load from token-address.json');
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
document.addEventListener('DOMContentLoaded', async () => {
    await updateMintAddress(); // Load address from JSON file
    initMatrix(); // Initialize matrix animation
    
    // Observe elements for animation
    document.querySelectorAll('.concept-card, .mission-item, .news-card').forEach(el => {
        observer.observe(el);
    });
    
    // Refresh address every 30 seconds to check for updates
    setInterval(async () => {
        await updateMintAddress();
    }, 30000);
});

// Update button links with token address
function updateLinksWithToken(tokenAddress) {
    // Get address from parameter or from input field
    if (!tokenAddress) {
        const mintAddressInput = document.getElementById('mintAddress');
        tokenAddress = mintAddressInput ? mintAddressInput.value.trim() : '';
    }
    
    if (tokenAddress && tokenAddress.length > 20) {
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
        
        // Update Pump.fun link
        const pumpLinks = document.querySelectorAll('a[href*="pump.fun"]');
        pumpLinks.forEach(link => {
            link.href = `https://pump.fun/${tokenAddress}`;
        });
    }
}

// Links are updated automatically when updateMintAddress() runs
